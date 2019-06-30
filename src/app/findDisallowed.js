const dao = require("../dao");

function findDisallowed() {
    return dao
        .findDisallowed()
        .then(results => {
            if (results && results.length) {
                console.log("Disallowed Users:", results);
            } else {
                console.log("No disallowed users found.");
            }
            return results;
        })
        .finally(dao.close());
}

module.exports = findDisallowed;
