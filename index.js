const http = require("http");
const fs = require("fs");
const axios = require("axios");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, weatherData) => {
    let temperature = tempVal.replace("{%tempval%}", weatherData.main.temp);
    temperature = temperature.replace("{%tempmin%}", weatherData.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", weatherData.main.temp_max);
    temperature = temperature.replace("{%location%}", weatherData.name);
    temperature = temperature.replace("{%tempcountry%}", weatherData.sys.country);
    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        axios.get("http://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=4600bf6159b019d27fa51c88a40b86c0&units=metric")
            .then(response => {
                const weatherData = response.data;
                const realTimeData = replaceVal(homeFile, weatherData);
                res.write(realTimeData);
                res.end();
            })
            .catch(error => {
                console.log("Error fetching data from API:", error);
                res.end();
            });
    }
});

server.listen(3000, "127.0.0.1", () => {
    console.log("Server is running on port 3000");
});
