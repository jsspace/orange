const request = require('../request/index.js');

module.exports = {
  // 调用此函数，返回用户信息，没有就会创建
  login: function (callback) {
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        var token = res.data || '';
        if (token) {
          // 根据token拉一遍用户信息，防止token过期
          // 拿code请求token
          callback(null, token)
        } else {
          // 调登录
          that.codeToken(callback)
        }
      },
      fail: function (e) {
        that.codeToken(callback)
      }
    })
  },
  codeToken: function (callback) {
    wxLogin(function (err, code) {
      if (err) {
        callback(err)
        return;
      }
      // 拿code请求token
      request.getTokenWithCode(code, function (err, data) {
        if (err) {
          callback(err)
          return;
        }
        wx.setStorage({
          key: 'token',
          data: data.token,
        })
        callback(null, data.token)
      })
    })
  }
}

function wxLogin(cb) {
  wx.login({
    success: function (res) {
      if (res.code) {
        cb(null, res.code)
      } else {
        cb(-1)
      }
    },
    fail: function (err) {
      cb(err)
    }
  })
}

