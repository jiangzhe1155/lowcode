import { v4 } from 'uuid'

export type Direction = 'top' | 'bottom' | 'center' | 'left' | 'right';

export interface Component {
  id: string,
  pid?: string,
  level?: number,
  name: string,
  type: ComponentType,
  children: Component[],
  supportDirection: Direction[]
  slots: any[],
  visible: boolean,
  getElement: string,
  group: ComponentGroup,
  supportGroup: ComponentGroup[],
  props: any,
  config: {}
}

export type ComponentType = 'CardComponent' | 'RootContainer' | 'PageContainer' | 'DialogComponent';
export type ComponentGroup = 'Input' | 'Container' | 'Model' | 'Root';

export abstract class BaseComponent implements Component {
  id: string = v4()
  pid: string = ''
  name: string = ''
  level?: number
  abstract type: ComponentType
  children: Component[] = []
  supportDirection: Direction[] = ['top', 'bottom', 'center']
  slots = []
  visible = true
  getElement = ((id: string, doc: Document) => {
    return doc.getElementById(id)
  }).toString()
  abstract group: ComponentGroup
  supportGroup: ComponentGroup[] = []
  props = {}
  config = {}
}

export type ValueType = 'boolean' | 'string';

export class Card extends BaseComponent {
  type: ComponentType = 'CardComponent'
  group: ComponentGroup = 'Container'
  supportGroup: ComponentGroup[] = ['Input', 'Container']
  props = {
    openHeader: {
      type: 'boolean' as ValueType,
      value: true
    },
    headerTitle: {
      type: 'string' as ValueType,
      value: '主标题'
    }
  }
  config = {}

  constructor (name: string = '卡片') {
    super()
    this.name = name
  }
}

export class Root extends BaseComponent {
  type: ComponentType = 'RootContainer'
  group: ComponentGroup = 'Root'
  supportGroup: ComponentGroup[] = ['Container', 'Model']

  constructor (name: string = '根节点') {
    super()
    this.name = name
  }
}

export class Page extends BaseComponent {
  type: ComponentType = 'PageContainer'
  group: ComponentGroup = 'Container'
  supportGroup: ComponentGroup[] = ['Container', 'Input']

  constructor (name: string = '页面') {
    super()
    this.name = name
  }
}

export class Dialog extends BaseComponent {
  type: ComponentType = 'DialogComponent'
  group: ComponentGroup = 'Model'
  supportGroup: ComponentGroup[] = ['Container', 'Input']
  visible = true
  getElement = ((id: string, doc: Document) => {
    return doc.getElementById(id)?.firstElementChild?.firstElementChild?.firstElementChild
  }).toString()

  constructor (name: string = '对话框') {
    super()
    this.name = name
  }
}

export class LocationState {
  currentHoverComponent?: { id: string, location: Location | null }
  currentClickComponent?: { id: string, location: Location | null }
  currentPressComponent?: { id: string, location: Location | null }
  currentInsertionComponent?: { id: string, location: Location | null }
  direction?: Direction = undefined
}

export class Location {
  left: number = 0
  top: number = 0
  height: number = 0
  width: number = 0
}
