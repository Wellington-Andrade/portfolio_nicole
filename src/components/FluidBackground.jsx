import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/fluid-background.css";

gsap.registerPlugin(ScrollTrigger);

export default function FluidBackground() {
  const rootRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !rootRef.current) return undefined;

    const ctx = gsap.context(() => {
      const trigger = document.body;
      const scroll = () => ({
        trigger,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        invalidateOnRefresh: true,
      });

      gsap.to(".fluid-blob-1", {
        x: 220,
        y: 120,
        scale: 1.18,
        opacity: 0.72,
        ease: "none",
        scrollTrigger: scroll(),
      });

      gsap.to(".fluid-blob-2", {
        x: -260,
        y: 150,
        scale: 1.28,
        opacity: 0.56,
        ease: "none",
        scrollTrigger: scroll(),
      });

      gsap.to(".fluid-blob-3", {
        x: 120,
        y: -240,
        scale: 1.34,
        opacity: 0.62,
        ease: "none",
        scrollTrigger: scroll(),
      });

      gsap.to(".fluid-blob-4", {
        x: -150,
        y: -130,
        scale: 1.16,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: scroll(),
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="fluid-bg" aria-hidden="true">
      <div className="fluid-blob fluid-blob-1" />
      <div className="fluid-blob fluid-blob-2" />
      <div className="fluid-blob fluid-blob-3" />
      <div className="fluid-blob fluid-blob-4" />
      <div className="fluid-noise" />
    </div>
  );
}
