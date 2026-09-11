import toast from "react-hot-toast";

function flattenMessage(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") return "";
  if (Array.isArray(value)) {
    return value.map(flattenMessage).filter(Boolean).join(" ");
  }
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map(flattenMessage)
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

export function formatApiToastMessage(
  message: unknown,
  fallback = "Something went wrong",
): string {
  let text =
    typeof message === "string" || typeof message === "number"
      ? String(message).trim()
      : flattenMessage(message);

  if (!text) return fallback;

  text = text.replace(/\bdosenot\b/gi, "does not");
  text = text.replace(/\bdoesnot\b/gi, "does not");
  text = text.replace(/\bdoes not exists?\b/gi, "does not exist");
  text = text.replace(/\s*!+\s*$/g, ".");
  text = text.replace(/\s{2,}/g, " ").trim();

  if (text) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

  return text || fallback;
}

export function isEmptyDataMessage(message: unknown): boolean {
  const text = flattenMessage(message).toLowerCase().replace(/\s+/g, " ").trim();
  if (!text) return false;

  return (
    /\bno data found\b/.test(text) ||
    /\bno\s+data\s+available\b/.test(text) ||
    /\bno\s+\w+(?:\s+\w+){0,3}\s+data\s+available\b/.test(text) ||
    /\bdata not found\b/.test(text) ||
    /\bno records?\s+(found|available)\b/.test(text)
  );
}

let emptyDataToastFilterInstalled = false;

export function installEmptyDataToastFilter() {
  if (emptyDataToastFilterInstalled) return;
  emptyDataToastFilterInstalled = true;

  const originalError = toast.error.bind(toast);
  const originalSuccess = toast.success.bind(toast);

  toast.error = ((message, options) => {
    if (isEmptyDataMessage(message)) return "";
    return originalError(formatApiToastMessage(message), options);
  }) as typeof toast.error;

  toast.success = ((message, options) => {
    return originalSuccess(
      formatApiToastMessage(message, "Success"),
      options,
    );
  }) as typeof toast.success;
}
