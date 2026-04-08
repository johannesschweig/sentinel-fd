<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useSystemStore } from '@/stores/index'
import { onMounted } from 'vue';

const store = useSystemStore()

onMounted(() => {
  store.getData()
  // Ping backend to wake it up
  fetch(`${import.meta.env.VITE_API_URL}/api/health`).catch(() => { });
})
</script>

<template>
  <RouterView />
</template>
