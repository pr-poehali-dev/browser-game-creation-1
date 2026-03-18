import { useState } from "react";

type Screen = "home" | "character" | "diary" | "leaderboard" | "shop" | "achievements" | "duel";

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
  attack: 9,
  defence: 0,
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
  { id: 1, title: "Логово кобольдов", desc: "Зачистить пещеры к северу от деревни", progress: 6, total: 10, xp: 500, gold: 120, active: true, type: "combat", emoji: "⚔️" },
  { id: 2, title: "Торговец в беде", desc: "Сопроводить купца до форта Эйлон", progress: 1, total: 1, xp: 300, gold: 80, active: true, type: "story", emoji: "📜" },
  { id: 3, title: "Сбор трав", desc: "Найти 5 лунных цветков на болоте", progress: 2, total: 5, xp: 200, gold: 50, active: true, type: "gather", emoji: "🌿" },
  { id: 4, title: "Тайна руин", desc: "Исследовать древние руины Эшара", progress: 0, total: 3, xp: 800, gold: 200, active: false, type: "explore", emoji: "🗺️" },
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
  { id: 1, title: "Первая кровь", desc: "Победить первого врага", emoji: "⚔️", unlocked: true, date: "День 1", points: 10 },
  { id: 2, title: "Исследователь", desc: "Посетить 10 локаций", emoji: "🗺️", unlocked: true, date: "День 22", points: 25 },
  { id: 3, title: "Торговец", desc: "Совершить 20 покупок", emoji: "🛒", unlocked: true, date: "День 31", points: 20 },
  { id: 4, title: "Легенда подземелья", desc: "Пройти 5 данжей подряд", emoji: "🏰", unlocked: false, date: "", points: 50 },
  { id: 5, title: "Мастер квестов", desc: "Выполнить 50 заданий", emoji: "📋", unlocked: false, date: "", points: 75 },
  { id: 6, title: "Непобедимый", desc: "10 боёв без потери HP", emoji: "🛡️", unlocked: false, date: "", points: 100 },
  { id: 7, title: "Богач", desc: "Накопить 10 000 золота", emoji: "💰", unlocked: false, date: "", points: 40 },
  { id: 8, title: "Ветеран", desc: "Достичь 50 уровня", emoji: "⭐", unlocked: false, date: "", points: 200 },
];

const RARITY_COLOR: Record<string, string> = {
  common: "#888",
  uncommon: "#4caf50",
  rare: "#2196f3",
  epic: "#9c27b0",
  legendary: "#ff9800",
};

const MAIN_MENU = [
  { id: "diary" as Screen, label: "Дневник", emoji: "⭐" },
  { id: "diary" as Screen, label: "Задания", emoji: "📜" },
  { id: "duel" as Screen, label: "Дуэль", emoji: "⚔️" },
  { id: "home" as Screen, label: "Поселок", emoji: "🏘️" },
  { id: "home" as Screen, label: "Поход", emoji: "🌲" },
  { id: "home" as Screen, label: "Подземелье", emoji: "⛏️" },
  { id: "home" as Screen, label: "Плавание", emoji: "⛵" },
  { id: "home" as Screen, label: "Дракон", emoji: "🐉" },
  { id: "home" as Screen, label: "Орки", emoji: "👹" },
  { id: "leaderboard" as Screen, label: "Орден", emoji: "🏰" },
  { id: "home" as Screen, label: "Дружина", emoji: "🤝" },
  { id: "home" as Screen, label: "Зверинец", emoji: "🦁" },
  { id: "leaderboard" as Screen, label: "Лучшие", emoji: "🏆" },
  { id: "home" as Screen, label: "Пригласить", emoji: "✉️" },
];

const BOTTOM_MENU = [
  { id: "home" as Screen, label: "Главная", emoji: "🌲" },
  { id: "character" as Screen, label: "Герой", emoji: "🧙" },
  { id: "home" as Screen, label: "Чат (377)", emoji: "💬" },
  { id: "home" as Screen, label: "Почта", emoji: "📬" },
  { id: "shop" as Screen, label: "Золото", emoji: "🪙" },
];

const STAT_META: Record<string, { label: string; emoji: string }> = {
  strength:  { label: "Сила",        emoji: "⚔️" },
  agility:   { label: "Ловкость",    emoji: "🏹" },
  intellect: { label: "Интеллект",   emoji: "📚" },
  endurance: { label: "Выносливость",emoji: "🛡️" },
  luck:      { label: "Удача",       emoji: "🍀" },
};

function upgradeCost(value: number): number {
  return Math.floor(100 * Math.pow(1.15, value - 30));
}

/* ─── HomeScreen ─── */
function HomeScreen() {
  return (
    <div>
      <div className="heroes-banner">
        <img src="https://cdn.poehali.dev/files/0eb5b8bd-83b4-4221-a23c-5b861ca90e37.jpg" alt="banner" className="heroes-banner-img" />
      </div>
      <p className="heroes-welcome">Добро пожаловать!</p>
      <p className="heroes-sub">
        Армия из <strong>2 447 370</strong> героев приветствует тебя, {PLAYER.name}! Поблизости <strong>{PLAYER.rank}</strong>
      </p>

      <div className="heroes-section-divider" />

      <ul className="heroes-menu-list">
        {MAIN_MENU.map((item, i) => (
          <li key={i} className="heroes-menu-item">
            <span className="heroes-menu-emoji">{item.emoji}</span>
            <span className="heroes-menu-link">{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="heroes-section-divider" />

      <ul className="heroes-menu-list heroes-bottom-list">
        {BOTTOM_MENU.map((item, i) => (
          <li key={i} className="heroes-menu-item">
            <span className="heroes-menu-emoji">{item.emoji}</span>
            <span className="heroes-menu-link">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── CharacterScreen ─── */
function CharacterScreen({ coins, setCoins }: { coins: number; setCoins: (v: number) => void }) {
  const [stats, setStats] = useState({ ...PLAYER.stats });

  function upgrade(key: string) {
    const val = stats[key as keyof typeof stats];
    const cost = upgradeCost(val);
    if (coins < cost) return;
    setCoins(coins - cost);
    setStats(prev => ({ ...prev, [key]: val + 1 }));
  }

  return (
    <div>
      <table className="heroes-char-table">
        <tbody>
          <tr><td className="heroes-td-label">Имя</td><td>{PLAYER.name}</td></tr>
          <tr><td className="heroes-td-label">Класс</td><td>{PLAYER.class}</td></tr>
          <tr><td className="heroes-td-label">Уровень</td><td>{PLAYER.level}</td></tr>
          <tr>
            <td className="heroes-td-label">Опыт</td>
            <td>
              <div style={{ marginBottom: 3 }}>{PLAYER.exp} / {PLAYER.expMax}</div>
              <div className="heroes-bar-wrap">
                <div className="heroes-bar-fill heroes-bar-xp" style={{ width: `${Math.round((PLAYER.exp / PLAYER.expMax) * 100)}%` }} />
              </div>
            </td>
          </tr>
          <tr>
            <td className="heroes-td-label">HP</td>
            <td>
              <div style={{ marginBottom: 3 }}>{PLAYER.hp} / {PLAYER.hpMax}</div>
              <div className="heroes-bar-wrap">
                <div className="heroes-bar-fill heroes-bar-hp" style={{ width: `${Math.round((PLAYER.hp / PLAYER.hpMax) * 100)}%` }} />
              </div>
            </td>
          </tr>
          <tr>
            <td className="heroes-td-label">Мана</td>
            <td>
              <div style={{ marginBottom: 3 }}>{PLAYER.mana} / {PLAYER.manaMax}</div>
              <div className="heroes-bar-wrap">
                <div className="heroes-bar-fill heroes-bar-mana" style={{ width: `${Math.round((PLAYER.mana / PLAYER.manaMax) * 100)}%` }} />
              </div>
            </td>
          </tr>
          <tr><td className="heroes-td-label">Атака</td><td>{PLAYER.attack}</td></tr>
          <tr><td className="heroes-td-label">Защита</td><td>{PLAYER.defence}</td></tr>
          <tr><td className="heroes-td-label">Оружие</td><td>{PLAYER.equipped.weapon}</td></tr>
          <tr><td className="heroes-td-label">Броня</td><td>{PLAYER.equipped.armor}</td></tr>
          <tr><td className="heroes-td-label">Амулет</td><td>{PLAYER.equipped.amulet}</td></tr>
        </tbody>
      </table>

      <div className="heroes-section-title" style={{ marginTop: 14 }}>⚡ Характеристики</div>
      <div className="heroes-note">Цена растёт с каждым уровнем · Баланс: 🪙 {coins.toLocaleString()}</div>

      <table className="heroes-char-table">
        <tbody>
          {Object.entries(stats).map(([key, val]) => {
            const meta = STAT_META[key];
            const cost = upgradeCost(val);
            const canAfford = coins >= cost;
            return (
              <tr key={key}>
                <td className="heroes-td-label">{meta.emoji} {meta.label}</td>
                <td style={{ width: 40, textAlign: "center", fontWeight: "bold" }}>{val}</td>
                <td>
                  <button
                    className={`heroes-upgrade-btn ${canAfford ? "" : "heroes-upgrade-btn--disabled"}`}
                    onClick={() => upgrade(key)}
                    disabled={!canAfford}
                  >
                    +1 · 🪙{cost.toLocaleString()}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── DiaryScreen ─── */
function DiaryScreen() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div>
      <div className="heroes-section-title">📜 Задания</div>
      <ul className="heroes-menu-list" style={{ marginBottom: 12 }}>
        {QUESTS.map(q => (
          <li key={q.id}>
            <button className="heroes-quest-row" onClick={() => setOpenId(openId === q.id ? null : q.id)}>
              <span className="heroes-menu-emoji">{q.emoji}</span>
              <span className="heroes-menu-link" style={{ flex: 1, textAlign: "left" }}>{q.title}</span>
              <span style={{ fontSize: 11, color: q.active ? "#4a9b4a" : "#999" }}>{q.active ? "●" : "○"}</span>
            </button>
            {openId === q.id && (
              <div className="heroes-quest-detail">
                <p style={{ marginBottom: 4 }}>{q.desc}</p>
                <div className="heroes-bar-wrap" style={{ marginBottom: 4 }}>
                  <div className="heroes-bar-fill heroes-bar-xp" style={{ width: `${(q.progress / q.total) * 100}%` }} />
                </div>
                <span style={{ color: "#888", fontSize: 11 }}>
                  {q.progress}/{q.total} · Награда: +{q.xp} XP · ◆{q.gold}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="heroes-section-divider" />
      <div className="heroes-section-title">📖 Записи дневника</div>
      <div className="heroes-diary-list">
        {DIARY.map(e => (
          <div key={e.id} className="heroes-diary-entry">
            <div className="heroes-diary-meta">
              <span>{e.date}</span>
              <span className="heroes-diary-tag">{e.tag}</span>
            </div>
            <p>{e.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── LeaderboardScreen ─── */
function LeaderboardScreen() {
  return (
    <div>
      <div className="heroes-my-rank">
        Твоя позиция: <strong>#{PLAYER.rank}</strong> из 12 480 игроков
      </div>
      <div className="heroes-section-title" style={{ marginTop: 10 }}>🏆 Рейтинг</div>
      <table className="heroes-rank-table">
        <thead>
          <tr>
            <th>#</th><th>Игрок</th><th>Ур.</th><th>Очки</th>
          </tr>
        </thead>
        <tbody>
          {LEADERBOARD.map((p, i) => {
            if (p.divider) {
              return <tr key={i}><td colSpan={4} className="heroes-rank-divider">· · ·</td></tr>;
            }
            return (
              <tr key={p.rank} className={p.isMe ? "heroes-rank-me" : ""}>
                <td style={{ textAlign: "center" }}>
                  {p.rank <= 3 ? ["🥇","🥈","🥉"][p.rank - 1] : p.rank}
                </td>
                <td>
                  {p.online && <span style={{ color: "#4a9b4a", marginRight: 4 }}>●</span>}
                  {p.name}
                  {p.isMe && <span className="heroes-me-badge">ТЫ</span>}
                  {p.class ? <span style={{ color: "#888", fontSize: 11 }}> · {p.class}</span> : null}
                </td>
                <td style={{ textAlign: "center" }}>{p.level || ""}</td>
                <td style={{ textAlign: "right" }}>{p.score ? p.score.toLocaleString() : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── ShopScreen ─── */
function ShopScreen() {
  const [gold, setGold] = useState(PLAYER.gold);
  const [items, setItems] = useState(SHOP_ITEMS);

  function buy(id: number) {
    const item = items.find(i => i.id === id);
    if (!item || item.owned || gold < item.price) return;
    setGold(g => g - item.price);
    setItems(prev => prev.map(i => i.id === id ? { ...i, owned: true } : i));
  }

  return (
    <div>
      <div className="heroes-my-rank">
        Ваше золото: <strong>◆ {gold.toLocaleString()}</strong>
      </div>
      <table className="heroes-rank-table" style={{ marginTop: 10 }}>
        <thead>
          <tr><th>Предмет</th><th>Бонус</th><th>Цена</th><th></th></tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td style={{ color: RARITY_COLOR[item.rarity] }}>{item.name}</td>
              <td style={{ fontSize: 11, color: "#555" }}>{item.bonus}</td>
              <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>◆{item.price}</td>
              <td>
                {item.owned ? (
                  <span style={{ color: "#4a9b4a", fontSize: 11 }}>✓ Куплено</span>
                ) : (
                  <button
                    className={`heroes-upgrade-btn ${gold < item.price ? "heroes-upgrade-btn--disabled" : ""}`}
                    onClick={() => buy(item.id)}
                    disabled={gold < item.price}
                  >
                    Купить
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── AchievementsScreen ─── */
function AchievementsScreen() {
  const unlocked = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const totalPoints = ACHIEVEMENTS.filter(a => a.unlocked).reduce((s, a) => s + a.points, 0);

  return (
    <div>
      <div className="heroes-my-rank">
        Разблокировано: <strong>{unlocked}/{ACHIEVEMENTS.length}</strong> · Очки: <strong>{totalPoints}</strong>
      </div>
      <ul className="heroes-menu-list" style={{ marginTop: 10 }}>
        {ACHIEVEMENTS.map(a => (
          <li key={a.id} className={`heroes-menu-item ${!a.unlocked ? "heroes-ach-locked" : ""}`}>
            <span className="heroes-menu-emoji">{a.emoji}</span>
            <span style={{ flex: 1 }}>
              <span className="heroes-menu-link" style={{ opacity: a.unlocked ? 1 : 0.5 }}>{a.title}</span>
              <span style={{ color: "#888", fontSize: 11, display: "block" }}>{a.desc}</span>
              {a.unlocked && a.date && <span style={{ color: "#b8860b", fontSize: 10 }}>{a.date}</span>}
            </span>
            <span style={{ color: a.unlocked ? "#b8860b" : "#bbb", fontWeight: "bold", fontSize: 12 }}>+{a.points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Duel opponents pool ─── */
const CLASSES = ["Паладин", "Маг", "Ассасин", "Рейнджер", "Берсеркер", "Лучник", "Жрец", "Варвар"];
const NAMES = ["Громила", "Тёмный_Клинок", "Ночная_Тень", "Ледяной", "Кровопийца", "Стальной_Кулак", "Хаос_Рот", "Призрачный", "Костяной", "Вихрь_Смерти", "Огненный", "Теньхвост"];

type Opponent = {
  id: number;
  name: string;
  level: number;
  class: string;
  hp: number;
  hpMax: number;
  strength: number;
  agility: number;
  endurance: number;
  coins: number;
  prize: number;
};

function generateOpponents(playerLevel: number): Opponent[] {
  return Array.from({ length: 5 }, (_, i) => {
    const lvlOffset = Math.floor(Math.random() * 5) - 2;
    const level = Math.max(1, playerLevel + lvlOffset);
    const base = 50 + level * 4;
    const str = base + Math.floor(Math.random() * 20) - 10;
    const agi = base + Math.floor(Math.random() * 20) - 10;
    const end = base + Math.floor(Math.random() * 20) - 10;
    const hpMax = 600 + end * 5 + Math.floor(Math.random() * 200);
    const coins = 3000 + level * 400 + Math.floor(Math.random() * 2000);
    return {
      id: i,
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      level,
      class: CLASSES[Math.floor(Math.random() * CLASSES.length)],
      hp: hpMax,
      hpMax,
      strength: str,
      agility: agi,
      endurance: end,
      coins,
      prize: Math.floor(coins * 0.25),
    };
  });
}

type BattleLog = { text: string; type: "player" | "enemy" | "info" };

type DuelState = "list" | "fighting" | "result";

/* ─── DuelScreen ─── */
function DuelScreen({ coins, setCoins }: { coins: number; setCoins: (v: number) => void }) {
  const [opponents, setOpponents] = useState<Opponent[]>(() => generateOpponents(PLAYER.level));
  const [duelState, setDuelState] = useState<DuelState>("list");
  const [selected, setSelected] = useState<Opponent | null>(null);
  const [playerHp, setPlayerHp] = useState(PLAYER.hp);
  const [enemyHp, setEnemyHp] = useState(0);
  const [log, setLog] = useState<BattleLog[]>([]);
  const [won, setWon] = useState(false);
  const [prize, setPrize] = useState(0);
  const [fighting, setFighting] = useState(false);

  function refreshOpponents() {
    setOpponents(generateOpponents(PLAYER.level));
  }

  function startDuel(opp: Opponent) {
    setSelected(opp);
    setPlayerHp(PLAYER.hp);
    setEnemyHp(opp.hpMax);
    setLog([{ text: `⚔️ Дуэль началась! ${PLAYER.name} vs ${opp.name}`, type: "info" }]);
    setDuelState("fighting");
    setFighting(false);
  }

  function runBattle(opp: Opponent, startPlayerHp: number, startEnemyHp: number) {
    if (fighting) return;
    setFighting(true);

    let pHp = startPlayerHp;
    let eHp = startEnemyHp;
    const newLog: BattleLog[] = [];

    const rounds: (() => void)[] = [];

    while (pHp > 0 && eHp > 0) {
      const pStr = PLAYER.stats.strength;
      const pAgi = PLAYER.stats.agility;
      const pLuck = PLAYER.stats.luck;

      const pDmg = Math.max(1, pStr + Math.floor(Math.random() * 20) - opp.endurance / 4);
      const eDmg = Math.max(1, opp.strength + Math.floor(Math.random() * 15) - PLAYER.stats.endurance / 4);
      const pCrit = Math.random() * 100 < pLuck / 2;
      const eMiss = Math.random() * 100 < pAgi / 3;

      const finalPDmg = pCrit ? Math.floor(pDmg * 1.5) : pDmg;
      const finalEDmg = eMiss ? 0 : eDmg;

      eHp = Math.max(0, eHp - finalPDmg);
      pHp = Math.max(0, pHp - finalEDmg);

      const pHpSnap = pHp;
      const eHpSnap = eHp;
      const pdLog: BattleLog = {
        text: pCrit
          ? `💥 КРИТ! Ты наносишь ${finalPDmg} урона (HP врага: ${eHpSnap})`
          : `🗡️ Ты наносишь ${finalPDmg} урона (HP врага: ${eHpSnap})`,
        type: "player",
      };
      const edLog: BattleLog = eMiss
        ? { text: `💨 ${opp.name} промахнулся!`, type: "info" }
        : { text: `🔴 ${opp.name} наносит ${finalEDmg} урона (HP: ${pHpSnap})`, type: "enemy" };

      newLog.push(pdLog);
      if (eHp > 0) newLog.push(edLog);

      if (pHp <= 0 || eHp <= 0) break;
    }

    const playerWon = eHp <= 0 && pHp > 0;
    const earnedCoins = playerWon ? opp.prize : 0;

    newLog.push({
      text: playerWon
        ? `🏆 Победа! Ты получаешь 🪙 ${earnedCoins.toLocaleString()} монет (25% от казны ${opp.name})`
        : `💀 Поражение... ${opp.name} оказался сильнее.`,
      type: "info",
    });

    setLog([{ text: `⚔️ Раунды боя:`, type: "info" }]);
    let step = 0;
    const interval = setInterval(() => {
      if (step < newLog.length) {
        setLog(prev => [...prev, newLog[step]]);
        step++;
      } else {
        clearInterval(interval);
        setPlayerHp(pHp);
        setEnemyHp(eHp);
        setWon(playerWon);
        setPrize(earnedCoins);
        if (playerWon) {
          setCoins(coins + earnedCoins);
          setOpponents(prev => prev.filter(o => o.id !== opp.id));
        }
        setDuelState("result");
        setFighting(false);
      }
    }, 120);
  }

  if (duelState === "list") {
    return (
      <div>
        <div className="heroes-my-rank">
          ⚔️ Выбери противника для дуэли. За победу — <strong>25% монет</strong> противника.
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8, marginBottom: 4 }}>
          <button className="heroes-upgrade-btn" onClick={refreshOpponents}>🔄 Обновить список</button>
        </div>
        <table className="heroes-rank-table">
          <thead>
            <tr>
              <th>Игрок</th><th>Ур.</th><th>🪙 Казна</th><th>Приз</th><th></th>
            </tr>
          </thead>
          <tbody>
            {opponents.map(opp => (
              <tr key={opp.id}>
                <td>
                  <div style={{ fontWeight: "bold" }}>{opp.name}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{opp.class}</div>
                </td>
                <td style={{ textAlign: "center" }}>
                  <span className={opp.level > PLAYER.level ? "duel-lvl-hard" : opp.level < PLAYER.level ? "duel-lvl-easy" : "duel-lvl-equal"}>
                    {opp.level}
                  </span>
                </td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>🪙 {opp.coins.toLocaleString()}</td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap", color: "#b8860b", fontWeight: "bold" }}>
                  +{opp.prize.toLocaleString()}
                </td>
                <td>
                  <button className="heroes-upgrade-btn" onClick={() => startDuel(opp)}>Вызов</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>
          <span className="duel-lvl-easy">■</span> слабее &nbsp;
          <span className="duel-lvl-equal">■</span> ровня &nbsp;
          <span className="duel-lvl-hard">■</span> сильнее
        </div>
      </div>
    );
  }

  if (duelState === "fighting" && selected) {
    const pHpPct = Math.round((playerHp / PLAYER.hpMax) * 100);
    const eHpPct = Math.round((enemyHp / selected.hpMax) * 100);
    return (
      <div>
        <div className="duel-arena">
          <div className="duel-fighter">
            <div className="duel-fighter-name">🧙 {PLAYER.name}</div>
            <div className="duel-fighter-level">Ур. {PLAYER.level}</div>
            <div className="heroes-bar-wrap" style={{ marginTop: 4 }}>
              <div className="heroes-bar-fill heroes-bar-hp" style={{ width: `${pHpPct}%` }} />
            </div>
            <div style={{ fontSize: 11, color: "#555", textAlign: "center", marginTop: 2 }}>{playerHp}/{PLAYER.hpMax}</div>
          </div>
          <div className="duel-vs">VS</div>
          <div className="duel-fighter">
            <div className="duel-fighter-name">⚔️ {selected.name}</div>
            <div className="duel-fighter-level">Ур. {selected.level}</div>
            <div className="heroes-bar-wrap" style={{ marginTop: 4 }}>
              <div className="heroes-bar-fill heroes-bar-hp" style={{ width: `${eHpPct}%` }} />
            </div>
            <div style={{ fontSize: 11, color: "#555", textAlign: "center", marginTop: 2 }}>{enemyHp}/{selected.hpMax}</div>
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <button
            className={`heroes-upgrade-btn ${fighting ? "heroes-upgrade-btn--disabled" : ""}`}
            style={{ fontSize: 14, padding: "6px 24px" }}
            disabled={fighting}
            onClick={() => runBattle(selected, playerHp, enemyHp)}
          >
            {fighting ? "Идёт бой..." : "▶ Начать бой"}
          </button>
        </div>

        <div className="duel-log">
          {log.map((entry, i) => (
            <div key={i} className={`duel-log-line duel-log-${entry.type}`}>{entry.text}</div>
          ))}
        </div>
      </div>
    );
  }

  if (duelState === "result" && selected) {
    return (
      <div>
        <div className={`duel-result-banner ${won ? "duel-result-win" : "duel-result-lose"}`}>
          {won ? "🏆 ПОБЕДА!" : "💀 ПОРАЖЕНИЕ"}
        </div>
        {won ? (
          <div className="heroes-my-rank" style={{ marginTop: 8, textAlign: "center" }}>
            Ты победил <strong>{selected.name}</strong> и получил<br />
            <span style={{ fontSize: 20, fontWeight: "bold", color: "#b8860b" }}>🪙 +{prize.toLocaleString()}</span> монет
          </div>
        ) : (
          <div className="heroes-my-rank" style={{ marginTop: 8, textAlign: "center" }}>
            <strong>{selected.name}</strong> оказался сильнее.<br />
            <span style={{ color: "#7a0a0a" }}>Попробуй снова или выбери другого противника.</span>
          </div>
        )}
        <div className="duel-log" style={{ marginTop: 10, maxHeight: 200 }}>
          {log.map((entry, i) => (
            <div key={i} className={`duel-log-line duel-log-${entry.type}`}>{entry.text}</div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center" }}>
          <button className="heroes-upgrade-btn" onClick={() => setDuelState("list")}>← Назад к списку</button>
          {!won && selected && (
            <button className="heroes-upgrade-btn" onClick={() => startDuel(selected)}>🔄 Реванш</button>
          )}
        </div>
      </div>
    );
  }

  return null;
}

/* ─── Root ─── */
export default function Index() {
  const [screen, setScreen] = useState<Screen>("home");
  const [coins, setCoins] = useState(PLAYER.coins);

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  const screenTitles: Record<Screen, string> = {
    home: "Главная",
    character: "Герой",
    diary: "Дневник",
    leaderboard: "Рейтинг",
    shop: "Магазин",
    achievements: "Достижения",
    duel: "Дуэль",
  };

  return (
    <div className="heroes-root">
      {/* ── Header ── */}
      <header className="heroes-header">
        <div className="heroes-header-title">
          <span className="heroes-header-wings">🦅</span>
          <span className="heroes-header-text">Г Е Р О И</span>
          <span className="heroes-header-wings">🦅</span>
        </div>
        <div className="heroes-header-stats">
          <span className="heroes-header-avatar">🧙 {PLAYER.name}</span>
          <span className="heroes-stat-pill">❤️ {PLAYER.attack}</span>
          <span className="heroes-stat-pill">🪙 {coins.toLocaleString()}</span>
          <span className="heroes-stat-pill">⚔️ {PLAYER.defence}</span>
          <span className="heroes-stat-pill">💎 {PLAYER.crystals}</span>
          <span className="heroes-stat-pill">⭐ {PLAYER.gold.toLocaleString()}</span>
          <span className="heroes-stat-pill">✖ {PLAYER.level}/20</span>
        </div>
        <div className="heroes-header-time">⏱ {timeStr}</div>
      </header>

      {/* ── Content ── */}
      <main className="heroes-main">
        {screen === "home" && <HomeScreen />}
        {screen === "character" && <CharacterScreen coins={coins} setCoins={setCoins} />}
        {screen === "diary" && <DiaryScreen />}
        {screen === "leaderboard" && <LeaderboardScreen />}
        {screen === "shop" && <ShopScreen />}
        {screen === "achievements" && <AchievementsScreen />}
        {screen === "duel" && <DuelScreen coins={coins} setCoins={setCoins} />}
      </main>

      {/* ── Footer nav ── */}
      <footer className="heroes-footer">
        <div className="heroes-footer-nav">
          {([
            { id: "home", label: "Поиск" },
            { id: "leaderboard", label: "Форум" },
            { id: "diary", label: "Помощь" },
            { id: "home", label: "Правила" },
            { id: "home", label: "Настройки" },
          ] as { id: Screen; label: string }[]).map((item, i) => (
            <button key={i} className="heroes-footer-link" onClick={() => setScreen(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="heroes-footer-time">🕐 {timeStr}</div>

        <div className="heroes-tab-nav">
          {([
            { id: "home", label: "🌲 Главная" },
            { id: "character", label: "🧙 Герой" },
            { id: "diary", label: "📜 Дневник" },
            { id: "leaderboard", label: "🏆 Рейтинг" },
            { id: "shop", label: "🛒 Магазин" },
            { id: "achievements", label: "⭐ Достиж." },
          ] as { id: Screen; label: string }[]).map((item) => (
            <button
              key={item.id}
              className={`heroes-tab-btn ${screen === item.id ? "heroes-tab-btn--active" : ""}`}
              onClick={() => setScreen(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="heroes-footer-copy">
          © 2025 Герои · <a href="https://poehali.dev/help" target="_blank" rel="noreferrer" className="heroes-footer-link">Поддержка</a>
        </div>
      </footer>
    </div>
  );
}