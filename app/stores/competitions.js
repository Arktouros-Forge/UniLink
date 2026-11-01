import { defineStore } from "pinia";
import { ref } from "vue";
import competitionsData from "@app/constants/mock/competitions.json";
import teamsData from "@app/constants/mock/teams.json";
import { createCrud } from "@app/utils/crud";
import { isPast } from "@app/utils/format";

export const useCompetitionsStore = defineStore("competitions", () => {
  const competitions = ref([...competitionsData]);
  const teams = ref([...teamsData]);
  const crud = createCrud(competitions, "k");
  const teamCrud = createCrud(teams, "t");

  const published = () => competitions.value.filter((item) => item.status !== "draft");
  const teamsFor = (competitionId) => teams.value.filter((team) => team.competitionId === competitionId);
  const teamOf = (competitionId, userId) =>
    teamsFor(competitionId).find((team) => team.members.some((member) => member.userId === userId && member.status === "accepted"));
  const acceptedCount = (team) => team.members.filter((member) => member.status === "accepted").length;
  const isClosed = (competition) => competition.status === "closed" || isPast(competition.deadline);

  const patchTeam = (id, patch) => teamCrud.update(id, patch);
  const updateMembers = (id, fn) => {
    const team = teams.value.find((item) => item.id === id);
    if (team) patchTeam(id, { members: fn(team.members) });
  };

  const createTeam = (data, userId) =>
    teamCrud.add({ ...data, creatorId: userId, result: "unknown", members: [{ userId, status: "accepted" }] });
  const requestJoin = (id, userId) => updateMembers(id, (members) => [...members, { userId, status: "pending" }]);
  const acceptMember = (id, userId) => updateMembers(id, (members) => members.map((m) => (m.userId === userId ? { ...m, status: "accepted" } : m)));
  const removeMember = (id, userId) => updateMembers(id, (members) => members.filter((m) => m.userId !== userId));
  const reportResult = (id, result) => patchTeam(id, { result });

  return {
    competitions,
    teams,
    published,
    teamsFor,
    teamOf,
    acceptedCount,
    isClosed,
    createTeam,
    requestJoin,
    acceptMember,
    removeMember,
    reportResult,
    add: crud.add,
    update: crud.update,
    remove: crud.remove,
  };
});
