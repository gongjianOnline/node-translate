import * as https from "https";
import * as querystring from "querystring";
import md5 = require("md5");
import {appId, appSecret} from "./private";

export const tarnslate = (word) => {
  const salt = Math.random();
  console.log(appId,
    word,
    salt,
    appSecret);
  const sign = md5(appId + word + salt + appSecret);
  console.log("打印秘钥");
  console.log(sign);

  //查询字符串模块
  const query: string = querystring.stringify({
    q: word,
    from: 'en',
    to: 'zh',
    appid: appId,
    salt: salt,
    sign: sign,
  });

  //https模块
  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET'
  };
  const request = https.request(options, (response) => {
    let chunks = [];
    response.on('data', (chunk) => {
      chunks.push(chunk);
    });
    response.on('end', (e) => {
      let data = Buffer.concat(chunks).toString();
      type BaiduResult = {
        error_code?: string,
        error_msg?: string,
        from: string,
        to: string,
        trans_result: {
          src: string,
          dst: string
        }[]
      }
      const object: BaiduResult = JSON.parse(data);
      console.log(object.trans_result[0].dst);
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
};
