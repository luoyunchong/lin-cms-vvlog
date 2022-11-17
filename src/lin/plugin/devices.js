
import { createVNode, render } from "vue";
function getDeviceState(indicator) {
  switch(parseInt(window.getComputedStyle(indicator).getPropertyValue('z-index'), 10)) {
      case 2:
          return 'small-desktop';
          break;
      case 3:
          return 'tablet';
          break;
      case 4:
          return 'phone';
          break;
      default:
          return 'desktop';
          break;
  }
}
let mountNode = null;
export default () => {
  //确保只存在一个弹框，如果前一个弹窗还在，就移除
  if (mountNode) {
    return getDeviceState(mountNode)
  }
  var myInstance = {};
  //创建一个空的div
  mountNode = document.createElement("div");
  mountNode.className = 'state-indicator';
  document.body.appendChild(mountNode);
  return getDeviceState(mountNode)
}
