import {
  computed,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRaw,
  watchEffect
} from 'vue'
import { v4 } from 'uuid'
import mitt from 'mitt'

export const emitter = mitt()

function findInElementArea (x: number, y: number, e: any) {
  let location = locationMap.get(e.id)
  if (!location) {
    return null
  }

  let {
    left,
    top,
    width,
    height
  } = location

  if (e.children?.length > 0) {
    for (let child of e.children) {
      let res = findInElementArea(x, y, child)
      if (res && res.length > 0) {
        return res
      }
    }
  }

  if (x >= left && x <= left + width && y >= top && y <= top + height) {
    return e
  }
  return null
}

export const nodeState = reactive({
  hoverInfo: [],
  currenHoverInfo: computed(() => {
    return nodeState.hoverInfo[nodeState.hoverInfo.length - 1]
  }),
  clickedNodeId: '',
  clickLocation: computed(() => {
    return locationMap.get(nodeState.clickedNodeId)
  }),
  hoverNodeId: [],
  hoverItemNodeId: '',
  currentHoveredId: computed(() => {
    let elementId = undefined
    let level = -1
    let x_ = x.value - 80
    let y_ = y.value - 70
    for (let location of locationMap) {
      // 如果是对话框并且打开了
      let e = elementMap.get(location[0])
      let {
        left,
        top,
        width,
        height
      } = location[1]

      if (!e) {
        continue
      }

      if (e.type === 'DialogComponent' && e.visible && width > 0) {
        let element = findInElementArea(x_, y_, e)
        console.log('找到最终',e.id)
        if (element){
          elementId = element.id
        }
        break
      }

      if (e.level <= level) {
        continue
      }

      if (x_ >= left && x_ <= left + width && y_ >= top && y_ <= top + height) {
        elementId = e.id
        level = e.level
      }
    }

    return elementId
    // if (nodeState.hoverItemNodeId.length > 0) {
    //   return nodeState.hoverItemNodeId
    // }
    // return nodeState.hoverNodeId[nodeState.hoverNodeId.length - 1]
  }),
  hoverLocation: computed(() => {
    return locationMap.get(nodeState.currentHoveredId)
  }),
  pressNodeId: '',
  pressX: 0,
  pressY: 0,
  isDrag: computed(() => {
    return (nodeState.pressNodeId?.length > 0 || nodeState.pressTypeId?.length > 0) && !(nodeState.pressX === x.value && nodeState.pressY === y.value)
  }),
  dragElementId: null,
  dragDirection: null,
  dragLocation: computed(() => {
    return locationMap.get(nodeState.dragElementId)
  }),
  isShowInsertion: computed(() => {
    if (!nodeState.isDrag || !nodeState.dragElementId) {
      return false
    }

    // 如果是子元素 不允許
    if (isSubElement(nodeState.pressNodeId, nodeState.dragElementId)) {
      return false
    }

    if (nodeState.dragDirection === 'center') {
      // 如果这个容器已经存在子元素时
      if (elementMap.get(nodeState.dragElementId).children.length > 0) {
        return false
      }
    }

    // 这个组件的父组件支持这个方向的操作
    let pElement = elementMap.get(elementMap.get(nodeState.dragElementId).pid)
    if (!pElement) {
      return false
    }
    let i = pElement.supportDirection.indexOf(nodeState.dragDirection)
    if (i < 0) {
      return false
    }
    return true
  }),
  asideHoverType: '',
  pressTypeId: '',
  currentCursorName: computed(() => {
    if (nodeState.pressNodeId.length > 0) {
      return elementMap.get(nodeState.pressNodeId).name
    }
    if (nodeState.pressTypeId.length > 0) {
      return nodeState.pressTypeId
    }
  })
})

export const renderPage = reactive({
  root: {
    id: '1',
    pid: '',
    name: '根节点',
    type: 'RootContainer',
    slots: [],
    level: 0,
    isContainer: true,
    supportDirection: ['top', 'bottom', 'center'],
    visible: true,
    children: [
      {
        id: '2',
        pid: '1',
        name: '通用页面容器',
        type: 'PageContainer',
        slots: [],
        level: 1,
        isContainer: true,
        supportDirection: ['top', 'bottom', 'center'],
        visible: true,
        children: [
          {
            id: '3',
            pid: '2',
            name: '卡片3',
            type: 'CardComponent',
            level: 2,
            isContainer: false,
            children: [],
            slots: [],
            supportDirection: ['top', 'bottom', 'center'],
            visible: true,
          }, {
            id: '4',
            pid: '2',
            name: '卡片4',
            type: 'CardComponent',
            level: 2,
            isContainer: false,
            supportDirection: ['top', 'bottom', 'center'],
            visible: true,
            children: [{
              id: '5',
              pid: '4',
              name: '卡片5',
              type: 'CardComponent',
              level: 3,
              isContainer: false,
              supportDirection: ['top', 'bottom', 'center'],
              children: [],
              slots: [],
              visible: true,
            }],
            slots: [],
          }
        ]
      }, {
        id: '6',
        pid: '1',
        name: '卡片6',
        type: 'CardComponent',
        level: 1,
        isContainer: false,
        supportDirection: ['top', 'bottom', 'center'],
        children: [],
        slots: [],
        visible: true,
      }, {
        id: '8',
        pid: '1',
        name: '對話框',
        type: 'DialogComponent',
        level: 1,
        isContainer: true,
        supportDirection: ['top', 'bottom', 'center'],
        children: [],
        slots: [],
        visible: true,
      }
    ]
  },
  modelBoxes: []
})

watchEffect(()=>{
  window.parent.postMessage(
    {
      type: 'renderPageChange',
      renderPage: toRaw(renderPage).root
    }, '*')
})

export const elementMap = reactive(new Map())
export const locationMap = reactive(new Map())

const isSubElement = (pressNodeId: string, dragElementId: string) => {

  if (pressNodeId === dragElementId) {
    return true
  }

  let element = elementMap.get(pressNodeId)
  if (element && element.children) {
    for (let child of element.children) {
      if (isSubElement(child.id, dragElementId)) {
        return true
      }
    }
  }

  return false
}

const build = (root, level: number): void => {
  root.level = level
  elementMap.set(root.id, root)
  if (root.children && root.children.length > 0) {
    for (let child of root.children) {
      child.pid = root.id
      build(child, level + 1)
    }
  }
}

const buildElementMap = () => {
  let root = renderPage.root
  console.log('重载',root)
  elementMap.clear()
  build(root, 0)

  window.parent.postMessage(
    {
      type: 'elementMapChange',
      elementMap: toRaw(elementMap)
    }, '*')
}

buildElementMap()

export const x = ref(0)
export const y = ref(0)

export const nodeStateOnClick = (elementId: string) => {
  // console.log('点击', elementId)
  nodeState.clickedNodeId = elementId
  nodeState.hoverItemNodeId = ''
}

export function compareLevel (elementId: string, clickedNodeId: string): number {
  let pre = elementMap.get(elementId)
  let next = elementMap.get(clickedNodeId)
  return pre.level - next.level
}

export const nodeStateOnHover = (element: any, isHover: boolean, location: any) => {
  // console.log(elementId + '\t' + isHover)
  if (!isHover) {
    nodeState.hoverNodeId.pop()
    return
  }
  nodeState.hoverNodeId.push(element.id)
}

export const nodeStateOnHoverItem = (elementId: string, isHover: boolean) => {
  if (!isHover) {
    if (elementId === nodeState.hoverItemNodeId && !isHover) {
      nodeState.hoverItemNodeId = ''
    }
    return
  }
  nodeState.hoverItemNodeId = elementId
}

function fetchDirection (x: number, y: number, targetLocation: any) {
  let {
    left,
    top,
    width,
    height
  } = targetLocation

  let halfWidth = width / 5
  let halfHeight = height / 5

  let left_ = x - left
  let right_ = left + width - x
  let top_ = y - top
  let bottom_ = top + height - y

  // 离那边最近
  if (left_ <= halfWidth) {
    if (top_ <= halfHeight) {
      return (left / halfWidth < top_ / halfHeight) ? 'left' : 'top'
    }

    if (bottom_ <= halfHeight) {
      return (left / halfWidth < bottom_ / halfHeight) ? 'left' : 'bottom'
    }
    return 'left'
  }

  if (right_ <= halfWidth) {
    if (top_ <= halfHeight) {
      return (right_ / halfWidth < top_ / halfHeight) ? 'right' : 'top'
    }

    if (bottom_ <= halfHeight) {
      return (right_ / halfWidth < bottom_ / halfHeight) ? 'right' : 'bottom'
    }
    return 'right'
  }

  if (top_ <= halfHeight) {
    if (left_ <= halfWidth) {
      return (left_ / halfWidth < top_ / halfHeight) ? 'left' : 'top'
    }

    if (right_ <= halfWidth) {
      return (right_ / halfWidth < top_ / halfHeight) ? 'right' : 'top'
    }
    return 'top'
  }

  if (bottom_ <= halfHeight) {
    if (left_ <= halfWidth) {
      return (left_ / halfWidth < bottom_ / halfHeight) ? 'left' : 'bottom'
    }

    if (right_ <= halfWidth) {
      return (right_ / halfWidth < bottom_ / halfHeight) ? 'right' : 'bottom'
    }
    return 'bottom'
  }
  return 'center'
}

function findInArea (x: number, y: number) {
  let elementId = null
  let level = -1
  let targetLocation = null
  for (let location of locationMap) {
    let e = elementMap.get(location[0])
    let {
      left,
      top,
      width,
      height
    } = location[1]

    if (!e) {
      continue
    }

    if (e.type === 'DialogComponent' && e.visible && width > 0) {
      if (x >= left && x <= left + width && y >= top && y <= top + height) {
        let element = findInElementArea(x,y,e);
        elementId = element.id
        level = element.level
        targetLocation = locationMap.get(elementId)
      }
      break
    }

    if (e.level <= level) {
      continue
    }

    if (x >= left && x <= left + width && y >= top && y <= top + height) {
      elementId = e.id
      level = e.level
      targetLocation = location[1]
    }
  }

  if (elementId) {
    nodeState.dragElementId = elementId
    // 获取位置的具体方向
    nodeState.dragDirection = fetchDirection(x, y, targetLocation)
  }
}

export const onDrag = () => {
  // 获取层级最深 且在指定范围内的元素
  console.log('移動中')
  findInArea(x.value - 80, y.value - 70)
}

export const onStartSelect = () => {
  // console.log('开始选择')
  nodeState.pressX = x.value
  nodeState.pressY = y.value
}

export function move (pressNodeId: string, dragElementId: string, dragDirection: string) {
  let element = elementMap.get(pressNodeId)
  let pElement = elementMap.get(element.pid)
  let i = pElement.children.indexOf(element)
  pElement.children.splice(i, 1)

  let dragElement = elementMap.get(dragElementId)
  if (dragDirection === 'center') {
    dragElement.children.push(element)
    element.level = dragElement.level + 1
    element.pid = dragElement.id
  } else {
    let newParentElement = elementMap.get(dragElement.pid)
    element.level = newParentElement.level + 1
    element.pid = newParentElement.id

    let j = newParentElement.children.indexOf(dragElement)
    let shift = 0
    if (dragDirection === 'bottom' || dragDirection === 'right') {
      shift = 1
    }
    if (j + shift >= newParentElement.children.length) {
      newParentElement.children.push(element)
    } else {
      newParentElement.children.splice(j + shift, 0, element)
    }
  }
  buildElementMap()
}

export const onCopy = (elementId: string) => {
  console.log('复制', elementId)
  let element = elementMap.get(elementId)

  function doCopy (element: any) {
    let target = Object.assign({}, element)
    target.id = v4()
    target.children = target.children.map(e => doCopy(e))
    return target
  }

  let res = doCopy(element)
  res = JSON.parse(JSON.stringify(res))
  let pElement = elementMap.get(element.pid)
  let i = pElement.children.indexOf(element)
  if (i + 1 >= pElement.children.length) {
    pElement.children.push(res)
  } else {
    pElement.children.splice(i + 1, 0, res)
  }
  buildElementMap()
  locationMap.clear()
  emitter.emit('onUpdateElement')
  return res.id
}

onMounted(() => {
  const { proxy } = getCurrentInstance() as any
})

export const onDelete = (elementId: string) => {
  console.log('删除', elementId)
  let element = elementMap.get(elementId)
  let pElement = elementMap.get(element.pid)
  let i = pElement.children.indexOf(element)
  pElement.children.splice(i, 1)
  nodeState.clickedNodeId = ''
  buildElementMap()
  locationMap.clear()
  emitter.emit('onUpdateElement')
}

export function add (pressTypeId: string, dragElementId: string, dragDirection: string) {
  console.log('添加')
  let element = {
    id: v4(),
    name: '卡片',
    level: 0,
    pid: '',
    type: 'CardComponent',
    isContainer: false,
    children: [],
    slots: [],
    visible: true,
    supportDirection: ['top', 'bottom', 'center']
  }

  let dragElement = elementMap.get(dragElementId)
  if (dragDirection === 'center') {
    dragElement.children.push(element)
    element.level = dragElement.level + 1
    element.pid = dragElement.id
  } else {
    let newParentElement = elementMap.get(dragElement.pid)
    element.level = newParentElement.level + 1
    element.pid = newParentElement.id

    let j = newParentElement.children.indexOf(dragElement)
    let shift = 0
    if (dragDirection === 'bottom' || dragDirection === 'right') {
      shift = 1
    }
    if (j + shift >= newParentElement.children.length) {
      newParentElement.children.push(element)
    } else {
      newParentElement.children.splice(j + shift, 0, element)
    }
  }

  buildElementMap()
  locationMap.clear()
  emitter.emit('onUpdateElement')
  return element.id
}

export const onDragEnd = () => {
  if (nodeState.isShowInsertion) {
    if (nodeState.pressNodeId.length > 0) {
      nodeState.iframeWin.postMessage({
        type: 'elementMove',
        info: {
          pressNodeId: nodeState.pressNodeId,
          dragElementId: nodeState.dragElementId,
          dragDirection: nodeState.dragDirection
        }
      }, '*')
    } else if (nodeState.pressTypeId.length > 0) {
      nodeState.iframeWin.postMessage({
        type: 'elementAdd',
        info: {
          pressNodeId: nodeState.pressNodeId,
          dragElementId: nodeState.dragElementId,
          dragDirection: nodeState.dragDirection
        }
      }, '*')
    }
  } else {
    nodeStateOnClick(nodeState.dragElementId)
  }

  nodeState.pressNodeId = ''
  nodeState.pressX = 0
  nodeState.pressY = 0
  nodeState.dragElementId = ''
  nodeState.dragDirection = ''
  nodeState.pressTypeId = ''
}




