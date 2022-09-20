// 设置 token
export function setToken(data) {
  return sessionStorage.setItem("token", data);
}
// 获取 token
export function getToken() {
  return sessionStorage.getItem("token");
}
// 删除 token
export function removeToken() {
  return sessionStorage.removeItem("token");
}
export function setusername(data) {
  return sessionStorage.setItem("username", data);
}

export function removeUserInfo() {
  return sessionStorage.removeItem('userInfo')
}