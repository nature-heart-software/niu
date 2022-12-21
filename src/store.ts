import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type Page = {
    id: string
    url: string
}

export const useStore = defineStore('main',
    () => {
        const pages = ref<Page[]>([])
        const currentPageId = ref<Page['id'] | null>(null)
        const setCurrentPageId = (id: Page['id'] | null) => {
            currentPageId.value = id
        }
        const currentPage = computed(() => pages.value.find((page) => page.id === currentPageId.value))
        const addPage = (page: Page) => {
            pages.value.push(page)
            setCurrentPageId( page.id)
        }
        const removePage = (id: Page['id']) => {
            const pageIndex = pages.value.findIndex((page) => page.id === id)
            setCurrentPageId(pages.value[pageIndex + 1] ? pages.value[pageIndex + 1].id : pages.value[pageIndex - 1] ? pages.value[pageIndex - 1].id : null)
            pages.value.splice(pageIndex, 1)
        }
        const updatePage = (id: Page['id'], page: Partial<Page>) => {
            const pageIndex = pages.value.findIndex((page) => page.id === id)
            pages.value.splice(pageIndex, 1, { ...pages.value[pageIndex], ...page })
        }
        return {
            pages,
            addPage,
            updatePage,
            removePage,
            currentPage,
            currentPageId,
            setCurrentPageId,
        }
    },
    {
        persist: true,
    },)
