import request from 'request-promise';
import credentials from '../.credentials.json';
import MSGS from './messages';

/**
 * IRKitの赤外線送信APIを叩く関数
 * @param {string} message 赤外線信号 
 */
const post = async (message) => {  
  return await request.post({
    url: 'https://api.getirkit.com/1/messages',
    body: {
      clientkey: credentials.clientkey,
      deviceid: credentials.deviceid,
      message,
    },
    json: true,
  });
}

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
exports.postIRKit = async (req, res) => {
  const op = req.query.op || req.body.op;
  let status = 'ok';
  let details;

  try {
    switch (op) {
      case 'ALL_ON': // 全部ON
        await post(MSGS.ROOM_LIGHT_ON);
        await post(MSGS.TV_POWER);
        break;

      case 'ALL_OFF': // 全部OFF
        await post(MSGS.ROOM_LIGHT_OFF);
        await post(MSGS.KITCHEN_LIGHT_OFF);
        await post(MSGS.TV_POWER);
        await post(MSGS.AIRCON_OFF);
        break;

      case 'GOOD_NIGHT': // 寝る時
        await post(MSGS.ROOM_LIGHT_OFF);
        await post(MSGS.KITCHEN_LIGHT_OFF);
        await post(MSGS.TV_POWER);
        break;

      default:
        if (op in MSGS) {
          await post(MSGS[op]);
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
    message: (status === 'ok') ? '操作が完了しました' : 'エラーが発生しました',
    op,
    details,
  });
};
