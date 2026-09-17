import type { ResumeWithSections } from "@/types";

/**
 * A single, realistic seed resume so the client demo never opens to an empty
 * state. Persisted into the local resume store on first load; after that,
 * anything the visitor edits lives in their browser's localStorage.
 */
export function createDemoResume(): ResumeWithSections {
  const now = new Date().toISOString();

  return {
    id: "demo-resume-1",
    title: "Product Designer Resume",
    templateId: "modern",
    status: "DRAFT",
    isFavorite: true,
    data: {
      fullName: "Alex Rivera",
      email: "alex.rivera@example.com",
      phone: "(415) 555-0182",
      location: "San Francisco, CA",
      website: "alexrivera.design",
    },
    createdAt: now,
    updatedAt: now,
    sections: [
      {
        id: "sec-summary",
        type: "SUMMARY",
        title: "Summary",
        order: 0,
        content: {
          text: "Product designer with 6 years of experience shipping consumer and B2B interfaces end to end. Known for turning ambiguous problems into clear, tested flows, and for pairing closely with engineering to ship on time.",
        },
      },
      {
        id: "sec-experience",
        type: "EXPERIENCE",
        title: "Experience",
        order: 1,
        content: {
          entries: [
            {
              title: "Senior Product Designer",
              subtitle: "Fenwick & Co.",
              period: "Mar 2022 — Present",
              description:
                "Led design for the onboarding and billing surfaces used by 40k+ monthly active accounts. Cut new-user drop-off by 22% by redesigning the setup flow, and partnered with engineering to ship a design system now used across 5 product teams.",
            },
            {
              title: "Product Designer",
              subtitle: "Loop Inc.",
              period: "Jul 2019 — Feb 2022",
              description:
                "Owned end-to-end design for the mobile app's search and discovery experience. Ran quarterly usability studies that directly shaped the roadmap, and shipped a redesigned results page that improved click-through by 15%.",
            },
          ],
        },
      },
      {
        id: "sec-education",
        type: "EDUCATION",
        title: "Education",
        order: 2,
        content: {
          entries: [
            {
              title: "B.A. in Human-Computer Interaction",
              subtitle: "University of Washington",
              period: "2015 — 2019",
              description: "",
            },
          ],
        },
      },
      {
        id: "sec-skills",
        type: "SKILLS",
        title: "Skills",
        order: 3,
        content: {
          items: [
            "Figma",
            "Design Systems",
            "User Research",
            "Prototyping",
            "Interaction Design",
            "Accessibility (WCAG)",
          ],
        },
      },
      {
        id: "sec-projects",
        type: "PROJECTS",
        title: "Projects",
        order: 4,
        content: {
          entries: [
            {
              title: "Component Library Rebuild",
              subtitle: "Personal / open source",
              period: "2023",
              description:
                "Rebuilt a Figma-to-code component library used by three side projects, cutting handoff time for new screens from days to hours.",
            },
          ],
        },
      },
    ],
  };
}
