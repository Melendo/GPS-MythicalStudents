var mysql = require('mysql');
require('dotenv').config({ path: './.env' });

var con = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "mm_db",
});

module.exports=con;
