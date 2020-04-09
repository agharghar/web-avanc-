const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Client } = require("../models/client");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let client = await Client.findOne({ email: req.body.email });
  if (!client) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(
    req.body.password,
    client.password
  );
  console.log("zoubi");

  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = client.generateAuthToken();

  res.header("X-Auth", token).json({ id: client._id, token: token });
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
