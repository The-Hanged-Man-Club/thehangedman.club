import { defineConfig } from "astro/config";
import favicons from "astro-favicons";
import icon from "astro-icon";
import metaTags from "astro-meta-tags";
import netlify from "@astrojs/netlify";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import starlightBlog from "starlight-blog";
import starlightLinksValidator from "starlight-links-validator";
import starlightThemeNova from "starlight-theme-nova";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://thehangedman.club",
  compressHTML: true,

  integrations: [
    icon({
      include: {
        gameIcons: [
          "direction-sign",
          "sunrise",
          "night-sky",
          "scroll-quill",
          "tied-scroll",
        ],
        // simple-icons needed for zod-transform-socials, but not shipped with plugin, so added here
        simpleIcons: ["*"],
      },
    }),
    sitemap(),
    metaTags(),
    favicons(),
    robotsTxt({
      policy: [
        {
          userAgent: "*",
          disallow: ["/search", "/_astro/"],
          crawlDelay: 5,
        },
        {
          userAgent: "Googlebot",
          allow: "/",
          disallow: ["/_astro/"],
          crawlDelay: 5,
        },
        {
          userAgent: "CCBot",
          disallow: "/",
        },
        {
          userAgent: "GPTBot",
          disallow: "/",
        },
        {
          userAgent: "ChatGPT-User",
          disallow: "/",
        },
        {
          userAgent: "Slurp",
          crawlDelay: 30,
        },
      ],
    }),
    ,
    starlight({
      head: [
        {
          tag: "meta",
          attrs: {
            property: "theme-color",
            content: "#2F3136",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "./banner.png",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:type",
            content: "image/png",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:height",
            content: "499",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:width",
            content: "1072",
          },
        },
      ],
      plugins: [
        starlightThemeNova(),
        starlightLinksValidator(),
        starlightBlog({
          authors: {
            enigmalea: {
              name: "enigmalea",
              title: "Board Member & Event Mod",
              picture: "/enigmalea.png",
              url: "https://enigmalea.quest",
            },
          },
          metrics: {
            readingTime: true,
            words: "total",
          },
        }),
      ],
      title: "The Hanged Man",
      favicon: "/favicon.svg",
      logo: {
        src: "./src/assets/logo.gif",
      },
      components: {
        SiteTitle: "./src/components/SiteTitle.astro",
        SocialIcons: "./src/components/SocialIcons.astro",
        ThemeSelect: "./src/components/ThemeSelect.astro",
      },
      customCss: [
        "./src/styles/global.css",
        "@fontsource/patrick-hand-sc/400.css",
        "@fontsource/monaspace-krypton/400.css",
        "@fontsource-variable/lexend/wght.css",
        "@fontsource/germania-one/400.css",
      ],
      social: [
        {
          icon: "blueSky",
          label: "BlueSky",
          href: "https://bsky.app/profile/thehangedmanpub.bsky.social",
        },
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.gg/9RERC6R",
        },
      ],
      sidebar: [
        { label: "Home", link: "/" },
        {
          label: "Codex",
          items: [{ autogenerate: { directory: "about" } }],
        },
        {
          label: "The Joining",
          items: [{ autogenerate: { directory: "community" } }],
        },
        {
          label: "Member Inventory",
          items: [{ autogenerate: { directory: "resources" } }],
        },
        {
          label: "Quests",
          items: [
            {
              label: "Arlathan eXchange",
              link: "https://arlathanxchange.neocities.org",
              attrs: { target: "_blank" },
            },
            {
              label: "DA Polyshipping",
              link: "https://dapolyshipping.neocities.org",
              attrs: { target: "_blank" },
            },
          ],
        },
        {
          label: "The Chantry Board",
          items: [
            { label: "Leadership Team", link: "chantry/leadership" },
            {
              autogenerate: { directory: "chantry" },
            },
          ],
        },
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});
