const Joi = require("joi");
const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  libelle: {
    type: String,
    required: true
  },
  prixAchat: {
    type: Number,
    min: 0,
    required: true
  },
  prixVenteHT: {
    type: Number,
    min: 0,
    required: true
  },
  qte: {
    type: Number,
    min: 0,
    default: 0,
  },
  dateAjout:{
    type : Date,
    default: Date.now
    },
  ref: {
    type: String,
    required: true,
    unique : true
  },
  depot: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Depot"
  },
  fournisseur: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Client"
  }
});



const Article = mongoose.model("Article", ArticleSchema);

function validate(req) {
  const schema = {
    libelle: Joi.string().required(),
    ref: Joi.string().required(),
    prixAchat: Joi.number().required(),
    prixVenteHT: Joi.number().required(),
    qte: Joi.number().required(),
    depot: Joi.required(),
    fournisseur: Joi.required(),
  };
  return Joi.validate(req, schema);
}

exports.Article = Article;
exports.validate = validate;
