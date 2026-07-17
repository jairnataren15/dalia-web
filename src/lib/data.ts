// Datos de ejemplo para desarrollo. En producción vendrán de la Riot API + base de datos.

export const DDRAGON_VER = "14.24.1";
export const champIcon = (champ: string) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/champion/${champ}.png`;
export const champSplash = (champ: string, skin = 0) =>
  `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ}_${skin}.jpg`;

export type Tier =
  | "Hierro" | "Bronce" | "Plata" | "Oro" | "Platino"
  | "Esmeralda" | "Diamante" | "Master" | "Grandmaster" | "Challenger";

export const TIER_COLORS: Record<Tier, string> = {
  Hierro: "#8a8a93",
  Bronce: "#b0793f",
  Plata: "#a8b7c4",
  Oro: "#e8b45a",
  Platino: "#43b3a4",
  Esmeralda: "#3fb96e",
  Diamante: "#5e9ee6",
  Master: "#b56ef0",
  Grandmaster: "#e05656",
  Challenger: "#f4d03f",
};

export type Region = "EUW" | "NA" | "LAN" | "LAS";
export type Role = "Top" | "Jungla" | "Mid" | "ADC" | "Soporte";

export interface Member {
  id: string;
  riotId: string;
  tag: string;
  discord: string;
  region: Region;
  role: Role;
  tier: Tier;
  division: string; // "I".."IV" o "" para Master+
  lp: number;
  wins: number;
  losses: number;
  mains: string[]; // ids de campeón para Data Dragon
  kda: number;
  streak: number; // >0 racha de victorias, <0 de derrotas
  lpHistory: number[]; // LP total acumulado por semana (últimas 10)
  unranked?: boolean; // true = verificado pero sin partidas clasificatorias
}

export const members: Member[] = [
  { id: "dalia", riotId: "QuesoTrïpleCrema", tag: "LAN", discord: "dalia", region: "LAN", role: "Mid", tier: "Oro", division: "I", lp: 10, wins: 451, losses: 472, mains: ["Seraphine", "Lux", "Xayah"], kda: 2.6, streak: 1, lpHistory: [1620, 1640, 1610, 1660, 1690, 1670, 1700, 1680, 1695, 1710] },
];

export const rankLabel = (m: Member) =>
  m.unranked ? "Sin clasificar" : m.division ? `${m.tier} ${m.division}` : m.tier;

export const winrate = (m: Member) =>
  m.wins + m.losses === 0 ? 0 : Math.round((m.wins / (m.wins + m.losses)) * 100);

// ——— Equipos ———
export interface Team {
  id: string;
  name: string;
  tagline: string;
  memberIds: string[];
  wins: number;
  losses: number;
}

export const teams: Team[] = [];

// ——— Tienda / sorteos ———
export interface RaffleItem {
  id: string;
  name: string;
  category: "Merch" | "Riot" | "Periféricos" | "Especial";
  cost: number; // puntos por participación
  entries: number;
  maxEntries: number;
  closes: string;
  image?: string; // champ para ilustrar premios Riot
}

export const pastWinners: { prize: string; winner: string; date: string }[] = [];

// ——— Predicciones ———
export const activePrediction = {
  question: "¿Dalia gana su próxima ranked?",
  champ: "Seraphine",
  opens: true,
  poolYes: 12450,
  poolNo: 8320,
  closesIn: "Cuando empiece la partida",
};

export const predictionRanking: { user: string; aciertos: number; fallos: number }[] = [];

// ——— FAQ ———
export const faqItems = [
  { q: "¿Cómo gano puntos DALIA.EXE?", a: "Viendo el directo (10 pts cada 5 min), chateando, participando en predicciones y torneos, y con bonus por rachas de días seguidos viendo el stream." },
  { q: "¿Qué puedo hacer con los puntos?", a: "Comprar participaciones para los sorteos de la tienda, apostar en predicciones de partidas y desbloquear insignias del perfil." },
  { q: "¿Puedo comprar más de una participación en un sorteo?", a: "Sí, puedes comprar todas las que quieras mientras haya disponibles. Más participaciones = más probabilidad de ganar." },
  { q: "¿Cómo se eligen los ganadores de los sorteos?", a: "Al cierre de cada sorteo se hace la elección aleatoria en directo, con todas las participaciones visibles en pantalla. El resultado queda publicado en el historial de ganadores." },
  { q: "¿Necesito verificar mi cuenta para participar?", a: "Para ver la web no, pero para sorteos, predicciones y torneos sí: necesitas al menos el Tier 1 (Discord vinculado). El Tier 2 (Riot ID verificado) desbloquea la tienda completa y los torneos." },
  { q: "¿Cómo me inscribo a un torneo?", a: "En la página del torneo activo, con tu cuenta verificada Tier 2. Puedes inscribirte solo (te asignamos equipo) o crear tu equipo e invitar a 4 más. El día del torneo hay que hacer check-in 15 minutos antes." },
  { q: "¿Qué pasa si mi equipo no hace check-in?", a: "Si al cierre de la ventana de check-in faltan jugadores, la plaza pasa al primer equipo de la lista de espera. Recibirás aviso por Discord cuando abra la ventana." },
  { q: "¿Las predicciones usan dinero real?", a: "No. Todo funciona con puntos DALIA.EXE, que no tienen valor monetario ni se pueden comprar. Es solo por diversión y por el ranking." },
];
