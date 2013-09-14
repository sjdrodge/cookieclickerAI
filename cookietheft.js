//Mainloop passive cheating (still requires user to make buy decisions
var stopStealing = false;
function cookieTheft()
{
  if( stopStealing ) { return; }

  var minTheftDelay = 2, maxTheftDelay = 7;
  var extraGoldPerMin = 18;

  var rand = Math.random()
  var averageTheftDelay = minTheftDelay + maxTheftDelay * 0.5;
  var theftDelay = Math.round( rand * ( maxTheftDelay - minTheftDelay ) ) + minTheftDelay;

  if( rand < averageTheftDelay * .000016 * extraGoldPerMin ) {
    Game.goldenCookie.spawn();
  }
  
  Game.researchT = 0;

  setTimeout(function() {
    Game.goldenCookie.click();
    Game.ClickCookie();
    cookieTheft();  
  }, theftDelay);
}
cookieTheft();



var AI = {};

AI.upgradeBlacklist = {'Elder Pledge':1,
                       'Elder Covenant':1,
                       'Revoke Elder Covenant':1,
                       'Sacrificial rolling pins':1,
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

AI.calcObjectScore = function( object ){
  timeUntilPurchase = 0;
  if (object.price > Game.cookies) {
    timeUntilPurchase = (object.price - Game.cookies) / Game.cookiesPs;
  }
  return timeUntilPurchase + object.price / object.storedCps;
}

//TODO: understand boosts.
AI.naiveBuyObjects = function(){
  var minScore = Infinity;
  var choice = 0;
  for(var i = 0; i < Game.ObjectsById.length; i++) {
    var curScore = AI.calcObjectScore( Game.ObjectsById[i] ); 
    if (curScore < minScore) {
      choice = i;
      minScore = curScore;
    }
  }
  Game.ObjectsById[choice].buy();
}

//TODO: learn to reset.
//TODO: learn to wait before buying.
//TODO: learn to sell.
AI.cookieMonsterLoop = function(){
  var loopDelay = 10;

  AI.naiveBuyObjects();
  Game.goldenCookie.click();

  setTimeout(function() {
    AI.cookieMonsterLoop();  
  }, loopDelay);
}
