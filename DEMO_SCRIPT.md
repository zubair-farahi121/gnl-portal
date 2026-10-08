# Demo script — MyGovNL with CertifiO ID, and the wallet (Flow 3)

**Order:** Flow A (Driver and Vehicle) → **Flow 3 right after Flow A's "Trusted" page** → Flow B (StudentAidNL).
Button labels below are the exact on-screen labels, in **bold**. Every other control shows a small "Not part of this demo" message.

## Before you start

| What | How |
|---|---|
| Start the demo | `npm run build` then `npx serve out -l 4173` (never `-s`). Open `http://localhost:4173/`. |
| Reset everything | Press **Esc** on any portal page, or open `/reset`. This also clears the wallet: the offer, the added card and the card count. |
| Step forward / back | **→** / **←** keys (presenter shortcut; the on-screen buttons do the same). |
| Presenter stage (Flow 3, optional) | Press **Shift+W**. The C1 page (left) and the wallet phone (right) show side by side. It has its own **Reset demo** button. |
| Browser | Chrome. Allow pop-ups for `localhost` (the wallet opens in a small window). |
| Persona | **Jason Moore**. Log in as `jason.moore@email.com` with **any password** (any non-empty email and password work). The dashboard says "Welcome Jason Moore!"; the wallet says "Hello, Jason!". |
| Keys while typing | The **→ / ← / Esc** shortcuts do nothing while the cursor is in a text field. **Esc** there only leaves the field. Click outside the field first. |

---

## Flow A — NL resident, driver's licence (Driver and Vehicle)

1. Login page: type `jason.moore@email.com` in **Email Address** and any password in **Password**, then **Log in** (or press Enter).
   (With an empty field, "Enter your email address and password." appears and the page stays.)
2. Dashboard: click the **Driver and Vehicle** service card.
3. Driver and Vehicle ("Confirmation required"): **Onboard**.
4. Summary: **Continue**.
5. Terms: tick "I have read and accept terms and condition", then **I Consent**.
   (Without the tick, "To continue, you must agree to the terms and conditions." appears.)
6. Confirm details: **Continue**.
7. Choose a verification method (GNL IDV is selected): **Continue**.
8. CertifiO hand-off: **Continue on my computer**.
9. Terms of use: **I agree**. Biometric consent: **I agree**.
10. Liveness: **Continue**, then **Continue**.
11. Country / document type: **Continue**. Accepted documents: **Continue**.
12. Capture instructions: **Continue**. Capture front: **Continue**. Capture back: **Continue**.
13. Upload: moves on by itself (~2 s).
14. Verified: **Continue to Driver and Vehicle service**.
15. Provider status: moves on by itself (or press **→**).
16. Prerequisite: **Continue**.
17. Confirmation: **Go to Service Driver’s License Renewal**.
18. **Driver and Vehicle — "Trusted".** ← Flow 3 starts here.

---

## Flow 3 — add the vehicle registration certificate to a wallet

The desktop is MyGovNL (C1). The phone is a neutral wallet app (not Apple, Google or Paradym).

| # | Where | Do | Say (talk track, brief §15) |
|---|---|---|---|
| 1 | Driver and Vehicle, "Trusted", **2015 CHEV IMT** card | In the grey panel **"Skip the paper copy"**, click **Add to wallet**. | "Now that you're verified, GNL can give you a digital copy of your vehicle registration." |
| 2 | "Add your vehicle registration certificate to your wallet" | Point at the QR and the line **"Waiting for scan…"** (blue dot). Point at "This code expires in 08:00" counting down. | "MyGovNL shows a one-time QR code. It works with a digital wallet on your phone." |
| 3 | Same page | **Click the QR code.** The wallet opens in a small window at **"Hello, Jason!"**. Put the two windows side by side. Tap **Scan QR-code**. | "I open my wallet and scan." |
| 4 | Wallet: "Scan QR Code" | Nothing to do: the camera view finds the code by itself (~1 s). | Show the desktop: it now says **"Adding to your wallet…"**. "The desktop knows the phone picked it up." |
| 5 | Wallet: "Allow connection?" | **Yes, connect**. | "The wallet checks this is really the Government of Newfoundland & Labrador." |
| | Wallet: "Certificate offered" | **View offer**. | |
| | Wallet: "Is the information correct?" | Scroll through the details and the two consent lines. **Add to wallet**. | "I see exactly what will be stored, and I stay in control of sharing it." |
| | Wallet: "Connecting wallet..." | Wait (~2 s). | |
| | Wallet: "Enter your verification code" | Tap the **Messages** notification at the top ("Your GNL code is 482 915") to fill the code, or type any 6 digits. **Continue**. | "A code by SMS, which is not in the QR code, proves it's really me." |
| 6 | Wallet: "Added Successfully" | Show the desktop: **"Added to your wallet"** (green check on the QR). | "Done on both sides, at the same moment." |
| 7 | Wallet | **Go to Wallet** → "Your credentials", **3 cards total**, the new **Vehicle Registration Certificate** on top, "Issued" today. | "It sits in my wallet next to my other cards." |
| 8 | Desktop, right-hand panel | Point at "What can you do with a digital vehicle registration certificate?" | "Sign in without a password. Skip the paperwork next time you renew or transfer ownership. Share only what's needed — prove the vehicle is registered without handing over the full VIN or address." |

**Back to the portal:** "← Back to Driver and Vehicle". Close the wallet window.

**If something goes wrong on stage**

- In the wallet, **Decline** on "Allow connection?", **Cancel** on the details ("Is the information correct?") or the **✕** returns the wallet home, and the desktop goes back to "Waiting for scan…". The **same QR** still works: tap **Scan QR-code** again.
- **Trouble scanning? Get a new code** on the desktop makes a new QR.
- A refresh keeps where you are. **Esc** on a portal page (or `/reset`) starts everything over.
- The pop-up was blocked: the QR opens the wallet in a new tab instead. Or use the presenter stage (**Shift+W**).

**On a phone-width screen (same device):** the C1 page has no QR. Tap **Add to Apple Wallet** (or **Add to Google Wallet**): the wallet opens at "Allow connection?", then the same steps as above. **◀ MyGovNL** at the top left of the wallet goes back to MyGovNL, which says "Added to your wallet".

---

## Flow B — non-resident, passport (StudentAidNL)

Reset first (**Esc**), or continue from the dashboard.

1. Login page: type `jason.moore@email.com` and any password, then **Log in**.
2. Dashboard: click the **StudentAidNL** service card.
3. StudentAidNL: **Onboard**.
4. Summary: **Continue**.
5. Terms: tick "I have read and accept terms and condition", then **I Consent**.
6. Confirm details: **Continue**.
7. Choose a verification method — **GNL Identity Verification Service** is selected: **Continue**.
8. Other verification (pre-selected): **Continue**.
9. CertifiO hand-off: **Continue on my computer**.
10. Terms of use: **I agree**. Biometric consent: **I agree**.
11. Liveness: **Continue**, then **Continue**.
12. Country / document type: **Continue**. Accepted documents (Passport): **Continue**.
13. Capture instructions: **Continue**. Capture (no back side for a passport): **Continue**.
14. Upload: moves on by itself.
15. Verified: **Continue to StudentAidNL service**.
16. Provider status: moves on by itself.
17. Prerequisite: **Continue**.
18. Confirmation: **Go to Service StudentAidNL**.
19. **StudentAidNL — "Trusted"**, with **Access the StudentAid Portal**.
