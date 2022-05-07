export type Direction = 'top' | 'bottom' | 'center' | 'left' | 'right';
export type ComponentType = 'Card' | 'Root' | 'Page' | 'Dialog' | 'Table';
export type ComponentGroup = 'Input' | 'Container' | 'Model' | 'Root';

export type ValueType = 'boolean' | 'string' | 'variable' | 'array';

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
