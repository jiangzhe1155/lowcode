import { v4 } from 'uuid'

export interface Component {
  id: string,
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
  getBoundingRect: (id: string, doc: Document) => HTMLElement | null = (id: string, doc: Document) => {
    return doc.getElementById(id)
  }
}

interface ComponentProps {

}

export type ComponentGroup = 'Input' | 'Container' | 'Model' | 'Root';

export type Direction = 'top' | 'bottom' | 'center' | 'left' | 'right';

abstract class BaseComponent<T extends ComponentProps> implements Component {
  id: string = v4()
  abstract group: ComponentGroup
  abstract name: string
  children: Component[] = []
  level: number = 0
  visible: boolean = false
  lock: boolean = false
  abstract props: T
}

class CardProp implements ComponentProps {
  title = {
    selectType: '',
    options: []
  }
}

class CardControlConfig extends ControlConfig {
}

export class Card extends BaseComponent<CardProp> {
  name: string = '卡片'
  group: ComponentGroup = 'Container'
  props: CardProp = new CardProp()
  public static controlConfig: ControlConfig = new CardControlConfig()
}

console.log('controlConfig', Card.controlConfig)
