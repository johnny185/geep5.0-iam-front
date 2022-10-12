
// 拦截用户是否存在 不存在跳登录页面
export function checkUser() {
  if (!$nuxt.$store.state.user.userInfo.token) {
    !$nuxt.$router.push({
      path: '/login'
    })
    return false
  }
}
// 手机号 验证
export function telReg(value) {
  return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)
}
// 必须为数字 验证
export function numberReg(value) {
  return /^\d+$|^\d+[.]?\d+$/.test(value)
}
// 必须为正整数 验证
export function positiveNumberReg(value) {
  return /^[0-9]*[1-9][0-9]*$/.test(value)
}
// 密码 6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种'
export function passwordReg(value) {
  return /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/.test(value)
}
//联系人 验证
export function contactsReg(value) {
  return /^[\u0391-\uFFE5A-Za-z]+$/.test(value)
}
// 邮箱 验证
export function emailReg(value) {
  return /^([a-zA-Z0-9._-])+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/.test(value)
  // return /^[a-z|A-Z]{10,40}@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-])$/.test(value)
}
// 身份证 验证
export function regId(value) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
}
// 版本号 验证
export function versionCodeReg(value) {
  // return /^(?![0-9]+$)(?![0-9.]+$)(?![a-zA-Z]+$)(?![a-zA-Z.]+$)[0-9A-Za-z.]{1,20}$/.test(value)
  return /^[A-Za-z]{1,24}_[0-9]{1,4}[.][0-9]{1,2}[.][0-9]{1,2}$/.test(value)
}
//
// 客服电话 验证
export function customerPhone(value) {
  return /^(1[3,5,8,7]{1}[\d]{9})|(((400)-(\d{3})-(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$|^([ ]?)$/.test(value)
  // return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/.test(value)

}
//昵称 验证
export function nickNameReg(value) {
  return /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)
}

// url 验证
export function urlReg(value) {
  return /(http|https):\/\/([\w.]+\/?)\S*/.test(value)
}

export function fullName(value) {
  return /^[\u4e00-\u9fa5A-Za-z]+$/.test(value)
}
export function creditCodeReg(value){
  return /^[A-Za-z0-9]{18}$/.test(value)
}