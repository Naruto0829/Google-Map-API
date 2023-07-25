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

app.get("/getAirPollutions", (req, res) => {
   
    const fromYear = req.query.fromYear;
    const toYear = req.query.toYear;
    
    let sql = `SELECT country, city, year, AVG(pm25) AS pm25, AVG(pm10) AS pm10, AVG(no2) AS no2 
                FROM "air_pollution_tbl" 
                WHERE year BETWEEN ${fromYear} and ${toYear} group by country, city limit 500`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
})






app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});