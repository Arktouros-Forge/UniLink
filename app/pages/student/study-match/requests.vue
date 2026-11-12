<script setup>
import { requests as copy, studyMatch } from "@app/constants/student.json";

definePageMeta({
    layout: "student",
    access: "student",
    title: "Permintaan belajar",
});
const api = useApi();
const tab = ref("incoming");
const { data, pending, refresh } = await useApiData(
    "study-requests",
    "/student/study-match/requests",
    {
        query: () => ({ box: tab.value, limit: 50 }),
        default: () => ({ requests: [], counts: {} }),
        watch: [tab],
    },
);
const tabs = computed(() => [
    {
        value: "incoming",
        label: copy.incoming,
        count: data.value.counts.pendingIncoming,
    },
    {
        value: "outgoing",
        label: copy.outgoing,
        count: data.value.counts.pendingOutgoing,
    },
    { value: "history", label: copy.history },
]);
watch(
    tab,
    (value) =>
        value === "history" && navigateTo("/student/study-match/history"),
);

const respond = (action, message) =>
    useAction(
        async (item) => {
            await api.patch(`/student/study-match/requests/${item.id}`, {
                action,
            });
            await refresh();
        },
        { success: message },
    );
const accept = respond("accept", studyMatch.accepted);
const decline = respond("decline", studyMatch.declined);
const cancel = respond("cancel", studyMatch.cancelled);
</script>

<template>
    <PageHeading :title="copy.title" :text="copy.text">
        <UiButton variant="secondary" to="/student/study-match/history">{{
            copy.viewHistory
        }}</UiButton>
    </PageHeading>
    <UiTabs v-model="tab" :items="tabs" />
    <AutoSkeleton :loading="pending" id="requests-list">
        <div class=":uno: flex flex-col gap-4">
            <RequestRow
                v-for="item in data.requests"
                :key="item.id"
                :item="item"
                actions
                @accept="accept.run($event)"
                @decline="decline.run($event)"
                @cancel="cancel.run($event)"
            />
            <UiEmpty
                v-if="!data.requests.length"
                :title="copy.emptyTitle"
                icon="inbox"
            />
        </div>
    </AutoSkeleton>
    <UiCallout :title="copy.noteTitle">{{ copy.noteText }}</UiCallout>
</template>
