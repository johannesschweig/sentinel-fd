export type ArmState = 'unknown' | 'armed' | 'disarmed' | 'internal'
export type Armability = 'armable' | 'not-armable'
export type AlarmState = 'idle' | 'alarm'
export type DetectorStatus = 'unknown' | 'idle' | 'deactivated' | 'triggered'
export type ZoneIconStatus = 'unknown' | 'internal' | 'armed' | 'disarmed' | 'alarm' | 'not-armable' // states for displaying zone icons

export interface Data {
  objects: ObjectData[]
  areas: AreaData[]
  detectors: DetectorData[]
}

export interface ObjectData {
  id: number
  name: string
  areaIds: number[]
  armState?: ArmState
  armability?: Armability
  alarmState?: AlarmState
}

export interface AreaData {
  id: number
  name: string
  detectorIds: number[]
  armState?: ArmState
  armability?: Armability
  alarmState?: AlarmState
}

export interface DetectorData {
  id: number
  type: string
  location: string
  alarmType: string
  status?: DetectorStatus
}
export interface Notification {
  id: number; // detectorId or areaId
  time: number;
  type: 'DETECTOR_TRIGGERED' | 'ALARM' | 'ARMING'
  status?: ZoneIconStatus
}

export interface NotificationGroup {
  label: string;
  date: Date;
  notifications: Notification[];
}