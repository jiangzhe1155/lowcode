import { computed, reactive, UnwrapRef, watch, watchEffect } from 'vue'
import { useMouse, usePointer } from '@vueuse/core'

export const nodeState = reactive({
  clickedNodeId: '',
  clickedLocation: {
    top: 0,
    width: 0,
    height: 0,
    left: 0
  },
  hoverNodeId: [],
  hoverItemNodeId: '',
  currentHoveredId: computed(() => {
    if (nodeState.hoverItemNodeId.length > 0) {
      return nodeState.hoverItemNodeId
    }
    return nodeState.hoverNodeId[nodeState.hoverNodeId.length - 1]
  }),
  pressNodeId: '',
  pressX: 0,
  pressY: 0,
  isDrag: computed(() => {
    return nodeState.pressNodeId.length > 0 && !(nodeState.pressX === x.value && nodeState.pressY === y.value)
  }),
  dragElementId: null,
  dragDirection: null,
  isShowInsertion: computed(() => {
    if (!nodeState.dragElementId) {
      return false
    }

    // 如果是子元素 不允許
    if (isSubElement(nodeState.pressNodeId, nodeState.dragElementId)) {
      return false
    }

    if (nodeState.dragDirection === 'center') {
      // 如果这个容器已经存在子元素时
      if (elementMap.get(nodeState.dragElementId).children) {
        return false
      }
    }

    // 这个组件的父组件支持这个方向的操作
    let i = elementMap.get(elementMap.get(nodeState.dragElementId).pid).supportDirection.indexOf(nodeState.dragDirection)
    if (i < 0) {
      return false
    }

    return true
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
        children: [
          {
            id: '3',
            pid: '2',
            name: '卡片3',
            type: 'CardComponent',
            level: 2,
            isContainer: false,
            slots: [],
            supportDirection: ['top', 'bottom', 'center'],
          }, {
            id: '4',
            pid: '2',
            name: '卡片4',
            type: 'CardComponent',
            level: 2,
            isContainer: false,
            supportDirection: ['top', 'bottom', 'center'],
            children: [{
              id: '5',
              pid: '4',
              name: '卡片5',
              type: 'CardComponent',
              level: 1,
              isContainer: false,
              slots: [],
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
        slots: [],
      }
    ]
  },
  modelBoxes: []
})

export const elementMap = reactive(new Map())
export const locationMap = reactive(new Map())

const isSubElement = (pressNodeId: string, dragElementId: string) => {
  if (pressNodeId === dragElementId) {
    return true
  }

  let element = elementMap.get(pressNodeId)
  if (element.children) {
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
      build(child, level + 1)
    }
  }
}

const buildElementMap = () => {
  let root = renderPage.root
  build(root, 0)
}

buildElementMap()

export const {
  x,
  y,
  pressure
} = usePointer()

export const nodeStateOnClick = (elementId: string) => {
  nodeState.clickedNodeId = elementId
  nodeState.hoverItemNodeId = ''
}

export function compareLevel (elementId: string, clickedNodeId: string): number {
  let pre = elementMap.get(elementId)
  let next = elementMap.get(clickedNodeId)
  return pre.level - next.level
}

export const nodeStateOnHover = (elementId: string, isHover: boolean) => {
  // console.log(elementId + '\t' + isHover)
  if (!isHover) {
    nodeState.hoverNodeId.pop()
    return
  }
  nodeState.hoverNodeId.push(elementId)
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
    if (e.level <= level) {
      continue
    }
    let {
      left,
      top,
      width,
      height
    } = location[1]
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
  console.log('拖拽中')
  // 获取层级最深 且在指定范围内的元素
  findInArea(x.value, y.value)
}

export const onStartSelect = () => {
  console.log('开始选择')
  nodeState.pressNodeId = nodeState.currentHoveredId
  nodeState.pressX = x.value
  nodeState.pressY = y.value
}

export const onDragEnd = () => {
  console.log('结束拖拽')
  nodeStateOnClick(nodeState.pressNodeId)
  nodeState.pressNodeId = ''
  nodeState.pressX = 0
  nodeState.pressY = 0
}




