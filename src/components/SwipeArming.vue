<script setup lang="ts">
import ArmedIcon from '@/assets/armed.svg?component'
import ForwardRightIcon from '@/assets/forward-right.svg?component'
import { useDraggable } from '@vueuse/core'
import { useTemplateRef, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSystemStore } from '@/stores'
import { sendMessage } from '@/mqtt'
import { bgFromPercent } from '@/utils/index'
import AnimatedArmIcon from './AnimatedArmIcon.vue'

const props = defineProps<{
  reverse?: boolean
}>()

const store = useSystemStore()
const route = useRoute()
const router = useRouter()
const knob = useTemplateRef<HTMLElement>('knob')
const track = useTemplateRef<HTMLElement>('track')

let bounds = { min: 0, max: 0 }

const { x, y, style } = useDraggable(knob, {
  axis: 'x',
  initialValue: { x: 0, y: 0 },
  preventDefault: true,
  onMove: (pos) => {
    // Clamp inside bounds
    x.value = Math.min(Math.max(pos.x, bounds.min), bounds.max)
    const percentage = (x.value - bounds.min) / (bounds.max - bounds.min)
    store.swipeProgress = percentage
  },
  onEnd: () => {
    if (x.value < bounds.max) {
      const start = x.value
      const end = bounds.min
      const duration = 200
      const startTime = performance.now()

      function easeInOut(t: number) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      }

      function step(time: number) {
        const elapsed = time - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = easeInOut(progress)
        x.value = start + (end - start) * eased
        const percentage = (x.value - bounds.min) / (bounds.max - bounds.min)
        store.swipeProgress = percentage

        if (progress < 1) requestAnimationFrame(step)
      }

      requestAnimationFrame(step)
    } else { // arm when swiped to the end
      const objectId = Number(route.params.objectId)
      const areaId = Number(route.params.areaId)
      const targetState = props.reverse ? 'disarmed' : 'armed'
      var areas: number[] = []
      if (areaId) {
        areas = areas.concat([areaId])
      } else {
        areas = areas.concat(store.getAreasByObject(objectId).filter(a => a.armState !== targetState).map(a => a.id))
      }
      for (const area of areas) {
        sendMessage(area.toString(), targetState)
      }
      router.back()
    }
  }
})

onMounted(() => {
  const trackRect = track.value?.getBoundingClientRect()
  const knobRect = knob.value?.getBoundingClientRect()
  // set inital position
  store.swipeProgress = 0
  if (knobRect && trackRect) {
    x.value = trackRect.left
    y.value = trackRect.top

    bounds.min = x.value
    bounds.max = x.value + trackRect.width - knobRect.width - 20 // 20 for margin
  }
})

const swipeBgStyle = computed(() => {
  if (props.reverse) {
    return `background-color: ${bgFromPercent(store.swipeProgress, [0, 50, 83, 1.0], [239, 241, 242, 1.0])}`
  }
  return `background-color: ${bgFromPercent(store.swipeProgress, [239, 241, 242, 1.0], [0, 50, 83, 1.0])}`
})
</script>

<template>
  <div ref="track" class="rounded-full flex justify-end" :style="swipeBgStyle">
    <div ref="knob" class="cursor-grab bg-white p-5 rounded-full m-2 flex items-center justify-center" :style="style"
      style="position: fixed">
      <AnimatedArmIcon class="w-9 h-9" :percent="store.swipeProgress" :reverse="props.reverse" />
    </div>
    <div class="flex w-1/2 justify-center items-center">
      <ForwardRightIcon class="w-8 h-8 text-grau-20" />
      <ForwardRightIcon class="w-8 h-8 text-grau-40" />
      <ForwardRightIcon class="w-8 h-8 text-grau-60" />
    </div>
    <div class="p-5 rounded-full m-2 flex items-center justify-center">
      <ArmedIcon class="w-9 h-9 text-grau-50" />
    </div>
  </div>
</template>
