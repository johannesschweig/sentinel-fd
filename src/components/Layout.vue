<script setup>
import Navbar from './Navbar.vue';
import Menubar from './Menubar.vue';
import Backdrop from '@/assets/backdrop.svg?component'
</script>

<template>
  <div class="relative max-w-lg h-screen max-h-[896px] mx-auto font-bosch font-normal bg-grau-95">
    <div class="grid grid-rows-[72px_1fr_88px] h-full">
      <Navbar class="z-10" />
      <RouterView class="z-10 max-h-[824px]" :class="$route.path === '/' ? 'row-span-2' : ''" />
      <Menubar v-if="$route.fullPath !== '/'" class="z-10" />
      <Backdrop class="absolute pointer-events-none select-none z-0" />
    </div>

    <!-- Modal slot -->
    <RouterView v-slot="{ Component }">
      <transition name="fade">
        <component v-if="Component && $route.path.includes('/arm')" :is="Component" class="absolute inset-0 z-20" />
      </transition>
    </RouterView>
  </div>
</template>