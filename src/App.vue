<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import ScrollToTop from '@/components/ui/ScrollToTop.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const route = useRoute()

const isAdminPage = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar v-if="!isAdminPage" />
    <RouterView />
    <AppFooter v-if="!isAdminPage" />
    <ToastContainer />
    <ScrollToTop />
    <ConfirmDialog />
  </div>
</template>
