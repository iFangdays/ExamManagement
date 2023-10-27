/*
 * @描述信息: 推荐策略
 * @Author:
 */

import http from '@/http/http'


// 获取所有策略
export const getAllConfigs = (data) => http.post(`/exam/config/getAllConfigs`,data)

// 更新/新增策略
export const updateQuestionType = (data) => http.post('/exam/config/updateConfig',data)

// 删除策略 
export const deleteConfigById = (id) => http.get('/exam/config/deleteConfigById',id)