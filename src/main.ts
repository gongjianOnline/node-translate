import * as https from "https";
import * as querystring from "querystring";
import md5 = require("md5");
import {appId, appSecret} from "./private";
type ErrorMap = {
  [k:string]: string
}
const errorMap: ErrorMap = {
  52003: '用户认证失败',
  54001: '签名错误',
  54004: '余额不足'
};


export const tarnslate = (word:string) => {
  const salt = Math.random();
  const sign = md5(appId + word + salt + appSecret);
  let from, to;
  if (/[a-zA-Z]/.test(word[0])) {
    // 英译汉
    console.log("英译汉")
    from = "en";
    to = "zh";
  } else {
    //汉译英
    console.log("汉译英")
    from = "zh";
    to = "en";
  }

  //查询字符串模块
  const query: string = querystring.stringify({
    q: word,
    from: from,
    to: to,
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
    let chunks: Buffer[] = [];
    response.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    response.on('end', () => {
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
      console.log(object)
      if(object.error_code){
        if (object.error_code in errorMap) {
          console.error(errorMap[object.error_code] || object.error_msg);
          process.exit(2); //关掉进程(参数随意)
        }
      }else {
        console.log("这是啥'")
        console.log(object.trans_result[0].dst);
        process.exit(0); //关掉进程(参数随意)
      }
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
};
