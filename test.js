var chai = require('chai'),
request = require('request');
expect = chai.expect, // we are using the "expect" style of Chai
config =  require('./config.json');

describe('To Check response of a server where we will start crawling ', function() {
  	it('Reponse of url, evnt if it is slow ', function(done) {
  		this.timeout(0); // To prevent timeout error 
  		try{
	  		request(config.urltocrawl,function(err,res,body){
	    		expect(res.statusCode).to.equal(200);
	    		done();
		 	});
	  	}
	  	catch(e){
	  		done(e);
	  	}
  	});
});