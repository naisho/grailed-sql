const sql = require("./sqlite3");

function findDisallowed() {
    return sql.query(`
        SELECT id, username FROM 'users'
        WHERE username IN (SELECT invalid_username FROM 'disallowed_usernames')
        ORDER BY username;
    `);
}

function findAllowed() {
    return sql.query(`
        SELECT id, username FROM 'users'
        WHERE username NOT IN (SELECT invalid_username FROM 'disallowed_usernames')
        ORDER BY id;
    `);
}

function findAllUsers() {
    return sql.query(`
        SELECT * from 'users';
    `);
}

function findDistinctUsers() {
    return sql.query(`
        SELECT DISTINCT username from 'users';
    `);
}

function findDuplicateUsers() {
    return sql.query(`
        SELECT a.id, a.username FROM 'users' as a
        JOIN (
            SELECT id, username, COUNT(*) c from 'users'
            GROUP BY username HAVING c > 1
        ) as b
        ON a.username = b.username
        WHERE a.id != b.id;
    `);
}

function findDuplicateAllowedUsers() {
    return sql.query(`
        SELECT a.id, a.username FROM 'users' as a
        JOIN (
            SELECT id, username, COUNT(*) c from 'users'
            WHERE username NOT IN (SELECT invalid_username FROM 'disallowed_usernames')
            GROUP BY username HAVING c > 1
        ) as b
        ON a.username = b.username
        WHERE a.id != b.id;
    `);
}

function updateUser({ id, username }) {
    return sql.run(`
        UPDATE 'users'
        SET username="${username}"
        WHERE id=${id};
    `);
}

function batchUpdateUsers(users) {
    return Promise.all(users.map(user => updateUser(user))).then(updates => {
        const affectedRows = updates.reduce(
            (sum, update) => sum + update.changes,
            0
        );
        return `${affectedRows} entries have been changed.`;
    });
}

function close() {
    sql.close();
}

module.exports = {
    batchUpdateUsers,
    close,
    findDisallowed,
    findAllowed,
    findAllUsers,
    findDistinctUsers,
    findDuplicateUsers,
    findDuplicateAllowedUsers,
    updateUser
};
