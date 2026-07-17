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
  { id: "rakan1", riotId: "PetaloMayor", tag: "DAL", discord: "petalomayor", region: "EUW", role: "Soporte", tier: "Diamante", division: "IV", lp: 34, wins: 188, losses: 172, mains: ["Rakan", "Thresh", "Nautilus"], kda: 3.1, streak: 2, lpHistory: [2100, 2110, 2140, 2150, 2180, 2200, 2210, 2230, 2228, 2234] },
  { id: "vex", riotId: "TristeVex", tag: "SAD", discord: "tristevex", region: "EUW", role: "Mid", tier: "Esmeralda", division: "I", lp: 78, wins: 240, losses: 231, mains: ["Vex", "Annie", "Veigar"], kda: 2.8, streak: -1, lpHistory: [1980, 2000, 2015, 2040, 2030, 2060, 2075, 2090, 2100, 2078] },
  { id: "kata", riotId: "KataDeLaVega", tag: "SHRP", discord: "katadelavega", region: "LAN", role: "Mid", tier: "Esmeralda", division: "II", lp: 45, wins: 175, losses: 160, mains: ["Katarina", "Akali", "Zed"], kda: 2.9, streak: 3, lpHistory: [1900, 1930, 1950, 1960, 1990, 2000, 2020, 2035, 2040, 2045] },
  { id: "junglaDiff", riotId: "JunglaDiff", tag: "GNK", discord: "jungladiff", region: "EUW", role: "Jungla", tier: "Esmeralda", division: "III", lp: 12, wins: 198, losses: 195, mains: ["LeeSin", "Vi", "JarvanIV"], kda: 2.6, streak: 1, lpHistory: [1850, 1870, 1880, 1900, 1920, 1915, 1940, 1960, 1980, 2012] },
  { id: "flores", riotId: "FloresDelMal", tag: "ROSA", discord: "floresdelmal", region: "LAS", role: "Top", tier: "Platino", division: "I", lp: 89, wins: 167, losses: 155, mains: ["Riven", "Fiora", "Camille"], kda: 2.4, streak: 4, lpHistory: [1700, 1720, 1750, 1770, 1790, 1810, 1830, 1850, 1870, 1889] },
  { id: "botlane", riotId: "CargaBotlane", tag: "ADC", discord: "cargabotlane", region: "EUW", role: "ADC", tier: "Platino", division: "II", lp: 55, wins: 210, losses: 205, mains: ["Jinx", "Caitlyn", "KaiSa"], kda: 3.0, streak: -2, lpHistory: [1720, 1740, 1730, 1760, 1780, 1800, 1790, 1810, 1830, 1855] },
  { id: "maokai", riotId: "ArbolSabio", tag: "TREE", discord: "arbolsabio", region: "NA", role: "Top", tier: "Platino", division: "III", lp: 21, wins: 145, losses: 139, mains: ["Maokai", "Ornn", "Shen"], kda: 2.2, streak: 1, lpHistory: [1650, 1660, 1680, 1700, 1710, 1730, 1740, 1760, 1780, 1821] },
  { id: "yasuo", riotId: "0y10Yasuo", tag: "WIND", discord: "0y10yasuo", region: "LAN", role: "Mid", tier: "Oro", division: "I", lp: 67, wins: 289, losses: 301, mains: ["Yasuo", "Yone", "Irelia"], kda: 2.1, streak: -3, lpHistory: [1500, 1520, 1510, 1540, 1560, 1550, 1580, 1590, 1610, 1667] },
  { id: "dalia", riotId: "Sam Chispas", tag: "Lux", discord: "dalia", region: "LAN", role: "Mid", tier: "Oro", division: "I", lp: 10, wins: 451, losses: 472, mains: ["Seraphine", "Lux", "Xayah"], kda: 2.6, streak: 1, lpHistory: [1620, 1640, 1610, 1660, 1690, 1670, 1700, 1680, 1695, 1710] },
  { id: "lulu", riotId: "LuluDelBosque", tag: "PIX", discord: "luludelbosque", region: "EUW", role: "Soporte", tier: "Oro", division: "II", lp: 43, wins: 132, losses: 121, mains: ["Lulu", "Nami", "Janna"], kda: 3.3, streak: 2, lpHistory: [1450, 1470, 1490, 1500, 1520, 1540, 1550, 1570, 1590, 1643] },
  { id: "garen", riotId: "VueltasGaren", tag: "SPIN", discord: "vueltasgaren", region: "LAS", role: "Top", tier: "Plata", division: "I", lp: 88, wins: 176, losses: 168, mains: ["Garen", "Darius", "Sett"], kda: 2.0, streak: 6, lpHistory: [1300, 1320, 1350, 1370, 1390, 1410, 1430, 1450, 1470, 1488] },
  { id: "amumu", riotId: "AmumuSinAmigos", tag: "SAD2", discord: "amumusinamigos", region: "NA", role: "Jungla", tier: "Plata", division: "III", lp: 12, wins: 98, losses: 102, mains: ["Amumu", "Rammus", "Nunu"], kda: 2.3, streak: -1, lpHistory: [1200, 1220, 1210, 1240, 1250, 1270, 1280, 1300, 1310, 1312] },
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

export const teams: Team[] = [
  { id: "petalos", name: "Pétalos de Acero", tagline: "El equipo insignia DALIA.EXE", memberIds: ["dalia", "rakan1", "junglaDiff", "botlane", "flores"], wins: 14, losses: 4 },
  { id: "espinas", name: "Espinas Negras", tagline: "Los villanos favoritos del chat", memberIds: ["kata", "vex", "yasuo", "garen", "amumu"], wins: 10, losses: 8 },
  { id: "brotes", name: "Brotes Nuevos", tagline: "La cantera de la comunidad", memberIds: ["maokai", "lulu"], wins: 6, losses: 9 },
];

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
  registered: [
    { name: "Pétalos de Acero", captain: "Dalia#FLOR", avgRank: "Diamante", checkedIn: true },
    { name: "Espinas Negras", captain: "KataDeLaVega#SHRP", avgRank: "Esmeralda", checkedIn: true },
    { name: "Los del Fondo", captain: "AmumuSinAmigos#SAD2", avgRank: "Plata", checkedIn: false },
    { name: "Winterfell Gaming", captain: "ArbolSabio#TREE", avgRank: "Platino", checkedIn: true },
    { name: "MidOrFeed", captain: "0y10Yasuo#WIND", avgRank: "Oro", checkedIn: false },
    { name: "Full AP Tontos", captain: "TristeVex#SAD", avgRank: "Esmeralda", checkedIn: true },
    { name: "Brotes Nuevos", captain: "LuluDelBosque#PIX", avgRank: "Oro", checkedIn: false },
    { name: "Manada Fantasma", captain: "VueltasGaren#SPIN", avgRank: "Plata", checkedIn: true },
  ] as TournamentTeamEntry[],
  bracket: [
    { id: "q1", round: 1, teamA: "Pétalos de Acero", teamB: "Manada Fantasma", scoreA: 1, scoreB: 0, state: "terminada", hora: "18:00" },
    { id: "q2", round: 1, teamA: "Winterfell Gaming", teamB: "MidOrFeed", scoreA: 1, scoreB: 0, state: "terminada", hora: "18:00" },
    { id: "q3", round: 1, teamA: "Espinas Negras", teamB: "Los del Fondo", scoreA: 0, scoreB: 0, state: "en_juego", hora: "19:00" },
    { id: "q4", round: 1, teamA: "Full AP Tontos", teamB: "Brotes Nuevos", scoreA: 0, scoreB: 0, state: "pendiente", hora: "19:00" },
    { id: "s1", round: 2, teamA: "Pétalos de Acero", teamB: "Winterfell Gaming", scoreA: 0, scoreB: 0, state: "pendiente", hora: "20:00" },
    { id: "s2", round: 2, teamA: null, teamB: null, scoreA: 0, scoreB: 0, state: "pendiente", hora: "20:00" },
    { id: "f1", round: 3, teamA: null, teamB: null, scoreA: 0, scoreB: 0, state: "pendiente", hora: "21:00" },
  ] as BracketMatch[],
};

export const pastTournaments = [
  { name: "Copa DALIA.EXE #2", date: "14 jun 2026", winner: "Espinas Negras", runnerUp: "Pétalos de Acero", mvp: "KataDeLaVega#SHRP", teamsCount: 8 },
  { name: "Copa DALIA.EXE #1", date: "10 may 2026", winner: "Pétalos de Acero", runnerUp: "MidOrFeed", mvp: "Dalia#FLOR", teamsCount: 6 },
  { name: "Torneo Inaugural DALIA.EXE", date: "22 mar 2026", winner: "Winterfell Gaming", runnerUp: "Full AP Tontos", mvp: "ArbolSabio#TREE", teamsCount: 4 },
];

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

export const pastWinners = [
  { prize: "Skin Legendaria", winner: "TristeVex", date: "5 jul 2026" },
  { prize: "Sudadera DALIA.EXE", winner: "LuluDelBosque", date: "28 jun 2026" },
  { prize: "3250 RP", winner: "VueltasGaren", date: "21 jun 2026" },
  { prize: "Partida de flex con Dalia", winner: "CargaBotlane", date: "14 jun 2026" },
];

// ——— Predicciones ———
export const activePrediction = {
  question: "¿Dalia gana su próxima ranked?",
  champ: "Seraphine",
  opens: true,
  poolYes: 12450,
  poolNo: 8320,
  closesIn: "Cuando empiece la partida",
};

export const predictionRanking = [
  { user: "PetaloMayor", aciertos: 34, fallos: 12 },
  { user: "TristeVex", aciertos: 31, fallos: 15 },
  { user: "LuluDelBosque", aciertos: 28, fallos: 11 },
  { user: "JunglaDiff", aciertos: 26, fallos: 18 },
  { user: "KataDeLaVega", aciertos: 25, fallos: 14 },
  { user: "FloresDelMal", aciertos: 22, fallos: 19 },
  { user: "CargaBotlane", aciertos: 20, fallos: 16 },
  { user: "ArbolSabio", aciertos: 18, fallos: 13 },
];

// ——— Puntos ———
export const pointsLeaderboard = [
  { user: "PetaloMayor", points: 48200, hours: 312 },
  { user: "LuluDelBosque", points: 44150, hours: 289 },
  { user: "TristeVex", points: 41800, hours: 301 },
  { user: "JunglaDiff", points: 38900, hours: 245 },
  { user: "FloresDelMal", points: 35600, hours: 234 },
  { user: "KataDeLaVega", points: 33400, hours: 228 },
  { user: "CargaBotlane", points: 30100, hours: 199 },
  { user: "VueltasGaren", points: 27800, hours: 187 },
  { user: "ArbolSabio", points: 24500, hours: 176 },
  { user: "0y10Yasuo", points: 21200, hours: 165 },
  { user: "AmumuSinAmigos", points: 18700, hours: 143 },
];

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

export const lfgPosts: LfgPost[] = [
  { id: "l1", user: "TristeVex#SAD", tier: "Esmeralda", role: "Mid", region: "EUW", looking: "Dúo para subir a Diamante", message: "Main Vex/Annie, juego de 19h a 23h. Busco jungla o supp con voz.", posted: "hace 2 h" },
  { id: "l2", user: "CargaBotlane#ADC", tier: "Platino", role: "ADC", region: "EUW", looking: "Soporte fijo", message: "ADC main con 200k de maestría en Jinx. Ideal supp de enganche.", posted: "hace 5 h" },
  { id: "l3", user: "AmumuSinAmigos#SAD2", tier: "Plata", role: "Jungla", region: "NA", looking: "Equipo para la Copa #4", message: "Amumu one-trick. Lloro pero gano. Necesito equipo entero.", posted: "hace 1 día" },
  { id: "l4", user: "FloresDelMal#ROSA", tier: "Platino", role: "Top", region: "LAS", looking: "Flex 5 premade", message: "Top laner agresiva, disponible fines de semana para flex.", posted: "hace 1 día" },
  { id: "l5", user: "VueltasGaren#SPIN", tier: "Plata", role: "Top", region: "LAS", looking: "Dúo tranquilo", message: "Solo quiero girar en paz y subir a Oro. Sin tóxicos.", posted: "hace 2 días" },
];

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
