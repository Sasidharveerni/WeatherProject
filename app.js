const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const query = req.body.cityName;
  const apikey = "a43fa6f052072edb35f915ba4fb52bbb";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apikey + "&units=" + unit;

  https.get(url, function(response) {
    console.log(response.statusCode);
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temperature = weatherData.main.temp;
      const weatherDesc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

      const resultHTML = `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
        <head>
          <meta charset="utf-8">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
        </head>
        <body style = 'background-image: url(images/weather-img.jpg); background-repeat: no-repeat;
        background-size: 100% auto;' >
            <div class="container">
              <div class="row justify-content-center mt-5">
                <div class="col-lg-6">
                  <h1 class="text-center">Weather Information</h1>
                  <div class="card mt-3">
                    <div class="card-body">
                      <h3 class="card-title">City: <span id="city">${query}</span></h3>
                      <p class="card-text">Weather: <span id="weather">${weatherDesc}</span></p>
                      <p class="card-text">Temperature: <span id="temperature"></span>${temperature}&deg;C</p>
                      <img id="weather-icon" src="${imgURL}" alt="Weather Icon">
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </body>
        </html>
      `;

      res.send(resultHTML);
    });
  });
});


app.listen(3000, function(req, res) {
  console.log("Server is running on port 3000");
});
