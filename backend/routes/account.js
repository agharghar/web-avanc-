var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { Client, validate, validatePassword } = require("../models/client");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");

/* -------------------------------------------BASIC ROUTES -----------------------------------------*/

router.get("/", [auth], async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, config.get("JwtSecret"));
  const client = await Client.findById(decoded._id)
    .select("-password")
    .catch(() => {
      return res.status(404).send("Aucun user portant cet id n'a été trouvé!");
    });
  res.send(client);
});

router.put("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const token = req.cookies.token;
  const decoded = jwt.verify(token, config.get("JwtSecret"));

  const client = await Client.updateOne(
    { _id: decoded._id },
    {
      name: req.body.name,
      surName: req.body.surName,
      sexe: req.body.sexe,
      tel: req.body.tel,
      fax: req.body.fax,
      pays: req.body.pays,
      ville: req.body.ville,
      codePostale: req.body.codePostale,
      rue: req.body.rue,
      email: req.body.email,
      taux_remise: req.body.taux_remise,
    },
    function (err, result) {
      if (err) res.status(404).send("ID Non Existante");
    }
  );

  if (!client)
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");

  res.send(client);
});

/* Change Password */
router.put("/changePassword", auth, async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const token = req.cookies.token;
  const decoded = jwt.verify(token, config.get("JwtSecret"));
  const salt = await bcrypt.genSalt(10);

  const client = await Client.updateOne(
    { _id: decoded._id },
    {
      password: await bcrypt.hash(req.body.password, salt),
    },
    function (err, result) {
      if (err) res.status(404).send(err);
    }
  );

  if (!client) return res.status(404).send("Erreur ");

  res.send(client);
});

module.exports = router;
