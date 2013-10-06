//var remote_location = "https://localhost:3000";
//var remote_location = 'https://moteiostaging-9163.onmodulus.net';
var remote_location = 'https://mote.io:443';

var date = new Date();

var extension_url = "//js.leapmotion.com/0.2.0-beta1/leap.min.js";

window.exec = function(fn) {
  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = '(' + fn + ')();';
  document.documentElement.appendChild(script);
  document.documentElement.removeChild(script);
}

function async_load(){

  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = extension_url;
  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);

}

if (window.attachEvent) {
  window.attachEvent('onload', async_load);
} else {
  window.addEventListener('load', async_load, false);
}

exec(function(){

  function findRemote() {

    if(typeof mote != "undefined" && typeof mote.io.remote != "undefined" && typeof Leap != "undefined") {


      var date = new Date(),
        lastGesture = date.getTime(),
        gestureTimeout = 300,
        gestureMapping = [],
        displayMapping = [],
        button;

      for(var i = 0; i < mote.io.remote.blocks.length; i++) {
        if(mote.io.remote.blocks[i].type == "buttons") {

          for(var j = 0; j < mote.io.remote.blocks[i].data.length; j++) {

            button = mote.io.remote.blocks[i].data[j];
            gestureMapping[button.leapmotion] = button;

          }

        }

      }

      Leap.loop({enableGestures: true}, function(obj) {

        if (obj.gestures.length > 0) {
          obj.gestures.forEach(function(gesture) {
            fireGesture(gesture);
          });
        }

      });

      function firePress(key) {

        if(typeof gestureMapping[key] != "undefined") {
          gestureMapping[key].press();
          mote.io.receiver.inputDisplay(gestureMapping[key].icon);
        }

      }

      function fireGesture(json) {

        var div = document.createElement("div")

        date = new Date();

        if(date.getTime() - lastGesture > gestureTimeout) {

          if(json.type == "swipe") {

            if(json.direction[0] > 0) {
              firePress('swipe-right');
            } else {
              firePress('swipe-left');
            }

          }

          if(json.type == "keyTap") {
            firePress('key-tap');
          }

          if(json.type == "screenTap") {
            firePress('screen-tap');
          }

          if(json.type == "circle") {

            if(json.normal[0] > 0) {
              firePress('circle-left');
            } else {
              firePress('circle-right');
            }

          }

          lastGesture = date.getTime();

        }

      }

    } else {
      setTimeout(findRemote, 1000)
    }

  }

  findRemote();

});
