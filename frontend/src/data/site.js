import { SERVICES } from "./services";

export const CONTACT = {
  email: "info@onusminds.com",
  phone: "+91 78077 22158",
  phoneHref: "tel:+917807722158",
  whatsapp: "https://wa.me/917807722158?text=Hi%20OnusMinds%2C%20I%27d%20like%20to%20start%20a%20conversation.",
  whatsappNumber: "+91 78077 22158",
  linkedin: "https://www.linkedin.com/company/onusminds-cloudformation-pvt-ltd/",
};

export const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/onusminds-cloudformation-pvt-ltd/" },
];

export const NAV = [
  { label: "Home", to: "/" },
  {
    label: "Company",
    children: [
      { label: "About Us", to: "/company/about" },
      { label: "Vision & Mission", to: "/company/vision-mission" },
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
