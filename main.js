const readLine = require("readline"); // for I/O
const cheerio = require('cheerio'); // cheerio is like jQuery for node, makes it easier to extract <a> tags from html
const axios = require('axios') // axios is the preffered way to make http requests on node, even according to the documentation


function getLinksRecursively(baseURL,exploredLinks,allLinks,requiredNo,latestExploredIndex)
{
    axios.get(baseURL)
    .then(results => {

            let $ = cheerio.load(results.data); // loads html of webpage in cheerio parsable form

            $("a").each( (index, value) => { // loops through every <a> tag on the page
                let href = $(value).attr("href");
                if(href.includes("http") && !allLinks.includes(href) && allLinks.length < requiredNo) 
                {
                    allLinks.push(href);
                    console.log(href);
                    
                }
                if(allLinks.length >= requiredNo)
                {
                    console.log(allLinks.length + " links found: Exiting");
                    return false;

                }
            })
            if(allLinks.length >= requiredNo)
            {
                return;
            }
            exploredLinks.push(baseURL);
            if(exploredLinks.length == allLinks.length)
            {
                console.log("Circle detected: No of links found = " + allLinks.length);
                return;
            }
            else
            {
                getLinksRecursively(allLinks[latestExploredIndex+1],exploredLinks,allLinks,requiredNo,latestExploredIndex+1)
            }
    })
    .catch(e => { // if a page refuses to connect
        console.log(baseURL + " refused to connect, continuing");
        if(allLinks.length >= requiredNo)
        {
            return;
        }
        exploredLinks.push(baseURL);
        if(exploredLinks.length >= allLinks.length)
        {
            console.log("Circle detected: No of links found = " + allLinks.length);
            return;
        }
        else
        {
            getLinksRecursively(allLinks[latestExploredIndex+1],exploredLinks,allLinks,requiredNo,latestExploredIndex+1)
        }
    })
}

// Input stuff
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

let link = "https://github.com/";
let noLinks = 100;
// getLinksRecursively("http://www.blankwebsite.com",[],[],noLinks,0)



rl.question("Enter starting url: ", function(l) {
    link = l;
    rl.question("How many links would you like to collect: ", function(no) {
        noLinks = no;
        rl.close();
    });
});
rl.on("close", function () {
    getLinksRecursively(link,[],[],noLinks,0)

});

