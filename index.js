require("dotenv").config();

const express = require("express");
const app = express();

const whitelist = require("./whitelist")();
console.log("Whitelist ", whitelist);

(async function(){
    console.log("Collect and test proxy lists. Please wait a minute...");
    const proxyList = await require("./proxy-list")([
            require("./proxy-sites/free-proxy-list-net"),
            require("./proxy-sites/geonode")
        ]
        // TODO: request after time again
    )

    console.log("Collected proxies:", proxyList);

    let proxyIndex = 0;
    function getNextProxy() {
        const proxy = proxyList[proxyIndex++];
        if (proxyIndex >= proxyList.length) {
            proxyIndex = 0;
        }
        return proxy;
    }

    if (process.env.ENABLE_WHITELIST) {
        // Custom Middleware
        app.use((req, res, next) => {
            if(whitelist.includes(req.socket.remoteAddress)){
                // IP is ok, so go on
                console.log("Passed whitelist.");
                next();
            }
            else{
                // Invalid ip
                console.log("Blocked IP: " + req.socket.remoteAddress + ". Not in whitelist.");
                const err = new Error("Blocked IP: " + req.socket.remoteAddress + ". Not in whitelist.");
                next(err);
            }
        });
    }

    // Error handler
    app.use((err, req, res, next) => {
        console.log('Error handler', err);
        res.status(err.status || 500);
        res.send("Something broke");
    });

    app.get('/', (req, res) => {
        const proxy = getNextProxy();
        return res.send(proxy);
    });

    app.listen(process.env.PORT, () =>
        console.log(`Proxy rotator listening on port ${process.env.PORT}!`),
    );

})();
