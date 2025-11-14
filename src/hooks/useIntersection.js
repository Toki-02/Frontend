// src/hooks/useIntersection.js
import { useEffect } from "react";

export default function useIntersection(root = null, opts = {}) {
  const selector = opts.selector || ".reveal";
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    }, { root: root, threshold: .12 });

    document.querySelectorAll(selector).forEach(el => {
      el.classList.add("reveal");
      io.observe(el);
    });

    return () => io.disconnect();
  }, [root, selector]);
}
