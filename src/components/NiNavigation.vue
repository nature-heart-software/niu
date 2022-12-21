<template>
  <nav class="nav flex flex-col gap-3">
    <button type="button" @click="store.setCurrentPageId(null)">
      <el-icon :size="12"><Plus /></el-icon>
    </button>
    <template v-for="page in pages">
      <button type="button" @click="store.setCurrentPageId(page.id)" @click.right="store.removePage(page.id)">
        <img class="w-[16px] h-[16px]" :src="`https://www.google.com/s2/favicons?sz=16&domain_url=${page.url}`">
      </button>
    </template>
  </nav>
</template>

<script setup lang="ts">
import {Plus} from '@element-plus/icons-vue'
import { useStore } from '@/store'
import { storeToRefs } from 'pinia'

const store = useStore()
const { pages } = storeToRefs(store)
</script>

<style scoped lang="scss">
  .nav {
    width: 56px;
    background-color: white;
    padding: 12px;
    border-right: 1px solid #e5e5e5;
    button {
      width: 32px;
      height: 32px;
      background-color: white;
      border: none;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        background-color: #f5f5f5;
      }
      &:active {
        background-color: #e5e5e5;
      }
    }
  }
</style>
