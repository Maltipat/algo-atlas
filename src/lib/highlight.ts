import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import type { Language } from "@/types";

const GRAMMAR: Record<Language, string> = { cpp: "cpp", java: "java", python: "python", javascript: "javascript" };

export function highlight(code: string, lang: Language): string {
  const grammar = Prism.languages[GRAMMAR[lang]];
  return grammar ? Prism.highlight(code, grammar, GRAMMAR[lang]) : code.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
}
