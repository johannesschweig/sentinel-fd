<script lang="ts" setup>
import { useSystemStore } from '@/stores';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import Detector from '@/components/Detector.vue';
import { DEVICES } from '@/utils';

const store = useSystemStore()
const route = useRoute()
const selectedFilter = ref('Alle')

const detectors = computed(() => {
  const objectId = Number(route.params.objectId)
  const areaId = Number(route.params.areaId)
  return store.getDetectorsByZone(objectId, areaId)
})

const activeClass = function (tag: string) {
  switch (tag) {
    case 'Alle':
      return tag === selectedFilter.value
        ? 'text-white bg-grau-20 font-bold hover:bg-grau-30'
        : 'text-grau-15 bg-white hover:bg-grau-90 border border-grau-20'
    case 'Ausgelöst':
      return tag === selectedFilter.value
        ? 'text-white bg-purpur-20 font-bold hover:bg-purpur-30'
        : 'text-purpur-10 bg-white hover:bg-purpur-90 border border-purpur-20'
    case 'Sabotage':
      return tag === selectedFilter.value
        ? 'text-white bg-gelb-30 font-bold hover:bg-gelb-40'
        : 'text-gelb-10 bg-white hover:bg-gelb-90 border border-gelb-30'
    case 'Ruhe':
      return tag === selectedFilter.value
        ? 'text-white bg-blau-20 font-bold hover:bg-blau-30'
        : 'text-blau-15 bg-white hover:bg-blau-90 border border-blau-20'
    case 'Abgeschaltet':
      return tag === selectedFilter.value
        ? 'text-white bg-grau-40 font-bold hover:bg-grau-50'
        : 'text-grau-15 bg-white hover:bg-grau-90 border border-grau-20'
  }
}

const filteredDetectors = computed(() => {
  if (selectedFilter.value === 'Alle') {
    return detectors.value
  } else if (selectedFilter.value === 'Ausgelöst') {
    return detectors.value.filter(detector => detector.status === 'triggered')
  } else if (selectedFilter.value === 'Sabotage') {
    return detectors.value.filter(detector => detector.status === 'tamper')
  } else if (selectedFilter.value === 'Ruhe') {
    return detectors.value.filter(detector => detector.status === 'idle')
  } else if (selectedFilter.value === 'Abgeschaltet') {
    return detectors.value.filter(detector => detector.status === 'deactivated')
  }
  return detectors.value
})
</script>

<template>
  <div class="m-6 overflow-y-scroll overflow-x-hidden">
    <!-- Filter -->
    <div class="flex gap-1 flex-nowrap mb-4">
      <button v-for="tag in ['Alle', 'Ausgelöst', 'Sabotage', 'Ruhe']"
        class="text-sm rounded-2xl px-4 py-2 whitespace-nowrap cursor-pointer" :class="activeClass(tag)"
        @click="selectedFilter = tag">
        {{ tag }}
      </button>
    </div>
    <!-- Detectors -->
    <div v-if="filteredDetectors.length" class="flex flex-col gap-2">
      <Detector v-for="detector in filteredDetectors" :key="detector.id" :detector="detector" />
    </div>
    <div v-else class="text-grau-30 text-center mt-20">
      Keine {{ DEVICES }} gefunden.
    </div>
  </div>
</template>