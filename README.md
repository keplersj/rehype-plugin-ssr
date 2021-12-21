# rehype-plugin-ssg

[Rehype](https://github.com/rehypejs/rehype) plugin to render a document ahead of time. This plugin uses [Puppeteer](https://puppeteer.github.io/puppeteer/) to render documents passed to it, allowing any client-side DOM changes to be added to your Rehype pipeline.

## Installation

```sh
npm install rehype-plugin-ssg
```

## Usage

```js
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeFormat from "rehype-format";
import rehypeSSG from "rehype-plugin-ssg";

unified()
  .use(rehypeParse)
  .use(rehypeSSG)
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(file)
  .then((file) => {
    console.log(String(file));
  });
```

## License

Copyright 2021 [Kepler Sticka-Jones](https://keplersj.com). Licensed MIT.
