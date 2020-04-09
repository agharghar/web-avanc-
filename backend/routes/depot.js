var express = require("express");
var router = express.Router();
const { Depot, validate } = require("../models/depot");
const _ = require("lodash");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/", [auth], async (req, res) => {
  const depots = await Depot.find();

  res.send(depots);
});

router.get("/:id", [auth], async (req, res) => {
  const depot = await Depot.findById(req.params.id).catch(() => {
    return res.status(404).send("Aucun depot portant cet id n'a été trouvé!");
  });
  if (!depot)
    return res.status(404).send("Aucun depot portant cet id n'a été trouvé!");
  return res.send(depot);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let depot = new Depot(_.pick(req.body, ["name", "adresse"]));

  depot = await depot.save();

  res.send(depot);
});

router.delete("/:id", [auth], async (req, res) => {
  const depot = await Depot.findByIdAndRemove(req.params.id);
  if (!depot)
    return res.status(404).send("Aucun depot portant cet id n'a été trouvé!");

  res.send(depot);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const depot = await Depot.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    addresse: req.body.addresse,
  });

  if (!depot)
    return res.status(404).send("Aucun depot portant cet id n'a été trouvé!");

  res.send(depot);
});

module.exports = router;
