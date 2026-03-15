import React, { useState, useRef } from 'react';
import { GameState } from './types';
import { SCENES_DATA, EXAMINE_DATA } from './gameData';
import { CombatScene } from './CombatScene';
import { AnimatePresence, motion } from 'motion/react';
import { Flame, Eye, Music, Hexagon, User, Sparkles, Loader2, LogIn, LogOut } from 'lucide-react';
import { AuthMode, generateText, getAuthStatus } from './services/ai';
import { preloadImagePool, getRandomImageFromPool } from './services/imagePool';
import { AIGeneratedImage } from './components/AIGeneratedImage';

import { BackgroundMusic } from './components/BackgroundMusic';

const VOICE_CONFIG = {
  ember: { name: '余烬直觉', color: 'text-ember', border: 'border-ember/20', bg: 'bg-ember/10', icon: Flame, desc: '直觉、情感共鸣、危险感知。那些无法用语言解释的预感。' },
  rift: { name: '裂隙低语', color: 'text-rift', border: 'border-rift/20', bg: 'bg-rift/10', icon: Eye, desc: '侦测矛盾、谎言与现实裂缝。当世界不自洽时，它会提醒你。' },
  song: { name: '传唱回声', color: 'text-song', border: 'border-song/20', bg: 'bg-song/10', icon: Music, desc: '听见旧日故事、传说与歌谣的残响。风里的每一个音节。' },
  rune: { name: '法纹感知', color: 'text-rune', border: 'border-rune/20', bg: 'bg-rune/10', icon: Hexagon, desc: '阅读魔法痕迹、结构性真相。数字不会撒谎——大多数时候。' },
};

type StoryCharacterCard = {
  id: string;
  name: string;
  title: string;
  faction: string;
  anchor: string;
  objective: string;
  secret: string;
  relationNodes: string[];
  riskIfLost: string;
  avatarPrompt: string;
};

const STORY_CHARACTER_CARDS: StoryCharacterCard[] = [
  {
    id: 'archivist',
    name: '校史者（你）',
    title: '断章编目者 / 余烬见证人',
    faction: '摇摆中立（人类与魔族双侧可介入）',
    anchor: '掌握四重“内在之声”，能辨识被世界擦除的叙事缺口。',
    objective: '在方向被删除、历史被重写的世界里，重建“第八位参与者”的存在证明。',
    secret: '你并非单纯的记录者，而是被叙事系统选中的“修订接口”。当你记住某段被删历史，它就会重新具备因果重量。',
    relationNodes: ['艾洛温', '卡尔', '伊斋拉', '镜塔守灯者', '芮雅', '黑盐议会'],
    riskIfLost: '如果你失去可靠性，所有线索会从“真相碎片”坍塌为“相互矛盾的传闻”。',
    avatarPrompt: 'anime mysterious archivist traveler old tome runes frieren style',
  },
  {
    id: 'elowen',
    name: '艾洛温',
    title: '失名的第八席 / 被删去的火种继承者',
    faction: '历史空白位（曾属于远征同盟）',
    anchor: '名字被从歌谣、地图与祭仪中剔除，只在风与透镜折射中留下残响。',
    objective: '让世界重新承认“第八席”并非错误变量，而是封印深渊叙事引力的关键锚点。',
    secret: '她当年并未背叛火种，而是主动承担“被遗忘”的代价，把灾变的指向从同伴身上转移到自己。',
    relationNodes: ['校史者（你）', '卡尔', '芮雅', '镜塔守灯者'],
    riskIfLost: '若彻底失去她的证据，时间线会自动收束为“七人远征”的伪稳定版本。',
    avatarPrompt: 'anime silver-haired female knight forgotten hero torn cape frieren style',
  },
  {
    id: 'karl',
    name: '卡尔',
    title: '断弦吟游者 / 民间记忆载体',
    faction: '海岸自由城邦',
    anchor: '靠残缺旋律保存禁忌史，能把“不能被说出的事”伪装成民谣流通。',
    objective: '在黑盐议会的审查前，把艾洛温的真名唱进足够多人的梦里。',
    secret: '他年轻时曾为黑盐议会写过宣传诗，亲手参与过“第八席抹除运动”的情绪工程。',
    relationNodes: ['校史者（你）', '艾洛温', '黑盐议会', '伊斋拉'],
    riskIfLost: '若卡尔沉默，民间记忆会被官方叙事完全接管，真相将失去传播路径。',
    avatarPrompt: 'anime male bard broken lute harbor fog frieren style',
  },
  {
    id: 'izera',
    name: '伊斋拉',
    title: '魔族算术师 / 第八变量研究者',
    faction: '魔族观测学派',
    anchor: '通过法纹与方程追踪“现实修正”痕迹，是少数确认第八变量存在的人。',
    objective: '证明世界不是自然遗忘，而是受到可执行的叙事删改协议影响。',
    secret: '她导师留下的终稿其实是双层文本：上层是论文，下层是“如何在被删除后继续存在”的自救算法。',
    relationNodes: ['校史者（你）', '卡尔', '芮雅', '黑盐议会'],
    riskIfLost: '若她的模型失效，你将再也无法区分“历史矛盾”与“幻觉噪声”。',
    avatarPrompt: 'anime female demon scholar blue skin arcane formulas frieren style',
  },
  {
    id: 'keeper',
    name: '镜塔守灯者',
    title: '无名守夜人 / 方向学遗民',
    faction: '旧灯塔传承',
    anchor: '以个人记忆为燃料维持灯塔运转，防止“对岸方向”彻底从世界坐标中消失。',
    objective: '找到可替代记忆燃烧的装置，让灯塔摆脱“守灯者必然衰亡”的宿命。',
    secret: '历代守灯者都是同一个人被反复重写后的身份续体，他每次“继任”都会遗忘上一轮失败。',
    relationNodes: ['校史者（你）', '艾洛温', '芮雅'],
    riskIfLost: '灯灭后海上将不再有“回光”，跨岸叙事会彻底断裂。',
    avatarPrompt: 'anime lighthouse keeper old coat crystal lens frieren style',
  },
  {
    id: 'reya',
    name: '芮雅',
    title: '圣堂抄写官 / 誓约见证者',
    faction: '灰烬圣堂',
    anchor: '掌握誓约文书与遗物封存规则，能为碎片证据赋予合法性与神圣约束。',
    objective: '把散落在戒指、日志、海螺里的私人记忆转写为可在公共仪式中成立的“见证文本”。',
    secret: '她家族曾替黑盐议会保管过“删除令原卷”，因此一直被圣堂内部监视。',
    relationNodes: ['校史者（你）', '艾洛温', '伊斋拉', '镜塔守灯者', '黑盐议会'],
    riskIfLost: '若缺少芮雅的见证，真相将无法进入制度层面，只能停留在传闻与个人信念。',
    avatarPrompt: 'anime female temple scribe ink-stained hands candle light frieren style',
  },
  {
    id: 'blacksalt',
    name: '黑盐议会',
    title: '档案审定机关 / 叙事秩序维护者',
    faction: '沿岸联邦执政核心',
    anchor: '通过审定史书、航图与祭仪文本来控制“哪些故事被允许存在”。',
    objective: '阻止第八席真相扩散，维持“七人远征神话”带来的政治稳定。',
    secret: '议会并非铁板一块；内部“保序派”与“修复派”都在利用你，想借你定位第八席却导向不同结局。',
    relationNodes: ['校史者（你）', '卡尔', '伊斋拉', '芮雅'],
    riskIfLost: '如果无法识别其派系裂缝，你会把所有阻力误判为同一种敌意，错失反制窗口。',
    avatarPrompt: 'anime secret council silhouettes black salt sigils frieren style',
  },
];

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

      <div className="mt-4">
        <div className="text-[10px] tracking-widest text-ember-dark font-bold mb-2">叙 事 人 物 网</div>
        <div className="text-[10px] text-tx-faint leading-relaxed mb-2">以下人物卡片以“目标—秘密—关系节点”组织；每一张卡都与至少三个节点互相牵制，构成可回流的网状叙事。</div>
        <div className="flex flex-col gap-3">
          {STORY_CHARACTER_CARDS.map((card) => (
            <div key={card.id} className="p-3 rounded-md border border-ember/15 bg-bg-card space-y-2">
              <div className="flex items-center gap-2">
                <AIGeneratedImage prompt={card.avatarPrompt} alt={card.name} className="w-9 h-9 rounded-full border border-ember/30 object-cover" />
                <div>
                  <div className="text-xs font-bold text-ember">{card.name}</div>
                  <div className="text-[10px] text-tx-faint">{card.title}</div>
                </div>
              </div>
              <div className="text-[10px] text-tx-muted"><span className="text-tx-faint">阵营：</span>{card.faction}</div>
              <div className="text-[10px] text-tx-muted leading-relaxed"><span className="text-song">叙事锚点：</span>{card.anchor}</div>
              <div className="text-[10px] text-tx-muted leading-relaxed"><span className="text-rune">当前目标：</span>{card.objective}</div>
              <div className="text-[10px] text-tx-muted leading-relaxed"><span className="text-rift">隐藏真相：</span>{card.secret}</div>
              <div className="text-[10px] text-tx-muted leading-relaxed"><span className="text-blood">失联风险：</span>{card.riskIfLost}</div>
              <div className="flex flex-wrap gap-1">
                {card.relationNodes.map((node) => (
                  <span key={`${card.id}-${node}`} className="px-1.5 py-0.5 rounded border border-song/20 text-[10px] text-song bg-song/5">
                    ↔ {node}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
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
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [customActionError, setCustomActionError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    preloadImagePool();
  }, []);

  React.useEffect(() => {
    const loadAuth = async () => {
      try {
        setAuthLoading(true);
        const status = await getAuthStatus();
        setIsAuthenticated(status.authenticated);
        setAuthMode(status.mode);
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

    setCustomActionError(null);
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
    } catch (e: any) {
      console.error(e);
      const message = e?.message || 'OpenAI 文本生成失败。';
      setCustomActionError(message);
      if (/not authenticated|oauth/i.test(message)) {
        setIsAuthenticated(false);
        setAuthMode(null);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-main text-tx-main font-serif selection:bg-ember/30">
      <Header state={gameState} onOpenProfile={() => setShowProfile(true)} />

      <div className="px-6 py-2 border-b border-ember/10 bg-bg-panel/60 flex items-center justify-end gap-2">
        <span className="text-xs text-tx-faint">
          OpenAI：{authLoading ? '检查中...' : isAuthenticated ? (authMode === 'server_key' ? '服务端密钥模式' : 'OAuth 已连接') : '未连接'}
        </span>
        {isAuthenticated && authMode === 'oauth' ? (
          <a href="/api/oauth-logout" className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border border-ember/30 text-ember hover:bg-ember/10 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> 退出
          </a>
        ) : !isAuthenticated ? (
          <a href="/api/oauth-login" className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border border-rune/30 text-rune hover:bg-rune/10 transition-colors">
            <LogIn className="w-3.5 h-3.5" /> 连接 OpenAI
          </a>
        ) : null}
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
                        <div className="text-[11px] text-rune mb-2">请先点击右上角“连接 OpenAI”完成 OAuth 登录后再使用 AI 定制行动。若你在中国大陆访问，可改为在服务器配置 OPENAI_API_KEY（服务端密钥模式）以避免 OAuth 回调失败。</div>
                      )}
                      {customActionError && (
                        <div className="text-[11px] text-blood mb-2">{customActionError}</div>
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
