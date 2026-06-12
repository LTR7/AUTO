import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Manifesto } from "@/components/sections/Manifesto";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { Projects } from "@/components/sections/Projects";
import { WhoShouldJoin } from "@/components/sections/WhoShouldJoin";
import { Culture } from "@/components/sections/Culture";
import { Statement } from "@/components/sections/Statement";
import { Join } from "@/components/sections/Join";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <About />
      <Manifesto />
      <WhatWeDo />
      <Projects />
      <WhoShouldJoin />
      <Culture />
      <Statement />
      <Join />
    </main>
  );
}
