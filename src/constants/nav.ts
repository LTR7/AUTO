import type { CtaLink, FooterLinkGroup, NavLink } from "@/types/content";
import { APPLY_URL, contact, socials } from "@/constants/social";

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Manifesto", href: "#manifesto" },
  { label: "Projects", href: "#projects" },
  { label: "Culture", href: "#culture" },
];

export const navCta: CtaLink = { label: "Apply Now", href: "#join" };

export const footer = {
  tagline: "The Agentic AI Club. Built for builders at the frontier.",
  groups: [
    {
      title: "Navigate",
      links: [
        { label: "About", href: "#about" },
        { label: "Manifesto", href: "#manifesto" },
        { label: "Projects", href: "#projects" },
        { label: "Culture", href: "#culture" },
        { label: "Join", href: "#join" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "LinkedIn", href: socials.linkedin },
        { label: "Email", href: `mailto:${contact.email}` },
        { label: "Apply", href: APPLY_URL },
      ],
    },
  ] satisfies FooterLinkGroup[],
  copyright: "© 2026 AUTO - The Agentic AI Club",
  rightTagline: "Building agents that build the future",
  watermark: "AUTO",
};
