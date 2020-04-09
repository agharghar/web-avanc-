const Joi = require("joi");
const mongoose = require("mongoose");

const DepotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  adresse: {
    type: String,
    required: true
  }
});

const Depot = mongoose.model("Depot", DepotSchema);

function validate(req) {
  const schema = {
    name: Joi.string().required(),
    adresse: Joi.string().required()
  };
  return Joi.validate(req, schema);
}

/* On Delete Cascade Style */
DepotSchema.pre("remove", function(next) {
  Livraison.remove({ depot: this._id }).exec();
  Article.remove({ depot: this._id }).exec();
});

exports.Depot = Depot;
exports.validate = validate;
