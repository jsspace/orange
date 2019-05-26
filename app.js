App({
  data: {
    ticket: 'aaa'
  },
  onLaunch: function () {
    console.log('app launch');
  },
  onShow: function (e) {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false
  }
});
