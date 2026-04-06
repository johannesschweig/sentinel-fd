<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import NotArmableIcon from '@/assets/not-armable.svg?component'
import DisarmedIcon from '@/assets/disarmed.svg?component'
import ArmedIcon from '@/assets/armed.svg?component'
import QuestionIcon from '@/assets/question.svg?component'
import WindowSettingsIcon from '@/assets/window-settings.svg?component'
import SirenIcon from '@/assets/siren.svg?component'
import type { ZoneIconStatus } from '@/utils/types'

const props = withDefaults(defineProps<{
  status: ZoneIconStatus
  link?: string
  size?: 'base' | 'large'
}>(),{
  size: 'base'
})

const icons: Record<ZoneIconStatus, typeof NotArmableIcon> = {
  'not-armable': NotArmableIcon,
  'disarmed': DisarmedIcon,
  'armed': ArmedIcon,
  'unknown': QuestionIcon,
  'internal': WindowSettingsIcon,
  'alarm': SirenIcon,
}

const currentIcon = computed(() => {
  return icons[props.status];
})

</script>

<template>
  <RouterLink :to="props.link || ''" class="p-1 rounded-full hover:bg-grau-95">
    <component :is="currentIcon" :class="props.size === 'large' ? 'w-10 h-10' : 'w-8 h-8'" />
  </RouterLink>
</template>