var config =  require('./config.json'),
fs = require('fs');

module.exports = function(application){
  	this.logFile = fs.createWriteStream(config[application]['logfilename'],{flags: config.logfilewritemodeflag,autoClose: true}),
	this.logCSV = fs.createWriteStream(config[application]['csvfilename'],{flags: config.csvfilewritemodeflag,autoClose: true});
	this.logData = function(log){
		this.logFile.write('Time : '+ new Date() +'. MessageLog : '+log+'. \n');
	},
	console.log('Log file name : '+config[application]['logfilename']);
	console.log('Web Crawling starts. Crawled url is maintained in CSV file. Filename - '+ config[application]['csvfilename']);
	this.logData('Log file name : '+config[application]['logfilename']);
	this.logData('Web Crawling starts. Crawled url is maintained in CSV file. Filename - '+ config[application]['csvfilename']);
	this.logCSV.write("URL \n");
	this.logCSV.write(config.urltocrawl+"\n");
};