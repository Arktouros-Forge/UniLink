<script setup>
import navigation from "@app/constants/navigation.json";
</script>

<template>
  <AppShell :items="navigation.admin" :mobile-items="navigation.admin.slice(0, 5)"><slot /></AppShell>
</template>
