<script setup lang="ts">
import type { Notification } from '@/utils/types';
import DetectorIcon from '@/components/DetectorIcon.vue';
import { useSystemStore } from '@/stores';
import { computed } from 'vue';
import { detectorTypeLabel } from '@/utils/labels';
import { formatTime } from '@/utils'
import SirenIcon from '@/assets/siren.svg?component';
import ArmIcon from '@/components/ArmIcon.vue';

const store = useSystemStore()

const props = defineProps<{
  notification: Notification
}>()

const detector = computed(() => store.data.detectors.find(d => d.id === props.notification.id))
const area = computed(() => {
  switch (props.notification.type) {
    case 'DETECTOR_TRIGGERED':
    case 'DETECTOR_TAMPER':
      return store.getAreaNameFromDetector(props.notification.id)
    case 'ALARM':
      return store.data.areas.find(a => a.id === props.notification.id)?.name
    case 'ARMING':
      return store.data.areas.find(a => a.id === props.notification.id)?.name
    default:
      return undefined
  }
})

const Icon = computed(() => {
  switch (props.notification.type) {
    case 'DETECTOR_TRIGGERED':
    case 'DETECTOR_TAMPER':
      return DetectorIcon
    case 'ALARM':
      return SirenIcon
    case 'ARMING':
      return ArmIcon
    default:
      return null
  }
})

const iconProps = computed(() => {
  switch (props.notification.type) {
    case 'DETECTOR_TRIGGERED':
      return { type: detector.value?.type || 'unknown', status: 'triggered' }
    case 'DETECTOR_TAMPER':
      return { type: detector.value?.type || 'unknown', status: 'tamper' }
    case 'ARMING':
      return { status: props.notification.status }
    default:
      return {}
  }
})

const title = computed(() => {
  switch (props.notification.type) {
    case 'DETECTOR_TRIGGERED':
      return 'Gerät ausgelöst'
    case 'DETECTOR_TAMPER':
      return 'Gerät manipuliert'
    case 'ALARM':
      return 'Alarm'
    case 'ARMING':
      return `${props.notification.status === 'armed' ? 'Scharf' : 'Unscharf'} geschaltet`
    default:
      return ''
  }
})

const description = computed(() => {
  switch (props.notification.type) {
    case 'DETECTOR_TRIGGERED':
    case 'DETECTOR_TAMPER':
      return `${detectorTypeLabel[detector.value?.type || 'unknown']} in ${area.value || ''} (${detector.value?.location || ''})`
    case 'ALARM':
      return area.value || ''
    case 'ARMING':
      return `${area.value || ''} ist jetzt ${props.notification.status === 'armed' ? 'scharf' : 'unscharf'}`
    default:
      return ''
  }
})
</script>

<template>
  <div class="shadow bg-white rounded-2xl p-4 w-full" :class="notification.type === 'ALARM' ? 'border border-rot-40' : ''" :title="notification.id.toString()">
    <div class="flex gap-4">
      <component v-if="Icon" :is="Icon" v-bind="iconProps" class="w-10 h-10" />
      <div class="w-full">
        <div class="flex items-center justify-between w-full mb-1">
          <span class="text-grau-15 text-xl">{{ title }}</span>
          <span class="text-grau-30 text-sm">{{ formatTime(notification.time) }}</span>
        </div>
        <div class="text-grau-30">{{ description }}</div>
      </div>
    </div>
  </div>
</template>