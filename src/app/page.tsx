import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Manifesto } from "@/components/sections/Manifesto";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { Projects } from "@/components/sections/Projects";
import { Culture } from "@/components/sections/Culture";
import { Statement } from "@/components/sections/Statement";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <About />
      <Manifesto />
      <WhatWeDo />
      <Projects />
      <Culture />
      <Statement />
    </main>
  );
}
