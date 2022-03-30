import { computed, reactive } from 'vue'
import { useMouse } from '@vueuse/core'

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
  })
})

export const renderPage = reactive({
  root: {
    id: '1',
    name: '根节点',
    type: 'RootContainer',
    slots: [],
    level: 0,
    children: [
      {
        id: '2',
        name: '通用页面容器',
        type: 'PageContainer',
        slots: [],
        level: 1,
        children: [
          {
            id: '3',
            name: '卡片1',
            type: 'CardComponent',
            level: 2,
            slots: [],
          }, {
            id: '4',
            name: '卡片2',
            type: 'CardComponent',
            level: 2,
            slots: [],
          }
        ]
      },{
        id: '5',
        name: '卡片3',
        type: 'CardComponent',
        level: 1,
        slots: [],
      }
    ]
  },
  modelBoxes: []
})

export const elementMap = reactive(new Map())
export const locationMap = reactive(new Map())

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
  sourceType
} = useMouse({ touch: false })

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
  console.log(elementId + '\t' + isHover)
  if (!isHover) {
    // if (elementId === nodeState.hoverNodeId && !isHover) {
    //   nodeState.hoverNodeId = ''
    // }
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




