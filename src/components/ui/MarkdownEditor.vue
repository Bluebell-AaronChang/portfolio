<template>
    <div class="border border-input rounded-md overflow-hidden flex flex-col">
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-input bg-muted/40">
            <ToolbarButton @click="editor?.chain().focus().toggleBold().run()" :active="editor?.isActive('bold')"
                title="Bold">
                <BoldIcon class="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton @click="editor?.chain().focus().toggleItalic().run()" :active="editor?.isActive('italic')"
                title="Italic">
                <ItalicIcon class="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton @click="editor?.chain().focus().toggleStrike().run()" :active="editor?.isActive('strike')"
                title="Strikethrough">
                <StrikethroughIcon class="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton @click="editor?.chain().focus().toggleCode().run()" :active="editor?.isActive('code')"
                title="Inline Code">
                <CodeIcon class="w-3.5 h-3.5" />
            </ToolbarButton>

            <Separator />

            <ToolbarButton v-for="level in [1, 2, 3] as const" :key="level"
                @click="editor?.chain().focus().toggleHeading({ level }).run()"
                :active="editor?.isActive('heading', { level })" :title="`Heading ${level}`">
                <span class="text-xs font-bold">H{{ level }}</span>
            </ToolbarButton>

            <Separator />

            <ToolbarButton @click="editor?.chain().focus().toggleBulletList().run()"
                :active="editor?.isActive('bulletList')" title="Bullet List">
                <ListIcon class="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton @click="editor?.chain().focus().toggleOrderedList().run()"
                :active="editor?.isActive('orderedList')" title="Ordered List">
                <ListOrderedIcon class="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton @click="editor?.chain().focus().toggleBlockquote().run()"
                :active="editor?.isActive('blockquote')" title="Blockquote">
                <QuoteIcon class="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton @click="editor?.chain().focus().toggleCodeBlock().run()"
                :active="editor?.isActive('codeBlock')" title="Code Block">
                <SquareCodeIcon class="w-3.5 h-3.5" />
            </ToolbarButton>

            <Separator />

            <ToolbarButton @click="editor?.chain().focus().setHorizontalRule().run()" title="Horizontal Rule">
                <MinusIcon class="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton @click="addLink" :active="editor?.isActive('link')" title="Link">
                <LinkIcon class="w-3.5 h-3.5" />
            </ToolbarButton>

            <Separator />

            <ToolbarButton @click="editor?.chain().focus().undo().run()" :disabled="!editor?.can().undo()" title="Undo">
                <UndoIcon class="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton @click="editor?.chain().focus().redo().run()" :disabled="!editor?.can().redo()" title="Redo">
                <RedoIcon class="w-3.5 h-3.5" />
            </ToolbarButton>
        </div>

        <!-- Editor Content -->
        <EditorContent :editor="editor" class="min-h-50 prose prose-sm dark:prose-invert max-w-none" />
    </div>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount, defineComponent, h } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import { Placeholder } from '@tiptap/extension-placeholder'
import {
    BoldIcon, ItalicIcon, StrikethroughIcon, CodeIcon,
    ListIcon, ListOrderedIcon, QuoteIcon, SquareCodeIcon,
    MinusIcon, LinkIcon, UndoIcon, RedoIcon,
} from 'lucide-vue-next'
import { Link } from '@tiptap/extension-link'

const props = defineProps<{
    modelValue?: string
    placeholder?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const ToolbarButton = defineComponent({
    props: {
        active: Boolean,
        disabled: Boolean,
        title: String,
    },
    emits: ['click'],
    setup(props, { slots, emit }) {
        return () => h('button', {
            type: 'button',
            title: props.title,
            disabled: props.disabled,
            onClick: () => emit('click'),
            class: [
                'inline-flex items-center justify-center w-7 h-7 rounded text-sm transition-colors',
                props.active
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground',
                props.disabled && 'opacity-30 cursor-not-allowed',
            ],
        }, slots.default?.())
    },
})

const Separator = defineComponent({
    setup() {
        return () => h('div', { class: 'w-px h-5 bg-border mx-0.5' })
    },
})

const editor = useEditor({
    extensions: [
        StarterKit,
        Link.configure({ openOnClick: false }),
        Markdown.configure({ transformPastedText: true, transformCopiedText: true }),
        Placeholder.configure({ placeholder: props.placeholder ?? 'Write something...' }),
    ],
    content: props.modelValue ?? '',
    editorProps: {
        attributes: {
            class: 'outline-none p-3 min-h-50',
        },
    },
    onUpdate({ editor }) {
        const md = (editor.storage as any).markdown.getMarkdown()
        emit('update:modelValue', md)
    },
})

watch(() => props.modelValue, (newVal) => {
    if (!editor.value) return
    const current = (editor.value.storage as any).markdown.getMarkdown()
    if (newVal !== current) {
        editor.value.commands.setContent(newVal ?? '')
    }
})

function addLink() {
    const url = window.prompt('URL:', editor.value?.getAttributes('link').href ?? '')
    if (url === null) return
    if (url === '') {
        editor.value?.chain().focus().unsetLink().run()
    } else {
        editor.value?.chain().focus().setLink({ href: url }).run()
    }
}

onBeforeUnmount(() => editor.value?.destroy())
</script>

<style>
.tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: hsl(var(--muted-foreground));
    pointer-events: none;
    height: 0;
}
</style>
