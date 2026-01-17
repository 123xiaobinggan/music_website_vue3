import {ref} from 'vue'


export default function useAbout() {
    let title = ref('微微音乐')
    return { title}
}