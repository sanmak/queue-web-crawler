var request = require('request'),
config =  require('./config.json'),
logging = require('./logger.js'),
logger = new logging('emitterapp');
mainUrl = config.urltocrawl,
urlFetched = [],arrayQueue = [];
var events = require('events');
var eventEmitter = new events.EventEmitter();
urlFetched.push(mainUrl);
arrayQueue.push(mainUrl);

function scrapUrl(url,callback){
	request.get(url,function(error, response, body){
		if(error || response.statusCode != 200){
			return callback(error,response.statusCode);
		}
		else if(body && response.headers['content-type'].indexOf('text/html') > -1){
			body = body.toString();
			var i = 0,j = 0,k = 0,tempSubstring,hrefString;
			while(body.indexOf('href',i) >= 0){
				i = body.indexOf('href',i) + 1;
				j = body.indexOf('"',i) + 1;
				k = body.indexOf('"',j);
				hrefString = body.substring(i-1,k).replace(/ /g, '');
				tempSubstring = body.substring(j,k).replace(/ /g, '');
				if(hrefString.indexOf('href="http') < 0){ // To Check absolute address
					if(hrefString.indexOf('href="//') < 0){ // To check relative address
						if(tempSubstring[0] == '/'){ //To check internal routes.
							tempSubstring = tempSubstring.substring(1, tempSubstring.length);
						}
						tempSubstring = mainUrl+tempSubstring;
					}
				}
				if(urlFetched.indexOf(tempSubstring) < 0 && hrefString.indexOf('href=') > -1){
					if(tempSubstring.indexOf(mainUrl) > -1){ 
						arrayQueue.push(tempSubstring);
						eventEmitter.emit('checkQueue');
					}
					else{
						logger.logCSV.write(tempSubstring+"\n");
					}
					urlFetched.push(tempSubstring);
				}
			}
			if(body.indexOf('href',i) < 0){
				callback(error,true);
			}
		}
		else{
			callback(error,response.headers['content-type']);
		}
	});
}
var i = 0;
var pushQueue = function pushQueue(){
	if(arrayQueue.length > 0){
		i++;
		logger.logData("Active queue count now : "+i );
		var urlToCrawl = arrayQueue.shift();
		logger.logData("URL crawl in progress : " + urlToCrawl);
		scrapUrl(urlToCrawl,function(err,res){
			if(err){
				logger.logData('Getting error for url '+ urlToCrawl+ ' : ' +err);
			}
			else if(res != true){
				logger.logData('Getting unexpected response from url '+urlToCrawl+' : '+res);
			}
			i--;
			logger.logData("Queue handling url "+urlToCrawl+" is free. Queue count now : "+i);
			eventEmitter.emit('checkQueue');
		});
	}
	else{
		eventEmitter.emit('waitQueue');
	}
}
var checkQueue = function checkQueue(){
	logger.logData("Check active queue count : "+i);
	if(i < parseInt(config.queueworkers, 10)){
		logger.logData("There are free workers.");
		eventEmitter.emit('pushQueue');
	}
	else{
		eventEmitter.emit('waitQueue');
	}
}
var waitQueue = function waitQueue()
{
	logger.logData('WAIT. Queue is full.');
	setTimeout(function(){
		logger.logData('WAIT is now over');
		eventEmitter.emit('checkQueue');
	},1000);
}
eventEmitter.on('checkQueue', checkQueue);
eventEmitter.on('pushQueue',pushQueue);
eventEmitter.on('waitQueue',waitQueue);
eventEmitter.emit('checkQueue');