<template>
    <Dialog :open="state.isOpen">
        <DialogContent :show-close-button="false" class="sm:max-w-sm">
            <DialogHeader>
                <DialogTitle>{{ state.title }}</DialogTitle>
                <DialogDescription>{{ state.message }}</DialogDescription>
            </DialogHeader>
            <DialogFooter class="gap-2">
                <Button variant="outline" @click="handleCancel">
                    {{ state.cancelText }}
                </Button>
                <Button :variant="state.variant" @click="handleConfirm">
                    {{ state.confirmText }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { confirmState as state, resolveConfirm } from '@/composables/useAppFeedback'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

function handleConfirm() {
    resolveConfirm(true)
}

function handleCancel() {
    resolveConfirm(false)
}
</script>
