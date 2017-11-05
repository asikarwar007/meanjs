'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Test2 = mongoose.model('Test2'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  test2;

/**
 * Test2 routes tests
 */
describe('Test2 CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Test2
    user.save(function () {
      test2 = {
        name: 'Test2 name'
      };

      done();
    });
  });

  it('should be able to save a Test2 if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Test2
        agent.post('/api/test2s')
          .send(test2)
          .expect(200)
          .end(function (test2SaveErr, test2SaveRes) {
            // Handle Test2 save error
            if (test2SaveErr) {
              return done(test2SaveErr);
            }

            // Get a list of Test2s
            agent.get('/api/test2s')
              .end(function (test2sGetErr, test2sGetRes) {
                // Handle Test2s save error
                if (test2sGetErr) {
                  return done(test2sGetErr);
                }

                // Get Test2s list
                var test2s = test2sGetRes.body;

                // Set assertions
                (test2s[0].user._id).should.equal(userId);
                (test2s[0].name).should.match('Test2 name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Test2 if not logged in', function (done) {
    agent.post('/api/test2s')
      .send(test2)
      .expect(403)
      .end(function (test2SaveErr, test2SaveRes) {
        // Call the assertion callback
        done(test2SaveErr);
      });
  });

  it('should not be able to save an Test2 if no name is provided', function (done) {
    // Invalidate name field
    test2.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Test2
        agent.post('/api/test2s')
          .send(test2)
          .expect(400)
          .end(function (test2SaveErr, test2SaveRes) {
            // Set message assertion
            (test2SaveRes.body.message).should.match('Please fill Test2 name');

            // Handle Test2 save error
            done(test2SaveErr);
          });
      });
  });

  it('should be able to update an Test2 if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Test2
        agent.post('/api/test2s')
          .send(test2)
          .expect(200)
          .end(function (test2SaveErr, test2SaveRes) {
            // Handle Test2 save error
            if (test2SaveErr) {
              return done(test2SaveErr);
            }

            // Update Test2 name
            test2.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Test2
            agent.put('/api/test2s/' + test2SaveRes.body._id)
              .send(test2)
              .expect(200)
              .end(function (test2UpdateErr, test2UpdateRes) {
                // Handle Test2 update error
                if (test2UpdateErr) {
                  return done(test2UpdateErr);
                }

                // Set assertions
                (test2UpdateRes.body._id).should.equal(test2SaveRes.body._id);
                (test2UpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Test2s if not signed in', function (done) {
    // Create new Test2 model instance
    var test2Obj = new Test2(test2);

    // Save the test2
    test2Obj.save(function () {
      // Request Test2s
      request(app).get('/api/test2s')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Test2 if not signed in', function (done) {
    // Create new Test2 model instance
    var test2Obj = new Test2(test2);

    // Save the Test2
    test2Obj.save(function () {
      request(app).get('/api/test2s/' + test2Obj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', test2.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Test2 with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/test2s/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Test2 is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Test2 which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Test2
    request(app).get('/api/test2s/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Test2 with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Test2 if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Test2
        agent.post('/api/test2s')
          .send(test2)
          .expect(200)
          .end(function (test2SaveErr, test2SaveRes) {
            // Handle Test2 save error
            if (test2SaveErr) {
              return done(test2SaveErr);
            }

            // Delete an existing Test2
            agent.delete('/api/test2s/' + test2SaveRes.body._id)
              .send(test2)
              .expect(200)
              .end(function (test2DeleteErr, test2DeleteRes) {
                // Handle test2 error error
                if (test2DeleteErr) {
                  return done(test2DeleteErr);
                }

                // Set assertions
                (test2DeleteRes.body._id).should.equal(test2SaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Test2 if not signed in', function (done) {
    // Set Test2 user
    test2.user = user;

    // Create new Test2 model instance
    var test2Obj = new Test2(test2);

    // Save the Test2
    test2Obj.save(function () {
      // Try deleting Test2
      request(app).delete('/api/test2s/' + test2Obj._id)
        .expect(403)
        .end(function (test2DeleteErr, test2DeleteRes) {
          // Set message assertion
          (test2DeleteRes.body.message).should.match('User is not authorized');

          // Handle Test2 error error
          done(test2DeleteErr);
        });

    });
  });

  it('should be able to get a single Test2 that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Test2
          agent.post('/api/test2s')
            .send(test2)
            .expect(200)
            .end(function (test2SaveErr, test2SaveRes) {
              // Handle Test2 save error
              if (test2SaveErr) {
                return done(test2SaveErr);
              }

              // Set assertions on new Test2
              (test2SaveRes.body.name).should.equal(test2.name);
              should.exist(test2SaveRes.body.user);
              should.equal(test2SaveRes.body.user._id, orphanId);

              // force the Test2 to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Test2
                    agent.get('/api/test2s/' + test2SaveRes.body._id)
                      .expect(200)
                      .end(function (test2InfoErr, test2InfoRes) {
                        // Handle Test2 error
                        if (test2InfoErr) {
                          return done(test2InfoErr);
                        }

                        // Set assertions
                        (test2InfoRes.body._id).should.equal(test2SaveRes.body._id);
                        (test2InfoRes.body.name).should.equal(test2.name);
                        should.equal(test2InfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Test2.remove().exec(done);
    });
  });
});
