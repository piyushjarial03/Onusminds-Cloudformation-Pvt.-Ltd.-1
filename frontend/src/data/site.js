import { SERVICES } from "./services";

export const CONTACT = {
  email: "hello@onusminds.com",
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  whatsapp: "https://wa.me/919876543210?text=Hi%20OnusMinds%2C%20I%27d%20like%20to%20start%20a%20conversation.",
};

export const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "X / Twitter", href: "https://x.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
];

export const NAV = [
  { label: "Home", to: "/" },
  {
    label: "Company",
    children: [
      { label: "About Us", to: "/company/about" },
      { label: "Vision & Mission", to: "/company/vision-mission" },
      { label: "Timeline & Milestones", to: "/company/timeline" },
      { label: "Our Presence", to: "/company/presence" },
    ],
  },
  {
    label: "Services",
    children: SERVICES.map((s) => ({ label: s.title, to: `/services/${s.slug}`, meta: s.discipline })),
  },
  {
    label: "Resources",
    children: [
      { label: "Careers", to: "/careers" },
      { label: "News & Media", to: "/news" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
];
