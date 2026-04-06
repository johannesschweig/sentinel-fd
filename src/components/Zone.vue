<script lang="ts" setup>
import type { ZoneIconStatus } from '@/utils/types'
import { computed } from 'vue'
import ArmIcon from '@/components/ArmIcon.vue'
import { useSystemStore } from '@/stores';

const store = useSystemStore()
const props = withDefaults(
  defineProps<{
    id: number
    type: string
    name: string
    status: ZoneIconStatus
    detectors?: boolean // whether you can navigate to detectors or not
  }>(),
  {
    detectors: true
  })

const cardClass = computed(() => {
  return 'bg-white text-grau-15'
})
</script>

<template>
  <component :is="props.detectors ? 'RouterLink' : 'div'" :to="type === 'object'
    ? `/object/${id}/detectors`
    : `/object/${store.getObjectIdFromArea(id)}/area/${id}/detectors`"
    class="rounded-2xl px-4 py-3 flex items-center justify-between" :class="[
      props.detectors && 'shadow-base hover:shadow-elevated transition-shadow duration-200',
      cardClass
    ]">
    <span class="text-xl">{{ props.name }}</span>
    <span class="flex items-center gap-1">
       <ArmIcon :status="props.status" :link="type === 'object'
        ? `/object/${id}/arm`
        : `/object/${store.getObjectIdFromArea(id)}/area/${id}/arm`" />
    </span>
  </component>
</template>