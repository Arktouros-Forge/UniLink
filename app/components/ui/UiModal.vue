<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: "" },
  text: { type: String, default: "" },
});
defineEmits(["close"]);
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-0 md:p-5" @click.self="$emit('close')">
      <div class="w-full md:max-w-[480px] max-h-[92dvh] overflow-y-auto bg-card border border-edge rounded-t-2xl md:rounded-lg p-6 flex flex-col gap-5">
        <div class="flex items-start justify-between gap-4">
          <div class="flex flex-col gap-1.5">
            <h2 class="type-h3">{{ title }}</h2>
            <p v-if="text" class="type-small">{{ text }}</p>
          </div>
          <button class="size-9 shrink-0 inline-flex items-center justify-center rounded-lg bg-transparent border-0 text-ink cursor-pointer hover:bg-soft" @click="$emit('close')">
            <span class="i-keyline-icons-x text-xl" />
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
