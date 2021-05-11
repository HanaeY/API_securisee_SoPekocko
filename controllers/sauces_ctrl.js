const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // supprimer l'id envoyé par le frond (car on utilisera l'id généré pa MongoDB)
    delete sauceObject._id;
    // création d'une nouvelle instance du modèle Sauce
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.likes = 0;
    sauce.dislikes = 0;
    sauce.userLiked = [];
    sauce.userDisliked = [];

    // utilisation de la méthode save de l'instance pour enregistrer le nouvel objet dans la base
    // .save retourne une Promise
    sauce.save()
        .then(() => res.status(201).json({message : 'objet créé !'}))
        .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) => {
    let sauceObject;
    if(!req.file) {
        sauceObject = {...req.body};
        Sauce.updateOne({_id : req.params.id}, {...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'sauce modifiée !'}))
            .catch(error => res.status(400).json({error}));
    } else {
        Sauce.findOne({_id : req.params.id})
        .then(sauce => {
            const formerFile = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`./images/${formerFile}`, () => {
                sauceObject = JSON.parse(req.body.sauce);
                sauceObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                Sauce.updateOne({_id : req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'sauce modifiée !'}))
                    .catch(error => res.status(400).json({error}));
            })
        })
        .catch(error => res.status(500).json({error}));
 
    };
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`./images/${filename}`, () => {
            Sauce.deleteOne({_id : req.params.id})
            .then(() => res.status(200).json({message : 'sauce supprimée !'}))
            .catch(error => res.status(400).json({error}));
        })
    })
    .catch(error => res.status(500).json({error}));

};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};