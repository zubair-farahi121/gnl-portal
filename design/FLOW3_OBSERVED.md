# Flow 3 — Issuance of Vehicle Registration Certificate (what Figma shows)

Read 2026-09-28, read-only, from Figma `Dc1bPoXX1VoB9v1MtLvu8e`, page "VC flows"
(6171:70381), section **6343:84884** "3rd Flow - Issuance of Vehicle Registration
Certificate". Frames run left to right in this order.

figma.com is blocked by this container's egress proxy: screenshots only come back
inline (`get_screenshot` with `enableBase64Response: true`). Prefer
`get_metadata` / `get_design_context` (text) and fetch an image only when you need
to see something this file does not already describe.

## The story

After Driver and Vehicle is Trusted, the user clicks **Add to wallet** on the 2015
CHEV IMT card. C1 shows a QR code. On their phone the user opens their wallet,
scans the QR, allows the connection to the Government of NL, reviews the
certificate, confirms an SMS code, and the certificate lands in the wallet. The C1
page's status line follows along.

## C1 side — GNL design (Lato, existing chrome)

| Step | Node | What it is |
|---|---|---|
| C1-0 | 6285:87154 (desktop, 1440x1792), 6285:87155 (mobile, 393x2787) | Trusted Driver and Vehicle page with the "Skip the paper copy · New · Add your verified vehicle registration certificate to your wallet. Show proof instantly from your phone. **Add to wallet**" banner on the 2015 CHEV IMT card. **ALREADY BUILT** as the Trusted state (data in src/lib/data/driver-vehicle.ts ~line 300, rendered by LinkedItemCard). Today "Add to wallet" shows the "Not part of this demo" toast. |
| C1-1 | 6220:86445 (1440x1024) | **"Add your vehicle registration certificate to your wallet"**. "← Back to Driver and Vehicle" breadcrumb. Subtitle "Your registration is verified and active. Scan the code with Apple Wallet or Google Wallet to add it." Left: a bordered card with a QR code, a status line **"Waiting for scan…"**, "Works with" + Apple Wallet + Google Wallet (icons), "Issued by the Government of Newfoundland and Labrador". Below the card: "This code expires in **8 minutes**. Trouble scanning? [Get a new code]". Right: grey panel "What can you do with a digital vehicle registration certificate?" with three rows (lock icon "Sign in without a password"; card icon "Skip the paperwork next time you renew or transfer ownership"; eye icon "Share only what's needed, like proving your vehicle is registered, without handing over your full VIN or address"). |
| C1-2 | 6289:45276 (1440x1024) | Same page, second state (check its status text with get_design_context). |
| C1-3 | 6289:46104 (1440x1024) | Same page, status **"Adding to your wallet…"**. |
| C1-4 | *(not drawn)* | Annotation 6220:86486 lists the dynamic states: "Waiting for scan / Adding to your wallet / Added to your wallet". The **"Added to your wallet"** state is NOT drawn — derive it (same page, final status). |
| C1-m | 6220:86488 (393x1471) | The same page at phone width. The QR is replaced by two buttons, **"Add to Apple Wallet"** and **"Add to Google Wallet"** (same-device path). Then the benefits panel. |

## Wallet side — a different visual language (phone app)

It says "Powered by Portage Cryptography" on W6 and looks like the **Portage 2026
Design System** (Figma `AjOTOXx9pDo8Pj0Hw0pD1R`): Inter Black headlines, black
(#081010-ish) primary buttons, outlined secondary buttons, a mint "verified"
card, light grey cards, rounded corners. The wallet frames themselves are the
source of truth; the Portage tokens only fill gaps:

- font Inter (Black 900 headlines, tight tracking; Light/Regular body)
- text #081010, background #ffffff, background-2 #f3f5fb, accent mint #86ceba
- button primary bg #081010 / text #ffffff; secondary transparent with border
- radius 8 (small) / 16 (main); border width 1.5

| Step | Node | Frame name | Content |
|---|---|---|---|
| W1 | 6288:59109 (393x874) | wallet-home-wireframe | "Hello, Jason!" home with a scan action ("Wallet: open and scan the QR code"). |
| W2 | 6286:90660 (390x844) | 1. QR Scanner | "Scan QR Code". "Point your camera at the **login** QR code displayed on your computer." ← copy looks wrong (it is not a login); reproduce it but log it as an open question. |
| W3 | 6325:60170 (390x881) | government-issuer-interaction-request | Back arrow + close ✕, a progress bar, round mint badge with the NL flower emblem, "Government of Newfoundland & Labrador", **"Allow connection?"** (Inter Black, large), "MyGovNL wants to offer you a new digital Vehicle Registration Certificate for your wallet." A mint card "Verified government issuer · Issuer identity has been cryptographically confirmed" with a chevron; a grey card "First-time interaction · No previous transactions found with this organization". Black **"Yes, connect"**, outlined **"Decline"**. |
| W4 | 6240:54958 (390x910) | Screen 1: Renewal Approved | "Government of Newfoundland & Labrador", **"Certificate offered"**, "Your registration certificate is verified and ready for secure on-device storage.", a card "Vehicle registration certificate · Verifiable Digital Credential". |
| W5 | 6240:55097 (393x1432) | Screen 4: Credential Preview | "Vehicle Registration Certificate", "Verify your vehicle registration details before saving them onto this device." Rows: Registration Number (License Plate) **JKM 026** · Vehicle Identification Number (VIN) **2G1125535F9268441** · Make (Manufacturer) **Chevrolet** · Model **2015 CHEV IMT** · First Registration Date **January 14, 2015** · Expiry Date **January 14, 2036** · Owner Identifier **Jason Momoa** · Issuing Country **Canada** · Issuing Authority (check value). Footer "It will be securely stored in your wallet. You control when its information is shared." Heading on the overview reads "Is this information correct?". |
| W6 | 6293:46861 (390x844) | Screen 2: Wallet Redirect | **"Connecting wallet…"**, "Establishing a secure connection to transfer your digital certificate.", "Powered by Portage Cryptography". Transitional (auto-advance). |
| W7 | 6322:60882 (393x874) | transactional-code-entry | **"Enter your verification code"**. "We sent a 6-digit code by SMS to ••• ••• 0187. This code was not included in the QR code." Code boxes showing 4 8 2 …, and a numeric keypad 1–9, 0. |
| W8 | 6240:55218 (393x844) | Screen 7: Success | **"Added Successfully"**, "Your Vehicle Registration Certificate is secure and ready for use." |
| W9 | 6240:55253 (393x844) | Screen 8: Wallet Dashboard | "Hello, Jason!", "Your credentials · 3 cards total". Expanded card **Vehicle Registration Certificate · Issued October 31, 2026** with Owner Jason Momoa, Plate JKM 026, Expiry January 14, 2036. Collapsed cards "Photo ID · Issued Aug 1, 2024" and "Proof of age · Issued Mar 15, 2023". |

Persona values match BUILD_BRIEF.md §12.5 (Jason Momoa, JKM 026, VIN
2G1125535F9268441, expiry January 14, 2036). Use the demo's existing data module
for them rather than new literals.

## Open questions for Tatyana

1. C1 says "Scan with Apple Wallet or Google Wallet", but the wallet shown is a
   Portage-style app. Which wallet do we name on stage?
2. W2 says "the **login** QR code" — leftover copy from another flow?
3. The "Added to your wallet" C1 state is not drawn; it is derived.
4. W9 says "Issued October 31, 2026" — a date after the demo.
5. Is there a Decline path (W3 "Decline")? Not drawn; it shows the toast.
