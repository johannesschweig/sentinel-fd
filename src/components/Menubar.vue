<script lang="ts" setup>
import MenuItem from './MenuItem.vue';
import { useRoute } from 'vue-router'
import { DEVICES, AREAS, REMOTE_CONTROL, NOTIFICATIONS } from '@/utils/index'

const route = useRoute()

const objectId = route.params.objectId
const areaId = route.params.areaId
</script>

<template>
  <div class="border-t border-grau-85 flex justify-between text-center bg-white h-22">

    <!-- Geräte -->
    <MenuItem :to="areaId
      ? `/object/${objectId}/area/${areaId}/detectors`
      : `/object/${objectId}/detectors`" :label="DEVICES" />

    <!-- Bereiche -->
    <MenuItem :to="`/object/${objectId}/areas`" :label="AREAS" />

    <!-- Steuerung -->
    <MenuItem :to="`/object/${objectId}/remote-control`" :label="REMOTE_CONTROL" />
    <!-- Nachrichten -->
    <MenuItem :to="`/object/${objectId}/notifications`" :label="NOTIFICATIONS" />
  </div>
</template>