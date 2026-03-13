<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="mb-12 text-center">
    <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="mt-3 text-muted-foreground max-w-2xl mx-auto">
      {{ subtitle }}
    </p>
  </div>
</template>
