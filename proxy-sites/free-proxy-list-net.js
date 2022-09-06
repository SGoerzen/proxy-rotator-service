const isAny = require("../_helper/isAny");
const isTrue = require("../_helper/isTrue");

module.exports = async function ({limit = 50, upTime = 90, country = "DE", anonymous = true, protocols = ["https"]}) {
    const scraper = require("../scraper");
    await scraper.open();

    const $ = await scraper.load("https://free-proxy-list.net/anonymous-proxy.html");

    const rows = $("#list table tr td").toArray();
    const values = rows.map(r => $(r).text());

    const ips = [];
    for (let i = 0; i < values.length; i += 8) {
        const _ip = values[i];
        const _port = values[i+1];
        const _code = values[i+2];
        const _country = values[i+3];
        const _anonymity = values[i+4];
        const _google = values[i+5];
        const _https = values[i+6];
        const _lastChecked = values[i+7];

        if (!isAny(country) && country !== _code
        ||  protocols.includes("https") && _https === "yes"
        || isTrue(anonymous) && ["elite proxy", "anonymous"].includes(_anonymity)) {
            continue;
        }

        ips.push(`${_ip}:${_port}`);
    }

    scraper.close();

    return ips;
};
