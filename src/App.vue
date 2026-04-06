<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useSystemStore } from '@/stores/index'
import { onMounted } from 'vue';

const store = useSystemStore()

onMounted(() => {
  store.getData()
})
</script>

<template>
  <RouterView />
</template>
