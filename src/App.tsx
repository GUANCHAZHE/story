import React, { useState, useRef } from 'react';
import { GameState } from './types';
import { SCENES_DATA, EXAMINE_DATA } from './gameData';
import { CombatScene } from './CombatScene';
import { AnimatePresence, motion } from 'motion/react';
import { Flame, Eye, Music, Hexagon, User, Sparkles, Loader2, LogIn, LogOut } from 'lucide-react';
import { generateText, getAuthStatus } from './services/ai';
import { preloadImagePool, getRandomImageFromPool } from './services/imagePool';
import { AIGeneratedImage } from './components/AIGeneratedImage';

import { BackgroundMusic } from './components/BackgroundMusic';

const VOICE_CONFIG = {
  ember: { name: '余烬直觉', color: 'text-ember', border: 'border-ember/20', bg: 'bg-ember/10', icon: Flame, desc: '直觉、情感共鸣、危险感知。那些无法用语言解释的预感。' },
  rift: { name: '裂隙低语', color: 'text-rift', border: 'border-rift/20', bg: 'bg-rift/10', icon: Eye, desc: '侦测矛盾、谎言与现实裂缝。当世界不自洽时，它会提醒你。' },
  song: { name: '传唱回声', color: 'text-song', border: 'border-song/20', bg: 'bg-song/10', icon: Music, desc: '听见旧日故事、传说与歌谣的残响。风里的每一个音节。' },
  rune: { name: '法纹感知', color: 'text-rune', border: 'border-rune/20', bg: 'bg-rune/10', icon: Hexagon, desc: '阅读魔法痕迹、结构性真相。数字不会撒谎——大多数时候。' },
};

function Header({ state, onOpenProfile }: { state: GameState, onOpenProfile: () => void }) {
  const hpPct = Math.round((state.hp / state.maxHp) * 100);
  const hpColor = hpPct > 50 ? 'bg-life' : 'bg-blood';
  const factionText = state.faction === 'human' ? '人类侧' : state.faction === 'demon' ? '魔族侧' : '未定';

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-ember/15 bg-bg-panel shrink-0 flex-wrap gap-2 z-10 relative shadow-sm">
      <div className="flex items-baseline cursor-pointer group" onClick={onOpenProfile} title="查看角色档案">
        <span className="font-display text-xl text-ember tracking-[0.2em] group-hover:text-ember-light transition-colors">余烬编年</span>
        <span className="text-[10px] text-tx-faint tracking-[0.2em] ml-3 hidden sm:inline group-hover:text-tx-muted transition-colors">EMBER CHRONICLE</span>
      </div>
      <div className="flex gap-4 text-xs text-tx-muted flex-wrap items-center">
        <span className="flex items-center cursor-pointer hover:text-tx-main transition-colors" onClick={onOpenProfile}>
          生命 <b className="text-tx-main ml-1">{state.hp}/{state.maxHp}</b>
          <div className="w-12 h-1 bg-bg-main rounded-full ml-2 overflow-hidden">
            <motion.div className={`h-full ${hpColor}`} animate={{ width: `${hpPct}%` }} />
          </div>
        </span>
        <span>信仰 <b className="text-tx-main">{state.faith}</b></span>
        <span>学识 <b className="text-tx-main">{state.lore}</b></span>
        <span>可靠性 <b className="text-tx-main">{state.rel}%</b></span>
        <span>阵营 <b className="text-tx-main">{factionText}</b></span>
        <button onClick={onOpenProfile} className="ml-2 p-1.5 rounded-full bg-bg-card border border-ember/20 hover:bg-ember/10 text-ember transition-colors" title="角色档案">
          <User className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}

function Sidebar({ state }: { state: GameState }) {
  return (
    <div className="w-64 shrink-0 border-r border-ember/15 bg-bg-panel overflow-y-auto p-4 flex-col gap-4 hidden md:flex custom-scrollbar z-10 relative">
      <div>
        <div className="text-[10px] tracking-widest text-ember-dark font-bold mb-2">内 在 之 声</div>
        {(['ember', 'rift', 'song', 'rune'] as const).map(k => {
          const v = VOICE_CONFIG[k];
          const level = state.voices[k];
          const on = level > 0;
          return (
            <div key={k} className={`p-2 rounded-md mb-2 border text-xs leading-relaxed transition-colors ${on ? `border-ember/15 bg-bg-card` : 'border-transparent'}`}>
              <div className={`font-bold mb-1 flex items-center gap-1.5 ${on ? v.color : 'text-tx-faint'}`}>
                <v.icon className="w-3 h-3" />
                {v.name} {on && `Lv.${level}`}
              </div>
              <div className="text-[10px] text-tx-faint">
                {on ? v.desc : '（尚未觉醒）'}
              </div>
            </div>
          );
        })}
      </div>
      
      {state.cards.length > 0 && (
        <div className="mt-4">
          <div className="text-[10px] tracking-widest text-ember-dark font-bold mb-2">牌 组</div>
          <div className="flex flex-wrap gap-1.5">
            {state.cards.map((c, i) => (
              <span key={i} className="inline-block px-2 py-1 rounded text-[10px] border border-ember-dark text-ember bg-bg-card">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {state.items.length > 0 && (
        <div className="mt-4">
          <div className="text-[10px] tracking-widest text-ember-dark font-bold mb-2">物 品</div>
          <div className="flex flex-wrap gap-1.5">
            {state.items.map((c, i) => (
              <span key={i} className="inline-block px-2 py-1 rounded text-[10px] border border-ember/15 text-tx-muted bg-bg-card">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {state.companions.length > 0 && (
        <div className="mt-4">
          <div className="text-[10px] tracking-widest text-ember-dark font-bold mb-2">同 行 者</div>
          <div className="flex flex-col gap-2">
            {state.companions.map((c, i) => {
              const parts = c.split(' · ');
              const title = parts[0];
              const name = parts[1] || c;
              const isBard = name === '卡尔';
              const isScholar = name === '伊斋拉';
              const avatarPrompt = isBard 
                ? 'anime male bard broken lute frieren style' 
                : isScholar 
                  ? 'anime female demon scholar blue skin frieren style' 
                  : `anime fantasy character ${name} frieren style`;
                  
              return (
                <div key={i} className="flex items-center gap-3 p-2 rounded-md border border-song/20 bg-bg-card">
                  <AIGeneratedImage prompt={avatarPrompt} alt={name} className="w-10 h-10 rounded-full border border-song/30 object-cover" />
                  <div>
                    <div className="text-xs font-bold text-song">{name}</div>
                    <div className="text-[10px] text-tx-faint">{title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Choices({ choices }: { choices: { text: string; tag?: string; cls?: string; onClick: () => void }[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-8 flex flex-col gap-3">
      {choices.map((c, i) => {
        const key = String.fromCharCode(65 + i);
        return (
          <button 
            key={i}
            onClick={c.onClick}
            className="w-full text-left p-3 rounded-lg border border-ember/10 bg-bg-card hover:border-ember-dark hover:bg-bg-hover hover:translate-x-1 transition-all flex items-center text-sm text-tx-main leading-relaxed shadow-sm"
          >
            <span className="inline-block w-6 h-6 leading-6 text-center rounded bg-bg-main text-[10px] text-tx-faint font-bold mr-3 shrink-0">
              {key}
            </span>
            <span className="flex-1">{c.text}</span>
            {c.tag && (
              <span className={`ml-3 px-2 py-0.5 rounded text-[10px] tracking-wider shrink-0 ${
                c.cls === 'ex' ? 'bg-ember/10 text-ember' :
                c.cls === 'hu' ? 'bg-rune/10 text-rune' :
                c.cls === 'de' ? 'bg-blood/10 text-blood' :
                c.cls === 'lo' ? 'bg-rift/10 text-rift' :
                'bg-tx-faint/20 text-tx-muted'
              }`}>
                {c.tag}
              </span>
            )}
          </button>
        );
      })}
    </motion.div>
  );
}

function ExaminePanel({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void, key?: string | number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="my-4 p-4 rounded-lg bg-bg-card border border-ember/15 overflow-hidden shadow-md"
    >
      <div className="text-xs font-bold text-ember mb-3 tracking-wider">◈ {title}</div>
      <div className="text-sm text-tx-muted leading-loose space-y-3">
        {children}
      </div>
      <button 
        onClick={onClose}
        className="mt-4 text-[10px] text-tx-faint hover:text-tx-muted border-b border-dotted border-tx-faint transition-colors"
      >
        [ 收起 ]
      </button>
    </motion.div>
  );
}

function ProfileModal({ state, onClose }: { state: GameState, onClose: () => void }) {
  const factionText = state.faction === 'human' ? '人类侧' : state.faction === 'demon' ? '魔族侧' : '未定';
  const avatarPrompt = state.faction === 'human' 
    ? 'anime human knight worn armor frieren style' 
    : state.faction === 'demon' 
      ? 'anime demon mage frieren style' 
      : 'anime mysterious wanderer cloak frieren style';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-bg-panel border border-ember/20 rounded-xl p-6 max-w-md w-full shadow-2xl flex gap-6"
      >
        <div className="w-1/3 shrink-0">
          <AIGeneratedImage prompt={avatarPrompt} alt="Player Avatar" className="w-full h-auto aspect-[2/3] object-cover rounded-lg border border-ember/30" />
          <div className="text-center mt-3 font-display text-ember tracking-widest">校史者</div>
          <div className="text-center text-[10px] text-tx-faint">{factionText}</div>
        </div>
        <div className="w-2/3 flex flex-col gap-4">
          <div>
            <div className="text-[10px] tracking-widest text-ember-dark font-bold mb-1">生 命 体 征</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-bg-main rounded-full overflow-hidden">
                <div className="h-full bg-life" style={{ width: `${(state.hp / state.maxHp) * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-tx-main">{state.hp}/{state.maxHp}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-card p-2 rounded border border-ember/10">
              <div className="text-[10px] text-tx-faint mb-1">信仰</div>
              <div className="text-lg font-bold text-tx-main">{state.faith}</div>
            </div>
            <div className="bg-bg-card p-2 rounded border border-ember/10">
              <div className="text-[10px] text-tx-faint mb-1">学识</div>
              <div className="text-lg font-bold text-tx-main">{state.lore}</div>
            </div>
            <div className="bg-bg-card p-2 rounded border border-ember/10 col-span-2">
              <div className="text-[10px] text-tx-faint mb-1">可靠性</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-bg-main rounded-full overflow-hidden">
                  <div className="h-full bg-ember" style={{ width: `${state.rel}%` }} />
                </div>
                <span className="text-sm font-bold text-tx-main">{state.rel}%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto">
            <button onClick={onClose} className="w-full py-2 rounded border border-ember/30 text-ember text-xs hover:bg-ember/10 transition-colors">
              关闭档案
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    hp: 30, maxHp: 30, faith: 0, lore: 0, rel: 50,
    faction: null, scene: 'title', cards: [], items: [], companions: [],
    voices: { ember: 1, rift: 0, song: 1, rune: 0 },
    flags: {}, seen: {}, dynamicEvents: {}
  });

  const [activeExamines, setActiveExamines] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [customAction, setCustomAction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    preloadImagePool();
  }, []);

  React.useEffect(() => {
    const loadAuth = async () => {
      try {
        setAuthLoading(true);
        const ok = await getAuthStatus();
        setIsAuthenticated(ok);
      } finally {
        setAuthLoading(false);
      }
    };

    loadAuth();
  }, []);

  const handleExamine = (id: string) => {
    const ex = EXAMINE_DATA[id];
    if (!ex) return;
    
    setGameState(prev => {
      const next = { ...prev, seen: { ...prev.seen, [id]: true } };
      if (!prev.seen[id] && ex.fx) {
        ex.fx(next);
      }
      return next;
    });
    
    setActiveExamines([id]);
    
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleChoice = (to: string, fx?: (state: GameState) => void) => {
    if (to === 'title') {
      setGameState({
        hp: 30, maxHp: 30, faith: 0, lore: 0, rel: 50,
        faction: null, scene: 'title', cards: [], items: [], companions: [],
        voices: { ember: 1, rift: 0, song: 1, rune: 0 },
        flags: {}, seen: {}, dynamicEvents: {}
      });
      setActiveExamines([]);
      setCustomAction('');
      return;
    }

    setActiveExamines([]);
    setCustomAction('');
    setGameState(prev => {
      const next = { ...prev, scene: to };
      if (fx) fx(next);
      
      const sceneDef = SCENES_DATA[to];
      if (sceneDef && sceneDef.onEnter) {
        sceneDef.onEnter(next);
      }
      return next;
    });
    
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentScene = SCENES_DATA[gameState.scene];
  const currentDynamicEvents = gameState.dynamicEvents[gameState.scene] || [];

  const handleCustomAction = async () => {
    if (!customAction.trim() || isGenerating || !isAuthenticated) return;
    
    setIsGenerating(true);
    const action = customAction.trim();
    setCustomAction('');
    
    // Get context from current scene (we can just pass the scene ID or a summary, but for now let's pass the scene ID and action)
    const context = `当前场景：${gameState.scene}。玩家状态：生命${gameState.hp}，信仰${gameState.faith}，学识${gameState.lore}。`;
    
    try {
      const text = await generateText(context, action);
      const image = (await getRandomImageFromPool()) || undefined;
      
      setGameState(prev => {
        const next = { ...prev };
        if (!next.dynamicEvents[next.scene]) {
          next.dynamicEvents[next.scene] = [];
        }
        next.dynamicEvents[next.scene].push({ action, text, image });
        return next;
      });
      
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
      }, 100);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-main text-tx-main font-serif selection:bg-ember/30">
      <Header state={gameState} onOpenProfile={() => setShowProfile(true)} />

      <div className="px-6 py-2 border-b border-ember/10 bg-bg-panel/60 flex items-center justify-end gap-2">
        <span className="text-xs text-tx-faint">
          OpenAI OAuth：{authLoading ? '检查中...' : isAuthenticated ? '已连接' : '未连接'}
        </span>
        {isAuthenticated ? (
          <a href="/api/oauth-logout" className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border border-ember/30 text-ember hover:bg-ember/10 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> 退出
          </a>
        ) : (
          <a href="/api/oauth-login" className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border border-rune/30 text-rune hover:bg-rune/10 transition-colors">
            <LogIn className="w-3.5 h-3.5" /> 连接 OpenAI
          </a>
        )}
      </div>
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar state={gameState} />
        
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth custom-scrollbar relative z-0">
            <div className="max-w-2xl mx-auto pb-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={gameState.scene}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {currentScene?.render(gameState, handleExamine)}
                  
                  {(gameState.scene === 'combat' || gameState.scene === 'forest_combat' || gameState.scene === 'final_combat') && (
                    <CombatScene 
                      gameState={gameState} 
                      onComplete={(newHp) => {
                        setGameState(prev => ({ ...prev, hp: newHp }));
                        handleChoice(gameState.scene === 'combat' ? 'post_combat' : gameState.scene === 'forest_combat' ? 'post_forest_combat' : 'post_final_combat');
                      }} 
                    />
                  )}

                  {currentDynamicEvents.map((ev, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 pt-8 border-t border-ember/15"
                    >
                      <div className="flex items-center gap-2 mb-4 text-ember-light">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-bold">你决定：{ev.action}</span>
                      </div>
                      <div className="text-[14.5px] leading-loose space-y-4">
                        {ev.image && (
                          <img src={ev.image} alt="Dynamic Event" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
                        )}
                        <p>{ev.text}</p>
                      </div>
                    </motion.div>
                  ))}

                  {gameState.scene !== 'title' && gameState.scene !== 'combat' && (
                    <div className="mt-8 pt-6 border-t border-ember/15">
                      <div className="text-xs text-tx-muted mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-ember" />
                        深度探索（AI 定制行动）
                      </div>
                      {!isAuthenticated && (
                        <div className="text-[11px] text-rune mb-2">请先点击右上角“连接 OpenAI”完成 OAuth 登录后再使用 AI 定制行动。</div>
                      )}
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={customAction}
                          onChange={e => setCustomAction(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleCustomAction()}
                          placeholder="输入你想做的事，例如：仔细检查墙壁上的划痕..."
                          className="flex-1 bg-bg-panel border border-ember/20 rounded px-3 py-2 text-sm text-tx-main focus:outline-none focus:border-ember/50 transition-colors"
                          disabled={isGenerating || !isAuthenticated}
                        />
                        <button 
                          onClick={handleCustomAction}
                          disabled={!customAction.trim() || isGenerating || !isAuthenticated}
                          className="px-4 py-2 bg-ember/10 text-ember border border-ember/30 rounded hover:bg-ember/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px] transition-colors"
                        >
                          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : '执行'}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <AnimatePresence>
                {activeExamines.map(id => (
                  <ExaminePanel 
                    key={id} 
                    title={EXAMINE_DATA[id].title} 
                    onClose={() => setActiveExamines(prev => prev.filter(e => e !== id))}
                  >
                    {EXAMINE_DATA[id].render()}
                  </ExaminePanel>
                ))}
              </AnimatePresence>

              {currentScene?.choices && currentScene.choices.length > 0 && (
                <Choices 
                  choices={currentScene.choices.filter(c => !c.req || c.req(gameState)).map(c => ({
                    ...c,
                    onClick: () => handleChoice(c.to, c.fx)
                  }))} 
                />
              )}
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg-main to-transparent pointer-events-none z-10" />
        </div>
      </div>

      <AnimatePresence>
        {showProfile && <ProfileModal state={gameState} onClose={() => setShowProfile(false)} />}
      </AnimatePresence>
      <BackgroundMusic currentSceneId={gameState.scene} />
    </div>
  );
}
