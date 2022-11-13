

import Preview from '@/component/base/preview/preview'
import { createVNode, render } from "vue";

let mountNode = null;
export default (options) => {
  //确保只存在一个弹框，如果前一个弹窗还在，就移除
  if (mountNode) {
    document.body.removeChild(mountNode);
    mountNode = null;
  }
  var myInstance = {};
  myInstance.data = options.images || []
  myInstance.imageIndex = options.index || 0
  myInstance.options = options.defaultOpt || {}
  myInstance.onClose = function () {
    document.body.removeChild(mountNode);
    mountNode = null;
  }
  const app = createVNode(Preview, myInstance);
  //创建一个空的div
  mountNode = document.createElement("div");
  //render函数的作用就是将Notice组件的虚拟DOM转换成真实DOM并插入到mountNode元素里
  render(app, mountNode);
  //然后把转换成真实DOM的Notice组件插入到body里
  document.body.appendChild(mountNode);
}
