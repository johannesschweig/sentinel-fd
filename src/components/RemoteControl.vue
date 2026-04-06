<script setup>
import Zone from '@/components/Zone.vue'
import { useSystemStore } from '@/stores';
import { computed } from 'vue'
import { useRoute } from 'vue-router';
import ArmIcon from '@/components/ArmIcon.vue'
import { getZoneIconStatus } from '@/utils';


const store = useSystemStore()
const route = useRoute()

const areas = computed(() => {
  return store.getAreasByObject(Number(route.params.objectId))
})
</script>

<template>
  <div class="p-6">
    <div class="flex gap-4 flex-col mb-32">
      <Zone v-for="area in areas" :id="area.id" type="area" :name="area.name" :status="getZoneIconStatus(area.armState, area.armability, area.alarmState)" :key="area.id"
        :detectors="false" />
    </div>
    <div class="bg-white rounded-2xl px-4 py-3 flex items-center justify-between">
      <div v-for="status in ['disarmed', 'armed', 'internal']" :key="status" class="flex flex-col items-center gap-1">
        <ArmIcon :status="status" size="large" :link="`/object/${route.params.objectId}/arm`" />
        <span class="text-grau-30 text-sm">{{ status === 'disarmed' ? 'Unscharf' : status === 'armed' ? 'Scharf' : 'Intern' }}</span>
      </div>
    </div>
  </div>
</template>
