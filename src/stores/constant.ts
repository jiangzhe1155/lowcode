import { reactive } from 'vue'

export const designerConfig = reactive({
  headerHeight: 50, // 顶部区域的高度
  asideWidth: 60,   // 左侧边栏的固定宽度
  canvasPadding: 20, // 画布的内边距
  dragPanelWidth: 500 as number, //拖拽面板的宽度
})
