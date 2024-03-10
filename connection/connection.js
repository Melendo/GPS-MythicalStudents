var mysql = require('mysql');


var con = mysql.createPool({
    host: "db_myth",
    user: "mythmingle",
    password: "2StkpKE3B9JDP",
    database: "mm_db",
});

module.exports=con;
