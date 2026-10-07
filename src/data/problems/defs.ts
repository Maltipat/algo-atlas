import type { ProblemDef } from "./builder";
import { foundationProblems } from "./foundations";
import { coreStructureProblems } from "./core-structures";
import { coreTechniqueProblems } from "./core-techniques";
import { treeProblems } from "./trees";
import { graphProblems } from "./graphs";
import { advancedProblems } from "./advanced";

/** Every problem definition, in roadmap order. Numbers are assigned from this order. */
export const problemDefs: ProblemDef[] = [
  ...foundationProblems,
  ...coreStructureProblems,
  ...coreTechniqueProblems,
  ...treeProblems,
  ...graphProblems,
  ...advancedProblems,
];
