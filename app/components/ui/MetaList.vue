<script setup>
defineProps({ items: { type: Array, required: true } });
</script>

<template>
  <dl class="m-0 flex flex-col gap-4">
    <div v-for="item in items" :key="item.label" class="flex items-start gap-3">
      <UiIcon :name="item.icon" size="text-xl" class="text-ink-2 mt-0.5" />
      <div class="min-w-0 flex flex-col gap-0.5">
        <dt class="t-body-xs text-ink-2">{{ item.label }}</dt>
        <dd class="m-0 text-ink break-words" :class="item.mono ? 't-mono-m' : 't-body-s'">
          <a v-if="item.href" :href="item.href" target="_blank" rel="noopener" class="text-blue hover:underline">{{ item.value }}</a>
          <template v-else>{{ item.value }}</template>
        </dd>
      </div>
    </div>
  </dl>
</template>
