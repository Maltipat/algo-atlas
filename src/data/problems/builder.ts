import type {
  AlternativeApproach,
  CompareMode,
  DesignSignature,
  Difficulty,
  FnSignature,
  Language,
  LearningLevel,
  ParamType,
  Problem,
} from "@/types";

/** Compact authoring format for problems. `build()` expands it into a full Problem. */
export interface ProblemDef {
  t: string;
  d: "E" | "M" | "H";
  topic: string;
  sub: string;
  pat: string[];
  tags?: string[];
  co: string[];
  desc: string;
  cons: string[];
  hints: string[];
  exp: string;
  steps: string[];
  tc: string;
  sc: string;
  fn?: [string, [string, ParamType][], ParamType];
  cls?: DesignSignature;
  /** [input args, expected]. The first two are shown as examples; the rest are hidden. */
  tests: [unknown[], unknown][];
  js: string;
  py?: string;
  alt?: AlternativeApproach[];
  cmp?: CompareMode;
  runnable?: false;
  level?: LearningLevel;
  notes?: string[];
}

const DIFF: Record<ProblemDef["d"], Difficulty> = { E: "Easy", M: "Medium", H: "Hard" };

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

// ------------------------------- type maps ---------------------------------

const JS_T: Record<ParamType, string> = {
  int: "number", long: "number", double: "number", bool: "boolean", string: "string", char: "character",
  "int[]": "number[]", "double[]": "number[]", "bool[]": "boolean[]", "string[]": "string[]", "char[]": "character[]",
  "int[][]": "number[][]", "char[][]": "character[][]", "string[][]": "string[][]",
  ListNode: "ListNode", "ListNode[]": "ListNode[]", TreeNode: "TreeNode", void: "void",
};
const PY_T: Record<ParamType, string> = {
  int: "int", long: "int", double: "float", bool: "bool", string: "str", char: "str",
  "int[]": "List[int]", "double[]": "List[float]", "bool[]": "List[bool]", "string[]": "List[str]", "char[]": "List[str]",
  "int[][]": "List[List[int]]", "char[][]": "List[List[str]]", "string[][]": "List[List[str]]",
  ListNode: "Optional[ListNode]", "ListNode[]": "List[Optional[ListNode]]", TreeNode: "Optional[TreeNode]", void: "None",
};
const CPP_T: Record<ParamType, string> = {
  int: "int", long: "long long", double: "double", bool: "bool", string: "string", char: "char",
  "int[]": "vector<int>", "double[]": "vector<double>", "bool[]": "vector<bool>", "string[]": "vector<string>", "char[]": "vector<char>",
  "int[][]": "vector<vector<int>>", "char[][]": "vector<vector<char>>", "string[][]": "vector<vector<string>>",
  ListNode: "ListNode*", "ListNode[]": "vector<ListNode*>", TreeNode: "TreeNode*", void: "void",
};
const JAVA_T: Record<ParamType, string> = {
  int: "int", long: "long", double: "double", bool: "boolean", string: "String", char: "char",
  "int[]": "int[]", "double[]": "double[]", "bool[]": "boolean[]", "string[]": "String[]", "char[]": "char[]",
  "int[][]": "int[][]", "char[][]": "char[][]", "string[][]": "List<List<String>>",
  ListNode: "ListNode", "ListNode[]": "ListNode[]", TreeNode: "TreeNode", void: "void",
};

const cppParam = (t: ParamType) => (t.endsWith("]") ? `${CPP_T[t]}&` : CPP_T[t]);

function usesType(sig: FnSignature | DesignSignature, t: ParamType): boolean {
  const fns = "methods" in sig ? [...sig.methods, { name: "", params: sig.ctor, returns: "void" as ParamType }] : [sig];
  return fns.some((f) => f.returns === t || f.params.some(([, p]) => p === t));
}

const HEADERS: Record<Language, { list: string; tree: string }> = {
  javascript: {
    list: "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n",
    tree: "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n",
  },
  python: {
    list: "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n",
    tree: "# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\n",
  },
  cpp: {
    list: "/**\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode(int x) : val(x), next(nullptr) {}\n * };\n */\n",
    tree: "/**\n * struct TreeNode {\n *     int val;\n *     TreeNode *left, *right;\n *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n * };\n */\n",
  },
  java: {
    list: "/**\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode(int val) { this.val = val; }\n * }\n */\n",
    tree: "/**\n * public class TreeNode {\n *     int val;\n *     TreeNode left, right;\n *     TreeNode(int val) { this.val = val; }\n * }\n */\n",
  },
};

function header(sig: FnSignature | DesignSignature, lang: Language): string {
  let h = "";
  if (usesType(sig, "ListNode") || usesType(sig, "ListNode[]")) h += HEADERS[lang].list;
  if (usesType(sig, "TreeNode")) h += HEADERS[lang].tree;
  return h;
}

export function generateStarter(sig: FnSignature | DesignSignature): Record<Language, string> {
  if ("methods" in sig) {
    const ctorJs = sig.ctor.map(([n]) => n).join(", ");
    const js =
      header(sig, "javascript") +
      `class ${sig.className} {\n    constructor(${ctorJs}) {\n        \n    }\n` +
      sig.methods.map((m) => `\n    ${m.name}(${m.params.map(([n]) => n).join(", ")}) {\n        \n    }\n`).join("") +
      "}\n";
    const py =
      header(sig, "python") +
      `class ${sig.className}:\n\n    def __init__(self${sig.ctor.map(([n, t]) => `, ${n}: ${PY_T[t]}`).join("")}):\n        pass\n` +
      sig.methods.map((m) => `\n    def ${m.name}(self${m.params.map(([n, t]) => `, ${n}: ${PY_T[t]}`).join("")}) -> ${PY_T[m.returns]}:\n        pass\n`).join("");
    const cpp =
      header(sig, "cpp") +
      `class ${sig.className} {\npublic:\n    ${sig.className}(${sig.ctor.map(([n, t]) => `${cppParam(t)} ${n}`).join(", ")}) {\n        \n    }\n` +
      sig.methods.map((m) => `\n    ${CPP_T[m.returns]} ${m.name}(${m.params.map(([n, t]) => `${cppParam(t)} ${n}`).join(", ")}) {\n        \n    }\n`).join("") +
      "};\n";
    const java =
      header(sig, "java") +
      `class ${sig.className} {\n\n    public ${sig.className}(${sig.ctor.map(([n, t]) => `${JAVA_T[t]} ${n}`).join(", ")}) {\n        \n    }\n` +
      sig.methods.map((m) => `\n    public ${JAVA_T[m.returns]} ${m.name}(${m.params.map(([n, t]) => `${JAVA_T[t]} ${n}`).join(", ")}) {\n        \n    }\n`).join("") +
      "}\n";
    return { javascript: js, python: py, cpp, java };
  }
  const { name, params, returns } = sig;
  const js =
    header(sig, "javascript") +
    "/**\n" +
    params.map(([n, t]) => ` * @param {${JS_T[t]}} ${n}\n`).join("") +
    ` * @return {${JS_T[returns]}}\n */\nvar ${name} = function(${params.map(([n]) => n).join(", ")}) {\n    \n};\n`;
  const py =
    header(sig, "python") +
    `class Solution:\n    def ${name}(self${params.map(([n, t]) => `, ${n}: ${PY_T[t]}`).join("")}) -> ${PY_T[returns]}:\n        pass\n`;
  const cpp =
    header(sig, "cpp") +
    `class Solution {\npublic:\n    ${CPP_T[returns]} ${name}(${params.map(([n, t]) => `${cppParam(t)} ${n}`).join(", ")}) {\n        \n    }\n};\n`;
  const java =
    header(sig, "java") +
    `class Solution {\n    public ${JAVA_T[returns]} ${name}(${params.map(([n, t]) => `${JAVA_T[t]} ${n}`).join(", ")}) {\n        \n    }\n}\n`;
  return { javascript: js, python: py, cpp, java };
}

export function formatValue(v: unknown): string {
  return JSON.stringify(v) ?? "null";
}

export function formatInput(sig: FnSignature | DesignSignature, input: unknown[]): string {
  if ("methods" in sig) return `${formatValue(input[0])}\n${formatValue(input[1])}`;
  return sig.params.map(([n], i) => `${n} = ${formatValue(input[i])}`).join(", ");
}

function levelFor(d: Difficulty, companies: string[]): LearningLevel {
  if (companies.length >= 4 && d !== "Easy") return "Interview";
  return d === "Easy" ? "Beginner" : d === "Medium" ? "Intermediate" : "Advanced";
}

export function build(def: ProblemDef, number: number, topicPrereqs: string[]): Problem {
  const slug = slugify(def.t);
  const difficulty = DIFF[def.d];
  const h = hash(slug);
  const signature: FnSignature | DesignSignature = def.cls
    ? def.cls
    : { name: def.fn![0], params: def.fn![1], returns: def.fn![2] };
  const testCases = def.tests.map(([input, expected], i) => ({
    id: `${slug}-${i + 1}`,
    input,
    expected,
    hidden: i >= 2,
  }));
  const examples = def.tests.slice(0, 2).map(([input, expected], i) => ({
    input: formatInput(signature, input),
    output: formatValue(expected),
    explanation: def.notes?.[i],
  }));
  const accBase = difficulty === "Easy" ? 58 : difficulty === "Medium" ? 44 : 33;
  const popularity = def.co.length * 9 + (h % 30);
  const added = new Date(Date.UTC(2024, 0, 1) + (h % 900) * 86400000);
  return {
    id: slug,
    number,
    title: def.t,
    slug,
    description: def.desc,
    examples,
    constraints: def.cons,
    difficulty,
    level: def.level ?? levelFor(difficulty, def.co),
    topic: def.topic,
    subtopic: def.sub,
    patterns: def.pat,
    tags: def.tags ?? [],
    prerequisites: topicPrereqs,
    companies: def.co,
    hints: def.hints,
    explanation: def.exp,
    approach: def.steps,
    alternatives: def.alt ?? [],
    solution: { javascript: def.js.trim() + "\n", ...(def.py ? { python: def.py.trim() + "\n" } : {}) },
    timeComplexity: def.tc,
    spaceComplexity: def.sc,
    starterCode: generateStarter(signature),
    testCases,
    expectedOutput: examples[0]?.output ?? "",
    signature,
    runnable: def.runnable !== false,
    compare: def.cmp ?? "exact",
    acceptance: Math.round((accBase + (h % 170) / 10) * 10) / 10,
    frequency: Math.min(100, 20 + popularity),
    solvedCount: Math.round(((difficulty === "Easy" ? 900 : difficulty === "Medium" ? 520 : 210) + (h % 400)) * (1 + def.co.length / 6)) * 10,
    estimatedMinutes: difficulty === "Easy" ? 15 : difficulty === "Medium" ? 30 : 45,
    addedAt: added.toISOString().slice(0, 10),
  };
}
