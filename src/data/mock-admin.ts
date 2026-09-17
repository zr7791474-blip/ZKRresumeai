import { MOCK_USERS } from "@/data/mock-users";
import { TEMPLATES } from "@/data/templates";

export interface MockActivity {
  id: string;
  message: string;
  timestamp: string;
}

/** Static stats for the /admin overview cards. Illustrative demo data only. */
export const MOCK_STATS = {
  userCount: 1284,
  resumeCount: 2931,
  templateCount: TEMPLATES.length,
  downloadCount: 5670,
  activeUsers30d: 412,
};

export const MOCK_ACTIVITY: MockActivity[] = [
  { id: "a1", message: "Sarah Chen exported \"Business Analyst Resume\" as PDF.", timestamp: "2026-02-14T09:32:00.000Z" },
  { id: "a2", message: "Noah Kim upgraded to the Pro plan.", timestamp: "2026-02-14T08:10:00.000Z" },
  { id: "a3", message: "Jordan Blake created a new resume from the Modern template.", timestamp: "2026-02-13T21:47:00.000Z" },
  { id: "a4", message: "Emma Wright joined ZKR Resume AI.", timestamp: "2026-02-13T16:05:00.000Z" },
  { id: "a5", message: "Michael Foster exported \"VP Operations Resume\" as DOCX.", timestamp: "2026-02-13T11:22:00.000Z" },
  { id: "a6", message: "David Martinez used the AI cover letter generator.", timestamp: "2026-02-12T19:58:00.000Z" },
];

export { MOCK_USERS };
