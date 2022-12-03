const chromium = require("chrome-aws-lambda");
// const puppeteer = require("puppeteer-core");
const puppeteer = require("puppeteer-extra");

// // add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const random = () => {
  return Math.ceil(Math.random() * 10000);
};

const youtube = async (
  automationYoutubeUrl,
  mute,
  chromePath,
  tryLoggedIn,
  username,
  password
) => {
  console.log("debug1", chromePath, automationYoutubeUrl);
  const browser = await puppeteer.launch({
    headless: false,
    ignoreDefaultArgs: ["--enable-automation", "--disable-infobars"],
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      mute === true ? "--mute-audio" : "",
      //   "--disable-background-timer-throttling",
      //   "--enable-automation",
      //   "--disable-infobars",
      //   "--disable-gpu",
      //   "--disable-dev-shm-usage",
      //   "--no-first-run",
      //   "--no-zygote",
      //   "--single-process",
    ],
    // args: chromium.args,
    defaultViewport: null,

    // ignoreHTTPSErrors: true,

    executablePath: chromePath || (await chromium.executablePath),
    // dumpio: true,
  });
  const page = await browser.newPage();

  //   await page.setDefaultNavigationTimeout(0);
  //   await page.setDefaultTimeout(0);
  // console.log("debug2", typeof automationYoutubeUrl);
  await page.goto(
    automationYoutubeUrl
    // {
    //   waitUntil: "load",
    //   timeout: 0,
    // }
  );
  // .then((res) => console.log("ok", res))
  // .catch((res) => console.log("res:", res));

  //----------------------------------------------------------------------------------------------------
  //                                            XXXLOGIN--BUTTONXXX
  //-----------------------------------------------------------------------------------------------------
  //   await new Promise((r) => setTimeout(r, 1000));
  //   await page.waitFor(1000);
  //   await page.waitForXPath(
  //     '//a//tp-yt-paper-button//yt-formatted-string[contains(text(),"Sign in")]'
  //   );
  //   let loginButton = await page.$x(
  //     '//a//tp-yt-paper-button//yt-formatted-string[contains(text(),"Sign in")]'
  //   );
  //   await loginButton[0].click();
  //   await page.waitForNavigation({ waitUntil: "networkidle2" });
  //   // await page.waitForTimeout(1000);
  //   await page.waitForSelector('input[name="identifier"]');
  //   await page.type('input[name="identifier"]', username, { delay: 338 });
  // //----------------------------------------------------------------------------------------------------
  // // //                                            XXXLOGINXXX
  // // //-----------------------------------------------------------------------------------------------------
  // let nextLoginButton = await page.$x(
  //   '//button//span[contains(text(),"Next")]'
  // );
  // await nextLoginButton[0].click();
  // await page.waitForNavigation({ waitUntil: "networkidle2" });
  // await page.waitFor(3500 + random(1));
  // await page.waitForSelector('input[name="password"]');

  // await page.type('input[name="password"]', password, { delay: 300 });

  // // //----------------------------------------------------------------------------------------------------
  // // //                                            XXXPASSWORDXXX
  // // //-----------------------------------------------------------------------------------------------------
  // let nextPasswordButton = await page.$x(
  //   '//button//span[contains(text(),"Next")]'
  // );
  // await page.waitFor(1000 + random(0.3));

  // await nextPasswordButton[0].click();
  // await page.waitForNavigation({ waitUntil: "networkidle2" });
  // // await page.waitFor(5000);

  // //----------------------------------------------------------------------------------------------------
  // //                                            XXX-SET-UP-XXX
  // //-----------------------------------------------------------------------------------------------------
  //await for the play button to appear to continue
  //   await page.waitForSelector(
  //     "button.yt-spec-touch-feedback-shape--touch-response.yt-spec-touch-feedback-shape__fill"
  //   );
  await page.waitForXPath('//button[@aria-label="Loop playlist"]');
  //   console.log("debug5");
  //   let playButton = await page.$x('//button[@title="Play (k)"]');
  let loopPlaylistEnable = await page.$x(
    '//button[@aria-label="Loop playlist"]'
  );

  //click loop, mute and play
  await loopPlaylistEnable[0].click();

  await new Promise(function (resolve) {
    setTimeout(resolve, 200 + random(0.5));
  });
  //   await page.waitFor(1000).then(() => console.log("Waited a second!"));
  //   await page.waitFor(200 + random(0.5));
  await new Promise(function (resolve) {
    setTimeout(resolve, 100 + random(0.5));
  });

  // await page.waitFor(100 + random(0.5));

  const totalPlaylistVideoNumber = await page.$$eval(
    "span.style-scope.yt-formatted-string",
    (spans) => Number(spans.at(-1).textContent)
  );
  //   await page.click('button[@title="Play (k)"]');
  // console.log("playList", playlistVideoNumberSelector);

  //   await page.waitForXPath('//a[title="Next (SHIFT+n)"]');
  const nextButton = await page.$$("a.ytp-next-button.ytp-button");

  let howManyTimesPlaylistPlayed = 0;
  let i;
  // //----------------------------------------------------------------------------------------------------
  // //                                            XXX-Play FOREVER-XXX
  // //-----------------------------------------------------------------------------------------------------
  while (true) {
    howManyTimesPlaylistPlayed += 1;
    console.log("BEGINNING ...");
    //--
    for (i = 0; i <= totalPlaylistVideoNumber; i++) {
      console.log("Play ... video #", i);
      await new Promise(function (resolve) {
        setTimeout(resolve, 30000);
      });
      // console.log(random(), typeof randomVideoTime, i);
      await new Promise(function (resolve) {
        setTimeout(resolve, random());
      });

      await nextButton[0].click();
    }
    console.log("END OF THE PLAYLIST #", i + 1);
    console.log(
      "The playlist has played::",
      howManyTimesPlaylistPlayed,
      ". Views are",
      howManyTimesPlaylistPlayed,
      "x",
      totalPlaylistVideoNumber,
      "=",
      howManyTimesPlaylistPlayed * totalPlaylistVideoNumber,
      "."
    );
    console.log("Just close the browser is you want to stop.");
    //--
    await page.goto(
      automationYoutubeUrl
      // {
      //   waitUntil: "load",
      //   timeout: 0,
      // }
    );
  }
};
module.exports = youtube;
