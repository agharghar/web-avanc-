const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

var { Command } = require("./command");

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  surName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  sexe: {
    type: String,
    required: true,
    enum: ["homme", "femme", "autre"],
  },
  tel: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 20,
  },
  fax: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 20,
  },
  pays: {
    type: String,
    minlength: 3,
    maxlength: 20,
  },
  ville: {
    type: String,
    minlength: 5,
    maxlength: 20,
  },
  codePostale: {
    type: Number,
  },
  rue: {
    type: String,
    minlength: 5,
    maxlength: 60,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Entrez une adresse E-mail valide !",
    ], // Expression regulière permettant de verifier un email
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  taux_remise: {
    type: Number,
    default : 0
  },
  role: [
    {
      type: String,
      enum: ["admin", "user", "fournisseur", "client"],
      required: true,
    },
  ],
});

/* Generation des Tokens JWT */
ClientSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    config.get("JwtSecret"),
    { expiresIn: "4h" }
  );
  return token;
};

/* On Delete Cascade Style */
ClientSchema.pre("remove", function (next) {
  Command.remove({ client: this._id }).exec();
});

const Client = mongoose.model("Client", ClientSchema);

/*Validation des Inputs */
function validate(req) {
  const schema = {
    name: Joi.string().min(3).max(255).required(),
    surName: Joi.string().min(3).max(255).required(),
    sexe: Joi.string().valid("homme", "femme", "autre"),
    tel: Joi.string().min(7).max(20),
    fax: Joi.string().min(7).max(20),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255),
    pays: Joi.string().min(3).max(20),
    ville: Joi.string().min(5).max(20),
    codePostale: Joi.number(),
    rue: Joi.string().min(5).max(60),
    taux_remise: Joi.number().min(0).max(100),
    role: Joi.string().valid("admin", "user", "fournisseur", "client"),
  };

  return Joi.validate(req, schema);
}

/*Validation password */
function validatePassword(req) {
  const schema = {
    password: Joi.string().min(5).max(255),
  };

  return Joi.validate(req, schema);
}


async function  defaultUsers(mongoose,bcrypt) {


  if(mongoose != null){
    const client =  await Client.findOne({
      email: "admin@admin.com"
    })
  
    if(client == null ){
      let clientAdmin = await Client({
  
        "name": "admin" ,
        "surName" : "admin",
        "sexe":"homme",
        "tel": "84656454",
        "fax": "5161561516",
        "pays": "france",
        "ville": "bourges",
        "codePostale": 546,
        "rue": "rue test",
        "email" : "admin@admin.com",
        "role": ["admin"],
        "taux_remise": 0,
    
      });
    
      let clientFournisseur = await Client({
  
        "name": "fournisseur" ,
        "surName" : "fournisseur",
        "sexe":"homme",
        "tel": "84656454",
        "fax": "5161561516",
        "pays": "france",
        "ville": "bourges",
        "codePostale": 546,
        "rue": "rue test",
        "email" : "fournisseur@fournisseur.com",
        "role": ["fournisseur"],
        "taux_remise": 0,
    
      });

          
      let clientUser = await Client({
  
        "name": "user" ,
        "surName" : "user",
        "sexe":"homme",
        "tel": "84656454",
        "fax": "5161561516",
        "pays": "france",
        "ville": "bourges",
        "codePostale": 546,
        "rue": "rue test",
        "email" : "user@user.com",
        "role": ["user"],
        "taux_remise": 0,
    
      });
    
      const salt = await bcrypt.genSalt(10);
      clientAdmin.password = await bcrypt.hash("azerty", salt);
      clientUser.password =  await bcrypt.hash("azerty", salt);
      clientFournisseur.password =  await bcrypt.hash("azerty", salt);
      await clientAdmin.save();
      await clientUser.save();
      await clientFournisseur.save();  
  
    }
  
  
  
  }
}

exports.Client = Client;
exports.ClientSchema = ClientSchema;
exports.validate = validate;
exports.validatePassword = validatePassword;
exports.defaultUsers = defaultUsers;
