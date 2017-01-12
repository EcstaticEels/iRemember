module.exports = {
  getToken: function() {
    return localStorage.getItem('userId');
  },

  logout: function() {
    localStorage.removeItem('userId');
    if (!!localStorage.getItem('setup')) {
      localStorage.removeItem('setup');
    }
  },

  loggedIn: function() {
    return !!localStorage.getItem('userId');
  },

  needSetup: function() {
    return !!localStorage.getItem('setup');
  }

}