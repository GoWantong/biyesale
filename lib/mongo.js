const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');


const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: (results) => {
    results.forEach((item) => {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },
  afterFindOne: (result) => {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  },
});


exports.Admin = mongolass.model('Admin', {
  name: { type: 'string' },
  password: { type: 'string' },
  avatar: { type: 'string' },
  gender: { type: 'string', enum: ['m', 'f', 'x'] },
  bio: { type: 'string' },
});
exports.Admin.index({ name: 1 }, { unique: true }).exec(); // 根据用户名找到用户，用户名全局唯一


exports.Goods = mongolass.model('Goods', {
  author: { type: Mongolass.Types.ObjectId },
  name: { type: 'string' },
  desc: { type: 'string' },
  price: { type: 'number' },
  cover: { type: 'string' },
  remain: { type: 'number' },
});
exports.Goods.index({ author: 1, _id: -1 }).exec(); // 按录入时间降序查看商品
