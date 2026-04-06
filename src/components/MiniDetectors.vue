<script setup lang="ts">
import { computed } from 'vue'
import { useSystemStore } from '@/stores';
import { detectorTypeLabel } from '@/utils/labels';
import AlertErrorIcon from '@/assets/alert-error.svg?component'

const store = useSystemStore()

const props = defineProps<{
  objectId: number
  areaId?: number
}>()


const preventingDetectors = computed(() => {
  return store.getDetectorsByZone(props.objectId, props.areaId).filter(d => d.status === 'triggered')
})

const areaFromDetector = function (detectorId: number) {
  return store.getAreaNameFromDetector(detectorId)
}
</script>

<template>
  <div class="flex gap-2 flex-col mb-6">
    <div v-for="detector in preventingDetectors"
      class="flex items-center px-2 py-1 bg-purpur-95 border border-purpur-85 rounded-lg">
      <div class="flex-1">
        <span class="text-purpur-10" :title="String(detector.id)"> {{ detectorTypeLabel[detector.type] }}</span>
        <div class="text-xs text-purpur-30 flex gap-1">
          <span>{{ areaFromDetector(detector.id) }}</span>
          <span>•</span>
          <span>{{ detector.location }}</span>
        </div>
      </div>
      <AlertErrorIcon class="w-7 h-7" />
    </div>
  </div>
</template>