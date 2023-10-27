/**
 * 重置message，防止重复点击重复弹出message弹框
 *    案例==>
 *            import msg from '@/utils/resetMessage.js'
 *
 *            msg.success('成功消息')
 *            msg.warning('警告消息')
 *            msg.error('失败消息')
 */
import { ElMessage } from 'element-plus'

const showMessage = Symbol('showMessage')
let messageInstance = null
class DoneMessage {
  [showMessage](type, options, single) {
    if (messageInstance) {
      messageInstance.close()
    }
    messageInstance = ElMessage[type](options)
    if (single) {
      if (document.getElementsByClassName('el-message').length === 0) {
        ElMessage[type](options)
      }
    } else {
      ElMessage[type](options)
    }
  }

  info(options, single = true) {
    this[showMessage]('info', options, single)
  }

  warning(options, single = true) {
    this[showMessage]('warning', options, single)
  }

  error(options, single = true) {
    this[showMessage]('error', options, single)
  }

  success(options, single = true) {
    this[showMessage]('success', options, single)
  }
}
const msg = new DoneMessage()
export default msg
