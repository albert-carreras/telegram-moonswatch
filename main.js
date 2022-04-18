const puppeteer = require('puppeteer');
const jsdom = require('jsdom');

const WIDTH = 1920;
const HEIGHT = 1080;

const url = 'https://www.swatch.com/nl-nl/mission-to-the-moon-so33m100/SO33M100.html';

const runTask = async () => {
    try {
        const success = await runPuppeteer(url);

        if (success) {
            console.log('watch wtf')
            process.exit(0);
        }
        console.log('no watch')
        process.exit(1);
    } catch (e) {
        // TODO email
        console.log(e, 'ERROR');
        process.exit(1);
    }
};

const runPuppeteer = async (url) => {
    console.log('launching puppet')
    const browser = await puppeteer.launch({
        headless: true,
        args: [`--window-size=${WIDTH},${HEIGHT}`],
        defaultViewport: {
            width: WIDTH,
            height: HEIGHT,
        },
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36');

    console.log('going to page')
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const htmlString = await page.content();
    const dom = new jsdom.JSDOM(htmlString);

    console.log('checking page')
    const result = dom.window.document.querySelector('[data-widget="productDetailAddToCart"]');
    if (result) {
        const success = !result.disabled;
        console.log(success, 'success');
        await browser.close();
        return success;
    }
    throw new Error('No button');
};

runTask();
