<script setup>
const props = defineProps({
  items: { type: Array, required: true },
});

const route = useRoute();

const activeTo = computed(() => {
  const matches = props.items.filter((item) => route.path === item.to || route.path.startsWith(`${item.to}/`));
  return matches.sort((a, b) => b.to.length - a.to.length)[0]?.to;
});
</script>

<template>
  <nav class="fixed inset-x-0 bottom-0 z-40 grid grid-flow-col auto-cols-fr border-t border-rule bg-paper md:hidden">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="type-meta flex flex-col items-center gap-1 py-2.5"
      :class="activeTo === item.to ? 'text-brand-blue' : 'text-mute'"
    >
      <span class="text-xl" :class="item.icon" />
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
