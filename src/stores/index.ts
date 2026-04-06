import { defineStore } from 'pinia'
import { reactive } from 'vue';
import type { ArmState, DetectorStatus, Data, AreaData, DetectorData, Notification } from '@/utils/types';
import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL;
const socket = io(URL);

export const useSystemStore = defineStore('system', {
  state: () => ({
    data: reactive<Data>({ objects: [], areas: [], detectors: [] }),
    swipeProgress: 0,
    notifications: [] as Notification[]
  }),
  getters: {
    allObjectIds: (state) => {
      return state.data.objects.map(obj => obj.id)
    }
  },
  actions: {
    async getData() {
      const res = await fetch(`/data.json`)
      const result = await res.json()
      this.data = result

      for (const object of this.data.objects) {
        object.armState = 'unknown'
        object.armability = 'armable'
        object.alarmState = 'idle'
      }
      for (const area of this.data.areas) {
        area.armState = 'unknown'
        area.armability = 'armable'
        area.alarmState = 'idle'
      }
      for (const detector of this.data.detectors) {
        detector.status = 'unknown'
      }
    },
    updateObjectStatus(objectId: number) { // update object status based on its areas
      const object = this.data.objects.find(obj => obj.id === objectId)
      const areasArmStatuses = this.getAreasByObject(objectId).map(area => area.armState).filter(armStatus => armStatus !== 'unknown')
      if (areasArmStatuses.length === 0) {
        object!.armState = 'unknown'
      } else if (areasArmStatuses.includes('disarmed')) {
        object!.armState = 'disarmed'
      } else {
        object!.armState = 'armed'
      }
      const areasArmabilities = this.getAreasByObject(objectId).map(area => area.armability)
      if (areasArmabilities.includes('not-armable')) {
        object!.armability = 'not-armable'
      } else {
        object!.armability = 'armable'
      }
      const areasAlarmStates = this.getAreasByObject(objectId).map(area => area.alarmState)
      if (areasAlarmStates.includes('alarm')) {
        object!.alarmState = 'alarm'
      } else {
        object!.alarmState = 'idle'
      }
    },
    setAreaArmStatus(areaId: number, status: ArmState, timestamp?: number) {
      const area = this.data.areas.find(a => a.id === areaId)
      if (!area) return
      if (area.armState === status) return
      area.armState = status
      const obj = this.data.objects.find(obj => obj.areaIds.includes(areaId))
      this.updateObjectStatus(obj!.id)
      // add to notification log
      this.notifications.push({
        type: 'ARMING',
        id: areaId,
        time: timestamp || Date.now(),
        status,
      })
    },
    updateObjectArmability(objectId: number) {
      const obj = this.data.objects.find(obj => obj.id === objectId)
      if (!obj) return
      const areaIds = this.data.objects.find(obj => objectId === obj.id)?.areaIds
      const areasArmabilities = this.data.areas.filter(area => areaIds?.includes(area.id)).map(area => area.armability)
      if (areasArmabilities.includes('not-armable')) {
        obj.armability = 'not-armable'
      } else {
        obj.armability = 'armable'
      }
    },
    updateAreaArmability(areaId: number) {
      const area = this.data.areas.find(a => a.id === areaId)
      if (!area) return
      const detectorIds = area.detectorIds
      const detectorStatus = this.data.detectors.filter(d => detectorIds.includes(d.id)).map(d => d.status)
      if (detectorStatus.includes('triggered')) {
        area.armability = 'not-armable'
      } else {
        area.armability = 'armable'
      }
      const object = this.data.objects.find(obj => obj.areaIds.includes(area.id))
      if (object && object.id) {
        this.updateObjectArmability(object.id)
      }
    },
    updateObjectAlarmStatus(objectId: number) {
      const obj = this.data.objects.find(obj => obj.id === objectId)
      if (!obj) return
      const areaIds = this.data.objects.find(obj => objectId === obj.id)?.areaIds
      const areasAlarmStates = this.data.areas.filter(area => areaIds?.includes(area.id)).map(area => area.alarmState)
      if (areasAlarmStates.includes('alarm')) {
        obj.alarmState = 'alarm'
      } else {
        obj.alarmState = 'idle'
      }
    },
    updateAreaAlarmStatus(areaId: number) {
      const area = this.data.areas.find(a => a.id === areaId)
      if (!area) return
      const detectorIds = area.detectorIds
      const detectorStatus = this.data.detectors.filter(d => detectorIds.includes(d.id)).map(d => d.status)
      if (detectorStatus.includes('triggered') && area.armState === 'armed') {
        area.alarmState = 'alarm'
        // add to notification log
        this.notifications.push({
          type: 'ALARM',
          id: area.id,
          time: Date.now()
        })
      } else {
        area.alarmState = 'idle'
      }
      const object = this.data.objects.find(obj => obj.areaIds.includes(area.id))
      if (object && object.id) {
        this.updateObjectAlarmStatus(object.id)
      }
    },
    setDetectorStatus(detectorId: number, status: DetectorStatus, timestamp?: number) {
      const detector = this.data.detectors.find(d => d.id === detectorId)
      if (!detector) return
      if (detector.status === status) return
      detector.status = status
      const area = this.data.areas.find(area => area.detectorIds.includes(detectorId))
      this.updateAreaArmability(area!.id)
      this.updateAreaAlarmStatus(area!.id)
      // add to notification log
      if (status === 'triggered') {
        this.notifications.push({
          type: 'DETECTOR_TRIGGERED',
          id: detectorId,
          time: timestamp || Date.now()
        })
      }
    },
    getAreasByObject(objectId: number): AreaData[] {
      if (this.data.areas.length === 0) {
        return []
      }
      const obj = this.data.objects.find(obj => obj.id === objectId)
      const areaIds = obj?.areaIds || []
      return this.data.areas.filter(area => areaIds.includes(area.id))
    },
    getDetectorsByZone(objectId: number, areaId?: number): DetectorData[] {
      if (areaId) { // detectors for specific area
        const detectorsIds = this.data.areas.find(area => area.id === areaId)?.detectorIds || []
        return this.data.detectors.filter(detector => detectorsIds.includes(detector.id))
      } else { // detectors for all areas in object
        const areaIds = this.data.objects.find(obj => obj.id === objectId)?.areaIds
        var detectorsList: DetectorData[] = []
        for (const aId of areaIds || []) {
          const detectorsIds = this.data.areas.find(area => area.id === aId)?.detectorIds || []
          const detectors = this.data.detectors.filter(detector => detectorsIds.includes(detector.id))
          detectorsList = detectorsList.concat(detectors)
        }
        return detectorsList
      }
    },
    getAreaNameFromDetector(detectorId: number): string {
      for (const area of this.data.areas) {
        if (area.detectorIds.includes(detectorId)) {
          return area.name
        }
      }
      return 'error'
    },
    getObjectIdFromArea(areaId: number): number | null {
      for (const object of this.data.objects) {
        if (object.areaIds.includes(areaId)) {
          return object.id
        }
      }
      return null
    },
    getObjectIdFromDetector(detectorId: number): number | null {
      for (const area of this.data.areas) {
        if (area.detectorIds.includes(detectorId)) {
          return this.getObjectIdFromArea(area.id)
        }
      }
      return null
    }
  }
})

socket.on("state_update", (content) => {
  const systemStore = useSystemStore()

  // 1. Extract the data and the metadata paths
  const reported = content.reported || {}
  const metadata = reported.$metadata || {}

  // --- BLOCK A: AREAS ---
  if (reported.areas) {
    Object.entries(reported.areas).forEach(([id, data]: [string, any]) => {
      // Pull timestamp from metadata: reported -> $metadata -> areas -> [id] -> arm_state -> $lastUpdated
      const areaTs = metadata.areas?.[id]?.arm_state?.$lastUpdated
      const timestamp = areaTs ? new Date(areaTs).getTime() : Date.now()

      systemStore.setAreaArmStatus(
        Number(id),
        data.arm_state,
        timestamp
      )
    })
  }

  // --- BLOCK B: DETECTORS ---
  if (reported.detectors) {
    Object.entries(reported.detectors).forEach(([id, data]: [string, any]) => {
      // Pull timestamp from metadata: reported -> $metadata -> detectors -> [id] -> status -> $lastUpdated
      const detectorTs = metadata.detectors?.[id]?.status?.$lastUpdated
      const timestamp = detectorTs ? new Date(detectorTs).getTime() : Date.now()

      systemStore.setDetectorStatus(
        Number(id),
        data.status,
        timestamp
      )
    })
  }
})
