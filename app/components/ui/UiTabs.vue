<script setup>
defineProps({ items: { type: Array, required: true } });
const model = defineModel({ type: String, required: true });
</script>

<template>
    <div
        class=":uno: flex gap-6 border-b border-hairline overflow-x-auto overflow-hidden"
        role="tablist"
    >
        <button
            v-for="item in items"
            :key="item.value"
            type="button"
            role="tab"
            :aria-selected="model === item.value"
            class=":uno: relative h-10 shrink-0 bg-transparent cursor-pointer t-label"
            :class="
                model === item.value ? ':uno: text-blue' : ':uno: text-ink-2 hover:text-ink'
            "
            @click="model = item.value"
        >
            {{ item.label
            }}<template v-if="item.count !== undefined">
                · {{ item.count }}</template
            >
            <span
                v-if="model === item.value"
                class=":uno: absolute inset-x-0 -bottom-px h-0.5 bg-blue"
            />
        </button>
    </div>
</template>
