<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import CloseIcon from '@/assets/close.svg?component'
import AlertErrorIcon from '@/assets/alert-error.svg?component'
import { useRouter, useRoute } from 'vue-router';
import { useSystemStore } from '@/stores';
import QuestionFrameIcon from '@/assets/question-frame.svg?component'
import SwipeArming from '@/components/SwipeArming.vue';
import AnimatedArmIcon from './AnimatedArmIcon.vue';
import { DEVICES } from '@/utils/index'
import { getZoneIconStatus } from '@/utils/index';
import type { ZoneIconStatus } from '@/utils/types';
import SirenIcon from '@/assets/siren.svg?component'
import MiniDetectors from '@/components/MiniDetectors.vue';

const router = useRouter()
const route = useRoute()
const store = useSystemStore()

const objectId = computed(() => Number(route.params.objectId));
const areaId = computed(() => route.params.areaId ? Number(route.params.areaId) : undefined);
const stage = ref(0) // 0: not ready to arm, 1: ready to arm, 2: armed
const zone = ref('')

const headerClass = computed(() => {
  if (stage.value === 0) {
    return 'bg-purpur-95 border-purpur-85'
  } else if (stage.value === 3) { // arlam
    return 'bg-rot-95 border-rot-85'
  }
  return 'bg-grau-95 border-grau-85'
})

onMounted(() => {
  if (areaId.value != null) {
    const area = store.data.areas.find(a => a.id === areaId.value)
    const status = getZoneIconStatus(area?.armState, area?.armability, area?.alarmState)
    stage.value = statusToStage(status)
    zone.value = area?.name || 'unknown'
  } else if (objectId.value != null) {
    const object = store.data.objects.find(o => o.id === objectId.value)
    const status = getZoneIconStatus(object?.armState, object?.armability, object?.alarmState)
    stage.value = statusToStage(status)
    zone.value = object?.name || 'unknown'
  } else {
    stage.value = 0
  }
})

function statusToStage(status: ZoneIconStatus) {
  switch (status) {
    case 'unknown': return -1
    case 'not-armable': return 0
    case 'disarmed': return 1
    case 'armed': return 2
    case 'alarm': return 3
    default: return -1
  }
}


const zoneLabel = computed(() => areaId.value != null ? 'Bereich' : 'Objekt')
</script>

<template>
  <div class="bg-white flex flex-col">
    <!-- Header -->
    <div class="h-18 px-6 py-[18px] border-b flex items-center justify-between" :class="headerClass">
      <h1 class="text-xl text-grau-10">{{ zoneLabel }} scharfschalten</h1>
      <CloseIcon class="w-10 h-10 text-grau-15 cursor-pointer hover:bg-grau-90 p-1 rounded-full"
        @click="router.go(-1)" />
    </div>

    <!-- Content -->
    <div class="flex flex-col items-center mt-4 mx-6 flex-1">
      <!-- Top Ilustration -->
      <QuestionFrameIcon v-if="stage === -1" class="w-32 h-32 mb-6" />
      <AlertErrorIcon v-else-if="stage === 0" class="w-32 h-32 mb-6" />
      <div v-else-if="stage === 1 || stage === 2" class="p-4 rounded-full mb-6 bg-grau-95">
        <AnimatedArmIcon class="w-24 h-24" :percent="store.swipeProgress" :reverse="stage === 2" />
      </div>
      <SirenIcon v-else-if="stage === 3" class="w-32 h-32 mb-6" />
      <!-- Unknown -->
      <div v-if="stage === -1">
        <h2 class="text-2xl text-grau-15 mb-4">{{ zone }}</h2>
        <p class="text-lg text-grau-15 mb-4">
          Der Status des {{ zoneLabel }}s ist unbekannt.
        </p>
        <p class="text-grau-25">Prüfen Sie ihre Internetverbindung oder kontaktieren Sie ihren Administrator.</p>
      </div>
      <!-- Not armable -->
      <div v-else-if="stage === 0">
        <h2 class="text-2xl text-grau-15 mb-4">{{ zone }}</h2>
        <p class="text-lg text-grau-15 mb-4">
          Folgende {{ DEVICES }} verhindern momentan das Scharfschalten:
        </p>
        <MiniDetectors :objectId="objectId" :areaId="areaId"/>
        <p class="text-grau-25">
          Bringen Sie die ausgelösten {{ DEVICES }} in Ruhe, um mit dem Scharfschalten fortzufahren.
        </p>
      </div>
      <!-- Disarmed <-> Armed -->
      <div v-else-if="stage === 1 || stage === 2" class="flex flex-col flex-1">
        <div class="text-center">
          <h2 class="text-2xl text-grau-15 mb-2">{{ zone }}</h2>
          <h3 class="text-lg text-grau-30">{{ stage === 1 ? 'unscharf' : 'scharf' }}</h3>
        </div>
        <div class="flex-1"></div>
        <div class="mb-8">
          <div class="text-grau-25 mb-2">Wischen sie nach rechts, um
            {{ stage === 1 ? 'scharf' : 'unscharf' }}zuschalten.</div>
          <!-- Swipe track -->
          <SwipeArming :reverse="stage === 2" />
        </div>
      </div>
      <!-- Alarm -->
      <div v-else-if="stage === 3" class="w-full">
        <h2 class="text-2xl text-grau-15 mb-4">{{ zone }}</h2>
        <p class="text-lg text-grau-15 mb-4">
          {{ zoneLabel === 'Bereich' ? 'Dieser Bereich ist in Alarm.' : 'Dieses Objekt ist in Alarm.' }}
        </p>
        <!-- TODO: Should these detectors be the currently triggered detectors or the detectors that started the alarm? -->
        <MiniDetectors :objectId="objectId" :areaId="areaId"/>
      </div>
      <!-- Close button at bottom -->
      <button
        class="mt-auto mb-2 px-6 py-4 bg-blau-95 hover:bg-blau-90 text-blau-15 border border-blau-20 rounded-2xl transition-colors duration-200 cursor-pointer"
        @click="router.go(-1)">
        Schließen
      </button>
    </div>
  </div>

</template>