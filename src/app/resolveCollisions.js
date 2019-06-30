const dao = require("../dao");
const util = require("../util");

function resolveCollisions(collisions, users) {
    return Promise.all([collisions(), users()])
        .then(([collisions, users]) => {
            const suffix = util.userSuffixes(users);

            const resolved = collisions.map(user => {
                const [name] = util.getBaseName(user.username);
                return {
                    id: user.id,
                    current: user.username,
                    new: `${name}${++suffix[name]}`
                };
            });

            console.log(`${resolved.length} rows will be affected.`);
            if (process.env.DRY_RUN) {
                return resolved;
            } else {
                console.log(`Resolving collisions...`);
                return dao.batchUpdateUsers(resolved);
            }
        })
        .then(results => {
            if (results) console.log(results);
            return results;
        })
        .finally(dao.close());
}

function resolveDisallowed() {
    return resolveCollisions(dao.findDisallowed, dao.findAllUsers);
}

function resolveDuplicates() {
    return resolveCollisions(dao.findDuplicateAllowedUsers, dao.findAllowed);
}

module.exports = { resolveDisallowed, resolveDuplicates };
