import {
  Award, Bookmark, Briefcase, Building, CalendarCheck, ChartColumn, Code, GraduationCap,
  LayoutDashboard, Library, Map as MapIcon, RotateCcw, Settings, Sparkles, Timer, Trophy, User, Waypoints,
  type LucideIcon,
} from "lucide-react";

export interface NavItem { label: string; href: string; icon: LucideIcon; badge?: "revision" }
export interface NavSection { title: string; items: NavItem[] }

export const NAV: NavSection[] = [
  { title: "Dashboard", items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }] },
  { title: "Learn", items: [
    { label: "Roadmap", href: "/roadmap", icon: MapIcon },
    { label: "Topics", href: "/topics", icon: Library },
    { label: "Patterns", href: "/patterns", icon: Waypoints },
    { label: "Courses", href: "/courses", icon: GraduationCap },
  ] },
  { title: "Practice", items: [
    { label: "All Problems", href: "/problems", icon: Code },
    { label: "Daily Challenge", href: "/daily", icon: CalendarCheck },
    { label: "Recommended", href: "/recommended", icon: Sparkles },
    { label: "Revision", href: "/revision", icon: RotateCcw, badge: "revision" },
    { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  ] },
  { title: "Interview", items: [
    { label: "Interview Prep", href: "/interview", icon: Briefcase },
    { label: "Companies", href: "/companies", icon: Building },
    { label: "Mock Interview", href: "/mock-interview", icon: Timer },
  ] },
  { title: "Progress", items: [
    { label: "Analytics", href: "/analytics", icon: ChartColumn },
    { label: "Achievements", href: "/achievements", icon: Award },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  ] },
  { title: "Profile", items: [
    { label: "Profile", href: "/profile", icon: User },
    { label: "Settings", href: "/settings", icon: Settings },
  ] },
];
