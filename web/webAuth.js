import cookie from 'react-cookie';

module.exports = {
  getToken: function() {
    return localStorage.token
  },

  logout: function(cb) {
    delete localStorage.token
    if (cb) {
      cb()
    }
    // this.onChange(false)
  },

  loggedIn: function() {
    // console.log('is logged in', !!localStorage.token);
  },

  onChange: function() {

  }

}