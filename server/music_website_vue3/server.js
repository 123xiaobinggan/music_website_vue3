const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express();
const http = require("http")
const {Server} = require("socket.io")
const server = http.createServer(app)
const io = new Server(server,{
    cors: {origin: "*"},
    pingInterval:1000,
    pingTimeout:3000
});


const port = 5000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const routesPath = path.join(__dirname,'routes');
fs.readdirSync(routesPath).forEach(folder => {
    const routePath = path.join(routesPath,folder);
    if(fs.lstatSync(routePath).isDirectory()){
        const route = require(path.join(routePath, 'index.js'));
        app.use(`/${folder}`,route);
    }
})

server.listen(port,'0.0.0.0', ()=>{
    console.log(`server running at http://0.0.0.${port}`);
})
