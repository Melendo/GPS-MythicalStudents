var mysql = require('mysql');


var con = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "mm_db",
});

require('dotenv').config({ path: './.env' });

module.exports=con;
