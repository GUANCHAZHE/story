import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState } from './types';

interface Card {
  name: string;
  cost: number;
  dmg?: number;
  block?: number;
  heal?: number;
  special?: 'reveal' | 'weaken';
  desc: string;
}

interface FloatingText {
  id: number;
  text: string;
  type: 'damage' | 'heal' | 'block' | 'special';
  target: 'player' | 'enemy';
}

export function CombatScene({ gameState, onComplete }: { gameState: GameState, onComplete: (hp: number) => void }) {
  const [eHp, setEHp] = useState(22);
  const eMax = 22;
  const [pHp, setPHp] = useState(gameState.hp);
  const [armor, setArmor] = useState(0);
  const [energy, setEnergy] = useState(3);
  const maxE = 3;
  const [round, setRound] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [eNextDmg, setENextDmg] = useState(4);
  const [eIntent, setEIntent] = useState('攻击(4)');
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const textIdRef = useRef(0);

  const addFloatingText = (text: string, type: FloatingText['type'], target: FloatingText['target']) => {
    const id = textIdRef.current++;
    setFloatingTexts(prev => [...prev, { id, text, type, target }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1000);
  };

  const [deck] = useState<Card[]>(() => {
    const d: Card[] = [
      { name: '斩击', cost: 1, dmg: 6, desc: '造成 6 点伤害' },
      { name: '格挡', cost: 1, block: 7, desc: '获得 7 点护甲' },
      { name: '审视', cost: 0, special: 'reveal', desc: '揭示敌人意图，+5 学识' }
    ];
    if (gameState.faction === 'human') d.push({ name: '誓言之力', cost: 1, dmg: 4, heal: 4, desc: '4 伤害，恢复 4 生命' });
    if (gameState.faction === 'demon') d.push({ name: '法纹解析', cost: 1, dmg: 8, desc: '以法阵逻辑打击残影，8 伤害' });
    if (gameState.cards.includes('原初回响')) d.push({ name: '原初回响', cost: 2, dmg: 14, desc: '用分火前的记忆冲击目标，14 伤害' });
    if (gameState.cards.includes('被遗忘的旋律')) d.push({ name: '被遗忘的旋律', cost: 1, dmg: 3, special: 'weaken', desc: '3 伤害并削弱敌人' });
    return d;
  });

  const rollIntent = (currentRound: number, currentDmg: number) => {
    if (currentRound % 3 === 2) {
      setENextDmg(8);
      setEIntent('强击(8)');
    } else {
      const d = 4 + Math.floor(currentRound * 0.5);
      setENextDmg(d);
      setEIntent(`攻击(${d})`);
    }
  };

  const playCard = (card: Card) => {
    if (energy < card.cost) return;
    setEnergy(e => e - card.cost);
    
    const newLogs = [...logs];
    
    if (card.dmg) {
      setEHp(h => Math.max(0, h - card.dmg!));
      newLogs.push(`你使用 <span class="text-ember">${card.name}</span>，造成 <span class="text-blood">${card.dmg}</span> 伤害`);
      addFloatingText(`-${card.dmg}`, 'damage', 'enemy');
    }
    if (card.block) {
      setArmor(a => a + card.block!);
      newLogs.push(`获得 <span class="text-life">${card.block}</span> 护甲`);
      addFloatingText(`+${card.block}`, 'block', 'player');
    }
    if (card.heal) {
      setPHp(h => Math.min(h + card.heal!, gameState.maxHp));
      newLogs.push(`恢复 <span class="text-life">${card.heal}</span> 生命`);
      addFloatingText(`+${card.heal}`, 'heal', 'player');
    }
    if (card.special === 'reveal') {
      setRevealed(true);
      newLogs.push(`<span class="text-ember">审视</span>——敌人意图暴露`);
      addFloatingText('揭示', 'special', 'enemy');
    }
    if (card.special === 'weaken') {
      const nextDmg = Math.max(1, eNextDmg - 2);
      setENextDmg(nextDmg);
      setEIntent(prev => prev.replace(/\d+/, nextDmg.toString()));
      newLogs.push(`敌人攻击被 <span class="text-song">旧日歌谣</span> 削弱`);
      addFloatingText('削弱', 'special', 'enemy');
    }
    
    setLogs(newLogs);
  };

  useEffect(() => {
    if (eHp <= 0) {
      const timer = setTimeout(() => onComplete(pHp), 1000);
      return () => clearTimeout(timer);
    }
  }, [eHp, pHp, onComplete]);

  const endTurn = () => {
    const nextRound = round + 1;
    setRound(nextRound);
    
    const dmg = Math.max(0, eNextDmg - armor);
    setArmor(0);
    
    let newPHp = Math.max(0, pHp - dmg);
    const newLogs = [...logs, `<span class="text-tx-faint">— 回合 ${nextRound} —</span>`];
    
    if (dmg > 0) {
      newLogs.push(`残影攻击，造成 <span class="text-blood">${dmg}</span> 伤害`);
      addFloatingText(`-${dmg}`, 'damage', 'player');
    } else {
      newLogs.push(`护甲完全吸收了伤害`);
      addFloatingText('吸收', 'block', 'player');
    }
    
    if (newPHp <= 0) {
      newPHp = 8;
      newLogs.push(`<span class="text-ember">某种力量不允许你的故事在此终结。</span>`);
    }
    
    setPHp(newPHp);
    setRevealed(false);
    setEnergy(maxE);
    rollIntent(nextRound, eNextDmg);
    setLogs(newLogs);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8">
      <div className="flex justify-between p-4 mb-4 rounded-lg bg-bg-card border border-ember/15 shadow-md relative overflow-hidden">
        <div className="flex-1 relative">
          <div className="font-bold text-sm mb-1 text-blood">叙事残影</div>
          <div className="text-xs text-tx-muted mb-1">HP {eHp}/{eMax}</div>
          <div className="w-full max-w-[170px] h-1.5 bg-bg-main rounded-full overflow-hidden">
            <motion.div className="h-full bg-blood" animate={{ width: `${(eHp/eMax)*100}%` }} />
          </div>
          <div className="text-[10px] text-tx-faint mt-2">
            意图：{revealed ? eIntent : '??? （使用“审视”揭示）'}
          </div>
          
          <AnimatePresence>
            {floatingTexts.filter(t => t.target === 'enemy').map(t => (
              <motion.div
                key={t.id}
                initial={{ opacity: 1, y: 0, scale: 1.5 }}
                animate={{ opacity: 0, y: -30, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`absolute top-2 right-10 font-bold text-lg drop-shadow-md ${
                  t.type === 'damage' ? 'text-blood' : 
                  t.type === 'heal' ? 'text-life' : 
                  t.type === 'block' ? 'text-rune' : 'text-ember'
                }`}
              >
                {t.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex-1 text-right relative">
          <div className="font-bold text-sm mb-1 text-ember">校史者</div>
          <div className="text-xs text-tx-muted mb-1">HP {pHp}/{gameState.maxHp} {armor > 0 && `| 护甲 ${armor}`}</div>
          <div className="w-full max-w-[170px] h-1.5 bg-bg-main rounded-full overflow-hidden ml-auto">
            <motion.div className="h-full bg-life" animate={{ width: `${(pHp/gameState.maxHp)*100}%` }} />
          </div>
          <div className="text-[10px] text-tx-faint mt-2">
            行动力：{energy}/{maxE}
          </div>
          
          <AnimatePresence>
            {floatingTexts.filter(t => t.target === 'player').map(t => (
              <motion.div
                key={t.id}
                initial={{ opacity: 1, y: 0, scale: 1.5 }}
                animate={{ opacity: 0, y: -30, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`absolute top-2 left-10 font-bold text-lg drop-shadow-md ${
                  t.type === 'damage' ? 'text-blood' : 
                  t.type === 'heal' ? 'text-life' : 
                  t.type === 'block' ? 'text-rune' : 'text-ember'
                }`}
              >
                {t.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="text-xs p-3 my-3 rounded-md bg-bg-card border border-ember/15 leading-relaxed text-tx-muted max-h-[120px] overflow-y-auto flex flex-col gap-1 custom-scrollbar">
          {logs.slice(-6).map((l, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: l }} />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {deck.map((d, i) => {
          const disabled = energy < d.cost || eHp <= 0;
          return (
            <button
              key={i}
              onClick={() => playCard(d)}
              disabled={disabled}
              className={`w-full text-left p-2.5 rounded-md border border-ember/15 bg-bg-card transition-all flex items-center ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-ember-dark hover:bg-bg-hover hover:translate-x-1'}`}
            >
              <span className="inline-block w-5 h-5 leading-5 text-center rounded-full bg-ember-dark text-bg-main text-[10px] font-bold mr-3 shrink-0">
                {d.cost}
              </span>
              <div>
                <div className="font-bold text-sm text-tx-main">{d.name}</div>
                <div className="text-[10px] text-tx-faint mt-0.5">{d.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={endTurn}
        disabled={eHp <= 0}
        className="w-full text-center p-2.5 mt-4 border border-ember-dark rounded-md text-sm text-ember hover:bg-ember/10 transition-colors disabled:opacity-40"
      >
        结束回合
      </button>
    </motion.div>
  );
}
