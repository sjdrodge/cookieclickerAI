var AI = {};

AI.upgradeBlacklist = {'Elder Pledge':1,
                       'Elder Covenant':1,
                       'Revoke Elder Covenant':1,
                       'Sacrificial rolling pins':1,
                       'One mind':1, //blacklisted due to dialog
                      };

//TODO: learn to click through dialogs?
AI.greedyBuyUpgrades = function(){
  for(var i = Game.UpgradesById.length - 1; i >= 0; i--) {
    upgrade = Game.UpgradeById[i]
    if(upgrade <= Game.cookies && !upgrade.hide && !upgradeBlackList[upgrade.name]) {
      Game.UpgradesById[i].buy();
    }
  }
}

AI.greedyBuyObjects = function(){
  for(var i = Game.ObjectsById.length - 1; i >= 0; i--) {
    while(Game.ObjectsById[i].price <= Game.cookies) {
      Game.ObjectsById[i].buy();
    }
  }
}

AI.sellAllObjects = function(){
  for(var i = 0; i < Game.ObjectsById.length; i++) {
    while(Game.ObjectsById[i].amount != 0) {
      Game.ObjectsById[i].sell();
    }
  }
}

AI.buySellObject = function( objectId ){
  var BuySellObj = Game.ObjectsById[objectId];
  while( ( Game.cookies >= BuySellObj.price ) || ( BuySellObj.amount != 0 ) ) {
    BuySellObj.buy();
    if(Game.cookies < BuySellObj.price) {BuySellObj.sell();}
  }
}

AI.calcNaiveObjectScore = function( object ){
  var timeUntilPurchase = 0;
  var remainingFrenzy = Game.frenzy/Game.fps;
  var projectedCookies = remainingFrenzy*Game.cookiesPs;
  if (object.price > Game.cookies) {
    timeUntilPurchase = (object.price - Game.cookies) / Game.cookiesPs;
    if (timeUntilPurchase > remainingFrenzy) {
      timeUntilPurchase = remainingFrenzy + (object.price - projectedCookies) / Game.cookiesPs * Game.frenzyPower;
    }
  }
  return timeUntilPurchase + object.price / object.storedCps;
}

AI.naiveBuyObjects = function(){
  var minScore = Infinity;
  var choice = 0;
  for(var i = 0; i < Game.ObjectsById.length; i++) {
    var curScore = AI.calcNaiveObjectScore( Game.ObjectsById[i] ); 
    if (curScore < minScore) {
      choice = i;
      minScore = curScore;
    }
  }
  Game.ObjectsById[choice].buy();
}

//TODO: learn to reset.
//TODO: learn to sell.
AI.cookieMonsterLoop = function(){
  var loopDelay = 10;

  AI.naiveBuyObjects();
  Game.goldenCookie.click();

  setTimeout(function() {
    AI.cookieMonsterLoop();  
  }, loopDelay);
}
