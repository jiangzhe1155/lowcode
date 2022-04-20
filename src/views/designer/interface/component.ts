import { v4 } from 'uuid'
import { ComponentType, ValueType } from '@/views/lowCode/service'

export interface Component {
  id: string,
  pid: string
  type: ComponentType
  group: ComponentGroup,
  name: string
  level?: number,
  children: Component[],
  visible: boolean,
  lock: boolean,
  props: {}
}

class ControlConfig {
  supportDirection: Direction[] = ['top', 'bottom', 'center']
  getElement: (id: string, doc: Document) => any = (id: string, doc: Document) => {
    return doc.getElementById(id)
  }
  supportGroup: ComponentGroup[] = ['Container', 'Input']
}

interface ComponentProps {

}

export type ComponentGroup = 'Input' | 'Container' | 'Model' | 'Root';

export type Direction = 'top' | 'bottom' | 'center' | 'left' | 'right';

abstract class BaseComponent<T extends ComponentProps> implements Component {
  id: string = v4()
  pid: string = ''
  abstract type: ComponentType
  abstract group: ComponentGroup
  abstract name: string
  children: Component[] = []
  level: number = 0
  visible: boolean = true
  lock: boolean = false
  abstract props: T
}

export interface ComponentValue {
  valueType: ValueType,
  value: any
}

export interface Indexable  {
  [index: string]: any
}

export class CardProp implements ComponentProps {
  enableHeader = {
    idx: 'boolean' as ValueType,
    options: {
      'boolean': false
    } as Indexable
  }

  title = {
    idx: 'string' as ValueType,
    options: {
      'string': '主标题'
    } as Indexable
  }
}

class CardControlConfig extends ControlConfig {

}

export class Card extends BaseComponent<CardProp> {
  name: string = '卡片'
  group: ComponentGroup = 'Container'
  type: ComponentType = 'Card'
  props: CardProp = new CardProp()
  public static controlConfig: ControlConfig = new CardControlConfig()

  constructor (name: string = '卡片') {
    super()
    this.name = name
  }
}

class DialogProp implements ComponentProps {

}

class DialogControlConfig extends ControlConfig {
  getElement: (id: string, doc: Document) => any = (id: string, doc: Document) => {
    return doc.getElementById(id)?.firstElementChild?.firstElementChild?.firstElementChild
  }
}

export class Dialog extends BaseComponent<DialogProp> {
  name: string = '对话框'
  type: ComponentType = 'Dialog'
  group: ComponentGroup = 'Model'
  props: DialogProp = new DialogProp()
  public static controlConfig: DialogControlConfig = new DialogControlConfig()

  constructor (name: string = '对话框') {
    super()
    this.name = name
  }
}

class RootProp implements ComponentProps {

}

class RootControlConfig extends ControlConfig {

}

export class Root extends BaseComponent<RootProp> {
  name: string = '根节点'
  type: ComponentType = 'Root'
  group: ComponentGroup = 'Root'
  props: RootProp = new RootProp()
  supportGroup: ComponentGroup[] = ['Container', 'Model']

  public static controlConfig: RootControlConfig = new RootControlConfig()

  constructor (name: string = '根节点') {
    super()
    this.name = name
  }
}

class PageProp implements ComponentProps {

}

class PageControlConfig extends ControlConfig {

}

export class Page extends BaseComponent<PageProp> {
  name: string = '页面'
  type: ComponentType = 'Page'
  group: ComponentGroup = 'Container'
  props: PageProp = new PageProp()
  public static controlConfig: PageControlConfig = new PageControlConfig()

  constructor (name: string = '页面') {
    super()
    this.name = name
  }
}

let c: Map<ValueType, any> = new Map<ValueType, any>([['boolean', false]])
