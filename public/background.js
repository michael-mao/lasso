function init() {
  // add alarm listener
  chrome.alarms.onAlarm.addListener(function(alarm) {
    var upcomingOutings = [];
    var now = Date.now();

    chrome.storage.sync.get('outings', function(data) {
      var outings = data.outings;
      if (!outings || !outings.length) {
        return;
      }

      outings.forEach(function(outing) {
        outingTime = getTimeStamp(outing.time);
        timeUntilOuting = outingTime - now;
        if (timeUntilOuting >= 0 && timeUntilOuting <= 600000 && !outing.reminderSent) { // 10 min
          upcomingOutings.push(outing.name);
          outing.reminderSent = true;
          chrome.runtime.sendMessage({message: 'updateOuting', data: outing}, function(response) {
            console.log(response);
          });
        }
      });

      if (upcomingOutings.length) {
        // TODO: improve to send one reminder for all outings at same time
        upcomingOutings.forEach(function(outingName) {
          sendOutingReminder(outingName);
        });
      }
    });
  });

  chrome.alarms.create('checkOutings', {
    delayInMinutes: 0.2,
    periodInMinutes: 0.2
  });
}

function sendOutingReminder(outingName) {
  chrome.notifications.clear('outingReminder');
  console.log('cleared notification');

  chrome.notifications.create('outingReminder', {
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Outing Reminder',
    message: outingName + ' is coming up!'
  }, function(notificationId) {
    console.log('created notification');
  });
}

function getTimeStamp(timeStr) {
  // return Date object with today's date and provided time
  // timeStr format is 24H, ie. "18:00"
  var t = timeStr.split(":");
  var hours = parseInt(t[0]);
  var minutes = parseInt(t[1]);
  var today = new Date();
  return today.setHours(hours, minutes);
}

window.onload = function() {
  // init();
  setTimeout(init, 1000);
};