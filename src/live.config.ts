import { SocialLinks } from "@fujocoded/zod-transform-socials/zod4";
import { avatarUrlForName } from "./utils/avatarURL";
import { defineLiveCollection } from "astro:content";
import { modsLoader } from "./content/loaders/mods-loader";
import { z } from "astro/zod";

export const collections = {
  mods: defineLiveCollection({
    loader: modsLoader("all"),

    schema: z
      .object({
        Name: z.string(),
        Bio: z.string().optional(),
        Events: z.string(),
        Roles: z.string().optional(),
        "Social 1": z.string(),
        "Social 2": z.string().optional(),
        "Social 3": z.string().optional(),
        "Social 4": z.string().optional(),
      })
      .transform((row) => {
        const rawSocials = [
          row["Social 1"],
          row["Social 2"],
          row["Social 3"],
          row["Social 4"],
        ].filter((val): val is string => val != null && val !== "");

        const socials = SocialLinks.parse(rawSocials);

        return {
          id: row.Name.toLowerCase().replace(/\s+/g, "-"),
          name: row.Name,
          avatar: avatarUrlForName(row.Name),
          bio: row.Bio ?? "",
          links: socials,
          roles: row.Roles
            ? row.Roles.split(",").map((r) => r.trim().toLowerCase())
            : [],
          mod_duties: row.Events.split(",")
            .map((d) => d.trim().toLowerCase())
            .filter(Boolean),
        };
      }),
  }),
};
