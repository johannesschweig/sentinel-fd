<script setup lang="ts">
import { useSystemStore } from '@/stores';
import { computed, ref } from 'vue';
import NotificationItem from '@/components/NotificationItem.vue';
import type { NotificationGroup } from '@/utils/types';
import { useRoute } from 'vue-router';

const store = useSystemStore()
const route = useRoute()
const objectId = ref(Number(route.params.objectId))

const groupedNotifications = computed((): NotificationGroup[] => {
  const groups = new Map<string, NotificationGroup>();

  const notifications = store.notifications.filter(n => {
    if (n.type === 'DETECTOR_TRIGGERED') { // detector
      return store.getObjectIdFromDetector(n.id) === objectId.value
    } else { // area
      return store.getObjectIdFromArea(n.id) === objectId.value
    }
  })

  notifications.forEach((notification) => {
    const date = new Date(notification.time);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const label = `${day}.${month}.${year}`;

    if (!groups.has(label)) {
      groups.set(label, {
        label,
        date,
        notifications: []
      });
    }

    groups.get(label)!.notifications.push(notification);
  });

  // newest last
  return Array.from(groups.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(group => ({
      ...group,
      notifications: group.notifications.sort((a, b) => a.time - b.time)
    }));
});

</script>

<template>
  <div class="p-6 flex flex-col gap-6 items-center w-full overflow-y-auto">
    <div v-if="groupedNotifications.length > 0" v-for="day in groupedNotifications"
      class="flex flex-col items-center gap-2 w-full">
      <div class="text-grau-30 text-sm px-2 py-1 bg-white rounded-full inline-block">
        {{ day.label }}
      </div>
      <NotificationItem v-for="notification in day.notifications" :notification="notification" />
    </div>
    <div v-else class="text-sm text-grau-30">
      Keine Benachrichtigungen
    </div>
  </div>
</template>