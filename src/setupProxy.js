const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.221.1:8081',
      // target: 'http://localhost:8081',
      pathRewrite: {
        '^/api': '',
      },
    }),
  );
};