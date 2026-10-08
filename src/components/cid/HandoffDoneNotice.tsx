"use client";

import { useEffect, useState } from "react";

import { PHONE_PATH_COPY } from "@/lib/data/phone-path";
import type { ServiceId } from "@/lib/data/service-config";
import { completeHandoff } from "@/lib/remote-sync";

/*
 * THE PHONE PATH, phone side of CID verified — ADDED 2026-09-30 (docs/PHONE_PATH.md).
 *
 * Renders NOTHING unless this browser tab arrived through the laptop's
 * hand-off QR for this service (/cid/mobile/). Then, on reaching verified,
 * it tells the laptop (`idv.status = "complete"`), and only once the laptop
 * has been told does it show one small line: "Verification complete. You can
 * return to your computer." The laptop's "Continue on a smartphone" screen
 * moves on to the processing step at the same moment, and this screen's
 * Continue ends the phone's part on /cid/mobile/?done=1.
 *
 * On a static build, and on every laptop run, it stays null — the verified
 * screen's markup and its baseline frame are unchanged.
 */
export function HandoffDoneNotice({ serviceId }: { serviceId: ServiceId }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    let dead = false;
    void completeHandoff(serviceId).then((ok) => {
      if (ok && !dead) setDone(true);
    });
    return () => {
      dead = true;
    };
  }, [serviceId]);

  if (!done) return null;
  return (
    <p
      className="flex w-full shrink-0 items-center gap-[8px] rounded-[6px] bg-[#e8f3ee] px-[12px] py-[10px] text-[14px] font-bold leading-[1.5] text-[#146c43] [word-break:break-word]"
      role="status"
      aria-live="polite"
      data-handoff-done="true"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="block shrink-0">
        <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="#146c43" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{PHONE_PATH_COPY.phoneVerified}</span>
    </p>
  );
}
