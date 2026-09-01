const { minifyJs } = require("./11ty");
const Image = require("@11ty/eleventy-img").default;

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("CNAME");
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

  return {
    dir: {
      input: "src",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts",
    },
  };
};
