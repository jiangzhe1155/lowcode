
export type ColumnType = 'input'|'select'|'date'|'tag' ;

interface ColumnTypeOption {
  label:string,
  value:ColumnType
}

export interface Column {
  title: string,
  key: string,
  type: ColumnType,
  hidden : boolean,
  search : boolean
}

export const columnTypes:ColumnTypeOption[] = [
  {
    label:'文本',
    value:'input'
  },{
    label:'选择',
    value:'select'
  }
]
