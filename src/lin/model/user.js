import store from '@/store'
import _axios, { post, get, put } from '@/lin/plugin/axios'
import { saveTokens } from '../util/token'

export default class User {
  /**
   * 分配用户
   * @param {object} user 注册信息
   */
  static register(data) {
    return post('cms/user/register', data)
  }

  static registerAccount(data, headers) {
    return post('cms/user/account/register', data, {}, headers)
  }
  static async sendPasswordResetCode(data) {
    return await post('cms/user/account/send_password_reset_code', data)
  }

  static async resetPassword(data) {
    return await post('cms/user/account/reset_password', data)
  }

  /**
   * 登陆获取tokens
   * @param { String } username 用户名
   * @param { String } password 密码
   * @param { String } captcha 验证码
   * @param { String } tag 验证码签名
   */
  static async getToken(data, headers) {
    const tokens = await post('cms/user/login', data, {}, headers)
    saveTokens(tokens.access_token, tokens.refresh_token)
    return tokens
  }

  static async logout() {
    const result = await get('cms/user/logout')
    return result
  }
  /**
   * 获取当前用户信息，并返回User实例
   */
  static async getInformation() {
    const info = await get('cms/user/information');
    const storeUser = store.getters.user === null ? {} : store.getters.user
    return Object.assign({ ...storeUser }, info)
  }

  /**
   * 获取当前用户信息和所拥有的权限
   */
  static async getPermissions() {
    const info = await get('cms/user/permissions')
    const storeUser = store.getters.user === null ? {} : store.getters.user
    return Object.assign({ ...storeUser }, info)
  }

  /**
   * 用户修改密码
   * @param {string} newPassword 新密码
   * @param {string} confirmPassword 确认新密码
   * @param {string} oldPassword 旧密码
   */
  // eslint-disable-next-line camelcase
  static updatePassword({ old_password, new_password, confirm_password }) {
    return put('cms/user/change_password', {
      new_password,
      confirm_password,
      old_password,
    })
  }

  static async getUserByUserId(userId) {
    const res = await get(`cms/user/${userId}`)
    return res;
  }

  static async updateProfile(params) {
    return await put('cms/user', params)
  }
  static async getNovices() {
    return await get('cms/user/novices')
  }
}
