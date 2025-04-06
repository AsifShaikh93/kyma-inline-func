const mysql = require('mysql2/promise');

module.exports = {
  main: async function (event, context) {
    return 'hello world'
    try {
      // Step 1: Extract the path
      const path = event.extensions?.request?.path || '/default';
      console.log('Request path:', path);

      // Step 2: Make external API call using that path
      const backendURL = `http://a0896a9db16b143c9966c6a847ccbc36-1181281374.eu-central-1.elb.amazonaws.com/workverse/{path}`;
      const apiRes = await fetch(backendURL);
      const responseText = await apiRes.text();

      console.log('Response from backend:', responseText);

      // Step 3 (optional): Save to DB
      const connection = await mysql.createConnection({
        host: 'mysql.asif-test.svc.cluster.local',
        user: 'root',
        password: 'root',
        database: 'testdb',
      });

      await connection.execute('INSERT INTO messages (message) VALUES (?)', [responseText]);
      console.log('Saved to DB:', responseText);
      await connection.end();

      // Step 4: Return response
      return {
        statusCode: 200,
        body: responseText
      };

    } catch (err) {
      console.error('Error:', err);
      return {
        statusCode: 500,
        body: 'Something went wrong'
      };
    }
  }
};
