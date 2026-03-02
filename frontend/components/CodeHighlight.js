"use client";

import { useEffect } from "react";
import hljs from "highlight.js";

export default function CodeHighlight() {
  useEffect(() => {
    document.querySelectorAll(".post-content pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  }, []);

  return null;
}
