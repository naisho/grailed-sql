const findDisallowed = require("./app/findDisallowed");
const resolveDisallowed = require("./app/resolveCollisions").resolveDisallowed;
const resolveDuplicates = require("./app/resolveCollisions").resolveDuplicates;

module.exports = {
    findDisallowed,
    resolveDisallowed,
    resolveDuplicates
};
