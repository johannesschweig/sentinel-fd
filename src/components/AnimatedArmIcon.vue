<script setup lang="ts">
import { computed } from 'vue'
import { bgFromPercent } from '@/utils';

const props = defineProps<{
  percent: number
  reverse?: boolean
}>()

const strokeFromPercent = computed(() => {
  if (props.reverse) {
    return `${24 + ((1 - props.percent) * 6)} 50`
  }
  return `${24 + (props.percent * 6)} 50`
})

type RGBA = [number, number, number, number];
const GRAU_30 = [67, 70, 74]
const BLAU_20 = [0, 50, 83]
const WHITE = [255, 255, 255]
const GRAU_30_1 = GRAU_30.concat([1.0]) as RGBA
const BLAU_20_1 = BLAU_20.concat([1.0]) as RGBA
const WHITE_1 = WHITE.concat([1.0]) as RGBA
const WHITE_0 = WHITE.concat([0.0]) as RGBA

const fillColor = computed(() => {
  if (props.reverse) {
    return bgFromPercent(props.percent, BLAU_20_1, WHITE_1)
  }
  return bgFromPercent(props.percent, WHITE_1, BLAU_20_1)
})

const lockFill = computed(() => {
  if (props.reverse) {
    return bgFromPercent(props.percent, WHITE_1, WHITE_0)
  }
  return bgFromPercent(props.percent, WHITE_0, WHITE_1)
})

const strokeColor = computed(() => {
  if (props.reverse) {
    return bgFromPercent(props.percent, BLAU_20_1, GRAU_30_1)
  }
  return bgFromPercent(props.percent, GRAU_30_1, BLAU_20_1)
})
</script>

<template>
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="15" width="22" height="17" rx="1" :fill="fillColor" :stroke="strokeColor" stroke-width="2" />
    <path
      d="M18.0719 20.0132C18.7343 19.9404 19.3973 20.1526 19.8903 20.5943C20.3836 21.0364 20.6674 21.6705 20.6676 22.3326C20.6675 22.9004 20.4575 23.4487 20.0846 23.8726V26.9995H16.5846V23.8736C16.151 23.3846 15.9445 22.7455 16.0143 22.0826C16.1283 21.0026 16.9934 20.1318 18.0719 20.0132Z"
      :fill="lockFill" />
    <path d="M11.0001 15C9.00027 9.53674e-07 27 0 25.0001 15" :stroke="strokeColor" stroke-width="2"
      :stroke-dasharray="strokeFromPercent" />
  </svg>
</template>
