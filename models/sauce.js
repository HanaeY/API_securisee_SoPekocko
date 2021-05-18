const mongoose = require('mongoose');
const validator = require('../mongoose_validators/mongoose_validators');

// Fonction schema du package mongoose à laquelle on passe un objet de configuration 
// permet de définir les attributs des param de l'objet 
const sauceSchema = mongoose.Schema({
    userId : {type : String, required : true}, // id unique créé par mongoDB
    name : {type : String, required : true, validate: validator.nameValidator},
    manufacturer : {type : String, required : true, validate: validator.manufacturerValidator},
    description : {type : String, required : true, validate: validator.descriptionValidator},
    imageUrl : {type : String, required : true},
    heat : {type : Number, required : true}, 
    likes : {type : Number, required : true}, 
    dislikes : {type : Number, required : true}, 
    usersLiked : {type : [String], required : true},
    usersDisliked : {type : [String], required : true},
});

module.exports = mongoose.model('Sauce', sauceSchema);