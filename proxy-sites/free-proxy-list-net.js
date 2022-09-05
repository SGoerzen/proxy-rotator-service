module.exports = async function () {
    const scraper = require("../scraper");
    await scraper.open();

    const $ = await scraper.load("https://free-proxy-list.net/anonymous-proxy.html");

    const rows = $("#list table tr td:first-child").toArray();

    const ips = rows.map(r => $(r).text());

    scraper.close();

    return ips;
};
