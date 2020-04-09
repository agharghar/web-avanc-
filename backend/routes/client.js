var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { Client, validate } = require("../models/client");
const { Facture } = require("../models/facture");
const _ = require("lodash");
const { Command } = require("../models/command");

router.get("/", [auth], async (req, res) => {
  const clients = await Client.find();
  res.send(clients);
});

// Find By Name
router.get("/name/", [auth], async (req, res) => {
  if (req.body.name == undefined || req.body.name == null)
    return res.status(404).send("Aucun client portant ce nom n'a été trouvé!");

  const client = await Client.find({
    name: req.body.name,
    role: { $in: ["client"] },
  }).catch(() => {
    return res.status(404).send("Aucun client portant ce nom n'a été trouvé!");
  });

  if (!client)
    return res.status(404).send("Aucun client portant ce nom n'a été trouvé!");

  res.send(client);
});

/* Liste des commandes d'un client payer */
router.get("/commands/payer/:id", [auth], async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    role: { $in: ["client"] },
  }).catch(() => {
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");
  });

  if (!client)
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");

  const commands = await Command.find({
    client: req.params.id,
    etat: true,
  }).populate("articles");
  if (!commands)
    return res
      .status(404)
      .send("Aucun commande portant cet id n'a été trouvé!");
  res.send(commands);
});

/* Liste des commandes d'un client non payer */
router.get("/commands/nonpayer/:id", [auth], async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    role: { $in: ["client"] },
  }).catch(() => {
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");
  });

  if (!client)
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");

  const commands = await Command.find({
    client: req.params.id,
    etat: false,
  }).populate("articles");
  if (!commands)
    return res
      .status(404)
      .send("Aucun commande portant cet id n'a été trouvé!");
  res.send(commands);
});

/* Liste des commandes d'un client */
router.get("/commands/:id", [auth], async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
  }).catch(() => {
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");
  });

  if (!client)
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");

  const commands = await Command.find({ client: req.params.id }).populate(
    "articles"
  );
  if (!commands)
    return res
      .status(404)
      .send("Aucun commande portant cet id n'a été trouvé!");
  res.send(commands);
});

/* Liste des facture d'un client */
router.get("/factures/:id", [auth], async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    role: { $in: ["client"] },
  }).catch(() => {
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");
  });

  if (!client)
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");

  const commands = await Command.find({ client: req.params.id }).populate(
    "articles"
  );
  const factures = await Facture.find({ command: { $in: commands } })
    .populate("articles")
    .catch(() => {
      return res.status(404).send("aucune facture trouver");
    });

  if (!factures) return res.status(404).send("aucune facture trouver");

  res.send(factures);
});

router.get("/me", [auth], async (req, res) => {
  console.log(req.client._id);
  const client = await Client.findById(req.client._id).select("-password");
  res.send(client);
});

router.get("/:id", [auth], async (req, res) => {
  const client = await Client.findOne({ _id: req.params.id }).catch(() => {
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");
  });
  if (!client)
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");
  res.send(client);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const clt = await Client.findOne({ email: req.body.email });
  if (clt != null) return res.status(400).send("Email Existent");
  if (!["user", "fournisseur", "admin"].includes(req.body.role))
    return res.status(404).send("Role erreur");
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

  res.send(client);
});

router.delete("/:id", [auth], async (req, res) => {
  const client = await Client.deleteOne({
    _id: req.params.id,
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

  const client = await Client.updateOne(
    { _id: req.params.id },
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
      role: req.body.role,
      taux_remise: req.body.taux_remise,
    },
    function (err, result) {
      if (err) res.status(404).send("ID Non Existante");
    }
  );

  if (!client)
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");
  console.log(client);
  res.send(client);
});

module.exports = router;
