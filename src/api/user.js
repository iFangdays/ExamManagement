/*
 * @描述信息: 用户
 * @Author:
 */

import http from '@/http/http'

// 获取所有用户列表
export const getAllUsers = (data) => http.get(`/exam/user/getUser`,data)

// 获取所有角色列表
export const getAllRole = () => http.get(`/exam/user/getRole`)

// 新增用户
export const addUser = (data) => http.post(`/exam/user/addUser`,data)

// 更新用户
export const updateUserRoleStatus = (data) => http.get(`/exam/user/updateUserRoleStatus`,data)

// 修改用户状态
export const handleUser = (data) => http.post(`/exam/user/handleUser`,data)

// 登录
export const loginIn = data => http.post('/exam/login/manage/login',data) 

// 登出
export const loginOut = () => http.get('/exam/login/loginOut') 
