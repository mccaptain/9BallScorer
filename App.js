import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  createMatch,
  toggleBall,
  clearRack,
  submitRack,
  SL_TARGETS,
  getMatchPoints,
} from './src/utils/scoring';
import { createTeamMatch, completeSlot, saveSlotProgress } from './src/utils/teamMatch';
import PlayerCard from './src/components/PlayerCard';
import BallGrid from './src/components/BallGrid';
import ConfirmModal from './src/components/ConfirmModal';
import NameEditModal from './src/components/NameEditModal';
import TeamSetupScreen from './src/components/TeamSetupScreen';
import MatchListScreen from './src/components/MatchListScreen';
import AccessibilityModal from './src/components/AccessibilityModal';
import { AccessibilityProvider, useAccessibility } from './src/context/AccessibilityContext';

function PlayerSection({ player, rack, otherRack, onToggle, onNamePress, rackPts, disabled }) {
  return (
    <View style={pStyles.section}>
      <PlayerCard
        name={player.name}
        sl={player.sl}
        points={player.points}
        target={player.target}
        rackPts={rackPts}
        onNamePress={onNamePress}
      />
      <BallGrid
        myPocketed={rack}
        otherPocketed={otherRack}
        onToggle={onToggle}
        disabled={disabled}
      />
    </View>
  );
}

const pStyles = StyleSheet.create({
  section: { flex: 1, gap: 10 },
});

export default function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}

function useStyles(theme) {
  return useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, backgroundColor: theme.surface, borderBottomWidth: 1, borderBottomColor: theme.border },
    headerLandscape: { paddingVertical: 6 },
    backBtn: { width: 70, paddingLeft: 12 },
    backBtnText: { color: theme.textSecondary, fontSize: 14 },
    gearIconBtn: { width: 70, alignItems: 'flex-end', paddingRight: 12 },
    gearIconText: { color: theme.textSecondary, fontSize: 20 },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 8 },
    clearBtnL: { backgroundColor: theme.btnNeutral, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
    clearBtnLText: { color: theme.btnNeutralText, fontSize: 14, fontWeight: 'bold' },
    nextBtnL: { backgroundColor: theme.btnPrimary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
    nextBtnLDisabled: { backgroundColor: theme.btnDisabled, opacity: 0.5 },
    nextBtnLText: { color: theme.btnPrimaryText, fontSize: 14, fontWeight: 'bold' },
    nextBtnLTextDisabled: { color: theme.btnDisabledText },
    gearBtnL: { padding: 6 },
    gearBtnLText: { color: theme.textSecondary, fontSize: 22 },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerCenterLeft: { alignItems: 'flex-start', paddingLeft: 4 },
    titleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.gold },
    headerSub: { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
    mainPortrait: { flex: 1, padding: 10, justifyContent: 'center' },
    mainLandscape: { flex: 1, flexDirection: 'row', padding: 10 },
    dividerH: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
    dividerV: { width: 1, backgroundColor: theme.border, marginHorizontal: 8 },
    bottom: { flexDirection: 'row', padding: 12, gap: 10 },
    clearBtn: { flex: 1, backgroundColor: theme.btnNeutral, borderRadius: 10, padding: 16, alignItems: 'center' },
    clearBtnText: { color: theme.btnNeutralText, fontSize: 16, fontWeight: 'bold' },
    nextBtn: { flex: 1, backgroundColor: theme.btnPrimary, borderRadius: 10, padding: 16, alignItems: 'center' },
    nextBtnDisabled: { backgroundColor: theme.btnDisabled, opacity: 0.5 },
    nextBtnText: { color: theme.btnPrimaryText, fontSize: 16, fontWeight: 'bold' },
    nextBtnTextDisabled: { color: theme.btnDisabledText },
    homeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20, padding: 24 },
    homeTitle: { fontSize: 36, fontWeight: 'bold', color: theme.gold, marginBottom: 20 },
    homeBtn: { backgroundColor: theme.btnPrimary, borderRadius: 12, padding: 18, paddingHorizontal: 48 },
    homeBtnText: { color: theme.btnPrimaryText, fontSize: 20, fontWeight: 'bold' },
    gearBtn: { marginTop: 12, padding: 12 },
    gearBtnText: { color: theme.textSecondary, fontSize: 16 },
    winnerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    trophy: { fontSize: 64, marginBottom: 16 },
    winnerTitle: { fontSize: 32, fontWeight: 'bold', color: theme.gold, marginBottom: 8 },
    winnerName: { fontSize: 24, color: theme.textPrimary, marginBottom: 20 },
    winnerScore: { fontSize: 16, color: theme.textMuted, marginBottom: 4 },
    matchPtsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
    matchPtsBox: { backgroundColor: theme.surfaceLight, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.gold, flex: 1 },
    matchPtsLabel: { fontSize: 11, color: theme.textMuted, marginBottom: 4 },
    matchPtsValue: { fontSize: 26, fontWeight: 'bold', color: theme.gold },
    matchPtsSub: { fontSize: 10, color: theme.textSecondary, marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 },
    newMatchBtn: { backgroundColor: theme.btnPrimary, borderRadius: 12, padding: 16, paddingHorizontal: 40, marginTop: 24 },
    newMatchBtnText: { color: theme.btnPrimaryText, fontSize: 18, fontWeight: 'bold' },
    continueBtn: { backgroundColor: theme.btnPrimary, borderRadius: 12, padding: 16, paddingHorizontal: 40, marginTop: 24 },
    continueBtnText: { color: theme.btnPrimaryText, fontSize: 18, fontWeight: 'bold' },
    backListBtn: { backgroundColor: theme.btnNeutral, borderRadius: 8, padding: 12, paddingHorizontal: 24, marginTop: 12 },
    backListBtnText: { color: theme.btnNeutralText, fontSize: 14 },
  }), [theme]);
}

function AppContent() {
  const { theme } = useAccessibility();
  const s = useStyles(theme);

  const [mode, setMode] = useState('home');
  const [teamMatch, setTeamMatch] = useState(null);
  const [currentSlotId, setCurrentSlotId] = useState(null);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [sl1, setSl1] = useState(4);
  const [sl2, setSl2] = useState(4);
  const [match, setMatch] = useState(() => createMatch('Player 1', 'Player 2', 4, 4));
  const [showClearModal, setShowClearModal] = useState(false);
  const [renamePlayer, setRenamePlayer] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'web' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  const handleRename = useCallback((name, sl) => {
    if (renamePlayer === 1) {
      setSl1(sl);
      setMatch((prev) => ({ ...prev, p1: { ...prev.p1, name, sl, target: SL_TARGETS[sl] } }));
    } else if (renamePlayer === 2) {
      setSl2(sl);
      setMatch((prev) => ({ ...prev, p2: { ...prev.p2, name, sl, target: SL_TARGETS[sl] } }));
    }
  }, [renamePlayer]);

  const toggleP1Ball = useCallback((n) => {
    setMatch((prev) => toggleBall(prev, 1, n));
  }, []);
  const toggleP2Ball = useCallback((n) => {
    setMatch((prev) => toggleBall(prev, 2, n));
  }, []);

  const handleClear = useCallback(() => {
    setShowClearModal(true);
  }, []);
  const handleClearConfirm = useCallback(() => {
    setMatch((prev) => clearRack(prev));
    setShowClearModal(false);
  }, []);
  const handleClearCancel = useCallback(() => {
    setShowClearModal(false);
  }, []);

  const handleNextRack = useCallback(() => {
    setMatch((prev) => {
      if (Object.keys(prev.rack.p1).length === 0 && Object.keys(prev.rack.p2).length === 0) {
        return prev;
      }
      return submitRack(prev);
    });
  }, []);

  const handleNewMatch = useCallback(() => {
    setMatch(createMatch('Player 1', 'Player 2', sl1, sl2));
  }, [sl1, sl2]);

  // ── Team match handlers ──

  const handleTeamSetup = useCallback((data) => {
    setTeamMatch(createTeamMatch(data.teamA, data.teamB, data.tournament));
    setMode('teamList');
  }, []);

  const handleStartMatch = useCallback((slotId, playerData) => {
    setCurrentSlotId(slotId);
    if (playerData) {
      setSl1(playerData.aSl);
      setSl2(playerData.bSl);
      setMatch(createMatch(playerData.aPlayer, playerData.bPlayer, playerData.aSl, playerData.bSl));
    } else {
      const slot = teamMatch.slots.find((s) => s.id === slotId);
      if (slot?.match) {
        setSl1(slot.aSl);
        setSl2(slot.bSl);
        setMatch(slot.match);
      }
    }
    setMode('teamScoring');
  }, [teamMatch]);

  const handleTeamContinue = useCallback(() => {
    setTeamMatch((prev) => completeSlot(prev, currentSlotId, match));
    setMode('teamList');
  }, [currentSlotId, match]);

  const handleBackToList = useCallback(() => {
    if (currentSlotId && match) {
      if (match.winner) {
        setTeamMatch((prev) => completeSlot(prev, currentSlotId, match));
      } else {
        setTeamMatch((prev) => saveSlotProgress(prev, currentSlotId, match));
      }
    }
    setCurrentSlotId(null);
    setMode('teamList');
  }, [currentSlotId, match]);

  // ── Render ──

  // Home screen
  if (mode === 'home') {
    return (
      <SafeAreaView style={s.container}>
        <StatusBar style="light" />
        <View style={s.homeContainer}>
          <Text style={s.homeTitle}>APA 9-Ball</Text>
          <TouchableOpacity
            style={s.homeBtn}
            onPress={() => { setMatch(createMatch('Player 1', 'Player 2', sl1, sl2)); setMode('single'); }}
          >
            <Text style={s.homeBtnText}>Single Match</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.homeBtn}
            onPress={() => setMode('teamSetup')}
          >
            <Text style={s.homeBtnText}>Team Match</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.gearBtn} onPress={() => setShowAccessibility(true)}>
            <Text style={s.gearBtnText}>⚙ Settings</Text>
          </TouchableOpacity>
        </View>
        <AccessibilityModal visible={showAccessibility} onClose={() => setShowAccessibility(false)} />
      </SafeAreaView>
    );
  }

  if (mode === 'teamSetup') {
    return (
      <SafeAreaView style={s.container}>
        <StatusBar style="light" />
        <TeamSetupScreen onStart={handleTeamSetup} />
      </SafeAreaView>
    );
  }

  if (mode === 'teamList') {
    return (
      <SafeAreaView style={s.container}>
        <StatusBar style="light" />
        <MatchListScreen
          teamMatch={teamMatch}
          setTeamMatch={setTeamMatch}
          onStartMatch={handleStartMatch}
          onSummary={() => setMode('teamSummary')}
        />
      </SafeAreaView>
    );
  }

  if (mode === 'teamSummary') {
    return (
      <SafeAreaView style={s.container}>
        <StatusBar style="light" />
        <TeamSummaryScreen
          teamMatch={teamMatch}
          onNew={() => {
            setTeamMatch(null);
            setCurrentSlotId(null);
            setMode('home');
          }}
        />
      </SafeAreaView>
    );
  }

  // Scoring UI (used by both single and teamScoring modes)
  const isTeamMode = mode === 'teamScoring';
  const isMatchOver = !!match.winner;

  if (isTeamMode && isMatchOver) {
    const mp = match.matchPoints || getMatchPoints(
      match.winner === 1 ? match.p2.sl : match.p1.sl,
      match.winner === 1 ? match.p2.points : match.p1.points
    );
    return (
      <SafeAreaView style={s.container}>
        <StatusBar style="light" />
        <View style={s.winnerContainer}>
          <Text style={s.trophy}>🏆</Text>
          <Text style={s.winnerTitle}>
            {match.winner === 1 ? match.p1.name : match.p2.name} Wins!
          </Text>
          <Text style={s.winnerScore}>
            {match.p1.name}: {match.p1.points} / {match.p1.target} pts
          </Text>
          <Text style={s.winnerScore}>
            {match.p2.name}: {match.p2.points} / {match.p2.target} pts
          </Text>
          <View style={s.matchPtsRow}>
            <View style={s.matchPtsBox}>
              <Text style={s.matchPtsLabel}>{match.winner === 1 ? match.p1.name : match.p2.name}</Text>
              <Text style={s.matchPtsValue}>{mp.winner}</Text>
              <Text style={s.matchPtsSub}>Match Pts</Text>
            </View>
            <View style={s.matchPtsBox}>
              <Text style={s.matchPtsLabel}>{match.winner === 1 ? match.p2.name : match.p1.name}</Text>
              <Text style={s.matchPtsValue}>{mp.loser}</Text>
              <Text style={s.matchPtsSub}>Match Pts</Text>
            </View>
          </View>
          <TouchableOpacity style={s.continueBtn} onPress={handleTeamContinue}>
            <Text style={s.continueBtnText}>Continue →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.backListBtn} onPress={handleBackToList}>
            <Text style={s.backListBtnText}>Match List</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isMatchOver) {
    const l = match.winner === 1 ? match.p2 : match.p1;
    const { winner: winnerPts, loser: loserPts } = getMatchPoints(l.sl, l.points);
    return (
      <SafeAreaView style={s.container}>
        <StatusBar style="light" />
        <View style={s.winnerContainer}>
          <Text style={s.trophy}>🏆</Text>
          <Text style={s.winnerTitle}>Match Over!</Text>
          <Text style={s.winnerName}>{match.winner === 1 ? match.p1.name : match.p2.name} Wins!</Text>
          <Text style={s.winnerScore}>
            {match.p1.name}: {match.p1.points} / {match.p1.target} pts
          </Text>
          <Text style={s.winnerScore}>
            {match.p2.name}: {match.p2.points} / {match.p2.target} pts
          </Text>
          <View style={s.matchPtsRow}>
            <View style={s.matchPtsBox}>
              <Text style={s.matchPtsLabel}>{match.winner === 1 ? match.p1.name : match.p2.name}</Text>
              <Text style={s.matchPtsValue}>{winnerPts}</Text>
              <Text style={s.matchPtsSub}>Match Pts</Text>
            </View>
            <View style={s.matchPtsBox}>
              <Text style={s.matchPtsLabel}>{match.winner === 1 ? match.p2.name : match.p1.name}</Text>
              <Text style={s.matchPtsValue}>{loserPts}</Text>
              <Text style={s.matchPtsSub}>Match Pts</Text>
            </View>
          </View>
          <TouchableOpacity style={s.newMatchBtn} onPress={handleNewMatch}>
            <Text style={s.newMatchBtnText}>New Match</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { p1, p2, rack } = match;
  const ninePocketed = !!(rack.p1[9] || rack.p2[9]);
  const rackPoints = (p) => { let pts = 0; for (const [b, s] of Object.entries(rack[p])) { if (s === 'made') pts += Number(b) === 9 ? 2 : 1; } return pts; };
  const p1Projected = p1.points + rackPoints('p1');
  const p2Projected = p2.points + rackPoints('p2');
  const pointsWin = p1Projected >= p1.target || p2Projected >= p2.target;
  const ballsDisabled = pointsWin;
  const p1RackPts = rackPoints('p1');
  const p2RackPts = rackPoints('p2');

  const p1Section = (
    <PlayerSection
      player={p1}
      rack={rack.p1}
      otherRack={rack.p2}
      onToggle={toggleP1Ball}
      onNamePress={() => setRenamePlayer(1)}
      rackPts={p1RackPts}
      disabled={ballsDisabled}
    />
  );

  const p2Section = (
    <PlayerSection
      player={p2}
      rack={rack.p2}
      otherRack={rack.p1}
      onToggle={toggleP2Ball}
      onNamePress={() => setRenamePlayer(2)}
      rackPts={p2RackPts}
      disabled={ballsDisabled}
    />
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar style="light" />

      <View style={[s.header, isLandscape && s.headerLandscape]}>
        {isTeamMode && (
          <TouchableOpacity style={s.backBtn} onPress={handleBackToList}>
            <Text style={s.backBtnText}>← Back</Text>
          </TouchableOpacity>
        )}
        <View style={[s.headerCenter, isLandscape && s.headerCenterLeft]}>
          <View style={s.titleRow}>
            <Text style={s.headerTitle}>APA 9-Ball</Text>
            <Text style={s.headerSub}>Rack {rack.num}</Text>
          </View>
        </View>
        {isLandscape && (
          <View style={s.headerActions}>
            <TouchableOpacity style={s.clearBtnL} onPress={handleClear}>
              <Text style={s.clearBtnLText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.nextBtnL, (!ninePocketed && !pointsWin) && s.nextBtnLDisabled]}
              onPress={handleNextRack}
              disabled={!ninePocketed && !pointsWin}
            >
              <Text style={[s.nextBtnLText, (!ninePocketed && !pointsWin) && s.nextBtnLTextDisabled]}>
                {pointsWin ? 'Game Over' : 'Next Rack'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.gearBtnL} onPress={() => setShowAccessibility(true)}>
              <Text style={s.gearBtnLText}>⚙</Text>
            </TouchableOpacity>
          </View>
        )}
        {!isLandscape && (
          <TouchableOpacity style={s.gearIconBtn} onPress={() => setShowAccessibility(true)}>
            <Text style={s.gearIconText}>⚙</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLandscape ? (
        <View style={s.mainLandscape}>
          {p1Section}
          <View style={s.dividerV} />
          {p2Section}
        </View>
      ) : (
        <View style={s.mainPortrait}>
          {p1Section}
          <View style={s.dividerH} />
          {p2Section}
        </View>
      )}

      {!isLandscape && (
        <View style={s.bottom}>
          <TouchableOpacity style={s.clearBtn} onPress={handleClear}>
            <Text style={s.clearBtnText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.nextBtn, (!ninePocketed && !pointsWin) && s.nextBtnDisabled]}
            onPress={handleNextRack}
            disabled={!ninePocketed && !pointsWin}
          >
            <Text style={[s.nextBtnText, (!ninePocketed && !pointsWin) && s.nextBtnTextDisabled]}>
              {pointsWin ? 'Game Over' : 'Next Rack'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ConfirmModal
        visible={showClearModal}
        title="Clear Rack?"
        message="This will reset all ball selections for the current rack."
        confirmLabel="Clear"
        cancelLabel="Cancel"
        onConfirm={handleClearConfirm}
        onCancel={handleClearCancel}
      />

      <NameEditModal
        visible={renamePlayer !== null}
        playerName={renamePlayer === 1 ? p1.name : p2.name}
        currentSl={renamePlayer === 1 ? sl1 : sl2}
        onSave={handleRename}
        onClose={() => setRenamePlayer(null)}
      />

      <AccessibilityModal visible={showAccessibility} onClose={() => setShowAccessibility(false)} />
    </SafeAreaView>
  );
}
