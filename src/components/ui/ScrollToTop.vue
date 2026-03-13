<script setup lang="ts">
import { computed } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const { y: scrollY } = useWindowScroll()
const isVisible = computed(() => scrollY.value > 400)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition name="scroll-top">
    <button
      v-if="isVisible"
      class="scroll-top-btn"
      aria-label="Scroll to top"
      @click="scrollToTop"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.scroll-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-foreground);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.scroll-top-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  background-color: var(--color-foreground);
  color: var(--color-background);
}

.scroll-top-btn:active {
  transform: translateY(0);
}

.dark .scroll-top-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark .scroll-top-btn:hover {
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
}

/* Transition */
.scroll-top-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.scroll-top-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}
</style>
