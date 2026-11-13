<script setup>
const props = defineProps({
    label: { type: String, required: true },
    hint: { type: String, default: "" },
    error: { type: String, default: "" },
    optional: { type: Boolean, default: false },
});
const id = useId();
const invalid = computed(() => !!props.error);
provide("fieldInvalid", invalid);
provide("fieldDescribedBy", computed(() => (props.error || props.hint ? `${id}-note` : undefined)));
</script>

<template>
    <div class=":uno: flex flex-col gap-1.5">
        <label
            :for="id"
            class=":uno: t-label"
            :class="invalid ? ':uno: text-danger' : ':uno: text-ink'"
            >{{ label
            }}<span v-if="optional" class=":uno: text-ink-3 font-normal">
                (opsional)</span
            ></label
        >
        <slot :id="id" :invalid="invalid" />
        <p
            v-if="error"
            :id="`${id}-note`"
            role="alert"
            class=":uno: t-body-xs text-danger m-0 flex items-start gap-1.5"
        >
            <UiIcon name="alert" size="text-base" class=":uno: mt-px" />
            <span>{{ error }}</span>
        </p>
        <p v-else-if="hint" :id="`${id}-note`" class=":uno: t-body-xs text-ink-2 m-0">
            {{ hint }}
        </p>
    </div>
</template>
