

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
  var barrier = 0.13;
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
  
  var lastfifteenOpen = null;
  var lastfiveminOpen = null;
  var lastfiveminOpenTime = null;
  ////////////////////////////////////////////////////
  var lastTick = null;
  var targetPrice = null;
  var lastTickTime = null;
  var movinAvg = null;
  
  var upvalue = null;
  var second = null;
  
  var balanceValue = null;
  var valueUp = null;
  var valueDown = null;
  
  ////////////////////////////////////////////////////
  
  
  
  ////////////////////////////////////////WEBSOCKET THINGS
  
  ws.onopen = function(evt) {
      setInterval(async() => {
          try { 
              ws.send(JSON.stringify(
              {ticks_history: "R_25",
               //subscribe: 1,
               adjust_start_time: 1,
               count: 9,
               end: "latest",
               granularity: 300,
               start: 1,
               style: "candles"},
              )
              
              );
          } catch (err) {
              //console.error(err);if (error) {
                ws.onopen
                console.log('WEBSOCKET REOPENED after error: ' + error)
                .then(() => ws.onmessage);
              
          }
         
      }, 60000);
      //*
      ws.send(JSON.stringify(
          {ticks_history: "R_25",
           subscribe: 1,
           adjust_start_time: 1,
           count: 9,
           end: "latest",
           granularity: 300,
           start: 1,
           style: "candles"},
          )
      ) //*/
  }
  
  ws.onmessage = function(msg) {
      try {
          var data = JSON.parse(msg.data);
          
          try {
              var avgClose = parseFloat((data.candles[7].close
                  + data.candles[6].close
                  + data.candles[5].close
                  + data.candles[4].close
                  + data.candles[3].close
                  + data.candles[2].close 
                  + data.candles[1].close 
                  + data.candles[0].close)/8).toFixed(3);
              var avgCloseDown = avgClose - 1
                
              //console.log(data.candles[2].close,'\n',data.candles[1].close,'\n',avgClose );
              console.log('MOVING AVG:==>','\n',avgCloseDown);
  
              movinAvg = avgCloseDown 
  
          } catch (err) {
              //console.error(err);
          }
  
          try {
              var tick = data.ohlc.close
              var fiveminOpen = parseFloat(data.ohlc.open - 0.6).toFixed(3);
              var tickTime = data.ohlc.epoch;
              var mvalueUp = parseFloat((tick - lastTick) * 1000).toFixed(0);
              var mvalueDown = parseFloat((lastTick - tick) * 1000).toFixed(0);
              const timerz = 1000;
              var binarytickTime = new Date(tickTime * timerz).toLocaleString();
  
           
              //currentTickStyle = lastTick === tick ? 'black' : tick > lastTick ?(console.log(mvalueUp , "points",'=>','UP')):( console.log(mvalueDown, "points",'=>','DOWN'));
              
              //console.log(' TICK===','\n',currentTick,'\n',balance); 
              var secondS = new Date(data.ohlc.epoch * timerz);
              var seconds = secondS.getSeconds()
              //console.log(seconds, 'ticks update=>', data.ohlc.close);
  
              second = seconds;
  
  
              
          
              lastTick = tick;
              lastfiveminOpen = fiveminOpen;
              lastTickTime = binarytickTime;
              valueUp = mvalueUp;
              valueDown = mvalueDown;
  
              
             //console.log(tick);
              //console.log((avgClose));
              
  
          } catch (err) {
              //console.error(err); //printing main error
          }
          
  
  
          //lastTick = tick;
          //lastfiveminOpen = fiveminOpen;
  
      } catch (err) {
          //console.error(err);
      }
  } 
  ////////////////////////////////////////WEBSOCKET THINGS
  
  
  //////////////////////////////////////////////////////////////
  
  
  /////////////////////////////////////////////////////////
  //* NOTIFICATIONS  TRIGGER //////////////////////////
  function handleNotification(){
    if (second < 40 && second > 1) { 
      try {
      if (balance == 4 && balanceValue >= +minimumValue){
        targetPrice = lastTick - barrier;
        var entrySignal = lastTick;
        upvalue = balanceValue;
        tradeTrigger = true;
        msg = ('RISE UP-'+ entrySignal+' Target=>'+targetPrice+'Balance Value=>'+balanceValue)
        urlnty = ('https://api.telegram.org/bot'+bot.TOKEN+'/sendMessage?chat_id='+bot.chatID+'&text='+msg)
        
  
        try {
          
          entrySignalM = entrySignal
          request.get(urlnty,function (error, response, body) {
            console.log('body:', msg); // Print the HTML for the Google homepage.
            
          });
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
    var redftn = lastfifteenOpen - 0.7;
    var redbelow = lastfiveminOpen - 0.6;
    try {
      if (lastTick < movinAvg) {//////////SIGNAL FROM 15MINUTES TIMEFRAME
        if (lastTick < redftn && redftn < movinAvg) {
          if (lastTick < redbelow && redbelow < movinAvg) { //SIGNAL FROM 5MINUTES TIMEFRAME
          console.log('15Min-Open: =>',redftn,'\n','5MinOpen: =>',redbelow,'\n', 'Tick: =>',lastTick )
          
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
  
    //handleNotification() //FOR INSTANT TRADE ALERT
  
  
    //console.log('M9 =>',movinAvg,'\n','15MN =>',redftn,'\n','5MN =>',redbelow,'\n',second,'TIK =>',lastTick,'\n',balance,'up value =>',balanceValue,"==>",valueUp );
    //end of interval
  }, 2000);
  ////////////////MAIN INTERVAL SET UP FOR DATA FEED///////////////////////
  //////////////////////////////////////////////////////////////
  export {movinAvg, lastfiveminOpen, lastTick}
  
  
