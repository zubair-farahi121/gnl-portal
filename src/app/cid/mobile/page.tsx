"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { CidScreen } from "@/components/cid/CidScreen";
import { useDemoState } from "@/lib/demo-state";
import { getCidCopy } from "@/lib/data/cid";
import { PHONE_PATH_COPY } from "@/lib/data/phone-path";
import { DEFAULT_SERVICE_ID, SERVICES, cidRoutes, getService, type ServiceId } from "@/lib/data/service-config";
import { isServiceId, startHandoff } from "@/lib/remote-sync";

/*
 * /cid/mobile/ — THE PHONE's side of the IDV hand-off. ADDED 2026-09-30 (the
 * phone path, docs/PHONE_PATH.md). One prerendered route that reads its
 * query in the browser, so it is static-export safe. Two uses:
 *
 * ?room=<room>&service=<serviceId> — the hand-off QR's target. Not a screen,
 * like /wallet/start/:
 *   1. joins the laptop's room and tells it the phone has started
 *      (the laptop's line becomes "Continue on your phone…");
 *   2. ARMS THE SERVICE the way the laptop's own wizard would have by the time
 *      it reached "Continue on a smartphone": `in_progress` (never demoting an
 *      onboarded service), step `handoff`, method `gnl_idv`, and for a service
 *      with the "Other verification" step (Flow B) its acknowledgement — the
 *      same patch OtherVerificationScreen writes;
 *   3. REPLACES itself with that service's CertifiO ID Terms of use, so Back
 *      never lands here again.
 * The phone then runs the normal CID screens (terms → biometric → liveness →
 * country → document → capture → upload → verified). Unknown or missing
 * `service` falls back to Flow A; a bad or expired room just means the phone
 * runs the verification on its own — the path never dead-ends.
 *
 * ?done=1&service=<serviceId> — the PHONE's last screen, reached from CID
 * verified's Continue on a hand-off tab: "You can return to your computer",
 * drawn inside the same CidScreen chrome as CID verified (no new visual
 * language: its 32px bold title and 14px #5f6368 body, verbatim classes).
 */
export default function CidMobilePage() {
  const router = useRouter();
  const { ready, service, patchService } = useDemoState();
  const started = useRef(false);
  const [done, setDone] = useState<ServiceId | null>(null);

  useEffect(() => {
    if (!ready || started.current) return;
    started.current = true;
    const params = new URLSearchParams(window.location.search);
    const svc = params.get("service");
    const id = isServiceId(svc) ? svc : DEFAULT_SERVICE_ID;
    if (params.get("done") === "1") {
      setDone(id);
      return;
    }
    const current = service(id);
    patchService(id, {
      ...(current.status === "not_started" ? { status: "in_progress" as const } : {}),
      step: "handoff",
      method: "gnl_idv",
      ...(SERVICES[id].otherVerificationStep ? { otherVerificationConfirmed: true } : {}),
    });
    void startHandoff(params.get("room"), id).finally(() => router.replace(cidRoutes(id).terms));
    // Run once per visit; `service` / `patchService` change identity on every store write.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, router]);

  if (done) {
    const cfg = getService(done);
    return (
      <CidScreen service={cfg} mainNodeId="6062:22542" subStep={getCidCopy(cfg).verified.subStep}>
        <div className="flex w-full shrink-0 flex-col items-start gap-[16px] py-[24px] md:py-0" data-phone-done="true">
          <h1 className="w-full shrink-0 text-[32px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word]">
            {PHONE_PATH_COPY.phoneDoneTitle}
          </h1>
          <p className="w-full shrink-0 text-[14px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]">
            {PHONE_PATH_COPY.phoneDoneBody}
          </p>
        </div>
      </CidScreen>
    );
  }

  return (
    <div className="gnl-desktop-shell">
      <main className="w-full" role="status" aria-live="polite">
        <p className="sr-only">{PHONE_PATH_COPY.handoffOpening}</p>
      </main>
    </div>
  );
}
