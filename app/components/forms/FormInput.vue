<script setup>
defineProps({
  id: { type: String, default: undefined },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  icon: { type: String, default: "" },
  iconStart: { type: String, default: "" },
  invalid: { type: Boolean, default: false },
  locked: { type: Boolean, default: false },
});
const model = defineModel({ type: [String, Number], default: "" });
const emit = defineEmits(["icon"]);
</script>

<template>
  <div class="relative">
    <UiIcon v-if="iconStart" :name="iconStart" class="absolute left-3 top-1/2 -translate-y-1/2 text-ink-2 pointer-events-none" />
    <input
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :readonly="locked"
      class="w-full h-11 rounded-md border bg-card text-ink t-body-s outline-none transition-shadow"
      :class="[
        iconStart ? 'pl-10' : 'pl-3',
        icon ? 'pr-11' : 'pr-3',
        invalid ? 'border-danger' : 'border-hairline',
        locked ? '!bg-blue-soft' : 'focus:border-blue focus:shadow-[0_0_0_2px_var(--canvas-paper),0_0_0_4px_var(--brand-blue)]',
      ]"
    />
    <button v-if="icon" type="button" tabindex="-1" class="absolute right-1 top-1 size-9 inline-flex items-center justify-center bg-transparent border-0 text-ink-2 cursor-pointer" @click="emit('icon')">
      <UiIcon :name="icon" />
    </button>
  </div>
</template>
