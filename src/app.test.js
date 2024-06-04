const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./app.js");
const mongoose = require("mongoose");
const subscriberModel = require("./models/subscribers");
const data = require("./data");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Subscribers API", () => {
  before((done) => {
    // Connect to the test database before running tests
    mongoose.connect(
      process.env.DBURI || "mongodb://localhost/subscribers_test",
      { useNewUrlParser: true, useUnifiedTopology: true },
      async () => {
        // Clean and populate the database with sample data
        await subscriberModel.deleteMany({});
        await subscriberModel.insertMany(data);
        done();
      }
    );
  });

  after((done) => {
    // Disconnect from the test database after running tests
    mongoose.connection.close(() => {
      done();
    });
  });

  describe("GET /subscribers", () => {
    it("it should GET all the subscribers", (done) => {
      chai
        .request(app)
        .get("/subscribers")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(data.length); // Check if the length matches the sample data
          done();
        });
    });
  });

  describe("GET /subscribers/names", () => {
    it("it should GET names and subscribed channels of all subscribers", (done) => {
      chai
        .request(app)
        .get("/subscribers/names")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(data.length); // Check if the length matches the sample data
          res.body[0].should.have.property("name");
          res.body[0].should.have.property("subscribedChannel");
          done();
        });
    });
  });

  describe("GET /subscribers/:id", () => {
    it("it should GET details of a subscriber by ID", (done) => {
      // Fetch an existing subscriber ID from the sample data
      subscriberModel.findOne({}, (err, subscriber) => {
        chai
          .request(app)
          .get(`/subscribers/${subscriber._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("name");
            res.body.should.have.property("subscribedChannel");
            done();
          });
      });
    });

    it("it should return 400 for a subscriber by invalid ID", (done) => {
      chai
        .request(app)
        .get("/subscribers/invalidID")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("message");
          done();
        });
    });
  });
});
