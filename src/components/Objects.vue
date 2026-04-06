<script setup>
import Zone from '@/components/Zone.vue'
import Banner from '@/components/Banner.vue'
import { useSystemStore } from '@/stores';
import { getZoneIconStatus } from '@/utils';

const store = useSystemStore()
</script>

<template>
  <div class="flex flex-col justify-between">
    <div>
      <div class="p-6">
        <div class="flex gap-4 flex-col">
          <Zone v-for="obj in store.data.objects" :id="obj.id" :name="obj.name" type="object" :status="getZoneIconStatus(obj.armState, obj.armability, obj.alarmState)" :key="obj.id" />
        </div>
      </div>
    </div>
    <Banner />
  </div>
</template>

