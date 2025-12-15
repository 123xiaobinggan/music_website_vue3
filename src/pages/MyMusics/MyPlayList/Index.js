import { ref } from 'vue'

export default function useMyPlayList() {
  let msg = ref('This is My PlayList Page')

  return { msg }
}