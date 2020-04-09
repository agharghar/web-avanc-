var express = require("express");
var router = express.Router();
const { Facture, validate } = require("../models/facture");
const { Command } = require("../models/command");
const _ = require("lodash");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/", [auth], async (req, res) => {
  const factures = await Facture.find().populate("command client articles");
  res.send(factures);
});

// Find By ref
router.get("/ref/", [auth], async (req, res) => {
  if (req.body.ref == undefined || req.body.ref == null)
    return res
      .status(404)
      .send("Aucun facture portant cet referance a été trouvé!");

  const facture = await Facture.findOne({ ref: req.body.ref }).catch(() => {
    return res
      .status(404)
      .send("Aucun facture portant cet referance a été trouvé!");
  });

  if (!facture)
    return res
      .status(404)
      .send("Aucun facture portant cet referance a été trouvé!");

  res.send(facture);
});

router.get("/:id", [auth], async (req, res) => {
  const facture = await Facture.findById(req.params.id)
    .populate("command client articles")
    .catch(() => {
      return res
        .status(404)
        .send("Aucun facture portant cet id n'a été trouvé!");
    });
  if (!facture)
    return res.status(404).send("Aucun facture portant cet id n'a été trouvé!");
  res.send(facture);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const fa = await Facture.findOne({ ref: req.body.ref });
  if (fa) return res.status(404).send("Référence Existant ");

  let commands = [...new Set(req.body.command)];
  if (commands === undefined || commands.length == 0)
    return res.status(404).send("Pas de commandes ");

  for (let index = 0; index < commands.length; index++) {
    let command = await Command.findById(commands[index]).catch(() => {
      return res
        .status(404)
        .send(`Aucun command Avec ID '${commands[index]}' trouvé!`);
    });

    if (!command)
      return res
        .status(404)
        .send(`Aucun command Avec ID '${commands[index]}' trouvé!`);
  }

  for (let index = 0; index < commands.length; index++) {
    let command = await Command.findById(commands[index]);
    if (command) {
      command.etat = true;
      await command.save();
    }
  }

  let facture = new Facture(_.pick(req.body, ["ref"]));
  facture.command = commands;
  facture = await facture.save();

  res.send(facture.populate("facture"));
});

router.delete("/:id", [auth], async (req, res) => {
  const facture = await Facture.findByIdAndRemove(req.params.id).catch(() => {
    return res.status(404).send("Aucun facture portant cet id n'a été trouvé!");
  });
  if (!facture)
    return res
      .status(404)
      .send("Aucune facture portant cet id n'a été trouvé!");

  for (let index = 0; index < facture.command.length; index++) {
    let command = await Command.findById(facture.command[index]);
    command.etat = false;
    await command.save();
  }

  res.send(facture);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let fa = await Facture.findOne({ ref: req.body.ref }).catch(() => {
    return res.status(404).send("Aucun facture portant cet id n'a été trouvé!");
  });
  if (fa != null && fa._id != req.params.id)
    return res.status(404).send("Référence Existant");

  let commands = [...new Set(req.body.command)];
  if (commands === undefined || commands.length == 0)
    return res.status(404).send("Pas de commandes ");

  for (let index = 0; index < commands.length; index++) {
    let command = await Command.findById(commands[index]).catch(() => {
      return res
        .status(404)
        .send(`Aucun command Avec ID '${commands[index]}' trouvé!`);
    });

    if (!command)
      return res
        .status(404)
        .send(`Aucun command Avec ID '${commands[index]}' trouvé!`);
  }

  const fac = await Facture.findById(req.params.id).catch(() => {
    return res.status(404).send("Aucun facture portant cet id n'a été trouvé!");
  });
  if (!fac)
    return res.status(404).send("Aucun facture portant cet id n'a été trouvé!");
  for (let index = 0; index < fac.command.length; index++) {
    let command = await Command.findById(fac.command[index]);
    command.etat = false;
    await command.save();
  }

  for (let index = 0; index < commands.length; index++) {
    let command = await Command.findById(commands[index]);
    command.etat = true;
    await command.save();
  }

  const facture = await Facture.updateOne(
    { _id: req.params.id },
    {
      ref: req.body.ref,
      command: commands,
    }
  );

  if (!facture)
    return res
      .status(404)
      .send("Aucune facture portant cet id n'a été trouvé!");

  res.json(facture);
});

module.exports = router;
