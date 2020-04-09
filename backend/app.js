var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var cors = require("cors");

var clientRouter = require("./routes/client");
var articleRouter = require("./routes/article");
var commandRouter = require("./routes/command");
var depotRouter = require("./routes/depot");
var factureRouter = require("./routes/facture");
var adminRouter = require("./routes/admin");
var accountRouter = require("./routes/account");
var fournisseurRouter = require("./routes/fournisseur");

var authRouter = require("./routes/auth");

var app = express();
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Connexion à la base de données
mongoose
  .connect("mongodb://localhost/Projet")
  .then(() => console.log("Connecté à la base de données..."))
  .catch(err => console.error("Erreur lors de la connexion..."));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* Routes */
app.use("/clients", clientRouter);
app.use("/articles", articleRouter);
app.use("/commands", commandRouter);
app.use("/depots", depotRouter);
app.use("/factures", factureRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/account", accountRouter);
app.use("/fournisseurs", fournisseurRouter);

module.exports = app;
