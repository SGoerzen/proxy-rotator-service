require("dotenv").config();

module.exports = function () {
    return process.env.whitelist ? process.env.whitelist.split(",").map(t => t.trim()) : [];
};
