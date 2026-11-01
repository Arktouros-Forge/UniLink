<script setup>
defineProps({
  items: { type: Array, required: true },
});

const model = defineModel({ type: String, default: "" });
</script>

<template>
  <div class="flex gap-1 overflow-x-auto border-b border-rule">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      class="type-body whitespace-nowrap border-b-2 px-4 py-2.5 font-medium transition"
      :class="model === item.value ? 'border-brand-blue text-ink' : 'border-transparent text-mute hover:text-ink'"
      @click="model = item.value"
    >
      {{ item.label }}
      <span v-if="item.count" class="chip ml-1.5 bg-soft text-ink">{{ item.count }}</span>
    </button>
  </div>
</template>
