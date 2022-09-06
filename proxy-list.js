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

module.exports = async function (providers) {
    return new Promise(async resolve => {
        const allIps = [];
        for (const provider of providers) {
            const ips = await provider(settings);

            for (const ip of ips) {
                const res = await ping.promise.probe(ip);

                if (res.alive) {
                    allIps.push(res.host);
                }
            }
        }

        // filter duplicate values
        const uniqueIps = uniq(allIps);

        // limit values
        if (uniqueIps.length >= listLimit)
            uniqueIps.length = listLimit;

        // return
        resolve && resolve(uniqueIps);
    });
};
