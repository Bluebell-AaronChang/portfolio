<script setup lang="ts">
import { cn } from '@/lib/utils'
import { computed, type HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'outline'
    class?: HTMLAttributes['class']
  }>(),
  {
    variant: 'default',
  },
)

const classes = computed(() =>
  cn(
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
    {
      'bg-accent text-accent-foreground': props.variant === 'default',
      'border border-border text-muted-foreground': props.variant === 'outline',
    },
    props.class,
  ),
)
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
