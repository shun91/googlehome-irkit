'use strict';

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _credentials = require('../.credentials.json');

var _credentials2 = _interopRequireDefault(_credentials);

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * IRKitの赤外線送信APIを叩く関数
 * @param {string} message 赤外線信号 
 */
const post = (() => {
  var _ref = _asyncToGenerator(function* (message) {
    return yield _requestPromise2.default.post({
      url: 'https://api.getirkit.com/1/messages',
      body: {
        clientkey: _credentials2.default.clientkey,
        deviceid: _credentials2.default.deviceid,
        message
      },
      json: true
    });
  });

  return function post(_x) {
    return _ref.apply(this, arguments);
  };
})();

/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 * 
 * Example input:
 * req.body.message -> {"message": "Hello!"}
 * 
 * Error handling:
 * res.status(400).send('No message defined!');
 * 
 * Misc:
 * 基本的にはExpressと同様のインタフェースとなってるみたい
 */
exports.postIRKit = (() => {
  var _ref2 = _asyncToGenerator(function* (req, res) {
    const op = req.query.op || req.body.op;
    let status = 'ok';
    let details;

    try {
      switch (op) {
        case 'ALL_ON':
          // 全部ON
          yield post(_messages2.default.ROOM_LIGHT_ON);
          yield post(_messages2.default.TV_POWER);
          break;

        case 'ALL_OFF':
          // 全部OFF
          yield post(_messages2.default.ROOM_LIGHT_OFF);
          yield post(_messages2.default.KITCHEN_LIGHT_OFF);
          yield post(_messages2.default.TV_POWER);
          yield post(_messages2.default.AIRCON_OFF);
          break;

        case 'GOOD_NIGHT':
          // 寝る時
          yield post(_messages2.default.ROOM_LIGHT_OFF);
          yield post(_messages2.default.KITCHEN_LIGHT_OFF);
          yield post(_messages2.default.TV_POWER);
          break;

        default:
          if (op in _messages2.default) {
            yield post(_messages2.default[op]);
          } else {
            status = 'ng';
            details = '操作が指定されていないか、値が不正です';
          }
          break;
      }
    } catch (err) {
      status = 'ng';
      details = err;
    }

    res.json({
      status,
      message: status === 'ok' ? '操作が完了しました' : 'エラーが発生しました',
      op,
      details
    });
  });

  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();