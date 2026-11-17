"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WIZARD_WELL } from "@/components/onboarding/gnwt-wizard";
import { getOnboardingCopy } from "@/lib/data/onboarding";
import type { ServiceConfig } from "@/lib/data/service-config";

/*
 * The RETIRED PP-08 "Other verification" route —
 * /services/[serviceId]/other-verification/.
 *
 * GNWT re-brand (release-2, 2026-11-16; gnwt-specs/B-wizard.md §4, §5.16):
 * neither GNWT flow has this step. The method step goes straight to the
 * CertifiO hand-off and nothing links here any more (FLOW_B no longer lists
 * it). The page is still prerendered so an old bookmark, or a presenter typing
 * the URL, does not 404: it replaces itself with this service's hand-off,
 * with a plain link as the no-JS fallback.
 */
export function OtherVerificationScreen({ service }: { service: ServiceConfig }) {
  const router = useRouter();
  const target = getOnboardingCopy(service).otherVerification.continueHref;

  useEffect(() => {
    router.replace(target);
  }, [router, target]);

  return (
    <div className="gnl-desktop-shell">
      <TopNav />
      <main className="w-full">
        <div className={WIZARD_WELL}>
          <p className="text-[16px] leading-[1.5] text-[#333333]">
            <Link
              href={target}
              replace
              className="font-bold text-[#005d8f] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]"
            >
              Continue to identity verification
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter variant="desktop" />
    </div>
  );
}
