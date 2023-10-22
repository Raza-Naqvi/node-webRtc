const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require('./Routes/userRoute');
const dotenv = require("dotenv");

const app = express();

dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is live at http://localhost:${port}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("Views", "./Views");

app.use(express.static('public'));
app.use("/", userRoute);
