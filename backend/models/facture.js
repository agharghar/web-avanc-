const Joi = require("joi");
const mongoose = require("mongoose");

const FactureSchema = new mongoose.Schema({
    ref : {
        type: String , 
        required : true , 
    },
        date: {
        type: Date,
        default : Date.now
    },
        command: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Command"
    }]
});



const Facture = mongoose.model("Facture", FactureSchema);

function validate(req) {
  const schema = {
    ref: Joi.string().required(),
    command: Joi.array().required(),
    
  };
  return Joi.validate(req, schema);
}

exports.Facture = Facture;
exports.validate = validate;
