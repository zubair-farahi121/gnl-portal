import {
  APP_ROUTES,
  CID_ROUTES,
  DEFAULT_SERVICE_ID,
  cidRoutes,
  serviceRoutes,
} from "@/lib/data/service-config";

/**
 * The demo click-through order. DemoNav uses this for the presenter's
 * arrow-key shortcuts; it is not a substitute for on-screen links, which
 * must reach every step on their own.
 */
const R = serviceRoutes(DEFAULT_SERVICE_ID);

export const FLOW = [
  APP_ROUTES.login,
  APP_ROUTES.dashboard,
  R.page,
  /*
   * THE FRONT OF THE WIZARD — added 2026-09-23 (Tier 1).
   *
   *   R.summary        NL-04  Summary                     25 %
   *   R.terms          NL-05  Terms and Conditions        50 %
   *   R.confirmDetails NL-06  Confirm Some Details: Required  75 %
   *
   * DEMO_AUDIT.md marked all three BUILD against a brief that called them KEEP:
   * *"No route, no component and no copy for any of them. They are the first
   * three screens after 'Onboard' — the demo currently cannot get from the
   * service page to the verification step by clicking."*
   *
   * THEY GO HERE BECAUSE §5 SAYS SO, and it is the one part of the flow the
   * canvas does not have to arbitrate: *"service page -> Onboard -> Summary ->
   * Terms -> Confirm some details (Required) -> Choose verification service"*.
   * The service page's "Onboard" button was re-pointed from R.onboard to
   * R.summary in the same change.
   *
   * NOTE R.confirmDetails AND R.prerequisite ARE THE SAME SCREEN IN TWO STATES
   * (§8.1 NL-06, "one component, two states"), which is why they sit at
   * opposite ends of this list: Required before the verification, Confirmed
   * after it. One component, `ConfirmDetailsCard`; two routes, because each
   * one's state has to be right in the server-rendered HTML — see the note on
   * `confirmDetails` in src/lib/data/service-config.ts.
   */
  R.summary,
  R.terms,
  R.confirmDetails,
  R.onboard,
  /*
   * The mobile hand-off, added 2026-09-22 — Figma 6217:62059
   * `CID_Redirect to mobile`, 1440 x 1161.196.
   *
   * design/verification-frame-map.md §5 reported "no frame I could address
   * shows a QR hand-off or a 'Continue on my computer' control… Confidence:
   * medium. Treat as 'no evidence for', not 'proven absent'." The frame exists;
   * the caveat was doing its job.
   *
   * IT GOES HERE BECAUSE THE CANVAS SAYS SO, not because it felt right. On Row
   * B (y=3563) it sits at x=13340.17, between `/onboard/`'s neighbourhood
   * (x=11662) and `CID_TU` (x=15130) — and Row B's x-order is flow order, which
   * the frame map establishes over nine consecutive frames.
   *
   * It is a 1440 DESKTOP frame, not a 393 CID one, so it renders through the
   * desktop shell like /onboard/ and /auth/loading/ rather than through
   * CidScreen. It carries no `sub-step-readout`, so it does not disturb the
   * CID sub-step counter below.
   *
   * Its ONE control, "Continue on my computer", points at /cid/terms/. It has
   * no Back and no Cancel — `Banner` is the frame's only other layer and it is
   * hidden="true" — so ArrowLeft here is the reverse path, as on the four Yoti
   * ID-document screens.
   */
  CID_ROUTES.handoff,
  /*
   * /cid/welcome/ was removed on 2026-09-21. The designer judged the CID
   * Welcome screen redundant and took it out of the flow, so the IDV journey
   * now starts at Terms of Use. It was also the screen with no forward
   * button — that was the symptom, this is the cause.
   */
  CID_ROUTES.terms,
  CID_ROUTES.biometric,
  /*
   * THE LIVENESS CHECK — STEP 3, added 2026-09-23. Two frames, both named
   * `CID_Biometric`, both carrying the pill `Liveness check • step 3 of 5`:
   *   /cid/liveness/          6217:65268   393 x 1282.441
   *   /cid/liveness-capture/  6217:65271   393 x 1231.811
   *
   * THIS IS THE HOLE IN THE COUNTER, AND IT IS NOW CLOSED. The entry below
   * used to say "nothing in the file displays 'step 3 of 5'", and
   * design/verification-frame-map.md §12 raised it as open conflict C4 — is a
   * screen missing, or should the stepper read "of 4"? It was a missing
   * screen, twice over. These two are the ONLY nodes in the file that display
   * "step 3 of 5". The pill now runs 1 → 2 → 3 → 3 → 4 → 4 → 4 → 4 → 4 → 5
   * across the ten CID screens, with no number skipped.
   *
   * THEY GO HERE BECAUSE THE CANVAS SAYS SO. Both sit FIRST in the `Yoti`
   * section at y=779 — x=44.87 and x=553.87, before `CID_ID1_Country` at
   * x=1076.87 — and that section's x-order is flow order, the same rule that
   * ordered every other screen in this list (page-inventory.md bucket 2a).
   * `/cid/biometric/`'s "I agree" was re-pointed from /cid/country/ to
   * /cid/liveness/ in the same change.
   *
   * THEY WERE INVISIBLE TO FOUR EARLIER AUDITS because they share the name
   * `CID_Biometric` with the built consent screen 6217:62835. They are told
   * apart by size, by canvas position and by their headings. Both have live
   * instances on the StudentAidNL row in the matching slot (6217:66069 /
   * 6217:66070), so they are current, not abandoned sketches.
   *
   * REVERSE PATHS DIFFER BETWEEN THE TWO, and the difference is the design's:
   *   /cid/liveness/         no Back at all (`Check box` 6056:13130 is hidden,
   *                          `Frame 6` holds only Continue) -> ArrowLeft, plus
   *                          the NEXT screen's Back, which points at it.
   *   /cid/liveness-capture/ has a REAL, VISIBLE `Yoti_back` (6217:65270) —
   *                          the only visible Back anywhere in the Yoti run —
   *                          pointing one step back at /cid/liveness/.
   */
  CID_ROUTES.liveness,
  CID_ROUTES.livenessCapture,
  /*
   * Document-type / country-of-issuance selection, added 2026-09-22 — Figma
   * 6217:66054 `CID_ID1_Country`, 393 x 1060.811. Gap G1 in the frame map
   * ("a separate country selection screen: not found") is closed.
   *
   * Its pill reads "step 4 of 5", like the four screens after it — verbatim
   * and un-renumbered. It is no longer the screen that makes the counter skip:
   * the two liveness frames above now supply step 3.
   *
   * Like the three ID-document screens below it, it has NO Back button
   * (`btn-back` 6056:15024 is hidden="true"), so ArrowLeft is the reverse path.
   */
  CID_ROUTES.country,
  /*
   * The ID-document step, added 2026-09-22 — the identity verification itself,
   * which the flow was missing entirely: it ran Terms (step 1 of 5) ->
   * Biometric consent (step 2 of 5) -> Identity verified (step 5 of 5).
   *
   * Three Figma frames, all named `CID_ID1`, all on the y=779 Driver-and-
   * Vehicle row, and all three carrying the pill "ID document selection •
   * step 4 of 5":
   *   /cid/document/       6087:31396
   *   /cid/capture-front/  6056:19118
   *   /cid/capture-back/   6057:20924
   *
   * NONE of them has a Back button — `btn-back` on 6087:31396 is hidden="true"
   * in Figma and the two capture frames have no such layer at all. So on these
   * three screens the ONLY on-screen control is Continue, and ArrowLeft here
   * is the reverse path (along with the browser's own back button). Ordering
   * them correctly in this list is therefore load-bearing, not just a
   * convenience for the presenter.
   */
  CID_ROUTES.document,
  /*
   * The capture instructions, added 2026-09-22 — Figma 6217:66055
   * `CID_ID1_Front_instruction`, 393 x 994.811. Step 4b.
   *
   * This closes gap G2 AND conflict C2 in design/verification-frame-map.md,
   * which said "Exists, but I cannot give you its node id… the build cannot add
   * this screen until someone reads the master's id off the canvas." The
   * master's `progress-stepper` is 6257:69650 and its Yoti button is
   * 6076:31370 — both exactly what the frame map predicted from an instance.
   *
   * Same shape as its three neighbours: Continue is the only control
   * (`btn-back` 6056:20004 and `Expiry Banner` 6056:20787 are both
   * hidden="true"), so ArrowLeft is the reverse path.
   */
  CID_ROUTES.captureIntro,
  CID_ROUTES.captureFront,
  CID_ROUTES.captureBack,
  /*
   * Y8, THE UPLOAD SCREEN — added 2026-09-27. /cid/upload/.
   *
   * IT IS NOT IN FIGMA AND THAT IS WHY IT WAS MISSING. Every other entry in
   * this list was placed by reading the canvas; there is nothing on the canvas
   * to read for this one. It comes from design/YOTI_OBSERVED.md, transcribed
   * from photographs of a REAL verification — "Y8 — Upload (6127:50651)" —
   * which is the higher authority wherever the recreation and the real thing
   * disagree, and here the recreation simply does not have the screen.
   *
   * WHERE IT GOES IS NOT A JUDGEMENT CALL: an upload happens after the last
   * photograph and before the result, in both flows. Flow A reaches it from
   * /cid/capture-back/ and Flow B from /cid/capture-front/ — see `captureSides`
   * on CidCaptureFrontScreen.
   *
   * IT IS THE ONE SCREEN IN THIS LIST WITH NO ON-SCREEN CONTROL AT ALL — no
   * Continue, no Back, no help icon; YOTI_OBSERVED.md says so in those words.
   * It advances itself after YOTI_SIZE.progressMs. So ArrowRight here is a
   * convenience rather than the only forward move (unlike /auth/loading/), and
   * ArrowLeft is the only reverse move, as on the four screens before it.
   */
  CID_ROUTES.upload,
  CID_ROUTES.verified,
  /*
   * /auth/loading/ (6217:80871) has NO buttons in Figma — its closing line is
   * "You can close this window." None is invented, and the 2.6s auto-advance
   * that used to stand in for one was removed on 2026-09-22 (see that page).
   * So on this ONE screen ArrowRight is not a convenience, it is the only
   * forward move; the reverse move is step 7's Back, which points here.
   */
  APP_ROUTES.processing,
  /*
   * Step 7, added 2026-09-22 — Figma 6217:81644
   * `Driver and Vehicle_Prerequisite confirmed`, "Confirm some details".
   *
   * The flow went /auth/loading/ -> confirmation with nothing between, because
   * a prior audit read 6217:81644 as a superseded variant of the confirmation
   * frame 6217:82446. It is not: the two sit side by side on the same canvas
   * row (x=23416.06 then x=25108.81), with different steppers, headings and
   * actions. See design/verification-frame-map.md §4.
   */
  R.prerequisite,
  R.confirmation,
  R.pageVerified,
] as const;

/*
 * ====================================================================
 * FLOW B — StudentAidNL — the same idea, added 2026-09-28.
 *
 * §5 / §9 order: dashboard -> PP-03 -> Onboard -> PP-04 Summary -> PP-05 Terms
 * -> PP-06 Required -> PP-07 method -> PP-08 Other verification -> PP-09
 * hand-off -> PP-10..PP-19 (the CID run, NO back capture) -> PP-20 processing
 * -> PP-21 Confirmed -> PP-22 Success -> PP-23 Trusted.
 *
 * WHY IT MATTERS MORE THAN IT LOOKS: until today every /services/studentaid/…
 * and /cid/studentaid/… URL was absent from FLOW, so DemoNav's `findIndex`
 * returned -1 and BOTH arrows did nothing there. On the Yoti screens that have
 * no Back control (country, document, capture-intro, capture-front, upload),
 * ArrowLeft is the only reverse move — so Flow B had none.
 *
 * SHARED URLS RESOLVE TO FLOW A. `/`, `/dashboard/` and `/auth/loading/` are in
 * both lists; DemoNav picks FLOW_B only for a path that is in FLOW_B and NOT
 * in FLOW, so every arrow press on every Flow A URL behaves exactly as it did.
 * The cost, stated plainly: ArrowRight on /auth/loading/ is Flow A's hop even
 * mid-Flow-B. Flow B does not need it — its processing screen advances itself
 * to the Flow B prerequisite page (ProcessingAdvance) — and ArrowLeft from
 * PP-21 is reached by its on-screen Back instead.
 * ====================================================================
 */
const B = serviceRoutes("studentaid");
const CID_B = cidRoutes("studentaid");

export const FLOW_B = [
  APP_ROUTES.login,
  APP_ROUTES.dashboard,
  B.page,
  B.summary,
  B.terms,
  B.confirmDetails,
  B.onboard,
  B.otherVerification,
  CID_B.handoff,
  CID_B.terms,
  CID_B.biometric,
  CID_B.liveness,
  CID_B.livenessCapture,
  CID_B.country,
  CID_B.document,
  CID_B.captureIntro,
  CID_B.captureFront,
  /* No CID_B.captureBack — §9 "no back capture"; the route is not generated. */
  CID_B.upload,
  CID_B.verified,
  APP_ROUTES.processing,
  B.prerequisite,
  B.confirmation,
  B.pageVerified,
] as const;
