const Joi = require("joi");
const mongoose = require("mongoose");

const DetailSchema = new mongoose.Schema({

  article: 
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Article"
    }
  ,
  nombre: {
    type: Number,
    min : 1,
    required: true,
}
});


const Detail = mongoose.model("Detail", DetailSchema);

function validate(req) {
  const schema = {
    nombre: Joi.number().required(),
    article: Joi.required(),
  };
  return Joi.validate(req, schema);
}

exports.Detail = Detail;
exports.validate = validate;
