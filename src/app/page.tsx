import { LoginHeader } from "@/components/chrome/LoginHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { LoginForm } from "@/components/login/LoginForm";

/*
 * gnwt-login-page — Figma 20:23088 (1920 x 1238). release-2, 2026-11-16.
 * Spec A §5.
 *
 *   header (unauthenticated, 99)   → <LoginHeader />
 *   HeroSection 11:23118 (672)     white, pt 48 / pb 24, LoginCard centred
 *   footer (466.71)                → <SiteFooter variant="desktop" />
 *
 * LoginCard 11:23119 — 921 x 600: 1px #8B8D90 border, radius 6, the
 * "gnwt-drop shadow" (0 8 16 #00000026), padding 32, flex-col centred, gap 24:
 *   1. two-line title, Bold 26
 *   2. intro block 16:24898 (two links, real, new tab)
 *   3. main content 11:24885 — row, gap 32:
 *        left panel 11:24886 (397 wide, "First time…" + Reset Password)
 *        login fields 11:24884 (428 wide) → <LoginForm />, the one client part
 *
 * RESPONSIVE: the card is `w-full max-w-[921px]`; from 768 up its two columns
 * shrink proportionally, below 768 they stack (left panel first, as in the
 * DOM). Under 480 the card and panel paddings drop to 16 so a 320 screen has
 * no horizontal scroll.
 */

const LINK =
  "text-[#005d8f] underline decoration-solid decoration-from-font [text-underline-position:from-font] hover:text-[#001f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]";

/** Left panel 11:24886 — for NTKey / Interac users. Reset Password is inert. */
function FirstTimePanel() {
  return (
    <div
      className="box-border flex w-[397px] min-w-0 shrink flex-col items-center justify-center rounded-[6px] bg-white px-[24px] py-[44px] text-center text-[#333333] shadow-[0_8px_8px_rgba(0,0,0,0.15)] max-md:w-full max-md:py-[32px] max-xs:px-[16px]"
      data-node-id="11:24886"
    >
      <h2 className="text-[20px] font-bold leading-[1.5]">
        First time on this page and
        <br />
        already have an account?
      </h2>
      <div className="w-full max-w-[349px] pt-[24px] pb-[8px]">
        <p className="text-[16px] font-bold leading-[1.5] [word-break:break-word]">
          If you used NTKey or Interac (Banking) Sign-in before, you will need
          to verify your email and set a new password.
        </p>
      </div>
      {/* No password-reset screen exists in the demo — inert (toast). */}
      <button
        type="button"
        className={`box-border flex min-h-[46px] w-[300px] max-w-full cursor-pointer items-center justify-center rounded-[6px] bg-[rgba(25,135,84,0.2)] p-[8px] text-[20px] font-bold leading-[1.5] ${LINK}`}
        data-demo-inert="true"
      >
        Reset Password to Continue
      </button>
    </div>
  );
}

function HeroSection() {
  return (
    <section
      className="flex w-full flex-col items-center bg-white px-[24px] pt-[48px] pb-[24px] max-md:px-[16px] max-md:pt-[32px]"
      data-node-id="11:23118"
    >
      <div
        className="box-border flex w-full max-w-[921px] flex-col items-center gap-[24px] rounded-[6px] border border-solid border-[#8b8d90] bg-white p-[32px] shadow-[0_8px_16px_rgba(0,0,0,0.15)] max-xs:p-[16px]"
        data-node-id="11:23119"
      >
        <h1 className="w-full text-center text-[26px] font-bold leading-[1.5] text-[#333333] [word-break:break-word] max-xs:text-[22px]">
          <span className="block">Welcome to the</span>
          <span className="block">Northwest Territories eServices Portal</span>
        </h1>

        {/* Intro block 16:24898 */}
        <div
          className="flex flex-col items-center gap-[16px] text-center text-[16px] font-bold leading-[1.5] text-[#333333]"
          data-node-id="16:24898"
        >
          <p>
            We have improved security
            <br />
            and made it easier to access
            <br />
            <a
              href="https://www.gov.nt.ca/en/participating-online-eservices"
              target="_blank"
              rel="noreferrer"
              className={LINK}
            >
              these online services.
            </a>
          </p>
          <a
            href="https://www.gov.nt.ca/en/nwt-eservices-portal-help"
            target="_blank"
            rel="noreferrer"
            className={LINK}
          >
            NWT eServices Help Page
          </a>
        </div>

        {/* Main content 11:24885 */}
        <div
          className="flex w-full max-w-[857px] items-start gap-[32px] max-md:flex-col max-md:items-stretch"
          data-node-id="11:24885"
        >
          <FirstTimePanel />
          <LoginForm />
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <div className="gnl-desktop-shell">
      <LoginHeader />
      <main className="flex w-full flex-col">
        <HeroSection />
      </main>
      <SiteFooter variant="desktop" />
    </div>
  );
}
