const http = require("http");
const fs = require("fs");

const hostname = "127.0.0.1";
const port = 8000;

const server = http.createServer(function (req, res) {
    if (req.method === "GET") {
        // Serve the HTML file for the front-end
        fs.readFile("task-manager.html", function (err, data) {
            if (err) {
                console.error("Error reading HTML file:", err);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }
        });
    } else if (req.method === "POST") {
        // Handle task submission
        let body = "";
        req.on("data", function (chunk) {
            body += chunk;
        });

        req.on("end", function () {
            const taskData = JSON.parse(body);
            console.log("Received task:", taskData);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Task added successfully");
        });
    } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Method Not Allowed");
    }
});

server.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}`);
});
