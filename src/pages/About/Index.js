import {ref} from 'vue'


export default function useAbout() {
    let title = ref('学科实践小组')
    let member = ref([
        { id: 1, name: '胡智超', role: '组长' },
        { id: 2, name: '李东昊', role: '组员' },
        { id: 3, name: '覃冠乔', role: '组员' },
    ])
    return { title,member }
}