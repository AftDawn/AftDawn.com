const { minifyJs } = require("./11ty");
const Image = require("@11ty/eleventy-img").default;
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const { cp } = require("node:fs/promises");

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("src/assets/images/88x31");
  eleventyConfig.addPassthroughCopy("src/robots.txt")
  eleventyConfig.addNunjucksAsyncFilter('jsmin', minifyJs);
  

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: "webp",
    outputDir: "./.cache/images/",
    urlPath: "/assets/images/",
    defaultAttributes: {
      loading: "lazy",
      decoding: "async"
    },
    useCache: true
  });

  // stupid simple .cache thingy
  eleventyConfig.on("eleventy.after", async () => {
    await cp(
      ".cache/images",
      "_site/assets/images",
      { recursive: true }
    );
    await cp(
      ".cache/favicons",
      "_site/assets/images/favicons",
      { recursive: true }
    );
  });

  eleventyConfig.addNunjucksAsyncShortcode("favicon", async function (src, size) {
    const metadata = await Image("src/assets/images/favicons/"+src, {
      widths: [size],
      formats: ["png"],
      outputDir: "./.cache/favicons/",
      urlPath: "/assets/images/favicons/"
    });

    return metadata.png[0].url;
  });

  const buttonCache = new Map();

  function generateButton(link, imagePath, alt) {
    return `
      <a href="${link}" target="_blank" rel="noopener noreferrer">
        <img src="${imagePath}" alt="${alt}" width="88" height="31" loading="lazy" eleventy:ignore>
      </a>
    `;
  }

  eleventyConfig.addNunjucksAsyncShortcode("wellKnownButton", async function (url, index) {
    let data = buttonCache.get(url);

    if (!data) {
      const response = await fetch("https://" + url + "/.well-known/button.json");

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

    return generateButton(button.link, button.uri, button.alt);
  });

  eleventyConfig.addNunjucksShortcode("simpleSelfHostedButton", function (link, imagePath, alt) {
    return generateButton(`https://${link}`, `https://${link}/${imagePath}`, alt);
  });

  eleventyConfig.addNunjucksShortcode("simpleButton", function (link, imagePath, alt) {
    return generateButton(link, imagePath, alt);
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
