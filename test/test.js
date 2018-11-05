const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiDom = require('chai-dom');
const { JSDOM } = require("jsdom");
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);
chai.use(chaiDom);

describe('Weather app', () => {

  describe('/GET', () => {
      it('should render the index page', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.html;
              let { document } = (new JSDOM(res.text)).window;
              document.querySelector('input[name=city]')
                        .should.have.attr('placeholder', 'Enter a City');
              done();
            });
      });
  });

  describe('/POST', () => {
      it('should show error for nonexistent cities', (done) => {
        let postData = {
            city: ""
        };
        chai.request(server)
            .post('/')
            .send(postData)
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.html;
              let { document } = (new JSDOM(res.text)).window;
              let errorMessageElement = document.querySelector('.container p.error-message');
              errorMessageElement.should.exist;
              errorMessageElement.innerHTML
                        .should.equal('Error, please try again');
              done();
            });
      });
      
      it('should show temperature in London', (done) => {
        var postData = {
            city: "London"
        };
        chai.request(server)
            .post('/')
            .send(postData)
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.html;
              let { document } = (new JSDOM(res.text)).window;
              let weatherMessageElement = document.querySelector('.container p.weather-message')
              weatherMessageElement.should.exist;
              weatherMessageElement.innerHTML
                        .should.have.string('degrees in London');
              done();
            });
      });
  });

});