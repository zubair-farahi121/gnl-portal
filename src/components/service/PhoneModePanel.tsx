"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { APP_ROUTES } from "@/lib/data/service-config";
import { qrMatrix } from "@/lib/qr";
import { phoneModeOn, probeSync, qrBase, setPhoneMode } from "@/lib/remote-sync";

/*
 * The /demo/phone/ panel (docs/PHONE_PATH.md). Presenter-only, styled like
 * the /demo/wallet-stage/ header (grey stage, white card, the stage's dark
 * button), so it adds no visual language to the demo itself.
 *
 *   server absent  -> says how to start it; no switch.
 *   server present -> the address the QR codes will use, a switch for THIS
 *                     browser, and a QR of that address so the presenter can
 *                     check, before the meeting, that the phone reaches the
 *                     laptop (it opens the login page on the phone).
 */
type Probe = { state: "checking" } | { state: "absent" } | { state: "present"; base: string };

const BTN =
  "cursor-pointer rounded-[6px] bg-[#243746] px-[16px] py-[8px] text-[14px] font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004b87]";

export function PhoneModePanel() {
  const [probe, setProbe] = useState<Probe>({ state: "checking" });
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(phoneModeOn());
    let dead = false;
    void probeSync().then((h) => {
      if (!dead) setProbe(h ? { state: "present", base: qrBase(h) } : { state: "absent" });
    });
    return () => {
      dead = true;
    };
  }, []);

  const qr = useMemo(() => (probe.state === "present" ? qrMatrix(`${probe.base}/`) : null), [probe]);
  const insecure =
    probe.state === "present" && /^http:/.test(probe.base) && !/^http:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(probe.base);

  return (
    <div className="box-border flex min-h-[100dvh] w-full flex-col items-center bg-[#e9ecef] px-[16px] py-[32px]">
      <div
        className="box-border flex w-[640px] max-w-full flex-col gap-[16px] rounded-[6px] bg-white p-[32px] text-[16px] leading-[1.5] text-[#5f6368] shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-xs:p-[20px]"
        data-phone-mode-panel={probe.state}
      >
        <p className="text-[14px] font-bold">Presenter — phone mode</p>
        <h1 className="text-[28px] font-bold text-[#212326]">Show the demo on a real phone</h1>

        {probe.state === "checking" && <p role="status">Checking for the demo server…</p>}

        {probe.state === "absent" && (
          <p role="status">
            Phone mode needs the demo server. On this laptop run <code>npm run build</code> and then{" "}
            <code>npm run serve:phone</code>, and open this page again from the address it prints.
          </p>
        )}

        {probe.state === "present" && (
          <>
            <p role="status" data-phone-mode={on ? "on" : "off"}>
              Phone mode is <strong className="text-[#212326]">{on ? "on" : "off"}</strong> in this browser.
              {on
                ? " The wallet QR and “Continue on a smartphone” now show codes a phone can scan."
                : " Turn it on to make the wallet QR and “Continue on a smartphone” work with a real phone."}
            </p>
            <div className="flex flex-wrap items-center gap-[16px]">
              <button
                type="button"
                className={BTN}
                onClick={() => {
                  setPhoneMode(!on);
                  setOn(!on);
                }}
                data-phone-mode-toggle="true"
              >
                {on ? "Turn phone mode off" : "Turn phone mode on"}
              </button>
              <Link href={APP_ROUTES.login} className="font-bold text-[#004b87] underline">
                Start the demo
              </Link>
            </div>
            <p>
              Phones will open: <strong className="break-all text-[#212326]" data-phone-base="true">{probe.base}</strong>
            </p>
            {qr && (
              <div className="flex flex-wrap items-center gap-[16px]">
                <svg
                  viewBox={`-4 -4 ${qr.size + 8} ${qr.size + 8}`}
                  width={160}
                  height={160}
                  shapeRendering="crispEdges"
                  role="img"
                  aria-label="QR code of the demo address, to check the phone can reach this laptop"
                  className="block shrink-0"
                >
                  <rect x={-4} y={-4} width={qr.size + 8} height={qr.size + 8} fill="#ffffff" />
                  <path d={qr.path} fill="#212326" />
                </svg>
                <p className="min-w-[200px] flex-1">
                  Before the meeting, scan this with the phone. If the login page opens, the phone can reach this
                  laptop. If not, check both are on the same Wi-Fi and the laptop firewall allows the port.
                </p>
              </div>
            )}
            {insecure && (
              <p>
                This address is plain <code>http</code>, so the phone will not open its camera: the capture screens show
                a still image instead. That is fine for the demo; for a live camera use HTTPS (see docs/PHONE_PATH.md).
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
