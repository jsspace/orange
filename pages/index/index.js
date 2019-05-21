const loginUtil = require('../../utils/login.js');
const request = require('../../request/index.js');
const formatTime = require('../../utils/time.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasAuth: true,
    activityList: [],
  },

  /**
   * 生命周期函数--监听页面ß加载
   */
  onLoad: function(options) {
    var that = this;
    loginUtil.login(function(err, token) {
      if (err) {
        console.log(err);
        return;
      }
      request.getActivityList(token, function(err, res) {
        if (err) {
          console.log(err);
          return;
        }
        const list = res.data.forEach(function (item) {
          item.startTime = formatTime.formatTime(item.startTime)
        })
        that.setData({
          activityList: res.data
        });
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  gotoCreate: function() {
    wx.navigateTo({
      url: '/pages/create/create',
    })
  },
  gotoDetail: function(e) {
    // 分享按钮不跳转
    if (e.target.dataset.id !== undefined) {
      return;
    }
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },
  handleGetUserInfo: function(e) {
    console.log(e);
  },
  // 分享
  onShareAppMessage: function(e) {
    console.log(e.target.dataset.id);
    const activityId = e.target.dataset.id;
    const activityTitle = e.target.dataset.title;
    return {
      title: activityTitle,
      path: 'pages/shared/shared?id=' + activityId
    }
  }
})