/** Shared content types. Section copy lives in src/constants/content.ts. */

export interface NavLink {
  label: string;
  href: string;
}

export interface CtaLink {
  label: string;
  href: string;
}

export interface AboutPillar {
  title: string;
  body: string;
}

export interface Principle {
  number: string;
  title: string;
  body: string;
}

export interface Activity {
  title: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
}

export interface Profile {
  role: string;
  description: string;
}

export interface CultureValue {
  title: string;
  description: string;
}

export interface FooterLinkGroup {
  title: string;
  links: NavLink[];
}

export interface Statement {
  lines: string[];
  highlight: string;
}

export interface Microcopy {
  heroStatus: string;
  projectsPrompt: string;
}
