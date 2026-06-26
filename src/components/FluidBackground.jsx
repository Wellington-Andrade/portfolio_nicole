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

      gsap.to(".fluid-blob-inner-1", {
        x: 36,
        y: -24,
        scale: 1.08,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".fluid-blob-inner-2", {
        x: -34,
        y: 30,
        scale: 1.12,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".fluid-blob-inner-3", {
        x: 26,
        y: 34,
        scale: 1.1,
        duration: 13,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".fluid-blob-inner-4", {
        x: -30,
        y: -22,
        scale: 1.07,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".fluid-blob-1", {
        x: 280,
        y: 120,
        scale: 1.16,
        opacity: 0.44,
        ease: "none",
        scrollTrigger: scroll(),
      });

      gsap.to(".fluid-blob-2", {
        x: -320,
        y: 160,
        scale: 1.28,
        opacity: 0.56,
        ease: "none",
        scrollTrigger: scroll(),
      });

      gsap.to(".fluid-blob-3", {
        x: 150,
        y: -220,
        scale: 1.34,
        opacity: 0.48,
        ease: "none",
        scrollTrigger: scroll(),
      });

      gsap.to(".fluid-blob-4", {
        x: -190,
        y: -150,
        scale: 1.2,
        opacity: 0.46,
        ease: "none",
        scrollTrigger: scroll(),
      });

      gsap.to(rootRef.current, {
        filter: "hue-rotate(12deg) saturate(1.06) brightness(1.02)",
        ease: "none",
        scrollTrigger: scroll(),
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="fluid-bg" aria-hidden="true">
      <div className="fluid-blob fluid-blob-1">
        <div className="fluid-blob-inner fluid-blob-inner-1" />
      </div>
      <div className="fluid-blob fluid-blob-2">
        <div className="fluid-blob-inner fluid-blob-inner-2" />
      </div>
      <div className="fluid-blob fluid-blob-3">
        <div className="fluid-blob-inner fluid-blob-inner-3" />
      </div>
      <div className="fluid-blob fluid-blob-4">
        <div className="fluid-blob-inner fluid-blob-inner-4" />
      </div>
      <div className="fluid-noise" />
    </div>
  );
}
