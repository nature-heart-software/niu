<template>
  <div class="flex justify-center pt-12 relative">
    <div class="background absolute inset-0">
      <img :src="`https://picsum.photos/1920/1080?q=${id}`" class="w-full h-full object-cover opacity-10">
    </div>
    <div class="input-wrapper relative">
      <img :src="googleLogo" class="w-[24px] h-[24px]">
      <input ref="searchRef" type="text" v-model="searchInput" @keydown.enter="createPage" placeholder="Search"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { onMounted, ref } from 'vue'
import googleLogo from '@/assets/google_g_logo.svg'

const id = ref(Math.random())
const searchInput = ref('')
const store = useStore()
const searchRef = ref<HTMLInputElement>()
const isValidURL = (str: string) => {
  let pattern = new RegExp('^((https?:)?\\/\\/)?'+ // protocol
      '(?:\\S+(?::\\S*)?@)?' + // authentication
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locater
  return pattern.test(str);
}

const search = (string: string) => {
  return `https://www.google.com/search?q=${string}`;
}

const createPage = () => {
  store.addPage({
    id: Date.now().toString(),
    url: isValidURL(searchInput.value) ? searchInput.value : search(searchInput.value),
  })
}
onMounted(() => {
  searchRef.value?.focus()
})
</script>


<style scoped lang="scss">
.input-wrapper {
  display: inline-flex;
  height: 40px;
  background-color: white;
  border: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding-left: 16px;
  padding-right: 16px;
  width: 40%;
  min-width: 300px;
  //&:hover {
  //  background-color: #f5f5f5;
  //}
  //&:active {
  //  background-color: #e5e5e5;
  //}
  input {
    flex: 1;
    height: 100%;
    &:focus {
      outline: none;
    }

  }
}
// Colors
$bg-color: hsl(256,33,10);
$dot-color: hsl(256,33,70);

// Dimensions
$dot-size: 1px;
$dot-space: 10px;

.background {
  background:
      linear-gradient(90deg, $bg-color ($dot-space - $dot-size), transparent 1%) center,
      linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center,
      $dot-color;
  background-size: $dot-space $dot-space;
}
</style>
