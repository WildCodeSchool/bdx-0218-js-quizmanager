const mysql = require('mysql');
const connectionParameters = require('./sqlParameters');

checkLogin = (user,cb) => {
    try {
        const connection = mysql.createConnection(connectionParameters);
        connection.connect((err) => {
            try {
                if (err) {
                    throw ('connection with the database failed '+err);
                } else {
                connection.query(
                    `SELECT pass FROM admin WHERE login='${user}';`, (err, rows) => {
                        if (err) {
                            throw err;
                        } else {
                            if (rows[0] === undefined) {
                                cb(undefined);
                            } else {
                                cb(rows[0].pass);
                            }
                        }
                    });
                }
            } catch (err) {
                throw ('An error occur '+ err);
            } finally {
                connection.end();
            }
        });
    } catch (err) {
        throw ('An error occur: '+err);
    }
}

module.exports = {checkLogin};
