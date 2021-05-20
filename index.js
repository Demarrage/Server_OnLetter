const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
//  configuração do cors para aceitar varios protocolos de requisiçao
const configCors = {
  origin: "*",
  optionsSuccessStatus: 200,
};
// conexão com o banco de dados mysql
const cx = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "onlatter",
  port: "3306",
});
