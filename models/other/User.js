var mysql = require('mysql');
var Promise = require('bluebird');


var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});
conn.on('error', function(err) {
    console.log(__filename, err.message);
});

var sql = 'CREATE TABLE IF NOT EXISTS users(\
id INTEGER PRIMARY KEY AUTO_INCREMENT,\
    username TEXT,\
    password TEXT,\
    phone TEXT,\
    email TEXT\
);';

conn.query(sql);

function query(sql, arr) {
    return new Promise(function (resolve, reject) {
        conn.query(sql, arr, function (err, rows, fields) {
            if (err) {
                reject(err);
            } else {
                resolve({rows: rows, fields: fields});
            }
        });
    });
}

function count() {
    return query('select count(*) as count from users', []);
}

function getUsers(offset, rows) {
    return query("select * from users limit ?,?", [parseInt(offset), parseInt(rows)]);
}

function regUser($username, $password, $phone, $email) {
    var sql = 'INSERT INTO users(username, password, phone, email) values(?, ?, ?, ?)';
    return query(sql, [$username, $password, $phone, $email]);
}

exports.count = count;
exports.getUsers = getUsers;
exports.regUser = regUser;