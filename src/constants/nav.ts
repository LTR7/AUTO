import type { FooterLinkGroup, NavLink } from "@/types/content";
import { contact, socials } from "@/constants/social";

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Manifesto", href: "#manifesto" },
  { label: "Projects", href: "#projects" },
  { label: "Culture", href: "#culture" },
];

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
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "LinkedIn", href: socials.linkedin },
        { label: "Email", href: `mailto:${contact.email}` },
      ],
    },
  ] satisfies FooterLinkGroup[],
  copyright: "© 2026 AUTO - The Agentic AI Club",
  rightTagline: "Building agents that build the future",
  watermark: "AUTO",
};
