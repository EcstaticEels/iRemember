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
const testPhotoPath = '/Users/jenniferkao/Desktop/iremember-test.jpg'

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

describe('faces', function() {
  var dbConnection;
  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'ecstaticeels',
      password: 'cool',
      database: 'iRemember'
    });
    dbConnection.connect();

    var addCaregiver = 'INSERT INTO Caregivers (id, name, personGroupID, googleId, photo, createdAt, updatedAt, patientId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    var addCaregiverArgs = [10, 'Jenny MacArthur', 'ecstatic-eels-test', null, null,
    '2017-01-20 07:37:04', '2017-01-20 07:37:04', 10];
    var addPatientQuery = 'INSERT INTO Patients (id, name, token, personGroupID, personId, photo, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    var addPatientQueryArgs = [10, "Kevin MacArthur", null, "ecstatic-eels-test",'testPatientPersonId', null, "2017-01-20 21:52:11", "2017-01-20 21:52:11"];
    dbConnection.query(addPatientQuery, addPatientQueryArgs, function(err) { 
      if (err) {
        throw err;
      }
      dbConnection.query(addCaregiver, addCaregiverArgs, function(err) { 
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

  describe('/web/identify', function() {
    var dbConnection;

    beforeEach(function(done) {
      dbConnection = mysql.createConnection({
        user: 'ecstaticeels',
        password: 'cool',
        database: 'iRemember'
      });
      dbConnection.connect();
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



// describe('test endpoint', function() {
//   it('should respond to GET requests to /web/identify with a 200 status code', function(done) {
//     chai.request(server)
//       .get('http://localhost:3000/web/identify?caregiverId=1')
//       // .send({user: {id: 1}})
//       .end(function(error, response, body) {
//         expect(response.statusCode).to.equal(200);
//         done();
//       })

//   });

//   it('should send back parsable stringified JSON', function(done) {
//     request('http://localhost:3000/web/identify?caregiverId=1', function(error, response, body) {
//       expect(JSON.parse.bind(this, response.body)).to.not.throw();
//       done();
//     });
//   });

//   it('should send back reminders in an array', function(done) {
//     request('http://localhost:3000/web/reminders?caregiverId=1', function(error, response, body) {
//       console.log(error)
//       var parsedBody = JSON.parse(body);
//       expect(parsedBody).to.be.an('object');
//       done();
//     });
//   });

  // it('should accept POST requests to /api/items', function(done) {
  //   var requestParams = {method: 'POST',
  //     uri: 'http://127.0.0.1:3000/api/items',
  //     json: {
  //       title: 'test1',
  //       text: 'test1 text'
  //     }
  //   };

  //   request(requestParams, function(error, response, body) {
  //     expect(response.statusCode).to.equal(201);
  //     done();
  //   });
  // });

  // it('should respond with items that were previously posted', function(done) {
  //   var requestParams = {method: 'POST',
  //     uri: 'http://127.0.0.1:3000/api/items',
  //     json: {
  //       title: 'test2',
  //       text: 'test2 text'}
  //   };

  //   request(requestParams, function(error, response, body) {
  //     // Now if we request the log, that message we posted should be there:
  //     request('http://127.0.0.1:3000/api/items', function(error, response, body) {
  //       var items = JSON.parse(body).results;
  //       expect(items[1].text).to.equal('test2 text');
  //       expect(items[1].title).to.equal('test2');

  //       done();
  //     });
  //   });
  // });

  // it('Should 404 when asked for a nonexistent endpoint', function(done) {
  //   request('http://127.0.0.1:3000/nothing/to/see/here', function(error, response, body) {
  //     expect(response.statusCode).to.equal(404);
  //     done();
  //   });
  // })
// });