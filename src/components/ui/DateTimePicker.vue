<template>
    <Popover>
        <PopoverTrigger as-child>
            <Button variant="outline" :class="cn(
                'w-full justify-start text-left font-normal',
                !modelValue && 'text-muted-foreground'
            )">
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{ displayValue }}
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0" align="start">
            <Calendar layout="month-and-year" :model-value="calendarValue" @update:model-value="onDateSelect" />
            <div class="border-t p-3 flex items-center gap-2">
                <ClockIcon class="h-4 w-4 text-muted-foreground shrink-0" />
                <Input type="time" :value="timeValue" @change="onTimeChange" class="h-8 w-full" />
            </div>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { parseDate } from '@internationalized/date'
import type { DateValue } from 'reka-ui'
import { CalendarIcon, ClockIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const props = defineProps<{
    modelValue?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const calendarValue = computed<DateValue | undefined>(() => {
    if (!props.modelValue) return undefined
    try {
        const datePart = props.modelValue.slice(0, 10)
        return parseDate(datePart)
    } catch {
        return undefined
    }
})

const timeValue = computed(() => {
    if (!props.modelValue) return '00:00'
    return props.modelValue.slice(11, 16) || '00:00'
})

const displayValue = computed(() => {
    if (!props.modelValue) return 'Pick a date & time'
    const date = new Date(props.modelValue)
    if (isNaN(date.getTime())) return 'Pick a date & time'
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })
})

function onDateSelect(date: DateValue | undefined) {
    if (!date) return
    const datePart = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
    emit('update:modelValue', `${datePart}T${timeValue.value}`)
}

function onTimeChange(e: Event) {
    const time = (e.target as HTMLInputElement).value || '00:00'
    const datePart = props.modelValue?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
    emit('update:modelValue', `${datePart}T${time}`)
}
</script>
