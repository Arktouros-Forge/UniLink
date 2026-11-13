<script setup>
const props = defineProps({
    rows: { type: Array, required: true },
    height: { type: Number, default: 120 },
    unit: { type: String, default: "" },
});
const tones = ["bg-blue", "bg-red", "bg-yellow"];
const peak = computed(() =>
    Math.max(1, ...props.rows.map((row) => row.value)),
);
const side = (index) =>
    index === 0
        ? ":uno: left-0"
        : index === props.rows.length - 1 && props.rows.length > 2
          ? ":uno: right-0"
          : ":uno: left-1/2 -translate-x-1/2";
</script>

<template>
    <div class=":uno: flex flex-col gap-3">
        <div
            class=":uno: flex items-end gap-2 md:gap-4 border-b border-hairline"
            :style="{ height: `${height}px` }"
        >
            <div
                v-for="(row, index) in rows"
                :key="row.label"
                tabindex="0"
                role="img"
                :aria-label="`${row.label}: ${row.value}${unit}`"
                class=":uno: group relative flex-1 h-full flex items-end cursor-default outline-none"
            >
                <span
                    class=":uno: block w-full rounded-t-[2px] transition-opacity group-hover:opacity-80 group-focus:opacity-80"
                    :class="tones[index % 3]"
                    :style="{
                        height: `${(row.value / peak) * 100}%`,
                        minHeight: row.value ? '2px' : '0',
                    }"
                />
                <span
                    role="tooltip"
                    class=":uno: absolute z-10 px-2 py-1 rounded-sm bg-ink text-paper t-mono-s whitespace-nowrap pointer-events-none opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
                    :class="side(index)"
                    :style="{ bottom: `calc(${(row.value / peak) * 100}% + 6px)` }"
                    >{{ row.label }}: {{ row.value }}{{ unit }}</span
                >
            </div>
        </div>
        <div class=":uno: flex gap-2 md:gap-4">
            <span
                v-for="row in rows"
                :key="row.label"
                class=":uno: flex-1 min-w-0 truncate text-center t-mono-s text-ink"
                >{{ row.label }}</span
            >
        </div>
    </div>
</template>
