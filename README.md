# queue-web-crawler
This application is developed to crawl a website using queue with request concurrency at max 5 and find all possible hyperlinks present within it and save it to CSV file.

For this two modules is developed to accomplish it. First is by using async library, name of a file is **withAsyncLibrary.JS** and second is without using async library, name of file is **withOutAsyncLibrary.js**.

### How to use this repository ?
- Clone or download repository.  [Refer](https://help.github.com/articles/cloning-a-repository/)
- Go to application folder. 
- Install dependencies. Run `npm install`.
- Run `npm run asyncapp` to test functionality of **withAsyncLibrary.JS** module.
- Run `npm run emitterapp` to test functionality of **withOutAsyncLibrary.js** module.
- To test the status of url on which we start crawling, run `npm run test`. It will return success if statuscode of website is **200** else it will throw an error.

#### CSV and Log file
Hyperlinks found after crawling a website is maintened in a *.CSV file and along with it log file *.txt is maintened to check specific logs with time of occurrences.
- If you run `npm run asyncapp`, then `asyncapp.csv` and `asyncapp.txt` file will be generated.
- If you run `npm run emitterapp`, then `emitterapp.csv` and `emitterapp.txt` file will be generated.

#### Configurable Objects 
- A config.json file is created to configure specific objects.
- `urltocrawl` object can be change to any web address where you want to crawl.
- `queueworkers` object can be change to any number of concurrent request connections requried to crawl a website.
- `logfilename` and `csvfilename` can be change to any file name require for log and csv file. 
- `logfilewritemodeflag` and `logfilewritemodeflag` determines mode at which file (log and csv) file is opened for operation. It can also be change as per requirement.

### Important Instruction
- Don’t spam web servers with too many requests, their servers might ban your ip.
- Only html pages is crawled, but *.CSV file consists of all hyperlinks found on its way (*.css,*.png and etc.).