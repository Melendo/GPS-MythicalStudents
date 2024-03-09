var mysql = require('mysql');


var con = mysql.createPool({
    host: "db",
    user: "mythmingle",
    password: "2StkpKE3B9JDP",
    database: "mm_db",
});

module.exports=con;
