import { ApiResponse } from "@/types/ApiTypes";

/** Detect when delete failed because the row is referenced elsewhere. */
export function isMasterDeleteDependencyResponse(res: ApiResponse): boolean {
  const data = res.data as unknown as Record<string, unknown> | undefined;
  if (!data) return false;

  if (
    data.is_used === 1 ||
    data.is_used === true ||
    data.used === 1 ||
    data.used === true
  ) {
    return true;
  }

  if (res.status === 409) return true;

  if (res.status === 200) return false;

  const message = String(data.message ?? "").toLowerCase();
  return /used|in use|reference|refer|connect|exist|depend|linked|cannot be deleted|can't be deleted|can not be deleted|already|related|mapped|map with|in another|other table/.test(
    message,
  );
}

export function getMasterDeleteWarningMessage(
  res: ApiResponse,
  fallback = "This data is connected to other records and cannot be deleted !!",
): string {
  const message = String(res.data?.message ?? "").trim();
  return message || fallback;
}
