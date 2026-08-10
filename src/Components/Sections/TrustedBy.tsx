import React from "react";
import { SectionTitle } from "../ui/SectionTitle";
import { Reveal } from "../ui/Reveal";

const TRUST_PARTNERS = [
  "Gas Safe",
  "NICEIC",
  "TrustMark",
  "Checkatrade",
  "CHAS",
  "NAPIT",
  "Federation of Master Builders",
  "SafeContractor",
  "Constructionline",
  "Which? Trusted Traders",
  "Trustpilot",
  "British Gas Approved",
];

export const TrustedBy: React.FC = () => {
  return (
    <section className="bg-white  dark:bg-black py-8 md:py-12 z-0">
      <div className="container-lh">
        <SectionTitle
          badge
          eyebrow="Trusted & Certified"
          title="Trusted by leaders"
          subtitle="Every LocalHero professional meets recognised industry standards for safety, quality and reliability."
        />

        <Reveal delay={0.15}>
          <div className="relative mt-8 md:mt-14 w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-linear-to-r from-white dark:from-black to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-linear-to-l from-white dark:from-black to-transparent" />
            <div className="flex w-max marquee-track py-2">
              {[0, 1].map((dup) => (
                <div
                  key={dup}
                  aria-hidden={dup === 1}
                  className="flex shrink-0 items-center gap-4 pr-4"
                >
                  {TRUST_PARTNERS.map((partner) => (
                    <div
                      key={partner}
                      className="group flex h-20 items-center justify-center  dark:bg-navy-800 rounded-2xl border border-neutral-200 bg-white px-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl dark:border-white/10 "
                    >
                      <span className="text-xl uppercase font-semibold text-navy-900 transition-colors duration-300 group-hover:text-primary dark:text-white">
                        {partner}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};