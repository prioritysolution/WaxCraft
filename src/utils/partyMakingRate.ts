import type {
  PartyMakingRateLineForm,
  PartyMakingRateLogEntry,
  PartyMakingRateModelOption,
  PartyMakingRateTableData,
} from "@/types/master/PartyMakingRateTypes";
import { toRateString } from "@/utils/formatDecimal";

export type PartyMakingRateSetup = {
  modelId: string;
  makingRate: string;
  wtRate: string;
  ghat: string;
  polish: string;
};

export type PartyMakingRateStoredRow = PartyMakingRateSetup & {
  id: string;
  modelName: string;
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
};

const readField = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    if (!(key in record)) continue;
    const value = toRateString(record[key]);
    if (value) return value;
  }
  return "";
};

const readText = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    if (!(key in record) || record[key] == null) continue;
    const text = String(record[key]).trim();
    if (text && text !== "null" && text !== "undefined") return text;
  }
  return "";
};

const rateFrom = (record: Record<string, unknown> | null, keys: string[]) =>
  record ? readField(record, keys) : "";

const partyRateHeader = (details: unknown) => {
  const record = asRecord(details);
  return {
    wtRate: rateFrom(record, ["Wt_Rate", "wt_rate", "WtRate", "wtRate"]),
    ghat: rateFrom(record, ["Ghat", "ghat", "Ghat_Rate", "ghat_rate"]),
    polish: rateFrom(record, [
      "Polish",
      "polish",
      "Polish_Rate",
      "polish_rate",
    ]),
  };
};

/** One list row per party. Model rows for the same party collapse together. */
export const groupPartyMakingRateRows = (
  rows: PartyMakingRateTableData[],
): PartyMakingRateTableData[] => {
  const groups = new Map<string, PartyMakingRateTableData>();

  rows.forEach((row) => {
    const key = String(row.Party_Id ?? row.Id);
    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, row);
      return;
    }
    groups.set(key, {
      ...existing,
      Wt_Rate: toRateString(existing.Wt_Rate) ? existing.Wt_Rate : row.Wt_Rate,
      Ghat: toRateString(existing.Ghat) ? existing.Ghat : row.Ghat,
      Polish: toRateString(existing.Polish) ? existing.Polish : row.Polish,
    });
  });

  return Array.from(groups.values());
};

/** WT Rate, Ghat, and Polish are stored once per party. */
export const parsePartyLevelRates = (details: unknown) => {
  const header = partyRateHeader(details);
  const fromRows = toDetailRows(details).reduce<{
    wtRate: string;
    ghat: string;
    polish: string;
  }>(
    (rates, row) => {
      if (!row || typeof row !== "object") return rates;
      const record = row as Record<string, unknown>;
      return {
        wtRate:
          rates.wtRate ||
          readField(record, ["Wt_Rate", "wt_rate", "WtRate", "wtRate"]),
        ghat:
          rates.ghat ||
          readField(record, ["Ghat", "ghat", "Ghat_Rate", "ghat_rate"]),
        polish:
          rates.polish ||
          readField(record, ["Polish", "polish", "Polish_Rate", "polish_rate"]),
      };
    },
    { wtRate: "", ghat: "", polish: "" },
  );

  return {
    wtRate: header.wtRate || fromRows.wtRate,
    ghat: header.ghat || fromRows.ghat,
    polish: header.polish || fromRows.polish,
  };
};

const toDetailRows = (details: unknown): unknown[] => {
  if (details == null) return [];
  if (Array.isArray(details)) return details;
  const record = asRecord(details);
  if (!record) return [details];
  const nested = record.data ?? record.Data ?? record.rows ?? record.Rows;
  if (Array.isArray(nested)) return nested;
  return [record];
};

/** Every party + model setup returned by GetPartyMakingRateByParty. */
export const parsePartyMakingRateRows = (
  details: unknown,
): PartyMakingRateSetup[] => {
  const header = partyRateHeader(details);
  return toDetailRows(details)
    .map((row) => {
      if (row == null || typeof row !== "object") {
        return {
          modelId: "",
          makingRate: toRateString(row),
          wtRate: "",
          ghat: "",
          polish: "",
        };
      }

      const record = row as Record<string, unknown>;
      return {
        modelId: readField(record, ["Model_Id", "model_id", "ModelId"]),
        makingRate:
          readField(record, [
            "Making_Rate",
            "making_rate",
            "MakingRate",
            "makingRate",
          ]) || readField(record, ["Rate", "rate"]),
        wtRate: readField(record, ["Wt_Rate", "wt_rate", "WtRate", "wtRate"]),
        ghat: readField(record, ["Ghat", "ghat", "Ghat_Rate", "ghat_rate"]),
        polish: readField(record, [
          "Polish",
          "polish",
          "Polish_Rate",
          "polish_rate",
        ]),
      };
    })
    .filter(
      (row) =>
        row.modelId || row.makingRate || row.wtRate || row.ghat || row.polish,
    )
    .map((row) => ({
      ...row,
      wtRate: header.wtRate || row.wtRate,
      ghat: header.ghat || row.ghat,
      polish: header.polish || row.polish,
    }));
};

const modelKey = (value: unknown) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (!/^-?\d+(\.\d+)?$/.test(raw)) return raw;
  const num = Number(raw);
  return Number.isFinite(num) ? String(num) : raw;
};

const unmatchedSetup = (setups: PartyMakingRateSetup[]) =>
  setups.find((setup) => !modelKey(setup.modelId)) ??
  (setups.length === 1 ? setups[0] : null);

export const findPartyMakingRate = (
  setups: PartyMakingRateSetup[],
  modelId: unknown,
) => {
  const id = modelKey(modelId);
  if (id) {
    const match = setups.find((setup) => modelKey(setup.modelId) === id);
    if (match) return match;
  }
  // A party with one setup, or a row that is not tied to a model, still applies.
  // Manual entry is only for a party with no rows, or several models and no match.
  return unmatchedSetup(setups);
};

/** Design-level WT Rate, Polish, and Ghat follow the party setup. */
export const findDesignPartyMakingRate = (
  setups: PartyMakingRateSetup[],
  modelIds: unknown[],
) => {
  for (const modelId of modelIds) {
    const id = modelKey(modelId);
    if (!id) continue;
    const match = setups.find((setup) => modelKey(setup.modelId) === id);
    if (match) return match;
  }
  return unmatchedSetup(setups);
};

/** First making rate from GetPartyMakingRateByParty `details`. */
export const parsePartyMakingRateDetails = (details: unknown): string =>
  parsePartyMakingRateRows(details)[0]?.makingRate || "";

/** Saved party rows, including the rate id used to update that model. */
export const parsePartyMakingRateStoredRows = (
  details: unknown,
): PartyMakingRateStoredRow[] =>
  toDetailRows(details).flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const record = row as Record<string, unknown>;
    const modelId = readField(record, ["Model_Id", "model_id", "ModelId"]);
    const id = readField(record, [
      "Id",
      "id",
      "Making_Rate_Id",
      "making_rate_id",
    ]);
    if (!modelId && !id) return [];
    return [
      {
        id,
        modelId,
        modelName: readText(record, [
          "Model_Name",
          "model_name",
          "ModelName",
        ]),
        makingRate: readField(record, [
          "Making_Rate",
          "making_rate",
          "MakingRate",
          "makingRate",
        ]),
        wtRate: readField(record, ["Wt_Rate", "wt_rate", "WtRate", "wtRate"]),
        ghat: readField(record, ["Ghat", "ghat", "Ghat_Rate", "ghat_rate"]),
        polish: readField(record, [
          "Polish",
          "polish",
          "Polish_Rate",
          "polish_rate",
        ]),
      },
    ];
  });

export const buildPartyMakingRateFormRows = (
  models: PartyMakingRateModelOption[],
  stored: PartyMakingRateStoredRow[],
): PartyMakingRateLineForm[] => {
  const used = new Set<string>();
  const rows: PartyMakingRateLineForm[] = models.map((model) => {
    const key = modelKey(model.Id);
    const match = stored.find((row) => modelKey(row.modelId) === key);
    if (match) used.add(key);
    return {
      makingRateId: match?.id || "",
      modelId: String(model.Id),
      modelName: model.Model_Name || match?.modelName || "",
      makingRate: match?.makingRate || "",
    };
  });

  stored.forEach((row) => {
    const key = modelKey(row.modelId);
    if (!key || used.has(key)) return;
    rows.push({
      makingRateId: row.id,
      modelId: row.modelId,
      modelName: row.modelName || `Model ${row.modelId}`,
      makingRate: row.makingRate,
    });
  });

  return rows.sort((a, b) =>
    a.modelName.localeCompare(b.modelName, undefined, { sensitivity: "base" }),
  );
};

const normalizeLogAction = (value: string) => {
  const action = value.trim().toUpperCase();
  if (action === "INSERT" || action === "CREATE" || action === "ADD") {
    return "ADD";
  }
  if (action === "EDIT" || action === "UPDATE") return "UPDATE";
  if (action === "REMOVE" || action === "DELETE") return "DELETE";
  return action;
};

export const parsePartyMakingRateLogs = (
  details: unknown,
): PartyMakingRateLogEntry[] =>
  toDetailRows(details).flatMap((row, index) => {
    if (!row || typeof row !== "object") return [];
    const record = row as Record<string, unknown>;
    return [
      {
        id:
          readField(record, ["Id", "id", "Log_Id", "log_id"]) ||
          String(index + 1),
        partyName: readText(record, ["Party_Name", "party_name", "PartyName"]),
        modelName: readText(record, ["Model_Name", "model_name", "ModelName"]),
        action: normalizeLogAction(
          readText(record, ["Action", "action", "Log_Action", "log_action"]),
        ),
        oldMakingRate: readField(record, [
          "Old_Making_Rate",
          "old_making_rate",
        ]),
        newMakingRate: readField(record, [
          "New_Making_Rate",
          "new_making_rate",
        ]),
        oldWtRate: readField(record, ["Old_Wt_Rate", "old_wt_rate"]),
        newWtRate: readField(record, ["New_Wt_Rate", "new_wt_rate"]),
        oldGhat: readField(record, ["Old_Ghat", "old_ghat"]),
        newGhat: readField(record, ["New_Ghat", "new_ghat"]),
        oldPolish: readField(record, ["Old_Polish", "old_polish"]),
        newPolish: readField(record, ["New_Polish", "new_polish"]),
        changedBy: readText(record, [
          "Changed_By",
          "changed_by",
          "User_Name",
          "user_name",
        ]),
        changedAt: readText(record, [
          "Changed_At",
          "changed_at",
          "Created_At",
          "created_at",
          "Log_Date",
          "log_date",
        ]),
      },
    ];
  });
