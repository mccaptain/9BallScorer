export function createTeamMatch(teamA, teamB, tournament = false) {
  const slots = [];
  for (let i = 0; i < 5; i++) {
    slots.push({
      id: i + 1,
      status: 'pending',
      aPlayer: null,
      bPlayer: null,
      aSl: null,
      bSl: null,
      match: null,
      forfeit: null,
    });
  }
  return {
    teamA: { name: teamA },
    teamB: { name: teamB },
    tournament,
    slots,
  };
}

function matchPointsForSlot(slot) {
  if (slot.status === 'forfeit') {
    return slot.forfeit.awardedTo === 'A'
      ? { A: slot.forfeit.pts, B: 0 }
      : { A: 0, B: slot.forfeit.pts };
  }
  if (slot.status === 'completed' && slot.match && slot.match.winner) {
    const w = slot.match.winner === 1 ? 'A' : 'B';
    const l = slot.match.winner === 1 ? 'B' : 'A';
    const points = slot.match.matchPoints;
    return { [w]: points.winner, [l]: points.loser };
  }
  return { A: 0, B: 0 };
}

export function calculateTeamTotals(teamMatch) {
  let totalA = 0;
  let totalB = 0;
  for (const slot of teamMatch.slots) {
    const pts = matchPointsForSlot(slot);
    totalA += pts.A;
    totalB += pts.B;
  }
  return { A: totalA, B: totalB, winner: totalA > totalB ? 'A' : totalB > totalA ? 'B' : null };
}

export function forfeitSlot(teamMatch, slotId, awardedTo, tournament = false) {
  const pts = tournament ? 20 : 15;
  return {
    ...teamMatch,
    slots: teamMatch.slots.map((s) =>
      s.id === slotId
        ? { ...s, status: 'forfeit', match: null, forfeit: { awardedTo, pts } }
        : s
    ),
  };
}

export function saveSlotProgress(teamMatch, slotId, match) {
  return {
    ...teamMatch,
    slots: teamMatch.slots.map((s) =>
      s.id === slotId
        ? { ...s, status: 'active', match, forfeit: null, aPlayer: match.p1.name, bPlayer: match.p2.name, aSl: match.p1.sl, bSl: match.p2.sl }
        : s
    ),
  };
}

export function completeSlot(teamMatch, slotId, match) {
  return {
    ...teamMatch,
    slots: teamMatch.slots.map((s) =>
      s.id === slotId
        ? { ...s, status: 'completed', match, forfeit: null, aPlayer: match.p1.name, bPlayer: match.p2.name, aSl: match.p1.sl, bSl: match.p2.sl }
        : s
    ),
  };
}
