const mysql = require('mysql');
const connectionParameters = require('./sqlParameters');

validateQuiz = (id,obj,cb) => {
    try {
        const connection = mysql.createConnection(connectionParameters);
        try {
            connection.connect((err) => {
                try {
                    connection.query('
                        UPDATE Quiz
                            SET title = ?,
                            category = ?,
                            checked = ?,
                            WHERE id = ?
                            ',[obj.title,obj.category,obj.checked,id], function (error, results, fields) {
                                if (error) throw error;
                                cb('update succeed!');
                              });
                    } catch {
                         throw ('An error occur during the data update: '+err);
                }        
            });
        } catch (err) {
            throw ('An error occur during the connection process: '+ err);
        }

    } catch (err) {
        throw ('An error occur during the connection creation process: '+ err);
    }
};


// TODO
// updateQuestion = (id,obj,cb) => {
//     try {

//     } catch (err) {
//         throw ('An error occur, try again later: '+err);
//     }
// }