import { ref } from 'vue'


export default function useFlowers() {
    let msg = ref('This is Flowers Page')
    return { msg }
}