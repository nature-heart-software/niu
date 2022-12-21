<template>
  <div class="w-full h-full" v-show="page.id === currentPageId">
    <webview ref="webviewRef" :src="page.url" class="w-full h-full"/>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '../store'
import WebviewTag = Electron.WebviewTag

const props = defineProps({
  pageId: {
    type: String,
    required: true
  }
})
const store = useStore()
const { pages, currentPageId } = storeToRefs(store)
const page = computed(() => pages.value.find(page => page.id === props.pageId))
const webviewRef = shallowRef<WebviewTag>()

onMounted(() => {
  webviewRef.value?.addEventListener('did-navigate', (event) => {
    store.updatePage(props.pageId, {url: event.url})
  })
})
</script>
