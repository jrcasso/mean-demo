var userModel = require('../models/user.model.js');
const mongoose = require( 'mongoose' );
const { validationResult } = require('express-validator');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

  list: function (req, res) {
    userModel.find(function (err, users) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting users.',
          error: err
        });
      }
      return res.json(users);
    });
  },

  show: function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    userModel.findOne({_id: req.params.id}, function (err, user) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting user.',
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          message: 'No such user'
        });
      }
      return res.json(user);
    });
  },

  create: function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    var new_user = new userModel({
      firstname : req.body.firstname,
      lastname : req.body.lastname,
      email : req.body.email,
      created : req.body.created,
      password : req.body.password,
      active : true,
      verified : false
    });

    // Determine if this user email has already been registered
    // If so, return bad request. Else, create the user.
    userModel.findOne({$or: [
      {email: new_user.email}
    ]}).exec(function (err, user) {
      if (!user) {
        new_user.save(function (err, user) {
          if (err) {
            return res.status(500).json({
              message: 'Error when creating user',
              error: err
            });
          } else {
          }
          return res.status(201).json(user);
        });
      } else {
        return res.status(400).json({
          // #SEC This is a decision made to expose whether or not
          // an existing user already exists.
          message: 'User already exists.',
        });
      }
      if (err) {
        return res.status(500).json({
          message: 'Error when creating user',
          error: err
        });
      }
    });
  },

  update: function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    userModel.findOne({_id: req.params.id}, function (err, user) {
      if (err) {
        return res.status(500).json({
          message: 'Error when updating user',
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          message: 'No such user'
        });
      }

      user.firstname = req.body.firstname ? req.body.firstname : user.firstname;
      user.lastname = req.body.lastname ? req.body.lastname : user.lastname;
      user.email = req.body.email ? req.body.email : user.email;
      user.created = req.body.created ? req.body.created : user.created;
      user.password = req.body.password ? req.body.password : user.password;
      user.active = req.body.active ? req.body.active : user.active;
      user.verified = req.body.verified ? req.body.verified : user.verified;

      user.save(function (err, user) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating user.',
            error: err
          });
        }

        return res.json(user);
      });
    });
  },

  remove: function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    userModel.findByIdAndRemove(req.params.id, function (err, user) {
      if (err) {
        return res.status(500).json({
          message: 'Error when removing user.',
          error: err
        });
      }
      return res.status(204).json();
    });
  }
};
