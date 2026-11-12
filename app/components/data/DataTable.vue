<script setup>
const props = defineProps({
    columns: { type: Array, required: true },
    rows: { type: Array, required: true },
    selectable: { type: Boolean, default: false },
    total: { type: Number, default: 0 },
    noun: { type: String, default: "data" },
    pageSize: { type: Number, default: 5 },
});
const selected = defineModel("selected", { type: Array, default: () => [] });
const page = defineModel("page", { type: Number, default: 1 });

const pages = computed(() =>
    Math.max(1, Math.ceil((props.total || props.rows.length) / props.pageSize)),
);
const allSelected = computed(
    () => props.rows.length > 0 && selected.value.length === props.rows.length,
);
const toggleAll = () =>
    (selected.value = allSelected.value ? [] : props.rows.map((row) => row.id));
const toggleRow = (id) =>
    (selected.value = selected.value.includes(id)
        ? selected.value.filter((item) => item !== id)
        : [...selected.value, id]);
const gridCols = computed(
    () =>
        `${props.selectable ? "40px " : ""}${props.columns.map((column) => column.width || "1fr").join(" ")}`,
);
</script>

<template>
    <div class=":uno: surface overflow-x-auto">
        <div class=":uno: min-w-[720px]">
            <div
                class=":uno: grid items-center gap-4 px-4 h-[44px] bg-paper/60 border-b border-hairline t-body-s text-ink-2"
                :style="{ gridTemplateColumns: gridCols }"
            >
                <UiCheckbox
                    v-if="selectable"
                    :model-value="allSelected"
                    :indeterminate="selected.length > 0 && !allSelected"
                    @update:model-value="toggleAll"
                />
                <span v-for="column in columns" :key="column.key">{{
                    column.label
                }}</span>
            </div>
            <div
                v-for="row in rows"
                :key="row.id"
                class=":uno: grid items-center gap-4 px-4 h-[49px] border-b border-hairline last:border-0 t-body-s text-ink transition-colors"
                :class="
                    selected.includes(row.id)
                        ? ':uno: bg-blue-soft'
                        : ':uno: hover:bg-paper/60'
                "
                :style="{ gridTemplateColumns: gridCols }"
            >
                <UiCheckbox
                    v-if="selectable"
                    :model-value="selected.includes(row.id)"
                    @update:model-value="toggleRow(row.id)"
                />
                <div
                    v-for="column in columns"
                    :key="column.key"
                    class=":uno: min-w-0 truncate"
                >
                    <slot
                        :name="`cell-${column.key}`"
                        :row="row"
                        :value="row[column.key]"
                        >{{ row[column.key] }}</slot
                    >
                </div>
            </div>
            <slot v-if="!rows.length" name="empty" />
            <div
                class=":uno: flex items-center justify-between gap-4 px-4 h-[44px] border-t border-hairline t-body-s text-ink-2"
            >
                <span
                    >1–{{ rows.length }} dari {{ total || rows.length }}
                    {{ noun
                    }}<template v-if="selectable && selected.length">
                        · {{ selected.length }} dipilih</template
                    ></span
                >
                <UiPagination v-model="page" :pages="pages" />
            </div>
        </div>
    </div>
</template>
