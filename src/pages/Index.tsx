import { useState } from "react";
import Icon from "@/components/ui/icon";

type Screen = "home" | "character" | "diary" | "leaderboard" | "shop" | "achievements";

const PLAYER = {
  name: "Странник",
  level: 14,
  class: "Воин теней",
  exp: 3200,
  expMax: 5000,
  hp: 840,
  hpMax: 1000,
  mana: 320,
  manaMax: 400,
  gold: 1250,
  coins: 8340,
  crystals: 47,
  rank: 47,
  stats: {
    strength: 72,
    agility: 58,
    intellect: 41,
    endurance: 65,
    luck: 33,
  },
  equipped: {
    weapon: "Клинок рассвета",
    armor: "Кольчуга теней",
    amulet: "Медальон ветра",
  },
};

const QUESTS = [
  { id: 1, title: "Логово кобольдов", desc: "Зачистить пещеры к северу от деревни", progress: 6, total: 10, xp: 500, gold: 120, active: true, type: "combat" },
  { id: 2, title: "Торговец в беде", desc: "Сопроводить купца до форта Эйлон", progress: 1, total: 1, xp: 300, gold: 80, active: true, type: "story" },
  { id: 3, title: "Сбор трав", desc: "Найти 5 лунных цветков на болоте", progress: 2, total: 5, xp: 200, gold: 50, active: true, type: "gather" },
  { id: 4, title: "Тайна руин", desc: "Исследовать древние руины Эшара", progress: 0, total: 3, xp: 800, gold: 200, active: false, type: "explore" },
];

const DIARY = [
  { id: 1, date: "День 47", text: "Добрался до форта Стоунхэвен. Местные говорят о тварях в подземельях. Завтра выдвигаюсь на разведку.", tag: "ПУТЕШЕСТВИЕ" },
  { id: 2, date: "День 44", text: "Победил Стражника Костяного Хребта. Дроп был неплох — взял кольчугу теней. Уровень вырос до 14.", tag: "БОЙ" },
  { id: 3, date: "День 40", text: "Встретил загадочного эльфа у перекрёстка. Он дал наводку на руины Эшара. Надо проверить.", tag: "СОБЫТИЕ" },
  { id: 4, date: "День 35", text: "Освоил новый приём — 'Теневой рывок'. Теперь уклонение работает в два раза лучше.", tag: "НАВЫК" },
];

type LeaderboardEntry = {
  rank: number; name: string; level: number; class: string;
  score: number; online: boolean; divider?: boolean; isMe?: boolean;
};

const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Громовержец", level: 99, class: "Паладин", score: 148200, online: true },
  { rank: 2, name: "Морозная", level: 87, class: "Маг", score: 132400, online: false },
  { rank: 3, name: "Теньвоин", level: 82, class: "Ассасин", score: 119800, online: true },
  { rank: 4, name: "Дикий Волк", level: 78, class: "Рейнджер", score: 98300, online: true },
  { rank: 5, name: "Кровавый_Рот", level: 71, class: "Берсеркер", score: 87100, online: false },
  { rank: 46, name: "...", level: 0, class: "", score: 0, online: false, divider: true },
  { rank: 47, name: "Странник", level: 14, class: "Воин теней", score: 18200, online: true, isMe: true },
  { rank: 48, name: "Иградец", level: 13, class: "Лучник", score: 17800, online: false },
];

const SHOP_ITEMS = [
  { id: 1, name: "Меч берсерка", type: "weapon", rarity: "epic", price: 850, bonus: "+45 силы", owned: false },
  { id: 2, name: "Зелье здоровья", type: "consumable", rarity: "common", price: 50, bonus: "+200 HP", owned: false },
  { id: 3, name: "Плащ ночи", type: "armor", rarity: "rare", price: 420, bonus: "+30 ловкости", owned: false },
  { id: 4, name: "Свиток телепорта", type: "consumable", rarity: "uncommon", price: 120, bonus: "Быстрое перемещение", owned: false },
  { id: 5, name: "Кольцо силы", type: "accessory", rarity: "rare", price: 380, bonus: "+20 силы, +10 выносл.", owned: true },
  { id: 6, name: "Кристалл маны", type: "consumable", rarity: "common", price: 35, bonus: "+150 маны", owned: false },
];

const ACHIEVEMENTS = [
  { id: 1, title: "Первая кровь", desc: "Победить первого врага", icon: "Sword", unlocked: true, date: "День 1", points: 10 },
  { id: 2, title: "Исследователь", desc: "Посетить 10 локаций", icon: "Map", unlocked: true, date: "День 22", points: 25 },
  { id: 3, title: "Торговец", desc: "Совершить 20 покупок", icon: "ShoppingBag", unlocked: true, date: "День 31", points: 20 },
  { id: 4, title: "Легенда подземелья", desc: "Пройти 5 данжей подряд", icon: "Flame", unlocked: false, date: "", points: 50 },
  { id: 5, title: "Мастер квестов", desc: "Выполнить 50 заданий", icon: "CheckSquare", unlocked: false, date: "", points: 75 },
  { id: 6, title: "Непобедимый", desc: "10 боёв без потери HP", icon: "Shield", unlocked: false, date: "", points: 100 },
  { id: 7, title: "Богач", desc: "Накопить 10 000 золота", icon: "Coins", unlocked: false, date: "", points: 40 },
  { id: 8, title: "Ветеран", desc: "Достичь 50 уровня", icon: "Star", unlocked: false, date: "", points: 200 },
];

const RARITY_COLOR: Record<string, string> = {
  common: "text-[hsl(0,0%,65%)]",
  uncommon: "text-[hsl(145,70%,45%)]",
  rare: "text-[hsl(195,100%,50%)]",
  epic: "text-[hsl(270,80%,70%)]",
  legendary: "text-[hsl(45,100%,60%)]",
};

const RARITY_BORDER: Record<string, string> = {
  common: "border-[hsl(0,0%,25%)]",
  uncommon: "border-[hsl(145,70%,30%)]",
  rare: "border-[hsl(195,100%,30%)]",
  epic: "border-[hsl(270,80%,40%)]",
  legendary: "border-[hsl(45,100%,40%)]",
};

const QUEST_TYPE_COLOR: Record<string, string> = {
  combat: "text-[hsl(0,85%,65%)]",
  story: "text-[hsl(195,100%,50%)]",
  gather: "text-[hsl(145,70%,45%)]",
  explore: "text-[hsl(270,80%,70%)]",
};

function StatBar({ label, value, max = 100, color = "gold" }: { label: string; value: number; max?: number; color?: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{label}</span>
        <span className="text-xs font-mono text-foreground">{value}</span>
      </div>
      <div className="bg-[hsl(0,0%,12%)] h-1.5 relative overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            color === "cyan"
              ? "bg-gradient-to-r from-[hsl(195,100%,50%)] to-[hsl(195,100%,70%)]"
              : color === "green"
              ? "bg-gradient-to-r from-[hsl(145,70%,45%)] to-[hsl(145,70%,65%)]"
              : "bg-gradient-to-r from-[hsl(45,100%,60%)] to-[hsl(45,100%,75%)]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function HomeScreen() {
  const expPct = Math.round((PLAYER.exp / PLAYER.expMax) * 100);
  const hpPct = Math.round((PLAYER.hp / PLAYER.hpMax) * 100);
  const manaPct = Math.round((PLAYER.mana / PLAYER.manaMax) * 100);

  return (
    <div className="animate-slide-up space-y-4">
      <div className="bg-[hsl(0,0%,9%)] border border-[hsl(0,0%,16%)] p-5 relative overflow-hidden"
        style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(45,100%,60%) 0%, transparent 70%)" }} />
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 bg-[hsl(0,0%,12%)] border border-[hsl(45,100%,40%,0.4)] flex items-center justify-center text-2xl"
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
              ⚔️
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[hsl(45,100%,60%)] text-[hsl(0,0%,6%)] text-[10px] font-bold px-1.5 py-0.5 font-display"
              style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}>
              {PLAYER.level}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 bg-[hsl(45,100%,60%)] rotate-45 flex-shrink-0" />
              <h2 className="font-display text-xl font-bold text-white tracking-wide">{PLAYER.name}</h2>
            </div>
            <p className="text-xs text-[hsl(45,100%,60%)] font-mono uppercase tracking-widest mb-3">{PLAYER.class}</p>
            <div className="space-y-1.5">
              <div>
                <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5 font-mono">
                  <span>HP</span><span>{PLAYER.hp}/{PLAYER.hpMax}</span>
                </div>
                <div className="bg-[hsl(0,0%,12%)] h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[hsl(145,70%,45%)] to-[hsl(145,70%,65%)] transition-all" style={{ width: `${hpPct}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5 font-mono">
                  <span>МАНА</span><span>{PLAYER.mana}/{PLAYER.manaMax}</span>
                </div>
                <div className="bg-[hsl(0,0%,12%)] h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[hsl(195,100%,50%)] to-[hsl(195,100%,70%)] transition-all" style={{ width: `${manaPct}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5 font-mono">
                  <span>ОПЫТ</span><span>{PLAYER.exp}/{PLAYER.expMax}</span>
                </div>
                <div className="bg-[hsl(0,0%,12%)] h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[hsl(45,100%,60%)] to-[hsl(45,100%,75%)] transition-all" style={{ width: `${expPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Рейтинг", value: `#${PLAYER.rank}`, color: "text-[hsl(45,100%,60%)]" },
          { label: "Золото", value: `◆ ${PLAYER.gold}`, color: "text-[hsl(45,100%,60%)]" },
          { label: "Достиж.", value: String(ACHIEVEMENTS.filter(a => a.unlocked).length), color: "text-[hsl(195,100%,50%)]" },
        ].map(s => (
          <div key={s.label} className="bg-[hsl(0,0%,9%)] border border-[hsl(0,0%,16%)] p-3 text-center"
            style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
            <div className={`text-xl font-display font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 font-mono">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-[hsl(195,100%,50%)] rotate-45" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">Активные квесты</h3>
        </div>
        <div className="space-y-2">
          {QUESTS.filter(q => q.active).slice(0, 2).map(q => (
            <div key={q.id} className="bg-[hsl(0,0%,9%)] border border-[hsl(0,0%,16%)] p-3"
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
              <div className="flex justify-between items-start mb-1.5">
                <span className="font-display text-sm font-semibold text-white">{q.title}</span>
                <span className={`text-[10px] uppercase tracking-widest font-mono ${QUEST_TYPE_COLOR[q.type]}`}>{q.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-[hsl(0,0%,12%)] h-1.5 flex-1 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[hsl(45,100%,60%)] to-[hsl(45,100%,75%)]" style={{ width: `${(q.progress / q.total) * 100}%` }} />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{q.progress}/{q.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-[hsl(45,100%,60%,0.15)] bg-[hsl(45,100%,60%,0.04)] p-3"
        style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
        <div className="flex gap-2 items-start">
          <span className="text-[hsl(45,100%,60%)] text-sm mt-0.5">◆</span>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            <span className="text-[hsl(45,100%,60%)] font-semibold">Совет дня:</span>{" "}
            Посети руины Эшара — там скрыт редкий эпический лут.
          </p>
        </div>
      </div>
    </div>
  );
}

type StatKey = "strength" | "agility" | "intellect" | "endurance" | "luck";

const STAT_META: Record<StatKey, { label: string; color: string; emoji: string }> = {
  strength:   { label: "Сила",        color: "gold",  emoji: "⚔️" },
  agility:    { label: "Ловкость",    color: "gold",  emoji: "🏃" },
  intellect:  { label: "Интеллект",   color: "cyan",  emoji: "🔮" },
  endurance:  { label: "Выносливость",color: "green", emoji: "🛡️" },
  luck:       { label: "Удача",       color: "cyan",  emoji: "🍀" },
};

function upgradeCost(value: number) {
  return Math.floor(100 * Math.pow(1.18, value - 40));
}

function CharacterScreen() {
  const [stats, setStats] = useState({ ...PLAYER.stats });
  const [coins, setCoins] = useState(PLAYER.coins);
  const [flash, setFlash] = useState<StatKey | null>(null);
  const [noMoney, setNoMoney] = useState<StatKey | null>(null);

  function upgrade(key: StatKey) {
    const cost = upgradeCost(stats[key]);
    if (coins < cost) {
      setNoMoney(key);
      setTimeout(() => setNoMoney(null), 800);
      return;
    }
    setCoins(c => c - cost);
    setStats(s => ({ ...s, [key]: s[key] + 1 }));
    setFlash(key);
    setTimeout(() => setFlash(null), 600);
  }

  return (
    <div className="animate-slide-up space-y-4">
      <div className="bg-[hsl(0,0%,9%)] border border-[hsl(0,0%,16%)] p-4"
        style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-[hsl(0,0%,12%)] border border-[hsl(45,100%,40%)] flex items-center justify-center text-4xl"
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
            ⚔️
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white tracking-wide">{PLAYER.name}</h2>
            <p className="text-[hsl(45,100%,60%)] text-xs font-mono uppercase tracking-widest">{PLAYER.class}</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="bg-[hsl(45,100%,60%,0.1)] border border-[hsl(45,100%,60%,0.3)] px-3 py-1"
                style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
                <span className="text-[hsl(45,100%,60%)] font-display text-sm font-bold">УР. {PLAYER.level}</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">Ранг #{PLAYER.rank}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🪙</span>
          <span className="font-display text-sm font-bold text-white">{coins.toLocaleString()}</span>
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">монет</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">Цена растёт с каждым уровнем</span>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-[hsl(45,100%,60%)] rotate-45" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">Характеристики</h3>
        </div>
        <div className="bg-[hsl(0,0%,9%)] border border-[hsl(0,0%,16%)] p-4 space-y-4"
          style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
          {(Object.keys(stats) as StatKey[]).map(key => {
            const meta = STAT_META[key];
            const val = stats[key];
            const cost = upgradeCost(val);
            const canAfford = coins >= cost;
            const isFlash = flash === key;
            const isNoMoney = noMoney === key;
            return (
              <div key={key}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm leading-none">{meta.emoji}</span>
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest flex-1">{meta.label}</span>
                  <span className={`font-display text-base font-bold transition-all duration-300 ${isFlash ? "text-[hsl(145,70%,55%)] scale-110" : "text-white"}`}>
                    {val}
                  </span>
                  <button
                    onClick={() => upgrade(key)}
                    className={`flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all duration-150 ${
                      isNoMoney
                        ? "bg-[hsl(0,85%,30%)] border border-[hsl(0,85%,45%)] text-[hsl(0,85%,70%)]"
                        : canAfford
                        ? "bg-[hsl(45,100%,60%)] text-[hsl(0,0%,6%)] hover:bg-[hsl(45,100%,70%)] hover:-translate-y-px active:scale-95"
                        : "bg-[hsl(0,0%,12%)] border border-[hsl(0,0%,20%)] text-muted-foreground cursor-not-allowed"
                    }`}
                    style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}
                  >
                    {isNoMoney ? (
                      <span>Мало!</span>
                    ) : (
                      <>
                        <span>🪙</span>
                        <span>{cost.toLocaleString()}</span>
                        <span className="text-[9px] opacity-70">+1</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-[hsl(0,0%,12%)] h-1.5 overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-500 ${
                      meta.color === "cyan"
                        ? "bg-gradient-to-r from-[hsl(195,100%,50%)] to-[hsl(195,100%,70%)]"
                        : meta.color === "green"
                        ? "bg-gradient-to-r from-[hsl(145,70%,45%)] to-[hsl(145,70%,65%)]"
                        : "bg-gradient-to-r from-[hsl(45,100%,60%)] to-[hsl(45,100%,75%)]"
                    }`}
                    style={{ width: `${Math.min(val, 100)}%` }}
                  />
                  {isFlash && (
                    <div className="absolute inset-0 bg-[hsl(145,70%,55%,0.4)] animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-[hsl(45,100%,60%)] rotate-45" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">Снаряжение</h3>
        </div>
        <div className="space-y-2">
          {Object.entries(PLAYER.equipped).map(([slot, item]) => {
            const icons: Record<string, string> = { weapon: "Sword", armor: "Shield", amulet: "Gem" };
            const labels: Record<string, string> = { weapon: "Оружие", armor: "Броня", amulet: "Амулет" };
            return (
              <div key={slot} className="bg-[hsl(0,0%,9%)] border border-[hsl(0,0%,16%)] p-3 flex items-center gap-3"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
                <div className="w-8 h-8 bg-[hsl(0,0%,12%)] flex items-center justify-center border border-[hsl(0,0%,20%)]"
                  style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}>
                  <Icon name={icons[slot]} fallback="Package" size={14} className="text-[hsl(45,100%,60%)]" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">{labels[slot]}</div>
                  <div className="text-sm font-display font-semibold text-white">{item}</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-[hsl(145,70%,45%)]" style={{ animation: "pulse 3s ease-in-out infinite" }} />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-[hsl(195,100%,50%)] rotate-45" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">Жизненные показатели</h3>
        </div>
        <div className="bg-[hsl(0,0%,9%)] border border-[hsl(0,0%,16%)] p-4 space-y-3"
          style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
          <StatBar label={`HP (${PLAYER.hp}/${PLAYER.hpMax})`} value={PLAYER.hp} max={PLAYER.hpMax} color="green" />
          <StatBar label={`Мана (${PLAYER.mana}/${PLAYER.manaMax})`} value={PLAYER.mana} max={PLAYER.manaMax} color="cyan" />
          <StatBar label={`Опыт (${PLAYER.exp}/${PLAYER.expMax})`} value={PLAYER.exp} max={PLAYER.expMax} />
        </div>
      </div>
    </div>
  );
}

function DiaryScreen() {
  const [activeQuest, setActiveQuest] = useState<number | null>(null);

  return (
    <div className="animate-slide-up space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-[hsl(45,100%,60%)] rotate-45" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">Задания</h3>
          <div className="ml-auto bg-[hsl(45,100%,60%,0.1)] border border-[hsl(45,100%,60%,0.3)] px-2 py-0.5"
            style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}>
            <span className="text-[hsl(45,100%,60%)] text-[10px] font-mono">{QUESTS.filter(q => q.active).length} АКТИВНО</span>
          </div>
        </div>
        <div className="space-y-2">
          {QUESTS.map(q => (
            <div
              key={q.id}
              className={`bg-[hsl(0,0%,9%)] border p-3 cursor-pointer transition-all duration-200 ${
                activeQuest === q.id ? "border-[hsl(45,100%,40%)]" : "border-[hsl(0,0%,16%)]"
              }`}
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
              onClick={() => setActiveQuest(activeQuest === q.id ? null : q.id)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${q.active ? "bg-[hsl(145,70%,45%)]" : "bg-[hsl(0,0%,30%)]"}`} />
                <span className="font-display font-semibold text-sm text-white flex-1">{q.title}</span>
                <span className={`text-[10px] uppercase font-mono tracking-widest ${QUEST_TYPE_COLOR[q.type]}`}>{q.type}</span>
                <Icon name={activeQuest === q.id ? "ChevronUp" : "ChevronDown"} size={14} className="text-muted-foreground" />
              </div>

              {activeQuest === q.id && (
                <div className="mt-3 pt-3 border-t border-[hsl(0,0%,16%)] space-y-2">
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">{q.desc}</p>
                  <div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-mono">
                      <span>Прогресс</span><span>{q.progress}/{q.total}</span>
                    </div>
                    <div className="bg-[hsl(0,0%,12%)] h-1.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[hsl(45,100%,60%)] to-[hsl(45,100%,75%)]"
                        style={{ width: `${(q.progress / q.total) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <span className="text-[10px] text-muted-foreground font-mono">НАГРАДА:</span>
                    <span className="text-[10px] text-[hsl(45,100%,60%)] font-mono">+{q.xp} XP</span>
                    <span className="text-[10px] text-[hsl(45,80%,50%)] font-mono">◆{q.gold}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-[hsl(195,100%,50%)] rotate-45" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">Записи дневника</h3>
        </div>
        <div className="space-y-2">
          {DIARY.map(entry => (
            <div key={entry.id} className="bg-[hsl(0,0%,9%)] border border-[hsl(0,0%,16%)] p-3"
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-mono text-muted-foreground">{entry.date}</span>
                <span className="text-[10px] font-mono text-[hsl(195,100%,50%)] uppercase tracking-widest">{entry.tag}</span>
              </div>
              <p className="text-xs text-foreground font-mono leading-relaxed">{entry.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeaderboardScreen() {
  return (
    <div className="animate-slide-up space-y-4">
      <div className="bg-[hsl(0,0%,9%)] border border-[hsl(45,100%,40%)] p-4 text-center"
        style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
        <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-1">Твоя позиция</div>
        <div className="text-4xl font-display font-bold text-[hsl(45,100%,60%)]">#{PLAYER.rank}</div>
        <div className="text-xs text-muted-foreground font-mono mt-1">из 12 480 игроков</div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-[hsl(45,100%,60%)] rotate-45" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">Рейтинг</h3>
        </div>

        <div className="grid grid-cols-[32px_1fr_auto_auto] gap-2 px-3 mb-2">
          {["#", "Игрок", "Ур.", "Очки"].map(h => (
            <span key={h} className="text-[10px] text-muted-foreground font-mono uppercase">{h}</span>
          ))}
        </div>

        <div className="space-y-1">
          {LEADERBOARD.map((p, i) => {
            if (p.divider) {
              return (
                <div key={i} className="flex items-center gap-2 py-1 px-3">
                  <div className="flex-1 border-t border-dashed border-[hsl(0,0%,20%)]" />
                  <span className="text-[10px] text-muted-foreground font-mono">···</span>
                  <div className="flex-1 border-t border-dashed border-[hsl(0,0%,20%)]" />
                </div>
              );
            }
            const isMe = p.isMe;
            return (
              <div
                key={p.rank}
                className={`bg-[hsl(0,0%,9%)] border p-3 grid grid-cols-[32px_1fr_auto_auto] gap-2 items-center ${
                  isMe ? "border-[hsl(45,100%,40%)] bg-[hsl(45,100%,60%,0.05)]" : "border-[hsl(0,0%,16%)]"
                }`}
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
              >
                <span className={`font-display text-sm font-bold ${
                  p.rank === 1 ? "text-[hsl(45,100%,60%)]" :
                  p.rank === 2 ? "text-[hsl(0,0%,75%)]" :
                  p.rank === 3 ? "text-[hsl(25,80%,55%)]" :
                  "text-muted-foreground"
                }`}>
                  {p.rank <= 3 ? ["🥇","🥈","🥉"][p.rank - 1] : p.rank}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    {p.online && <div className="w-1.5 h-1.5 rounded-full bg-[hsl(145,70%,45%)] flex-shrink-0" />}
                    <span className={`font-display text-sm font-semibold truncate ${isMe ? "text-[hsl(45,100%,60%)]" : "text-white"}`}>{p.name}</span>
                    {isMe && <span className="text-[9px] text-[hsl(45,100%,60%)] border border-[hsl(45,100%,40%)] px-1 font-mono">ТЫ</span>}
                  </div>
                  {p.class && <div className="text-[10px] text-muted-foreground font-mono truncate">{p.class}</div>}
                </div>
                <span className="text-xs font-mono text-[hsl(195,100%,50%)] text-right">{p.level || ""}</span>
                <span className="text-xs font-mono text-white text-right">{p.score ? p.score.toLocaleString() : ""}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ShopScreen() {
  const [gold, setGold] = useState(PLAYER.gold);
  const [items, setItems] = useState(SHOP_ITEMS);
  const [bought, setBought] = useState<number | null>(null);

  function buy(id: number, price: number) {
    if (gold < price) return;
    setGold(g => g - price);
    setItems(prev => prev.map(i => i.id === id ? { ...i, owned: true } : i));
    setBought(id);
    setTimeout(() => setBought(null), 1500);
  }

  return (
    <div className="animate-slide-up space-y-4">
      <div className="bg-[hsl(0,0%,9%)] border border-[hsl(0,0%,16%)] p-3 flex items-center justify-between"
        style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Баланс</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[hsl(45,100%,60%)] text-lg">◆</span>
          <span className="font-display text-xl font-bold text-[hsl(45,100%,60%)]">{gold.toLocaleString()}</span>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-[hsl(45,100%,60%)] rotate-45" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">Товары</h3>
        </div>

        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className={`bg-[hsl(0,0%,9%)] border p-3 transition-all ${RARITY_BORDER[item.rarity]}`}
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 flex items-center justify-center border bg-[hsl(0,0%,10%)] text-lg ${RARITY_BORDER[item.rarity]}`}
                  style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}>
                  {item.type === "weapon" ? "⚔️" : item.type === "armor" ? "🛡️" : item.type === "accessory" ? "💎" : "⚗️"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display text-sm font-semibold text-white">{item.name}</span>
                    <span className={`text-[10px] font-mono uppercase ${RARITY_COLOR[item.rarity]}`}>{item.rarity}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">{item.bonus}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  {item.owned ? (
                    <div className="px-3 py-1.5 bg-[hsl(0,0%,14%)] text-muted-foreground text-[10px] font-mono uppercase"
                      style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}>
                      Куплено
                    </div>
                  ) : (
                    <button
                      onClick={() => buy(item.id, item.price)}
                      disabled={gold < item.price}
                      className={`px-3 py-1.5 font-display font-semibold text-[11px] flex items-center gap-1 uppercase tracking-wider transition-all ${
                        gold < item.price
                          ? "bg-[hsl(0,0%,14%)] text-muted-foreground cursor-not-allowed"
                          : "bg-[hsl(45,100%,60%)] text-[hsl(0,0%,6%)] hover:bg-[hsl(45,100%,70%)] hover:-translate-y-px"
                      }`}
                      style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}
                    >
                      ◆ {item.price}
                    </button>
                  )}
                </div>
              </div>
              {bought === item.id && (
                <div className="mt-2 text-[10px] text-[hsl(145,70%,45%)] font-mono animate-slide-up">✓ Куплено!</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AchievementsScreen() {
  const unlocked = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const totalPoints = ACHIEVEMENTS.filter(a => a.unlocked).reduce((s, a) => s + a.points, 0);

  return (
    <div className="animate-slide-up space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[hsl(0,0%,9%)] border border-[hsl(0,0%,16%)] p-3 text-center"
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
          <div className="text-2xl font-display font-bold text-[hsl(45,100%,60%)]">{unlocked}/{ACHIEVEMENTS.length}</div>
          <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5">Разблокировано</div>
        </div>
        <div className="bg-[hsl(0,0%,9%)] border border-[hsl(0,0%,16%)] p-3 text-center"
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
          <div className="text-2xl font-display font-bold text-[hsl(195,100%,50%)]">{totalPoints}</div>
          <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5">Очки</div>
        </div>
      </div>

      <div className="bg-[hsl(0,0%,9%)] border border-[hsl(0,0%,16%)] p-3"
        style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono mb-1.5">
          <span>ПРОГРЕСС</span>
          <span>{Math.round((unlocked / ACHIEVEMENTS.length) * 100)}%</span>
        </div>
        <div className="bg-[hsl(0,0%,12%)] h-1.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[hsl(45,100%,60%)] to-[hsl(45,100%,75%)] transition-all"
            style={{ width: `${(unlocked / ACHIEVEMENTS.length) * 100}%` }} />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-[hsl(45,100%,60%)] rotate-45" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">Достижения</h3>
        </div>
        <div className="space-y-2">
          {ACHIEVEMENTS.map(a => (
            <div
              key={a.id}
              className={`bg-[hsl(0,0%,9%)] border p-3 flex items-center gap-3 transition-all ${
                a.unlocked ? "border-[hsl(45,100%,40%,0.5)]" : "border-[hsl(0,0%,16%)] opacity-50"
              }`}
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
            >
              <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 border ${
                a.unlocked
                  ? "bg-[hsl(45,100%,60%,0.1)] border-[hsl(45,100%,40%)]"
                  : "bg-[hsl(0,0%,10%)] border-[hsl(0,0%,20%)]"
              }`}
                style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}>
                <Icon name={a.icon} fallback="Star" size={16} className={a.unlocked ? "text-[hsl(45,100%,60%)]" : "text-muted-foreground"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-display text-sm font-semibold ${a.unlocked ? "text-white" : "text-muted-foreground"}`}>{a.title}</span>
                  {a.unlocked && <div className="w-1.5 h-1.5 bg-[hsl(145,70%,45%)] rounded-full flex-shrink-0" />}
                </div>
                <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">{a.desc}</p>
                {a.unlocked && a.date && (
                  <p className="text-[9px] text-[hsl(45,100%,60%,0.6)] font-mono mt-0.5">{a.date}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-sm font-display font-bold ${a.unlocked ? "text-[hsl(45,100%,60%)]" : "text-muted-foreground"}`}>+{a.points}</div>
                <div className="text-[9px] text-muted-foreground font-mono">очков</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const NAV_ITEMS: { id: Screen; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "character", label: "Герой", icon: "User" },
  { id: "diary", label: "Дневник", icon: "BookOpen" },
  { id: "leaderboard", label: "Рейтинг", icon: "Trophy" },
  { id: "shop", label: "Магазин", icon: "ShoppingBag" },
  { id: "achievements", label: "Достиж.", icon: "Star" },
];

export default function Index() {
  const [screen, setScreen] = useState<Screen>("home");

  const screenTitles: Record<Screen, string> = {
    home: "Главная",
    character: "Персонаж",
    diary: "Дневник",
    leaderboard: "Рейтинг",
    shop: "Магазин",
    achievements: "Достижения",
  };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,6%)] flex flex-col max-w-md mx-auto relative">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)" }} />

      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[hsl(0,0%,6%)] border-b border-[hsl(0,0%,14%)]">
        {/* Logo row */}
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[hsl(45,100%,60%)] rotate-45" />
            <span className="font-display text-base font-bold text-[hsl(45,100%,60%)] tracking-[0.2em] uppercase">NEXUS</span>
            <span className="text-[10px] text-muted-foreground font-mono border border-[hsl(0,0%,20%)] px-1.5 py-0.5">RPG</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(145,70%,45%)]" style={{ animation: "pulse 3s ease-in-out infinite" }} />
            <span className="text-[10px] text-muted-foreground font-mono">В сети</span>
          </div>
        </div>
        {/* Resources row */}
        <div className="px-3 pb-2.5 flex items-center gap-2">
          {/* Монеты */}
          <div className="flex-1 flex items-center gap-1.5 bg-[hsl(0,0%,9%)] border border-[hsl(0,0%,16%)] px-2.5 py-1.5"
            style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
            <span className="text-base leading-none">🪙</span>
            <div className="min-w-0">
              <div className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider leading-none mb-0.5">Монеты</div>
              <div className="font-display text-sm font-bold text-white leading-none">{PLAYER.coins.toLocaleString()}</div>
            </div>
          </div>
          {/* Золото */}
          <div className="flex-1 flex items-center gap-1.5 bg-[hsl(0,0%,9%)] border border-[hsl(45,100%,35%)] px-2.5 py-1.5"
            style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
            <span className="text-base leading-none">⭐</span>
            <div className="min-w-0">
              <div className="text-[9px] text-[hsl(45,100%,50%)] font-mono uppercase tracking-wider leading-none mb-0.5">Золото</div>
              <div className="font-display text-sm font-bold text-[hsl(45,100%,60%)] leading-none">{PLAYER.gold.toLocaleString()}</div>
            </div>
          </div>
          {/* Кристаллы */}
          <div className="flex-1 flex items-center gap-1.5 bg-[hsl(0,0%,9%)] border border-[hsl(195,100%,30%)] px-2.5 py-1.5"
            style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
            <span className="text-base leading-none">💎</span>
            <div className="min-w-0">
              <div className="text-[9px] text-[hsl(195,100%,40%)] font-mono uppercase tracking-wider leading-none mb-0.5">Кристаллы</div>
              <div className="font-display text-sm font-bold text-[hsl(195,100%,55%)] leading-none">{PLAYER.crystals}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Page title */}
      <div className="px-4 pt-4 pb-1 z-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">/ {screenTitles[screen]}</span>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-4 pt-2 z-10">
        {screen === "home" && <HomeScreen />}
        {screen === "character" && <CharacterScreen />}
        {screen === "diary" && <DiaryScreen />}
        {screen === "leaderboard" && <LeaderboardScreen />}
        {screen === "shop" && <ShopScreen />}
        {screen === "achievements" && <AchievementsScreen />}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-50 bg-[hsl(0,0%,6%)] border-t border-[hsl(0,0%,14%)] px-2 py-2">
        <div className="grid grid-cols-6 gap-0.5">
          {NAV_ITEMS.map(item => {
            const active = screen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={`flex flex-col items-center gap-0.5 py-2 px-1 transition-all duration-150 ${
                  active ? "text-[hsl(45,100%,60%)]" : "text-muted-foreground hover:text-white"
                }`}
              >
                <div className={`relative transition-transform ${active ? "scale-110" : ""}`}>
                  <Icon name={item.icon} fallback="Circle" size={17} />
                  {active && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[hsl(45,100%,60%)] rounded-full" />
                  )}
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}