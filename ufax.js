"use strict";
const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const admin = require("firebase-admin");
const axios = require('axios')
const app = express();
const RateLimit = require('express-rate-limit');

app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc) 


const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ddos-protect9999-default-rtdb.firebaseio.com"
});


const db = admin.database();

async function WhirtData(ip, Host, user_agent, accept, accept_language, if_modified_since) {

    let language = accept_language.split("-");
    const savedRef = await db.ref('ddos_blacklist/' + language[0]);
    savedRef.set({

        "IPblacklist": ip,
        "Host": Host,
        "accept_language": accept_language,
        "if_modified_since": if_modified_since,
        "user_agent": user_agent,
        "accept": accept

    })
    console.log("IPblacklist: " + ip + " :: " + Host + " :: " + accept_language)
}


function notofy() {
    var token = 'doyPqUsd9Fmzg4rwfxONPdqOakSxCxqwitKWvA50AHx';
    var message = req.body.message;

    request({
        method: 'POST',
        uri: 'https://notify-api.line.me/api/notify',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
            'bearer': token
        },
        form: {
            message: message
        }
    }, (err, httpResponse, body) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                httpResponse: httpResponse,
                body: body
            });
        }
    });
}

let irq = 15; //Number of seconds of the requests interval.
let maxrq = 10 //Number of requests accepted in the "irq" time interval.


irq = irq * 1000;

console.log("--> Cool ddos protection by UFAX24 <--");
//app.set('viewsweb', __dirname + 'game')

app.get("/", (req, res) => {
  //console.log(req.headers)
  antiddos(req, res, irq, maxrq);
  //res.sendFile(path.join(__dirname + "/index.php"))
});


var apiLimiter = new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes 
    max: 100,
    delayMs: 0 // disabled 
});

app.use('/api/', apiLimiter);

// app.use(function (req, res) {
//     ddosprotect.antiddos(req, res, 15000, 10); 
//     // interval: interval of requests refreshing in miliseconds | maxrequests: max requests accepted into the time interval.
//   });

function antiddos(request, response, interval, maxrequests) {
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    ip = ip.split(",");
    ip = ip['0'];
    fs.appendFileSync("listconnections.txt", ip + "+");
    let listip = fs.readFileSync("listconnections.txt", "utf-8").split('+');
    let nbrq = getnbrequests(listip, ip);

    if (nbrq > maxrequests) {
        switch(nbrq) {
            case nbrq > 10:
                console.log("❌ , number of "+ip+" requests last " + interval / 1000 + "s : " + nbrq + "/" + maxrequests);
                let Host = req.headers.host;
                let user_agent = req.headers['user-agent'];
                let accept = req.headers.accept;
                let accept_language = req.headers['accept-language'];
                let if_modified_since = req.headers['if-modified-since'];
                WhirtData(ip, Host, user_agent, accept, accept_language, if_modified_since);
              break;
            case nbrq > 15:
                var createAccountLimiter = new RateLimit({
                    windowMs: 60 * 60 * 1000, // 1 hour window 
                    delayAfter: 1, // begin slowing down responses after the first request 
                    delayMs: 3 * 1000, // slow down subsequent responses by 3 seconds per request 
                    max: 5, // start blocking after 5 requests 
                    message: "Too many accounts created from this IP, please try again after an hour"
                });
                app.post('/create-account', createAccountLimiter, function (req, res) {
                console.log(res)
                });
              break;
            case nbrq > 20:
                response.redirect("https://" + ip);
            default:
              // code block
          }
        
        
        //pykill("https://"+ip);
        

 
        //console.log("Host: " + request.headers.host, "user-agent: " + request.headers['user-agent'], "accept: " + request.headers.accept, "accept-language: " + request.headers['accept-language'], "if-modified-since: " + request.headers['if-modified-since'])
    } else {
        response.redirect("http://app-43b9700d-50b4-41bc-a241-a50e2135ece1.cleverapps.io/");
        console.log("✔️  " + ip + ", number of requests last " + interval / 1000 + "s : " + nbrq + "/" + maxrequests);
    }
}



function getnbrequests(array, value) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}

setInterval(function () {
    fs.writeFileSync("listconnections.txt", " ");
}, irq);


// listen for requests :)
var listener = app.listen(process.env.PORT || 8080, function () {
    console.log('🚀 𝙎𝙚𝙧𝙫𝙚𝙧 𝙎𝙩𝙖𝙧𝙩 ~~~~ ' + listener.address().port);
});






