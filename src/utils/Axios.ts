import { userTokenStore } from '@/stores/stores';
import axios from 'axios';
import {Md5} from 'ts-md5'

  const config = {
    headers:{
      "Access-Control-Allow-Origin": "*",
    }
  };

  const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  // eslint-disable-next-line no-useless-escape
  const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
  export const Btoa = function (string: string) {
      string = String(string);
      let bitmap, a, b, c, result = "",i = 0;
      const rest = string.length % 3;
      for (; i < string.length;) {
        if ((a = string.charCodeAt(i++)) > 255 ||
          (b = string.charCodeAt(i++)) > 255 ||
          (c = string.charCodeAt(i++)) > 255)
          throw new TypeError("Failed to execute 'btoa' on 'Window': contains characters outside of the Latin1 range.");
        bitmap = (a << 16) | (b << 8) | c;
        result += b64.charAt(bitmap >> 18 & 63) + b64.charAt(bitmap >> 12 & 63) +
          b64.charAt(bitmap >> 6 & 63) + b64.charAt(bitmap & 63);
      }
      return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
    };
  
    export const Atob = function (string: string) {
      string = String(string).replace(/[\t\n\f\r ]+/g, "");
      if (!b64re.test(string))
        throw new TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
      string += "==".slice(2 - (string.length & 3));
      let bitmap, result = "",
        r1, r2, i = 0;
      for (; i < string.length;) {
        bitmap = b64.indexOf(string.charAt(i++)) << 18 | b64.indexOf(string.charAt(i++)) << 12 |
          (r1 = b64.indexOf(string.charAt(i++))) << 6 | (r2 = b64.indexOf(string.charAt(i++)));
        result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) :
          r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
            String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
      }
      return result;
  };  

  export function HttpGet(url:string, call:(response:any)=>void){
    axios.get(url, config).then(function (response:any){
        const code = response.data.code 
        if(code == 200){
            const data = response.data.data 
            call(data)
        }else{
            console.log("code:", code, "msg:", response.data.msg)
        }
    }).catch(function (error:any) {
        // handle error
        console.log("Error:", error);
    })
  }

  export function DoAuthPost(apiUrl:string,req:any, call:(response:any)=>void){
    const userToken = userTokenStore()
    axios.post(apiUrl, req, {headers: {'Content-Type': 'application/json','Authorization': userToken.tokens}}).then(function (response:any){
      const code = response.data.code
      if(code == 200){
        const data = response.data.data 
        call(data)
      }else{
        console.log("code:", code, "msg:", response.data.msg)
      }
    }).catch(function (error:any) {console.log("Error:", error);})
  }

  export function DoLogin(name:string, pwd:string, call:(response:any)=>void){
    const apiUrl = 'taiyi/auth/do-login'
    const noice = Date.now().toString(10)
    const md5 = new Md5()
    md5.appendStr(noice).appendStr(pwd)
    const md5Pwd = md5.end()
    const req = {name:name, pwd: md5Pwd, noice: noice}
    axios.post(apiUrl, req, {headers: {'Content-Type': 'application/json'}}).then(function (response:any){
      const code = response.data.code
      if(code == 200){
        const data = response.data.data 
        const token = response.headers.authorization
        const userToken = userTokenStore()
        userToken.setToken(token)
        call(data)
      }else{
        console.log("code:", code, "msg:", response.data.msg, ",md5:", md5Pwd)
      }
    }).catch(function (error:any) {console.log("Error:", error);})
  }