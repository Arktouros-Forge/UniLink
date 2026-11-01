<script setup>
defineProps({
  title: { type: String, default: "" },
});

const open = defineModel({ type: Boolean, default: false });
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" @click.self="open = false">
      <div class="card-strong max-h-[90vh] w-full overflow-y-auto rounded-b-none bg-card p-6 sm:max-w-lg sm:rounded-b-[8px]">
        <div class="mb-4 flex items-center justify-between gap-4">
          <h2 class="type-h2">{{ title }}</h2>
          <button type="button" class="btn btn-ghost btn-sm" aria-label="Tutup" @click="open = false">
            <span class="i-keyline-x" />
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
