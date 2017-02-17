var request = require('request'),
async = require('async'),
config =  require('./config.json'),
logging = require('./logger.js'),
logger = new logging('asyncapp');
mainUrl = config.urltocrawl;

var i = 0;
var urlFetched = [mainUrl];

function scrapUrl(url,callback){
	request.get(url,function(error, response, body){
		if(error || response.statusCode != 200){
			return callback(error,response.statusCode);
		}
		else if(body && response.headers['content-type'].indexOf('text/html') > -1){
			body = body.toString();
			var i = 0,j = 0,k = 0,tempSubstring,hrefString;
			async.whilst(
			    function() { return (body.indexOf('href',i) >= 0); },
			    function(whileCallback) {
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
						logger.logCSV.write(tempSubstring+"\n");
						urlFetched.push(tempSubstring);
						pushToQueue(tempSubstring);
					}
					whileCallback(null,i);
			    },
			    function (err, n) {
			    	callback(error,true);
			    });
		}
		else{
			callback(error,response.headers['content-type']);
		}
	});
}

var q = async.queue(function(task, callback) {
	setTimeout(function(){
		scrapUrl(task.URL, function(err,res){
			callback(err,res);
		});
	},1000);
},parseInt(config.queueworkers, 10));

q.drain = function() {
    logger.logData('All URLs have been processed.');
};
function pushToQueue(urlTOCall){
	if(urlTOCall.indexOf(mainUrl) > -1){ 
		q.push({URL: urlTOCall}, function (err,res) {
			if(err){
				logger.logData('Getting error for url '+ urlTOCall+ ' : ' +err);
			}
			else if(res != true){
				logger.logData('Getting unexpected response from url '+urlTOCall+' : '+res);
			}	
		});
	}
}

pushToQueue(mainUrl);
