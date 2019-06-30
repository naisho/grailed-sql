let sqlite3 = require("sqlite3").verbose();
const databasePath =
    process.env.DATABASE_PATH || "public/grailed-exercise.sqlite3";
console.log(`Opening ${databasePath}...`);
let db = new sqlite3.cached.Database(databasePath);

function query(sql) {
    return new Promise(resolve => {
        db.all(sql, (err, rows) => {
            if (err) console.log(err);
            resolve(rows);
        });
    });
}

function run(sql) {
    return new Promise(resolve => {
        db.run(sql, function(err) {
            if (err) console.log(err);
            resolve(this);
        });
    });
}

function close() {
    db.close();
}

module.exports = {
    close,
    query,
    run
};
