const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function() {
	this.timeout(5000);
	suite('Integration tests with chai-http', function() {
		// #1
		test('Test GET /hello with no name', function(done) {
			chai.request(server).get('/hello').end(function(err, res) {
				assert.equal(res.status, 200);
				assert.equal(res.text, 'hello Guest');
				done();
			});
		});
		// #2
		test('Test GET /hello with your name', function(done) {
			chai.request(server).get('/hello?name=xy_z').end(function(err, res) {
				assert.equal(res.status, 200);
				assert.equal(res.text, 'hello xy_z');
				done();
			});
		});
		// #3
		test('Send {surname: "Colombo"}', function(done) {
			chai
				.request(server)
				.put('/travellers')
				/** send {surname: 'Colombo'} here **/
				.send({ surname: 'Colombo' })
				// .send({...})
				.end(function(err, res) {
					/** your tests here **/
					assert.equal(res.status, 200, 'response status should be 200');
					assert.equal(res.type, 'application/json', 'Response should be json');
					assert.equal(res.body.name, 'Cristoforo', 'res.body.name should be "Christoforo"');
					assert.equal(res.body.surname, 'Colombo', 'res.body.surname should be "Colombo"');
					done();
				});
		});
	});
});

const Browser = require('zombie');

suite('Functional Tests with Zombie.js', function() {
	this.timeout(5000);
	Browser.site = 'https://mochachai.ssaadd1.repl.co'; // Your URL here
	const browser = new Browser();
	suite('Headless browser', function() {
		test('should have a working "site" property', function() {
			suiteSetup(function(done) {
				return browser.visit('/', done);
			});

			// assert.isNotNull(browser.site);
		});
	});

	suite('"Famous Italian Explorers" form', function() {
		// #5
		test('Submit the surname "Colombo" in the HTML form', function(done) {
			// assert.fail();
			Browser.site = 'https://mochachai.ssaadd1.repl.co'; // Your URL here
			const browser = new Browser();
			browser.visit('/');
			browser.fill('surname', 'Colombo').then(() => {
				browser.pressButton('submit', () => {
					browser.assert.success();
					browser.assert.text('span#name', 'Cristoforo');
					browser.assert.text('span#surname', 'Colombo');
					browser.assert.elements('span#dates', 1);
					done();
				});
			});
		});
		// #6
		test('submit "surname" : "Vespucci" - write your e2e test...', function(done) {
			// fill the form, and submit.
			browser.fill('surname', 'Vespucci').pressButton('submit', function() {
				// assert that status is OK 200
				browser.assert.success();
				// assert that the text inside the element 'span#name' is 'Amerigo'
				browser.assert.text('span#name', 'Amerigo');
				// assert that the text inside the element 'span#surname' is 'Vespucci'
				browser.assert.text('span#surname', 'Vespucci');
				// assert that the element(s) 'span#dates' exist and their count is 1
				browser.assert.element('span#dates', 1);

				done();
			});
		});
	});
});
