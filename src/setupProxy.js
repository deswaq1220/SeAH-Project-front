const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://172.20.20.252:8081',
      target: 'http://localhost:8081',
      // target: 'http://192.168.202.1:8081',
      pathRewrite: {
        '^/api': '',
      },
    }),
  );
};