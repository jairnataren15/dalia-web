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
}

export const members: Member[] = [
  { id: "dalia", riotId: "Sam Chispas", tag: "Lux", discord: "dalia", region: "LAN", role: "Mid", tier: "Oro", division: "I", lp: 10, wins: 451, losses: 472, mains: ["Seraphine", "Lux", "Xayah"], kda: 2.6, streak: 1, lpHistory: [1620, 1640, 1610, 1660, 1690, 1670, 1700, 1680, 1695, 1710] },
];

export const rankLabel = (m: Member) =>
  m.division ? `${m.tier} ${m.division}` : m.tier;

export const winrate = (m: Member) =>
  Math.round((m.wins / (m.wins + m.losses)) * 100);

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

// ——— Torneo activo ———
export type MatchState = "pendiente" | "en_juego" | "terminada";

export interface BracketMatch {
  id: string;
  round: number; // 1 = cuartos, 2 = semis, 3 = final
  teamA: string | null;
  teamB: string | null;
  scoreA: number;
  scoreB: number;
  state: MatchState;
  hora: string;
}

export interface TournamentTeamEntry {
  name: string;
  captain: string;
  avgRank: string;
  checkedIn: boolean | null; // null = ventana no abierta aún
}

export const activeTournament = {
  name: "Copa DALIA.EXE #3",
  format: "Eliminación simple · Bo1 (final Bo3)",
  date: "Sábado 25 de julio, 18:00 CET",
  maxTeams: 8,
  prize: "50€ en RP por jugador + rol exclusivo en Discord",
  patch: "14.14",
  checkinOpen: true,
  checkinCloses: "17:45 CET",
  registered: [] as TournamentTeamEntry[],
  bracket: [
    { id: "q1", round: 1, teamA: null, teamB: null, scoreA: 0, scoreB: 0, state: "pendiente", hora: "18:00" },
    { id: "q2", round: 1, teamA: null, teamB: null, scoreA: 0, scoreB: 0, state: "pendiente", hora: "18:00" },
    { id: "q3", round: 1, teamA: null, teamB: null, scoreA: 0, scoreB: 0, state: "pendiente", hora: "19:00" },
    { id: "q4", round: 1, teamA: null, teamB: null, scoreA: 0, scoreB: 0, state: "pendiente", hora: "19:00" },
    { id: "s1", round: 2, teamA: null, teamB: null, scoreA: 0, scoreB: 0, state: "pendiente", hora: "20:00" },
    { id: "s2", round: 2, teamA: null, teamB: null, scoreA: 0, scoreB: 0, state: "pendiente", hora: "20:00" },
    { id: "f1", round: 3, teamA: null, teamB: null, scoreA: 0, scoreB: 0, state: "pendiente", hora: "21:00" },
  ] as BracketMatch[],
};

export const pastTournaments: {
  name: string;
  date: string;
  winner: string;
  runnerUp: string;
  mvp: string;
  teamsCount: number;
}[] = [];

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

export const raffles: RaffleItem[] = [
  { id: "r1", name: "Skin Legendaria a elegir", category: "Riot", cost: 500, entries: 342, maxEntries: 1000, closes: "Viernes 20:00", image: "Ahri" },
  { id: "r2", name: "3250 RP", category: "Riot", cost: 300, entries: 518, maxEntries: 800, closes: "Viernes 20:00", image: "Lux" },
  { id: "r3", name: "Sudadera oficial DALIA.EXE", category: "Merch", cost: 400, entries: 156, maxEntries: 500, closes: "Domingo 22:00" },
  { id: "r4", name: "Taza + stickers DALIA.EXE", category: "Merch", cost: 150, entries: 89, maxEntries: 300, closes: "Domingo 22:00" },
  { id: "r5", name: "Teclado mecánico RGB", category: "Periféricos", cost: 800, entries: 267, maxEntries: 600, closes: "Fin de mes" },
  { id: "r6", name: "Auriculares gaming", category: "Periféricos", cost: 600, entries: 198, maxEntries: 500, closes: "Fin de mes" },
  { id: "r7", name: "Partida de flex con Dalia", category: "Especial", cost: 250, entries: 445, maxEntries: 600, closes: "Cada domingo", image: "Rakan" },
  { id: "r8", name: "Revisión de VOD en directo", category: "Especial", cost: 200, entries: 122, maxEntries: 400, closes: "Cada jueves", image: "Vex" },
];

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

// ——— Puntos ———
export const pointsLeaderboard: { user: string; points: number; hours: number }[] = [];

// ——— Calendario ———
export const schedule = [
  { day: "Lunes", time: "18:00 – 22:00", content: "Ranked grind + charla con el chat", type: "stream" },
  { day: "Martes", time: "—", content: "Descanso", type: "off" },
  { day: "Miércoles", time: "18:00 – 22:00", content: "Ranked + revisión de VODs de la comunidad", type: "stream" },
  { day: "Jueves", time: "18:00 – 23:00", content: "Flex con viewers + sorteo semanal", type: "special" },
  { day: "Viernes", time: "17:00 – 22:00", content: "Ranked grind", type: "stream" },
  { day: "Sábado", time: "18:00 – 00:00", content: "Copa DALIA.EXE #3 · torneo de la comunidad", type: "event" },
  { day: "Domingo", time: "16:00 – 20:00", content: "ARAMs + partida de flex del sorteo", type: "special" },
];

// ——— LFG ———
export interface LfgPost {
  id: string;
  user: string;
  tier: Tier;
  role: Role;
  region: Region;
  looking: string;
  message: string;
  posted: string;
}

export const lfgPosts: LfgPost[] = [];

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

// ——— Inicio ———
export const latestVideos = [
  { title: "PENTAKILL con Seraphine subiendo a Platino | Road to Diamante #12", category: "LOL", duration: "18:42", views: "24K", champ: "Seraphine" },
  { title: "Tier list de midlaners del parche 14.14", category: "LOL", duration: "31:05", views: "41K", champ: "Syndra" },
  { title: "Así fue la COPA DALIA.EXE #2 | Resumen", category: "EVENTOS", duration: "22:17", views: "18K", champ: "Rakan" },
  { title: "Reaccionando a vuestras peores rankeds", category: "COMUNIDAD", duration: "27:33", views: "35K", champ: "Amumu" },
];

export const channelInfo = {
  youtube: { name: "Dalia", subs: "128K", videos: "842" },
  youtubeClips: { name: "Dalia Clips", subs: "45K", videos: "1.2K" },
};
