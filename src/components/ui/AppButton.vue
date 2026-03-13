<script setup lang="ts">
import { cn } from '@/lib/utils'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    as?: string
    href?: string
    class?: string
  }>(),
  {
    variant: 'default',
    size: 'md',
    as: 'button',
  },
)

const classes = computed(() =>
  cn(
    'inline-flex items-center justify-center font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    {
      'bg-primary text-primary-foreground hover:bg-primary/90': props.variant === 'default',
      'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground':
        props.variant === 'outline',
      'hover:bg-accent hover:text-accent-foreground': props.variant === 'ghost',
    },
    {
      'h-8 px-3 text-sm': props.size === 'sm',
      'h-10 px-5 text-sm': props.size === 'md',
      'h-12 px-8 text-base': props.size === 'lg',
    },
    props.class,
  ),
)
</script>

<template>
  <a v-if="href" :href="href" :class="classes">
    <slot />
  </a>
  <component :is="as" v-else :class="classes">
    <slot />
  </component>
</template>
