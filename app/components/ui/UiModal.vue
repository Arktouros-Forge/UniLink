<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  eyebrow: { type: String, default: "" },
  text: { type: String, default: "" },
  width: { type: String, default: "sm:max-w-[520px]" },
  submit: { type: String, default: "" },
  submitIcon: { type: String, default: "check" },
  cancel: { type: String, default: "Batal" },
  pending: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  danger: { type: Boolean, default: false },
});
const emit = defineEmits(["close", "submit"]);

const onKey = (event) => {
  if (event.key === "Escape" && props.open) emit("close");
};
watch(
  () => props.open,
  (value) => {
    if (import.meta.client) document.documentElement.style.overflow = value ? "hidden" : "";
  },
);
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  if (import.meta.client) document.documentElement.style.overflow = "";
});
</script>

<template>
  <ClientOnly><Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center bg-backdrop sm:items-center sm:p-6" @click.self="emit('close')">
      <div class="relative w-full max-h-[92dvh] flex flex-col bg-elevated shadow-modal rounded-t-lg sm:rounded-lg border border-hairline overflow-hidden" :class="width" role="dialog" aria-modal="true">
        <div class="grid grid-cols-[2fr_3fr_1fr] h-1.5 shrink-0" aria-hidden="true"><span class="bg-red" /><span class="bg-blue" /><span class="bg-yellow" /></div>
        <header class="flex items-start justify-between gap-3 px-5 pt-4 pb-1">
          <div class="flex flex-col gap-1 min-w-0 flex-1">
            <p v-if="eyebrow" class="t-mono-s text-ink-3 m-0 uppercase">{{ eyebrow }}</p>
            <h2 class="t-d4 text-ink m-0">{{ title }}</h2>
            <p v-if="text" class="t-body-s text-ink-2 m-0">{{ text }}</p>
          </div>
          <UiIconButton icon="close" label="Tutup" class="!size-9 -mr-2 -mt-1 shrink-0" @click="emit('close')" />
        </header>
        <div class="px-5 py-4 overflow-y-auto flex flex-col gap-4"><slot /></div>
        <footer v-if="submit || $slots.footer" class="flex flex-row-reverse items-center gap-2 px-5 py-3 border-t border-hairline bg-paper/50">
          <slot name="footer">
            <UiButton :variant="danger ? 'danger' : 'primary'" :icon="danger ? '' : submitIcon" :loading="pending" :disabled="disabled" class="flex-1 sm:flex-none" @click="emit('submit')">{{ submit }}</UiButton>
            <UiButton variant="secondary" class="flex-1 sm:flex-none" @click="emit('close')">{{ cancel }}</UiButton>
          </slot>
        </footer>
      </div>
    </div>
  </Teleport></ClientOnly>
</template>
