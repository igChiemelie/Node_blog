let mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'nodetest'
});

// connection.on('error', function(err) {
//   console.log("[mysql error]",err);
// });

module.exports = connection;

