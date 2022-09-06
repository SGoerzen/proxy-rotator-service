module.exports = function isAny(p) {
    return (!p || (typeof(p) === "string" && ["NO", "FALSE", "ANY", "ALL"].includes(p)))
};
