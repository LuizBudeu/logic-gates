const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/status", (request, response) => {
    const status = {
        Status: "Running",
    };

    console.log("server status");

    response.send(JSON.stringify(status));
});

app.post("/file", (request, response) => {
    console.log("receiving data ...");
    console.log("body is ", request.body);

    const body = request.body;
    const newfile = body.a;
    fs.writeFileSync(path.join(__dirname, "/file/" + newfile), "Hey there!");

    response.send(request.body);
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
