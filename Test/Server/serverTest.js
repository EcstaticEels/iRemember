const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server/server.js');
const expect = chai.expect;
const supertest = require('supertest');
const request = supertest.agent(server);
const mysql = require('mysql');
const testPersonGroupId = 'ecstatic-eels-test'
chai.use(chaiHttp);
//need to add photo on desktop called iremember-test.jpg
const testPhotoPath = '/Users/jenniferkao/Desktop/iremember-test.jpg';
process.env.NODE_ENV = 'test';

server.request.isAuthenticated = function() {
  server.request.user = {
    id: 10,
    name: 'Jenny MacArthur',
    personGroupID: 'ecstatic-eels-5-1',
    googleId: null,
    photo: null,
    createdAt: '2017-01-20 07:37:04',
    updatedAt: '2017-01-20 07:37:04',
    patientId: 10
  }
  return true;
}

const connectToDb = function() {
  var dbConnection = mysql.createConnection({
    user: 'ecstaticeels',
    password: 'cool',
    database: 'iRemember'
  });
  dbConnection.connect();
  return dbConnection;
}

describe('server', function() {
  describe('GET /', function () {
    it('should return the content of index.html', function (done) {
      request
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200, done);
    });
  });
});

describe('Web controllers', function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = connectToDb();
    var addCaregiver = 'INSERT INTO Caregivers (id, name, personGroupID, googleId, photo, createdAt, updatedAt, patientId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    var addCaregiverArgs = [10, 'Jenny MacArthur', 'ecstatic-eels-test', null, null,
    '2017-01-20 07:37:04', '2017-01-20 07:37:04', 10];
    var addPatientQuery = 'INSERT INTO Patients (id, name, token, personGroupID, personId, photo, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    var addPatientQueryArgs = [10, "Kevin MacArthur", null, "ecstatic-eels-test",'testPatientPersonId', null, "2017-01-20 21:52:11", "2017-01-20 21:52:11"];
    dbConnection.query(addPatientQuery, addPatientQueryArgs, function(err) { 
      if (err) {
        throw err;
      }
      dbConnection.query(addCaregiver, addCaregiverArgs, function(err, results) { 
        if (err) {
          throw err;
        }
        done();
      });
    })
  })

  afterEach(function(done) {
    var deletePatientQuery = 'DELETE FROM Patients where id=10';
    var deleteCaregiverQuery = 'DELETE FROM Caregivers where id=10';
    dbConnection.query(deletePatientQuery, function(err) {
      if (err) {
        throw err;
      }
      dbConnection.query(deleteCaregiverQuery, function(err) {
        if (err) {
          throw err;
        }
        dbConnection.end(function() {
          done();
        });
      })
    })
  });

  describe('Requests to /web/reminders', function() {
    var dbConnection;
    beforeEach(function(done) {
      dbConnection = connectToDb();
      var addReminderQuery = 'INSERT INTO Reminders (id, date, type, note, recurring' +
      ', recurringDays, notificationId, registered, audio, title, createdAt, updatedAt,' + 
      'patientId, caregiverId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      var addReminderQueryArgs = [10, "2017-01-21 20:00:00", "Medication", null, 
      false, null, null, true, null, "Take 3 Tylenol pills", "2017-01-20 17:41:27", 
      "2017-01-20 17:41:27", 10, 10];
      dbConnection.query(addReminderQuery, addReminderQueryArgs, function(err, results) {
        if (err) { 
          throw err; 
        }
        done();
      });
    });

    afterEach(function(done) {
      var deleteReminderQuery = 'DELETE FROM Reminders WHERE id=10';
      dbConnection.query(deleteReminderQuery, function(err) {
        if (err) {
          throw err;
        }
        done();
      });
    })

    describe('GET', function() {
      it('should fetch reminders', function(done) {
        request
          .get('/web/reminders')
          .expect(200)
          .expect('Content-Type', 'text/html; charset=utf-8')
          .end(function(err, res) {
            if (err) {
              throw err;
            }
            var parsedRes = JSON.parse(res.text);
            expect(parsedRes).to.have.property('reminders');
            expect(parsedRes.reminders[0].id).to.equal(10);
            done();
          });
      });
    });

    describe('DELETE', function() {
      it('should nullify a reminder in the database', function(done) {
        request
          .delete('/web/reminders')
          .send({reminderId: 10})
          .end(function(err, res) {
            if (err) {
              throw err;
            }
            var retrieveReminderQuery = "SELECT * FROM Reminders WHERE id=10"
            dbConnection.query(retrieveReminderQuery, function(err, results) {
              if (err) {
                throw err;
              }
              expect(results[0].registered).to.equal(null);
              done();
            })
          });
      });
    });

    describe('ADD', function() {
      afterEach(function(done) {
        var deleteReminderQuery = 'DELETE FROM Reminders WHERE title="Water flowers"';
        dbConnection.query(deleteReminderQuery, function(err) {
          if (err) {
            throw err;
          }
          done();
        });
      });

      it('should add a reminder to the database', function(done) {
        request
          .post('/web/reminders')
          .type('multipart/form-data')
          .field('date', '2017-01-21 20:00:00')
          .field('recurring', 'true')
          .field('recurringDays', 'Wednesday,Thursday')
          .field('type', 'Chore')
          .field('title', 'Water flowers')
          .field('note', 'In the backyard and behind the tree')
          .field('registered', 'false')
          .end(function(err, res) {
            var retrieveReminderQuery = 'SELECT * FROM Reminders WHERE title="Water flowers"';
            dbConnection.query(retrieveReminderQuery, function(err, results) {
              if (err) {
                throw err;
              }
              expect(results).to.have.length(1);
              expect(results[0].note).to.equal('In the backyard and behind the tree')
              done();
            });
          });
      });
    });

    describe('UPDATE', function() {
      it('should update a reminder from the database', function(done) {
        request
          .put('/web/reminders')
          .type('multipart/form-data')
          .field('date', '2017-12-25 6:00:00')
          .field('recurring', 'false')
          .field('recurringDays', 'false')
          .field('type', 'Other')
          .field('title', 'Celebrate the New Year')
          .field('note', "Dinner Party at George's house")
          .field('registered', 'false')
          .field('reminderId', 10)
          .end(function(err, res) {
            var retrieveReminderQuery = "SELECT * From Reminders WHERE id=10"
            dbConnection.query(retrieveReminderQuery, function(err, results) {
              if (err) {
                throw err;
              }
              expect(results).to.have.length(1);
              expect(results[0].title).to.equal('Celebrate the New Year');
              expect(results[0].note).to.equal("Dinner Party at George's house");
              done();
            });
          })
      });
    });
  });

  describe('Requests to /web/identify', function() {
      var dbConnection;

    beforeEach(function(done) {
      dbConnection = connectToDb();
      var addFaceQuery = 'INSERT INTO Faces (id, name, personId, description, photo, audio, createdAt, updatedAt, patientId, caregiverId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      var addFaceQueryArgs = [11, "Rodney Ruxin", "testPersonId", "Lawyer neighbor obsessed with fantasy football", null, null, "2017-01-20 21:52:11", "2017-01-20 21:52:11", 10, 10];
      dbConnection.query(addFaceQuery, addFaceQueryArgs, function(err) {
        if (err) { 
          throw err; 
        }
        done();
      });
    });

    afterEach(function(done) {
      var deleteFaceQuery = 'DELETE FROM Faces WHERE id=11';
      dbConnection.query(deleteFaceQuery, function(err) {
        if (err) {
          throw err;
        }
        done();
      });
    })

    describe('GET', function() {
      it('should return an object with faces associated with the test user', function(done) {
        request
          .get('/web/identify')
          .expect(200)
          .expect('Content-Type', 'text/html; charset=utf-8')
          .end(function(err, res) {
            if (err) {
              throw err;
            }
            var parsedRes = JSON.parse(res.text);
            expect(parsedRes).to.have.property('faces');
            expect(parsedRes.faces[0].dbId).to.equal(11);
            done();
          });
      });
    });

    describe('DELETE', function() {
      it('should delete a face from the database', function(done) {
        this.timeout(10000);
        request
          .delete('/web/identify')
          .send({faceId: 11})
          .end(function(err, res) {
            if (err) {
              throw err;
            }
            var retrieveRuxinQuery = "SELECT * From faces WHERE id=11"
            dbConnection.query(retrieveRuxinQuery, function(err, results) {
              if (err) {
                throw err;
              }
              expect(results).to.have.length(0);
              done();
            })
          });
      });
    });

    describe('UPDATE', function() {
      it('should update a face from the database', function(done) {
        request
          .put('/web/identify')
          .type('multipart/form-data')
          .field('subjectName', 'Taco MacArthur')
          .field('description', 'Founder of Taco Corp')
          .field('faceId', 11)
          .end(function(err, res) {
            var retrieveTacoQuery = "SELECT * From faces WHERE name='Taco MacArthur'"
            dbConnection.query(retrieveTacoQuery, function(err, results) {
              if (err) {
                throw err;
              }
              expect(results).to.have.length(1);
              expect(results[0].description).to.equal('Founder of Taco Corp');
              done();
            });
          })
      })
    })

    describe('ADD', function() {
      afterEach(function(done) {
        var deleteFaceQuery = 'DELETE FROM Faces WHERE name="Taco MacArthur"';
        dbConnection.query(deleteFaceQuery, function(err) {
          if (err) {
            throw err;
          }
          done();
        });
      });

      it('should add a face to the database', function(done) {
        this.timeout(20000);
        request
          .post('/web/identify')
          .type('multipart/form-data')
          .field('subjectName', 'Taco MacArthur')
          .field('description', 'League doofus')
          .attach('photo', testPhotoPath)
          .end(function(err, res) {
            var retrieveTacoQuery = "SELECT * From faces WHERE name='Taco MacArthur'"
            dbConnection.query(retrieveTacoQuery, function(err, results) {
              if (err) {
                throw err;
              }
              expect(results).to.have.length(1);
              expect(results[0].name).to.equal("Taco MacArthur")
              done();
            });
          });
      });
    });
  });
});
