const proxy = require("http-proxy-middleware")

module.exports = function(app) {
    app.use(
        proxy("", {
            target: "https://statsapi.web.nhl.com",
            changeOrigin: true
        })
    );
};