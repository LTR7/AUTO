/**
 * Hero scroll progress (0→1), shared at module level so the R3F frame loop
 * reads it without React re-renders. Written by HeroCanvas's ScrollTrigger,
 * consumed (smoothed) by AgentNetwork's useFrame.
 */
export const heroProgress = { value: 0 };
