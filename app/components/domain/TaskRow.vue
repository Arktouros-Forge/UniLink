<script setup>
defineProps({ item: { type: Object, required: true } });
defineEmits(["toggle", "edit", "remove"]);
</script>

<template>
  <UiCard as="article" padding="p-4" class="flex items-center gap-4">
    <UiCheckbox :model-value="item.done" @update:model-value="$emit('toggle', item)" />
    <div class="flex-1 min-w-0 flex flex-col gap-1">
      <p class="t-body-s text-ink m-0 truncate">{{ item.title }}</p>
      <p class="t-body-xs text-blue m-0 flex items-center gap-1 truncate">{{ item.course }}<UiIcon name="external" size="text-xs" /></p>
    </div>
    <UiChip :tone="item.urgent ? 'yellow' : 'neutral'" :filled="item.urgent" size="md">{{ item.time }}</UiChip>
    <UiButton variant="link" size="sm" @click="$emit('edit', item)">Edit</UiButton>
    <UiButton variant="link" size="sm" @click="$emit('remove', item)">Hapus</UiButton>
  </UiCard>
</template>
