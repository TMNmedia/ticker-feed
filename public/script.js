import { fork } from 'child_process';
const WebSocket = require('ws');
var ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');
let stockPriceElement = document.getElementById("indexprice");
let datePriceElement = document.getElementById("tick-time");
let lastPrice = null;

///////////////////////////////////////-#3

const forked = fork('signal.js');

forked.on('message', (msg) => {
    var fifteenOpen = msg;
  console.log('15min - OPEN :',fifteenOpen,'\n', '5Min- Open','\n',lastfiveminOpen );
  lastfifteenOpen = fifteenOpen
});


forked.send({ hello: '15minutes Open' });



ws.onopen = function(evt) {
    ws.send(JSON.stringify({ticks:'R_25'}));
};

ws.onmessage = function(msg) {
    var data = JSON.parse(msg.data);
    let price = data.tick.quote //parseFloat(data.tick.quote).toFixed(3);
    
    const timerz = 1000;
    var binarytickTime = new Date(data.tick.epoch * timerz).toLocaleString();
    //let tickTime = data.tick.epoch

    stockPriceElement.innerText = price;
    datePriceElement.innerText = binarytickTime;
     
 
    //console.log("quote:", data.tick.quote,"time:", data.tick.epoch );

    stockPriceElement.style.color = !lastPrice || lastPrice === price ? "black" : price > lastPrice ? "green" : "red";

    lastPrice = price;

    // working fint to generate live tick price with time and color


 };

