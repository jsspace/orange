// pages/share/share.js
const request = require('../../request/index.js');
const formatTime = require('../../utils/time.js');
var base64 = require("../images/base64");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      timeIcon: base64.timeIcon,
      locationIcon: base64.locationIcon,
      userIcon: base64.userIcon
    });
    this.getActivityDetail(options.id);
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
    id = 10033;
    var that = this;
    var token = wx.getStorageSync('token');
    request.getActivityDetail(token, id, function (err, res) {
      if (err) {
        console.error(err);
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
      console.log(res);
      wx.showToast({
        title: '报名成功',
        icon: 'success'
      })
    })
  }
})