module.exports = function getBaseName(username) {
    return username.split(/([0-9]+)$/);
};
