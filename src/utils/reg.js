/*
 * @描述信息: 常用正则校验
      使用==> import reg from '@/utils/reg'
              const rules = reactive({
                name: [{ required: true, validator: reg('name'), trigger: 'blur' }],
              })
 */

// 正整数校验
export const intNum = {
  reg: /^[1-9]\d*$/,
  err: '请输入正整数'
}

// 非负整数校验
export const zeroIntNum = {
  reg: /(^\d$)|(^[1-9]\d+$)/,
  err: '请输入非负整数'
}

// 金额校验(最多保留两位小数)
export const decimalNum = {
  reg: /^([1-9]\d*|0)(\.\d{1,2})?$/,
  err: '请输入两位小数以内的数字'
}

// 身份证校验
export const idNum = {
  reg: /(^[1-9]\d{7}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$)|(^[1-9]\d{5}[1-3]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(\d{3}[\dXx])$)/,
  err: '请输入正确的身份证号'
}

// 手机号校验
export const phone = {
  reg: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
  err: '请输入正确的手机号'
}

// 姓名校验
export const userName = {
  reg: /^[\u4e00-\u9fa5]{2,10}$/,
  err: '请输入2-10位的汉字'
}

// 名称校验
export const name = {
  reg: /^[\u4e00-\u9fa5A-z0-9]{1,20}$/,
  err: '请输入1-20位的汉字、英文、数字'
}

// 描述信息校验
export const textName = {
  reg: /^[\u4E00-\u9FA5A-Za-z0-9，。,.!·？?/+=@￥$-]{1,100}$/,
  err: '描述信息格式错误，不可输入特殊字符'
}

// IP校验
export const IP = {
  reg: /((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))$/,
  err: 'IP格式错误，请重新输入'
}

// 登录账号校验
export const loginName = {
  reg: /^(?!.*admin)[0-9a-zA-Z_]{2,15}$/,
  err: '账号由2到15位数字/字母/下划线组成，不能包含admin'
}

// 登录密码校验
export const loginPwd = {
  reg: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?_-])(?!.*admin)[a-zA-Z\d~!@#$%^&*?_-]{8,18}$/,
  err: '必须包含大小写字母、数字、个别特殊字符、长度8-18位，不能包含admin'
}

const regs = { intNum, zeroIntNum, decimalNum, idNum, phone, userName, name, textName, IP, loginName, loginPwd }

/*
  校验函数
    入参==> name校验名称    str没有数据时的提示文字
    返参==> 校验函数
*/
export default function reg(name, str = '请输入内容') {
  const data = Object.entries(regs).find(arr => {
    if (arr[0] === name) return arr[1]
  })
  if (!data) {
    console.error(`名称为--${name}--的校验函数未找到，请至utils/reg.js文件中查阅`)
    return
  }
  return (rule, value, callback) => {
    if (rule.required) {
      if (!value) {
        callback(new Error(str))
      } else if (!data[1].reg.test(value)) {
        callback(new Error(data[1].err))
      } else {
        callback()
      }
    } else {
      if (value && !data[1].reg.test(value)) {
        callback(new Error(data[1].err))
      } else {
        callback()
      }
    }
  }
}
