export type Section = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export type NavItem = {
  id: string;
  title: string;
  icon: string;
};

export type NavGroup = {
  id: string;
  title: string;
  items: NavItem[];
};

export type SidebarItem = NavGroup | NavItem;
