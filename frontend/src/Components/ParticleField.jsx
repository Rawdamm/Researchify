import { useEffect, useRef } from "react";

const DEFAULTS = {
  size: 90,
  ease: 0.22,
  fadeSpeed: 0.12,
};

export default function ParticleField({
  size = DEFAULTS.size,
  ease = DEFAULTS.ease,
  fadeSpeed = DEFAULTS.fadeSpeed,
  className = "",
  style,
}) {
  const glowRef = useRef(null);
  const stateRef = useRef({
    targetX: -9999,
    targetY: -9999,
    x: -9999,
    y: -9999,
    targetAlpha: 0,
    alpha: 0,
    active: false,
  });
  const rafRef = useRef(0);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const onMove = (e) => {
      const s = stateRef.current;
      if (!s.active) {
        s.x = e.clientX;
        s.y = e.clientY;
      }
      s.targetX = e.clientX;
      s.targetY = e.clientY;
      s.targetAlpha = 1;
      s.active = true;
    };

    const onLeave = () => {
      stateRef.current.targetAlpha = 0;
      stateRef.current.active = false;
    };

    const tick = () => {
      const s = stateRef.current;
      s.x += (s.targetX - s.x) * ease;
      s.y += (s.targetY - s.y) * ease;
      s.alpha += (s.targetAlpha - s.alpha) * fadeSpeed;

      el.style.transform = `translate3d(${s.x - size / 2}px, ${s.y - size / 2}px, 0)`;
      el.style.opacity = s.alpha.toFixed(3);

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [size, ease, fadeSpeed]);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        pointerEvents: "none",
        opacity: 0,
        background:
          "radial-gradient(circle, rgba(251,146,60,0.35) 0%, rgba(249,115,22,0.18) 35%, rgba(249,115,22,0) 70%)",
        filter: "blur(8px)",
        mixBlendMode: "screen",
        willChange: "transform, opacity",
        ...style,
      }}
    />
  );
}
