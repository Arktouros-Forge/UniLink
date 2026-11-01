<script setup>
import navigation from "@app/constants/navigation.json";
</script>

<template>
  <AppShell :items="navigation.student" :mobile-items="navigation.studentMobile"><slot /></AppShell>
</template>
