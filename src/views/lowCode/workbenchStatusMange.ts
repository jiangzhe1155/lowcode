import { reactive } from 'vue'

export const nodeState = reactive({
  clickedNodeId: ''
})

// export const onclick = (elementId: number) => {
//   elementId
// }

export function onClick (elementId : string) {
  console.log(elementId);
}
