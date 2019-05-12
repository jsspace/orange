exports.formatTime = function (time, style) {
  var date = new Date(time);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minutes = date.getMinutes();

  if (style === '-') {
    return [year, month, day].map(toStr).join('-')
  }
  return [hour, minutes].map(toStr).join(':')
}

function toStr (n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}