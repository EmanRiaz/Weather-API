const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%tempcountry%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=4600bf6159b019d27fa51c88a40b86c0&units=metric")
            .on("data", (chunk) => {
                const objdata = JSON.parse(chunk);
                const realTimeData = replaceVal(homeFile, objdata);
                res.write(realTimeData);
            })
            .on("end", (err) => {
                if (err) {
                    console.log("Connection closed due to errors", err);
                }
                res.end();
            });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Not Found");
        res.end();
    }
});

server.listen(3000, "127.0.0.1", () => {
    console.log("Server is running on port 3000");
});
