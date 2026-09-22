/**
 * The demo click-through order. DemoNav uses this for the presenter's
 * arrow-key shortcuts; it is not a substitute for on-screen links, which
 * must reach every step on their own.
 */
export const FLOW = [
  "/",
  "/dashboard/",
  "/services/driver-vehicle/",
  "/services/driver-vehicle/onboard/",
  /*
   * /cid/welcome/ was removed on 2026-09-21. The designer judged the CID
   * Welcome screen redundant and took it out of the flow, so the IDV journey
   * now starts at Terms of Use. It was also the screen with no forward
   * button — that was the symptom, this is the cause.
   */
  "/cid/terms/",
  "/cid/biometric/",
  "/cid/verified/",
  "/auth/loading/",
  "/services/driver-vehicle/confirmation/",
  "/services/driver-vehicle/?verified=1",
] as const;
