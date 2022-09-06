module.exports = function isTrue(p) {
    if (p === null || p === undefined || p === false)
        return false;
    return p === true || p === 1 || (typeof(p) === "string" && (p.toLowerCase() === "true" || p === "1"));

};
