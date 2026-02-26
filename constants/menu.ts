export type PermissionKey = "ALL" | "ADMIN";

export type AppRouteConfig = {
  name: string;
  route: string;
  file: string;
  icon: string;
  permissions: PermissionKey;
  showInSideMenu: boolean;
};

export const menuData: AppRouteConfig[] = [
  {
    name: "Home",
    route: "/dashboard/home",
    file: "app/dashboard/home/page.tsx",
    icon: "home.svg",
    permissions: "ALL",
    showInSideMenu: true,
  },
  {
    name: "Profile",
    route: "/dashboard/profile",
    file: "app/dashboard/profile/page.tsx",
    icon: "profile.svg",
    permissions: "ALL",
    showInSideMenu: true,
  },
  {
    name: "Users",
    route: "/dashboard/users",
    file: "app/dashboard/users/page.tsx",
    icon: "users.svg",
    permissions: "ALL",
    showInSideMenu: true,
  },
];

export const loginRoutes: AppRouteConfig[] = [
  {
    name: "Login",
    route: "/login",
    file: "app/login/page.tsx",
    icon: "login.svg",
    permissions: "ALL",
    showInSideMenu: false,
  },
];

export const adminRoutes: AppRouteConfig[] = [
  ...menuData,
  {
    name: "Add User",
    route: "/dashboard/users/add",
    file: "app/dashboard/users/add/page.tsx",
    icon: "user-add.svg",
    permissions: "ADMIN",
    showInSideMenu: false,
  },
  {
    name: "Edit User",
    route: "/dashboard/users/[id]/edit",
    file: "app/dashboard/users/[id]/edit/page.tsx",
    icon: "user-edit.svg",
    permissions: "ADMIN",
    showInSideMenu: false,
  },
];

export const defaultDashboardRoute = menuData[0]?.route ?? "/dashboard/home";

const rolePermissionMap: Record<string, PermissionKey[]> = {
  "frontend developer": ["ALL"],
  admin: ["ALL", "ADMIN"],
};

export function permissionAccess(required: PermissionKey, role?: string) {
  if (required === "ALL") return true;
  if (!role) return false;
  const allowed = rolePermissionMap[role.toLowerCase()] ?? ["ALL"];
  return allowed.includes(required);
}

export function isRouteActive(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function isDynamicMatch(pathname: string, routePattern: string) {
  const pathSegments = pathname.split("/").filter(Boolean);
  const patternSegments = routePattern.split("/").filter(Boolean);

  if (pathSegments.length !== patternSegments.length) return false;

  for (let i = 0; i < patternSegments.length; i += 1) {
    const patternSegment = patternSegments[i];
    if (patternSegment.startsWith("[") && patternSegment.endsWith("]")) {
      continue;
    }
    if (patternSegment !== pathSegments[i]) return false;
  }

  return true;
}

export function getRouteByPath(pathname: string) {
  return adminRoutes.find(
    (item) =>
      pathname === item.route ||
      pathname.startsWith(`${item.route}/`) ||
      isDynamicMatch(pathname, item.route),
  );
}
