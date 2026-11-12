<script setup>
defineProps({ aside: { type: String, default: "320px" } });
</script>

<template>
    <div
        class=":uno: grid gap-6 md:items-start"
        :style="{ '--aside': aside }"
        :class="
            $slots.aside
                ? ':uno: md:grid-cols-[minmax(0,1fr)_var(--aside)]'
                : ''
        "
    >
        <div class=":uno: flex flex-col gap-6 min-w-0"><slot /></div>
        <aside v-if="$slots.aside" class=":uno: flex flex-col gap-4 min-w-0">
            <slot name="aside" />
        </aside>
    </div>
</template>
