import { v4 } from 'uuid'
import { ComponentType, ValueType } from '../../lowCode/service'
import { Column } from '@/components/table/ColumnType'

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
  props: any
}

class ControlConfig {
  supportDirection: Direction[] = ['top', 'bottom', 'center']
  getElement = (id: string, doc: Document): any => {
    return doc.getElementById(id)
  }
  supportGroup: ComponentGroup[] = ['Container', 'Input']
}

export interface ComponentProps {

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

interface OptionIndex {
  [index: string]: any
}

export interface Indexable {
  idx: ValueType,
  options: OptionIndex
}

export class CardProp implements ComponentProps {
  enableHeader = {
    idx: 'boolean' as ValueType,
    options: {
      'boolean': true
    }
  } as Indexable

  title = {
    idx: 'string' as ValueType,
    options: {
      'string': '主标题',
      'variable': '变量'
    }
  } as Indexable
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
  getElement = (id: string, doc: Document): any => {
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

class TableControlConfig extends ControlConfig {
  supportDirection: Direction[] = []
  supportGroup: ComponentGroup[] = []
}

export class Table extends BaseComponent<TableProp> {
  name: string = '表格'
  group: ComponentGroup = 'Input'
  type: ComponentType = 'Table'
  props: TableProp = new TableProp()
  public static controlConfig: ControlConfig = new TableControlConfig()

  constructor (name: string = '表格') {
    super()
    this.name = name
  }
}

export class Button {
  label = '按鈕'
  confirm = false
  type = 'primary'
  onclick = eval('`' + (() => {
    console.log('点击了')
  }).toString() + '`')

  constructor (label: string, confirm: boolean, type?: string) {
    this.label = label
    this.confirm = confirm
    if (type) {
      this.type = type
    }
  }

}

export class OperationButton extends Button {
  constructor (label: string, confirm: boolean, type: string = 'text') {
    super(label, confirm, type)
    this.onclick = eval('`' + (() => {
      console.log('点击了')
    }).toString() + '`')
  }

}

export class ToolbarButton extends Button {
  constructor (label: string, confirm: boolean, type: string = 'primary') {
    super(label, confirm, type)
    this.onclick = eval('`' + (() => {
      console.log('点击了')
    }).toString() + '`')
  }
}

export class TableProp implements ComponentProps {
  columns = {
    idx: 'array' as ValueType,
    options: {
      'array': [
        {
          title: '姓名',
          key: 'name',
          type: 'input',
          hidden: false,
          search: true
        }, {
          title: '性别',
          key: 'sex',
          type: 'input',
          hidden: false,
          search: true
        }
      ] as Column[]
    }
  } as Indexable

  rowData = {
    idx: 'array' as ValueType,
    options: {
      'array': [{
        name: '张三',
        sex: '女'
      },
        {
          name: '李四',
          sex: '男'
        }
      ]
    }
  } as Indexable

  operations = {
    idx: 'array' as ValueType,
    options: {
      'array': [new OperationButton('编辑', false), new OperationButton('刪除', true)]
    }
  } as Indexable

  toolbars = {
    idx: 'array' as ValueType,
    options: {
      'array': [new ToolbarButton('新建', false), new ToolbarButton('批量刪除', true, 'danger')]
    }
  } as Indexable

}
