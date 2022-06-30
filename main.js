import { lastTick } from "./fivmin.js";
import { lastfiveminOpen } from "./fivmin.js";
import { movinAvg } from "./fivmin.js";

var ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');
let stockPriceElement = document.getElementById("indexprice");
let datePriceElement = document.getElementById("tick-time");
let fiveminElement = document.getElementById("fvmin-open");
let fivtnElement = document.getElementById("ftnmin-open");
let tickButtonElement = document.getElementById("indexpricebtn");
let fiveminButtonElement = document.getElementById("fvmin-openbtn");
let fivtnButtonElement = document.getElementById("ftnmin-openbtn");
var lastPrice = null;
var lastfifteenOpen = null;

let entryTimeElement = document.getElementById("entryValueTime");
let entryValueElement = document.getElementById("entryvalue");
let targetPriceElement = document.getElementById("targetPrice");
let upvalueElement = document.getElementById("upvalue");

// /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////
let bot = {
    TOKEN: '1237354844:AAGo0ifiF_QGk8NLr29T6ZBlBYVQoIwTuow',
    chatID: '-1001524450073',
  }
  var message = null;
  var messageT = null;
  var msgloss = null;
  var msg = null;
  var entrySignalM = null;
  //////////////////////////////////////////////////////
  
  //get current data
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const fullDate = `${day}-${month}-${year}`
  
  ///////////////////////////////////////
  ///////////////////////////////////////////////new sets of codes
  //for NOTIFICATION MONITORING
  var barrier = 0.16;
  var remark = 'LOSS';
  let tradeTrigger = false;
  var entryvalue = null;
  var exitvalue = null;
  var entryValueTime = null;
  var monitoringTrigger = false;
  var valueUp = null;
  var valueDown = null;
  var sleep = setTimeout(() => {}, 4000);
  
  var currentPrice = 0;
  var balance = 0;
  
  var minimumValue = 300;
  var tradeLossLimit = -70;//in percent 
  var totalTradeResult = 0;
  var profitThreshold = 50;
  
  
  ///////////////////////////////////////////////new sets of codes
  
  var ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');
  
  
  ////////////////////////////////////////////////////
  var lastTTick = null;
  var targetPrice = null;
  var lastTickTime = null;
  
  
  var upvalue = null;
  var second = null;
  
  var balanceValue = null;
  var valueUp = null;
  var valueDown = null;
  

///////////////////////////////////////////////////////////

ws.onopen = function(evt) {
    ws.send(JSON.stringify({ticks_history: "R_25",
     subscribe: 1,
     adjust_start_time: 1,
     count: 1,
     end: "latest",
     granularity: 900,
     start: 1,
     style: "candles"}));

};

ws.onmessage = function(msg) {
try {
    var data = JSON.parse(msg.data);
    
    let price = data.ohlc.close
    let ftnprice = data.ohlc.open
    var fiftminOpen = parseFloat( ftnprice - 0.6).toFixed(3);

    const timerz = 1000;
    var binarytickTime = new Date(data.ohlc.epoch * timerz).toLocaleString();

    ///////////////////////////////////////////////
    var tick = data.ohlc.close
    var tickTime = data.ohlc.epoch;
    var mvalueUp = parseFloat((tick - lastTick) * 1000).toFixed(0);
    var mvalueDown = parseFloat((lastTick - tick) * 1000).toFixed(0);
    var secondS = new Date(data.ohlc.epoch * timerz);
    var seconds = secondS.getSeconds()
    

    ///////////////////////////////////////////////




    stockPriceElement.innerText = data.ohlc.close; // current tick time
    datePriceElement.innerText = binarytickTime; // current date - time
    fivtnElement.innerText = fiftminOpen // current 15mins open value
    

    tickButtonElement.style.color = !lastPrice || lastPrice === price ? "white" : price > lastPrice ? "orange" : "red";
    

    ///////////////////////////////////////////////

    if (price < fiftminOpen && fiftminOpen < movinAvg) {
        fivtnButtonElement.style.background = "red";
    } else {
        fivtnButtonElement.style.background = "orange";
        
    }


    lastPrice = price;
    lastfifteenOpen = fiftminOpen
    second = seconds;
    lastTTick = tick;
    lastTickTime = binarytickTime;
    valueUp = mvalueUp;
    valueDown = mvalueDown;


    // working fint to generate live tick price with time and color
} catch (err) {
    console.error(err);   
}


 };

 ///////////////////////////////////////-#3



///////////////////////////////////////////////new sets of codes
setInterval(async() => {
    //lastPrice= emp_name;
    //fiveminElement.innerText = emp_name // working 
    
    

    //////////////////////////////////////////////

    //stockPriceElement.innerText = lastTick;
    //datePriceElement.innerText = lastfiveminOpen;
    //fiveminElement.innerText = movinAvg;


    console.log('signal text',lastTick);
  }, 2000);
  //*/

//* NOTIFICATIONS  TRIGGER //////////////////////////
function handleNotification(){
    if (second < 40 && second > 1) { 
      try {
      if (balance == 4 && balanceValue >= +minimumValue){
        targetPrice = lastTick - barrier;
        var entrySignal = lastTick;
        upvalue = balanceValue;

        ///////////////////////////////////
        entryValueTime = lastTickTime //
        stockPriceElement
        entryTimeElement.innerText =  entryValueTime
        entryValueElement.innerText =  entrySignal
        targetPriceElement.innerText =  targetPrice
        upvalueElement.innerText = balanceValue

        /////////////////////////////////
        msg = ('ENTRY ALERT==>'+'\n'+entryValueTime+'ENTRY VALUE =>'+entrySignal+' Target Price =>'+targetPrice+'Balance Value=>'+balanceValue)
        urlnty = ('https://api.telegram.org/bot'+bot.TOKEN+'/sendMessage?chat_id='+bot.chatID+'&text='+msg)
        
  
        try {
          
          entrySignalM = entrySignal
          fetch(urlnty)
          .then(res => res.json())
          .then(data => console.log(data))
          
        } catch (err) {
          console.error(err);   
        }
        
        console.log('RISE UP-',(balance + 1),'-times.', lastTick,'\n',targetPrice);
        // Send notification that price is rising.
    }
     
      if (balance == -4 && balanceValue <= -minimumValue){ 
        
        message = ('FALL DOWN-5-times.'+'Balance Value=>'+balanceValue)
        url = ('https://api.telegram.org/bot'+bot.TOKEN+'/sendMessage?chat_id='+bot.chatID+'&text='+message)
        
        
  
        console.log('FALL DOWN-',-(balance + (-1)),'-times.','Balance Value=>',balanceValue);
      
        // Send notification that price is falling.
    }
      
    } catch (err) {
      //console.error(err);   
    }
  
    }
    
    
  }
  
  
  
  ////////////////MAIN INTERVAL SET UP FOR DATA FEED///////////////////////
  setInterval(async() => {
    
      
    const previousPrice = currentPrice;
  
    currentPrice =  lastTick;
    var redftn = lastfifteenOpen
    var redbelow = lastfiveminOpen

    /////////////////////////////////////////////-m COLLORING 5MINUTES BUTTON 
    fiveminElement.innerText = lastfiveminOpen // working
    

    if (lastfiveminOpen < movinAvg && lastfiveminOpen <= lastfifteenOpen && lastTick < lastfiveminOpen) {
        fiveminButtonElement.style.background = "red";
    } else {
        fiveminButtonElement.style.background = "orange";
        
    }

    /////////////////////////////////////////////



    try {
      if (lastfifteenOpen < movinAvg) {//////////SIGNAL FROM 15MINUTES TIMEFRAME
        if (lastfiveminOpen <= lastfifteenOpen && lastfiveminOpen < movinAvg) {
          if ( lastTick < lastfiveminOpen && lastTick < movinAvg) { //SIGNAL FROM 5MINUTES TIMEFRAME
          console.log('15Min-Open: =>',lastfifteenOpen,'\n','5MinOpen: =>',lastfiveminOpen,'\n', 'Tick: =>',lastTick )
          
          if (currentPrice > previousPrice){
            //console.log('Higher Price')
            if (balance >= 0 ) {
            balance++
            balanceValue = Number(+balanceValue) + +valueUp;
          } else {balance = 0; balanceValue = 0;} 
          
          } else if (currentPrice < previousPrice){
            //console.log('Lower Price')
            if (balance <= 0 ) {balance--; 
              balanceValue = Number(+balanceValue) + +valueUp;
            }  else {balance = 0;
              balanceValue = 0;}
          
          }
          
      
          
        } else { balance = 0;
          balanceValue = 0;}
        }
        
        
      }
    } catch (err) {
      //console.error(err);
    }
  
    handleNotification() //FOR INSTANT TRADE ALERT
  
  
    console.log('M9 =>',movinAvg,'\n','15MN =>',lastfifteenOpen,'\n','5MN =>',lastfiveminOpen,'\n',second,'TIK =>',lastTick,'\n',balance,'up value =>',balanceValue,"==>",valueUp );
    //end of interval
  }, 2000);
  ///////////