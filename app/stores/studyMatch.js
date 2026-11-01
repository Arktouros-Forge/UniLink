import { defineStore } from "pinia";
import { computed, ref } from "vue";
import requestsData from "@app/constants/mock/requests.json";
import signsData from "@app/constants/mock/signs.json";
import { limits } from "@app/constants/options.json";
import { addDays } from "@app/utils/format";
import { useAuthStore } from "@app/stores/auth";
import { useUsersStore } from "@app/stores/users";

const responderOf = (request) => (request.initiatedBy === "requester" ? request.helperId : request.requesterId);
const initiatorOf = (request) => (request.initiatedBy === "requester" ? request.requesterId : request.helperId);

export const useStudyMatchStore = defineStore("studyMatch", () => {
  const auth = useAuthStore();
  const users = useUsersStore();
  const requests = ref([...requestsData]);
  const signs = ref([...signsData]);

  const me = computed(() => auth.currentId);
  const incoming = computed(() => requests.value.filter((item) => item.status === "pending" && responderOf(item) === me.value));
  const outgoing = computed(() => requests.value.filter((item) => item.status === "pending" && initiatorOf(item) === me.value));
  const history = computed(() => requests.value.filter((item) => item.status !== "pending" && [item.requesterId, item.helperId].includes(me.value)));
  const openSigns = computed(() => signs.value.filter((item) => item.status === "open"));
  const mySigns = computed(() => signs.value.filter((item) => item.userId === me.value));

  const counterpart = (request) => users.byId[request.requesterId === me.value ? request.helperId : request.requesterId];

  const helpersFor = (skillIds = [], query = "") =>
    users.students
      .filter((user) => user.id !== me.value && user.status === "active")
      .map((user) => ({ user, matches: user.skillIds.filter((id) => !skillIds.length || skillIds.includes(id)) }))
      .filter(({ user, matches }) => matches.length && user.skillIds.length && (!query || user.fullName.toLowerCase().includes(query.toLowerCase())));

  const canSend = computed(() => outgoing.value.length < limits.pendingRequests);

  const send = ({ helperId, subject, description, preferredTime = "" }) => {
    requests.value = [
      { id: `r${Date.now()}`, requesterId: me.value, helperId, initiatedBy: "requester", signId: "", subject, description, preferredTime, status: "pending", createdAt: new Date().toISOString(), expiresAt: addDays(limits.requestDays) },
      ...requests.value,
    ];
  };

  const respond = (id, status) => {
    const target = requests.value.find((item) => item.id === id);
    if (!target) return;
    requests.value = requests.value.map((item) => {
      if (item.id === id) return { ...item, status };
      if (status === "accepted" && target.signId && item.signId === target.signId && item.status === "pending") return { ...item, status: "cancelled" };
      return item;
    });
    if (status === "accepted" && target.signId) signs.value = signs.value.map((sign) => (sign.id === target.signId ? { ...sign, status: "fulfilled" } : sign));
  };

  const postSign = ({ skillId, title, description, preferredTime = "" }) => {
    signs.value = [
      { id: `g${Date.now()}`, userId: me.value, skillId, title, description, preferredTime, status: "open", createdAt: new Date().toISOString(), expiresAt: addDays(limits.signDays) },
      ...signs.value,
    ];
  };

  const closeSign = (id) => {
    signs.value = signs.value.map((sign) => (sign.id === id ? { ...sign, status: "closed" } : sign));
    requests.value = requests.value.map((item) => (item.signId === id && item.status === "pending" ? { ...item, status: "cancelled" } : item));
  };

  const offerHelp = ({ signId, message }) => {
    const sign = signs.value.find((item) => item.id === signId);
    if (!sign) return;
    requests.value = [
      { id: `r${Date.now()}`, requesterId: sign.userId, helperId: me.value, initiatedBy: "helper", signId, subject: sign.title, description: message, preferredTime: "", status: "pending", createdAt: new Date().toISOString(), expiresAt: addDays(limits.requestDays) },
      ...requests.value,
    ];
  };

  return { requests, signs, incoming, outgoing, history, openSigns, mySigns, canSend, counterpart, helpersFor, send, respond, postSign, closeSign, offerHelp };
});
