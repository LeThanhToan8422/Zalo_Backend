const express = require('express');
const { createServer } = require("http");
const cors = require('cors');
const { ConnectDB } = require('./connection/ConnectDB');
const { Router } = require('./routes/router');
const { SocketIo } = require('./config/socketIo');


const app = express();
require('dotenv').config()

app.use(express.json({extended : false}))
app.use(express.urlencoded({ extended : true}))

app.use(express.static("./src/views"))
app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(cors());

const httpServer = createServer(app);

SocketIo(httpServer)
Router(app)
ConnectDB()


httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on the port ${process.env.PORT}`);
})