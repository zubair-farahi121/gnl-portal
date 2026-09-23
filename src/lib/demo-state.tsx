"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { IdvMethod, ServiceId } from "@/lib/data/service-config";

/* ====================================================================
 * THE DEMO STORE — `gnl-demo:v1` in localStorage.
 *
 * BUILD_BRIEF.md §7.5 and §12.2. Replaces the single boolean this module used
 * to hold (`gnl-demo-verified`, a `"1"` in **sessionStorage**), which
 * DEMO_AUDIT.md X-04 recorded as "substantially missing": one flag, one
 * service, gone on browser restart, and the Trusted state actually carried in
 * a `?verified=1` query param that showed on stage.
 *
 * Shape, per §12.2 verbatim:
 *   status  not_started -> in_progress (with `step`) -> verified -> onboarded
 *   plus    termsAcceptedAt, method, idvSessionId, otherVerificationConfirmed,
 *           verifiedAt
 * keyed PER SERVICE, so Flow B gets its own record for free and the two
 * journeys cannot overwrite each other on stage.
 *
 * ====================================================================
 * HYDRATION — READ THIS BEFORE ADDING A READER.
 *
 * `src/app/layout.tsx` deliberately carries NO `suppressHydrationWarning`, and
 * says so: the scale script that needed it is gone, so a genuine hydration bug
 * anywhere in the tree is supposed to surface. This module must not be that
 * bug, and one has already been reported here from exactly this cause.
 *
 * The rule: **nothing read from localStorage may change server-rendered
 * markup.** So the state starts at `EMPTY_STORE` — the same value the server
 * renders — and the first read happens in an effect, i.e. AFTER mount and
 * after React has matched the server HTML. `ready` is false for that first
 * paint and every consumer must render the `not_started` view then, which is
 * also the correct first paint for a visitor who has never run the demo.
 *
 * Do not "optimise" this into a lazy `useState(() => read())`. That runs during
 * render, on the client only, and is precisely the mismatch this file avoids.
 * ====================================================================
 *
 * ====================================================================
 * CROSS-WINDOW SYNC — THE `storage` EVENT, AND NOTHING ELSE.
 *
 * §7.5 asks for `BroadcastChannel` + `storage`. DEMO_AUDIT.md §7 item 4 argued
 * the channel is redundant — `storage` already fires in every OTHER same-origin
 * window when one of them writes, which is the only sync this demo performs —
 * and the user accepted that, cutting all P1 work including `BroadcastChannel`.
 * The listener below is the whole of it.
 *
 * `storage` does NOT fire in the window that wrote, which is correct here:
 * that window already has the new value in React state.
 *
 * `e.key === null` is a `localStorage.clear()` — treated as a change, because
 * that is what `/reset` in another window looks like from here.
 * ==================================================================== */

export const STORE_KEY = "gnl-demo:v1";

/** §12.2, verbatim. */
export type OnboardingStatus =
  | "not_started"
  | "in_progress"
  | "verified"
  | "onboarded";

/**
 * Where in the wizard an `in_progress` service is. Free-form in §12.2; these
 * are the demo's own route-shaped names so a reader can map a value to a
 * screen without a lookup table.
 */
export type OnboardingStep =
  | "summary"
  | "terms"
  | "confirm-details"
  | "method"
  | "handoff"
  | "idv"
  | "processing"
  | "confirmed"
  | "ready";

export type ServiceState = {
  status: OnboardingStatus;
  /** Only meaningful while `status === "in_progress"`. */
  step?: OnboardingStep;
  /** ISO timestamp written when the Terms checkbox is accepted (NL-05). */
  termsAcceptedAt?: string;
  /** Which verification method was chosen on NL-07 / PP-07. */
  method?: IdvMethod;
  /** The CertifiO ID session id (§12.3). Recorded, not used to drive routing. */
  idvSessionId?: string;
  /** Flow B's PP-08 "Other verification" acknowledgement. */
  otherVerificationConfirmed?: boolean;
  /** ISO timestamp written when the IDV result comes back VERIFIED. */
  verifiedAt?: string;
};

export type DemoStore = {
  /** Bumping this invalidates old stores rather than half-reading them. */
  v: 1;
  services: Partial<Record<ServiceId, ServiceState>>;
  /**
   * ONE-SHOT: the service whose `/auth/loading/` screen is allowed to
   * auto-advance (BUILD_BRIEF.md §8.3).
   *
   * It exists so the advance can fire on the way FORWARD and never on the way
   * BACK. See `takePendingAdvance` and the long note on
   * src/app/auth/loading/page.tsx.
   */
  pendingAdvance?: ServiceId;
};

const EMPTY_SERVICE: ServiceState = { status: "not_started" };
const EMPTY_STORE: DemoStore = { v: 1, services: {} };

/**
 * Read the store, tolerating every way it can be unreadable: private mode
 * (throws), absent (null), corrupt (throws), or written by an older version of
 * the demo (`v` mismatch). All four answer `EMPTY_STORE`, which is the same
 * value the server rendered.
 */
function readStore(): DemoStore {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return EMPTY_STORE;
    const parsed = JSON.parse(raw) as DemoStore;
    if (!parsed || parsed.v !== 1 || typeof parsed.services !== "object") {
      return EMPTY_STORE;
    }
    return { ...EMPTY_STORE, ...parsed, services: parsed.services ?? {} };
  } catch {
    return EMPTY_STORE;
  }
}

function writeStore(next: DemoStore) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  } catch {
    /* private mode — the demo still runs, it just stops persisting */
  }
}

type DemoStateApi = {
  /**
   * `false` until the effect below has read localStorage. Everything rendered
   * while it is false must be the `not_started` view — see the hydration note.
   */
  ready: boolean;
  /** Never undefined: an unknown service reads as `not_started`. */
  service: (id: ServiceId) => ServiceState;
  /** Shallow-merge a patch into one service's record. */
  patchService: (id: ServiceId, patch: Partial<ServiceState>) => void;
  /** §7.4 Cancel: back to not-started, unless the service is already onboarded. */
  cancelOnboarding: (id: ServiceId) => void;
  /** NL-20 Continue — the IDV result came back VERIFIED. Arms the one-shot advance. */
  markVerified: (id: ServiceId, idvSessionId?: string) => void;
  /** NL-23 on open — §8.3 "mark the service onboarded". */
  markOnboarded: (id: ServiceId) => void;
  /**
   * Reads AND clears `pendingAdvance`. Returns true at most once per arming,
   * which is what keeps the NL-21 auto-advance off the Back path.
   */
  takePendingAdvance: (id: ServiceId) => boolean;
  /** "Reset demo" / `/reset` — the ONLY thing that clears the store (§7.1). */
  resetAll: () => void;
};

const Ctx = createContext<DemoStateApi | null>(null);

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<DemoStore>(EMPTY_STORE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStore(readStore());
    setReady(true);

    /* Cross-window sync. ~15 lines, no channel — see the note at the top. */
    const onStorage = (e: StorageEvent) => {
      if (e.key !== null && e.key !== STORE_KEY) return;
      setStore(readStore());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /**
   * Every mutation goes through here: it reads the CURRENT persisted value
   * rather than the React state it is closing over, so two writes in one tick
   * (and a write racing a `storage` event from another window) cannot drop
   * each other's fields.
   */
  const update = useCallback((fn: (prev: DemoStore) => DemoStore) => {
    setStore((prev) => {
      const base = typeof window === "undefined" ? prev : readStore();
      const next = fn(base);
      writeStore(next);
      return next;
    });
  }, []);

  const api = useMemo<DemoStateApi>(() => {
    const patchService: DemoStateApi["patchService"] = (id, patch) =>
      update((prev) => ({
        ...prev,
        services: {
          ...prev.services,
          [id]: { ...EMPTY_SERVICE, ...prev.services[id], ...patch },
        },
      }));

    return {
      ready,
      service: (id) => store.services[id] ?? EMPTY_SERVICE,
      patchService,

      cancelOnboarding: (id) =>
        update((prev) => {
          const current = prev.services[id] ?? EMPTY_SERVICE;
          /* §7.4: "onboarding resets to not started unless already onboarded". */
          if (current.status === "onboarded") return prev;
          return { ...prev, services: { ...prev.services, [id]: EMPTY_SERVICE } };
        }),

      markVerified: (id, idvSessionId) =>
        update((prev) => ({
          ...prev,
          /* Arm the one-shot NL-21 advance. Consumed by takePendingAdvance. */
          pendingAdvance: id,
          services: {
            ...prev.services,
            [id]: {
              ...EMPTY_SERVICE,
              ...prev.services[id],
              status: "verified",
              step: "processing",
              verifiedAt: new Date().toISOString(),
              ...(idvSessionId ? { idvSessionId } : {}),
            },
          },
        })),

      markOnboarded: (id) =>
        update((prev) => {
          const current = prev.services[id] ?? EMPTY_SERVICE;
          if (current.status === "onboarded") return prev;
          return {
            ...prev,
            services: {
              ...prev.services,
              [id]: { ...current, status: "onboarded", step: "ready" },
            },
          };
        }),

      takePendingAdvance: (id) => {
        /*
         * Read the PERSISTED value, not React state: the arming write may have
         * happened on the previous screen microseconds ago, and this call has
         * to see it even if a re-render has not landed yet.
         */
        const live = typeof window === "undefined" ? store : readStore();
        if (live.pendingAdvance !== id) return false;
        update((prev) => {
          const { pendingAdvance: _drop, ...rest } = prev;
          void _drop;
          return rest as DemoStore;
        });
        return true;
      },

      resetAll: () => {
        try {
          localStorage.removeItem(STORE_KEY);
        } catch {
          /* ignore */
        }
        setStore(EMPTY_STORE);
      },
    };
  }, [ready, store, update]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useDemoState() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemoState must be used inside DemoStateProvider");
  return v;
}

/**
 * "Confirmation required" until `onboarded`, then "Trusted" — §12.2, last line.
 *
 * A helper rather than a field so there is exactly one definition of the rule
 * and the service page, the dashboard and Flow B cannot drift apart on it.
 */
export function isTrusted(state: ServiceState): boolean {
  return state.status === "onboarded";
}
