var mysql = require('mysql');


var con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "mm_db",
});

module.exports=con;