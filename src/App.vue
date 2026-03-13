<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import ScrollToTop from '@/components/ui/ScrollToTop.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <RouterView />
    <AppFooter />
    <ToastContainer />
    <ScrollToTop />
  </div>
</template>
