const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (req.url === "/") {
        res.writeHead(200, {"Content-Type": "text/html"});
        
        res.write(`
            <head>
                <style>
                    body {
                      font-family: sans-serif;
                    }
                    #thing {
                      margin: auto;
                      width: 80%;
                      padding: 10px;
                      text-align: center;
                    }
                </style> 
            </head>
            <body>
                <div id="thing">
                    <h2>Hosting Active</h2>
                </div>
            </body>
        `); 
    } else {
        res.writeHead(200, {"Content-Type": "image/png"});

        res.write(fs.readFileSync("./pingPixel.png"));
    }

    res.end();
});

// connect server to internet
server.listen(3000, _ => {
    console.log("Server is online!");
});

module.exports = {
    server: server
};
