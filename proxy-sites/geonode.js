const isAny = require("../_helper/isAny");
const isTrue = require("../_helper/isTrue");

module.exports = async function ({limit = 50, upTime = 90, country = "DE", anonymous = true, protocols = ["https"]}) {
    const axios = require("axios").default;

    // transform "," to "%2C"
    const proto = protocols.join("%2C");

    let url = `https://proxylist.geonode.com/api/proxy-list?limit=${limit}&page=1&sort_by=lastChecked&sort_type=desc`;

    if (!isAny(proto))
        url += `&protocols=${proto}`;
    if (!isAny(upTime))
        url += `&filterUpTime=${upTime}`;
    if (!isAny(country))
        url += `&country=${country}`;
    if (isTrue(anonymous))
        url += "&anonymityLevel=elite&anonymityLevel=anonymous";

    const res = await axios.get(url);

    return res.data.data.map(d => d.ip);
};
