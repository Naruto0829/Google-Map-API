const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

let db = new sqlite3.Database('./db/pollution.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the pollution database.');
});

app.get('/', (req, res) => {
    res.sendFile('air.html',  { root: __dirname }); 
});


app.get('/water', (req, res) => {
    res.sendFile('water.html',  { root: __dirname }); 
});

app.get('/noise', (req, res) => {
    res.sendFile('noise.html',  { root: __dirname }); 
});

app.get('/soil', (req, res) => {
    res.sendFile('soil.html',  { root: __dirname }); 
});


app.get("/getAirPollutions", (req, res) => {
   
    const fromYear = req.query.fromYear;
    const toYear = req.query.toYear;
    
    let sql = `SELECT country, city, year, AVG(pm25) AS pm25, AVG(pm10) AS pm10, AVG(no2) AS no2 
                FROM "air_pollution_tbl" 
                WHERE year BETWEEN ${fromYear} and ${toYear} GROUP BY city limit 1000`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);

    });
})

app.get("/getWaterPollutions", (req, res) => {
   
    const fromYear = req.query.fromYear;
    const toYear = req.query.toYear;
    
    let sql = `SELECT country, city, year, AVG(result) AS result, pollution, desc, unit
                FROM "water_pollution_tbl" 
                WHERE year BETWEEN ${fromYear} and ${toYear} GROUP BY city limit 1000`;
                console.log(sql);

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);

    });
})


app.get("/getNoisePollutions", (req, res) => {
   
    const fromYear = req.query.fromYear;
    const toYear = req.query.toYear;
    
    let sql = `SELECT latitude, longitude, volume, year
                FROM "noise_pollution_tbl"
                WHERE year BETWEEN ${fromYear} and ${toYear} GROUP BY longitude limit 1000`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);

    });
})

app.get("/getSoilPollutions", (req, res) => {
   
    const fromYear = req.query.fromYear;
    const toYear = req.query.toYear;
    
    let sql = `SELECT latitude, longitude, volume, year
                FROM "soil_pollution_tbl"
                WHERE year BETWEEN ${fromYear} and ${toYear} GROUP BY longitude limit 1000`;

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