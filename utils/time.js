exports.formatTime = function (time, style) {
  var date = new Date(time);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minutes = date.getMinutes();

  const style1 = [year, month, day].map(toStr).join('-');
  const style2 = [hour, minutes].map(toStr).join(':');
  const style3 = [style1, style2].join(' ');
  switch(style) {
    case '-': {
      return style1;
    }
    case ':': {
      return style2;
    }
  }
  return style3;
}

function toStr (n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

exports.getIOSTime = function (timeStr) {
  return timeStr.replace(/\-/g, '/');
}