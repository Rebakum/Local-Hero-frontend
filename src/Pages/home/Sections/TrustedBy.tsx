import React from "react";
import { SectionTitle } from "@/src/Components/ui/SectionTitle";
import { Reveal } from "@/src/Components/ui/Reveal";

interface TrustPartner {
  id: string;
  name: string;
  logo: React.ReactNode;
}

const Logo = ({ children }: { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
    aria-hidden
  >
    {children}
  </svg>
);


const TRUST_PARTNERS: TrustPartner[] = [
  {
    id: "gas-safe",
    name: "Gas Safe",
    logo: (
      <Logo>
        <path d="M20 6c-4 5-7 8.5-7 13a7 7 0 0014 0c0-1.8-.5-3.5-1.4-5-.4 2.6-1.7 4.3-3.4 5.1.2-2-.3-4.2-1.3-6.4-.7-1.6-1.4-3.5-1.9-6.7z" />
        <circle cx="20" cy="20.5" r="2.4" fill="currentColor" stroke="none" />
      </Logo>
    ),
  },
  {
    id: "niceic",
    name: "NICEIC Approved",
    logo: (
      <Logo>
        <rect x="8" y="6" width="24" height="28" rx="6" />
        <path d="M22 11l-8 12h5.5l-1.5 8 8-12h-5.5l1.5-8z" fill="currentColor" stroke="none" />
      </Logo>
    ),
  },
  {
    id: "trustmark",
    name: "TrustMark",
    logo: (
      <Logo>
        <path d="M20 4 34 8.5V19c0 8.7-5.6 14.3-14 17-8.4-2.7-14-8.3-14-17V8.5L20 4z" />
        <path d="M13.5 20l4.5 4.5L27 15" />
      </Logo>
    ),
  },
  {
    id: "checkatrade",
    name: "Checkatrade",
    logo: (
      <Logo>
        <rect x="5" y="5" width="30" height="30" rx="9" />
        <path d="M12 20l5.5 5.5L28 15" strokeWidth={2.4} />
      </Logo>
    ),
  },
  {
    id: "chas",
    name: "CHAS Accredited",
    logo: (
      <Logo>
        <path d="M8 18l12-9 12 9" />
        <path d="M11 17v11a2 2 0 002 2h14a2 2 0 002-2V17" />
        <path d="M17 30v-6a3 3 0 016 0v6" />
      </Logo>
    ),
  },
  {
    id: "napit",
    name: "NAPIT",
    logo: (
      <Logo>
        <path d="M15 6v9M25 6v9" />
        <path d="M12 15h16v5a8 8 0 01-8 8 8 8 0 01-8-8v-5z" />
        <path d="M20 28v6" />
      </Logo>
    ),
  },
  {
    id: "fmb",
    name: "Master Builders",
    logo: (
      <Logo>
        <path d="M9 31l9-9" />
        <path d="M15 19l-3.5-3.5a2.5 2.5 0 013.5-3.5L18.5 15" />
        <path d="M18.5 15L27 6.5c1-1 2.5-1 3.5 0l1 1c1 1 1 2.5 0 3.5L23 19" />
        <circle cx="26" cy="28" r="5.5" />
      </Logo>
    ),
  },
  {
    id: "safecontractor",
    name: "SafeContractor",
    logo: (
      <Logo>
        <path d="M20 4l11 4V19c0 7.6-4.5 12.6-11 15-6.5-2.4-11-7.4-11-15V8l11-4z" />
        <path d="M15 20l3.5 3.5L26 16" />
      </Logo>
    ),
  },
  {
    id: "constructionline",
    name: "Constructionline",
    logo: (
      <Logo>
        <path d="M9 34V13l9-6 13 5v22" />
        <path d="M9 34h22" />
        <path d="M14 34V22h6v12" />
        <path d="M24 34v-7h5v7" />
        <path d="M14 15h4M14 19h4" />
      </Logo>
    ),
  },
  {
    id: "which",
    name: "Which Trusted",
    logo: (
      <Logo>
        <circle cx="20" cy="18" r="12" />
        <path d="M16.5 15.2a3.5 3.5 0 116.2 2.2c-.9 1-2.2 1.5-2.2 3.1" />
        <circle cx="20.5" cy="24.5" r="0.2" fill="currentColor" strokeWidth={2.4} />
        <path d="M12 33l3-5.5M28 33l-3-5.5" />
      </Logo>
    ),
  },
  {
    id: "fensa",
    name: "FENSA Registered",
    logo: (
      <Logo>
        <rect x="7" y="7" width="26" height="26" rx="3" />
        <path d="M7 16h26M16 7v26" />
        <path d="M22 22l3 3" />
      </Logo>
    ),
  },
  {
    id: "watersafe",
    name: "WaterSafe",
    logo: (
      <Logo>
        <path d="M20 6c5 6 9 11 9 16a9 9 0 01-18 0c0-5 4-10 9-16z" />
        <path d="M15 24a5 5 0 005 5" />
      </Logo>
    ),
  },
];

export const TrustedBy: React.FC = () => {
  return (
    <section className="bg-white section-pad dark:bg-black border-y border-navy-100/60 dark:border-white/10">
      <div className="container-lh">
        <SectionTitle
          badge
          eyebrow="Trusted & Certified"
          title="Trusted by leaders"
          subtitle="Every LocalHero professional meets recognised industry standards for safety, quality and reliability."
        />

        <Reveal delay={0.15}>
          <div className="relative mt-8 w-full overflow-hidden md:mt-14">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent sm:w-28 dark:from-black" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent sm:w-28 dark:from-black" />

            <div className="flex w-max marquee-track py-2">
              {[0, 1].map((dup) => (
                <div
                  key={dup}
                  aria-hidden={dup === 1}
                  className="flex shrink-0 items-center gap-4 pr-4"
                >
                  {TRUST_PARTNERS.map((partner) => (
                    <div
                      key={`${dup}-${partner.id}`}
                      className="group relative flex h-24 w-44 shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white px-4 text-center shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800"
                    >
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="flex h-8 w-8 sm:h-8 sm:w-8 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-glow">
                        {partner.logo}
                      </div>
                      <p className="w-full truncate text-sm font-semibold text-navy-900 transition-colors duration-300 group-hover:text-primary dark:text-white">
                        {partner.name}
                      </p>
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