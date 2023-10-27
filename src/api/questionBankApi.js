/*
 * @描述信息: 题库
 * @Author:
 */

import http from '@/http/http'

// 获取所有题目  
export const getAllQuestion = (data) => http.post(`/exam/subject/getAllQuestion`,data)

// 更新题目
export const updateQuestion = data => http.post('/exam/subject/updateQuestion',data)

// 删除题目
export const deleteQuestion = id => http.get('/exam/subject/deleteQuestionById',id)

// 上传题目图片
export const uploadImages = file => http.post('/exam/util/img/upload',file,{headers:{'Content-Type':'multipart/form-data'}})

// 导入题目
export const uploadDataFile = file => http.post('/exam/util/data/upload',file,{headers:{'Content-Type':'multipart/form-data'}})