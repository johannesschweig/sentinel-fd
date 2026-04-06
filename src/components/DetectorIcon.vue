<script lang="ts" setup>
import type { DetectorStatus, DetectorData } from '@/utils/types';
import DetectorMotionIcon from '@/assets/detector-motion.svg?component'
import DoorContactIcon from '@/assets/door-contact.svg?component'
import PanicButtonIcon from '@/assets/panic-button.svg?component'
import KeypadMapHandIcon from '@/assets/keypad-map-hand.svg?component'
import SensorCableIcon from '@/assets/sensor-cable.svg?component'
import ImpulseIcon from '@/assets/impulse.svg?component'
import DoorLockIcon from '@/assets/door-lock.svg?component'
import { classStatusMap } from '@/utils';


const props = defineProps<{
  type: string
  status: DetectorStatus
}>()


const icons: Record<string, typeof DetectorMotionIcon> = {
  'automatic-dialer-transmitter': ImpulseIcon,
  'tamper-switch': SensorCableIcon,
  'control-panel': KeypadMapHandIcon,
  'motion-detector': DetectorMotionIcon,
  'lid-contact': SensorCableIcon,
  'area-surveillance-detector': SensorCableIcon,
  'coupler': SensorCableIcon,
  'structure-borne-sound-detector': SensorCableIcon,
  'magnetic-contact': DoorContactIcon,
  'bolt-contact': DoorLockIcon,
  'hold-up-alarm': PanicButtonIcon,
  'hold-up-alarm-addon': PanicButtonIcon
}
</script>

<template>
  <div class="rounded-lg p-1 inline-flex w-10 h-10" :class="classStatusMap[props.status]">
    <component :is="icons[props.type]" class="w-8 h-8" />
  </div>
</template>