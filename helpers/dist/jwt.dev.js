"use strict";

var _require = require("express-jwt"),
    expressjwt = _require.expressjwt;

function authJwt() {
  var secret = process.env.secret;
  var api = process.env.API_URL;
  return expressjwt({
    secret: secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked
  }).unless({
    path: [{
      url: /\/api\/v1\/products(.*)/,
      methods: ["GET", "OPTIONS"]
    }, {
      url: /\/public\/uploads(.*)/,
      methods: ["GET", "OPTIONS"]
    }, {
      url: /\/api\/v1\/categories(.*)/,
      methods: ["GET", "OPTIONS"]
    }, {
      url: /\/api\/v1\/users(.*)/,
      methods: ["GET", "OPTIONS"]
    }, {
      url: /\/api\/v1\/users(.*)/,
      methods: ["PUT", "OPTIONS"]
    }, /\/api\/v1\/users\/cart(.*)/, /\/api\/v1\/orders(.*)/, /\/api\/v1\/payment(.*)/, /\/api\/v1\/reviews(.*)/, "".concat(api, "/razorpaykey"), "".concat(api, "/capturerazorpay"), "".concat(api, "/users/login"), "".concat(api, "/users/register")]
  });
}

function isRevoked(req, token) {
  return regeneratorRuntime.async(function isRevoked$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (token.payload.isAdmin) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", true);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = authJwt;