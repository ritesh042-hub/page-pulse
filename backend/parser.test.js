const { parsePage } = require("./parser");

describe("parsePage", () => {
  it("parses a normal HTML page correctly", () => {
    const html = `
      <html>
        <head>
          <title>Test Page</title>
          <meta name="description" content="A test description">
        </head>
        <body>
          <h1>Main Heading</h1>
          <p>Hello world from Page Pulse</p>
          <img src="one.jpg" alt="Sample image">
          <img src="two.jpg">
        </body>
      </html>
    `;

    const result = parsePage(html);

    expect(result.title).toBe("Test Page");
    expect(result.metaDescription).toBe("A test description");
    expect(result.h1Count).toBe(1);
    expect(result.imagesMissingAlt).toBe(1);
    expect(result.wordCount).toBeGreaterThan(0);
  });

  it("handles HTML with missing optional fields", () => {
    const html = `
      <html>
        <head></head>
        <body>
          <p>Simple content</p>
        </body>
      </html>
    `;

    const result = parsePage(html);

    expect(result.title).toBe("");
    expect(result.metaDescription).toBe("");
    expect(result.h1Count).toBe(0);
    expect(result.imagesMissingAlt).toBe(0);
    expect(result.wordCount).toBe(2);
  });

  it("does not count script and style text as page content", () => {
    const html = `
      <html>
        <head>
          <style>body { color: red; }</style>
        </head>
        <body>
          <h1>Hello</h1>
          <p>Visible words only</p>
          <script>console.log("hidden words");</script>
        </body>
      </html>
    `;

    const result = parsePage(html);

    expect(result.wordCount).toBe(4);
  });
});