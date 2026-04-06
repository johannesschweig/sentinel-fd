<script setup lang="ts">
import SkyscraperIcon from '@/assets/skyscraper.svg?component'
import DetectorIcon from '@/assets/detector.svg?component'
import NotificationIcon from '@/assets/notification.svg?component'
import RemoteIcon from '@/assets/remote.svg?component'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {DEVICES, AREAS, REMOTE_CONTROL, NOTIFICATIONS} from '@/utils/index'

const props = defineProps<{
  to: string
  label: string
}>()

const route = useRoute()

const isActive = computed(() => {
  if (props.to === route.path) {
    return true
  }
  if (props.label === AREAS && route.path.includes('/areas')) {
    return true
  }
  if (props.label === DEVICES && route.path.includes('/detector')) {
    return true
  }
  return false
})

const iconStyle = computed(() => {
  if (isActive.value) {
    return {
      '--icon-fill': '#003253', // blau 20
      '--icon-stroke': '#003253', // blau 20
      '--icon-inside': 'white',
    }
  } else {
    return {
      '--icon-fill': 'transparent',
      '--icon-stroke': '#71767C', // grau 50
      '--icon-inside': '#71767C', // grau 50
    }
  }
})

const currentIcon = computed(() => {
  if (props.label === AREAS) {
    return SkyscraperIcon
  } else if (props.label === DEVICES) {
    return DetectorIcon
  } else if (props.label === NOTIFICATIONS) {
    return NotificationIcon
  } else if (props.label === REMOTE_CONTROL) {
    return RemoteIcon
  }
})

const activeClass = computed(() => {
  if (isActive.value) {
    return 'font-bold !text-blau-10'
  }
  return ''
})
</script>

<template>
  <RouterLink :to="to" class="flex-1 py-3 text-sm text-grau-40 focus:outline-none" :class="activeClass">
    <Component :is="currentIcon" class="w-10 h-10 mx-auto mb-1" :style="iconStyle" />
    {{ label }}
  </RouterLink>
</template>
