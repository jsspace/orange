const HOST = 'https://webfem.com';

// 用code换token
const getTokenWithCode = function (code, cb) {
  wx.request({
    url: `${HOST}/orange/login`,
    method: 'POST',
    dataType: 'json',
    data: {
      code,
    },
    success: function (res) {
      if (res.data.code === 0) {
        cb(null, res.data.data);
      } else {
        cb(res.data.code)
      }
    },
    fail: function (err) {
      cb(err)
    }
  })
}

// 取用户所有activity
const getActivityList = function (token, callback) {
  wx.request({
    url: `${HOST}/orange/activity/`,
    header: {
      token,
    },
    success: function (res) {
      callback(null, res.data);
    }
  })
}

// 创建活动
const createActivity = function (token, data, callback) {
  wx.request({
    url: `${HOST}/orange/activity`,
    header: {
      token,
    },
    method: 'POST',
    data,
    success: function (res) {
      callback(null, res.data);
    }
  })
}

module.exports = {
  getTokenWithCode,
  getActivityList,
  createActivity,
}