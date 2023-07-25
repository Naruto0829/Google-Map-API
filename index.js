const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/pollution.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the pollution database.');
});

app.get('/', (req, res) => {
    res.sendFile('index.html',  { root: __dirname }); 
});

app.get("/getAirPollutions", async (req, res) => {
   
    const fromYear = req.query.fromYear;
    const toYear = req.query.toYear;
    
    let sql = `SELECT *  FROM air_pollution_tbl WHERE year between ${fromYear} and ${toYear}`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }

        console.log(rows);
    });

    
})

app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});