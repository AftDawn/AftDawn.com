const site = require("./site.json");

module.exports = {
    "tags": [
        { property: "og:locale",             content: site.locale },
        { property: "og:type",               content: "website" },
        { property: "og:title",              content: site.title },
        { property: "og:description",        content: site.description },
        { property: "og:image",              content: site.url + "/assets/images/og-preview.png" },
        { property: "og:image:alt",          content: "A preview of AftDawn's website" },
        { property: "og:url",                content: site.url },
        { property: "og:site_name",          content: site.name },
        { property: "All",                   content: "audience" },
        { name: "twitter:card",              content: "summary_large_image" },
        { name: "twitter:title",             content: site.title },
        { name: "twitter:description",       content: site.description },
        { name: "twitter:image",             content: site.url + "/assets/images/og-preview.png" },
        { name: "twitter:image:alt",         content: "A preview of AftDawn's website" },
        { name: "keywords",                  content: site.keywords },
        { name: "description",               content: site.description },
        { name: "robots",                    content: "index,follow" },
        { name: "googlebot",                 content: "index,follow" },
        { name: "viewport",                  content: "width=device-width, initial-scale=1.0" }
    ]
}