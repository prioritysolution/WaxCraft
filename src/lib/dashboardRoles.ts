export type DashboardRole =
  | "admin"
  | "manager"
  | "accountant"
  | "operator"
  | "unknown";

export const resolveDashboardRole = (roleName?: string | null): DashboardRole => {
  const key = String(roleName ?? "")
    .trim()
    .toLowerCase();

  if (key === "admin") return "admin";
  if (key === "manager") return "manager";
  if (key === "accountant") return "accountant";
  if (key === "operator") return "operator";
  return "unknown";
};
