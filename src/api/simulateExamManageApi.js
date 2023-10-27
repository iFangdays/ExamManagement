/*
 * @描述信息: 真题考试
 * @Author:
 */

import http from '@/http/http'

// 获取所有真题
export const getSimulateExam = (data) => http.post(`/exam/exam/getSimulateExam`,data)

// 更新新增真题
export const addAndUpdateExam = data => http.post('/exam/exam/updateSimulateExam',data)

// 删除真题
export const deleteSimulateExam = data => http.get('/exam/exam/deleteSimulateExam',data)