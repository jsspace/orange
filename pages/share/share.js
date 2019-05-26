// pages/share/share.js
const request = require('../../request/index.js');
const formatTime = require('../../utils/time.js');
var base64 = require("../images/base64");
const appInstance = getApp();
const loginUtil = require('../../utils/login.js');
var getUserNumber = 0;

console.log(appInstance.data);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {},
    hasAuth: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 分享带参数
    wx.showShareMenu({
      withShareTicket: true
    })
    const that = this;
    this.setData({
      timeIcon: base64.timeIcon,
      locationIcon: base64.locationIcon,
      userIcon: base64.userIcon
    });
    loginUtil.login(function (err, token) {
      if (err) {
        
        wx.showToast({
          title: '出错了',
        })
        return;
      }
      console.log(token);
      wx.setStorageSync('token', token)
      that.getActivityDetail(options.id);
      that.getUserInfo(token);
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 获取活动详情
  getActivityDetail: function (id) {
    var that = this;
    var token = wx.getStorageSync('token');
    request.getActivityDetail(token, id, function (err, res) {
      if (err) {
        console.error(err);
        return;
      }
      if (!res.data) {
        if (getUserNumber > 0) return;
        loginUtil.codeToken(function (err, token) {
          if (err) {
            console.log(err);
            return;
          }
          that.getActivityDetail(id);
          that.getUserInfo(token);
          getUserNumber++;
        })
        return;
      }
      // set data
      res.data.startTime = formatTime.formatTime(res.data.startTime);
      res.data.endTime = formatTime.formatTime(res.data.endTime);
      that.setData({
        activity: res.data
      });
    })
  },
  // 获取用户信息
  getUserInfo: function (token) {
    var that = this;
    request.getUserInfo(token, function (err, data) {
      if (err) {
        that.setData({
          hasAuth: false,
        })
        return;
      }

      if (data.data && data.data.user.username) {
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
  signUpActivity: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var data = {
      activityId: this.data.activity.id,
      partQuantity: 1,
      shareType: 0,
      shareId: 0
    };
    request.signUpActivity(token, data, function(err, res) {
      if (err) {
        console.error(err);
      }
     
      wx.showToast({
        title: '报名成功',
        icon: 'success'
      });

    })
  },

  // 用户授权
  updateUserInfo: function (data) {
    const that = this;
    const token = wx.getStorageSync('token');
    if (!token) return;

    request.updateUserInfo(token, data, function (err, data) {
      that.signUpActivity();
    })
  }
})