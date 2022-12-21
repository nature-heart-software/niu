<template>
  <div class="flex">
    <NiNavigation class="w-[48px] h-screen"/>
    <div class="flex-1 h-screen">
      <template v-for="page in pages">
        <div class="w-full h-full" v-show="page.id === currentPageId">
          <webview :src="page.url" class="w-full h-full"/>
        </div>
      </template>
      <template v-if="!currentPageId">
        <NiNewPage class="w-full h-full" />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import NiNavigation from './components/NiNavigation.vue'
import NiNewPage from './components/NiNewPage.vue'
import { useStore } from './store'
import { storeToRefs } from 'pinia'

const store = useStore()
const {pages, currentPageId} = storeToRefs(store)
</script>
