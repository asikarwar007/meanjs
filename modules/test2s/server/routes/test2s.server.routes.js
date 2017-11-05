'use strict';

/**
 * Module dependencies
 */
var test2sPolicy = require('../policies/test2s.server.policy'),
test2 = require('../controllers/test2s.server.controller');

module.exports = function(app) {
  // Test2s Routes
  app.route('/api/test2s').all(test2sPolicy.isAllowed)
    .get(test2.list)
    .post(test2.create);

  app.route('/api/test2s/:test2Id').all(test2sPolicy.isAllowed)
    .get(test2.read)
    .put(test2.update)
    .delete(test2.delete);

  // Finish by binding the Test2 middleware
  app.param('test2Id', test2.test2ByID);
  app.route('/test2')
  .get(test2.list)
  .post(test2.create);

// the categoryId param is added to the params object for the request
app.route('/test2/:test2ID')
.get(test2.read);
};
