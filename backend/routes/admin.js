var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { Client, validate } = require("../models/client");
const _ = require("lodash");

/* -------------------------------------------BASIC ROUTES -----------------------------------------*/

router.get("/:id", [auth], async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    role: { $in: ["user"] },
  }).catch(() => {
    return res.status(404).send("Aucun user portant cet id n'a été trouvé!");
  });
  res.send(client);
});

router.get("/", [auth], async (req, res) => {
  const clients = await Client.find({ role: { $in: ["user"] } });
  res.send(clients);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const clt = await Client.findOne({ email: req.body.email });
  if (clt != null) return res.status(400).send("Email Existent");
  if (!["user", "admin"].includes(req.body.role))
    return res.status(404).send("Role erreur");
  if (req.body.password == null) return res.status(404).send("Password Erreur");
  let client = new Client(
    _.pick(req.body, [
      "name",
      "surName",
      "sexe",
      "tel",
      "fax",
      "pays",
      "ville",
      "codePostale",
      "rue",
      "email",
      "password",
      "role",
      "taux_remise",
    ])
  );

  const salt = await bcrypt.genSalt(10);
  client.password = await bcrypt.hash(client.password, salt);
  client = await client.save();

  const token = client.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(client, ["_id", "role"]));
});

router.delete("/:id", [auth], async (req, res) => {
  const client = await Client.deleteOne({
    _id: req.params.id,
    role: { $in: ["user"] },
  }).catch(() => {
    return res.status(404).send("Erreur ID");
  });
  if (!client)
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");

  res.send(client);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  if (req.body.password == null) return res.status(404).send("Password Erreur");

  const salt = await bcrypt.genSalt(10);
  const client = await Client.updateOne(
    { _id: req.params.id, role: { $in: ["user"] } },
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
      password: await bcrypt.hash(req.body.password, salt),
      taux_remise: req.body.taux_remise,
    },
    function (err, result) {
      if (err) res.status(404).send(err);
    }
  );

  if (!client)
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");

  res.send(client);
});

module.exports = router;
