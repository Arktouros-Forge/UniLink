<script setup>
import { useStudyMatchStore } from "@app/stores/studyMatch";
import { formatDate, waLink } from "@app/utils/format";

const props = defineProps({
  request: { type: Object, required: true },
});

const studyMatch = useStudyMatchStore();
const other = computed(() => studyMatch.counterpart(props.request));
</script>

<template>
  <AppCard class="grid gap-3">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <AppAvatar :name="other?.fullName" />
        <div>
          <p class="type-body font-medium">{{ other?.fullName }}</p>
          <p class="type-meta text-mute">{{ formatDate(request.createdAt) }}</p>
        </div>
      </div>
      <StatusChip group="requestStatus" :value="request.status" />
    </div>
    <div>
      <p class="type-body font-medium">{{ request.subject }}</p>
      <p class="type-small text-mute">{{ request.description }}</p>
    </div>
    <div class="flex flex-wrap gap-2">
      <slot />
      <AppButton v-if="request.status === 'accepted' && other" :href="waLink(other.phone)" variant="secondary" size="sm">
        <span class="i-keyline-phone" />WhatsApp
      </AppButton>
    </div>
  </AppCard>
</template>
