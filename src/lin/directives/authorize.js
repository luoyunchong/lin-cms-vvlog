import Vue from 'vue'
import store from '@/store'

function isAllowed(_auth, user, permissions) {
  if (user.isSuper) {
    return true
  }
  if (typeof _auth === 'string') {
    return permissions.includes(_auth)
  } if (_auth instanceof Array) {
    return _auth.some(permission => permissions.indexOf(permission) >= 0)
  }
  return false
}


Vue.directive('permission', {
  bind(el, binding) {
    let permission
    let type
    if (Object.prototype.toString.call(binding.value) === '[object Object]') {
      permission = binding.value.permission
      type = binding.value.type
    } else {
      permission = binding.value
    }
    const isAllow = isAllowed(permission, (store.state.user || {}), store.state.permissions)
    const element = el
    if (!isAllow && permission) {
      if (type) {
        element.disabled = true
        element.style.opacity = 0.4
        element.style.cursor = 'not-allowed'
      } else {
        element.style.display = 'none'
      }
    }
  },
})

export default Vue.directive('permission')
