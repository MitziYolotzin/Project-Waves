

const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api/product/brands', { target: 'http://localhost:3002' }));
  //app.use(proxy('/api/users/login', { target: 'http://localhost:3002' }));
  //app.use(proxy('/api/users/dashboard', { target: 'http://localhost:3002' }));
};

