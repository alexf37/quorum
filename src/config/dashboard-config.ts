export type NavItem = {
  title: string;
  longTitle?: string;
  href: string;
};

export const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
  },
  {
    title: "Classes",
    href: "/dashboard/classes",
  },
  {
    title: "Manage",
    longTitle: "Manage Classes",
    href: "/dashboard/manage",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
  },
] as const;
