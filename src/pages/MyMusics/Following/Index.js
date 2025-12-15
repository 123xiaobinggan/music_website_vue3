import {ref} from 'vue'



export default function useFollowing() {
    let msg = ref('This is Following Page')
    return { msg }
}