<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { useSystemStore } from '@/stores'
import { computed, ref, watch } from 'vue'
import { germanStatusMap, detectorTypeLabel } from '@/utils/labels'
import { classStatusMap } from '@/utils'
import DetectorIcon from '@/components/DetectorIcon.vue'

const router = useRouter()
const route = useRoute()
const store = useSystemStore()

const detectorId = Number(route.params.detectorId)
const detector = computed(() => store.data.detectors.find(d => d.id === detectorId))
const history = computed(() => store.notifications.filter(n => n.id === detectorId).slice().reverse())

const internalProgramEnabled = ref(true)

function toggleInternalProgram() {
  internalProgramEnabled.value = !internalProgramEnabled.value
  if (detector.value) {
    // @ts-ignore
    detector.value.internalProgram = internalProgramEnabled.value
  }
}

function humanizeEvent(item: any) {
  if (!item) return ''
  if (item.type === 'DETECTOR_TRIGGERED') return 'Ausgelöst'
  if (item.type === 'DETECTOR_TAMPER') return 'Sabotage'
  if (item.type === 'DETECTOR_TRIGGERED_IDLE') return 'Ruhe'
  if (item.type === 'DETECTOR_DEACTIVATED') return 'Abgeschaltet'
  return item.type
}

function formatTime(ts: number | undefined) {
  if (!ts) return ''
  const date = new Date(ts)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}
</script>

<template>
  <div class="font-bosch text-grau-10 p-4 space-y-4 w-full box-border">

    <section class="bg-white rounded-xl p-5 border border-grau-90 shadow-base w-full">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center gap-4">
          <DetectorIcon :type="detector?.type || 'unknown'" :status="detector?.status || 'unknown'" />
          <div class="min-w-0">
            <h1 class="text-base font-medium text-grau-5 truncate">
              {{ detectorTypeLabel[detector?.type || ''] || detector?.type || 'Unbekannter Melder' }}
            </h1>
            <p class="text-sm text-grau-45">ID: {{ detectorId }}</p>
          </div>
        </div>

        <div v-if="detector?.status" class="px-3 py-1 rounded text-xs shrink-0 font-bold"
          :class="classStatusMap[detector?.status]">
          {{ germanStatusMap[detector?.status] || detector?.status }}
        </div>
      </div>

      <div class="pt-4 border-t border-grau-95">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-grau-10">Internes Programm</p>
            <p class="text-xs text-grau-50">Reaktion auf Systemlogik</p>
          </div>

          <button @click="toggleInternalProgram" type="button"
            class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="internalProgramEnabled ? 'bg-blau-20' : 'bg-grau-80'">
            <span
              class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
              :class="internalProgramEnabled ? 'translate-x-5' : 'translate-x-0'" />
          </button>
        </div>
      </div>
    </section>

    <section class="bg-white rounded-xl border border-grau-90 shadow-base overflow-hidden w-full">
      <div class="px-5 py-3 border-b border-grau-90 flex justify-between items-center bg-white">
        <h3 class="text-sm font-bold text-grau-5 uppercase tracking-wider">Verlauf</h3>
      </div>

      <div class="divide-y divide-grau-95">
        <div v-for="(item, idx) in history" :key="idx" class="px-5 py-3 hover:bg-grau-95 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                :class="['w-2 h-2 rounded-full',
                  item.type === 'DETECTOR_TRIGGERED' ? 'bg-purpur-40' : item.type === 'DETECTOR_TAMPER' ? 'bg-gelb-40' : 'bg-grau-40']">
              </span>
              <span class="text-sm font-medium text-grau-10">{{ humanizeEvent(item) }}</span>
            </div>
            <span class="text-xs font-mono text-grau-45">{{ formatTime(item.time) }}</span>
          </div>
        </div>

        <div v-if="history.length === 0" class="px-5 py-6 text-grau-60 text-xs">
          Keine Ereignisse gefunden.
        </div>
      </div>
    </section>
  </div>
</template>