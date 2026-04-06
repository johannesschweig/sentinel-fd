<script setup>
import Zone from '@/components/Zone.vue'
import { useSystemStore } from '@/stores';
import { computed } from 'vue'
import { useRoute } from 'vue-router';
import { getZoneIconStatus } from '@/utils';

const store = useSystemStore()
const route = useRoute()

const areas = computed(() => {
  return store.getAreasByObject(Number(route.params.objectId))
})
</script>

<template>
  <div class="flex flex-col justify-between">
    <div>
      <div class="p-6">
        <div class="flex gap-4 flex-col">
          <Zone v-for="area in areas" :id="area.id" type="area" :name="area.name" :status="getZoneIconStatus(area.armState, area.armability, area.alarmState)" :key="area.id" />
        </div>
      </div>
    </div>
  </div>
</template>
