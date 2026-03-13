<script setup lang="ts">
import { Button } from '@/components/ui/button'
import type { Component } from 'vue'
import type { ButtonVariants } from '@/components/ui/button'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
    as?: string | Component
    href?: string
    class?: string
  }>(),
  {
    variant: 'default',
    size: 'default',
    as: 'button',
  },
)
</script>

<template>
  <Button v-if="href" :as="'a'" :href="href" :variant="variant" :size="size" :class="props.class">
    <slot />
  </Button>
  <Button v-else :as="as" :variant="variant" :size="size" :class="props.class">
    <slot />
  </Button>
</template>
