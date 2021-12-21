import { raw } from "hast-util-raw";
import { toHtml } from "hast-util-to-html";
import puppeteer from "puppeteer";
import parse5 from "parse5";
import { fromParse5 } from "hast-util-from-parse5";

export default function rehypeSSG() {
  return async (tree, file) => {
    const browser = await puppeteer.launch({
      args: [
        ...puppeteer.defaultArgs(),
        // IMPORTANT: you can't render shadow DOM without this flag
        // getInnerHTML will be undefined without it
        "--enable-experimental-web-platform-features",
      ],
    });
    const page = await browser.newPage();

    // networkidle0 waits for the network to be idle (no requests for 500ms).
    // The page's JS has likely produced markup by this point, but wait longer
    // if your site lazy loads, etc.
    const html = toHtml(tree);
    await page.setContent(html, {
      waitUntil: ["domcontentloaded", "networkidle0"],
    });

    const renderedHtml = await page.$eval(
      "html",
      /* istanbul ignore next */
      (element) => {
        return element.getInnerHTML({ includeShadowRoots: true });
      }
    );
    await browser.close();

    const p5ast = parse5.parse(renderedHtml, { sourceCodeLocationInfo: true });
    const hast = fromParse5(p5ast, file);

    tree = raw(hast);

    return tree;
  };
}
