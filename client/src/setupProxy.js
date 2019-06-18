const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api/product/brands', { target: 'http://localhost:3002' }));
};