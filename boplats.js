const tinyreq = require("tinyreq");
const cheerio = require("cheerio");
const fs = require("fs");

// import data from file
const data = require('./data.js');

// url for the home listing website with parameters -> city = Gothenburg and itemtype = first contract
const search_url = "https://nya.boplats.se/sok?city=508A8CB406FE001F00030A60&itemtype=1hand";

// main function call
getNewListings(search_url);

// function returns new listings or null
function getNewListings(link) {
    // get request to retrieve html content from nya.bolats.se
    tinyreq(search_url, (err, body) => {
        // load in HTML as cheerio object
        const $ = cheerio.load(body);
        const object_count = parseInt($('.objectcount').text());
        
        if (object_count != data.objects) {
            $('tbody#search-result-items tr td a').each(function(i, elem) {
                let one_listing = $(this).text().replace(/[\r\n]\s*/g, '\n').split('\n');
                // created array contains following:
                // [1] = rent, [2] = area, [3] = street, [4] = floor, [5] = sqm, [6] = rooms, [7] = movein, [9] = lastdate
                if (one_listing[3].toString() === data.streetAdress) {
                    data.objects = object.count;
                    return false;
                }
                else {
                    let rent = one_listing[1];
                    let area = one_listing[2];
                    let street = one_listing[3];
                    let floor = one_listing[4];
                    let sqm = one_listing[5];
                    let rooms = one_listing[6];
                    let movein = one_listing[8] + " " + one_listing[7];
                    return false;
                }
            })
        }
        else {
            console.log("No new listings");
        }
    });
}