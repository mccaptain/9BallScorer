export const SL_TARGETS = {
  1: 14, 2: 19, 3: 25, 4: 31, 5: 38,
  6: 46, 7: 55, 8: 65, 9: 75,
};

// Match points table: row = loser's SL, columns = (winner-losuer) split,
// cell value = loser's point range that produces that split.
const MP_TABLE = `Loser's S/L,20-0,19-1,18-2,17-3,16-4,15-5,14-6,13-7,12-8
1,less than 3,3,4,5&6,7,8,9&10,11,12&13
2,less than 4,4&5,6&7,8,9&10,11&12,13&14,15&16,17&18
3,less than 5,5&6,7-9,10&11,12-14,15&16,17-19,20&21,22-24
4,less than 6,6-8,9-11,12-14,15-18,19-21,22-24,25-27,28-30
5,less than 7,7-10,11-14,15-18,19-22,23-26,27-29,30-33,34-37
6,less than 9,9-12,13-17,18-22,23-27,28-31,32-36,37-40,41-45
7,less than 11,11-15,16-21,22-26,27-32,33-37,38-43,44-49,50-54
8,less than 14,14-19,20-26,27-32,33-39,40-45,46-52,53-58,59-64
9,less than 18,18-24,25-31,32-38,39-46,47-53,54-60,61-67,68-74`;

function parseRange(s) {
  s = s.trim();
  if (s.startsWith('less than ')) {
    const n = parseInt(s.slice(10), 10);
    return (pts) => pts < n;
  }
  if (s.includes('&')) {
    const [a, b] = s.split('&').map(Number);
    return (pts) => pts === a || pts === b;
  }
  if (s.includes('-')) {
    const [a, b] = s.split('-').map(Number);
    return (pts) => pts >= a && pts <= b;
  }
  const n = parseInt(s, 10);
  return (pts) => pts === n;
}

const MATCH_POINTS_LOOKUP = {};
(function parseTable() {
  const rows = MP_TABLE.trim().split('\n');
  const headers = rows[0].split(',');
  const splits = headers.slice(1).map((h) => {
    const [w, l] = h.split('-').map(Number);
    return { winner: w, loser: l };
  });
  for (let i = 1; i < rows.length; i++) {
    const parts = rows[i].split(',');
    const loserSL = parseInt(parts[0], 10);
    MATCH_POINTS_LOOKUP[loserSL] = [];
    for (let j = 1; j < parts.length; j++) {
      MATCH_POINTS_LOOKUP[loserSL].push({
        match: (pts) => parseRange(parts[j])(pts),
        split: splits[j - 1],
      });
    }
  }
})();

export function getMatchPoints(loserSL, loserPts) {
  const row = MATCH_POINTS_LOOKUP[loserSL];
  if (!row) return { winner: 20, loser: 0 };
  for (const col of row) {
    if (col.match(loserPts)) return col.split;
  }
  return { winner: 20, loser: 0 };
}

export function createMatch(p1Name, p2Name, sl1, sl2) {
  return {
    p1: { name: p1Name, sl: sl1, target: SL_TARGETS[sl1], points: 0 },
    p2: { name: p2Name, sl: sl2, target: SL_TARGETS[sl2], points: 0 },
    rack: createRack(1),
    history: [],
    winner: null,
  };
}

export function createRack(num, shooter = 1) {
  return { num, shooter, p1: {}, p2: {}, winner: null };
}

export function toggleBall(match, playerNum, ball) {
  const rack = { ...match.rack, p1: { ...match.rack.p1 }, p2: { ...match.rack.p2 } };
  const s = playerNum === 1 ? rack.p1 : rack.p2;
  const cur = s[ball];
  if (ball === 9) {
    if (cur === 'made') delete s[ball];
    else s[ball] = 'made';
  } else {
    if (cur === 'made') s[ball] = 'dead';
    else if (cur === 'dead') delete s[ball];
    else s[ball] = 'made';
  }
  return { ...match, rack };
}

export function clearRack(match) {
  return { ...match, rack: createRack(match.rack.num, match.rack.shooter) };
}

function countPoints(pocketed) {
  let pts = 0;
  for (let b = 1; b <= 9; b++) {
    if (pocketed[b] === 'made') {
      pts += b === 9 ? 2 : 1;
    }
  }
  return pts;
}

function madeBall(pocketed, ball) {
  return pocketed[ball] === 'made';
}

export function submitRack(match) {
  const { rack, p1, p2, history } = match;
  const p1Pts = countPoints(rack.p1);
  const p2Pts = countPoints(rack.p2);
  const p1Made9 = madeBall(rack.p1, 9);
  const p2Made9 = madeBall(rack.p2, 9);

  let winner = null;
  if (p1Made9 && !p2Made9) winner = 1;
  else if (p2Made9 && !p1Made9) winner = 2;
  else if (p1Pts > 0 && p1Pts > p2Pts) winner = 1;
  else if (p2Pts > 0 && p2Pts > p1Pts) winner = 2;

  const snapshot = {
    num: rack.num,
    p1: { ...rack.p1 },
    p2: { ...rack.p2 },
    winner,
  };

  const newMatch = {
    ...match,
    p1: { ...p1, points: p1.points + p1Pts },
    p2: { ...p2, points: p2.points + p2Pts },
    history: [...history, snapshot],
    rack: createRack(history.length + 1, winner === 1 ? 2 : winner === 2 ? 1 : 1),
    winner: null,
  };

  if (newMatch.p1.points >= newMatch.p1.target) {
    newMatch.winner = 1;
    newMatch.matchPoints = getMatchPoints(newMatch.p2.sl, newMatch.p2.points);
  } else if (newMatch.p2.points >= newMatch.p2.target) {
    newMatch.winner = 2;
    newMatch.matchPoints = getMatchPoints(newMatch.p1.sl, newMatch.p1.points);
  }

  return newMatch;
}
