
const ping = require("ping");


module.exports = async function (providers) {
    return new Promise(async resolve => {
        const allIps = [];
        for (const provider of providers) {
            const ips = await provider();

            for (const ip of ips) {
                const res = await ping.promise.probe(ip);

                if (res.alive) {
                    allIps.push(res.host);
                }
            }
        }
        resolve && resolve(allIps);
    });
};
