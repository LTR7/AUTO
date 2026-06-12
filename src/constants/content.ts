import type {
  AboutPillar,
  Activity,
  CtaLink,
  CultureValue,
  Microcopy,
  Principle,
  Profile,
  Project,
  Statement,
} from "@/types/content";
import { APPLY_URL, contact } from "@/constants/social";

export const hero = {
  headlineLead: "AUTO",
  headlineRest: ["The Agentic AI Club", "for Builders"],
  subhead:
    "We build, experiment, and execute at the frontier of autonomous systems, agentic workflows, and AI orchestration.",
  primaryCta: { label: "Apply to Join", href: "#join" } satisfies CtaLink,
  secondaryCta: { label: "Read Manifesto", href: "#manifesto" } satisfies CtaLink,
  scrollLabel: "Scroll",
};

export const about = {
  heading: "What is AUTO?",
  body:
    "AUTO is a campus organization for students who want to understand, build, and deploy agentic AI systems rather than passively observe technological change. We are not a lecture series or a networking club — we are a group of operators, engineers, and researchers designing and shipping real systems.",
  pillars: [
    {
      title: "Not Theory. Execution.",
      body: "We ship agentic systems. Every meeting, every project, every experiment moves toward something real and tangible.",
    },
    {
      title: "Drive Over Credentials",
      body: "Your GPA does not matter here. Your output does. We value relentless curiosity and a bias toward action above all else.",
    },
    {
      title: "Frontier by Default",
      body: "We operate at the leading edge of autonomous systems, multi-agent orchestration, and AI-native workflows.",
    },
  ] satisfies AboutPillar[],
};

export const manifesto = {
  eyebrow: "Manifesto",
  heading: "The principles that drive everything we do",
  principles: [
    {
      number: "01",
      title: "We Build, We Are Proactive, We Execute",
      body: "This is for people that fear inertia, inaction, and complacency. We act on the remarkable innovations of this world and participate in them, not merely observe. We are driven to be at the cutting edge of agents because we know they are the future, and being ignorant of it is a precursor for a mediocre and oblivious life.",
    },
    {
      number: "02",
      title: "We Are Nimble, Open-Minded, and Adaptable",
      body: "We are aware of what is happening around us and willing and able to adapt to ensure we are equipped with the knowledge and skillset to be at the forefront of change. We do not cling to familiar tech stacks when the evolution of technology demands adaptation, because we understand how important it is to keep evolving as engineers and orchestrators.",
    },
    {
      number: "03",
      title: "We Value Engagement, Enthusiasm, and Drive Above All",
      body: "We value participation, collaboration, and engagement because they reflect your care for being in this club and your passion for this field. This is not a place for bystanders; it is a place of executors, of people who think about agents obsessively, day and night, with fascination for how to incorporate it into everyday life.",
    },
    {
      number: "04",
      title: "We Seek the Crazy, the Misunderstood, and the Ignored",
      body: "We want those at the forefront of agentic orchestration. We want those building systems which sound strange and exotic to the average person, even to the average engineer. This is where the extraordinary becomes ordinary and where the misunderstood are understood.",
    },
  ] satisfies Principle[],
};

export const whatWeDo = {
  heading: "How we operate",
  intro: "Every activity is designed around execution, not observation.",
  activities: [
    {
      title: "Agentic AI Workshops",
      description: "Hands-on sessions covering agent frameworks, tool use, memory, and multi-step reasoning.",
    },
    {
      title: "AI Automation Projects",
      description: "End-to-end projects building automated workflows that solve real problems.",
    },
    {
      title: "Research Discussions",
      description: "Deep dives into frontier papers on autonomous agents, planning, and orchestration.",
    },
    {
      title: "Startup & Investing Applications",
      description: "Exploring how agentic AI reshapes markets, companies, and investment theses.",
    },
    {
      title: "Member-Led Experiments",
      description: "Members pitch and lead their own experiments, then present findings to the group.",
    },
  ] satisfies Activity[],
};

export const projects = {
  eyebrow: "Projects",
  heading: "What we build",
  intro: "Real systems. Real experiments. Nothing hypothetical.",
  items: [
    {
      title: "Personal AI Agents",
      description: "Autonomous assistants that learn user context, manage tasks, and act across tools without supervision.",
      tags: ["autonomy", "personalization"],
    },
    {
      title: "Research Automation Agents",
      description: "Intelligent systems for literature review, hypothesis generation, and structured data extraction.",
      tags: ["research", "automation"],
    },
    {
      title: "Campus Workflow Automation",
      description: "Agentic pipelines that eliminate repetitive campus processes across scheduling, communication, and operations.",
      tags: ["operations", "real-world"],
    },
    {
      title: "Investment Research Agents",
      description: "Multi-agent systems for market research, document analysis, and investment thesis generation.",
      tags: ["finance", "orchestration"],
    },
    {
      title: "Multi-Agent Systems",
      description: "Collaborative agent networks where specialized subagents work in parallel toward shared objectives.",
      tags: ["multi-agent", "advanced"],
    },
    {
      title: "AI Productivity Stacks",
      description: "End-to-end AI-native workflows that eliminate friction across knowledge work and creative production.",
      tags: ["productivity", "ai-native"],
    },
  ] satisfies Project[],
};

export const whoShouldJoin = {
  heading: "Drive and execution matter more than credentials",
  intro:
    "We don't care where you go to school or what your GPA is. We care about what you make, what you're obsessed with, and whether you show up and ship.",
  profiles: [
    { role: "Engineers", description: "CS, ECE, and adjacent — people who can build and want to build agents." },
    { role: "Researchers", description: "Those who want to understand how autonomous systems actually work." },
    { role: "Founders", description: "Builders thinking about AI-native products, companies, or workflows." },
    { role: "Operators", description: "People who want to deploy AI to solve operational and process problems." },
    { role: "Designers", description: "Those reimagining interfaces and experiences for AI-native systems." },
    { role: "Obsessives", description: "Anyone who cannot stop thinking about what agents will make possible." },
  ] satisfies Profile[],
};

/** Full-bleed typographic statement band (copy promoted from whoShouldJoin's closing). */
export const statement = {
  lines: [
    "No passive membership.",
    "No resume fillers.",
    "Just builders and executors who want to be at the frontier.",
  ],
  highlight: "frontier.",
} satisfies Statement;

export const microcopy = {
  heroStatus: "agents: online",
  projectsPrompt: "$ auto run --list projects",
  joinStatus: "recruiting: open",
} satisfies Microcopy;

export const culture = {
  eyebrow: "Culture",
  intro:
    "A movement for people who want to participate in the future, not observe it. We chose initiative over comfort and execution over theory.",
  values: [
    { title: "High Agency", description: "Members own their work end-to-end. No waiting for permission, no blaming circumstances." },
    { title: "Fast Iteration", description: "Ship, learn, repeat. We adapt faster than the technology changes around us." },
    { title: "Obsession with Learning", description: "Continuous depth-first exploration of frameworks, papers, tools, and paradigms." },
    { title: "Open-Mindedness", description: "The stranger the idea, the more seriously we take it. Conventional wisdom is a speed limit." },
    { title: "Bias Toward Action", description: "Execution beats deliberation. A working prototype beats a perfect plan." },
    { title: "No Passive Membership", description: "Everyone builds. Everyone contributes. Passive presence is not participation." },
  ] satisfies CultureValue[],
};

export const join = {
  heading: "If you are not satisfied watching the future happen from the sidelines.",
  body:
    "We are actively looking for builders, engineers, researchers, and visionaries who are obsessed with agentic AI and want to push the boundaries of what autonomous systems can do.",
  socialPrompt: {
    before: "Follow us on ",
    linkLabel: "LinkedIn",
    after: " for updates and announcements.",
  },
  primaryCta: { label: "Apply Now", href: APPLY_URL } satisfies CtaLink,
  secondaryCta: { label: "Contact Us", href: `mailto:${contact.email}` } satisfies CtaLink,
};
