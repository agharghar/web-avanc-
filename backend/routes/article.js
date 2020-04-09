var express = require("express");
var router = express.Router();
const { Article, validate } = require("../models/article");
const { Client } = require("../models/client");
const { Depot } = require("../models/depot");
const _ = require("lodash");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/:id", [auth], async (req, res) => {
  const article = await Article.findById(req.params.id).catch(() => {
    return res.status(404).send("Aucun article portant cet id n'a été trouvé!");
  });
  res.send(article);
});

router.get("/", [auth], async (req, res) => {
  const articles = await Article.find().populate("depot fournisseur");
  res.send(articles);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const ar = await Article.findOne({ ref: req.body.ref });
  if (ar)
    return res
      .status(404)
      .send("Référence Article Existant ")
      .catch(() => {
        return res.status(404).send("Référence Article Existant !");
      });

  const client = await Client.findOne({
    _id: req.body.fournisseur,
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

  const dep = await Depot.findOne({ _id: req.body.depot }).catch(() => {
    return res.status(404).send("Depot Introuvable!");
  });
  if (!dep) return res.status(404).send("ID Depot Inexistant");

  let article = new Article(
    _.pick(req.body, [
      "libelle",
      "ref",
      "prixAchat",
      "prixVenteHT",
      "qte",
      "depot",
      "fournisseur",
    ])
  );

  article = await article.save();

  res.send(article.populate("depot"));
});

router.delete("/:id", [auth], async (req, res) => {
  const article = await Article.findByIdAndRemove(req.params.id, function (
    err
  ) {
    if (err) res.send("ID Article Pas Valide");
  });

  res.send(article);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const ar = await Article.findOne({ ref: req.body.ref });
  if (ar != null && ar._id != req.params.id)
    return res.status(404).send("Référence Existant");

  const client = await Client.findOne({
    _id: req.body.fournisseur,
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

  const article = await Article.findByIdAndUpdate(
    req.params.id,
    {
      libelle: req.body.libelle,
      ref: req.body.ref,
      prixAchat: req.body.prixAchat,
      prixVenteHT: req.body.prixVenteHT,
      qte: req.body.qte,
      depot: req.body.depot,
      fournisseur: req.body.fournisseur,
    },
    function (err, result) {
      if (err) res.status(404).send("ID Non Existante");
    }
  );

  if (!article)
    return res.status(404).send("Aucun article portant cet id n'a été trouvé!");

  res.send(article);
});

module.exports = router;
