import {
  ArrowLeftRight, ArrowUpDown, Binary, Boxes, Brain, Calculator, Code, Columns3, Combine, Footprints, GitBranch, GitFork, HardDrive,
  Hash, Layers, LayoutGrid, Link2, ListOrdered, ListTree, Merge, Milestone, Mountain, Network, Orbit, Repeat, Route, Rows3, Scissors,
  Search, Share2, Sigma, Signpost, Spline, SquareStack, Target, TextSearch, Timer, TreePine, Type, Undo2, Waypoints, Workflow,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  ArrowLeftRight, ArrowUpDown, Binary, Boxes, Brain, Calculator, Code, Columns3, Combine, Footprints, GitBranch, GitFork, HardDrive,
  Hash, Layers, LayoutGrid, Link2, ListOrdered, ListTree, Merge, Milestone, Mountain, Network, Orbit, Repeat, Route, Rows3, Scissors,
  Search, Share2, Sigma, Signpost, Spline, SquareStack, Target, TextSearch, Timer, TreePine, Type, Undo2, Waypoints, Workflow,
};

export function TopicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Code;
  return <Icon className={className} aria-hidden />;
}
