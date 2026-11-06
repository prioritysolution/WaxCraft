import { getPartyAPI } from "@/container/master/party/PartyApis";
import { ApiResponse } from "@/types/ApiTypes";

export interface PartyListOption {
  Id: number;
  Party_Name: string;
  Party_Add: string;
  Party_Mob: string;
  Party_Gst: string;
}

const PAGE_SIZE = 100;
const MAX_PAGES = 50;

const readRows = (details: unknown): PartyListOption[] => {
  const rows = Array.isArray(details)
    ? details
    : details &&
        typeof details === "object" &&
        Array.isArray((details as { data?: unknown }).data)
      ? ((details as { data: unknown[] }).data as unknown[])
      : [];

  return rows.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const party = row as {
      Id?: unknown;
      Party_Name?: unknown;
      Party_Add?: unknown;
      Party_Mob?: unknown;
      Party_Gst?: unknown;
    };
    if (party.Id == null || String(party.Id).trim() === "") return [];
    return [
      {
        Id: Number(party.Id),
        Party_Name: String(party.Party_Name ?? ""),
        Party_Add: String(party.Party_Add ?? ""),
        Party_Mob: String(party.Party_Mob ?? ""),
        Party_Gst: String(party.Party_Gst ?? ""),
      },
    ];
  });
};

export async function loadAllParties(
  orgId: number | string,
): Promise<PartyListOption[]> {
  const unique = new Map<number, PartyListOption>();
  let page = 1;

  while (page <= MAX_PAGES) {
    const res: ApiResponse = await getPartyAPI(orgId, page, "", PAGE_SIZE);
    if (res.status !== 200 && res.status !== 202) break;

    const batch = readRows(res.data.details);
    if (!batch.length) break;

    const sizeBefore = unique.size;
    batch.forEach((party) => {
      if (!Number.isFinite(party.Id)) return;
      unique.set(party.Id, party);
    });
    if (unique.size === sizeBefore) break;

    page += 1;
  }

  return Array.from(unique.values());
}
