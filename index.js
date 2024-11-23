require("dotenv").config();
const http = require("http");
const fs = require("fs");
const requests = require("requests");

const apiKey = process.env.OPENWEATHER_API_KEY;
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    if (!orgVal || !orgVal.main || !orgVal.sys || !orgVal.weather) {
        console.error("Invalid data from API", orgVal);
        return tempVal;
    }

    return tempVal
        .replace("{%tempval%}", orgVal.main.temp || "N/A")
        .replace("{%tempmin%}", orgVal.main.temp_min || "N/A")
        .replace("{%tempmax%}", orgVal.main.temp_max || "N/A")
        .replace("{%location%}", orgVal.name || "Unknown Location")
        .replace("{%tempcountry%}", orgVal.sys.country || "Unknown Country")
        .replace("{%tempstatus%}", orgVal.weather[0]?.main || "Unknown");
};

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        requests(`http://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=${apiKey}&units=metric`)
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const realTimeData = replaceVal(homeFile, objData);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(realTimeData);
            })
            .on("end", (err) => {
                if (err) {
                    console.error("Connection closed due to errors", err);
                }
            });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});

server.listen(3000, "127.0.0.1", () => {
    console.log("Server is running on port 3000");
});
