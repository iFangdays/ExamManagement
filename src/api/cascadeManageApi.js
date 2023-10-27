/*
 * @描述信息: 联级
 * @Author:
 */

import http from '@/http/http'

// 获取所有联机
export const getAllCategories = (data) => http.get(`/exam/category/getAllCategories`,data)

// 删除联机 
export const deleteCategory = (data) => http.get(`/exam/category/deleteCategory`,data)

// 新增联级
export const addCategory = (data) => http.post(`/exam/category/addCategory`,data)

// 更新联级 
export const updateCategory = (data) => http.post(`/exam/category/updateCategory`,data)