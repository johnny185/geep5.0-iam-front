//敏感信息-脱敏
import Vue from 'vue';
Vue.filter('replacestar', function (value) {
  if (!value) return '';
  let str = value;
  str = str.replace(new RegExp("[^0-9]+", "g"), "")
  if (str.length == 11) {
    str = str.toString().replace(/(\d{2})\d*(\d{2})/, '$1*******$2')
  } else {
    str = str.toString().replace(/(\d{2})\d*(\d{2})/, '$1*********$2')
  }
  return str;
})