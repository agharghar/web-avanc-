var express = require("express");
var router = express.Router();
const { Command, validate } = require("../models/command");
const { Article } = require("../models/article");
const { Client } = require("../models/client");
const _ = require("lodash");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/", [auth], async (req, res) => {
  const commands = await Command.find()
    .populate("client details.article")
    .catch(() => {
      return res.status(404).send("Aucun Commande  trouvé!");
    });
  res.send(commands);
});

// Find By Non payer
router.get("/nonpayer/", [auth], async (req, res) => {
  const command = await Command.find({ etat: false }).catch(() => {
    return res.status(404).send("Aucun Commande  trouvé!");
  });

  if (!command) return res.status(404).send("Aucun Commande  trouvé!");

  res.send(command);
});

// Find By payer
router.get("/payer/", [auth], async (req, res) => {
  const command = await Command.find({ etat: true }).catch(() => {
    return res.status(404).send("Aucun Commande  trouvé!");
  });

  if (!command) return res.status(404).send("Aucun Commande  trouvé!");

  res.send(command);
});

//Add Livraison
router.put("/AddLivraison/:id", [auth], async (req, res) => {
  const command = await Command.findByIdAndUpdate(
    req.params.id,
    {
      statutLivraison: "en preparation",
    },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send("Commande en cours de livraison");
      }
    }
  );
});

//Livré
router.put("/validateLivraison/:id", [auth], async (req, res) => {
  const command = await Command.findByIdAndUpdate(
    req.params.id,
    {
      statutLivraison: "livré",
    },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send("Commande Livré");
      }
    }
  );
});

// Find By ref
router.get("/ref/", [auth], async (req, res) => {
  if (req.body.ref == undefined || req.body.ref == null)
    return res
      .status(404)
      .send("Aucun commande portant cet referance a été trouvé!");

  const command = await Command.findOne({ ref: req.body.ref }).catch(() => {
    return res
      .status(404)
      .send("Aucun commande portant cet referance a été trouvé!");
  });

  if (!command)
    return res
      .status(404)
      .send("Aucun commande portant cet referance a été trouvé!");

  res.send(command);
});

router.get("/:id", [auth], async (req, res) => {
  const command = await Command.findById(req.params.id)
    .populate("client details.article")
    .catch(() => {
      return res.status(404).send("Aucun Commande  trouvé!");
    });
  if (!command)
    return res
      .status(404)
      .send("Aucun commande portant cet id n'a été trouvé!");

  res.send(command);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  for (let index = 0; index < req.body.details.length; index++) {
    let article = await Article.findById(req.body.details[index].article).catch(
      () => {
        return res.status(404).send("Aucun article  trouvé!");
      }
    );

    if (!article)
      return res
        .status(404)
        .send("Aucun commande portant cet id n'a été trouvé!");

    if (article.qte < req.body.details[index].nombre)
      return res
        .status(404)
        .send(
          `Le nombre d'exemplaire dans  '${article.libelle}' sont juste : '${article.qte}', vous essayez de commendez '${req.body.details[index].nombre}'`
        );
  }

  const client = await Client.findOne({ _id: req.body.client });
  if (!client)
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");
  console.log("mzn");

  const cmd = await Command.findOne({ ref: req.body.ref });
  if (cmd) return res.status(404).send("Référence Existant ");

  let command = new Command(
    _.pick(req.body, [
      "date",
      "details",
      "client",
      "ref",
      "adresseLivraison",
      "statutLivraison",
      "prixLivraison",
      "tax",
      "etat",
    ])
  );

  command = await command.save();

  for (let index = 0; index < req.body.details.length; index++) {
    let article = await Article.findById(req.body.details[index].article).catch(
      () => {
        return res.status(404).send("Aucun article  trouvé!");
      }
    );

    article.qte -= req.body.details[index].nombre;
    await article.save();
  }

  res.send(command.populate("command"));
});

router.delete("/:id", [auth], async (req, res) => {
  const command = await Command.findById(req.params.id).catch(() => {
    return res.status(404).send("Aucun Commande  trouvé!");
  });
  if (!command)
    return res
      .status(404)
      .send("Aucune commande portant cet id n'a été trouvé!");

  for (let index = 0; index < command.details.length; index++) {
    let article = await Article.findById(command.details[index].article).catch(
      () => {
        return res.status(404).send("Aucun article  trouvé!");
      }
    );

    if (!article)
      return res
        .status(404)
        .send("Aucun commande portant cet id n'a été trouvé!");

    article.qte += command.details[index].nombre;
    await article.save();
  }

  await command.remove();

  res.send(command);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const cmd = await Command.findOne({ ref: req.body.ref });
  if (cmd != null && cmd._id != req.params.id)
    return res.status(404).send("Référence Existant");

  const client = await Client.findOne({
    _id: req.body.client,
    role: { $in: ["client", "fournisseur", "admin"] },
  }).catch(() => {
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");
  });
  if (!client)
    return res.status(404).send("Aucun client portant cet id n'a été trouvé!");

  if (!(statutLivraison = req.body.statutLivraison))
    statutLivraison = "non livré";
  if (!(prixLivraison = req.body.prixLivraison)) prixLivraison = 0;
  if (!(tax = req.body.tax)) tax = 0;
  if (!(etat = req.body.etat)) etat = false;

  let command = await Command.findOne({ _id: req.params.id }).catch(() => {
    return res
      .status(404)
      .send("Aucune Commande portant cet id n'a été trouvé!");
  });

  if (!command)
    return res
      .status(404)
      .send("Aucune Commande portant cet id n'a été trouvé!");

  let articles = [];

  for (let index = 0; index < command.details.length; index++) {
    articles.push(`${command.details[index].article}`);
  }

  for (let index = 0; index < req.body.details.length; index++) {
    let article = await Article.findById(req.body.details[index].article);

    if (!article)
      return res
        .status(404)
        .send("Aucun article portant cet id n'a été trouvé!");

    if (articles.includes(`${article._id}`)) {
      for (let i = 0; i < articles.length; i++) {
        if (articles[i] == article._id) {
          if (
            command.details[i].nombre + article.qte <
            req.body.details[index].nombre
          ) {
            return res
              .status(404)
              .send(
                `Le nombre d'exemplaire dans  '${
                  article.libelle
                }' sont juste : '${article.qte}', vous essayez de commendez '${
                  req.body.details[index].nombre - command.details[i].nombre
                }' supplémentaire`
              );
          }
        }
      }
    }
  }

  for (let index = 0; index < command.details.length; index++) {
    let article = await Article.findById(command.details[index].article).catch(
      () => {
        return res.status(404).send("Aucun article  trouvé!");
      }
    );
    if (!article)
      return res
        .status(404)
        .send("Aucun article portant cet id n'a été trouvé!");

    article.qte += command.details[index].nombre;
    await article.save();
  }

  const cmde = await Command.updateOne(
    { _id: req.params.id },
    {
      client: req.body.client,
      details: req.body.details,
      ref: req.body.ref,
      adresseLivraison: req.body.adresseLivraison,
      statutLivraison: statutLivraison,
      prixLivraison: prixLivraison,
      tax: tax,
      etat: etat,
    }
  );

  for (let index = 0; index < req.body.details.length; index++) {
    let article = await Article.findById(req.body.details[index].article).catch(
      () => {
        return res.status(404).send("Aucun article  trouvé!");
      }
    );

    if (!article)
      return res
        .status(404)
        .send("Aucun commande portant cet id n'a été trouvé!");

    article.qte -= req.body.details[index].nombre;
    await article.save();
  }

  res.send(cmde);
});

module.exports = router;
