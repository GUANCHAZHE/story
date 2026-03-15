import React from 'react';
import { GameState } from './types';
import { motion } from 'motion/react';
import { Flame, Eye, Music, Hexagon } from 'lucide-react';
import { AIGeneratedImage } from './components/AIGeneratedImage';

const VOICE_CONFIG = {
  ember: { name: '余烬直觉', color: 'text-ember', border: 'border-ember/20', bg: 'bg-ember/10', icon: Flame },
  rift: { name: '裂隙低语', color: 'text-rift', border: 'border-rift/20', bg: 'bg-rift/10', icon: Eye },
  song: { name: '传唱回声', color: 'text-song', border: 'border-song/20', bg: 'bg-song/10', icon: Music },
  rune: { name: '法纹感知', color: 'text-rune', border: 'border-rune/20', bg: 'bg-rune/10', icon: Hexagon },
};

export function VoiceBlock({ type, children }: { type: keyof typeof VOICE_CONFIG, children: React.ReactNode }) {
  const config = VOICE_CONFIG[type];
  const Icon = config.icon;
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`my-4 p-3 pl-10 relative rounded-md border ${config.bg} ${config.border}`}>
      <Icon className={`absolute left-3 top-3 w-4 h-4 ${config.color}`} />
      <div className={`text-xs font-bold tracking-wider mb-1 ${config.color}`}>{config.name}</div>
      <div className="text-sm italic text-tx-muted leading-relaxed">{children}</div>
    </motion.div>
  );
}

export function Narrator({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-6 pl-4 border-l-2 border-ember-dark bg-gradient-to-r from-ember/5 to-transparent py-2">
      <div className="text-[10px] tracking-widest text-ember-dark font-bold mb-2">世 界 注 释 声</div>
      <div className="text-sm text-tx-muted italic leading-loose">{children}</div>
    </motion.div>
  );
}

export function ExamineWord({ id, children, onExamine }: { id: string, children: React.ReactNode, onExamine: (id: string) => void }) {
  return (
    <span onClick={() => onExamine(id)} className="text-ember-light cursor-pointer border-b border-dotted border-ember-dark hover:text-amber-300 transition-colors">
      {children}
    </span>
  );
}

export function ChapterHeader({ label, title }: { label: string, title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
      <div className="text-[10px] tracking-[0.3em] text-tx-faint">{label}</div>
      <div className="font-display text-3xl text-ember tracking-widest mt-2">{title}</div>
      <div className="w-12 h-px bg-ember-dark mx-auto mt-4"></div>
    </motion.div>
  );
}

export const EXAMINE_DATA: Record<string, { title: string; render: () => React.ReactNode; fx?: (state: GameState) => void }> = {
  road_stones: {
    title: '路面的鹅卵石',
    render: () => (
      <>
        <p>你蹲下来。鹅卵石被磨得很平——不是被雨水，而是被脚步。成千上万双脚踩过这里。石缝之间嵌着一枚铜扣，是旧式骑兵外套上的那种。它在这里至少躺了三十年，已经和泥土长在了一起。</p>
        <VoiceBlock type="ember">这枚扣子还带着体温。不是真的——但你的指尖坚持认为它是温的。某个穿这件外套的人，在这里跑过。很急。丢了扣子都没有停下来。</VoiceBlock>
        <p>有一块鹅卵石裂成了两半。裂缝不自然风化——更像是从内部被某种力量撑开的。</p>
        <VoiceBlock type="rift">两半鹅卵石上的苔藓年龄不同。左半边的苔藓有六十年。右半边只有三十年。同一块石头，两半不在同一个时间里。</VoiceBlock>
        <p>这条路记得所有走过它的人。你不确定这是一种比喻。</p>
      </>
    ),
    fx: (s) => { s.lore += 3; }
  },
  wind: {
    title: '海风',
    render: () => (
      <>
        <p>你停下脚步，转向大海的方向。风从西南方来。</p>
        <p>它经过了什么？你闭上眼睛，感官在气流中无限延伸——</p>
        <ul className="list-disc pl-5 my-3 space-y-2 text-tx-muted">
          <li><b className="text-tx-main">灰烬半岛的渔村：</b>带着烤鱼和海带的咸腥味，那里的渔民还在用古老的骨针修补渔网。</li>
          <li><b className="text-tx-main">沉寂的盐田：</b>白色的结晶在烈日下剥落，风卷起了细小的盐粒，打在废弃的风车上。</li>
          <li><b className="text-tx-main">无名灯塔：</b>它掠过了一座你不知道名字的灯塔，带走了守塔人叹息中的一抹孤寂。</li>
          <li><b className="text-tx-main">远方港口的酒馆：</b>三百里外，劣质麦酒的酸味和水手们粗犷的笑声混杂在一起，还有一首正在被拨弄的残缺歌谣。</li>
        </ul>
        <p>你不知道你怎么知道这些。但你知道。风把整个世界的切片塞进了你的鼻腔和脑海。</p>
        <VoiceBlock type="song">风带着一个名字。听——“艾……勒……”后面的音节被磨碎了。三百年前这个名字曾经在整片海岸线上被传唱。现在，风是唯一还记得它的东西。</VoiceBlock>
        <VoiceBlock type="song">再仔细听。歌谣的碎片。“……他在第三个黎明前放弃了火种……不是因为绝望，而是因为他看到了火焰背后的阴影……”下一句被海浪盖住了。永远被海浪盖住了。</VoiceBlock>
        <p>风还在吹。它不会停。即使世界上最后一个人也遗忘了所有的故事，风还是会继续吹。因为风不需要记忆——它就是记忆本身在运动。</p>
        <VoiceBlock type="ember">站在风里太久会让你觉得自已不够重要。不是自卑——是一种更大的东西。你是风经过的一个人。风还会经过很多很多人。你的存在，只是它漫长旅途中的一个微小阻力。</VoiceBlock>
      </>
    ),
    fx: (s) => { s.voices.song = Math.max(s.voices.song, 2); s.lore += 5; }
  },
  lantern: {
    title: '断裂的灯柱',
    render: () => (
      <>
        <p>铁质灯柱。顶部的灯笼不见了——连锁链一起消失，不像被拆除，更像从未安装过。但锁链的铁锈痕迹还在灯柱顶端，呈一个完美的圆。</p>
        <p>你把手放在灯柱上。铁是温的。</p>
        <VoiceBlock type="ember">四十三年。有人每天傍晚走这条路，爬上梯子，点亮灯笼。四十三年没有缺席一天。然后在第四十四年的第一个晚上，他没有来。铁记得他手掌的温度。铁不知道他去了哪里。</VoiceBlock>
        <p className="text-center text-ember italic my-3 leading-relaxed">“给所有在黑暗中赶路的人。——守灯人 马里奥”</p>
        <VoiceBlock type="rift">这里有个问题。没有任何文献提到过边境古道上有灯柱。没有任何地图标注过守灯人。这根灯柱，在所有官方记录中，不存在。</VoiceBlock>
        <VoiceBlock type="rift">可它就在这里。铁是真的。锈是真的。温度是真的。一个人点了四十三年的灯——然后被从所有记录中抹去了。</VoiceBlock>
        <p>灯柱的影子在夕阳下拉得很长。影子里似乎站着一个人的轮廓——手里举着什么东西。你眨了眨眼。影子里什么也没有。</p>
      </>
    ),
    fx: (s) => { s.voices.rift = Math.max(s.voices.rift, 1); s.items.push('灯柱铁锈碎片'); s.rel += 5; }
  },
  hands: {
    title: '你的双手',
    render: () => (
      <>
        <p>你摊开手掌。</p>
        <p>左手：几道旧疤，指节粗糙，指甲下面嵌着灰白色的灰烬。不是来自最近的任何一场火。这些灰烬是冷的，而且非常非常旧。</p>
        <p>右手：掌心中央有一个淡色的印记——两条弧线交叉，形成一个不完整的圆。</p>
        <VoiceBlock type="ember">这些手杀过人吗？你不记得。但你的手记得某种重量——刀柄的重量？还是笔杆的重量？又或者是一双手的重量。有人曾经紧紧握住你的手。在某个你已经遗忘的时刻。</VoiceBlock>
        <VoiceBlock type="rune">掌心的印记不是胎记。这是一个不完整的法阵符号——“锚定”符文的前半部分。完整版本用于将某物固定在特定的时间坐标上。但只有前半部分……意味着你被锚定了，却不知道被锚定在了什么地方。</VoiceBlock>
        <p>你握紧拳头。灰烬从指缝间簌簌落下。它们落在地上后，没有散开，而是沿着鹅卵石的缝隙缓缓流动，像某种极其缓慢的液体。然后静止了。</p>
      </>
    ),
    fx: (s) => { s.voices.rune = Math.max(s.voices.rune, 1); s.flags.sawMark = true; s.lore += 5; }
  },
  boundary_wall: {
    title: '界墙残片',
    render: () => (
      <>
        <p>这堵墙只剩了三层石头高。苔藓沿着看不见的线条蔓延，像在描摹一幅已经消失的壁画。</p>
        <p>墙的两面完全不同。</p>
        <p><b className="text-rune">朝南的一面（人类侧）：</b>刻着一段祈祷文。“愿光不灭，愿火种不熄，愿我们的孩子记得我们的名字。”签名处刻着七个家族的纹章，其中两个被苔藓完全覆盖。</p>
        <VoiceBlock type="song">被苔藓覆盖的两个纹章——我听说过一首很老的童谣里提到过七大家族。但童谣从一开始就只唱过“五大家族”。不是七个变成了五个——而是童谣从一开始就只唱过五个。</VoiceBlock>
        <p><b className="text-blood">朝北的一面（魔族侧）：</b>没有文字，只有一组精密的能量方程。它计算的是这堵墙能承受多大的“叙事压力”——也就是，当两侧的人对世界持有完全不同的信念时，墙的物质结构能承受多久才会坍塌。</p>
        <VoiceBlock type="rune">答案算出来了。三百二十年。这堵墙建于三百二十三年前。它已经超期了。它现在还站着，不是因为结构完整——而是因为已经没有人在乎墙两边的区别了。</VoiceBlock>
      </>
    ),
    fx: (s) => { s.lore += 8; s.rel += 5; s.flags.sawWall = true; }
  },
  sea: {
    title: '远处的海',
    render: () => (
      <>
        <p>海在悬崖下面。大约四十米高。悬崖面上有鸟巢——其中一个巢里有一条褪色的红布条，上面绣着半个字，在风中不停地翻动——像一面只给大海看的旗帜。</p>
        <VoiceBlock type="song">海不讲故事。海只是一个巨大的、不断重复的声音。但如果你用一种更深的方式去听——海浪的节奏里藏着一个非常古老的拍子。三拍。停顿。三拍。停顿。这是古代仪式音乐的节拍。海在用浪花重复一首被遗忘的歌。</VoiceBlock>
        <p>海面上没有船。这个时代已经很少有人出海——不是因为危险，而是因为海的对面曾经有另一片大陆的传说正在从共识中消退。如果没有人相信对面有东西，那出海就没有方向。</p>
        <VoiceBlock type="ember">你有一种冲动想要跳下去。不是求死——而是因为你觉得海水里有什么东西在叫你。某个声音。某段记忆。</VoiceBlock>
        <p>你后退一步。海继续拍打悬崖。它不在乎你是否听到了什么。它只是继续。一直继续。</p>
      </>
    ),
    fx: (s) => { s.voices.song = Math.max(s.voices.song, 2); }
  },
  chapel_altar: {
    title: '祭坛',
    render: () => (
      <>
        <p>石质祭坛，比你想象的矮。不是给神准备的——是给跪在上面的人准备的。</p>
        <p>祭坛表面有烛泪的痕迹，层层叠叠，像微型山脉。最底层的蜡是白色的，中层是黄色的，最上层——最近一次——是红色的。红色蜡烛在人类仪式中只有一个含义：告别。</p>
        <VoiceBlock type="ember">最后一个在这里点燃红烛的人走的时候没有回头。你怎么知道的？你不知道。但祭坛知道。石头比人类更擅长记住悲伤——因为石头不会试图治愈它。</VoiceBlock>
        <p className="text-center text-ember italic my-3 leading-relaxed">“第三条誓言的代价，由此处开始偿还。”</p>
      </>
    ),
    fx: (s) => { s.lore += 5; s.faith += 5; s.flags.sawAltar = true; }
  },
  chapel_glass: {
    title: '碎裂的彩窗',
    render: () => (
      <>
        <p>曾经是一面巨大的彩色玻璃窗。现在只剩窗框和零星几块碎片。但地上的碎片居然还保持着色彩——红的、蓝的、金色的。</p>
        <VoiceBlock type="song">我能看出这幅画原来画的是什么。一个人站在两团火之间。左边的火是暖色的，右边的火是一种你在自然界中从未见过的蓝。那个人的手同时伸向两边。他的表情……地上的碎片不够了。画脸的那几块玻璃不见了。</VoiceBlock>
        <p>你捡起一块金色碎片。它在你手中发出微弱的暖光——三百年了，这块玻璃还记得当初画师把金箔融进去时的温度。</p>
        <p>再捡起一块蓝色碎片。冰凉。这种蓝不属于人类的色彩体系——这是用魔族视觉颜料制作的。人类圣堂的彩窗上，用的是魔族的颜料。</p>
        <VoiceBlock type="rift">这座圣堂建于两族分裂之后一百年。那时候应该已经是死敌了。为什么圣堂的彩窗上会用魔族的材料？要么是当时的敌意没有后来传唱的那么深——要么是有人在建造这座圣堂时，刻意想要纪念某种不该被遗忘的联系。</VoiceBlock>
      </>
    ),
    fx: (s) => { s.lore += 8; s.rel += 5; s.items.push('双色玻璃碎片'); }
  },
  cavern_crystal: {
    title: '晶体簇',
    render: () => (
      <>
        <p>从洞壁上伸出的结晶簇，像一只张开的手掌。每根晶体都是深蓝色的，内部有纹路——不是天然纹路，而是法纹。有人把法阵刻进了正在生长的结晶体内。</p>
        <VoiceBlock type="rune">这不是“刻”的。法纹和结晶同时生长。某个术者花了至少两百年的时间，一边控制结晶的生长速度，一边将法纹编入结构。这是一封信。用两百年的时间写的信。</VoiceBlock>
        <p>你把耳朵贴近结晶簇。能听到声音。不是嗡鸣——而是一段极其缓慢的话语。每个字之间间隔大约四十年。如果把速度加快一万倍——</p>
        <VoiceBlock type="rune">“不要相信分火之后的编号。我们不是七个人。”</VoiceBlock>
        <p>结晶的末端正在生长。每年大约长一毫米。这封信还没有写完。</p>
      </>
    ),
    fx: (s) => { s.lore += 10; s.voices.rune = Math.max(s.voices.rune, 2); s.flags.crystalMsg = true; }
  },
  cavern_notes: {
    title: '角落里的笔记',
    render: () => (
      <>
        <p>一叠泛黄的纸页。墨水是魔族传统的靛蓝色。字迹很小、很密，但异常工整。不是一个疯狂的人写的——是一个极度严谨的人在极度不安的状态下写的。</p>
        <p className="text-tx-muted italic my-2 p-2 border-l-2 border-rune">“第371次验算。结果相同。能量方程中必须存在第八个变量。删除这个变量后方程不成立——但所有现存记录中都只有七位参与者。我开始怀疑不是记录出了错，而是现实出了错。或者更准确地说——是现实被故意修正了。”</p>
        <VoiceBlock type="rift">翻到最后一页。写作日期是十一年前。笔记在一句话的中间断了：“如果第八位参与者被世界本身从历史中删除，那么寻找她的行为本身就是在——”就到这里。没有句号。没有后续。</VoiceBlock>
        <p>笔记的最后一页背面画着一个简单的图案——八个圆围成一圈。其中七个里面有符号。第八个是空的。但“空”这个描述不准确——更像是那个位置的纸张本身拒绝承载任何墨迹。你试着用手指在那个位置写字。手指滑过去了，却什么也没留下。</p>
      </>
    ),
    fx: (s) => { s.lore += 12; s.rel += 8; s.flags.foundNotes = true; }
  },
  lighthouse_log: {
    title: '守塔人日志',
    render: () => (
      <>
        <p>一本厚重的皮面日志。封面上没有名字——只有一个被反复描画了几百次的圆形符号。</p>
        <p className="text-tx-muted italic my-2 p-2 border-l-2 border-ember-dark">“第一年。灯亮了。海上什么也看不见。”</p>
        <p className="text-tx-muted italic my-2 p-2 border-l-2 border-ember-dark">“第七十三年。换了新的守塔人。灯油配方改了。旧配方失传了。但灯还亮着。”</p>
        <p className="text-tx-muted italic my-2 p-2 border-l-2 border-ember-dark">“第二百一十年。海对面传来了回光。有人在对面也点了一盏灯。我们不知道他们是谁。”</p>
        <p className="text-tx-muted italic my-2 p-2 border-l-2 border-ember-dark">“第三百零八年。回光消失了。不是灭了——而是那个方向不再存在。罗盘上少了一个刻度。”</p>
        <VoiceBlock type="rift">罗盘上少了一个刻度。这意味着不只是“对面的灯灭了”——而是世界的共识现实中，“对面有东西”这个信息本身被删除了。一整个方向的存在感被抹去。</VoiceBlock>
        <p>最后一条记录没有年份。字迹颤抖得厉害：</p>
        <p className="text-tx-muted italic my-2 p-2 border-l-2 border-ember">“灯不再需要油了。灯在靠我的记忆燃烧。当我忘记为什么要点灯的那一天，灯就会灭。”</p>
      </>
    ),
    fx: (s) => { s.lore += 15; s.rel += 10; s.flags.readLog = true; }
  },
  lighthouse_lens: {
    title: '透镜装置',
    render: () => (
      <>
        <p>灯塔顶部的透镜还在。一组嵌套的水晶弧面。透镜没有灰尘。三百年无人看管，却没有灰尘。</p>
        <VoiceBlock type="rune">透镜表面有一层极薄的法阵——不是防尘的低级术式。这是一个“记忆折射阵”。它不折射光——它折射信息。任何照射到这面透镜上的光线，都会被折射成它携带过的所有信息的光谱。</VoiceBlock>
        <p>你把手伸到透镜前方。傍晚的阳光穿过你的手指，打在透镜上。透镜亮了。</p>
        <p>光线被折射成无数细小的光点，投射在灯塔的圆形墙壁上。每一个光点里都有一个画面——一片森林着火了。一个小女孩在井边打水。一面旗帜在远方的城墙上被降下。一个人在沙漠中独行。</p>
        <VoiceBlock type="ember">所有这些画面有一个共同点——它们都发生在此刻。就是现在。你看到的是阳光此刻正在照耀的整个世界。你看到的是此刻还活着的所有故事。</VoiceBlock>
        <p>光线移走了。画面消失了。灯塔重新变得安静。</p>
        <p>但你知道了——世界比你以为的大。故事比你以为的多。而且它们都在同时发生。</p>
      </>
    ),
    fx: (s) => { s.voices.rune = Math.max(s.voices.rune, 2); s.voices.ember = Math.max(s.voices.ember, 2); s.lore += 10; }
  },
  strange_shell: {
    title: '奇异的海螺',
    render: () => (
      <>
        <p>一枚灰白色的海螺，表面布满了不规则的螺旋纹路。你把它放在耳边，听到的不是海浪声，而是低语。</p>
        <VoiceBlock type="song">“深渊在注视……不要相信光……”</VoiceBlock>
        <p>海螺在你手中化为一滩灰烬，但那句低语已经刻在了你的脑海里。</p>
      </>
    ),
    fx: (s) => { s.lore += 5; s.flags.heardShell = true; s.items.push('深渊的低语'); }
  },
  loose_stone: {
    title: '松动的石砖',
    render: () => (
      <>
        <p>你推开祭坛下方那块松动的石砖。里面是一个很小的暗格。</p>
        <p>暗格里放着一枚生锈的铁戒指和一张羊皮纸条。纸条上的字迹已经模糊不清，只能勉强辨认出几个字：“致……最后的……守护者。”</p>
        <VoiceBlock type="ember">这枚戒指的主人曾经发誓要守护这座圣堂，直到生命的最后一刻。他做到了吗？你不知道。但戒指上残留的执念让你感到一阵心悸。</VoiceBlock>
      </>
    ),
    fx: (s) => { s.faith += 5; s.items.push('生锈的铁戒指'); s.flags.foundRing = true; }
  },
  abyss_blade: {
    title: '漆黑的短剑',
    render: () => (
      <>
        <p>剑刃没有反光，仿佛能吞噬周围的光线。剑柄上刻着一个你无法理解的符号。</p>
        <VoiceBlock type="ember">握住它的时候，你感到一种冰冷的平静。所有的恐惧和迷茫都被这股冰冷压制了。</VoiceBlock>
      </>
    ),
    fx: (s) => { s.items.push('深渊短剑'); s.cards.push('深渊之击'); s.flags.gotAbyssBlade = true; }
  },
  broken_vials: {
    title: '破碎的试剂瓶',
    render: () => (
      <>
        <p>玻璃碎片散落一地，里面残留着干涸的紫色粉末。你闻到一股刺鼻的硫磺味。</p>
        <VoiceBlock type="rune">这是用来提取高纯度魔力的溶剂。但它极不稳定，稍有不慎就会引发爆炸。看来这位学者在进行一项非常危险的实验。</VoiceBlock>
        <p>你在碎片中找到了一瓶完好的紫色药剂。你把它收进了口袋。</p>
      </>
    ),
    fx: (s) => { s.lore += 5; s.flags.gotPotion = true; s.items.push('不稳定魔力药剂'); }
  },
  dusty_mirror: {
    title: '布满灰尘的铜镜',
    render: () => (
      <>
        <p>你擦去铜镜上的灰尘。镜子里映出的不是你现在的脸，而是你更年轻时的模样。</p>
        <VoiceBlock type="rift">这面镜子映出的是你记忆中最深刻的那个自己。为什么是那个时候？那时候发生了什么让你无法释怀的事？</VoiceBlock>
        <p>你盯着镜子，突然感到一阵眩晕。镜子里的你对你露出了一个诡异的微笑，然后递给你一块发光的碎片。你接过了它。</p>
      </>
    ),
    fx: (s) => { s.rel -= 5; s.flags.gotShard = true; s.items.push('记忆碎片'); }
  }
};

export const SCENES_DATA: Record<string, {
  onEnter?: (state: GameState) => void;
  render: (state: GameState, onExamine: (id: string) => void) => React.ReactNode;
  choices?: { text: string; to: string; tag?: string; cls?: string; fx?: (state: GameState) => void; req?: (state: GameState) => boolean }[];
}> = {
  title: {
    render: () => (
      <div className="text-center pt-16 pb-8">
        <AIGeneratedImage prompt="anime fantasy landscape ancient ruins frieren style" alt="余烬编年" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-8 shadow-md" />
        <div className="text-[10px] tracking-[0.4em] text-tx-faint mb-6">一款关于记忆、传唱与遗忘的文字冒险</div>
        <div className="font-display text-5xl text-ember tracking-[0.3em] mb-3">余 烬 编 年</div>
        <div className="text-xs text-tx-faint tracking-[0.5em] mb-10">E M B E R &ensp; C H R O N I C L E</div>
        <div className="w-16 h-px bg-ember-dark mx-auto mb-10"></div>
        <div className="max-w-md mx-auto text-sm text-tx-muted leading-loose mb-12">
          在这个世界里，现实由真实、记忆、传唱与共识共同塑造。<br/>
          你听到的每一个故事都可能改变世界的形状。<br/>
          你遗忘的每一个名字都可能让某人从存在中消失。<br/><br/>
          <span className="text-tx-faint text-xs">万物有记忆。风有故事。石头比人更擅长悲伤。</span>
        </div>
      </div>
    ),
    choices: [{ text: '醒 来', to: 'coastal_road', tag: '开始游戏', cls: 'ex' }]
  },
  coastal_road: {
    render: (s, ex) => (
      <>
        <ChapterHeader label="序 章" title="海 岸 古 道" />
        <Narrator>你所听到的，未必是真。但在世界里，被听到的，终将成真。——这条路已经很老了。老到连它自己都不记得自己最初通向哪里。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime ancient coastal road cliff twilight frieren style" alt="海岸古道" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>你在一条灰白色的古道上醒来。不是突然的醒来——更像是从一层很厚的水中缓慢浮起，最后破出水面的那一刻。</p>
          <p>天空的颜色介于黄昏与黎明之间，像是这片大地被卡在了两个时辰的交界处，谁也不肯让步。远处的海岸线上，悬崖像一排缺了牙的下颌骨，灰色的浪花在四十米下面不知疲倦地拍打着。</p>
          <VoiceBlock type="ember">你的后脑勺有一种被按过的钝痛。不是受伤的痛——是某段记忆被强行塞进来或拔出去时留下的痕迹。你的名字……你的名字还在。其他的……模糊了。</VoiceBlock>
          <p>古道两侧散落着遗物。一根<ExamineWord id="lantern" onExamine={ex}>断裂的灯柱</ExamineWord>，一段<ExamineWord id="boundary_wall" onExamine={ex}>界墙残片</ExamineWord>。脚下的<ExamineWord id="road_stones" onExamine={ex}>鹅卵石路面</ExamineWord>被千年的脚步磨得发亮。</p>
          <p><ExamineWord id="wind" onExamine={ex}>海风</ExamineWord>从西南方向持续吹来，带着盐分和某种更远的东西——像是故事的碎片，在空气中翻滚然后消散。</p>
          <p>你低头看了看<ExamineWord id="hands" onExamine={ex}>自己的双手</ExamineWord>。指甲下嵌着不属于任何近期记忆的灰白色灰烬。</p>
          <p>远处，<ExamineWord id="sea" onExamine={ex}>大海</ExamineWord>在悬崖下面沉默地运动着。崖边有一枚<ExamineWord id="strange_shell" onExamine={ex}>奇异的海螺</ExamineWord>。</p>
          <VoiceBlock type="song">听。风变了方向。它现在从三个方向同时吹来——北方、南方、和一个不在罗盘上的方向。三股风各自携带着不同时代的温度。最冷的那一股来自最远的过去。</VoiceBlock>
          <p>古道在前方分成了三条岔路。一块被苔藓覆盖的路牌歪斜地插在分叉点。三个方向各有一个符号——向北是一个<b className="text-rune">十字</b>，向东是一个<b className="text-blood">螺旋</b>，向西是一个<b className="text-ember">圆</b>。</p>
        </div>
      </>
    ),
    choices: [
      { text: '向北——十字的方向。古道尽头似乎有一座建筑的残骸，像教堂。', to: 'chapel', tag: '人类侧', cls: 'hu' },
      { text: '向东——螺旋的方向。岩壁上有一个洞口，蓝色的微光从洞深处渗出。', to: 'cavern', tag: '魔族侧', cls: 'de' },
      { text: '向西——圆的方向。悬崖边缘有一座灯塔的轮廓。它不应该还亮着，但它亮着。', to: 'lighthouse', tag: '中立', cls: 'lo' },
      { text: '向着海螺低语的方向走去（隐藏路线）', to: 'hidden_cove', tag: '深渊', cls: 'ex', req: (s) => s.flags.heardShell }
    ]
  },
  chapel: {
    onEnter: (s) => { s.faction = 'human'; s.faith += 10; },
    render: (s, ex) => (
      <>
        <ChapterHeader label="第 一 章" title="废 弃 圣 堂" />
        <Narrator>圣堂不是被摧毁的。它是被遗忘的。当最后一个记得它的人死去后，屋顶就开始自行塌陷——不是因为结构失效，而是因为没有人的信念在支撑它了。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime abandoned ruined chapel stained glass frieren style" alt="废弃圣堂" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>圣堂比你想象的要小。或者说，它正在变小——石墙在以肉眼不可见的速度向内收缩，像一颗正在冷却的心脏。</p>
          <p>空气中有蜡烛燃尽后的味道。内部光线暧昧，从<ExamineWord id="chapel_glass" onExamine={ex}>碎裂的彩窗</ExamineWord>处漏进来的光线在地上画出残缺的色块。</p>
          <p><ExamineWord id="chapel_altar" onExamine={ex}>石质祭坛</ExamineWord>立在尽头，上面的烛泪层层堆叠成了微型山脉。祭坛下方似乎有一块<ExamineWord id="loose_stone" onExamine={ex}>松动的石砖</ExamineWord>。</p>
          <VoiceBlock type="ember">这里有过很多很多次祈祷。祈祷的残留不像声音那样消散——它们渗进了石头里。如果你把耳朵贴在墙上，你不会听到话语。但你会感到一种压力。是很多人同时期望着同一件事时产生的那种压力。</VoiceBlock>
          <VoiceBlock type="song">五大家族。不——七大家族。我刚才差点也只记得五个了。这座圣堂属于被遗忘的那两个家族。当诗人不再唱你的名字，你就从故事中退场。当故事中没有你，你就从现实中退场。</VoiceBlock>
          <p>门口传来脚步声。</p>
        </div>
      </>
    ),
    choices: [{ text: '转身面对来人。', to: 'meet_bard', tag: '遇见', cls: 'ex' }]
  },
  cavern: {
    onEnter: (s) => { s.faction = 'demon'; s.lore += 10; },
    render: (s, ex) => (
      <>
        <ChapterHeader label="第 一 章" title="结 晶 洞 窟" />
        <Narrator>魔族不信任语言。语言会被篡改、遗忘、重新解释。所以他们把真相存进结晶——结晶不说谎，但结晶也不解释。你看到什么，取决于你配看懂多少。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime glowing blue crystal cavern frieren style" alt="结晶洞窟" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>洞口比你的肩膀宽不了多少。但一旦进去，空间突然打开——像走进了一座被埋在地下的教大堂，只是柱子全是<ExamineWord id="cavern_crystal" onExamine={ex}>发光的晶体簇</ExamineWord>。</p>
          <p>蓝色的光。不是冷光——是一种有深度的蓝，像你在最清澈的海水中下潜了二十米后看到的那种蓝。</p>
          <VoiceBlock type="rune">这些结晶不是天然的矿物。它们是凝固的法力。非常非常古老的法力。在液态法力彻底稀释之前的那个时代——有人把大量法力注入了这个地质构造，然后等它结晶。整个洞窟就是一座图书馆。</VoiceBlock>
          <p>洞窟深处有一张用平整石板搭成的桌子。上面放着几张纸——<ExamineWord id="cavern_notes" onExamine={ex}>某人留下的笔记</ExamineWord>。</p>
          <p>桌子旁边散落着一些<ExamineWord id="broken_vials" onExamine={ex}>破碎的试剂瓶</ExamineWord>。</p>
          <VoiceBlock type="ember">有人在这里生活过。不是短暂停留——是真正的生活。桌子边上有一把椅子的凹痕。地面上有反复踱步的磨损。某个人在这个洞窟里独自工作了很长时间。足够长，以至于他的脚步磨平了石头。</VoiceBlock>
          <p>洞窟最深处传来一个声音。不是回声——是一个正在说话的人。</p>
        </div>
      </>
    ),
    choices: [{ text: '向洞窟深处走去。', to: 'meet_scholar', tag: '遇见', cls: 'ex' }]
  },
  lighthouse: {
    onEnter: (s) => { s.rel += 15; },
    render: (s, ex) => (
      <>
        <ChapterHeader label="第 一 章" title="旧 日 灯 塔" />
        <Narrator>这座灯塔不属于人类，也不属于魔族。它比两者都古老。它属于一个还不需要区分“谁的故事更真”的时代。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime ancient stone lighthouse glowing frieren style" alt="旧日灯塔" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>灯塔在你接近时变高了。这不是错觉。石壁上的纹路在你走近时微微发光，灯塔的轮廓随之变得更清晰、更完整。好像你的注视本身就在修复它。</p>
          <VoiceBlock type="rift">小心。这些纹路是一种“观察者响应法阵”——它会根据观察者的期望调整外观。你期望看到一座完整的灯塔，所以它看起来完整了。但里面可能不是这样。</VoiceBlock>
          <p>内部是一道螺旋楼梯。墙上是<ExamineWord id="lighthouse_log" onExamine={ex}>守塔人日志</ExamineWord>——直接刻在墙上的文字，从底层一直螺旋到顶层。三百多年的记录，绕着楼梯转了三百多圈。</p>
          <p>你爬到了顶部。<ExamineWord id="lighthouse_lens" onExamine={ex}>透镜装置</ExamineWord>还在。灯塔的光源已经不是油灯或火焰——它发出的是一种没有热量的光。温柔的、不刺眼的、像是黎明前最后一颗星的那种光。</p>
          <p>透镜旁边有一个<ExamineWord id="dusty_mirror" onExamine={ex}>布满灰尘的铜镜</ExamineWord>。</p>
          <VoiceBlock type="song">这座灯塔照的不是海面。它照的是时间。它的光能照到过去和未来。现在它的光非常微弱，只能照到几分钟前和几分钟后。但曾经——曾经它能照亮整个纪元。</VoiceBlock>
        </div>
      </>
    ),
    choices: [{ text: '凝视透镜——试图看到它曾经照亮的东西。', to: 'lighthouse_vision', tag: '接触真相', cls: 'lo' }]
  },
  meet_bard: {
    onEnter: (s) => { 
      s.companions.push('吟游诗人 · 卡尔'); 
      s.cards.push('被遗忘的旋律'); 
      s.faith += 5; 
    },
    render: () => (
      <>
        <div className="text-[14.5px] leading-loose space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 15 }}
            animate={{ opacity: 1, x: 0, rotate: [15, -10, 8, -4, 0] }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="origin-bottom-right"
          >
            <AIGeneratedImage prompt="anime male bard broken lute frieren style" alt="吟游诗人卡尔" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          </motion.div>
          <p>一个男人站在圣堂门口。旧外袍，瘦长身形，背上系着一把缺弦的琴。</p>
          <VoiceBlock type="ember">不是警惕。不是友善。是辨认。他在看你的时候，脸上有一种表情：像是在翻一本很旧的相册，试图确认你的脸出现在哪一页。</VoiceBlock>
          <p>“又一个醒来的人。”他说。“我叫卡尔。边境最后一个……”他苦笑了。“最后一个还记得自己是什么人的吟游诗人。”</p>
          <p>他走进圣堂，目光落在那排正在消失的签名上。他沉默了很久。</p>
          <p>“我的琴有七根弦。”他把琴从背上取下来。“现在只有五根。另外两根在某天早上消失了。没有断——是消失。琴颈上没有它们存在过的痕迹。但我的手指……”他低头看着自己的手。“我的手指还在找它们。”</p>
          <VoiceBlock type="song">他的手指没有说谎。那段旋律……我几乎能听到它。介于大调和小调之间，用了一种现代音乐中已经废弃的音程。那是七大家族之歌的第四和第六段。它们曾经存在。它们被从传唱中移除了。然后它们从现实中消失了。</VoiceBlock>
          {s.flags.foundRing && (
            <p>他的目光落在了你手上的生锈铁戒指上，瞳孔猛地收缩。“你……你找到了守护者的戒指？原来那个传说是真的……”</p>
          )}
        </div>
        <div className="my-4 p-3 rounded-md border border-ember-dark bg-ember/10 text-ember text-xs">
          卡尔加入了你的队伍。获得卡牌：被遗忘的旋律。
        </div>
      </>
    ),
    choices: [
      { text: '“走吧。我需要一个记得更多的人。”', to: 'road_anomaly', tag: '继续前进', cls: 'ex' },
      { text: '“这枚戒指，你知道它的故事？”', to: 'bard_ring_lore', tag: '追问', cls: 'hu', req: (s) => s.flags.foundRing }
    ]
  },
  meet_scholar: {
    onEnter: (s) => { 
      s.companions.push('魔族学者 · 伊斋拉'); 
      s.cards.push('法纹解析'); 
      s.lore += 8; 
    },
    render: () => (
      <>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime female demon scholar blue skin frieren style" alt="魔族学者伊斋拉" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>洞窟深处，一个修长的身影站在最大的一簇结晶前。她的皮肤呈淡灰蓝色，在结晶的光芒下像被水浸透了的月光。法纹在她的手臂上缓缓流动——不是纹身，是活的线路。</p>
          <p>“我叫伊斋拉。”她终于转过身来。竖瞳，但比你记忆中的魔族竖瞳更接近圆形。“桌上的笔记是我母亲留下的。她在这里研究了一百七十年。然后有一天她醒来，发现自己不记得为什么要在这里了。”</p>
          <VoiceBlock type="rift">注意她说的。她的母亲没有忘记答案——她忘记了问题。这意味着某种力量不是在删除知识，而是在删除求知的动机。更精巧。也更残忍。</VoiceBlock>
          <p>“结论很简单——分火仪式中有第八个参与者。第八个被从现实中删除了。不是被人删除——是被更高层级的东西删除了。”</p>
          <p>她看着你。竖瞳在结晶的蓝光中收缩成一条线。</p>
          <p>“而你手心上的那个印记，”她的声音降到了耳语，“是第八个参与者的锚定符文。”</p>
          {s.flags.gotPotion && (
            <p>她突然停住，目光死死盯着你口袋里的紫色药剂。“你找到了那个溶剂？快给我！我需要它来稳定法阵！”</p>
          )}
        </div>
        <div className="my-4 p-3 rounded-md border border-ember-dark bg-ember/10 text-ember text-xs">
          伊斋拉加入了你的队伍。获得卡牌：法纹解析。
        </div>
        <VoiceBlock type="rune">她说得对。但她没有说的是——后半部分就在她的手腕内侧。你在结晶的光线下看到了。她可能不知道。也可能知道但选择不说。</VoiceBlock>
      </>
    ),
    choices: [
      { text: '“第八个参与者——和我有什么关系？”', to: 'road_anomaly', tag: '继续深入', cls: 'ex' },
      { text: '把紫色药剂交给她', to: 'scholar_potion', tag: '协助', cls: 'de', req: (s) => s.flags.gotPotion }
    ]
  },
  lighthouse_vision: {
    onEnter: (s) => { 
      s.hp -= 5; 
      s.cards.push('原初回响'); 
      s.voices.rift = Math.max(s.voices.rift, 2); 
      s.lore += 15; 
      s.flags.sawVision = true; 
    },
    render: () => (
      <>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime magical lens shattering reality frieren style" alt="透镜幻象" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>你把手放在透镜上。世界碎了。</p>
          <p>不是比喻。你的视野中，现实像玻璃一样碎成了几百块。每一块碎片里都有一个不同的画面。碎片之间的缝隙是白色的虚无。</p>
          <p>画面开始聚焦——你看见了<b className="text-ember">分火之前</b>。</p>
          <p>一座巨大的圆形殿堂。原初人不是在说话。他们在用意志直接塑造周围的现实。一个人激动地挥手，墙壁就变成了海洋。另一个人反驳，海洋就凝固成了冰川。</p>
          <VoiceBlock type="ember">他们在吵架。不是用嘴——用存在。他们的分歧让物质世界跟着一起摇晃。这就是为什么需要“分火”。不是因为邪恶。是因为当情感本身能改变物理法则时，一场普通的争吵就是一场地震。</VoiceBlock>
          <p>画面加速。八个人站在法阵中央。七个人的表情是决绝。第八个人的脸你看不见——那里是一个人形的空洞，画面本身<b className="text-blood">不存在</b>。</p>
          <VoiceBlock type="rift">世界化身的手笔。它不仅仅删除了这个人的存在——它删除了所有能观察到这个人的视角。即使是透镜的记忆折射，也无法重建一个被从“可观察性”本身中移除的对象。</VoiceBlock>
          <p>你的手从透镜上滑落。鼻子在流血。但在最后一瞬间，你感觉到了一种情绪——</p>
          <p><b className="text-ember">恐惧。不是对死亡的恐惧。是对被遗忘的恐惧。</b></p>
          <p>第八个人在最后的瞬间，最害怕的不是仪式会失败，不是自己会死——而是没有人会记得他曾经存在过。</p>
          <p>而这正是后来发生的事。</p>
          {s.flags.gotShard && (
            <p>你口袋里的记忆碎片突然变得滚烫。它似乎与透镜产生了某种共鸣，让你看到了更深层的幻象：一个戴着面具的人，正站在灯塔顶端，俯视着那场海战。</p>
          )}
        </div>
        <div className="my-4 p-3 rounded-md border border-ember-dark bg-ember/10 text-ember text-xs">
          获得卡牌：原初回响。裂隙低语觉醒至 Lv.2。生命值 -5。
        </div>
      </>
    ),
    choices: [
      { text: '擦掉鼻血，走下灯塔。你需要找到其他人。', to: 'road_anomaly', tag: '继续旅途', cls: 'ex' },
      { text: '试图看清面具人的脸', to: 'lighthouse_mask', tag: '追寻真相', cls: 'lo', req: (s) => s.flags.gotShard }
    ]
  },
  road_anomaly: {
    render: (s) => (
      <>
        <ChapterHeader label="第 一 章" title="现 实 的 裂 痕" />
        <Narrator>当世界开始遗忘，它并不是均匀地褪色。它像是一块劣质的画布，某些地方的颜料会突然成块地剥落，露出下面令人不安的空白。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime reality glitching fading path frieren style" alt="现实裂痕" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>你沿着古道继续前行。天空的颜色变得越来越不自然，黄昏的紫红色中夹杂着不应存在的灰白斑块。</p>
          <VoiceBlock type="rift">注意脚下。物理法则在这里变得稀薄。重力似乎在犹豫，风向每隔几秒就改变一次。世界正在失去对这片区域的“共识”。</VoiceBlock>
          {s.companions.includes('吟游诗人 · 卡尔') && (
            <p>卡尔停下脚步，手按在琴弦上。“空气里的声音不对。像是一首曲子突然跳过了几个小节。有什么东西被强行抹去了，连带着它周围的空间也一起崩塌。”</p>
          )}
          {s.companions.includes('魔族学者 · 伊斋拉') && (
            <p>伊斋拉蹲下身，用手指触摸地面。“法纹断裂了。不是被破坏，而是……从根源上被否定了存在。就像有人在世界的源代码里删掉了一行。”</p>
          )}
          <p>前方的道路被一团扭曲的灰雾阻挡。雾中隐约传来金属碰撞和绝望的呼喊声，但声音听起来空洞而遥远，仿佛隔着一层厚厚的玻璃。</p>
          <VoiceBlock type="ember">那不是雾。那是“遗忘”的具象化。一段被抛弃的历史正在那里垂死挣扎。它感知到了你——一个还拥有记忆的人。它渴望被记住，即使是以暴力的形式。</VoiceBlock>
        </div>
      </>
    ),
    choices: [{ text: '拔出武器，走进灰雾', to: 'combat', tag: '迎战', cls: 'ex' }]
  },
  combat: {
    render: () => (
      <>
        <ChapterHeader label="第 二 章" title="叙 事 残 影" />
        <Narrator>当一段故事失去了所有记得它的人，故事中的角色就会变成这样——半透明的、困惑的、还在重复着一个已经没有观众的剧本。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime translucent ghost knight frieren style" alt="叙事残影" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md opacity-80" />
          <p>古道的下一个弯道之后，空气变得浓稠。</p>
          <p>一团灰白色的身影。它的形态每隔几秒就变化一次——时而是一个持盾的骑士，时而是一个低头书写的文官，时而是一个抱着孩子奔跑的女人。不是变形——是三个人叠加在同一个空间里。</p>
          <VoiceBlock type="song">这是一段被遗忘的家族史。骑士、文官、母亲——同一个家族三代人。当城镇从共识中被删除时，这家人的故事也失去了所有听众。于是他们变成了这个——一个没有观众的剧目，在空旷的舞台上无限循环。</VoiceBlock>
          <p>残影感知到了你。它举起武器——三种武器叠加。剑、笔、和一双空手。</p>
        </div>
      </>
    )
  },
  post_combat: {
    onEnter: (s) => { 
      s.cards.push('残影遗书'); 
      s.items.push('被遗忘家族的铜纽扣'); 
      s.lore += 10; 
    },
    render: () => (
      <>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime ghost fading into light frieren style" alt="残影消散" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>残影碎散了。三个身影从叠加状态中分离出来。骑士最先散去，他的光点向北飘，像是要回到某座已经不在的城堡。文官的光点停留在原地，围绕着一个看不见的书桌旋转了几圈，然后也散了。</p>
          <p>最后是母亲。她的光点没有马上消失。它们凝聚成了一个孩子的轮廓——很小，可能只有三四岁。然后孩子的轮廓转向你，做了一个动作。</p>
          <VoiceBlock type="ember">她在挥手。她在向你挥手告别。一个曾经存在过但被世界遗忘了的孩子，在生命的最后一个瞬间，向一个陌生人挥手告别。</VoiceBlock>
          <p>光点散尽。地上留下了一样东西——一枚小小的铜纽扣。和你在古道鹅卵石缝里看到的是同一种式样。</p>
          <p>你捡起纽扣。铜是温的。</p>
          <VoiceBlock type="song">纽扣上刻着一个家族纹章——一匹马，驮着一个小小的太阳。这是科拉萨商队的标志。“太阳走到哪里，道路就通到哪里。”被遗忘的第六个家族。</VoiceBlock>
          <VoiceBlock type="rift">纽扣背面有一行小字。“送给我们最小的旅行家。”这是母亲给孩子的礼物。一枚军用纽扣改成的玩具——因为军队的纽扣是铜做的，不会生锈，可以传很多代。</VoiceBlock>
          <p>你把纽扣放进口袋。口袋变得比一枚纽扣该有的重量更重。</p>
        </div>
        <div className="my-4 p-3 rounded-md border border-ember-dark bg-ember/10 text-ember text-xs">
          获得物品：被遗忘家族的铜纽扣。获得卡牌：残影遗书。
        </div>
      </>
    ),
    choices: [
      { text: '继续前行。天色更暗了，你需要找一个地方休息。', to: 'camp', tag: '安全路线', cls: 'ex' },
      { text: '走进路旁的迷雾森林。那里似乎有某种微光。', to: 'mist_forest', tag: '探索', cls: 'lo' }
    ]
  },
  mist_forest: {
    onEnter: (s) => {
      const rand = Math.random();
      if (rand < 0.33) {
        s.flags.forestEncounter = 'merchant';
      } else if (rand < 0.66) {
        s.flags.forestEncounter = 'ruins';
      } else {
        s.flags.forestEncounter = 'ambush';
      }
    },
    render: (s) => {
      if (s.flags.forestEncounter === 'merchant') {
        return (
          <>
            <ChapterHeader label="迷 雾 森 林" title="神 秘 商 人" />
            <div className="text-[14.5px] leading-loose space-y-4">
              <AIGeneratedImage prompt="anime mysterious merchant plague doctor mask misty forest frieren style" alt="Mystic Merchant" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
              <p>迷雾中，一盏提灯摇晃着。一个戴着鸟嘴面具的高大身影坐在一辆没有马拉的木车上。</p>
              <p>“迷路的人，还是寻找过去的人？”商人的声音像是两块干木头在摩擦。“我这里不卖剑，也不卖面包。我卖的是‘被遗忘的常识’。”</p>
              <VoiceBlock type="rift">他的车上装满了玻璃罐。里面装的不是物品，而是概念。我看到了“星期八的早晨”、“第五种基本味觉”和“一种已经灭绝的颜色的名字”。</VoiceBlock>
              <p>商人向你伸出手：“用你的一点血，换取一个秘密。如何？”</p>
            </div>
          </>
        );
      } else if (s.flags.forestEncounter === 'ruins') {
        return (
          <>
            <ChapterHeader label="迷 雾 森 林" title="沉 睡 遗 迹" />
            <div className="text-[14.5px] leading-loose space-y-4">
              <AIGeneratedImage prompt="anime ancient stone ruins misty forest frieren style" alt="Ancient Ruins" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
              <p>雾气散去一些，露出了一座半掩埋在泥土中的石雕。雕像没有脸，只有一只巨大的手掌托着一团石刻的火焰。</p>
              <VoiceBlock type="rune">这是一种古老的能量节点。虽然已经枯竭，但残留的法纹依然在微弱地运转。如果你把手放上去，也许能吸收一点残存的知识。</VoiceBlock>
              <p>你在雕像前停下，感受到一种跨越千年的宁静。</p>
            </div>
          </>
        );
      } else {
        return (
          <>
            <ChapterHeader label="迷 雾 森 林" title="迷 雾 伏 击" />
            <div className="text-[14.5px] leading-loose space-y-4">
              <AIGeneratedImage prompt="anime dark misty forest shadowy figures frieren style" alt="Mist Ambush" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
              <p>四周的雾气突然变得浓稠，带着一股刺鼻的血腥味。树影扭曲，化作几道模糊的残影向你扑来。</p>
              <VoiceBlock type="ember">危险！这些不是普通的残影，它们是迷雾中迷失的雇佣兵的怨念。它们没有理智，只有对生者的嫉妒。</VoiceBlock>
              <p>你不得不拔出武器，准备迎战。</p>
            </div>
          </>
        );
      }
    },
    choices: [
      { 
        text: '交易（失去 5 HP，获得 10 学识与神秘卡牌）', 
        to: 'camp', 
        tag: '商人', 
        cls: 'lo',
        req: (s) => s.flags.forestEncounter === 'merchant',
        fx: (s) => { s.hp -= 5; s.lore += 10; s.cards.push('被遗忘的常识'); }
      },
      { 
        text: '拒绝交易，离开', 
        to: 'camp', 
        tag: '商人', 
        cls: 'ex',
        req: (s) => s.flags.forestEncounter === 'merchant'
      },
      { 
        text: '触摸雕像（获得 8 信仰，恢复 5 HP）', 
        to: 'camp', 
        tag: '遗迹', 
        cls: 'hu',
        req: (s) => s.flags.forestEncounter === 'ruins',
        fx: (s) => { s.faith += 8; s.hp = Math.min(s.hp + 5, s.maxHp); }
      },
      { 
        text: '迎战！', 
        to: 'forest_combat', 
        tag: '伏击', 
        cls: 'ex',
        req: (s) => s.flags.forestEncounter === 'ambush'
      }
    ]
  },
  forest_combat: {
    render: () => (
      <>
        <ChapterHeader label="迷 雾 森 林" title="怨 念 之 战" />
        <Narrator>迷雾中没有真正的实体，只有那些不愿散去的执念。它们攻击你，不是为了杀戮，而是为了让你也成为它们的一部分。</Narrator>
      </>
    )
  },
  post_forest_combat: {
    onEnter: (s) => { 
      s.cards.push('迷雾结晶'); 
      s.lore += 5; 
    },
    render: () => (
      <>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime mist clearing sunlight piercing through trees frieren style" alt="战斗结束" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>随着最后一道残影消散，周围的雾气也渐渐退去。地上留下了一块散发着微光的结晶。</p>
          <VoiceBlock type="song">这块结晶里封存着他们生前最后的一段记忆。虽然残缺不全，但足以证明他们曾经存在过。</VoiceBlock>
          <p>你将结晶收起，继续向前走去。前方隐约透出了火光。</p>
        </div>
        <div className="my-4 p-3 rounded-md border border-ember-dark bg-ember/10 text-ember text-xs">
          获得卡牌：迷雾结晶。
        </div>
      </>
    ),
    choices: [
      { text: '走向火光，寻找休息的地方。', to: 'camp', tag: '营地', cls: 'ex' }
    ]
  },
  camp: {
    onEnter: (s) => { 
      s.hp = Math.min(s.hp + 10, s.maxHp); 
      s.faith += 5; 
    },
    render: (s) => {
      const hasBard = s.companions.includes('吟游诗人 · 卡尔');
      const hasScholar = s.companions.includes('魔族学者 · 伊斋拉');
      
      return (
        <>
          <ChapterHeader label="第 三 章" title="余 烬 营 地" />
          <Narrator>篝火是人类最古老的故事装置。所有文明的叙事传统都起源于围着火光的那些夜晚。火的好处不在于光——而在于它创造了一个让所有人面朝同一个中心的圆。</Narrator>
          <div className="text-[14.5px] leading-loose space-y-4">
            <AIGeneratedImage prompt="anime campfire at night ancient ruins frieren style" alt="余烬营地" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
            <p>你在古道旁找到了一处篝火遗迹。灰烬里还有余温——不是物理上的温度。是某种更深层的余热。上一个在这里生火的人，在火堆旁讲过一个故事。故事的温度比木炭的温度更持久。</p>
            <VoiceBlock type="ember">火能记住以前在同一个位置燃烧过的所有火焰。这不是迷信——在一个共识塑形现实的世界里，这就是物理法则。如果一个地方被反复用来生火，那个地方的“可燃性”本身就会增强。</VoiceBlock>
            
            {hasBard && (
              <>
                <p>卡尔坐在火堆旁，把琴放在膝上。五根弦在火光下闪烁。</p>
                <p>“我想给你弹一首曲子。”他说。“但要先说明——在这个世界里，音乐不只是声音。被唱出来的东西有可能变成真的。”</p>
                <p>他弹了。他的左手偶尔会悬停在一个没有弦的位置上，指尖在空气中颤动。</p>
                <VoiceBlock type="song">他在弹七根弦的曲子。多出来的两个音符是无声的——但不是不存在的。它们是“被删除的音符”。世界听不到它们，但旋律的结构记得它们应该在那里。这就是卡尔能做到的事——用不存在的音符演奏被遗忘的歌。</VoiceBlock>
                <p>旋律结束时，火焰变了颜色。从橙色变成了一种更古老的金色——像是火在回忆自己几百年前的样子。</p>
              </>
            )}
            
            {hasScholar && (
              <>
                <p>伊斋拉盘腿坐在火堆边，用手指在地上画法阵。线条在泥土上发出微弱的蓝光——不是在施法，只是习惯。</p>
                <p>“我一直在想一件事。”她说。“如果世界化身能删除一个人的存在——删除得如此彻底，以至于连寻找他的动机都会被一并删除——那它为什么留下了痕迹？”</p>
                <VoiceBlock type="rune">她说到点上了。一个全能的删除系统不应该有遗漏。除非——遗漏是故意的。也许世界化身自己也不确定删除第八个参与者是不是正确的决定。所以它留下了线索。像是一个写作者在删掉一个角色后，在手稿的空白处写了一个问号。</VoiceBlock>
              </>
            )}
            
            {!hasBard && !hasScholar && (
              <>
                <p>你独自坐在火堆旁。没有同伴意味着你有更多的时间思考。</p>
                <VoiceBlock type="ember">独处的好处：你能更清楚地听到自己。独处的坏处：你能更清楚地听到自己。</VoiceBlock>
              </>
            )}
            
            <p>天空那道裂纹在黑暗中发出极其微弱的白光。远方，裂纹的光微微跳动了一下，像是有什么东西在裂纹的另一侧移动。</p>
          </div>
          <div className="my-4 p-3 rounded-md border border-ember-dark bg-ember/10 text-ember text-xs">
            休息恢复了部分生命。信仰 +5。
          </div>
        </>
      );
    },
    choices: [
      { text: '闭上眼睛，潜入余烬中的记忆（进入编年史）', to: 'chronicle_1_origin', tag: '记忆潜行', cls: 'lo' },
      { text: '睁开眼睛，踏入渐隐的边境', to: 'border_town', tag: '第一章', cls: 'ex' }
    ]
  },
  chronicle_1_origin: {
    render: () => (
      <>
        <ChapterHeader label="编年史 · 远古" title="窃 火 者 与 契 约" />
        <Narrator>历史的最深处，并非牺牲，而是一场交易。分火之灾的真相，被掩埋在三千块石板之下。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime ancient stone tablets glowing runes frieren style" alt="窃火者石板" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>你触碰了营地的余烬，意识坠入了一条倒流的时光之河。你看到了远古的高魔纪元。</p>
          <p>原初人与“世界本身”达成了一笔交易：原初人放弃统一的形态，分裂成人类、魔族等较弱的种族，以此换取世界的稳定。这就是真正的“分火之灾”。而那条古老的第三誓言，原本是：“永不揭示分火之前的真相”。</p>
          <p>画面一转，你看到一个名叫塞拉斯的人类铁匠学徒。他用了四十年时间，将魔族直觉感知的法则转化为人类可用的公式，刻在三千块石板上。人类称之为“启明之日”，魔族称之为“盗火之日”。</p>
          <VoiceBlock type="rift">但传唱遗漏了一个致命的细节：塞拉斯的妻子，那个陪伴了他六十年的女人，是一个隐藏身份的魔族。这从来不是纯粹的人类成就，而是两个分裂种族之间隐秘的合作。</VoiceBlock>
        </div>
      </>
    ),
    choices: [
      { text: "顺着时间流淌，看向下一个时代", to: "chronicle_2_association", tag: "继续潜行", cls: "lo" }
    ]
  },
  chronicle_2_association: {
    render: () => (
      <>
        <ChapterHeader label="编年史 · 近古" title="协 会 与 沉 默" />
        <Narrator>权力的集中总是伴随着知识的垄断。当魔法成为贵族的特权，传唱便成了危险的武器。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime grand magic academy ruins frieren style" alt="魔法协会" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>启明之日后八十年，第一魔法协会在王都奥尔维亚建立。起初他们普及魔法，但后来发现高阶魔法需要城市中密集人口的“共识感应力”。于是，乡村被放弃，魔法贵族诞生。</p>
          <p>随后，北方七座城市爆发了长达三十年的“七城吟唱战争”。没有刀剑，只有诗人。他们用不同的建城传说互相覆盖。最终，两座城市因为传说被完全覆盖而失去了历史，居民一夜之间变成了“没有来历的人”。</p>
          <VoiceBlock type="song">为了阻止这种现实的崩塌，联合王国颁布了长达五十年的“静默令”。禁止一切未经审查的传唱。这五十年里，没有新传说诞生，旧传说逐渐衰减。大量边境村庄因为失去传唱的维护，从现实中永远地淡化了。</VoiceBlock>
        </div>
      </>
    ),
    choices: [
      { text: "见证那些被传说反噬的人", to: "chronicle_3_legends", tag: "继续潜行", cls: "lo" }
    ]
  },
  chronicle_3_legends: {
    render: () => (
      <>
        <ChapterHeader label="编年史 · 传说" title="歌 者 与 狂 人" />
        <Narrator>在这个世界，被相信的就会成真。但如果人们相信的是相互矛盾的东西呢？</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime heroic female warrior shattering into light frieren style" alt="反向传说" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>你看到了三百年前的铸歌者米兰达。她用七天七夜的歌声让摇摇欲坠的城墙变得坚不可摧。但第八天的歌词被删除了——因为那段歌词暗示城外的魔物也值得被保护。</p>
          <p>你又看到了英雄卡桑德拉。一百五十年前最强大的战士。但各地的传唱者给她添加了互相矛盾的设定：用剑或用枪，金发或黑发。最终，她的身体无法承受多个版本的叠加，在集市上当众碎裂成了光点。她被自己的传说杀死了。</p>
          <VoiceBlock type="ember">在西部山脉深处，矮人们为了保护真实的历史，将所有事件铸成铭文，然后全城进入了集体沉睡。他们用生命维持着这个活的档案馆，等待着外面的人忘记一切的那一天。</VoiceBlock>
        </div>
      </>
    ),
    choices: [
      { text: "凝视正在发生的崩毁", to: "chronicle_4_fading", tag: "继续潜行", cls: "lo" }
    ]
  },
  chronicle_4_fading: {
    render: () => (
      <>
        <ChapterHeader label="编年史 · 近代" title="灰 港 与 渐 隐" />
        <Narrator>遗忘不是瞬间的，它像是一种缓慢的疾病，从边缘向中心蚕食。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime fading port city white void frieren style" alt="消失的灰港" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>七十年前，拥有两万人口的贸易中立城市“灰港”在一夜之间被所有人遗忘。地图上变成了一片空白海湾，账本上的名字化为乌有。在那一天，天空中出现了一道极其细微的白色裂纹。</p>
          <p>与此同时，寿命极长的精灵们正在变淡。他们不屑于传唱，只靠个人记忆保存历史。但在后末法时代，个人记忆的力量衰减，没有传唱的精灵们正在从共识现实中“淡出”，变得半透明。</p>
          <VoiceBlock type="rune">魔族则在进行“法域战争”。他们不争夺土地，而是争夺物理法则的解释权。胜利者的法则会覆盖失败者的领土。而人类与魔族的混血儿“半血者”，则被双方同时排斥，流落在边境。</VoiceBlock>
        </div>
      </>
    ),
    choices: [
      { text: "直面当下的危机", to: "chronicle_5_current", tag: "继续潜行", cls: "lo" }
    ]
  },
  chronicle_5_current: {
    render: () => (
      <>
        <ChapterHeader label="编年史 · 当代" title="天 裂 与 假 先 知" />
        <Narrator>当两个版本的世界不再重叠，现实的撕裂便到达了临界点。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime sky rift white crack stars falling frieren style" alt="天裂" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>天空中的那道裂纹正在加速扩大。那不是天空破了，而是两层不同版本的现实发生了重叠。翻译者公会发现，人类和魔族历史记录的重叠率，已经从百分之六十降到了不到百分之三十。</p>
          <p>边境出现了“新语者”组织，他们发起假先知运动，创造完全虚构的传说来覆盖旧现实。这是一种可怕的“叙事武器”。</p>
          <p>而像锻炉村这样由古老结界保护的地方，结界正在衰退。也许是因为集体记忆的流失，也许是因为设下结界的守炉者正在被遗忘。</p>
          <VoiceBlock type="rift">翻译者公会的一名研究员发现，平均每十七年，世界化身就会进行一次大规模的“现实编辑”，悄悄修改历史以维持稳定。而你听到的那个全知视角的旁白，或许正是世界化身的“内心独白”。</VoiceBlock>
        </div>
      </>
    ),
    choices: [
      { text: "寻找最后的希望", to: "chronicle_6_truth", tag: "继续潜行", cls: "lo" }
    ]
  },
  chronicle_6_truth: {
    render: () => (
      <>
        <ChapterHeader label="编年史 · 终局" title="余 烬 之 火" />
        <Narrator>古老辉煌已经远去，但它的余烬还在。还在燃烧。还在等待。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime solitary eternal flame darkness frieren style" alt="余烬之火" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>你从漫长的记忆潜行中苏醒。营地的篝火已经熄灭，但你脑海中多出了无数个时代的重量。</p>
          <p>你知道了末代唱诗人正守着七首消失的歌不敢唱出；知道了叛逃的魔族法阵师带着第八人的秘密流亡；知道了记忆收割者在黑市上贩卖着现实的基石；也知道了双面间谍试图用情报统一两族的共识来拯救世界。</p>
          <p>在大陆的某个隐秘位置，还燃烧着一团“原初之火”。它不消耗燃料，只依赖“关于火的最古老的记忆”。只要还有一个人记得，它就不会灭。</p>
          <VoiceBlock type="ember">你就是那个记得的人。在这个名字具有物理重量、梦境可以触碰现实底层的世界里，你的旅程才刚刚开始。</VoiceBlock>
        </div>
      </>
    ),
    choices: [
      { text: "睁开眼睛，踏入渐隐的边境", to: "border_town", tag: "第一章", cls: "ex" }
    ]
  },
  border_town: {
    render: (s) => (
      <>
        <ChapterHeader label="第 四 章" title="渐 隐 的 边 境" />
        <Narrator>大遗忘不是一个瞬间事件——它是一个正在持续的过程。从七十年前灰港消失开始，边境的村庄正在一个个从共识中被抹去。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime fading border town mist sky rift frieren style" alt="边境小镇" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>你来到了一个没有名字的边境小镇。这里的建筑风格混杂，天空中的那道白色的裂纹在这里清晰可见——那是两层不同版本的现实发生重叠的地方。</p>
          <p>镇上的人们行色匆匆。在这个世界里，存在的三个层次是：物理存在、认知存在、记录存在。当一个地方失去传唱，它就会变成“幽影”，最终彻底死亡。</p>
          <VoiceBlock type="ember">为了不被遗忘，这里的人们在门框上刻下名字，商人疯狂地在账本上签名。追逐曝光，就是求生。</VoiceBlock>
          <p>你在小镇中看到了几个奇特的地方：</p>
        </div>
      </>
    ),
    choices: [
      { text: '进入地下酒馆（寻找记忆酿酒师）', to: 'tavern_brewer', tag: '探索', cls: 'lo' },
      { text: '靠近暗巷里的斗篷人（叛逃的魔族法阵师）', to: 'alley_demon', tag: '探索', cls: 'lo' },
      { text: '前往废弃谷仓（启蒙灯组织的地下学堂）', to: 'barn_teacher', tag: '探索', cls: 'lo' },
      { text: '在广场上聆听说书人（人工英雄与叙事规划局）', to: 'square_storyteller', tag: '探索', cls: 'lo' },
      { text: '离开小镇，继续踏上古道', to: 'town_exit', tag: '主线', cls: 'ex' }
    ]
  },
  tavern_brewer: {
    render: (s) => (
      <>
        <ChapterHeader label="边 境 小 镇" title="记 忆 酿 酒 师" />
        <Narrator>记忆是一种可以被物质承载的东西。失去一段记忆，意味着那段记忆曾经确认过的现实也跟着动摇。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime old bartender glowing bottles memory wine frieren style" alt="记忆酿酒师" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>地下酒馆里弥漫着奇异的香气。吧台后站着一位老酿酒师，身后的酒窖里存放着上千坛发光的“记忆酒”。</p>
          <p>“喝下它，你就能完整地‘活一遍’别人的记忆。”老人擦拭着酒杯，“但规矩是：你要存一段自己的记忆，才能取走一段别人的。酒窖的总量永远不变。”</p>
          <p>你看到角落里有几个穷人正在出售自己的童年记忆换取面包。他们不知道，卖掉记忆会让他们的故乡存在感减弱，加速大遗忘的侵蚀。</p>
          <VoiceBlock type="song">最深处的那坛酒，据说酿于分火之灾之前。喝下它，能以原初人的视角体验高魔纪元。</VoiceBlock>
        </div>
      </>
    ),
    choices: [
      { 
        text: '用一段记忆交换高魔纪元的体验（失去 5 HP，获得 15 学识）', 
        to: 'border_town', 
        tag: '交易', 
        cls: 'lo',
        req: (s) => !s.seen['drank_memory'],
        fx: (s) => { s.hp -= 5; s.lore += 15; s.seen['drank_memory'] = true; s.cards.push('原初的记忆'); }
      },
      { text: '拒绝交易，返回小镇', to: 'border_town', tag: '返回', cls: 'ex' }
    ]
  },
  alley_demon: {
    render: (s) => (
      <>
        <ChapterHeader label="边 境 小 镇" title="叛 逃 的 法 阵 师" />
        <Narrator>魔族的血脉中编码着祖先的法阵记忆。他们的身体本身就是一座图书馆。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime demon girl glowing runes dark alley frieren style" alt="叛逃魔族" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>暗巷里，一个年轻的魔族女性正痛苦地捂着头，手臂上的法纹闪烁不定。她是一名叛逃的法阵师。</p>
          <p>“我在研究古代法阵时，发现了分火之灾中‘第五位参与者’（人类传唱中的第八人）的法力签名。家族长老恐惧这个真相，下令抹除我的记忆。”她喘息着说，“我带着残缺的记忆逃了出来。”</p>
          <p>她向你揭示了魔族的残酷现实：每一次生育都会分裂知识库，导致法力损耗。停止研究的家族会退化成“空血”。而魔族之间通过“法域战争”争夺物理法则的解释权，导致现实被撕裂。</p>
          <VoiceBlock type="rune">她的法纹正在崩溃。如果你愿意用你的“共识感应力”帮她稳定法纹，她或许能成为你的同行者。</VoiceBlock>
        </div>
      </>
    ),
    choices: [
      { 
        text: '协助稳定法纹（需要学识 > 10，获得同行者）', 
        to: 'border_town', 
        tag: '招募', 
        cls: 'hu',
        req: (s) => s.lore > 10 && !s.companions.includes('叛逃法阵师 · 莉亚'),
        fx: (s) => { s.companions.push('叛逃法阵师 · 莉亚'); s.faction = 'demon'; }
      },
      { text: '默默离开', to: 'border_town', tag: '返回', cls: 'ex' }
    ]
  },
  barn_teacher: {
    render: (s) => (
      <>
        <ChapterHeader label="边 境 小 镇" title="启 蒙 灯 与 锁 字 法" />
        <Narrator>一个识字的人可以读取记录存在。一个会写字的人可以创造记录存在。写字等于施法。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime old woman teaching children writing sand barn frieren style" alt="启蒙灯" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>废弃谷仓里，一个叫赫达的独眼老妇人正在教几个衣衫褴褛的孩子在沙地上写字。她是地下组织“启蒙灯”的创始人。</p>
          <p>“联合王国颁布了‘锁字之法’，将文字教育分为识字权、书写权和定史权。百分之七十的人是文盲，只能靠‘说书人行会’获取被审查过的信息。”赫达冷冷地说，“控制文字的人控制了历史，控制历史的人控制了现实。”</p>
          <p>她还告诉你，魔法协会发明的“魔力瓶”让普通人无需理解原理就能使用魔法，导致了严重的“魔法断代”。现在能制造魔力瓶的工匠不到三百人，魔法正在退步。</p>
          <VoiceBlock type="rift">教人识字是在释放一种不可控的力量。更多的人能写字意味着更多互相矛盾的记录，可能会加速大遗忘。但赫达认为，一个知道真相后崩溃的世界，也比靠谎言维持的世界更值得活。</VoiceBlock>
        </div>
      </>
    ),
    choices: [
      { 
        text: '捐赠物资支持学堂（失去 10 可靠性，获得 15 信仰）', 
        to: 'border_town', 
        tag: '援助', 
        cls: 'hu',
        req: (s) => !s.seen['helped_hedda'],
        fx: (s) => { s.rel -= 10; s.faith += 15; s.seen['helped_hedda'] = true; s.faction = 'human'; }
      },
      { text: '离开谷仓', to: 'border_town', tag: '返回', cls: 'ex' }
    ]
  },
  square_storyteller: {
    render: (s) => (
      <>
        <ChapterHeader label="边 境 小 镇" title="被 制 造 的 英 雄" />
        <Narrator>在这个世界里，“真实”和“被相信”之间的区别并不重要。一个被百万人相信的虚构英雄，比一个只有三个人记得的真实英雄更有力量。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime storyteller town square crowd illusion hero frieren style" alt="说书人" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>广场上，一个说书人正在慷慨激昂地讲述“永在者伊萨克”和“英雄卡桑德拉”的故事。人群听得如痴如醉，随着他们的情绪起伏，广场中央的无面雕像似乎变得清晰了一些。</p>
          <p>但你听出了破绽。卡桑德拉的故事中充满了矛盾：一会儿用剑，一会儿用枪。传说她最终因为承受不了多个版本的叠加，被自己的传说撕碎了。</p>
          <VoiceBlock type="ember">“叙事规划局”在过去两百年里人工制造了三十多个英雄。他们预先设计好一切，然后通过传唱网络统一投放。这些从未存在过的人，因为被广泛相信，获得了极其稳固的“认知存在”。</VoiceBlock>
          <p>甚至连“勇者”和“魔王”，也不过是世界底层“叙事引力井”自动填充的角色位置，用来维持两个种族的对立与制衡。</p>
        </div>
      </>
    ),
    choices: [
      { 
        text: '当众指出故事的矛盾（信仰 -10，学识 +10）', 
        to: 'border_town', 
        tag: '揭露', 
        cls: 'lo',
        req: (s) => !s.seen['debunked_story'],
        fx: (s) => { s.faith -= 10; s.lore += 10; s.seen['debunked_story'] = true; }
      },
      { text: '默默倾听，感受共识的力量', to: 'border_town', tag: '返回', cls: 'ex' }
    ]
  },
  town_exit: {
    render: (s) => (
      <>
        <ChapterHeader label="第 四 章" title="离 开 小 镇" />
        <Narrator>每一段旅程都有一个必须跨越的门槛。对于你来说，这个门槛不是一堵墙，而是一个选择。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime town gate twilight path fading frieren style" alt="小镇出口" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>你来到了小镇的出口。前方的古道被一层奇异的光幕阻挡。光幕上流转着无数的文字和符号，像是一面由纯粹的信息构成的墙。</p>
          <VoiceBlock type="ember">这是“共识之墙”。它不是用来阻挡物理实体的，而是用来阻挡那些“不被相信”的东西。如果你没有足够的“存在感”，穿过这道墙的瞬间，你就会被世界彻底遗忘。</VoiceBlock>
          {s.companions.length > 0 && (
            <p>你的同伴们停下了脚步。他们看着你，等待着你的决定。</p>
          )}
          <p>突然，光幕中浮现出一个巨大的、模糊的面孔。它没有五官，只有无数张嘴在同时开合，发出震耳欲聋的低语。</p>
          <VoiceBlock type="rift">“你……是谁？你……不属于任何一个故事。你……是一个错误。”</VoiceBlock>
          <p>面孔伸出一只由光芒组成的手，向你抓来。它试图将你从这个世界上抹除！</p>
        </div>
      </>
    ),
    choices: [
      { text: '直面光幕，用你的记忆对抗遗忘', to: 'final_combat', tag: '决战', cls: 'ex' }
    ]
  },
  final_combat: {
    render: () => (
      <>
        <ChapterHeader label="终 章" title="共 识 之 战" />
        <Narrator>这不是一场肉体的搏杀，而是一场关于“存在”的辩论。你必须证明，即使没有被传唱，即使没有被记录，你的存在依然有其价值。</Narrator>
      </>
    )
  },
  post_final_combat: {
    onEnter: (s) => { 
      s.cards.push('存在的证明'); 
      s.faith += 20; 
    },
    render: () => (
      <>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime shattering light barrier frieren style" alt="突破光幕" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>光幕碎裂了。无数的文字和符号化作光雨洒落。那个巨大的面孔发出一声不甘的叹息，消散在空气中。</p>
          <VoiceBlock type="song">你赢了。你用你收集到的记忆、你结识的同伴、你经历的故事，证明了你在这个世界上的重量。共识之墙承认了你的存在。</VoiceBlock>
          <p>前方的道路重新变得清晰。天空中的那道白色裂纹似乎也停止了扩张。</p>
        </div>
        <div className="my-4 p-3 rounded-md border border-ember-dark bg-ember/10 text-ember text-xs">
          获得卡牌：存在的证明。
        </div>
      </>
    ),
    choices: [
      { text: '踏上最后的旅程', to: 'ending', tag: '结局', cls: 'ex' }
    ]
  },
  ending: {
    render: (s) => {
      const fLabel = s.faction === 'human' ? '人类侧（共识与传唱）' :
        s.faction === 'demon' ? '魔族侧（法则与法阵）' : '中立（世界化身）';
        
      return (
        <>
          <ChapterHeader label="终 章" title="世 界 的 衰 老" />
          <Narrator>大遗忘不是敌人的攻击，而是世界本身在衰老。制衡系统已经失效，叙事纤维正在断裂。</Narrator>
          <div className="text-[14.5px] leading-loose space-y-4">
            <AIGeneratedImage prompt="anime world tree fading shattering sky frieren style" alt="Ending" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
            <p>你站在边境的尽头，仰望天空中那道不断扩大的白色裂纹。你现在明白了，那不是天空破了，而是两层不同版本的现实发生了重叠。</p>
            <p>人类用传唱维持共识，魔族用法阵维护法则。但三百年来，两者的分离导致了世界的内耗。世界化身陷入了两难的瘫痪，只能眼睁睁看着一切走向终结。</p>
            <p>而你，作为一个从古道上醒来的失忆者，手心带着半个锚定符文。你是系统析出的“修复用个体”——制衡系统的缝合针。</p>
            <VoiceBlock type="song">你面临着最终的抉择：是“维持”这个充满谎言但安全的残缺世界？是“融合”两族力量，迎接剧烈震荡的新生？还是“放手”，让世界自然走向它的结局？</VoiceBlock>
            
            <div className="mt-8 p-4 bg-bg-card border border-ember/20 rounded-lg">
              <h3 className="font-bold text-ember mb-2 tracking-widest text-sm">当前状态结算</h3>
              <ul className="space-y-1 text-xs text-tx-muted">
                <li>生命体征: {s.hp}/{s.maxHp}</li>
                <li>信仰深度 (共识): {s.faith}</li>
                <li>学识深度 (法则): {s.lore}</li>
                <li>世界倾向: <span className="text-tx-main font-bold">{fLabel}</span></li>
                <li>收集卡牌: {s.cards.join(', ') || '无'}</li>
                <li>同行者: {s.companions.join(', ') || '孤身一人'}</li>
              </ul>
            </div>
          </div>
        </>
      );
    },
    choices: [
      { text: '重新开始旅程', to: 'title', tag: '轮回', cls: 'ex' }
    ]
  },
  hidden_cove: {
    onEnter: (s) => { s.lore += 15; s.rel -= 10; },
    render: (s, ex) => (
      <>
        <ChapterHeader label="隐 藏" title="深 渊 浅 滩" />
        <Narrator>有些路是不该被走上的。但既然你听到了呼唤，就意味着你已经被选中。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <AIGeneratedImage prompt="anime dark hidden cove abyss glowing water frieren style" alt="深渊浅滩" className="w-full h-48 object-cover rounded-lg border border-ember/30 mb-4 shadow-md" />
          <p>你顺着海螺的指引，找到了一条隐蔽的下崖小路。悬崖底部的浅滩上，海水是黑色的。</p>
          <p>水面上漂浮着无数发光的微小生物，它们组成了一个巨大的、缓缓旋转的螺旋图案。</p>
          <VoiceBlock type="rift">这不是生物。这是破碎的灵魂碎片。它们在这里聚集，试图重新拼凑出那个被遗忘的神明。</VoiceBlock>
          <p>你在浅滩上发现了一把<ExamineWord id="abyss_blade" onExamine={ex}>漆黑的短剑</ExamineWord>。</p>
        </div>
      </>
    ),
    choices: [
      { text: '带着短剑返回古道岔路口', to: 'coastal_road_return', tag: '返回', cls: 'ex' }
    ]
  },
  coastal_road_return: {
    render: (s, ex) => (
      <>
        <ChapterHeader label="序 章" title="海 岸 古 道" />
        <Narrator>你回到了岔路口。风依旧在吹，但你已经不再是刚才的你了。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <p>你站在三条岔路前。向北的十字，向东的螺旋，向西的圆。</p>
        </div>
      </>
    ),
    choices: [
      { text: '向北——十字的方向。', to: 'chapel', tag: '人类侧', cls: 'hu' },
      { text: '向东——螺旋的方向。', to: 'cavern', tag: '魔族侧', cls: 'de' },
      { text: '向西——圆的方向。', to: 'lighthouse', tag: '中立', cls: 'lo' }
    ]
  },
  bard_ring_lore: {
    onEnter: (s) => { s.lore += 10; s.rel += 5; },
    render: (s, ex) => (
      <>
        <ChapterHeader label="第 一 章" title="守护者的誓言" />
        <Narrator>有些誓言比生命更长久。即使发誓的人已经化为尘土，誓言依然在寻找能够承载它的容器。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <p>卡尔轻轻抚摸着那枚生锈的铁戒指，眼神变得深邃。</p>
          <p>“这是第一代圣堂骑士团团长的信物。他们发誓要守护这片土地，直到最后一滴血流尽。但后来……他们被背叛了。被他们发誓要保护的人背叛。”</p>
          <VoiceBlock type="song">“背叛的火焰烧毁了圣堂，也烧毁了他们的信仰。但团长在临死前，将这枚戒指藏在了祭坛下。他相信，总有一天，会有人重新拾起这份誓言。”</VoiceBlock>
          <p>卡尔抬起头，看着你。“既然戒指选择了你，也许你就是那个被选中的人。这不仅是一份荣誉，更是一个沉重的诅咒。”</p>
        </div>
      </>
    ),
    choices: [
      { text: '“我会承担起这份责任。”（获得骑士的传承）', to: 'road_anomaly', tag: '接受', cls: 'hu', fx: (s) => { s.cards.push('骑士之誓'); s.faith += 15; } },
      { text: '“我只是碰巧找到了它。”', to: 'road_anomaly', tag: '拒绝', cls: 'ex' }
    ]
  },
  scholar_potion: {
    onEnter: (s) => { s.lore += 15; s.rel += 10; },
    render: (s, ex) => (
      <>
        <ChapterHeader label="第 一 章" title="危险的实验" />
        <Narrator>有时候，最伟大的发现往往伴随着最疯狂的冒险。但代价是什么？</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <p>莉亚一把夺过药剂，将其倒入法阵的中心。刺眼的紫光瞬间照亮了整个洞窟。</p>
          <VoiceBlock type="rune">法阵稳定下来了。逆向解析成功。你看到了结晶中隐藏的真正秘密——一段关于世界本源的古老代码。</VoiceBlock>
          <p>“成功了！”莉亚兴奋地大叫，“我终于解开了这个谜题！谢谢你，陌生人。作为回报，我教你一个法术。”</p>
        </div>
      </>
    ),
    choices: [
      { text: '学习法术（获得“结晶爆破”）', to: 'road_anomaly', tag: '学习', cls: 'de', fx: (s) => { s.cards.push('结晶爆破'); s.lore += 20; } }
    ]
  },
  lighthouse_mask: {
    onEnter: (s) => { s.lore += 20; s.rel -= 15; },
    render: (s, ex) => (
      <>
        <ChapterHeader label="第 一 章" title="面具之下" />
        <Narrator>有些真相最好永远埋葬在时间里。因为一旦你看到了它，它也会看到你。</Narrator>
        <div className="text-[14.5px] leading-loose space-y-4">
          <p>你强忍着剧痛，再次靠近透镜，试图看清那个面具人的脸。</p>
          <VoiceBlock type="rift">面具渐渐变得透明。你看到了那张脸。那是一张你非常熟悉的脸。那是……你自己的脸。</VoiceBlock>
          <p>幻象瞬间破碎。透镜发出清脆的碎裂声，彻底暗淡下来。你瘫倒在地，脑海中回荡着一个声音：“你终于想起来了。”</p>
        </div>
      </>
    ),
    choices: [
      { text: '带着沉重的真相离开（获得“时空悖论”）', to: 'road_anomaly', tag: '离开', cls: 'lo', fx: (s) => { s.cards.push('时空悖论'); s.lore += 30; } }
    ]
  }
};
