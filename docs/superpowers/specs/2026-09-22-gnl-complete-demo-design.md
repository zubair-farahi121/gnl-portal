# GNL End-to-End Demo Design

Status: Proposed for user review. Product implementation has not started.

## Outcome and Meeting Requirements

Deliver a presentation-ready, responsive demo of Tatyana's CertifiO ID
integration design, with code and methodology that developers can reuse for
a proof of concept. Complete the resident Driver and Vehicle journey and the
non-resident StudentAidNL journey, including their respective service returns.

The supplied meeting excerpt establishes a demo and internal dry-run goal,
continued alignment with Figma, replacement of placeholder assets, and a
developer handoff explaining the Figma-to-code workflow. It does not establish
a requirement for production authentication or real identity processing.
The excerpt omits the discussion between approximately 1:12 and 11:18.
Its relative deadline cannot be converted to a calendar date without the
meeting date.

Assumption for approval: this delivery is a complete simulated integration
demo, not a production portal. No real identity documents, biometrics,
credentials, payments, or government records will be collected or processed.

## Scope and Completion Labels

1. Integration demo: implement both complete journeys described below.
2. Demo usability: connect navigation used by those journeys, provide working
   service search and favourites, retain credential-free demo login, and
   provide repeatable reset and outcome controls for the presenter.
3. Developer handoff: document reusable components, state transitions,
   provider contracts, tests, design synchronization, and production gaps.
4. Wider portal: inventory registration, account/security management,
   notifications, other services, and transaction workflows from the Current
   design page. These are a separate subsystem requiring its own approved
   specification; they are not silently counted as implemented or removed
   from the overall completion backlog.

Do not label the entire Figma file or the production service complete when
only the integration demo acceptance criteria pass. In-scope controls must
work. Controls whose destination belongs to a deferred subsystem must have
an explicit unavailable/demo state, not silently do nothing or navigate to
an unrelated page. Never use example.com as a real service destination.

## Design Authority

Figma file: Dc1bPoXX1VoB9v1MtLvu8e.

- Page 6031:5860, CerifiO ID integration: primary integration reference.
- Page 0:1, Current design: existing portal references, not an instruction
  to rebuild every historical screenshot as a new route.

Record each approved frame with its node ID, service, state, route, viewport,
implementation status, and deviations in the existing design inventory.
Read live design context and screenshots before implementing each screen.
Keep Figma access read-only. Do not modify the designer's file.

Confirmed additions from the live audit:

| Screen or group | Figma node |
| --- | --- |
| Desktop-to-mobile handoff | 6217:62059 |
| Resident provider capture group | 6088:32338 |
| Driver and Vehicle prerequisite confirmed | 6217:81644 |
| Current verified Driver and Vehicle frame | 6257:72314 |
| StudentAidNL service | 6206:25424 |
| StudentAidNL prerequisites | 6206:27501, 6206:27601 |
| StudentAidNL non-resident declaration | 6217:35183 |
| Non-resident document selection | 6217:66072 |
| Non-resident document capture | 6217:76798, 6217:66154 |
| StudentAidNL prerequisite confirmed | 6217:80071 |

Frames may be variants, reused instances, or provider-owned screens; a frame
is not automatically a distinct route. Resolve duplicated confirmation
frames through their service context. The StudentAidNL service screenshot
contains Driver and Vehicle subtitle copy; record a proposed service-specific
correction for approval rather than copying misleading text silently.

## Connected Journeys

Resident journey:

Demo login -> dashboard -> Driver and Vehicle -> prerequisite/provider choice
-> device handoff -> terms -> biometric consent -> country/document choice
-> provider instructions and required captures -> verification result
-> provider processing -> prerequisites confirmed -> onboarding confirmation
-> verified Driver and Vehicle service.

Non-resident journey:

Demo login -> dashboard -> StudentAidNL -> prerequisites/provider choice
-> declaration of no provincial credential -> device handoff -> terms
-> biometric consent -> country/passport choice -> provider instructions
and required capture -> verification result -> provider processing
-> prerequisites confirmed -> onboarding confirmation -> StudentAidNL
with its portal action unlocked.

The above is the proposed transition order. Confirm exact frame-to-frame
transitions while reading the live prototype; record discrepancies rather
than inventing an extra business step. Preserve the removed welcome screen
as removed unless current design evidence explicitly restores it.

MCP and MRD choices must be selectable. Without approved provider screens
and contracts, those choices use an explicitly simulated provider result,
not invented production forms or requests to government systems.

## Architecture and State

Keep Next.js App Router, static export, React, TypeScript, Tailwind, existing
branding, and existing shared chrome/wizard components. Read installed Next.js
documentation before product edits. Avoid a framework rewrite.

Replace the global verified boolean with service-scoped journey state:
originating service, selected provider, document type/country, consent flags,
current step, demo outcome, and per-service onboarding completion. Persist
only synthetic state in sessionStorage, with a versioned schema and guarded
parsing. Do not persist document images, biometric material, or passwords.

Use a central transition function and service configuration for allowed
steps and return destinations. Pages render state and dispatch explicit
actions; they must not independently guess the next route. Shared CID
pages retain the originating service. Return targets must come from a
fixed internal allowlist, never an arbitrary URL query parameter.

Use a small provider interface with a deterministic demo implementation:
start an attempt, return pending/success/failure/cancelled, and reset it.
UI components must not contain provider secrets or assume timers prove
identity. A future server integration can replace this implementation;
that future integration is not represented as delivered here.

The existing verified=1 shortcut must not grant normal journey completion.
If retained for screenshot fixtures, isolate it behind an explicit demo
preview mechanism and document that it is not an authorization boundary.
Completing one service must not automatically onboard the other.

## Demo Provider and Handoff

Figma identifies the capture UI as a Yoti embed. Model its host and result
contract rather than implementing an identity-validation engine. The demo
uses synthetic document/capture examples with controllable outcomes. It
must not ask attendees to upload real documents or provide biometrics.

On desktop show the designed handoff and continue-on-computer action.
On mobile continue locally. Any QR code must encode a usable demo URL with
non-sensitive configuration, not pretend that sessionStorage synchronizes
across devices. A scanned phone can start the equivalent synthetic journey;
live cross-device result synchronization requires a backend and is outside
this static demo. Disclose this limitation in presenter documentation and
any demo-specific handoff copy that would otherwise promise live transfer.

Pending, failure, cancellation, and retry are deterministic demo outcomes.
Provide presenter-only controls without adding decorative UI to the
designed screens. Default to success for the dry run. Reset must restore
a predictable initial state and remove completed-service flags.

## Navigation and Recovery

- Back follows the previous valid step of the current service journey.
- Cancel returns to the originating service without setting it trusted.
- Declining consent never advances to capture or success.
- Refresh restores a valid current step without skipping prerequisites.
- Missing or malformed state sends the user to the service prerequisites.
- Direct links cannot manufacture a successful result in the ordinary demo.
- Retry starts a new attempt while retaining the service and allowed choices.
- A failed or pending provider result cannot unlock the service.
- Logout clears demo journey state and returns to login.
- Success returns to the correct service and preserves its completed state.

Links labelled as a specific transaction, such as licence renewal, must
reach that transaction's approved destination or clearly state its demo
availability. A link to the general service page cannot be presented as a
completed renewal journey. StudentAid portal access follows the same rule.

## Responsive and Accessible Behaviour

Preserve the completed responsive improvements and shared visual language.
Use semantic buttons, links, form labels, fieldsets and radio groups for
interactive choices. Provide visible focus, keyboard operation, announced
validation/status changes, and sensible focus after navigation. Do not
hide horizontal overflow to mask layout defects.

Exercise every new route at 320, 390, 768, 1024, 1440 and 1920 CSS pixels,
plus landscape and the existing reflow checks. Resolve real asset exports
where available. Track any remaining placeholder explicitly.

## Developer Handoff

Document setup/build/preview commands, the service and route map, state and
provider contracts, fixture data, reset/outcome controls, and a concise
dry-run script for both journeys. Explain how to map Figma nodes to existing
components, retrieve context and assets, inspect changes, and validate
screens without editing Figma or overwriting unrelated code.

Separate what developers can reuse now from production work still needed:
authentication and server sessions, authorization, provider SDK and callback
validation, cross-device sessions, consent records, privacy/retention,
service eligibility, external service APIs, monitoring, and security review.

## Acceptance Criteria

- Both journeys complete using visible controls and return to their service.
- Neither journey skips document/provider steps after consent.
- Prerequisite confirmation is distinct from final onboarding confirmation.
- Service state stays isolated across switching, cancellation and refresh.
- Success, pending, failure, retry, declined consent, logout, malformed
  storage, and direct-link recovery have executable checks.
- Existing and new routes pass build/type checks and responsive checks.
- Keyboard tests cover choices, consent, capture simulation and completion.
- Every integration frame has an implemented mapping, an explicitly approved
  shared variant, or a documented provider-owned/demo limitation.
- Screenshot captures and Figma visual comparisons are reported separately;
  missing reference images cannot count as a passing visual comparison.
- No real credentials, documents, biometrics or transactions are processed.
- Developer handoff and dry-run instructions match the implemented behaviour.

## Review and Delivery Gates

This document is the proposed scope, not a claim that implementation is
complete. Review and approve it before the detailed implementation plan.
Review that plan and select execution mode before product changes. Keep
the wider-portal subsystem visible as a subsequent specification; completing
this delivery does not close those remaining designs. Do not commit, push,
change branches, or modify Figma without explicit authorization.