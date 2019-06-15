// pages/share/share.js
const request = require('../../request/index.js');
const formatTime = require('../../utils/time.js');
const base64 = require('../images/base64');
const loginUtil = require('../../utils/login.js');

const appInstance = getApp();
let getUserNumber = 0;
let signing = false;

var showTimes = 0;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activity: {},
    hasAuth: false,
    inQueue: false,
    userHeader: false,
    queueList: [],
    noActivity: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 自定义header
    this.setCustomHeader();
    // 分享带参数
    wx.showShareMenu({
      withShareTicket: true
    });

    const that = this;
    const activityId = options.id;
    this.setData({
      timeIcon: base64.timeIcon,
      locationIcon: base64.locationIcon,
      userIcon: base64.userIcon,
      activityId,
    });
    loginUtil.login(function(err, token) {
      if (err) {
        wx.showToast({
          title: '出错了',
        })
        return;
      }


      that.getActivityDetail(activityId);
      that.checkUserInQueue(activityId);
      // that.getQueuesInActivity(activityId);
      that.getUserInfo(token);
    })
  },

  handleGoIndex: function() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (showTimes > 0) {
      that.getActivityDetail(this.data.activityId);
    }
    showTimes++;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 自定义header
  setCustomHeader: function() {
    const btnInfo = wx.getMenuButtonBoundingClientRect();
    const wxVersion = wx.getSystemInfoSync().version;

    if (wxVersion >= '7.0.0') {
      this.setData({
        userHeader: true,
        headerHeight: btnInfo.bottom,
      });
    }
  },

  // 获取活动的所有报名
  getQueuesInActivity: function(activityId) {
    const that = this;
    const token = wx.getStorageSync('token');
    request.getQueuesInActivity(token, activityId, function(err, res) {
      if (err || res.code !== 0) return;
      that.setData({
        queueList: res.data,
      });
    })
  },

  // 获取活动详情
  getActivityDetail: function(id) {
    const that = this;
    const token = wx.getStorageSync('token');
    request.getActivityDetail(token, id, function(err, res) {
      if (err || res.code !== 0 || !res.data) {
        that.setData({
          noActivity: true,
        })
        return;
      };
      // set data
      res.data.startTime = formatTime.formatTime(res.data.startTime);
      res.data.endTime = formatTime.formatTime(res.data.endTime);
      that.setData({
        activity: res.data
      });
    })
  },
  // 获取用户信息
  getUserInfo: function(token) {
    var that = this;
    const activityId = that.data.activityId;
    request.getUserInfo(token, function(err, data) {
      if (err) return;
      // 防止多次循环请求
      if (getUserNumber > 1) return;

      // 用户登录失效
      if (data.code !== 0) {
        getUserNumber++;
        loginUtil.codeToken(function(err, token) {
          if (err) return;
          that.getActivityDetail(activityId);
          that.checkUserInQueue(activityId);
          // that.getQueuesInActivity(activityId);
          that.getUserInfo(token);
        })
      }

      // 有数据且有头像
      if (data.data && data.data.username) {
        that.setData({
          hasAuth: true,
        })
        return;
      }
      that.setData({
        hasAuth: false,
      })
    })
  },

  // 报名
  signUpActivity: function() {
    if (signing) return;
    var that = this;
    var token = wx.getStorageSync('token');
    var data = {
      activityId: this.data.activity.activityId,
      partQuantity: 1,
      shareType: 0,
      shareId: 0
    };
    request.signUpActivity(token, data, function(err, res) {
      signing = false;
      if (err) {
        console.error(err);
      }

      wx.showToast({
        title: '报名成功',
        icon: 'success'
      });
      that.getActivityDetail(that.data.activityId)

      that.setData({
        queueId: res.data.partId,
        inQueue: true,
      });
    })
  },

  // 用户授权
  updateUserInfo: function(data) {
    const that = this;
    const token = wx.getStorageSync('token');
    if (!token) return;

    request.updateUserInfo(token, data, function(err, data) {
      that.signUpActivity();
    })
  },

  // 取消报名确认
  confirmCancelQueue: function() {
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消此活动？',
      success: function(res) {
        if (res.confirm) {
          that.deleteQueue();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 删除报名
  deleteQueue: function() {
    const that = this;
    const token = wx.getStorageSync('token');
    request.deleteQueue(token, this.data.queueId, function(err, res) {
      if (err || res.code !== 0) {
        wx.showToast({
          title: '取消活动失败',
        });
        return;
      }
      that.checkUserInQueue(that.data.activityId)
      that.getActivityDetail(that.data.activityId)
    })
  },

  // 检查是否参见活动
  checkUserInQueue: function(activityId) {
    const token = wx.getStorageSync('token');
    const that = this;
    if (!activityId) return;

    request.checkUserInQueue(token, activityId, function(err, res) {
      if (err) {
        return;
      }
      if (res.data && res.data.length) {
        that.setData({
          inQueue: true,
          queueId: res.data[0].partId,
        });
      } else {
        that.setData({
          inQueue: false,
        });
      }
    })
  }
})