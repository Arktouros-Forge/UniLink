<script setup>
const props = defineProps({
    invalid: { type: Boolean, default: false },
    id: { type: String, default: undefined },
    options: { type: Array, required: true },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
});
const model = defineModel({ type: [String, Number], default: "" });
const { invalid: isInvalid, describedBy } = useFieldState(props);
</script>

<template>
    <div class=":uno: relative">
        <select
            :id="id"
            v-model="model"
            :aria-invalid="isInvalid || undefined"
            :aria-describedby="describedBy"
            class=":uno: w-full h-10 appearance-none rounded-md border text-ink t-body-s pl-3 pr-10 outline-none"
            :class="
                isInvalid
                    ? ':uno: border-danger bg-danger-soft'
                    : ':uno: border-hairline bg-card focus:border-blue'
            "
            :disabled="disabled"
        >
            <option v-if="placeholder" value="" disabled>
                {{ placeholder }}
            </option>
            <option
                v-for="option in options"
                :key="option.value ?? option"
                :value="option.value ?? option"
            >
                {{ option.label ?? option }}
            </option>
        </select>
        <UiIcon
            :name="disabled ? 'lock' : 'chevronDown'"
            class=":uno: absolute right-3 top-1/2 -translate-y-1/2 text-ink-2 pointer-events-none"
        />
    </div>
</template>
