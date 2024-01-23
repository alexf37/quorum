export type NavItem = {
  title: string;
  longTitle?: string;
  href: string;
};

export const navItems: NavItem[] = [
  {
    title: "Classes",
    href: "/dashboard",
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
