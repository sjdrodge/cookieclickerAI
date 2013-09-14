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
