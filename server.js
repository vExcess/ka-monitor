const express = require('express');
const server = express();

server.all('/', (req, res)=>{
  res.setHeader('Content-Type', 'text/html');

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

  res.end();
})

function keepAlive(){
  server.listen(3000, function(){
    console.log("Server is online!");
  });
}

module.exports = keepAlive;
