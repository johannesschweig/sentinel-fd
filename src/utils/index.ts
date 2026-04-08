import type { ArmState, Armability, AlarmState, ZoneIconStatus, DetectorStatus } from './types'

// return a background color interpolated between start rgba and end rgba based on percent (0 to 1) 
export function bgFromPercent(percent: number, start: [number, number, number, number], end: [number, number, number, number]) {
  const r = Math.round(start[0] + ((end[0] - start[0]) * percent))
  const g = Math.round(start[1] + ((end[1] - start[1]) * percent))
  const b = Math.round(start[2] + ((end[2] - start[2]) * percent))
  const a = start[3] + ((end[3] - start[3]) * percent)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}


export const DEVICES = 'Geräte'
export const AREAS = 'Bereiche'
export const REMOTE_CONTROL = 'Steuerung'
export const NOTIFICATIONS = 'Nachrichten'

export function getZoneIconStatus(armState: ArmState | undefined, armability: Armability | undefined, alarmState: AlarmState | undefined): ZoneIconStatus {
  if (alarmState === 'alarm') {
    return 'alarm'
  }
  if (armability === 'not-armable') {
    return 'not-armable'
  }
  if (armState === 'armed') {
    return 'armed'
  }
  if (armState === 'disarmed') {
    return 'disarmed'
  }
  if (armState === 'internal') {
    return 'internal'
  }
  return 'unknown'
}

export const classStatusMap: Record<DetectorStatus, string> = {
  'unknown': 'text-grau-40 bg-grau-95',
  'deactivated': 'text-grau-40 bg-grau-95',
  // 'alarm': 'text-rot-30 bg-rot-95',
  'triggered': 'text-purpur-30 bg-purpur-95',
  'tamper': 'text-gelb-30 bg-gelb-95',
  'idle': 'text-blau-30 bg-blau-95'
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}