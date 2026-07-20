const puppeteer = require("puppeteer-core");

const EDGE = "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge";
const BASE = "http://localhost:8734/";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: "shell",
    args: ["--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1"],
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: "networkidle0", timeout: 60000 });
  await sleep(4500);

  const shots = [
    ["01-hero", 0],
    ["02-manifesto", "#manifesto"],
    ["03-axis", "#axis"],
    ["04-walch", "#ch-walch"],
    ["05-na", "#ch-na"],
    ["06-lamama", "#ch-lamama"],
    ["07-seika", "#ch-seika"],
    ["08-foryoume", "#ch-foryoume"],
    ["09-matrix", "#matrix"],
    ["10-outro", "bottom"],
  ];

  for (const [name, target] of shots) {
    if (target === 0) {
      await page.evaluate(() => window.scrollTo(0, 0));
    } else if (target === "bottom") {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    } else {
      await page.evaluate((sel) => {
        document.documentElement.style.scrollBehavior = "auto";
        document.querySelector(sel).scrollIntoView();
      }, target);
    }
    await sleep(2200);
    await page.screenshot({ path: `qa/${name}.png` });
    console.log("shot", name);
  }

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
