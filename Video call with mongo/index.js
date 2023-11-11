require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');
const bodyParser = require('body-parser');
const webSocketServ = require("ws").Server;

const app = express();

const atlasConnectionStr = process.env.MONGODB_ATLAS_CONNECTION_STRING;

mongoose.connect(atlasConnectionStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.listen(process.env.PORT, () => {
    console.log('Server is running');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use('/', userRoute);

//webSocket code
var wss = new webSocketServ({
    port: 8000
});