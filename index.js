 const mysql = require('mysql2/promise');
 
 module.exports = {
   main: async function (event, context) {
     try {
       const msg = event.data.msg;
 
       const connection = await mysql.createConnection({
         host: 'mysql.asif-test.svc.cluster.local',
         user: 'root',
         password: 'root',
         database: 'testdb',
       });
 
       await connection.execute('INSERT INTO messages (message) VALUES (?)', [msg]);
       console.log('Inserted into DB:', msg);
 
       await connection.end();
 
       return { status: 'ok', saved: msg };
     } catch (err) {
       console.error('DB error:', err);
       return { status: 'error', message: err.message };
     }
   }
 };
