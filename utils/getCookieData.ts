import Cookies from "js-cookie";

type CookieKey =
  | "waxCraftClientToken"
  | "waxCraftClientOrgId"
  | "waxCraftClientOrgName"
  | "waxCraftClientOrgAddress"
  | "waxCraftClientOrgMobile"
  | "waxCraftClientOrgGst"
  | "waxCraftClientOrgPan"
  | "waxCraftClientFinStartDate"
  | "waxCraftClientFinEndDate"
  | "waxCraftClientFinId"
  | "waxCraftClientUserName";

const getCookieData = <T = unknown>(key: CookieKey): T | null => {
  const cookieValue = Cookies.get(key);

  if (!cookieValue) return null;

  try {
    // Attempt to parse as JSON and return
    return JSON.parse(cookieValue) as T;
  } catch {
    // If parsing fails, return raw value
    return cookieValue as T;
  }
};

export default getCookieData;
