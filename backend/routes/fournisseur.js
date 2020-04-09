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
  const clients = await Client.find({ role: { $in: ["fournisseur"] } });
  res.send(clients);
});

// Find By Name
router.get("/name/", [auth], async (req, res) => {
  if (req.body.name == undefined || req.body.name == null)
    return res.status(404).send("Aucun client portant ce nom n'a été trouvé!");

  const client = await Client.find({
    name: req.body.name,
    role: { $in: ["fournisseur"] },
  }).catch(() => {
    return res.status(404).send("Aucun client portant ce nom n'a été trouvé!");
  });

  if (!client)
    return res.status(404).send("Aucun client portant ce nom n'a été trouvé!");

  res.send(client);
});

/* Liste des commandes d'un fournisseur payer */
router.get("/commands/payer/:id", [auth], async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    role: { $in: ["fournisseur"] },
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

/* Liste des commandes d'un fournisseur non payer */
router.get("/commands/nonpayer/:id", [auth], async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    role: { $in: ["fournisseur"] },
  }).catch(() => {
    return res
      .status(404)
      .send("Aucun fournisseur portant cet id n'a été trouvé!");
  });

  if (!client)
    return res
      .status(404)
      .send("Aucun fournisseur portant cet id n'a été trouvé!");

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

/* Liste des commandes d'un fournisseur */
router.get("/commands/:id", [auth], async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    role: { $in: ["fournisseur"] },
  }).catch(() => {
    return res
      .status(404)
      .send("Aucun fournisseur portant cet id n'a été trouvé!");
  });

  if (!client)
    return res
      .status(404)
      .send("Aucun fournisseur portant cet id n'a été trouvé!");

  const commands = await Command.find({ client: req.params.id }).populate(
    "articles"
  );
  if (!commands)
    return res
      .status(404)
      .send("Aucun commande portant cet id n'a été trouvé!");
  res.send(commands);
});

/* Liste des facture d'un fournisseur */
router.get("/factures/:id", [auth], async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    role: { $in: ["fournisseur"] },
  }).catch(() => {
    return res
      .status(404)
      .send("Aucun fournisseur portant cet id n'a été trouvé!");
  });

  if (!client)
    return res
      .status(404)
      .send("Aucun fournisseur portant cet id n'a été trouvé!");

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

router.get("/:id", [auth], async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    role: { $in: ["fournisseur"] },
  }).catch(() => {
    return res
      .status(404)
      .send("Aucun fournisseur portant cet id n'a été trouvé!");
  });
  if (!client)
    return res
      .status(404)
      .send("Aucun fournisseur portant cet id n'a été trouvé!");

  res.send(client);
});

router.delete("/:id", [auth], async (req, res) => {
  const client = await Client.deleteOne({
    _id: req.params.id,
    role: { $in: ["fournisseur"] },
  }).catch(() => {
    return res.status(404).send("Erreur ID");
  });
  if (!client)
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");

  res.send(client);
});

module.exports = router;
