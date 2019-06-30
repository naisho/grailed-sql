const getBaseName = require("./getBaseName");

module.exports = function userSuffixes(users) {
    const userSuffixes = {};
    users.forEach(user => {
        const { username } = user;
        const [baseName, lastNumber] = getBaseName(username);
        userSuffixes[baseName] = Math.max(
            lastNumber || 0,
            userSuffixes[baseName] || 0
        );
    });
    return userSuffixes;
};
