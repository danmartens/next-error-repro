import { parseArgs } from "node:util";

import puppeteer from "puppeteer";
import { execa, $ } from "execa";
import chalk from "chalk";

const {
  positionals: [example],
  values: { count },
} = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
  options: {
    count: {
      type: "string",
      short: "c",
    },
  },
});

if (example == null) {
  process.stderr.write("Usage: node test.mjs <example>\n");
  process.exit(1);
}

const REQUEST_COUNT = count == null ? 100 : parseInt(count, 10);

(async () => {
  await execa("pnpm", ["build"], { stdio: "inherit" });

  const server = execa("pnpm", ["start"]);

  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.setCacheEnabled(false);

  let requestsRemaining = REQUEST_COUNT;
  let failures = 0;

  while (requestsRemaining-- > 0) {
    await page.goto(`http://localhost:3000/${example}/test2/test3/test4`);

    await page.waitForNetworkIdle();

    const scripts = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("script"),
        (element) => element.textContent
      )
    );

    const lastScript = scripts[scripts.length - 1];

    if (lastScript != null && /^\s*B/.test(lastScript)) {
      failures++;

      process.stderr.write(chalk.red("F"));
    } else {
      process.stderr.write(chalk.green("."));
    }
  }

  server.kill("SIGTERM");

  await browser.close();

  process.stderr.write(
    `\n\nFailed ${failures} times (${(failures / REQUEST_COUNT) * 100}%)\n`
  );

  process.exit(0);
})();
