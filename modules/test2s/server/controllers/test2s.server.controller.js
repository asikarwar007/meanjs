'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Test2 = mongoose.model('Test2'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Test2
 */
exports.create = function(req, res) {
  var test2 = new Test2(req.body);
  test2.user = req.user;

  test2.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(test2);
    }
  });
};

/**
 * Show the current Test2
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var test2 = req.test2 ? req.test2.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  test2.isCurrentUserOwner = req.user && test2.user && test2.user._id.toString() === req.user._id.toString();

  res.jsonp(test2);
};

/**
 * Update a Test2
 */
exports.update = function(req, res) {
  var test2 = req.test2;

  test2 = _.extend(test2, req.body);

  test2.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(test2);
    }
  });
};

/**
 * Delete an Test2
 */
exports.delete = function(req, res) {
  var test2 = req.test2;

  test2.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(test2);
    }
  });
};

/**
 * List of Test2s
 */
exports.list = function(req, res) {
  Test2.find().sort('-created').populate('user', 'displayName').exec(function(err, test2s) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(test2s);
    }
  });
};

/**
 * Test2 middleware
 */
exports.test2ByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Test2 is invalid'
    });
  }

  Test2.findById(id).populate('user', 'displayName').exec(function (err, test2) {
    if (err) {
      return next(err);
    } else if (!test2) {
      return res.status(404).send({
        message: 'No Test2 with that identifier has been found'
      });
    }
    req.test2 = test2;
    next();
  });
};
