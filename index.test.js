import { jest } from "@jest/globals";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeFormat from "rehype-format";
import { readFile } from "node:fs/promises";

jest.setTimeout(10_000);

describe("Rehype Atomico Hydration Plugin", () => {
  it("transforms a document as expected", async () => {
    const { default: rehypeSSG } = await import("./index.js");

    const engine = unified()
      .use(rehypeParse)
      .use(rehypeSSG)
      .use(rehypeFormat)
      .use(rehypeStringify);

    const document = await readFile("./testDocument.html");

    const processed = await engine.process(document);

    expect(processed.value).toMatchInlineSnapshot(`
"
<html>
  <head></head>
  <body>
    <script type=\\"module\\">import { c, html } from \\"https://cdn.skypack.dev/atomico\\";
function component() {
return html\`
<host>
<p>I'm going to be hydrated!</p>
</host>
\`;
}
console.log(\\"Hello from Module!\\");
customElements.define(\\"custom-paragraph\\", c(component));</script>
    <custom-paragraph data-hydrate=\\"\\">
      <p>I'm going to be hydrated!</p>
    </custom-paragraph>
  </body>
</html>
"
`);
  });
});
