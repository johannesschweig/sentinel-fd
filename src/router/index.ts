import MqttTest from '@/components/MqttTest.vue'
import Arming from '@/components/Arming.vue'
import Detectors from '@/components/Detectors.vue'
import Objects from '@/components/Objects.vue'
import Areas from '@/components/Areas.vue'
import Layout from '@/components/Layout.vue'
import Notifications from '@/components/Notifications.vue'
import RemoteControl from '@/components/RemoteControl.vue'
import DetectorDetail from '@/components/DetectorsDetail.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', name: 'objects', component: Objects },
        { path: '/mqtt-test', name: 'mqtt-test', component: MqttTest},
        // Detectors
        { path: '/object/:objectId/detectors', name: 'object-detectors', component: Detectors },
        { path: '/object/:objectId/area/:areaId/detectors', name: 'area-detectors', component: Detectors },
        { path: '/object/:objectId/area/:areaId/detector/:detectorId', name: 'detector-detail', component: DetectorDetail },
        // Arming
        { path: '/object/:objectId/arm', name: 'object-arm', component: Arming },
        { path: '/object/:objectId/area/:areaId/arm', name: 'area-arm', component: Arming },
        // Areas
        { path: '/object/:objectId/areas', name: 'areas', component: Areas },
        // Notifications
        { path: '/object/:objectId/notifications', name: 'notifications', component: Notifications },
        // Remote control
        { path: '/object/:objectId/remote-control', name: 'remote-control', component: RemoteControl }
      ],
    },

  ],
})

export default router

