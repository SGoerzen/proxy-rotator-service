require("dotenv").config();

module.exports = function () {
    return process.env.WHITELIST ? process.env.WHITELIST.split(",").map(t => t.trim()) : [];
};
