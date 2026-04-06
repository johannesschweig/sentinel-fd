<script setup>
import CallIcon from '@/assets/call.svg?component'
</script>

<template>
  <div class="relative p-6 mx-6 mb-4">
    <!-- Background -->
    <div class="rounded-2xl absolute inset-0 bg-[url('@/assets/bosch-supergraphic-rgb.svg?component')] bg-cover bg-center opacity-20 pointer-events-none"> </div>
    <!-- Border: TODO -->
    <!-- <div class="rounded-2xl absolute inset-0 border-[3px] border-transparent [mask-image:url('@/assets/bosch-supergraphic-rgb.svg')] [mask-size:cover] [mask-repeat:no-repeat]"> </div> -->
    <!-- Content -->
    <div class=" flex flex-col items-start">
      <span class="text-lg text-blau-10 mb-3">Probleme? Rufen sie uns an.</span>
      <div class="flex items-center gap-2">
        <CallIcon class="w-12 h-12" />
        <div class="flex flex-col gap-1">
          <span class="text-lg font-blau-10">Bosch AI Leitstelle</span>
          <span class="text-sm text-blau-20">0391 59081988</span>
        </div>
      </div>
    </div>
  </div>
</template>