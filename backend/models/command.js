const Joi = require("joi");
const mongoose = require("mongoose");

const DetailSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
  },
  nombre: {
    type: Number,
    min: 1,
    required: true,
  },
});

const CommandSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  ref: {
    type: String,
    required: true,
    unique: true,
  },
  details: [DetailSchema],
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Client",
  },
  adresseLivraison: {
    type: String,
  },
  statutLivraison: {
    type: String,
    enum: ["non livré", "en attente", "en preparation", "livré"],
    default: "en attente",
  },
  prixLivraison: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  etat: {
    type: Boolean,
    default: false,
  },
});

const Command = mongoose.model("Command", CommandSchema);

function validate(req) {
  const schema = {
    date: Joi.date(),
    details: Joi.array().items(
      Joi.object({
        nombre: Joi.number().min(1).required(),
        article: Joi.required(),
      })
    ),
    client: Joi.required(),
    ref: Joi.string().required(),
    adresseLivraison: Joi.string(),
    statutLivraison: Joi.string().valid(
      "non livré",
      "en attente",
      "en preparation",
      "livré"
    ),
    prixLivraison: Joi.number(),
    tax: Joi.number(),
    etat: Joi.boolean(), // true == payé | false == non payé
  };
  return Joi.validate(req, schema);
}

exports.Command = Command;
exports.validate = validate;
