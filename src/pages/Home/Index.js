import { ref } from 'vue'

export default function useHome() {
  let msg = ref('This is Home Page')

  return { msg }
}


