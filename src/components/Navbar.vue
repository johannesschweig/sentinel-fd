<script lang="ts" setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import ForwardRight from '@/assets/forward-right.svg?component'
import { computed } from 'vue'
import { detectorTypeLabel } from '@/utils/labels'
import { useSystemStore } from '@/stores/index'
import SettingsIcon from '@/assets/settings.svg?component'
import ArmIcon from '@/components/ArmIcon.vue'
import type { ZoneIconStatus, ArmState, AlarmState, Armability } from '@/utils/types'
import { getZoneIconStatus } from '@/utils/index'

const route = useRoute()
const router = useRouter()
const store = useSystemStore()

const navbar = computed(() => {
  if (route.name === 'objects') { // home view
    return { name: 'Bosch Sentinel', status: 'unknown' as ZoneIconStatus }
  } else if (route.name === 'object-detectors' || route.name === 'areas') { // object detectors or areas view
    const objectId = Number(route.params.objectId)
    const object = store.data.objects.find(obj => obj.id === objectId)
    const name = object ? object.name : 'error'
    const status : ZoneIconStatus = getZoneIconStatus(
      object?.armState as ArmState,
      object?.armability as Armability,
      object?.alarmState as AlarmState
    )
    return { name, objectId, status }
  } else if (route.name === 'area-detectors') { // detectors view
    const areaId = Number(route.params.areaId)
    const area = store.data.areas.find(area => area.id === areaId)
    const name = area ? area.name : 'error'
    const status : ZoneIconStatus = getZoneIconStatus(
      area?.armState as ArmState,
      area?.armability as Armability,
      area?.alarmState as AlarmState
    )
    return {
      name, areaId, status
    }
  } else if (route.name === 'detector-detail') {
    const detectorId = Number(route.params.detectorId)
    const detector = store.data.detectors.find(d => d.id === detectorId)
    const area = store.data.areas.find(a => detector && a.detectorIds.includes(detector.id))
    const translatedType = detector ? (detectorTypeLabel[detector.type] || detector.type) : 'Gerät'
    const name = translatedType
    const subtitle = `${area?.name || ''}${(area || detector?.location) ? ' • ' : ''}${detector?.location || ''}`
    return { name, detectorId, areaId: area?.id, location: detector?.location || '', subtitle, status: 'unknown' as ZoneIconStatus }
  }
  return { name: '', status: 'unknown' as ZoneIconStatus }
})

const getArmingRoute = computed(() => {
  const objectId = Number(route.params.objectId)
  const areaId = Number(route.params.areaId)
  if (route.name === 'object-detectors' || route.name === 'areas') {
    return `/object/${objectId}/arm`
  } else if (route.name === 'area-detectors') {
    return `/object/${objectId}/area/${areaId}/arm`
  }
  return '/error'
})
</script>

<template>
  <nav class="h-18">
    <div
      class="h-2 bg-[url('@/assets/bosch-supergraphic-rgb.svg?component')] bg-top bg-no-repeat bg-[length:100%_auto]">
    </div>

    <!-- Home -->
    <div v-if="route.name === 'objects'"
      class="flex items-center justify-between px-6 bg-white border-b border-grau-85 h-16">
      <h1 class="text-xl text-grau-10">{{ navbar.name }}</h1>
      <!-- TODO remove link to mqtt-test -->
      <RouterLink to="/mqtt-test" class="flex-1 text-white">...</RouterLink>
      <SettingsIcon class="w-10 h-10 text-grau-30 p-1 rounded-full hover:bg-grau-95 cursor-pointer" />
    </div>

    <!-- Detector detail -->
    <div v-else-if="route.name === 'detector-detail'" class="flex items-center gap-4 px-6 h-16">
      <button @click="router.back()" class="p-2 rounded-full bg-white hover:bg-grau-90">
        <ForwardRight class="w-6 h-6 text-grau-10 rotate-180" />
      </button>
      <div class="flex-1">
        <h1 class="text-xl text-grau-10">{{ navbar.name }}</h1>
        <div class="text-sm text-grau-30">{{ navbar.subtitle || '' }}</div>
      </div>
    </div>

    <!-- Areas / Detectors -->
    <div v-else-if="route.name === 'areas' || route.name === 'object-detectors' || route.name === 'area-detectors'"
      class="flex items-center gap-4 px-6 h-16">
      <!-- The back functionality does only make sense on ios. It is more a object-selection  -->
      <RouterLink to="/" class="p-2 rounded-full bg-white hover:bg-grau-90">
        <ForwardRight class="w-6 h-6 text-grau-10 rotate-180" />
      </RouterLink>
      <h1 class="text-xl text-grau-10">{{ navbar.name }}</h1>
      <div class="flex-1"></div>
        <ArmIcon :status="navbar.status" :link="getArmingRoute" class="w-8 h-8 " />
    </div>

    <div v-else class="flex items-center gap-4 px-6 h-16">
      <!-- The back functionality does only make sense on ios. It is more a object-selection  -->
      <RouterLink to="/" class="p-2 rounded-full bg-white hover:bg-grau-90">
        <ForwardRight class="w-6 h-6 text-grau-10 rotate-180" />
      </RouterLink>
      <h1 class="text-xl text-grau-10">{{ route.name === 'notifications' ? "Nachrichten" : "Steuerung" }}</h1>
    </div>

  </nav>
</template>
