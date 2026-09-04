const { minifyJs } = require("./11ty");
const Image = require("@11ty/eleventy-img").default;

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("src/assets/images/88x31");
  eleventyConfig.addNunjucksAsyncFilter('jsmin', minifyJs);

  eleventyConfig.addNunjucksAsyncShortcode("image", async function (src, alt, className = "") {
    const metadata = await Image(src, {
      widths: [600, 1000, 1400, 2000],
      formats: ["avif", "webp"],
      outputDir: "./_site/assets/images/optimized/",
      urlPath: "/assets/images/optimized/",
    });

    return Image.generateHTML(metadata, {
      alt: alt,
      loading: "lazy",
      decoding: "async",
      class: className,
      sizes: "(max-width: 768px) 100vw, 50vw",
    });
  });

  eleventyConfig.addNunjucksAsyncShortcode("favicon", async function (src, size) {
    const metadata = await Image("src/assets/images/favicons/"+src, {
      widths: [size],
      formats: ["png"],
      outputDir: "./_site/assets/images/favicons/",
      urlPath: "/assets/images/favicons/"
    });

    return metadata.png[0].url;
  });

  const buttonCache = new Map();

  eleventyConfig.addNunjucksAsyncShortcode("button", async function (url, index) {
    let data = buttonCache.get(url);

    if (!data) {
      const response = await fetch(url + "/.well-known/button.json");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch button list: ${response.status} ${url}`
        );
      }

      data = await response.json();

      buttonCache.set(url, data);
    }

    const button = data.buttons[index];

    if (!button) {
      throw new Error(`A 88x31 button does not exist at index "${index}" from website "${url}"`);
    }

    return `
      <a href="${button.link}" target="_blank" rel="noopener noreferrer">
        <img src="${button.uri}" alt="${button.alt}" width="88" height="31" loading="lazy">
      </a>
    `;
  });

  return {
    dir: {
      input: "src",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts",
    },
  };
};
