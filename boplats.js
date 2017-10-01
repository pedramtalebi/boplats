const tinyreq = require("tinyreq");
const cheerio = require("cheerio");
const fs = require("fs");
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '*',
      pass: '*'
    }
});

var mailOptions = {
    from: '*',
    to: '*',
    subject: 'New listings from www.nya.boplats.se',
    html: ''
};

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

                    var new_html = '<!DOCTYPE html><html><head><style>table{font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}tr:nth-child(even) {background-color: #dddddd;}</style></head><body>'+'<div><table><tr><th>Area</th><th>Street</th><th>Rent</th><th>SQM</th><th>Rooms</th></tr>'+'<tr><td>'+area+'</td><td>'+street+'</td><td>'+rent+'</td><td>'+sqm+'</td><td>'+rooms+'</td></tr></table></div></body></html>';
                    
                    mailOptions.html = new_html;

                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });

                    return false;
                }
            })
        }
        else {
            console.log("No new listings");
        }
    });
}



 
    
    
    



    
    
    



    







