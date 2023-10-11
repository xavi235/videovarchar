const mysql = require('mysql2/promise'); 
/*const db_config = {
    host: 'bryrb8vptbobryfsboyq-mysql.services.clever-cloud.com', 
    user: 'uzgoshvvwp33nc1m', 
    password: 'ARl40ZDCqxRsxxSssbaP', 
    database: 'bryrb8vptbobryfsboyq', 
    port: '3306'
};*/

const db_config = {
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'llajta_solutions', 
    port: 3306
};
const pool = mysql.createPool(db_config);
(async () => {
    try {
        const conexion = await pool.getConnection(); 
        console.log('Se logro la conexion'); 
        conexion.release(); 
    } catch (err) {
        console.log("XXXX")
        console.log('Error: ', err);
    }
});
module.exports = pool;