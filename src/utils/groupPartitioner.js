/**
 * groupPartitioner.js
 * Partitions an array of approved teams into groups of `groupSize`.
 * Groups are named: Group 1, Group 2, Group 3, ...
 */

/**
 * Splits teams into groups of `groupSize`.
 * @param {Array<Object>} approvedTeams - Array of approved registration docs
 * @param {number} groupSize - Default 20
 * @returns {Array<{ groupName: string, groupNumber: number, teams: Object[] }>}
 */
export function partitionTeamsIntoGroups(approvedTeams, groupSize = 20) {
  if (!approvedTeams || approvedTeams.length === 0) return [];

  const groups = [];
  let groupNumber = 1;

  for (let i = 0; i < approvedTeams.length; i += groupSize) {
    const chunk = approvedTeams.slice(i, i + groupSize);
    groups.push({
      groupName: `Group ${groupNumber}`,
      groupNumber,
      teamCount: chunk.length,
      teams: chunk,
    });
    groupNumber++;
  }

  return groups;
}

/**
 * Assigns groupID to each registration doc using the Supabase update function.
 * @param {Array<Object>} approvedTeams - Registration docs with `.id`
 * @param {Function} updateFn - The `update(id, data)` function from useSupabaseDB
 * @param {number} groupSize
 * @returns {Promise<{ groupsCreated: number, teamsAssigned: number }>}
 */
export async function assignGroupsToSupabase(approvedTeams, updateFn, groupSize = 20) {
  const groups = partitionTeamsIntoGroups(approvedTeams, groupSize);
  let teamsAssigned = 0;

  for (const group of groups) {
    for (const team of group.teams) {
      await updateFn(team.id, { group_id: group.groupName });
      teamsAssigned++;
    }
  }

  return { groupsCreated: groups.length, teamsAssigned };
}
