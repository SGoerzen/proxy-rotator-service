const puppeteer = require("puppeteer-extra");

//const StealthPlugin = require('puppeteer-extra-plugin-stealth');
//puppeteer.use(StealthPlugin());

// Add adblocker plugin, which will transparently block ads in all pages you
// create using puppeteer.
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({blockTrackers: true}));

const cheerio = require("cheerio");

class Scraper {

    async open() {
        this.browser = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
        });
        this.page = await this.browser.newPage();
        // disable images and stylesheets
        await this.page.setRequestInterception(true);
        //if the page makes a  request to a resource type of image then abort that request
        this.page.on('request', request => {
            if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet')
                request.abort();
            else
                request.continue();
        });
    }

    async enableAssets() {
        await this.page.setRequestInterception(false);
    }
    async disableAssets() {
        await this.page.setRequestInterception(true);
    }

    async goto(url) {
        if (!this.browser || !this.page)
            await this.open();
        await this.page.goto(url, { waitUntil: "load", timeout: 60000});
    }

    async content(url) {
        await this.disableAssets();
        await this.goto(url);
        return await this.page.content();
    }

    async screenshot(url) {
        await this.enableAssets();
        await this.goto(url);
        return await this.page.screenshot({ encoding: "base64" });
    }

    close() {
        this.browser.close();
        this.browser = null;
        this.page = null;
    }

    async load(url = undefined) {
        await this.disableAssets();
        if (url)
            await this.goto(url);
        const pageData = await this.page.evaluate(() => {
            return { html: document.documentElement.innerHTML };
        });
        return cheerio.load(pageData.html);
    }

}

module.exports = new Scraper();
