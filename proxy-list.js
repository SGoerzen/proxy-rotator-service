require("dotenv").config();

const ping = require("ping");

const {uniq, compact} = require("lodash");

const {
    PROXY_LIST_LIMIT,
    PROXY_SITES_LIMIT,
    FILTER_UPTIME_PERCENT,
    FILTER_COUNTRY,
    FILTER_PROTOCOL,
    ONLY_ANONYMOUS
} = process.env;

const listLimit = PROXY_LIST_LIMIT || 50;
const country = FILTER_COUNTRY || "any";
const protocolString = FILTER_PROTOCOL || "https";

// TODO: settings over GET parameters
const settings = {
    limit: PROXY_SITES_LIMIT || 50,
    upTime: FILTER_UPTIME_PERCENT || 90,
    country: country.toUpperCase(),
    protocols: protocolString.split(" ").join("").split(","),
    anonymous: ONLY_ANONYMOUS
};

async function getProxiesFromProviders(providers) {
    const allProxies = [];

    for (const provider of providers) {
        const proxies = await provider(settings);

        for (const {ip, port} of proxies) {
            const proxy = `${ip}:${port}`;

            // skip if already exists
            if (allProxies.includes(proxy))
                continue;

            const res = await ping.promise.probe(ip);
            if (res.alive) {
                allProxies.push(proxy);
                if (allProxies.length >= listLimit) {
                    return allProxies;
                }
            }
        }
    }
    return allProxies;
}

module.exports = async function (providers) {
    return new Promise(async resolve => {
        const allProxies = await getProxiesFromProviders(providers);

        // filter duplicate values
        const uniqueProxies = uniq(allProxies);

        // limit values
        if (uniqueProxies.length >= listLimit)
            uniqueProxies.length = listLimit;

        // return
        resolve && resolve(uniqueProxies);
    });
};
