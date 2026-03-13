<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <RouterView />
    <AppFooter />
    <ToastContainer />
  </div>
</template>
