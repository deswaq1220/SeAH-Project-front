const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://172.20.10.43:8081',
       //target: 'http://localhost:8081',
      pathRewrite: {
        '^/api': '',
      },
    }),
  );
};