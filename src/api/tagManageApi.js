/*
 * @描述信息: 分类(标签)
 * @Author:
 */

import http from '@/http/http'

// 获取所有问题分类
export const getAllQuestionType = () => http.get(`/exam/type/getAllQuestionType`)

// 更新问题分类
export const updateQuestionType = (data) => http.post('/exam/type/updateQuestionType',data)

// 新增标签信息
export const addQuestionType = (data) => http.post(`/exam//type/addQuestionType`,data)

// 删除标签信息
export const deleteQuestionType = (data) => http.get('/exam//type/deleteQuestionType',data)



// 根据id查询标签信息
export const getLabelsByTypeId = (id) => http.get(`/exam/label/getLabelsByTypeId?typeId=${id}`)

// 更新标签信息
export const updateLabel = (data) => http.post(`/exam/label/updateLabel`,data)

// 新增标签信息
export const addLabel = (data) => http.post(`/exam/label/addLabel`,data)

// 删除标签信息
export const deleteLabel = (data) => http.get('/exam/label/deleteLabel',data)

