# What the REAL Yoti screens actually show

Transcribed 2026-09-27 by reading the screenshot nodes in Figma
`Dc1bPoXX1VoB9v1MtLvu8e`, section "CertifiO ID" (6127:50647), page
"Exploration". These are photographs of a real verification on an Android
phone, in FRENCH.

WHY THIS FILE EXISTS. figma.com is blocked by this container's egress proxy, so
those screenshots can only be fetched inline as base64 — they cannot be curl'd
cheaply. This file is the durable record of what was in them so nobody pays to
fetch them twice. **The screenshots still win over this file**, but this file
wins over YOTI_BRIEF.md §6's measurements where the two disagree, because this
was read off the images themselves.

PRIVACY (YOTI_BRIEF.md §10). The real screenshots show a real person's face and
a real health card. NOTHING from them is copied into this repo — not the
images, not crops, not the person's name, not the card type or number. This
file describes layout and colour only. Keep it that way.

REFERENCE WIDTH: the frames are 390 x 867, so the phone viewport is **390 px**.
YOTI_BRIEF.md §6 says "about 384 px"; treat 390 as the reference and 384 as
within tolerance.

---

## Chrome that is NOT ours and NOT Yoti's

Above the Yoti zone every real screenshot has:

- an Android status bar; at the bottom the Chrome address bar
  ("client.certifio.id/web") and the Android navigation bar;
- a **certifiO ID header** — blue rounded-square logo, the wordmark
  "certifiO ID", an outlined globe "EN" language button at the right;
- a title "Vérification d'identité", a subtitle ("Vérification biométrique",
  or "… + AML/KYC + bancaire" in sessions that also ran a bank check), and a
  **7-dot stepper** on a blue line — filled ticks for done, a white-centred
  ring for current;
- a blue caption naming the sub-step: "Vivacité faciale", or "Vérification de
  document #1" / "#2".

**None of this is copied.** YOTI_BRIEF.md §9: the GNL design replaces the
CertifiO pages on purpose. Our MyGovNL header, service title, C1 progress bar
and sub-step pill go here instead. It is recorded only so a future reader can
tell, in any screenshot, exactly where OUR chrome stops and the Yoti zone
starts.

**The Yoti zone begins at the help icon** — or, on Y2, at "‹ Retour".

---

## True on every Yoti screen

- The background inside the zone is plain white. No card, no border around the
  content itself.
- Side gutter roughly 20–24 px.
- Headings are heavy, dark slate (#333b40), wrap to 2–3 lines, tightly leaded
  (~1.2) without looking cramped.
- **Continue is pinned to the bottom** in a white bar: full content width,
  blue, white bold centred label, and a **white chevron › near the right
  edge**. A faint horizontal shadow sits directly above the bar. Content
  scrolls underneath it.
- The label reads "Continuer". Our build uses the ENGLISH text from the GNL
  frames (YOTI_BRIEF.md §1).

---

## Y1 — Prepare to scan your face (6127:50680 top, 6127:50681 scrolled)

1. **Help icon** — thin circled "?", grey, ~18 px, hard against the right
   gutter, clearly ABOVE the heading with real space between.
2. **Heading**, 2 lines: "Préparez-vous à scanner votre visage".
3. **Illustration box** — pale-blue panel (#ebf5ff), generously rounded
   (~16 px), full content width, roughly square. Inside, **line art**: a woman
   drawn in dark outline with a mid-blue top, holding a phone at eye level,
   with a **dashed line** from the phone to her eyes. The drawing bleeds off
   the bottom of the panel — her body is cropped by it.
4. (scrolled) **Three tips**, each a row of [outline icon | text]:
   - **sun** — "Trouvez un endroit bien éclairé et un arrière-plan dégagé"
   - **face in a rounded square** — "Soyez conscient que le haut de votre
     corps et l'arrière-plan seront visibles"
   - **eye** — "Placez le téléphone à hauteur des yeux"
   Icons thin-stroke, dark, ~24 px, top-aligned to the first line. Every text
   wraps to 2 lines. Generous gap between rows (~20 px). The text is
   noticeably LARGER than normal body copy — this is what §6 means by "tips on
   Y1 about 17 px".
5. Pinned "Continuer ›".

NOTE: the tips are BELOW THE FOLD at 390x867 — the first screenshot stops at
the illustration. So the Yoti zone scrolls and the button bar stays put. That
scrolling behaviour is part of what must be reproduced.

---

## Y2 — Face capture (6127:50648)

- **"‹ Retour"** top left: small chevron plus the word, grey, semi-bold. It
  REPLACES the help icon here.
- Below it a **camera area** filling the remaining height, full content width
  with a small side gutter, square corners.
- **A solid white chip** floats near the TOP of the camera area, inset from the
  top and both sides: rounded (~8 px), bold dark centred text on one line —
  "Placez votre visage dans le cadre" ("Position your face within the frame.").
- **A head-shaped window** sits slightly above the middle. The shape is a head
  **with ears** — an egg narrowing at the chin, with a small bump each side at
  about eye level.
  - INSIDE: the camera image is **sharp and full colour**.
  - OUTSIDE: the same image is **washed toward white and blurred** — the room
    is still readable but flattened and pale.
  - The edge is a **dark outline** (~2–3 px) with a **thin lighter band** just
    inside it, following the same shape.
- **NO Continue button and no pinned bar at all** — the camera area runs to the
  bottom. This is the evidence behind §12 open question 1: Yoti appears to
  capture by itself. §7 Y2 says keep the Figma "Continue ›" until confirmed.
- No green outline, no progress ring, no countdown, no extra status text.

---

## Y3 — Document type and country

### Before a country is chosen (6127:50649)
1. Help icon, top right.
2. **Heading**, 3 lines: "Sélectionnez le type de document d'identité que vous
   souhaitez ajouter".
3. **Body**, 4 lines, regular, dark.
4. **Country field** — white, full width, clearly TALLER than a normal input
   (~46 px), rounded (~6 px), **visible ~2 px muted blue-grey border**, grey
   placeholder "Sélectionnez le pays d'émission", **chevron ⌄ at the right**.
5. **Privacy panel** — light grey (#f3f4f6), rounded (~8 px), roomy padding:
   - title "Votre vie privée et Yoti", bold, grey-blue, larger than body;
   - body, 4 lines, regular, same grey-blue;
   - **"Politique de confidentialité"** — bold, a DARKER blue than the button
     blue, followed by a small **external-link ↗**;
   - bottom right: small bold "Powered by", then the **YOTI logo boxed in a
     thin dark rounded rectangle**.
6. **NO Continue button, no pinned bar** — confirmed; below the panel is the
   Chrome address bar.

### After typing a country (6127:50655)
- The country field sits at the top, **focused**, showing typed text, wrapped
  in a **thick bright MAGENTA focus ring** (~4 px, #f500dc). Unmistakable, and
  a real Yoti behaviour rather than a Figma artefact.
- Immediately below, on the SAME screen, **"Documents acceptés :"** and the
  document list (Y4). The page has scrolled, clipping the title.
- **The pinned "Continuer ›" bar has appeared.**
- A **session-expiry toast** overlays the top. §9 says DO NOT reproduce it.
- This frame is the proof for §7 Y3: country and accepted documents are ONE
  screen in real Yoti, though the Figma splits them into NL-13 and NL-14.
  Flagged for Tatyana (§12 open question 5).

---

## Y4 — Accepted documents (6127:50650, also visible in 6127:50655)

- Title "Documents acceptés :" — bold, dark, larger than the row labels.
- **Rows**: white, full width, rounded (~8 px), **2 px muted blue-grey
  border**, ~54 px tall, with an **empty circle radio** (~20 px, 2 px grey
  outline, NO fill, NO dot) at the left and a regular-weight dark label.
- The **SCIS row is taller** — it carries a second line, "Émis le ou après le
  01/2010", smaller and greyer under the label.
- Generous gap between rows (~15 px): they read as separate cards, not a
  joined list.
- French order: Passeport · Carte de statut d'Indien (SCIS) · Carte de
  résident permanent · Carte NEXUS · Document d'identité provincial ou
  territorial · Permis de conduire. The GNL English list also has **Health
  Insurance Card** before Driver's License — §7 Y4 is authoritative.
- **NOTHING IS SELECTED** — every radio is empty. No real screenshot shows a
  selected row, which is why §6 has to invent the selected style.

---

## Y5 — Prepare to take a photo (6127:50653)

1. **Round badge, LEFT-ALIGNED** (not centred): a large pale circle (~110 px)
   holding a thin dark **outline ID card inside corner brackets**.
   The help icon belongs at the right of this same row; here it is **hidden
   under the session-expiry toast**, which is why §6 hedges "probably Y5 too".
2. **Heading**, 3 lines: "Préparez-vous à prendre une photo de votre document
   d'identité (recto)".
3. **Body**, 3 lines, regular, dark. ("cette fois-ci" / "this time" gives it
   away as a RETRY — §12 open question 3.)
4. **"N'oubliez pas :" card** — light grey (#f3f4f6), rounded (~8 px), roomy
   padding. Title bold, grey-blue. Three rows of [thin outline icon | text],
   all grey-blue, comfortably spaced:
   - **eye** — information clear and nothing obscured
   - **sun** — find a well-lit area
   - **card in corner brackets** — document properly framed
5. Pinned "Continuer ›".

---

## Y8 — Upload (6127:50651)

- **Round badge, LEFT-ALIGNED**: the same pale circle (~110 px) holding a thin
  dark **upload icon — an open tray with an arrow pointing up out of it**.
- After a clear gap, a **large bold dark block of text**, 5 lines, well above
  body size and tightly leaded: "Veuillez ne pas fermer cette fenêtre tant que
  nous n'avons pas téléchargé votre <DOCUMENT>. Cela prend généralement moins
  d'une minute."
  The real frame names a real person's card. Our build substitutes the flow's
  own document — "your Driver's License" / "your Passport" (§7 Y8). The real
  card type is deliberately NOT recorded here; see PRIVACY.
- After another clear gap, a **thin progress bar** the full content width:
  rounded ends, only a few px tall, **dark fill** (about a third across in this
  frame) on a **light grey track**.
- **No button, no help icon, no pinned bar.** The rest is empty white.

---

## Present in the real screenshots, deliberately NOT built (§9)

- the session-expiry toast (on Y3-after and Y5);
- the certifiO ID header, the 7-dot stepper, the "EN" button;
- Android status/navigation bars and the Chrome address bar;
- error screens and the Flinks bank check (6127:50652, 6127:50656–50660);
- the CertifiO ID pages (6127:50675–50679, 50686, 50661).
