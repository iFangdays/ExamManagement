/**
 * 重置notification，防止重复点击重复弹出
 * 具体用法请参照 src/utils/resetMessage.js
 */
import { ElNotification } from 'element-plus'

let notificationInstance = null
const mainNotification = function DoneMessage(options) {
  if (notificationInstance) {
    notificationInstance.close()
  }
  notificationInstance = ElNotification(options)
}
const arr = ['success', 'warning', 'info', 'error']
arr.forEach(function (type) {
  mainNotification[type] = function (options) {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return mainNotification(options)
  }
})

const notification = mainNotification
export default notification
