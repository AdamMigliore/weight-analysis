import puppeteer from "puppeteer";
import { DateTime } from "luxon";

const MFP_DIARY_URL = "https://www.myfitnesspal.com/food/diary";
const MFP_WEIGHT_URL = "https://www.myfitnesspal.com/food/diary";
const MFP_BODY_FAT_URL = "https://www.myfitnesspal.com/food/diary";

main();

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 800, height: 600 });

  const email = process.env.MFP_EMAIL;
  const password = process.env.MFP_PASSWORD;

  const today = DateTime.now();
  const yesterday = today.minus({ days: 1 });

  await login(page, email, password);
  const calories = await getCalories(page, yesterday);
  await browser.close();
}

async function login(page, email, password) {
  // Redirect to login page
  await page.goto("https://www.myfitnesspal.com/account/login", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await delay(2000);
  //   const cookieButton = await page.waitForSelector(
  //     "#notice > div:nth-child(3) > button"
  //   );
  //   console.log(cookieButton);

  //   await cookieButton.click();

  await page.type("#email", email);
  await page.type("#password", password);

  const loginButton = await page.waitForSelector(
    "#__next > div > main > div > div > form > div > div:nth-child(2) > button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-fullWidth.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-fullWidth.css-19ewlr8"
  );
  await loginButton.click();
  await page.waitForNavigation();
}

async function getCalories(page, date) {
  const url = `${MFP_DIARY_URL}?date=${date.toISODate()}`;
  await page.goto(url);

  const total_el = await page.waitForSelector(
    "#diary-table > tbody > tr.total > td:nth-child(2)"
  );

  console.log(total_el);

  const total_str = await (
    await total_el.getProperty("textContent")
  ).jsonValue();

  const daily_total_el = await page.waitForSelector(
    "#diary-table > tbody > tr.total.alt > td:nth-child(2)"
  );

  const daily_total_str = await (
    await daily_total_el.getProperty("textContent")
  ).jsonValue();

  const calories = {
    total: Number.parseInt(total_str.replace(",", "")),
    daily_total: Number.parseInt(daily_total_str.replace(",", "")),
  };

  return calories;
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
