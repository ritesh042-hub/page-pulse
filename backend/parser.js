const cheerio = require("cheerio");

/**
 * Extracts audit information from an HTML document.
 *
 * @param {string} html - Raw HTML content.
 * @returns {{
 *   title: string,
 *   metaDescription: string,
 *   h1Count: number,
 *   imagesMissingAlt: number,
 *   wordCount: number
 * }}
 */
function parsePage(html) {
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim();

  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() || "";

  const h1Count = $("h1").length;

  let imagesMissingAlt = 0;

  $("img").each((_, image) => {
    const alt = $(image).attr("alt");

    if (!alt || alt.trim() === "") {
      imagesMissingAlt += 1;
    }
  });

  // Remove elements whose text should not count as page content.
  $("script, style, noscript").remove();

  const bodyText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = bodyText
    ? bodyText.split(" ").filter(Boolean).length
    : 0;

  return {
    title,
    metaDescription,
    h1Count,
    imagesMissingAlt,
    wordCount,
  };
}

module.exports = {
  parsePage,
};