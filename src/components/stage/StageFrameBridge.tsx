"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { DEFAULT_SERVICE_ID } from "@/lib/data/service-config";
import { MOBILE_ROUTE } from "@/lib/data/phone-path";
import {
  STAGE_PHONE_HOME,
  isServiceIdValue,
  notePhoneRoute,
  phoneHomeUrl,
  serviceFromPath,
  stageRole,
  watchStage,
} from "@/lib/stage-sync";

/*
 * Renders nothing. Mounted once in the root layout; does anything only
 * inside the IDV presenter stage's PHONE frame (src/lib/stage-sync.ts):
 *
 *   - remembers the CertifiO ID screen the phone is on, so reopening the
 *     stage puts the phone back exactly there;
 *   - sends the phone back to its home screen when the demo is reset (the
 *     record disappears), when the desktop opens a NEW hand-off while the
 *     phone still shows the last run's "You can return to your computer", or
 *     when the desktop's hand-off is for another service.
 *
 * Everywhere else (`stageRole()` is null) the effects return at once.
 */
export function StageFrameBridge() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (stageRole() !== "phone") return;
    notePhoneRoute(`${pathname}${window.location.search}`);
  }, [pathname]);

  useEffect(() => {
    if (stageRole() !== "phone" || pathname === STAGE_PHONE_HOME) return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("service");
    const service = serviceFromPath(pathname) ?? (isServiceIdValue(q) ? q : DEFAULT_SERVICE_ID);
    const onDone = pathname === MOBILE_ROUTE && params.get("done") === "1";
    return watchStage((rec) => {
      /* Reset; a new hand-off after the last run's "done"; or the desktop
         started a hand-off for ANOTHER service — this phone's screens no
         longer belong to anything. */
      if (!rec || (rec.status === "waiting" && onDone) || rec.service !== service) {
        router.replace(phoneHomeUrl(rec?.service ?? service));
      }
    });
  }, [pathname, router]);

  return null;
}
