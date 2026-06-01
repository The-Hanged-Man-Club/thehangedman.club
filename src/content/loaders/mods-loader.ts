import type { LiveLoader } from "astro/loaders";
import { parse } from "csv-parse/sync";

interface RawModRow {
  Name: string;
  Bio?: string;
  Events: string;
  Roles?: string;
  "Social 1"?: string;
  "Social 2"?: string;
  "Social 3"?: string;
  "Social 4"?: string;
}

interface EntryFilter {
  id: string;
}

interface CollectionFilter {
  event?: string;
}

export function modsLoader(
  event: string
): LiveLoader<RawModRow, EntryFilter, CollectionFilter> {
  return {
    name: "mods-loader",

    loadCollection: async () => {
      try {
        const res = await fetch(
          "https://docs.google.com/spreadsheets/d/1GJP6ADFCmNZAGGZF79CjMcWJYPx1hyHkjy26tOdmsc4/export?format=csv",
          { headers: { "Cache-Control": "no-store" } }
        );

        if (!res.ok) {
          return {
            error: new Error(
              `Failed to fetch sheet: ${res.status} ${res.statusText}`
            ),
          };
        }

        const csv = await res.text();

        let rows: RawModRow[];
        try {
          rows = parse(csv, { columns: true, skip_empty_lines: true });
        } catch (err) {
          return { error: new Error("CSV parse error", { cause: err }) };
        }

        const filtered =
          event === "all"
            ? rows
            : rows.filter((row) => {
                const events = row.Events?.toLowerCase() ?? "";
                return events.includes(event);
              });
        return {
          entries: filtered.map((row) => ({
            id: row.Name.toLowerCase().replace(/\s+/g, "-"),
            data: row,
          })),
        };
      } catch (err) {
        return { error: new Error("Unexpected loader error", { cause: err }) };
      }
    },

    // ⭐ Load a single mod by ID
    loadEntry: async ({ filter }) => {
      try {
        const res = await fetch(
          "https://docs.google.com/spreadsheets/d/1GJP6ADFCmNZAGGZF79CjMcWJYPx1hyHkjy26tOdmsc4/export?format=csv",
          { headers: { "Cache-Control": "no-store" } }
        );

        if (!res.ok) {
          return {
            error: new Error(
              `Failed to fetch sheet: ${res.status} ${res.statusText}`
            ),
          };
        }

        const csv = await res.text();
        const rows: RawModRow[] = parse(csv, {
          columns: true,
          skip_empty_lines: true,
        });

        const match = rows.find(
          (row) => row.Name.toLowerCase().replace(/\s+/g, "-") === filter.id
        );

        if (!match) {
          return { error: new Error("Mod not found") };
        }

        return {
          id: filter.id,
          data: match,
        };
      } catch (err) {
        return { error: new Error("Unexpected loader error", { cause: err }) };
      }
    },
  };
}
