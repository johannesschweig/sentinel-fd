<script lang="ts" setup>
import { useSystemStore } from '@/stores';
import type { DetectorData } from '@/utils/types';
import ForwardRightIcon from '@/assets/forward-right.svg?component'
import { germanStatusMap, detectorTypeLabel } from '@/utils/labels';
import DetectorIcon from '@/components/DetectorIcon.vue';
import { classStatusMap } from '@/utils';
import { computed } from 'vue'
import { useRoute } from 'vue-router'


const props = defineProps<{
  detector: DetectorData
}>()

const store = useSystemStore()
const route = useRoute()

const area = computed(() => store.data.areas.find(a => a.detectorIds.includes(props.detector.id)))
const objectId = computed(() => {
  if (area.value) return store.getObjectIdFromArea(area.value.id)
  const paramObj = Number(route.params.objectId)
  return Number.isNaN(paramObj) ? null : paramObj
})

const areaFromDetector = function(detectorId: number) {
  return store.getAreaNameFromDetector(detectorId)
}

const routeTo = computed(() => ({
  name: 'detector-detail',
  params: {
    objectId: objectId.value !== null && objectId.value !== undefined ? String(objectId.value) : String(route.params.objectId || ''),
    areaId: area.value ? String(area.value.id) : String(route.params.areaId || ''),
    detectorId: String(props.detector.id)
  }
}))
</script>

<template>
  <RouterLink :to="routeTo" class="bg-white p-3 rounded-lg shadow-base hover:shadow-elevated transition-shadow grid grid-cols-[40px_1fr_24px] gap-2" :title="detector.id">
    <DetectorIcon :type="detector.type" :status="detector.status || 'unknown'" />
    <div>
      <div class="flex gap-4 mb-1">
        <span class="text-grau-15" :title="String(detector.id)"> {{ detectorTypeLabel[detector.type] }}</span>
        <span class="text-xs font-bold px-2 py-1 rounded-lg" :class="classStatusMap[detector.status || 'unknown']">
          {{ germanStatusMap[props.detector.status || 'unknown'] }}
        </span>
      </div>
      <div class="text-xs text-grau-30 flex gap-1">
        <span>{{ areaFromDetector(detector.id) }}</span>
        <span>•</span>
        <span>{{ detector.location }}</span>
      </div>
    </div>
    <ForwardRightIcon class="w-6 h-6 text-grau-50" />
  </RouterLink>
</template>