import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import { SERVICES as FALLBACK_SERVICES } from "../data/services";

export const DEFAULT_CONTENT = {
  logo_url: "",
  hero_eyebrow: "IT Services & Consulting / Digital Marketing",
  hero_title: "Cloud Infrastructure.\nScale with ease,\nperform with speed.\nBuilt to grow\nwith the cloud.",
  hero_text:
    "OnusMinds unites two disciplines under one engagement — the engineers who keep your platform alive, and the marketers who make it matter.",
  overview_title: "Two disciplines.\nOne engagement.",
  capabilities_title: "What we do\nexceptionally well",
  request_title: "Tell us what\nyou're building",
  request_text:
    "One form, one business day. A senior engineer or strategist — never a salesperson — replies with a point of view on your problem.",
  contact_email: "info@onusminds.com",
  contact_phone: "+91 78077 22158",
  whatsapp_number: "+91 78077 22158",
  nav_cta: "Start a conversation",
  footer_credit: "© 2026 OnusMinds. All rights reserved.",
  footer_blurb: "Two disciplines. One engagement. Infrastructure that holds, marketing that moves — under one roof.",
  linkedin_url: "https://www.linkedin.com/company/onusminds-cloudformation-pvt-ltd/",
  stat_1_value: "12+", stat_1_label: "Projects delivered",
  stat_2_value: "6", stat_2_label: "Active clients",
  stat_3_value: "24h", stat_3_label: "Support coverage",
  stat_4_value: "2", stat_4_label: "Disciplines, one team",
};

export const whatsappLink = (number) =>
  `https://wa.me/${(number || "").replace(/\D/g, "")}?text=Hi%20OnusMinds%2C%20I%27d%20like%20to%20start%20a%20conversation.`;

const SiteCtx = createContext({ content: DEFAULT_CONTENT, services: FALLBACK_SERVICES, refresh: () => {} });

export const useSite = () => useContext(SiteCtx);

export const SiteProvider = ({ children }) => {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [services, setServices] = useState(FALLBACK_SERVICES);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/content");
      setContent({ ...DEFAULT_CONTENT, ...data });
    } catch (e) {}
    try {
      const { data } = await api.get("/services");
      if (data && data.length) setServices(data);
    } catch (e) {}
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <SiteCtx.Provider value={{ content, services, refresh }}>{children}</SiteCtx.Provider>;
};
