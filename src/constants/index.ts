export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "ZKR Resume AI";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const FOOTER_LINKS = {
  twitter: "https://x.com/zkr_ad",
  github: "https://github.com/zr7791474-blip",
  whatsapp: "https://wa.me/212657516301",
  instagram: "https://instagram.com/zkr_ad",
  email: "zr7791474@gmail.com",
} as const;

export const PUBLIC_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export const DASHBOARD_NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/resumes", label: "My Resumes" },
  { href: "/dashboard/templates", label: "Templates" },
] as const;

export const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/templates", label: "Templates" },
] as const;

export const SECTION_TYPES = [
  { value: "PERSONAL_INFO", label: "Personal Info" },
  { value: "SUMMARY", label: "Summary" },
  { value: "EXPERIENCE", label: "Experience" },
  { value: "EDUCATION", label: "Education" },
  { value: "SKILLS", label: "Skills" },
  { value: "LANGUAGES", label: "Languages" },
  { value: "PROJECTS", label: "Projects" },
  { value: "CERTIFICATIONS", label: "Certifications" },
  { value: "AWARDS", label: "Awards" },
  { value: "INTERESTS", label: "Interests" },
  { value: "REFERENCES", label: "References" },
] as const;
