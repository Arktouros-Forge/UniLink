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
  <nav class="grid gap-1">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="type-body flex items-center gap-3 rounded-[8px] px-3 py-2.5 font-medium transition"
      :class="activeTo === item.to ? 'bg-soft text-ink' : 'text-mute hover:bg-soft hover:text-ink'"
    >
      <span :class="item.icon" />
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
