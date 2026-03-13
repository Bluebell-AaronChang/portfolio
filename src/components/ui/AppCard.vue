<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { type HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Card :class="props.class">
    <slot />
  </Card>
</template>
