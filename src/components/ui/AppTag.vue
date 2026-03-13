<script setup lang="ts">
import { cn } from '@/lib/utils'
import { computed, type HTMLAttributes } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'

const tagVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const props = withDefaults(
  defineProps<{
    variant?: VariantProps<typeof tagVariants>['variant']
    class?: HTMLAttributes['class']
  }>(),
  {
    variant: 'default',
  },
)

const classes = computed(() =>
  cn(tagVariants({ variant: props.variant }), props.class),
)
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
