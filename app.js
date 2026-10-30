(() => {
'use strict';
const NS = 'http://www.w3.org/2000/svg';
const $ = s => document.querySelector(s);
const svg = $('#scene');
const CX = 175;
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function mk(tag, attrs, parent) { const e = document.createElementNS(NS, tag); if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function plural(n, f) { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? f[0] : a >= 2 && a <= 4 && (b < 12 || b > 14) ? f[1] : f[2]; }
function daysToNY() { const n = new Date(); return Math.ceil((new Date(n.getFullYear() + 1, 0, 1) - n) / 864e5); }
function starPath(R, r, n = 5) { let d = ''; for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r : R; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(2) + ' ' + (Math.sin(a) * rr).toFixed(2); } return d + 'Z'; }

/* ---------------- CATALOG (everything is free) ---------------- */
const COLORS = {
  red: ['#ff8f95', '#d62f3a', '#7d1019'], gold: ['#fff0b0', '#e8b33c', '#8a5d10'], silver: ['#ffffff', '#c3ccd6', '#6c7684'],
  blue: ['#acd0ff', '#3a7bd5', '#173f80'], purple: ['#d9b4ff', '#8e4bd1', '#46207a'], pink: ['#ffc6df', '#f06aa8', '#9a2a62'],
  white: ['#ffffff', '#eef2f7', '#a9b4c2'], green: ['#aef2c1', '#2fa357', '#125a2a']
};
const TREECOL = {
  green: ['#57b86b', '#1d6a39', '#14502a'], fir: ['#3f8f5a', '#154a2a', '#0e3a20'], blue: ['#8cc3bd', '#3b6f79', '#2a525a'],
  mint: ['#a8ead0', '#3fa585', '#2c7a60'], silver: ['#eef2f6', '#9aa7b6', '#717d8c'], white: ['#ffffff', '#d5e1ec', '#a3b3c4'],
  gold: ['#ffe39a', '#c9952a', '#8a6418'], pink: ['#ffadd0', '#d4528c', '#a53b6c'], violet: ['#cdb0ff', '#7a4fc9', '#56389a']
};
const GCOL = {
  warm: ['#ffc864'], multi: ['#ff4f5e', '#ffd447', '#4fdc7a', '#4fb0ff', '#ff7be5'], ice: ['#bfe6ff', '#6fb6ff', '#e8f6ff'],
  retro: ['#ff5a3c', '#3fd06a', '#4f8dff', '#ffb02e', '#ff5ad0'], candy: ['#ff4f5e', '#fff4f4']
};
const CAT = {
  orn: [['ball', 'Шар'], ['stripe', 'Полосатый'], ['bell', 'Колокольчик'], ['candy', 'Леденец'], ['icicle', 'Сосулька'], ['cone', 'Шишка'],
    ['flake', 'Снежинка'], ['star', 'Звёздочка'], ['heart', 'Сердечко'], ['ginger', 'Пряник'], ['bird', 'Птичка'], ['clock', 'Часы без пяти']],
  garland: [['warm', 'Тёплая'], ['multi', 'Цветная'], ['retro', 'Ретро'], ['ice', 'Ледяная'], ['candy', 'Карамель'], ['rainbow', 'Радуга'], ['none', 'Без огней']],
  gmode: [['steady', 'Горит'], ['blink', 'Мигает'], ['chase', 'Бегущий огонь'], ['wave', 'Волна'], ['sparkle', 'Мерцание']],
  topper: [['star', 'Звезда'], ['ruby', 'Рубиновая'], ['comet', 'Комета'], ['flake', 'Снежинка'], ['heart', 'Сердце'], ['bow', 'Бант'],
    ['santa', 'Колпак'], ['antlers', 'Рожки оленя'], ['crown', 'Корона'], ['kokoshnik', 'Кокошник'], ['ushanka', 'Ушанка'], ['none', 'Ничего']],
  color: [['green', 'Зелёная'], ['fir', 'Пихта'], ['blue', 'Голубая ель'], ['mint', 'Мятная'], ['silver', 'Серебряная'], ['white', 'Белая'],
    ['gold', 'Золотая'], ['pink', 'Розовая'], ['violet', 'Лиловая']],
  snowLvl: [[0, 'Без снега'], [1, 'Иней'], [2, 'Сугробы']],
  tinsel: [['none', 'Ничего'], ['gold', 'Мишура золотая'], ['silver', 'Мишура серебряная'], ['red', 'Мишура красная'],
    ['pearl', 'Жемчужные бусы'], ['goldbeads', 'Золотые бусы'], ['chain', 'Бумажная цепь'], ['berries', 'Рябина']],
  stand: [['bucket', 'Ведёрко'], ['crate', 'Ящик'], ['skirt', 'Вязаная юбка'], ['vase', 'Золотой горшок'], ['basket', 'Корзинка'], ['drift', 'Сугроб']],
  scarf: [['none', 'Без шарфа'], ['red', 'Красный'], ['green', 'Зелёный'], ['stripes', 'Полосатый'], ['rainbow', 'Радужный']],
  glasses: [['none', 'Без очков'], ['round', 'Круглые'], ['sun', 'Тёмные'], ['hearts', 'Сердечки'], ['party', 'Звёзды']],
  nose: [['none', 'Без носа'], ['red', 'Нос оленя'], ['carrot', 'Морковка']],
  cheeks: [['pink', 'Румянец'], ['hearts', 'Сердечки'], ['none', 'Без румянца']],
  eyes: [['dark', '#1b1b2b'], ['blue', '#2a5db0'], ['green', '#2f8a4e'], ['brown', '#7a4a26']],
  lashes: [[false, 'Без ресниц'], [true, 'С ресницами']]
};
const TINSEL = { gold: ['#f2c14e', '#fff0b3'], silver: ['#cfd8e3', '#ffffff'], red: ['#e0313e', '#ff9aa2'] };
const TIERS = [{ ay: 346, by: 565, hw: 142 }, { ay: 276, by: 462, hw: 120 }, { ay: 212, by: 362, hw: 92 }, { ay: 165, by: 272, hw: 60 }];
const STRANDS = [[228, 252, 14, 0], [300, 338, 16, 1], [478, 506, 14, 0], [524, 556, 14, 1]];
const TSTRANDS = [[266, 284, 9, 1], [511, 517, 6, 0]];
const GIFTS = [{ x: 38, y: 600, w: 54, h: 42, c: '#c62d3a', r: '#f2c14e' }, { x: 94, y: 618, w: 34, h: 26, c: '#2f6fb5', r: '#f4f7fb' }, { x: 236, y: 606, w: 48, h: 38, c: '#e2a93b', r: '#c62d3a' }, { x: 290, y: 590, w: 38, h: 54, c: '#7d3fb8', r: '#dfe6ee' }];
const PLACES = [[175, 205], [150, 248], [200, 284], [140, 298], [165, 322], [212, 326], [120, 348], [234, 352], [96, 420], [254, 420], [82, 515], [128, 522], [218, 522], [270, 512], [62, 550], [140, 552], [175, 546], [210, 556], [292, 550]];
const DEF_LOOK = { color: 'green', snowLvl: 0, tinsel: 'gold', garland: 'warm', gmode: 'blink', topper: 'star', scarf: 'none', glasses: 'none', nose: 'none', cheeks: 'pink', eyes: 'dark', lashes: false, stand: 'bucket' };
const PRESETS = [
  { id: 'classic', name: 'Классика', look: {}, ot: ['ball', 'bell', 'candy'], oc: ['red', 'gold', 'silver', 'blue'] },
  { id: 'retro', name: 'Как в детстве', look: { snowLvl: 1, tinsel: 'chain', garland: 'retro', gmode: 'chase', topper: 'ruby', stand: 'crate' }, ot: ['icicle', 'cone', 'clock', 'bird', 'ball'], oc: ['silver', 'gold', 'red', 'blue'] },
  { id: 'santa', name: 'Дед Мороз', look: { snowLvl: 1, tinsel: 'red', garland: 'multi', topper: 'santa', scarf: 'red', glasses: 'round', stand: 'skirt' }, ot: ['ball', 'bell', 'candy', 'ginger'], oc: ['red', 'gold', 'white'] },
  { id: 'snegurochka', name: 'Снегурочка', look: { color: 'blue', snowLvl: 1, tinsel: 'pearl', garland: 'ice', gmode: 'sparkle', topper: 'kokoshnik', eyes: 'blue', lashes: true, stand: 'drift' }, ot: ['flake', 'ball', 'heart', 'star'], oc: ['white', 'blue', 'silver'] },
  { id: 'queen', name: 'Снежная королева', look: { color: 'silver', snowLvl: 2, tinsel: 'silver', garland: 'ice', gmode: 'wave', topper: 'flake', eyes: 'blue', lashes: true, cheeks: 'none', stand: 'drift' }, ot: ['flake', 'icicle', 'ball', 'star'], oc: ['white', 'silver', 'blue'] },
  { id: 'deer', name: 'Олень', look: { color: 'fir', tinsel: 'berries', garland: 'warm', gmode: 'steady', topper: 'antlers', nose: 'red', scarf: 'green', eyes: 'brown', stand: 'basket' }, ot: ['cone', 'ginger', 'bird', 'bell'], oc: ['gold', 'red', 'green'] },
  { id: 'snowman', name: 'Снеговик', look: { color: 'white', snowLvl: 2, tinsel: 'none', garland: 'multi', topper: 'ushanka', nose: 'carrot', scarf: 'stripes', stand: 'drift' }, ot: ['ball', 'flake', 'candy'], oc: ['red', 'blue', 'green'] },
  { id: 'candy', name: 'Сладкая', look: { color: 'pink', tinsel: 'goldbeads', garland: 'candy', gmode: 'chase', topper: 'heart', scarf: 'stripes', glasses: 'hearts', cheeks: 'hearts', lashes: true, stand: 'vase' }, ot: ['candy', 'heart', 'stripe', 'ginger'], oc: ['pink', 'red', 'white'] },
  { id: 'party', name: 'Вечеринка', look: { color: 'violet', tinsel: 'gold', garland: 'rainbow', gmode: 'chase', topper: 'crown', glasses: 'party', scarf: 'rainbow', stand: 'vase' }, ot: ['star', 'stripe', 'ball', 'heart'], oc: ['gold', 'purple', 'pink', 'blue'] },
  { id: 'golden', name: 'Золотая', look: { color: 'gold', tinsel: 'goldbeads', garland: 'warm', gmode: 'wave', topper: 'comet', stand: 'vase' }, ot: ['ball', 'star', 'bell', 'stripe'], oc: ['gold', 'white', 'red'] }
];
function presetOrn(p) { return PLACES.map(([x, y], i) => ({ t: p.ot[i % p.ot.length], c: p.oc[(i * 7 + Math.floor(i / p.ot.length)) % p.oc.length], x, y })); }
const DEFAULT_ORN = presetOrn(PRESETS[0]);

const PH = {
  idle: ['Скоро Новый год!', 'Я самая нарядная ёлка в городе!', 'Поиграем?', 'Смотри, как снег идёт…', 'Дед Мороз уже в пути!', 'Переодень меня во что-нибудь новое!', 'Пахнет мандаринами…', 'Загадай желание!', 'Интересно, что в подарках?', 'Ля-ля-ля, в лесу родилась ёлочка…'],
  tickle: ['Хи-хи! Щекотно!', 'Ай-ай, иголочки!', 'Ха-ха-ха!', 'Ой, не надо, щекотно!', 'Хи-хи-хи!'],
  star: ['Моя звёздочка!', 'Осторожно, макушку уронишь!', 'Красиво кружится?'],
  eye: ['Ай! Это мой глаз!', 'Эй, не в глаз!', 'Ой! Я всё вижу!'],
  pot: ['Бум! Это моя подставка.', 'Не пинай, там мои корни!', 'Ой, чуть не упала!'],
  pet: ['Мррр… приятно', 'Ещё погладь!', 'Как хорошо…', 'Ты лучший!'],
  annoyed: ['Ну хватит уже!', 'Я обиделась!', 'Перестань, иголки осыпятся!'],
  thirsty: ['Полей меня, пожалуйста…', 'Иголочки сохнут…', 'Пить хочу!'],
  sleepy: ['Я так хочу спать…', 'Может, выключим свет?', 'Ааах… зеваю'],
  water: ['Ах, водичка!', 'Спасибо! Буль-буль!', 'Вот это я понимаю!'],
  full: ['Я уже напилась!', 'Хватит, а то лужа будет!'],
  wake: ['Ну кто там? Я сплю…', 'Ммм… ещё пять минуток…', 'Тсс, ночь же!'],
  decor: ['Красиво!', 'Мне идёт!', 'Ещё, ещё!', 'Ой, какая красота!', 'Вот это наряд!', 'Я как с открытки!'],
  fire: ['Как тепло у камина!', 'Треск-треск, уютно!', 'Только меня близко не ставь!'],
  globe: ['Шшш… снежок в шаре!', 'Там внутри тоже ёлочка!'],
  mandarin: ['Пахнет Новым годом!', 'Мандаринки!', 'Ммм, вкусно пахнет!'],
  wreath: ['Дзинь-дзинь!', 'Это мой венок-сосед!'],
  radioOn: ['Музыка! Танцуем!', 'Ой, моя любимая песня!'],
  radioOff: ['Тишина…', 'Потанцевали — и хватит.']
};
const ROOMS = {
  kitchen: { name: 'Кухня', win: { x: 244, y: 72, w: 124, h: 164 }, winEl: 'kWin', left: null, right: 'living' },
  living: { name: 'Гостиная', win: { x: 25, y: 64, w: 112, h: 214 }, winEl: 'windowGlass', left: 'kitchen', right: 'bedroom' },
  bedroom: { name: 'Спальня', win: { x: 260, y: 78, w: 116, h: 164 }, winEl: 'bWin', left: 'living', right: null }
};
const FOODS = {
  olivier: { joy: 8, say: ['Оливье! Вот это Новый год!', 'Ммм, с горошком!'], love: true },
  cake: { joy: 6, say: ['Тортик «Наполеон»! Сладко!', 'Ещё кусочек можно?'] },
  jelly: { joy: -3, say: ['Фу, холодец! Он дрожит!', 'Нет-нет, только не холодец!'], yuck: true },
  ginger: { joy: 4, say: ['Хрум-хрум, тульский пряник!', 'Пряник — мой любимый!'] },
  mandarin: { joy: 4, water: 6, say: ['Мандаринка! Пахнет праздником!', 'Кисло-сладко, ура!'] },
  compote: { joy: 2, water: 22, say: ['Компотик! Буль-буль!', 'Вишнёвый, как я люблю!'] }
};
PH.kitchen = ['Чем-то вкусным пахнет…', 'Открой холодильник, я проголодалась!', 'Испечём пряники?', 'Кукушка скоро прокукует!', 'Хочу какао с зефиркой!'];
PH.bedroom = ['Тут так уютно…', 'Мишка уже спит, и я хочу', 'Включи ночник — будут звёзды!', 'Почитаешь мне сказку?', 'Загляни в шкаф — там наряды!'];
const SNOW = [{ n: 24, sp: .6, wind: .05, name: 'Снег почти перестал' }, { n: 70, sp: 1, wind: .3, name: 'Идёт снежок!' }, { n: 140, sp: 2.3, wind: 2.4, name: 'Ого, метель!' }];
// phones get a lighter animation budget
const LOW = matchMedia('(pointer: coarse)').matches;
if (LOW) SNOW.forEach((s, i) => { s.n = [18, 46, 90][i]; });
const vib = ms => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { } };

/* ---------------- STATE ---------------- */
const KEY = 'talking-elka-v1';
const LOOK_KEYS = Object.keys(DEF_LOOK);
function defState() {
  return { ...DEF_LOOK, water: 80, joy: 70, energy: 85, night: false, orn: DEFAULT_ORN.map(o => ({ ...o })),
    gifts: [0, 0, 0, 0], stock: [0, 0, 0], best: { catch: 0, simon: 0, memory: 0 }, snow: 1, song: 0, greeted: false, room: 'living', lamp: true, voice: 'high', t: Date.now() };
}
const validLook = (k, v) => CAT[k].some(it => it[0] === v);
let S;
function load(data) {
  let s = data && data.S ? data.S : null;
  if (!s) { try { const raw = localStorage.getItem(KEY); if (raw) s = JSON.parse(raw); } catch (e) { s = null; } }
  s = s || {};
  if (s.color === 'snowy') { s.color = 'green'; s.snowLvl = 2; }
  delete s.coins; delete s.owned;
  S = Object.assign(defState(), s);
  for (const k of LOOK_KEYS) if (!validLook(k, S[k])) S[k] = DEF_LOOK[k];
  S.best = Object.assign({ catch: 0, simon: 0, memory: 0 }, S.best);
  if (!Array.isArray(S.orn)) S.orn = DEFAULT_ORN.map(o => ({ ...o }));
  S.orn = S.orn.filter(o => CAT.orn.some(t => t[0] === o.t) && COLORS[o.c]);
  // time away counts at a third of the speed and never drops a need below 15 on its own
  const dt = clamp((Date.now() - (S.t || Date.now())) / 1000, 0, 6 * 3600) * .35;
  const soft = (v, d) => Math.max(Math.min(v, 15), v + d);
  S.water = soft(S.water, -dt / 30); S.joy = soft(S.joy, -dt / 45);
  S.energy = S.night ? clamp(S.energy + dt * 1.4, 0, 100) : soft(S.energy, -dt / 50);
  if (!ROOMS[S.room]) S.room = 'living';
  if (!['high', 'low', 'off'].includes(S.voice)) S.voice = 'high';
}
let saveH = 0;
// server copy is the source of truth; localStorage stays as offline fallback
let UID; try { UID = localStorage.getItem(KEY + ":id"); if (!UID) localStorage.setItem(KEY + ":id", UID = crypto.randomUUID()); } catch (e) { UID = crypto.randomUUID(); }
const API = "/api/state/" + UID;
function persist(beacon) {
  S.t = Date.now(); const body = JSON.stringify(S);
  try { localStorage.setItem(KEY, body); } catch (e) { }
  if (beacon) navigator.sendBeacon(API, body); else fetch(API, { method: "PUT", body }).catch(() => { });
}
function save() { clearTimeout(saveH); saveH = setTimeout(() => persist(false), 400); }

/* ---------------- AUDIO ---------------- */
let AC = null, MG = null, unlocked = false, muted = false;
function ac() {
  if (!unlocked) return null;
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); MG = AC.createGain(); MG.gain.value = .55; MG.connect(AC.destination); } catch (e) { return null; } }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(f, d = .15, type = 'sine', v = .25, at = 0, f2 = null, dest = null) {
  if (muted) return; const c = ac(); if (!c) return;
  const t = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(g); g.connect(dest || MG); o.start(t); o.stop(t + d + .05);
}
let noiseBuf = null;
function noise(d = .2, v = .2, freq = 1000, at = 0, type = 'bandpass', dest = null) {
  if (muted) return; const c = ac(); if (!c) return;
  if (!noiseBuf) { noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate); const ch = noiseBuf.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; }
  const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime + at;
  s.buffer = noiseBuf; fl.type = type; fl.frequency.value = freq;
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  s.connect(fl); fl.connect(g); g.connect(dest || MG); s.start(t, Math.random() * .5); s.stop(t + d + .05);
}
const SFX = {
  giggle() { for (let i = 0; i < 5; i++) tone(840 - i * 40 + (i % 2) * 170, .09, 'triangle', .16, i * .09, 620 - i * 30); },
  boing() { tone(170, .38, 'sine', .35, 0, 520); },
  chime() { [1568, 2093, 2637].forEach((f, i) => tone(f, .8, 'sine', .1, i * .08)); },
  jingle() { for (let i = 0; i < 7; i++) tone(2300 + Math.random() * 1800, .2, 'sine', .06, i * .05); noise(.35, .08, 7000, 0, 'highpass'); },
  pop() { tone(420, .09, 'sine', .3, 0, 980); },
  place() { tone(1760, .2, 'sine', .12); tone(2637, .3, 'sine', .06, .04); },
  poof() { noise(.4, .12, 5000, 0, 'highpass'); [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, .35, 'sine', .07, i * .05)); },
  splash() { noise(.7, .22, 1300); noise(.35, .1, 3400, .2); },
  crackle() { for (let i = 0; i < 18; i++) noise(.025, .25, 2500 + Math.random() * 2500, Math.random() * 1); noise(1, .06, 500, 0, 'lowpass'); },
  buzz() { tone(140, .35, 'sawtooth', .12, 0, 90); },
  whoosh() { noise(1, .16, 700); },
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, .3, 'triangle', .17, i * .1)); },
  lose() { [392, 330, 262].forEach((f, i) => tone(f, .32, 'triangle', .15, i * .15)); },
  sneeze() { tone(330, .3, 'triangle', .12, 0, 520); tone(380, .25, 'triangle', .12, .32, 560); noise(.3, .3, 2600, .62); tone(760, .25, 'triangle', .14, .62, 220); },
  yawn() { tone(460, 1, 'triangle', .1, 0, 230); },
  hum() { [523, 587, 659, 587, 523, 659].forEach((f, i) => tone(f, .22, 'triangle', .08, i * .22)); },
  firework() { tone(500, .6, 'sine', .05, 0, 1700); noise(.7, .35, 380, .6, 'lowpass'); for (let i = 0; i < 10; i++) noise(.03, .12, 4000, .8 + Math.random() * .6, 'highpass'); },
  purr() {
    if (muted) return; const c = ac(); if (!c) return; const t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain(), fl = c.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.value = 62; lfo.frequency.value = 24; fl.type = 'lowpass'; fl.frequency.value = 320;
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.12, t + .15); g.gain.linearRampToValueAtTime(.0001, t + 1);
    lg.gain.value = .06; lfo.connect(lg); lg.connect(g.gain); o.connect(fl); fl.connect(g); g.connect(MG);
    o.start(t); lfo.start(t); o.stop(t + 1.05); lfo.stop(t + 1.05);
  }
};
function chatter(n) { for (let i = 0; i < n; i++) { const f = rnd(380, 640); tone(f, .09, 'triangle', .1, i * .12, f * rnd(.8, 1.3)); } }

const NOTE = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
const parseSong = s => s.split(',').map(x => { const [n, d] = x.trim().split(' '); return [n, +d]; });
const SONGS = [
  { name: 'Jingle Bells', bpm: 210, bells: true, oct: 2, seq: parseSong('E4 1,E4 1,E4 2,E4 1,E4 1,E4 2,E4 1,G4 1,C4 1.5,D4 .5,E4 4,F4 1,F4 1,F4 1.5,F4 .5,F4 1,E4 1,E4 1,E4 .5,E4 .5,E4 1,D4 1,D4 1,E4 1,D4 2,G4 2,E4 1,E4 1,E4 2,E4 1,E4 1,E4 2,E4 1,G4 1,C4 1.5,D4 .5,E4 4,F4 1,F4 1,F4 1.5,F4 .5,F4 1,E4 1,E4 1,E4 .5,E4 .5,G4 1,G4 1,F4 1,D4 1,C4 4') },
  { name: 'Маленькой ёлочке', bpm: 150, oct: 2, seq: parseSong('G4 1,E4 .5,E4 .5,G4 1,E4 .5,E4 .5,G4 .5,F4 .5,E4 .5,D4 .5,C4 2,G4 1,E4 .5,E4 .5,G4 1,E4 .5,E4 .5,G4 .5,F4 .5,E4 .5,D4 .5,C4 2') },
  { name: 'We Wish You a Merry Christmas', bpm: 190, oct: 1, seq: parseSong('G4 1,C5 1,C5 .5,D5 .5,C5 .5,B4 .5,A4 1,A4 1,A4 1,D5 1,D5 .5,E5 .5,D5 .5,C5 .5,B4 1,G4 1,G4 1,E5 1,E5 .5,F5 .5,E5 .5,D5 .5,C5 1,A4 1,G4 .5,G4 .5,A4 1,D5 1,B4 1,C5 3') }
];
const LULLABY = { name: 'Колыбельная', bpm: 96, oct: 1, soft: true, seq: parseSong('E4 .5,E4 .5,G4 1.5,E4 .5,E4 .5,G4 1.5,E4 .5,G4 .5,C5 1,B4 1,A4 1,A4 1,G4 1,D4 .5,E4 .5,F4 1,D4 1,D4 .5,E4 .5,F4 1.5,D4 .5,F4 .5,B4 .5,A4 .5,G4 1,B4 1,C5 2') };
let music = null;
function playSong(song, src) {
  const c = ac(); if (!c || muted) return false;
  stopSong(); song = song || SONGS[S.song % SONGS.length];
  const beat = 60 / song.bpm, bus = c.createGain();
  bus.gain.value = 1; bus.connect(MG);
  let t = 0;
  for (const [n, d] of song.seq) {
    const f = NOTE[n] * song.oct;
    tone(f, d * beat * .95, song.soft ? 'sine' : 'triangle', song.soft ? .13 : .16, t + .05, null, bus);
    tone(f * 2, d * beat * .5, 'sine', .04, t + .05, null, bus);
    t += d * beat;
  }
  if (song.bells) for (let b = 0; b < t / beat; b++) noise(.08, .05, 8000, b * beat + .05, 'highpass', bus);
  if (!song.soft) for (let b = 0; b < t / beat; b += 2) tone(NOTE.C4 / 2 * (b % 4 ? 1.5 : 1), beat * 1.6, 'sine', .08, b * beat + .05, null, bus);
  src = src || { room: 'living', x: 46, y: 260 };
  music = { bus, song, src, start: performance.now(), beat, len: t, timer: setTimeout(() => { if (music && music.bus === bus) { music = null; bus.disconnect(); playSong(song, src); } }, t * 1000 + 300) };
  if (src.room === 'living') $('#radioDial').setAttribute('fill', '#ffd35a');
  return true;
}
function stopSong() { if (!music) return; clearTimeout(music.timer); try { music.bus.gain.value = 0; music.bus.disconnect(); } catch (e) { } music = null; $('#radioDial').setAttribute('fill', '#f3e5bf'); document.getElementById('mbox')?.classList.remove('on'); }

let voices = [];
function loadVoices() { try { voices = speechSynthesis.getVoices() || []; } catch (e) { voices = []; } }
if ('speechSynthesis' in window) { loadVoices(); try { speechSynthesis.onvoiceschanged = loadVoices; } catch (e) { } }
let talkUntil = 0;
let ttsPrimed = false;
// iOS only lets speech start from a tap, so speak a silent blank on the first touch
function primeTTS() { if (ttsPrimed || !('speechSynthesis' in window)) return; ttsPrimed = true; try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) { } }
const speakable = t => t.replace(/[«»"“”]/g, '').replace(/[—–]/g, ',').replace(/…/g, '.').trim();
function speak(text, high) {
  if (muted || !('speechSynthesis' in window) || !unlocked) return false;
  try {
    const u = new SpeechSynthesisUtterance(speakable(text));
    const v = voices.find(v => /^ru/i.test(v.lang));
    if (v) u.voice = v; u.lang = v ? v.lang : 'ru-RU';
    u.pitch = high ? 1.85 : .35; u.rate = high ? 1.05 : .85;
    u.onstart = () => { talkUntil = performance.now() + Math.max(1500, text.length * 85); };
    u.onend = u.onerror = () => { talkUntil = performance.now() + 80; };
    const go = () => { try { speechSynthesis.speak(u); } catch (e) { } };
    // Chrome drops an utterance queued right after cancel(), so give it a beat
    if (speechSynthesis.speaking || speechSynthesis.pending) { speechSynthesis.cancel(); setTimeout(go, 70); } else go();
    return true;
  } catch (e) { return false; }
}

/* ---------------- SCENE BUILD ---------------- */
const defs = $('#defs');
for (const k in COLORS) {
  const g = mk('radialGradient', { id: 'rg-' + k, cx: '.35', cy: '.3', r: '.78' }, defs);
  mk('stop', { offset: '0', 'stop-color': COLORS[k][0] }, g); mk('stop', { offset: '.55', 'stop-color': COLORS[k][1] }, g); mk('stop', { offset: '1', 'stop-color': COLORS[k][2] }, g);
}
const glowIds = {};
function glowId(col) {
  if (glowIds[col]) return glowIds[col];
  const id = 'gw' + Object.keys(glowIds).length, g = mk('radialGradient', { id }, defs);
  mk('stop', { offset: '0', 'stop-color': col, 'stop-opacity': '.9' }, g); mk('stop', { offset: '1', 'stop-color': col, 'stop-opacity': '0' }, g);
  return (glowIds[col] = id);
}
let seed = 7; const srnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const litWins = [], winStars = [];
(function buildCity() {
  const city = $('#city'), st = $('#stars');
  for (let i = 0; i < 18; i++) winStars.push(mk('circle', { cx: 27 + srnd() * 108, cy: 68 + srnd() * 70, r: .5 + srnd() * .7, fill: '#fff', opacity: .4 + srnd() * .5, class: i % 3 ? '' : 'twinkle', style: `animation-delay:${-srnd() * 2.4}s` }, st));
  const row = (fill, top0, top1, wmin, wmax, lit, x0) => {
    let x = x0;
    while (x < 140) {
      const w = wmin + srnd() * (wmax - wmin), top = top0 + srnd() * (top1 - top0);
      mk('rect', { x, y: top, width: w, height: 280 - top, fill }, city);
      if (srnd() < .3) mk('rect', { x: x + w * .2, y: top - 4, width: w * .6, height: 4, fill }, city);
      for (let wy = top + 4; wy < 258; wy += 7) for (let wx = x + 2.5; wx < x + w - 3; wx += 5)
        if (srnd() < lit) litWins.push(mk('rect', { x: wx, y: wy, width: 2.4, height: 3.2, fill: srnd() < .15 ? pick(['#ff8f8f', '#9fe6a8', '#9fc8ff']) : '#ffd98a', opacity: .55 + srnd() * .4 }, city));
      x += w + 1 + srnd() * 3;
    }
  };
  row('#1e2a55', 168, 222, 10, 18, .28, 20);
  mk('rect', { x: 86, y: 150, width: 9, height: 120, fill: '#1a2348' }, city);
  mk('path', { d: 'M84.5 152 L90.5 132 L96.5 152Z', fill: '#1a2348' }, city);
  mk('rect', { x: 88.5, y: 158, width: 4, height: 5, fill: '#ffd98a', opacity: .8 }, city);
  mk('path', { d: starPath(3.6, 1.5), transform: 'translate(90.5 129)', fill: '#ff3b3b' }, city);
  mk('circle', { cx: 90.5, cy: 129, r: 7, fill: 'url(#gRed)' }, city);
  row('#121834', 200, 246, 13, 24, .4, 16);
  mk('path', { d: 'M20 262 Q50 254 80 260 Q110 266 142 256 V282 H20Z', fill: '#dfe8f5' }, city);
  mk('path', { d: 'M20 270 Q60 264 100 270 Q125 274 142 268 V282 H20Z', fill: '#c9d6ea' }, city);
  mk('rect', { x: 44, y: 222, width: 1.6, height: 40, fill: '#0c1128' }, city);
  mk('circle', { cx: 45, cy: 222, r: 12, fill: 'url(#moonGlow)' }, city);
  mk('circle', { cx: 45, cy: 222, r: 2.4, fill: '#fff4c9' }, city);
  mk('path', { d: 'M118 262 L124 246 L130 262Z M119.5 254 L124 240 L128.5 254Z', fill: '#163d2a' }, city);
  ['#ff5c5c', '#ffd447', '#6fb6ff'].forEach((c, i) => mk('circle', { cx: 121 + i * 3, cy: 252 + (i % 2) * 5, r: .9, fill: c }, city));
})();
const flakes = [];
(function () { const g = $('#snowG'); for (let i = 0; i < 140; i++) { const r = rnd(.6, 1.9); flakes.push({ e: mk('circle', { r, fill: '#fff', opacity: rnd(.6, 1) }, g), x: rnd(22, 140), y: rnd(60, 280), v: rnd(.6, 1.3) * (r / 1.3), ph: rnd(0, 6), on: true }); } })();
(function () {
  const g = $('#wreathRing');
  for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; mk('circle', { cx: 345 + Math.cos(a) * 26, cy: 258 + Math.sin(a) * 26, r: 8.5, fill: i % 2 ? '#24633c' : '#2e7a49' }, g); }
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + .3; mk('circle', { cx: 345 + Math.cos(a) * 25, cy: 258 + Math.sin(a) * 25, r: 2.3, fill: i % 3 ? '#e0414e' : '#f2c14e' }, g); }
})();
function bulb(parent, x, y, col, gr, big) {
  const g = mk('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }, parent);
  const glow = mk('circle', { r: gr, fill: `url(#${glowId(col)})` }, g);
  if (big) mk('rect', { x: -1.8, y: -5.5, width: 3.6, height: 3, rx: .6, fill: '#3b4a3c' }, g);
  const core = big ? mk('path', { d: 'M0 -3C3 -3 3.6 1 2.4 3.6Q0 6.4 -2.4 3.6C-3.6 1 -3 -3 0 -3Z', fill: col }, g) : mk('ellipse', { rx: 2.4, ry: 3, fill: col }, g);
  mk('circle', { cx: -.7, cy: -1, r: .8, fill: '#fff', opacity: .75 }, g);
  return { g, glow, core, col, gr, i: 0 };
}
const RB = { living: [], kitchen: [], bedroom: [] }, roomBulbs = RB.living;
(function () {
  const wl = $('#wallLights'), hooks = [-120, -20, 80, 180, 280, 380, 480];
  for (let h = 0; h < hooks.length - 1; h++) {
    const x0 = hooks[h], x1 = hooks[h + 1], pts = [];
    for (let i = 0; i <= 30; i++) { const t = i / 30; pts.push([x0 + (x1 - x0) * t, 12 + 22 * Math.sin(Math.PI * t)]); }
    mk('path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L'), stroke: '#1a2a1d', 'stroke-width': 1, fill: 'none' }, wl);
    for (let i = 1; i < 6; i++) { const t = i / 6; roomBulbs.push(bulb(wl, x0 + (x1 - x0) * t, 15 + 22 * Math.sin(Math.PI * t), GCOL.multi[(h * 5 + i) % 5], 7)); }
    mk('path', { d: `M${x1 - 5} 8 q5 6 0 8 M${x1 + 5} 8 q-5 6 0 8`, fill: '#c62d3a' }, wl);
    mk('circle', { cx: x1, cy: 12, r: 3, fill: '#e0414e' }, wl);
  }
  const wn = $('#winLights');
  mk('path', { d: 'M18 74 Q81 90 144 74', stroke: '#1a2a1d', 'stroke-width': 1, fill: 'none' }, wn);
  for (let i = 1; i < 9; i++) { const t = i / 9; roomBulbs.push(bulb(wn, 18 + 126 * t, 76 + 16 * Math.sin(Math.PI * t), GCOL.multi[i % 5], 6)); }
})();
const stockEls = [];
(function () {
  const g = $('#stockings'), cols = [['#c62d3a', '#fff'], ['#2e7a49', '#fff'], ['#c62d3a', '#f2c14e']];
  [300, 336, 372].forEach((x, i) => {
    const s = mk('g', { 'data-hit': 'stock', 'data-i': i }, g);
    mk('path', { d: `M${x} 360 V368`, stroke: '#c99a5b', 'stroke-width': 1.4 }, s);
    const inner = mk('g', {}, s);
    mk('path', { d: `M${x - 8} 370 H${x + 8} V394 Q${x + 8} 406 ${x - 4} 406 H${x - 14} Q${x - 21} 406 ${x - 21} 399 Q${x - 21} 393 ${x - 13} 392 L${x - 8} 391Z`, fill: cols[i][0] }, inner);
    mk('path', { d: `M${x - 8} 382 H${x + 8} M${x - 8} 388 H${x + 8}`, stroke: cols[i][1], 'stroke-width': 1.6, opacity: .8 }, inner);
    mk('rect', { x: x - 10, y: 366, width: 20, height: 9, rx: 3, fill: '#f7f2ea' }, inner);
    stockEls.push(inner);
  });
})();
const giftEls = [];
(function () {
  const g = $('#gifts');
  GIFTS.forEach((b, i) => {
    const e = mk('g', { class: 'gift', 'data-hit': 'gift', 'data-i': i }, g);
    mk('ellipse', { cx: b.x + b.w / 2, cy: b.y + b.h + 1, rx: b.w * .6, ry: 4, fill: '#000', opacity: .25 }, e);
    mk('rect', { x: b.x, y: b.y + 7, width: b.w, height: b.h - 7, fill: b.c }, e);
    mk('rect', { x: b.x + b.w * .72, y: b.y + 7, width: b.w * .28, height: b.h - 7, fill: '#000', opacity: .14 }, e);
    mk('rect', { x: b.x + b.w / 2 - 3, y: b.y + 7, width: 6, height: b.h - 7, fill: b.r }, e);
    const lid = mk('g', { class: 'lid' }, e);
    mk('rect', { x: b.x - 3, y: b.y, width: b.w + 6, height: 10, rx: 2, fill: b.c }, lid);
    mk('rect', { x: b.x - 3, y: b.y + 7, width: b.w + 6, height: 3, fill: '#000', opacity: .15 }, lid);
    mk('rect', { x: b.x + b.w / 2 - 3, y: b.y, width: 6, height: 10, fill: b.r }, lid);
    const bow = mk('g', { class: 'bowg' }, lid), cx = b.x + b.w / 2;
    mk('path', { d: `M${cx} ${b.y} C${cx - 4} ${b.y - 12} ${cx - 17} ${b.y - 10} ${cx - 13} ${b.y - 2} C${cx - 11} ${b.y + 1} ${cx - 4} ${b.y} ${cx} ${b.y}Z M${cx} ${b.y} C${cx + 4} ${b.y - 12} ${cx + 17} ${b.y - 10} ${cx + 13} ${b.y - 2} C${cx + 11} ${b.y + 1} ${cx + 4} ${b.y} ${cx} ${b.y}Z`, fill: b.r }, bow);
    mk('circle', { cx, cy: b.y - 1, r: 3, fill: b.r, stroke: '#000', 'stroke-opacity': .15 }, bow);
    giftEls.push(e);
  });
})();
const globeFlakes = [];
(function () { const g = $('#globeFlakes'); for (let i = 0; i < 14; i++) globeFlakes.push({ e: mk('circle', { r: .8, fill: '#fff' }, g), x: 302 + rnd(-9, 9), y: 343, vx: 0, vy: 0 }); })();
$('#eyesOpen').appendChild($('#lashes'));

/* ---------------- TREE RENDER ---------------- */
function edge(y) { let m = 0; for (const t of TIERS) if (y >= t.ay && y <= t.by + 4) m = Math.max(m, t.hw * Math.min(1, (y - t.ay) / (t.by - t.ay))); return m; }
function scallops(t, dy, bump) {
  const n = Math.max(3, Math.round(t.hw * 2 / 24)), w = t.hw * 2 / n; let d = `M${CX + t.hw} ${t.by + dy}`;
  for (let i = 0; i < n; i++) { const x0 = CX + t.hw - i * w; d += ` Q${(x0 - w / 2).toFixed(1)} ${t.by + dy + bump} ${(x0 - w).toFixed(1)} ${t.by + dy}`; }
  return d;
}
function tierPath(t) {
  const h = t.by - t.ay;
  return `M${CX} ${t.ay} Q${CX + t.hw * .38} ${t.ay + h * .6} ${CX + t.hw} ${t.by}` + scallops(t, 0, 11).replace(/^M[^Q]+/, ' ') + ` Q${CX - t.hw * .38} ${t.ay + h * .6} ${CX} ${t.ay}Z`;
}
function renderTiers() {
  const g = $('#tiers'), sc = $('#snowcaps'); g.innerHTML = ''; sc.innerHTML = '';
  const c = TREECOL[S.color] || TREECOL.green;
  $('#tg1').setAttribute('stop-color', c[0]); $('#tg2').setAttribute('stop-color', c[1]);
  seed = 11;
  for (const t of TIERS) {
    const h = t.by - t.ay;
    mk('path', { d: tierPath(t), fill: 'url(#treeGrad)', stroke: c[2], 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, g);
    mk('path', { d: `M${CX - 4} ${t.ay + 10} Q${CX - t.hw * .3} ${t.ay + h * .55} ${CX - t.hw * .72} ${t.by - 4}`, stroke: '#fff', 'stroke-width': 2, opacity: .12, fill: 'none', 'stroke-linecap': 'round' }, g);
    mk('path', { d: `M${CX + 6} ${t.ay + h * .35} Q${CX + t.hw * .3} ${t.ay + h * .7} ${CX + t.hw * .5} ${t.by - 2}`, stroke: c[2], 'stroke-width': 2, opacity: .35, fill: 'none', 'stroke-linecap': 'round' }, g);
    if (S.snowLvl) {
      const heavy = S.snowLvl === 2;
      mk('path', { d: scallops(t, heavy ? -2 : -1, heavy ? 8 : 9), stroke: '#f6fbff', 'stroke-width': heavy ? 6 : 2.6, fill: 'none', 'stroke-linecap': 'round', opacity: heavy ? 1 : .85 }, sc);
      for (let i = 0; i < (heavy ? 9 : 5); i++) { const yy = t.ay + h * (.25 + srnd() * .65), ww = t.hw * (yy - t.ay) / h * .8; mk('circle', { cx: CX + (srnd() * 2 - 1) * ww, cy: yy, r: heavy ? 1.6 + srnd() * 1.6 : 1 + srnd(), fill: '#fff', opacity: .85 }, sc); }
    }
  }
  if (S.snowLvl === 2) mk('path', { d: `M${CX - 11} 187 Q${CX} 158 ${CX + 11} 187 Q${CX} 181 ${CX - 11} 187Z`, fill: '#fff' }, sc);
}
function strandPts(y1, y2, sag, flip, step) {
  const s = flip ? 1 : -1, A = { x: CX + s * (edge(y1) - 7), y: y1 }, B = { x: CX - s * (edge(y2) - 7), y: y2 };
  const n = Math.max(4, Math.round(Math.hypot(B.x - A.x, B.y - A.y) / step)), pts = [];
  for (let i = 0; i <= n; i++) { const t = i / n; pts.push({ x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t + sag * Math.sin(Math.PI * t) }); }
  return pts;
}
const P2D = pts => 'M' + pts.map(p => p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join('L');
function renderTinsel() {
  const g = $('#tinsel'); g.innerHTML = ''; const k = S.tinsel; if (k === 'none') return;
  for (const [a, b, sag, f] of TSTRANDS) {
    if (TINSEL[k]) {
      const c = TINSEL[k], d = P2D(strandPts(a, b, sag, f, 4));
      mk('path', { d, stroke: c[0], 'stroke-width': 7, fill: 'none', 'stroke-dasharray': '1.3 1.1', 'stroke-linecap': 'round', opacity: .95 }, g);
      mk('path', { d, stroke: c[1], 'stroke-width': 1.4, fill: 'none', opacity: .8 }, g);
    } else if (k === 'pearl' || k === 'goldbeads') {
      mk('path', { d: P2D(strandPts(a, b, sag, f, 4)), stroke: '#8a7a6a', 'stroke-width': .6, fill: 'none' }, g);
      strandPts(a, b, sag, f, 5.4).forEach((p, i) => mk('circle', { cx: p.x, cy: p.y, r: i % 5 === 0 ? 3.2 : 2.5, fill: k === 'pearl' ? 'url(#pearl)' : 'url(#rg-gold)' }, g));
    } else if (k === 'chain') {
      const cols = ['#e23b4a', '#f2bd4b', '#2fae66', '#3b8ee0', '#e86cc0'];
      strandPts(a, b, sag, f, 5.2).forEach((p, i) => mk('ellipse', { cx: p.x, cy: p.y, rx: i % 2 ? 1.3 : 3.8, ry: i % 2 ? 3.4 : 2.4, fill: 'none', stroke: cols[i % 5], 'stroke-width': 1.9 }, g));
    } else if (k === 'berries') {
      mk('path', { d: P2D(strandPts(a, b, sag, f, 4)), stroke: '#6b3e22', 'stroke-width': 1, fill: 'none' }, g);
      strandPts(a, b, sag, f, 9).forEach((p, i) => {
        if (i % 3 === 1) mk('path', { d: `M${p.x} ${p.y}q-5 -6 -9 -2q4 4 9 2zM${p.x} ${p.y}q5 -6 9 -2q-4 4 -9 2z`, fill: '#2f7a45' }, g);
        [[0, 0], [-2.6, 1.8], [2.6, 1.8], [0, 3.4]].forEach(([dx, dy]) => mk('circle', { cx: p.x + dx, cy: p.y + dy, r: 2.1, fill: 'url(#rg-red)' }, g));
      });
    }
  }
}
let treeBulbs = [];
function renderLights() {
  const g = $('#lights'); g.innerHTML = ''; treeBulbs = [];
  if (S.garland === 'none') return;
  let k = 0; const big = S.garland === 'retro';
  for (const [a, b, sag, f] of STRANDS) {
    mk('path', { d: P2D(strandPts(a, b, sag, f, 4)), stroke: '#173020', 'stroke-width': 1, fill: 'none', opacity: .9 }, g);
    for (const p of strandPts(a, b, sag, f, big ? 21 : 17).slice(1, -1)) {
      const pal = GCOL[S.garland] || GCOL.multi, col = S.garland === 'rainbow' ? 'hsl(0,95%,62%)' : pal[k % pal.length];
      const bl = bulb(g, p.x, p.y + 3, col, S.night ? 12 : 8, big); bl.i = k++; treeBulbs.push(bl);
    }
  }
}
function ornMarkup(t, c) {
  const C = COLORS[c] || COLORS.red, str = '<path d="M0 -17V-11" stroke="#d8c48e" stroke-width=".8"/>', cap = '<rect x="-2.6" y="-12.6" width="5.2" height="3.6" rx=".8" fill="#e5bf55"/>', hl = '<ellipse cx="-3.2" cy="-3.6" rx="2.6" ry="1.5" fill="#fff" opacity=".75" transform="rotate(-35 -3.2 -3.6)"/>';
  switch (t) {
    case 'stripe': return str + cap + `<circle r="9" fill="url(#rg-${c})"/><path d="M-8.6 -2.5Q0 -.3 8.6 -2.5L8.9 1.5Q0 3.8 -8.9 1.5Z" fill="#fff" opacity=".85"/><path d="M-7.6 4.4Q0 6.4 7.6 4.4L6.6 6.3Q0 8.1 -6.6 6.3Z" fill="${C[0]}"/>` + hl;
    case 'bell': return str + `<circle cy="-10.6" r="1.6" fill="none" stroke="#e5bf55" stroke-width="1.2"/><path d="M0 -9C-5.5 -9 -6.5 -3 -6.5 1.5C-6.5 4.5 -8 6 -9.5 7.5H9.5C8 6 6.5 4.5 6.5 1.5C6.5 -3 5.5 -9 0 -9Z" fill="url(#rg-${c})"/><circle cy="9.2" r="2.3" fill="#e5bf55"/><path d="M-3.5 -4Q-4.5 0 -4 3" stroke="#fff" stroke-width="1.2" opacity=".6" fill="none" stroke-linecap="round"/>`;
    case 'candy': return `<path d="M3 12V-5A4.5 4.5 0 0 0 -6 -5" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/><path d="M3 12V-5A4.5 4.5 0 0 0 -6 -5" fill="none" stroke="${c === 'white' || c === 'silver' ? '#d62f3a' : C[1]}" stroke-width="3.6" stroke-dasharray="2.4 2.6"/>`;
    case 'cone': return str + cap + `<path d="M0 -10C6 -10 7 -2 6 3C5 8 2 12 0 13C-2 12 -5 8 -6 3C-7 -2 -6 -10 0 -10Z" fill="url(#rg-${c})"/><path d="M-5.5 -4L0 -1L5.5 -4M-6 2L0 5L6 2M-4 8L0 10L4 8" stroke="#000" stroke-opacity=".28" stroke-width=".9" fill="none"/><ellipse cx="-2.5" cy="-5" rx="1.3" ry="3" fill="#fff" opacity=".5"/>`;
    case 'icicle': return str + cap + `<path d="M-4 -10H4L1 16L0 19L-1 16Z" fill="url(#rg-${c})"/><path d="M-1.6 -8L-.6 10" stroke="#fff" stroke-width="1" opacity=".7"/>`;
    case 'flake': { let a = ''; for (let i = 0; i < 6; i++) a += `<path transform="rotate(${i * 60})" d="M0 0V-9M0 -5.5L-2.6 -8M0 -5.5L2.6 -8"/>`; return '<path d="M0 -17V-9" stroke="#d8c48e" stroke-width=".8"/>' + `<g stroke="${C[1]}" stroke-width="1.8" stroke-linecap="round" fill="none">${a}</g><circle r="1.9" fill="${C[0]}"/>`; }
    case 'star': return '<path d="M0 -17V-9" stroke="#d8c48e" stroke-width=".8"/>' + `<path d="${starPath(10, 4.4)}" fill="url(#rg-${c})" stroke="${C[2]}" stroke-width=".7" stroke-linejoin="round"/><path d="${starPath(4, 1.8)}" fill="#fff" opacity=".45"/>`;
    case 'heart': return '<path d="M0 -17V-7" stroke="#d8c48e" stroke-width=".8"/>' + `<path d="M0 9C-12 1 -10 -8.5 -4 -8.5C-1.6 -8.5 0 -6.8 0 -5C0 -6.8 1.6 -8.5 4 -8.5C10 -8.5 12 1 0 9Z" fill="url(#rg-${c})"/><ellipse cx="-4.5" cy="-4" rx="2.2" ry="1.3" fill="#fff" opacity=".65" transform="rotate(-35 -4.5 -4)"/>`;
    case 'ginger': return '<path d="M0 -17V-12" stroke="#d8c48e" stroke-width=".8"/>' + `<g fill="#b8743a" stroke="#7a4520" stroke-width=".8"><circle cy="-7.5" r="4.5"/><path d="M-3 -4H3L4.5 -1.5L9 -1C10.5 -.8 10.5 1.6 9 1.8L4 2L5.5 10C5.8 11.6 3.6 12.2 3 10.8L0 6L-3 10.8C-3.6 12.2 -5.8 11.6 -5.5 10L-4 2L-9 1.8C-10.5 1.6 -10.5 -.8 -9 -1L-4.5 -1.5Z"/></g><g fill="#fff"><circle cx="-1.6" cy="-8.2" r=".8"/><circle cx="1.6" cy="-8.2" r=".8"/><circle cy="1.2" r=".9"/><circle cy="4.2" r=".9"/></g><path d="M-1.8 -5.8Q0 -4.6 1.8 -5.8" stroke="#fff" stroke-width=".8" fill="none"/><path d="M-2.2 -3.6L0 -2.6L2.2 -3.6V-1.4L0 -2.4L-2.2 -1.4Z" fill="${C[1]}"/>`;
    case 'bird': return `<rect x="-2" y="4" width="4" height="7" rx="1" fill="#d8c48e"/><path d="M-8 -1L-16 -6L-14.5 0L-16.5 3.5Z" fill="${C[2]}"/><path d="M-9 -2Q-4 -10 3 -7Q8 -5 9 -2L9 1Q6 6 -2 5Q-8 4 -9 -2Z" fill="url(#rg-${c})"/><path d="M-4 -2Q0 -6.5 4 -2Q0 1.5 -4 -2Z" fill="${C[0]}" opacity=".85"/><circle cx="5" cy="-4.2" r="1.1" fill="#2b1519"/><path d="M8.6 -3.4L12.6 -2.2L8.8 -.8Z" fill="#e5bf55"/>`;
    case 'clock': { let tk = ''; for (let i = 0; i < 12; i++) tk += `<path transform="rotate(${i * 30})" d="M0 -6V-7.4"/>`; return str + cap + `<circle r="9" fill="#fffaf0" stroke="${C[1]}" stroke-width="2.4"/><g stroke="#7a5a55" stroke-width=".8">${tk}</g><path d="M0 0L-3.3 -5.6M0 0L-.2 -4.4" stroke="#2b1519" stroke-width="1.1" stroke-linecap="round"/><circle r=".9" fill="#2b1519"/>`; }
    default: return str + cap + `<circle r="9" fill="url(#rg-${c})"/>` + hl;
  }
}
let ornEls = [];
function renderOrns(pop) {
  const g = $('#orns'); g.innerHTML = '';
  ornEls = S.orn.map((o, i) => {
    const el = mk('g', {}, g); el.innerHTML = ornMarkup(o.t, o.c);
    const st = { el, x: o.x, y: o.y, a: 0, v: 0, ph: rnd(0, 6), sc: pop ? 0 : 1, scv: 0, delay: pop === 'stagger' ? i * .045 : 0 };
    el.setAttribute('transform', `translate(${o.x} ${o.y}) scale(${st.sc})`);
    return st;
  });
  const cnt = document.getElementById('ornCnt'); if (cnt) cnt.textContent = S.orn.length + ' / 40';
}
function updateOrns(dt, t) {
  for (const o of ornEls) {
    const target = -ang * 1.1 + Math.sin(t * 1.3 + o.ph) * 2.2;
    o.v += ((target - o.a) * 30 - o.v * 3) * dt; o.a += o.v * dt;
    if (o.delay > 0) o.delay -= dt;
    else if (o.sc !== 1) { o.scv += ((1 - o.sc) * 220 - o.scv * 12) * dt; o.sc += o.scv * dt; if (Math.abs(1 - o.sc) < .003 && Math.abs(o.scv) < .02) { o.sc = 1; o.scv = 0; } }
    o.el.setAttribute('transform', `translate(${o.x} ${o.y}) rotate(${o.a.toFixed(1)} 0 -14) scale(${Math.max(0, o.sc).toFixed(3)})`);
  }
}
const GLOW_TOPS = ['star', 'ruby', 'comet', 'flake', 'heart'];
function topperMarkup(id) {
  switch (id) {
    case 'ruby': { let f = ''; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; f += `M0 0L${(Math.cos(a) * 17).toFixed(1)} ${(Math.sin(a) * 17).toFixed(1)}`; } return `<circle r="32" fill="url(#gRed)"/><path d="${starPath(18, 7.5)}" fill="#d81f2c" stroke="#f3c45a" stroke-width="1.8" stroke-linejoin="round"/><path d="${f}" stroke="#8e0c17" stroke-width=".9"/>`; }
    case 'comet': return `<circle r="30" fill="url(#gGold)"/><g fill="none" stroke-linecap="round"><path d="M-5 7Q-22 22 -40 46" stroke="#ffe08a" stroke-width="6" opacity=".55"/><path d="M-1 9Q-12 28 -22 54" stroke="#fff3c4" stroke-width="3.5" opacity=".5"/><path d="M-8 3Q-30 12 -50 28" stroke="#ffd35a" stroke-width="3" opacity=".45"/></g><path d="${starPath(14, 6)}" fill="url(#rg-gold)" stroke="#a8741a" stroke-width="1.1" stroke-linejoin="round"/>`;
    case 'flake': { let a = ''; for (let i = 0; i < 6; i++) a += `<path transform="rotate(${i * 60})" d="M0 0V-16M0 -10L-5 -14.5M0 -10L5 -14.5M0 -5L-3.5 -8M0 -5L3.5 -8"/>`; return `<circle r="30" fill="url(#gIce)"/><g stroke="#e9f7ff" stroke-width="2.6" stroke-linecap="round" fill="none">${a}</g><circle r="3" fill="#fff"/>`; }
    case 'heart': return `<circle r="30" fill="url(#gRed)"/><path d="M0 13C-19 1 -15 -15 -5.5 -14C-2.5 -13.8 0 -11 0 -8.5C0 -11 2.5 -13.8 5.5 -14C15 -15 19 1 0 13Z" fill="url(#rg-pink)" stroke="#9a2a62" stroke-width="1.2"/><ellipse cx="-6.5" cy="-7" rx="3" ry="2" fill="#fff" opacity=".6" transform="rotate(-30 -6.5 -7)"/>`;
    case 'star': return `<circle r="32" fill="url(#gGold)"/><path d="${starPath(18, 7.8)}" fill="url(#rg-gold)" stroke="#a8741a" stroke-width="1.2" stroke-linejoin="round"/><path d="${starPath(8, 3.5)}" fill="#fff6c8" opacity=".55"/>`;
    default: return '';
  }
}
function hatMarkup(id) {
  switch (id) {
    case 'bow': return `<g transform="translate(${CX} 162)"><path d="M-2 2L-10 18L-5.5 16.5L-3.5 21Z M2 2L10 18L5.5 16.5L3.5 21Z" fill="#a8222e"/><path d="M0 0C-6 -12 -22 -13 -20 -2C-19 6 -7 5 0 0Z M0 0C6 -12 22 -13 20 -2C19 6 7 5 0 0Z" fill="#d62f3a"/><path d="M-4 -2C-9 -8 -16 -8 -16 -3" stroke="#ff8f95" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle r="4.5" fill="#e0414e"/></g>`;
    case 'santa': return `<path d="M154 190Q158 150 184 134Q206 124 216 150Q206 144 197 150Q188 162 197 190Z" fill="#d62f3a"/><path d="M184 134Q206 124 216 150Q206 144 197 150Z" fill="#a8222e" opacity=".6"/><path d="M163 186Q166 160 182 146" stroke="#ff8f95" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/><rect x="150" y="183" width="50" height="14" rx="7" fill="#f7f2ea"/><path d="M155 190h40" stroke="#d9cfc2" stroke-width="2" stroke-dasharray="2 3"/><circle cx="216" cy="152" r="7.5" fill="#f7f2ea"/><circle cx="213.5" cy="149.5" r="2.6" fill="#fff"/>`;
    case 'antlers': return `<g stroke="#8a5a3b" stroke-width="5" stroke-linecap="round" fill="none"><path d="M167 184Q158 160 142 138"/><path d="M155 160Q146 158 138 150"/><path d="M149 150Q150 140 156 132"/><path d="M183 184Q192 160 208 138"/><path d="M195 160Q204 158 212 150"/><path d="M201 150Q200 140 194 132"/></g><g stroke="#b98a62" stroke-width="1.5" stroke-linecap="round" fill="none"><path d="M165 180Q158 162 145 143"/><path d="M185 180Q192 162 205 143"/></g><path d="M175 186q-9 -8 -15 -2q7 5 15 2zM175 186q9 -8 15 -2q-7 5 -15 2z" fill="#2f7a45"/><circle cx="172" cy="186" r="2.6" fill="#e0414e"/><circle cx="178" cy="186" r="2.6" fill="#e0414e"/><circle cx="175" cy="182" r="2.6" fill="#e0414e"/>`;
    case 'crown': return `<path d="M153 194L150 160L163 174L175 148L187 174L200 160L197 194Z" fill="url(#rg-gold)" stroke="#a8741a" stroke-width="1.4" stroke-linejoin="round"/><rect x="152" y="184" width="46" height="10" rx="2" fill="#e8b33c" stroke="#a8741a"/><circle cx="163" cy="189" r="3" fill="#e23b4a"/><circle cx="175" cy="189" r="3.4" fill="#3a7bd5"/><circle cx="187" cy="189" r="3" fill="#e23b4a"/><g fill="#fffaf0"><circle cx="150" cy="159" r="3.2"/><circle cx="175" cy="147" r="3.6"/><circle cx="200" cy="159" r="3.2"/></g>`;
    case 'kokoshnik': { let p = ''; [[149, 186], [149, 174], [151, 162], [156, 151], [164, 142], [175, 136], [186, 142], [194, 151], [199, 162], [201, 174], [201, 186]].forEach(([x, y]) => p += `<circle cx="${x}" cy="${y}" r="2.2"/>`); let a = ''; for (let i = 0; i < 6; i++) a += `<path transform="rotate(${i * 60})" d="M0 0V-9M0 -5.5L-2.6 -8M0 -5.5L2.6 -8"/>`;
      return `<path d="M148 196Q146 146 175 132Q204 146 202 196Z" fill="#3a7bd5" stroke="#dfe9f5" stroke-width="2.5"/><path d="M156 194Q155 154 175 143Q195 154 194 194Z" fill="#2a5db0"/><g fill="#fff">${p}</g><g transform="translate(175 170)" stroke="#fff" stroke-width="1.8" stroke-linecap="round" fill="none">${a}</g><rect x="145" y="190" width="60" height="8" rx="4" fill="#dfe9f5"/><g fill="#fff">${[153, 161, 169, 177, 185, 193].map(x => `<circle cx="${x}" cy="202" r="1.8"/>`).join('')}</g>`; }
    case 'ushanka': return `<path d="M148 184Q150 196 146 214Q152 222 160 214Q162 200 160 188Z" fill="#a47c57"/><path d="M202 184Q200 196 204 214Q198 222 190 214Q188 200 190 188Z" fill="#a47c57"/><path d="M154 186Q154 154 175 150Q196 154 196 186Z" fill="#6b4a33"/><path d="M160 180Q162 160 175 156" stroke="#86613f" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="149" y="176" width="52" height="16" rx="8" fill="#a47c57"/><path d="M152 184H198" stroke="#c9a27d" stroke-width="5" stroke-dasharray="1.2 2.4" stroke-linecap="round"/><path d="${starPath(5.4, 2.2)}" transform="translate(175 183)" fill="#e23b3b" stroke="#ffd35a" stroke-width=".9"/>`;
    default: return '';
  }
}
function renderTopper() {
  const glow = GLOW_TOPS.includes(S.topper);
  $('#topper').innerHTML = glow ? `<g transform="translate(${CX} 152)">${topperMarkup(S.topper)}</g>` : '';
  $('#hat').innerHTML = glow ? '' : hatMarkup(S.topper);
}
function renderScarf() {
  const g = $('#scarf'); g.innerHTML = ''; if (S.scarf === 'none') return;
  const base = { red: ['#d62f3a', '#a3202b'], green: ['#2f9a57', '#1f6b3b'], stripes: ['#d62f3a', '#a3202b'], rainbow: ['#ff4f5e', '#b8303c'] }[S.scarf];
  const band = 'M58 452Q175 478 292 452L294 468Q175 496 56 468Z', tail = 'M228 470L254 468L262 538L236 544Z', mid = 'M57 460Q175 487 293 460';
  let h = `<path d="${tail}" fill="${base[1]}"/><path d="${band}" fill="${base[0]}"/>`;
  if (S.scarf === 'stripes') h += `<path d="${mid}" stroke="#fff" stroke-width="14" stroke-dasharray="11 11" fill="none"/><path d="M231 492L257 490M233 514L259 512" stroke="#fff" stroke-width="6"/>`;
  if (S.scarf === 'rainbow') { ['#ff4f5e', '#ffb02e', '#ffe14d', '#4fdc7a', '#4fb0ff', '#9b59d6'].forEach((c, i) => h += `<path d="${mid}" stroke="${c}" stroke-width="14" stroke-dasharray="10 50" stroke-dashoffset="${-i * 10}" fill="none"/>`); h += `<path d="M231 492L257 490" stroke="#ffe14d" stroke-width="6"/><path d="M233 514L259 512" stroke="#4fb0ff" stroke-width="6"/>`; }
  h += `<path d="${band}" fill="url(#knit)"/><path d="${tail}" fill="url(#knit)"/><path d="M238 544V554M243 543V553M248 542V552M253 541V551M258 540V550" stroke="${base[1]}" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="241" cy="471" rx="11" ry="8" fill="${base[1]}"/><path d="M60 455Q175 481 290 455" stroke="#fff" stroke-width="1.4" opacity=".25" fill="none"/>`;
  g.innerHTML = h;
}
function eyeRing(cx, side) {
  return [200, 225, 250].map(a => { const r = a * Math.PI / 180, x = cx + side * 13 * Math.cos(r), y = 388 + 16 * Math.sin(r), dx = x - cx, dy = y - 388, d = Math.hypot(dx, dy); return `M${x.toFixed(1)} ${y.toFixed(1)}L${(x + dx / d * 5.5).toFixed(1)} ${(y + dy / d * 5.5).toFixed(1)}`; }).join('');
}
function renderFace() {
  const ch = $('#cheeks');
  ch.innerHTML = S.cheeks === 'pink' ? '<ellipse cx="148" cy="414" rx="9" ry="6" fill="#ff7a8a" opacity=".45"/><ellipse cx="202" cy="414" rx="9" ry="6" fill="#ff7a8a" opacity=".45"/>'
    : S.cheeks === 'hearts' ? [146, 204].map(x => `<path transform="translate(${x} 414) scale(.75)" d="M0 6C-9 0 -7.5 -7 -3 -7C-1.2 -7 0 -5.6 0 -4.2C0 -5.6 1.2 -7 3 -7C7.5 -7 9 0 0 6Z" fill="#ff6f8f" opacity=".85"/>`).join('') : '';
  const iris = (CAT.eyes.find(e => e[0] === S.eyes) || CAT.eyes[0])[1];
  document.querySelectorAll('#face .iris').forEach(e => e.setAttribute('fill', iris));
  $('#lashes').setAttribute('d', S.lashes ? eyeRing(152, 1) + eyeRing(198, -1) : '');
  $('#nose').innerHTML = S.nose === 'red' ? '<circle cx="175" cy="407" r="7" fill="url(#rg-red)"/><circle cx="172.5" cy="404.5" r="2" fill="#fff" opacity=".8"/>'
    : S.nose === 'carrot' ? '<path d="M171 401L200 409L171 413Q167 407 171 401Z" fill="#f28a1c"/><path d="M178 404L177 410M185 405.5L184 410.5M192 407L191 410" stroke="#c4650d" stroke-width="1"/>' : '';
  const L = 152, R = 198, Y = 388;
  const gl = {
    round: `<g fill="rgba(200,230,255,.16)" stroke="#2b1519" stroke-width="2.6"><circle cx="${L}" cy="${Y}" r="18"/><circle cx="${R}" cy="${Y}" r="18"/></g><path d="M170 385Q175 380 180 385M134 384L122 378M216 384L228 378" stroke="#2b1519" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M142 380L148 374M188 380L194 374" stroke="#fff" stroke-width="2" opacity=".7" stroke-linecap="round"/>`,
    sun: `<path d="M134 377H170Q172 397 160 403H146Q132 399 134 377ZM180 377H216Q218 399 204 403H190Q178 397 180 377Z" fill="#1b1b2b" stroke="#2b1519" stroke-width="2"/><path d="M170 381Q175 377 180 381M134 379L122 374M216 379L228 374" stroke="#2b1519" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M140 384L150 380M186 384L196 380" stroke="#fff" stroke-width="2.4" opacity=".45" stroke-linecap="round"/>`,
    hearts: [L, R].map(x => `<path d="M${x} 405C${x - 23} 392 ${x - 20} 370 ${x - 8} 370C${x - 4} 370 ${x} 374 ${x} 378C${x} 374 ${x + 4} 370 ${x + 8} 370C${x + 20} 370 ${x + 23} 392 ${x} 405Z" fill="rgba(255,90,140,.38)" stroke="#e0315e" stroke-width="2.4"/>`).join('') + '<path d="M170 383Q175 379 180 383" stroke="#e0315e" stroke-width="2.4" fill="none"/>',
    party: [L, R].map(x => `<path transform="translate(${x} ${Y + 1})" d="${starPath(22, 12)}" fill="rgba(255,210,80,.3)" stroke="#f2bd4b" stroke-width="2.4" stroke-linejoin="round"/>`).join('') + '<path d="M168 386Q175 381 182 386" stroke="#f2bd4b" stroke-width="2.4" fill="none"/>'
  };
  $('#glasses').innerHTML = gl[S.glasses] || '';
}
function standMarkup(id) {
  switch (id) {
    case 'crate': return '<rect x="132" y="590" width="86" height="56" rx="3" fill="#a0693d" stroke="#6b4226" stroke-width="2"/><path d="M133 608H217M133 627H217" stroke="#6b4226" stroke-width="2"/><path d="M136 592L214 644" stroke="#8a5631" stroke-width="5" opacity=".6"/><g fill="#4a2c18"><circle cx="138" cy="596" r="1.4"/><circle cx="212" cy="596" r="1.4"/><circle cx="138" cy="640" r="1.4"/><circle cx="212" cy="640" r="1.4"/></g>';
    case 'skirt': { let s = ''; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, x = 175 + Math.cos(a) * 66, y = 622 + Math.sin(a) * 14; s += `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(.45)" d="${starPath(7, 2.6, 6)}" fill="#fff"/>`; }
      return `<ellipse cx="175" cy="622" rx="98" ry="23" fill="#c62d3a"/><ellipse cx="175" cy="622" rx="98" ry="23" fill="url(#knit)"/><ellipse cx="175" cy="622" rx="95" ry="21" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray=".1 7" stroke-linecap="round"/>${s}<ellipse cx="175" cy="613" rx="18" ry="5" fill="#3a1a12"/>`; }
    case 'vase': return `<path d="M134 594H216Q224 618 206 646H144Q126 618 134 594Z" fill="url(#rg-gold)" stroke="#a8741a" stroke-width="1.4"/><rect x="128" y="588" width="94" height="10" rx="5" fill="#e8b33c" stroke="#a8741a"/><g fill="#fff7d6" opacity=".9">${[150, 175, 200].map(x => `<path transform="translate(${x} 620)" d="${starPath(5, 2)}"/>`).join('')}</g><path d="M140 604Q138 622 148 640" stroke="#fff" stroke-width="2.5" opacity=".35" fill="none" stroke-linecap="round"/>`;
    case 'basket': return '<path d="M132 596H218L210 646H140Z" fill="#c9954f"/><path d="M134 606H216M136 616H214M137 626H213M138 636H212" stroke="#8a5f2c" stroke-width="2"/><path d="M146 598V644M160 598V646M175 598V646M190 598V646M204 598V644" stroke="#e1b06c" stroke-width="2" stroke-dasharray="5 5"/><rect x="128" y="590" width="94" height="9" rx="4.5" fill="#a8743a"/><path d="M175 604q-9 -9 -14 -2q6 6 14 2zM175 604q9 -9 14 -2q-6 6 -14 2z" fill="#d62f3a"/><circle cx="175" cy="604" r="2.6" fill="#a8222e"/>';
    case 'drift': return `<path d="M98 650Q106 612 138 606Q158 588 180 598Q206 588 224 608Q252 612 256 650Z" fill="#f4f8ff"/><path d="M102 650Q130 634 175 638Q220 634 252 650Z" fill="#c9d6ea"/><path d="M128 618Q150 606 170 610" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#fff" class="twinkle">${[[132, 626], [204, 620], [168, 632]].map(([x, y]) => `<path transform="translate(${x} ${y})" d="${starPath(3.2, 1, 4)}"/>`).join('')}</g>`;
    default: return '<path d="M131 596H219L211 648H139Z" fill="#b8262f"/><path d="M131 596H219L217 608H133Z" fill="#9c1f27"/><rect x="126" y="589" width="98" height="11" rx="3" fill="#e2ae45"/><rect x="135" y="622" width="80" height="6" fill="#e2ae45"/><circle cx="175" cy="625" r="6" fill="#fff3df"/><path d="M175 620v10M170 625h10M171.5 621.5l7 7M178.5 621.5l-7 7" stroke="#c62d3a" stroke-width="1.1"/>';
  }
}
function renderStand() { $('#stand').innerHTML = standMarkup(S.stand); }
function renderTree(pop) { renderTiers(); renderTinsel(); renderOrns(pop); renderLights(); renderTopper(); renderScarf(); renderFace(); renderStand(); }

/* ---------------- KITCHEN ---------------- */
defs.insertAdjacentHTML('beforeend', `
  <pattern id="kWall" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#e3b866"/><circle cx="6" cy="6" r="1.6" fill="#fff" opacity=".35"/><circle cx="19" cy="19" r="1.6" fill="#fff" opacity=".35"/></pattern>
  <pattern id="gzhel" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#f4f7fb"/><rect x=".5" y=".5" width="27" height="27" fill="none" stroke="#c8d4e6"/><g fill="#2f5fa8"><circle cx="14" cy="14" r="2.6"/><ellipse cx="14" cy="8.5" rx="1.6" ry="3"/><ellipse cx="14" cy="19.5" rx="1.6" ry="3"/><ellipse cx="8.5" cy="14" rx="3" ry="1.6"/><ellipse cx="19.5" cy="14" rx="3" ry="1.6"/></g><g fill="#2f5fa8" opacity=".5"><circle cx="2" cy="2" r="1.4"/><circle cx="26" cy="2" r="1.4"/><circle cx="2" cy="26" r="1.4"/><circle cx="26" cy="26" r="1.4"/></g></pattern>
  <pattern id="checker" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#efe2c8"/><rect width="20" height="20" fill="#b9553f"/><rect x="20" y="20" width="20" height="20" fill="#b9553f"/></pattern>
  <pattern id="ging" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#fff"/><rect width="5" height="10" fill="#e05a5a" opacity=".55"/><rect width="10" height="5" fill="#e05a5a" opacity=".55"/></pattern>
  <linearGradient id="chrome" x1="0" x2="1"><stop offset="0" stop-color="#8d96a3"/><stop offset=".5" stop-color="#f4f7fb"/><stop offset="1" stop-color="#7d8693"/></linearGradient>
  <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2a5e"/><stop offset="1" stop-color="#6d7fbf"/></linearGradient>
  <clipPath id="kWinClip"><rect x="244" y="72" width="124" height="164"/></clipPath>`);
function foodMarkup(id) {
  switch (id) {
    case 'olivier': return '<path d="M-12 0H12Q11 10 0 11Q-11 10 -12 0Z" fill="#f4f7fb" stroke="#2f5fa8" stroke-width="1.4"/><path d="M-9 4Q0 8 9 4" stroke="#2f5fa8" fill="none"/><path d="M-10 0Q-8 -9 0 -9Q8 -9 10 0Z" fill="#f3e3b0"/><g fill="#5fb54a"><circle cx="-4" cy="-4" r="1.6"/><circle cx="3" cy="-6" r="1.6"/><circle cx="6" cy="-2" r="1.5"/></g><g fill="#f08a1c"><rect x="-1" y="-3" width="2.6" height="2.6"/><rect x="-7" y="-1.5" width="2.4" height="2.4"/></g>';
    case 'cake': return '<rect x="-11" y="-6" width="22" height="14" rx="2" fill="#e8c48a"/><path d="M-11 -2H11M-11 2H11M-11 6H11" stroke="#fff7e6" stroke-width="1.6"/><rect x="-11" y="-9" width="22" height="4" rx="2" fill="#fff7e6"/><circle cx="5" cy="-11" r="2.6" fill="#d62f3a"/>';
    case 'jelly': return '<ellipse cy="8" rx="13" ry="3" fill="#f4f7fb" stroke="#b9cbe0"/><g class="wobble"><path d="M-10 8Q-11 -8 0 -9Q11 -8 10 8Z" fill="#e9c27a" opacity=".85"/><g fill="#c97a4a" opacity=".7"><circle cx="-4" cy="0" r="1.6"/><circle cx="3" cy="-3" r="1.4"/><circle cx="4" cy="4" r="1.2"/></g><path d="M-6 -4Q-5 -7 -2 -7" stroke="#fff" stroke-width="1.4" opacity=".7" fill="none" stroke-linecap="round"/></g>';
    case 'ginger': return '<rect x="-12" y="-9" width="24" height="18" rx="3" fill="#a86a32" stroke="#7a4520"/><rect x="-9" y="-6" width="18" height="12" rx="2" fill="none" stroke="#e8c48a" stroke-width="1.2"/><path d="M0 -4L3 0L0 4L-3 0Z" fill="#e8c48a"/>';
    case 'mandarin': return '<circle cx="-4" cy="2" r="7" fill="#f08a1c"/><circle cx="5" cy="3" r="6.4" fill="#f59a26"/><path d="M5 -3q3 -5 7 -3q-3 4 -7 3z" fill="#3c8d45"/><circle cx="-6" cy="-1" r="1.5" fill="#fff" opacity=".5"/>';
    case 'compote': return '<rect x="-8" y="-9" width="16" height="20" rx="4" fill="#c62d3a" opacity=".85"/><rect x="-8" y="-9" width="16" height="20" rx="4" fill="none" stroke="#dfe9f5" stroke-width="1.6"/><rect x="-9" y="-12" width="18" height="4" rx="1.5" fill="#d9a63a"/><g fill="#7a1020"><circle cx="-3" cy="3" r="2"/><circle cx="3" cy="6" r="2"/><circle cx="2" cy="-2" r="1.8"/></g>';
    case 'cocoa': return '<path d="M-9 -6H8V6Q8 11 -1 11Q-9 11 -9 6Z" fill="#fff" stroke="#c62d3a" stroke-width="1.4"/><path d="M8 -2Q14 -2 13 3Q12 7 7 6" fill="none" stroke="#c62d3a" stroke-width="2"/><ellipse cx="-.5" cy="-6" rx="8.5" ry="2.4" fill="#7a4520"/><rect x="-5" y="-9" width="5" height="4" rx="1.5" fill="#fff4f8"/><rect x="0" y="-10" width="5" height="4" rx="1.5" fill="#ffd0e0"/>';
    default: return '';
  }
}
const FOOD_ORDER = ['olivier', 'cake', 'jelly', 'ginger', 'mandarin', 'compote'];
(function buildKitchen() {
  let cab = ''; for (let x = -194; x < 600; x += 70) cab += `<rect x="${x}" y="458" width="60" height="66" rx="5" fill="none" stroke="#2c5687" stroke-width="2"/><circle cx="${x + 52}" cy="491" r="3" fill="#f2c14e"/>`;
  let rug = ''; [['#6b8fc7', 176, 40], ['#efe2c8', 162, 35], ['#c62d3a', 146, 31], ['#f2c14e', 128, 26], ['#4f9a5c', 108, 21], ['#efe2c8', 84, 15], ['#c62d3a', 58, 9]].forEach(([c, rx, ry]) => rug += `<ellipse cx="175" cy="632" rx="${rx}" ry="${ry}" fill="${c}"/>`);
  let ticks = ''; for (let i = 0; i < 12; i++) ticks += `<path transform="rotate(${i * 30} 50 130)" d="M50 112V115"/>`;
  const shelves = [368, 404, 440, 476, 512].map(y => `<path d="M10 ${y}H70" stroke="#b9cbe0" stroke-width="2.5"/>`).join('');
  const foods = FOOD_ORDER.map((f, i) => `<g data-hit="food" data-f="${f}" transform="translate(28 ${352 + i * 36})">${foodMarkup(f)}</g>`).join('');
  $('#room-kitchen').innerHTML = `
  <rect x="-800" y="-1000" width="2000" height="1300" fill="url(#kWall)"/>
  <rect x="-800" y="300" width="2000" height="138" fill="url(#gzhel)"/>
  <rect x="-800" y="296" width="2000" height="6" fill="#c99a5b"/>
  <rect x="-800" y="436" width="2000" height="14" fill="#b07a45"/><rect x="-800" y="436" width="2000" height="4" fill="#cf9a62"/>
  <rect x="-800" y="450" width="2000" height="82" fill="#3a6ea5"/>${cab}
  <rect x="-800" y="531" width="2000" height="900" fill="url(#checker)"/><rect x="-800" y="531" width="2000" height="24" fill="#000" opacity=".16"/>
  ${rug}<ellipse cx="175" cy="632" rx="170" ry="37" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 4" opacity=".7"/>
  <g data-hit="cuckoo" transform="translate(7 26) scale(.86)">
    <path d="M36 162V194M64 162V182" stroke="#3a2416"/><ellipse cx="36" cy="203" rx="5" ry="9" fill="#7a4b2e"/><ellipse cx="64" cy="191" rx="5" ry="9" fill="#7a4b2e"/>
    <g class="pend" style="transform-origin:50px 160px"><path d="M50 160V206" stroke="#7a4b2e" stroke-width="2"/><circle cx="50" cy="210" r="7" fill="#e2ae45" stroke="#a8741a"/></g>
    <path d="M8 92L50 54L92 92Z" fill="#6b3e22"/><path d="M14 90L50 60L86 90" fill="none" stroke="#a8743a" stroke-width="3" stroke-linejoin="round"/>
    <g id="cuckooBird" class="cuckoo" style="opacity:0"><ellipse cx="50" cy="100" rx="7" ry="5" fill="#f2c14e"/><circle cx="55" cy="97" r="3.4" fill="#f2c14e"/><path d="M58 97l5 1-5 1.6z" fill="#e2702a"/><circle cx="56" cy="96" r=".8" fill="#2b1519"/><path d="M44 99l-5-3 1 5z" fill="#d49a2a"/></g>
    <rect x="16" y="88" width="68" height="74" rx="3" fill="#8a5a3b"/><path d="M16 162q17 -10 34 0q17 -10 34 0" fill="none" stroke="#5c3a22" stroke-width="3"/>
    <rect x="42" y="91" width="16" height="13" rx="2" fill="#5c3a22"/>
    <circle cx="50" cy="130" r="20" fill="#fff7e6" stroke="#5c3a22" stroke-width="2"/><g stroke="#5c3a22" stroke-width="1.4">${ticks}</g>
    <line id="kkH" x1="50" y1="130" x2="50" y2="120" stroke="#2b1519" stroke-width="2.2" stroke-linecap="round"/><line id="kkM" x1="50" y1="130" x2="50" y2="115" stroke="#2b1519" stroke-width="1.4" stroke-linecap="round"/>
  </g>
  <g data-hit="fridge" id="fridge">
    <rect x="4" y="236" width="72" height="324" rx="18" fill="#f4f1ea" stroke="#cfc7b9" stroke-width="2"/>
    <rect x="62" y="252" width="6" height="40" rx="3" fill="url(#chrome)"/>
    <text x="34" y="300" text-anchor="middle" font-family="Rubik, sans-serif" font-size="11" font-weight="800" font-style="italic" fill="#c9a24a">ЗИЛ</text>
    <rect x="8" y="318" width="64" height="236" rx="8" fill="#eaf4ff"/><rect x="8" y="318" width="64" height="12" rx="6" fill="#fffbe6"/>${shelves}${foods}
    <g class="fdoor"><rect x="4" y="316" width="72" height="244" rx="16" fill="#f4f1ea" stroke="#cfc7b9" stroke-width="2"/><rect x="62" y="330" width="6" height="56" rx="3" fill="url(#chrome)"/>
      <g transform="rotate(-5 30 372)"><rect x="14" y="350" width="32" height="40" fill="#fffaf1" stroke="#e0d6c4"/><path d="M30 356L40 382H20Z" fill="#2f8a4e"/><circle cx="30" cy="356" r="2" fill="#f2bd4b"/><circle cx="26" cy="372" r="1.6" fill="#e23b4a"/><circle cx="34" cy="377" r="1.6" fill="#3b8ee0"/></g>
      <circle cx="30" cy="348" r="3.4" fill="#e23b4a"/><path d="${starPath(6, 2.6)}" transform="translate(24 420)" fill="#f2bd4b"/><path d="M40 452C33 447 34 441 37.5 441C39 441 40 442 40 443.5C40 442 41 441 42.5 441C46 441 47 447 40 452Z" fill="#ff6f8f"/>
      <rect x="14" y="470" width="30" height="22" fill="#fff" transform="rotate(4 29 481)"/><path d="M17 478h22M17 483h18M17 488h20" stroke="#9fb3c4" stroke-width="1.2" transform="rotate(4 29 481)"/></g>
    <rect x="10" y="558" width="10" height="6" rx="2" fill="#7a7a7a"/><rect x="60" y="558" width="10" height="6" rx="2" fill="#7a7a7a"/>
  </g>
  <g transform="translate(0 14)">
  <rect x="236" y="64" width="140" height="180" rx="4" fill="#f4ede0"/>
  <g id="kWin" data-hit="window" clip-path="url(#kWinClip)">
    <rect x="244" y="72" width="124" height="164" fill="url(#dusk)"/>
    <g fill="#fff"><circle cx="262" cy="98" r=".9"/><circle cx="290" cy="86" r=".7"/><circle cx="340" cy="94" r="1"/><circle cx="356" cy="120" r=".7"/><circle cx="318" cy="110" r=".8"/></g>
    <g class="slotA"></g>
    <path d="M244 192Q280 176 312 188Q340 198 368 182V236H244Z" fill="#dfe8f5"/>
    <g fill="#1f4f36"><path d="M252 196L259 176L266 196Z"/><path d="M266 192L272 178L278 192Z"/><path d="M350 190L357 168L364 190Z"/></g>
    <g fill="#fff"><path d="M255 186L259 176L263 186Q259 183 255 186Z"/><path d="M353 178L357 168L361 178Q357 175 353 178Z"/></g>
    <rect x="288" y="182" width="32" height="22" fill="#8a5a3b"/><path d="M284 184L304 168L324 184Z" fill="#f4f8ff"/><rect x="298" y="188" width="10" height="9" fill="#ffd98a"/><rect x="314" y="166" width="5" height="12" fill="#6b3e22"/>
    <g stroke="#8a6a50" stroke-width="2"><path d="M246 212H368"/><path d="M252 204V220M264 204V220M276 204V220M288 204V220M300 204V220"/></g>
    <path d="M244 214Q300 206 368 216V236H244Z" fill="#f4f8ff"/>
    <g data-hit="snowman"><circle cx="336" cy="220" r="12" fill="#fff"/><circle cx="336" cy="202" r="9" fill="#fff"/><circle cx="336" cy="189" r="6.5" fill="#fff"/>
      <path d="M330 184h12l-2 -8h-8z" fill="#3a7bd5"/><path d="M336 189l7 2-7 1.4z" fill="#f08a1c"/><circle cx="333.5" cy="187.5" r=".9" fill="#2b1519"/><circle cx="338.5" cy="187.5" r=".9" fill="#2b1519"/>
      <path d="M329 196h14v3h-14z" fill="#d62f3a"/><path d="M340 198l3 9" stroke="#d62f3a" stroke-width="3"/>
      <path id="snowArm" d="M327 200L316 192" stroke="#6b3e22" stroke-width="1.6" stroke-linecap="round"/><path d="M345 200L355 194" stroke="#6b3e22" stroke-width="1.6" stroke-linecap="round"/></g>
    <g class="slotB"></g>
    <path d="M244 72l20 0q-12 6 -20 22z M368 72l-18 0q10 6 18 20z M244 236l0 -16q8 9 22 16z M368 236l0 -16q-8 9 -22 16z" fill="#fff" opacity=".25"/>
  </g>
  <rect x="304" y="72" width="4" height="164" fill="#f4ede0"/><rect x="244" y="152" width="124" height="4" fill="#f4ede0"/>
  <path d="M232 60H380V84Q368 92 356 84Q344 92 332 84Q320 92 308 84Q296 92 284 84Q272 92 260 84Q248 92 236 84Z" fill="url(#ging)" stroke="#d24a4a"/>
  <rect x="228" y="242" width="156" height="10" rx="2" fill="#e7d6b8"/>
  <g data-hit="teapot"><path d="M354 240Q350 224 364 222Q378 224 374 240Z" fill="#f4f7fb" stroke="#2f5fa8" stroke-width="1.2"/><path d="M356 230Q348 226 346 220" stroke="#f4f7fb" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M360 232q4 -4 8 0q-4 4 -8 0z" fill="#2f5fa8"/><circle cx="364" cy="221" r="2" fill="#2f5fa8"/></g>
  </g>
  <g transform="translate(0 18)"><rect x="290" y="286" width="106" height="6" rx="2" fill="#8a5a3b"/>
  <g data-hit="jam">${[['#c62d3a', 302], ['#f08a1c', 326], ['#7d3fb8', 350]].map(([c, x]) => `<rect x="${x - 9}" y="262" width="18" height="24" rx="4" fill="${c}" opacity=".9"/><rect x="${x - 10}" y="256" width="20" height="7" rx="2" fill="url(#ging)" stroke="#d24a4a" stroke-width=".8"/><rect x="${x - 6}" y="270" width="12" height="8" rx="1" fill="#fffaf1"/>`).join('')}</g></g>
  <g id="stove" transform="translate(-8 0)">
    <rect x="298" y="380" width="106" height="180" rx="6" fill="#ece7dd" stroke="#c9c2b5" stroke-width="2"/>
    <rect x="294" y="372" width="114" height="10" rx="3" fill="#d8d2c6"/>
    <ellipse cx="324" cy="373" rx="15" ry="3.2" fill="#3a3a3a"/><ellipse cx="376" cy="373" rx="15" ry="3.2" fill="#3a3a3a"/>
    ${[312, 328, 344, 360, 376, 392].map(x => `<circle cx="${x}" cy="396" r="4.2" fill="#3a3a3a"/><path d="M${x} 392.5v3" stroke="#fff" stroke-width="1.2"/>`).join('')}
    <g data-hit="oven"><rect x="306" y="412" width="90" height="122" rx="7" fill="#dcd5c8" stroke="#b9b2a5" stroke-width="1.6"/><rect x="314" y="420" width="74" height="6" rx="3" fill="url(#chrome)"/>
      <rect x="320" y="436" width="62" height="52" rx="6" fill="#2a1a14"/><rect id="ovenGlow" x="320" y="436" width="62" height="52" rx="6" fill="#ff8a3d" opacity="0"/>
      <g id="ovenTray" opacity="0"><path d="M324 478H378" stroke="#9a9a9a" stroke-width="2"/>${[334, 351, 368].map(x => `<rect x="${x - 6}" y="466" width="12" height="10" rx="2" fill="#a86a32"/><path d="M${x - 3} 471h6" stroke="#e8c48a"/>`).join('')}</g>
      <path d="M324 440h20" stroke="#fff" stroke-width="2" opacity=".25" stroke-linecap="round"/></g>
    <rect x="306" y="540" width="90" height="14" rx="3" fill="#d8d2c6"/>
    <g data-hit="kettle" id="kettle"><path d="M338 360Q350 354 352 344" stroke="#d62f3a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M309 370Q306 346 324 344Q342 346 339 370Z" fill="#d62f3a"/>
      <g fill="#fff"><circle cx="316" cy="360" r="2"/><circle cx="326" cy="353" r="2"/><circle cx="332" cy="364" r="2"/><circle cx="320" cy="367" r="1.6"/></g>
      <path d="M312 348Q324 328 336 348" stroke="#3a2416" stroke-width="3" fill="none"/><circle cx="324" cy="342" r="3" fill="#3a2416"/></g>
    <g data-hit="soup"><rect x="360" y="352" width="34" height="20" rx="3" fill="#3a7bd5"/><rect x="356" y="348" width="42" height="6" rx="3" fill="#2a5db0"/><circle cx="377" cy="345" r="2.6" fill="#2a5db0"/><g fill="#fff"><circle cx="368" cy="362" r="2"/><circle cx="378" cy="364" r="2"/><circle cx="388" cy="360" r="2"/></g></g>
  </g>`;
  $('#glow-kitchen').innerHTML = `<circle id="kLampGlow" cx="175" cy="96" r="96" fill="url(#warmGlow)" opacity=".35"/><ellipse id="ovenLight" cx="343" cy="462" rx="70" ry="50" fill="url(#warmGlow)" opacity="0"/>
    <path id="kFlame" d="M304 377q3 -7 6 0q3 -7 6 0q3 -7 6 0q3 -7 6 0" fill="#5aa8ff" opacity="0"/><g id="kWinLights"></g>`;
  const wl = $('#kWinLights'); mk('path', { d: 'M236 102 Q306 114 376 102', stroke: '#1a2a1d', 'stroke-width': 1, fill: 'none' }, wl);
  for (let i = 1; i < 8; i++) { const t = i / 8; RB.kitchen.push(bulb(wl, 236 + 140 * t, 104 + 12 * Math.sin(Math.PI * t), GCOL.multi[i % 5], 6)); }
})();

/* ---------------- BEDROOM ---------------- */
defs.insertAdjacentHTML('beforeend', `
  <pattern id="bWall" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="36" height="36" fill="#2b3a66"/><path transform="translate(9 9)" d="${starPath(2.6, 1.1)}" fill="#f2d48a" opacity=".55"/><path d="M28 22a5 5 0 1 0 3 8a4 4 0 1 1 -3 -8z" fill="#f2d48a" opacity=".35"/></pattern>
  <pattern id="planksB" width="96" height="36" patternUnits="userSpaceOnUse"><rect width="96" height="36" fill="#a0724c"/><rect width="96" height="5" fill="#b0835a" opacity=".6"/><rect y="18" width="96" height="5" fill="#b0835a" opacity=".6"/><rect y="17" width="96" height="1.3" fill="#6e4a2c"/><rect y="35" width="96" height="1.3" fill="#6e4a2c"/><rect x="40" width="1.3" height="18" fill="#6e4a2c"/><rect x="80" y="18" width="1.3" height="18" fill="#6e4a2c"/></pattern>
  <pattern id="quilt" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#c62d3a"/><rect x="14" width="14" height="14" fill="#f2c14e"/><rect y="14" width="14" height="14" fill="#3a7bd5"/><rect x="14" y="14" width="14" height="14" fill="#2f8a4e"/><path d="M0 14H28M14 0V28" stroke="#fff" stroke-width=".8" stroke-dasharray="2 2" opacity=".8"/><circle cx="7" cy="7" r="2" fill="#fff" opacity=".5"/><circle cx="21" cy="21" r="2" fill="#fff" opacity=".5"/></pattern>
  <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060b24"/><stop offset="1" stop-color="#22306a"/></linearGradient>
  <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5dffb0" stop-opacity="0"/><stop offset=".5" stop-color="#5dffb0" stop-opacity=".55"/><stop offset="1" stop-color="#7ab8ff" stop-opacity="0"/></linearGradient>
  <clipPath id="bWinClip"><rect x="260" y="78" width="116" height="164"/></clipPath>`);
const projStars = [];
(function buildBedroom() {
  seed = 21;
  let stars = ''; for (let i = 0; i < 26; i++) stars += `<circle cx="${(262 + srnd() * 112).toFixed(1)}" cy="${(80 + srnd() * 110).toFixed(1)}" r="${(.5 + srnd() * .9).toFixed(2)}" fill="#fff" class="${i % 3 ? '' : 'twinkle'}" style="animation-delay:${(-srnd() * 2.4).toFixed(2)}s"/>`;
  let panels = ''; for (let x = -196; x < 600; x += 96) panels += `<rect x="${x}" y="450" width="80" height="66" rx="3"/>`;
  $('#room-bedroom').innerHTML = `
  <rect x="-800" y="-1000" width="2000" height="1530" fill="url(#bWall)"/>
  <rect x="-800" y="436" width="2000" height="94" fill="#23305a"/><g fill="none" stroke="#33427a" stroke-width="2">${panels}</g>
  <rect x="-800" y="432" width="2000" height="7" fill="#e9e4da"/><rect x="-800" y="522" width="2000" height="10" fill="#1b2547"/>
  <rect x="-800" y="531" width="2000" height="900" fill="url(#planksB)"/><rect x="-800" y="531" width="2000" height="26" fill="#000" opacity=".16"/>
  <ellipse cx="175" cy="632" rx="178" ry="42" fill="#efe4d4"/><ellipse cx="175" cy="632" rx="178" ry="42" fill="none" stroke="#efe4d4" stroke-width="12" stroke-dasharray=".1 13" stroke-linecap="round"/>
  <ellipse cx="175" cy="632" rx="124" ry="27" fill="#f3b8c6" opacity=".55"/>${[[110, 628], [175, 620], [240, 630], [150, 642], [205, 644]].map(([x, y]) => `<path transform="translate(${x} ${y}) scale(1 .5)" d="${starPath(7, 3)}" fill="#fff" opacity=".8"/>`).join('')}
  <g transform="translate(0 14)">
  <rect x="244" y="62" width="148" height="196" rx="4" fill="#e9e4da"/>
  <g id="bWin" data-hit="bwindow" clip-path="url(#bWinClip)">
    <rect x="260" y="78" width="116" height="164" fill="url(#nsky)"/>${stars}
    <path class="twinkle" d="M260 132Q292 108 318 126Q346 144 376 116V150Q346 172 318 152Q292 136 260 160Z" fill="url(#aurora)" style="animation-duration:5s"/>
    <circle cx="346" cy="112" r="26" fill="url(#moonGlow)"/><path d="M350 97a16 16 0 1 0 8 27a13 13 0 1 1 -8 -27z" fill="#fdf3c8"/>
    <g class="slotA"></g>
    <path d="M260 242V212h14l8-10 8 10h10v-14h10v14h12l10-12 10 12h16v-8h8v8h10V242Z" fill="#141b3a"/>
    <path d="M274 212l8-10 8 10M320 212l10-12 10 12" stroke="#f4f8ff" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
    <g fill="#ffd98a" opacity=".85"><rect x="266" y="220" width="4" height="5"/><rect x="296" y="216" width="4" height="5"/><rect x="326" y="222" width="4" height="5"/><rect x="352" y="226" width="4" height="5"/></g>
    <g class="slotB"></g>
    <path d="M260 78l18 0q-11 6 -18 20z M376 78l-17 0q10 6 17 19z M260 242l0 -15q8 9 21 15z M376 242l0 -15q-8 9 -21 15z" fill="#fff" opacity=".22"/>
  </g>
  <rect x="316" y="78" width="4" height="164" fill="#e9e4da"/><rect x="260" y="158" width="116" height="4" fill="#e9e4da"/>
  <rect x="238" y="56" width="160" height="6" rx="3" fill="#c99a5b"/>
  <path d="M238 60H262Q262 150 270 214Q258 222 262 290H238Z" fill="#3f5296"/><path d="M398 60H374Q374 150 366 214Q378 222 374 290H398Z" fill="#3f5296"/>
  <g fill="#f2d48a" opacity=".7">${[[248, 90], [252, 140], [246, 190], [388, 100], [384, 150], [390, 200], [250, 250], [386, 250]].map(([x, y]) => `<path transform="translate(${x} ${y})" d="${starPath(3, 1.3)}"/>`).join('')}</g>
  <rect x="254" y="208" width="22" height="7" rx="3.5" fill="#d9a94e"/><rect x="360" y="208" width="22" height="7" rx="3.5" fill="#d9a94e"/>
  </g>
  <rect x="-4" y="176" width="136" height="7" rx="2" fill="#8a5a3b"/><path d="M14 183l6 10M110 183l-6 10" stroke="#6b3e22" stroke-width="3"/>
  <g data-hit="teddy" id="teddy"><ellipse cx="30" cy="164" rx="11" ry="12" fill="#a8743a"/><circle cx="23" cy="139" r="3.8" fill="#a8743a"/><circle cx="37" cy="139" r="3.8" fill="#a8743a"/><circle cx="30" cy="147" r="9" fill="#b98448"/>
    <ellipse cx="30" cy="150" rx="4.2" ry="3.2" fill="#e8c48a"/><circle cx="30" cy="148.6" r="1.4" fill="#2b1519"/><circle cx="26.5" cy="145" r="1.1" fill="#2b1519"/><circle cx="33.5" cy="145" r="1.1" fill="#2b1519"/>
    <ellipse cx="20" cy="170" rx="4" ry="5" fill="#9a6a34"/><ellipse cx="40" cy="170" rx="4" ry="5" fill="#9a6a34"/><path d="M26 156l4 2 4-2v3l-4-1-4 1z" fill="#d62f3a"/></g>
  <g data-hit="musicbox" id="mbox"><rect x="56" y="160" width="30" height="16" rx="2" fill="#c62d3a" stroke="#f2c14e" stroke-width="1.4"/><path d="M60 168h22" stroke="#f2c14e" stroke-width="1"/>
    <g class="mlid"><rect x="54" y="154" width="34" height="7" rx="2" fill="#a8222e" stroke="#f2c14e" stroke-width="1.2"/></g><path d="M86 166h4v4" stroke="#d9a63a" stroke-width="1.6" fill="none"/></g>
  <g data-hit="lamp" id="nlamp"><rect x="108" y="160" width="8" height="16" rx="2" fill="#f4ecdb"/><path d="M97 162Q97 144 112 144Q127 144 127 162Z" fill="#d62f3a"/><g fill="#fff"><circle cx="105" cy="154" r="2"/><circle cx="114" cy="149" r="2.4"/><circle cx="121" cy="157" r="1.8"/></g></g>
  <g data-hit="wardrobe" id="wardrobe">
    <rect x="-4" y="200" width="88" height="12" rx="2" fill="#6b3e22"/><rect x="0" y="210" width="80" height="350" fill="#7a4b2e"/>
    <rect x="4" y="216" width="72" height="332" fill="#3a2416"/><path d="M6 236H74" stroke="#c9a27d" stroke-width="2"/>
    <path d="M17 236v6M12 244h10V330l-2 6M12 244V330l2 6" stroke="#d62f3a" stroke-width="8" fill="none"/><path d="M12 334v8M17 334v8M22 334v8" stroke="#d62f3a" stroke-width="1.6"/>
    <path d="M36 236v5M28 270L36 242L44 270Z" fill="#d62f3a" stroke="#9a1a24"/><rect x="27" y="266" width="18" height="6" rx="3" fill="#fff"/><circle cx="36" cy="242" r="3" fill="#fff"/>
    <path d="M58 236v5M48 246h20l4 12-6 2v50H52v-50l-6-2z" fill="#2f8a4e"/><path d="M52 270h14M52 280h14" stroke="#fff" stroke-width="2" stroke-dasharray="3 2"/>
    <path d="M6 470H74" stroke="#c9a27d" stroke-width="2"/><rect x="10" y="452" width="28" height="9" rx="2" fill="#3a7bd5"/><rect x="12" y="443" width="24" height="9" rx="2" fill="#f2c14e"/><rect x="44" y="450" width="26" height="11" rx="2" fill="#c62d3a"/>
    <g class="wdoor a"><rect x="4" y="216" width="36" height="332" fill="#8a5a3b" stroke="#6b3e22" stroke-width="1.5"/><rect x="10" y="232" width="24" height="120" rx="3" fill="none" stroke="#6b3e22" stroke-width="2"/><rect x="10" y="368" width="24" height="164" rx="3" fill="none" stroke="#6b3e22" stroke-width="2"/><circle cx="35" cy="380" r="2.6" fill="#f2c14e"/></g>
    <g class="wdoor b"><rect x="40" y="216" width="36" height="332" fill="#8a5a3b" stroke="#6b3e22" stroke-width="1.5"/><rect x="46" y="232" width="24" height="120" rx="3" fill="none" stroke="#6b3e22" stroke-width="2"/><rect x="46" y="368" width="24" height="164" rx="3" fill="none" stroke="#6b3e22" stroke-width="2"/><circle cx="45" cy="380" r="2.6" fill="#f2c14e"/></g>
    <rect x="4" y="556" width="10" height="8" fill="#5c3a22"/><rect x="66" y="556" width="10" height="8" fill="#5c3a22"/>
  </g>
  <g data-hit="bed" id="bed" transform="translate(-22 0)">
    <ellipse cx="350" cy="604" rx="70" ry="7" fill="#000" opacity=".2"/>
    <path d="M388 604V396Q404 372 420 396V604Z" fill="#8a5a3b"/><path d="M394 410Q404 394 414 410V590" stroke="#6b3e22" stroke-width="2" fill="none"/>
    <rect x="296" y="484" width="104" height="30" rx="8" fill="#f7f2ea"/>
    <rect x="344" y="464" width="48" height="26" rx="11" fill="#fff" stroke="#d9cfe6"/><path d="M350 477h36" stroke="#9fb3e0" stroke-width="2"/>
    <path d="M292 494H404V562Q348 570 292 562Z" fill="url(#quilt)"/><path d="M292 494H404" stroke="#fff" stroke-width="3"/>
    <path d="M286 604V482Q293 466 300 482V604Z" fill="#8a5a3b"/>
  </g>
  <g data-hit="slippers" id="slippers">${[306, 336].map(x => `<ellipse cx="${x + 10}" cy="624" rx="12" ry="6" fill="#f6a6c1"/><ellipse cx="${x + 13}" cy="622" rx="6" ry="3.4" fill="#fff"/><path d="M${x + 2} 620q-3 -12 2 -12q3 0 3 11M${x + 7} 619q0 -12 5 -11q3 1 -1 11" fill="#f6a6c1" stroke="#e07a9c" stroke-width=".8"/>`).join('')}</g>`;
  let ps = ''; for (let i = 0; i < 34; i++) { const x = -60 + srnd() * 520, y = -60 + srnd() * 480; ps += `<path transform="translate(${x.toFixed(0)} ${y.toFixed(0)})" d="${starPath(3 + srnd() * 3, 1.3)}" fill="#ffe9a8" opacity="${(.4 + srnd() * .6).toFixed(2)}"/>`; }
  $('#glow-bedroom').innerHTML = `<g id="projStars" opacity="0">${ps}</g><circle id="nlampGlow" cx="112" cy="156" r="70" fill="url(#warmGlow)" opacity=".4"/><g id="bLights"></g>`;
  const bl = $('#bLights'), hooks = [-140, -20, 100, 220, 340, 460];
  for (let h = 0; h < hooks.length - 1; h++) {
    const x0 = hooks[h], x1 = hooks[h + 1];
    mk('path', { d: `M${x0} 10 Q${(x0 + x1) / 2} 46 ${x1} 10`, stroke: '#1a2a1d', 'stroke-width': 1, fill: 'none' }, bl);
    for (let i = 1; i < 6; i++) { const t = i / 6; RB.bedroom.push(bulb(bl, x0 + (x1 - x0) * t, 12 + 18 * Math.sin(Math.PI * t), '#ffc864', 7)); }
  }
})();

/* ---------------- FACE & MOTION ---------------- */
const MOUTH = {
  smile: ['M161 421 Q175 435 189 421', 0], happy: ['M160 418 Q175 446 190 418 Q175 424 160 418Z', 1], laugh: ['M157 414 Q175 456 193 414 Q175 420 157 414Z', 1],
  open: ['M165 419 Q175 440 185 419 Q175 413 165 419Z', 1], small: ['M167 423 Q175 429 183 423', 0], sad: ['M163 432 Q175 420 187 432', 0],
  o: ['M169 426 a6 7 0 1 0 12 0 a6 7 0 1 0 -12 0', 1], yawn: ['M166 424 a9 11 0 1 0 18 0 a9 11 0 1 0 -18 0', 1], flat: ['M167 426 Q175 428 183 426', 0], angry: ['M164 431 Q175 424 186 431', 0]
};
const EYEL = { closed: 'M140 390 Q152 398 164 390 M186 390 Q198 398 210 390', squint: 'M140 393 Q152 380 164 393 M186 393 Q198 380 210 393' };
const BROW = { sad: 'M140 372 L162 365 M210 372 L188 365', angry: 'M140 365 L163 374 M210 365 L187 374', up: 'M141 364 Q152 357 163 364 M187 364 Q198 357 209 364' };
const EXPR = { smile: { m: 'smile' }, happy: { m: 'happy' }, laugh: { m: 'laugh', e: 'squint' }, sad: { m: 'sad', b: 'sad' }, o: { m: 'o', b: 'up' }, sleep: { m: 'flat', e: 'closed' }, angry: { m: 'angry', b: 'angry' }, sleepy: { m: 'flat', half: true }, listen: { m: 'small', b: 'up' }, yawn: { m: 'yawn', e: 'closed' }, sneeze: { m: 'o', e: 'squint', b: 'up' } };
let exprTemp = null, exprUntil = 0, curExpr = '', curMouth = '', wakeUntil = 0, nextBlink = 0, blinkEnd = 0;
let room = 'living', hopT = -1;
let lookP = null, lookUntil = 0, ang = 0, angV = 0, sq = 0, sqV = 0, topPh = 0, topSpin = 0, lastAct = performance.now();
const mouthEl = $('#mouth'), eyesOpen = $('#eyesOpen'), eyeLines = $('#eyeLines'), browsEl = $('#brows');
function face(name, ms = 1500) { exprTemp = name; exprUntil = performance.now() + ms; }
function isSleeping(now) { return S.night && now > wakeUntil; }
function baseExpr(now) {
  if (isSleeping(now)) return 'sleep';
  if (S.water < 25) return 'sad';
  if (S.energy < 18) return 'sleepy';
  if (S.joy > 80) return 'happy';
  return 'smile';
}
function setMouth(k) {
  if (curMouth === k) return; curMouth = k; const [d, f] = MOUTH[k];
  mouthEl.setAttribute('d', d); mouthEl.setAttribute('fill', f ? '#5a1a22' : 'none'); mouthEl.setAttribute('stroke-width', f ? 2 : 3);
}
function updateFace(now, t) {
  const name = exprTemp && now < exprUntil ? exprTemp : baseExpr(now), ex = EXPR[name] || EXPR.smile;
  if (curExpr !== name) { curExpr = name; eyesOpen.style.display = ex.e ? 'none' : ''; eyeLines.setAttribute('d', ex.e ? EYEL[ex.e] : ''); browsEl.setAttribute('d', ex.b ? BROW[ex.b] : ''); }
  if (now < talkUntil) setMouth(Math.floor(now / 110) % 2 && Math.random() > .2 ? 'open' : 'small'); else setMouth(ex.m);
  if (now > nextBlink) { blinkEnd = now + 130; nextBlink = now + rnd(2200, 5200); }
  let sy = now < blinkEnd ? .12 : 1;
  if (ex.half) sy = Math.min(sy, .45 + .08 * Math.sin(t * 2));
  eyesOpen.setAttribute('transform', `translate(0 388) scale(1 ${sy}) translate(0 -388)`);
  let tx, ty;
  if (lookP && now < lookUntil) { tx = lookP.x; ty = lookP.y; } else { tx = CX + Math.sin(t * .45) * 120; ty = 380 + Math.cos(t * .31) * 60; }
  [[$('#pupL'), 152], [$('#pupR'), 198]].forEach(([el, ex0]) => {
    const dx = tx - ex0, dy = ty - 390, d = Math.hypot(dx, dy) || 1, m = Math.min(4.6, d / 18);
    el.setAttribute('transform', `translate(${(dx / d * m).toFixed(2)} ${(dy / d * m * 1.1).toFixed(2)})`);
  });
}
function impulse(a, s = 0) { angV += a; sqV += s; }
function updateTree(dt, t, now) {
  let target = 0;
  if (music) target = (music.song.soft ? 1.4 : 3.2) * Math.sin((now - music.start) / 1000 / music.beat * Math.PI);
  let hopY = 0;
  if (hopT >= 0) { hopT += dt; const k = Math.min(1, hopT / .5); hopY = -48 * Math.sin(Math.PI * k); if (k >= 1) { hopT = -1; sqV -= 2.6; } }
  $('#tree').setAttribute('transform', hopY ? `translate(0 ${hopY.toFixed(1)})` : '');
  angV += (-(ang - target) * 70 - angV * 7) * dt; ang += angV * dt;
  sqV += (-sq * 160 - sqV * 11) * dt; sq += sqV * dt;
  const br = .006 * Math.sin(t * 1.7) + (music ? .012 * Math.abs(Math.sin((now - music.start) / 1000 / music.beat * Math.PI)) : 0);
  const droop = S.water < 25 ? .015 : 0;
  const tr = `rotate(${ang.toFixed(2)} ${CX} 594) translate(${CX} 594) scale(${(1 - sq * .5 - br * .4 + droop).toFixed(4)} ${(1 + sq + br - droop).toFixed(4)}) translate(${-CX} -594)`;
  $('#treeT').setAttribute('transform', tr); $('#treeGlow').setAttribute('transform', (hopY ? `translate(0 ${hopY.toFixed(1)}) ` : '') + tr);
  if (topSpin > .3) { topPh += topSpin * dt; topSpin *= Math.pow(.3, dt); }
  else { const tgt = Math.round(topPh / (Math.PI * 2)) * Math.PI * 2; topPh += (tgt - topPh) * Math.min(1, dt * 5); }
  $('#topper').setAttribute('transform', `translate(${CX} 152) scale(${Math.cos(topPh).toFixed(3)} 1) translate(${-CX} -152)`);
}

/* lights */
let wallMode = 0;
function lightsTick(t) {
  const night = S.night, mode = S.gmode;
  for (const b of treeBulbs) {
    let br = 1;
    if (mode === 'blink') br = ((Math.floor(t / .7) + b.i) % 2) ? 1 : .12;
    else if (mode === 'chase') br = (((b.i - Math.floor(t * 9)) % 5) + 5) % 5 < 2 ? 1 : .12;
    else if (mode === 'wave') br = .55 + .45 * Math.sin(t * 3.2 - b.i * .55);
    else if (mode === 'sparkle') br = .3 + .7 * Math.max(0, Math.sin(t * 4.3 + b.i * 2.7) * Math.sin(t * 1.7 + b.i * 1.3));
    if (S.garland === 'rainbow') {
      const h = Math.round(((b.i * 28 + t * 90) % 360) / 30) * 30, col = `hsl(${h},95%,62%)`;
      if (b.col !== col) { b.col = col; b.core.setAttribute('fill', col); b.glow.setAttribute('fill', `url(#${glowId(col)})`); }
    }
    b.glow.setAttribute('opacity', (br * (night ? 1 : .8)).toFixed(2));
    b.core.setAttribute('fill-opacity', (.35 + .65 * br).toFixed(2));
  }
  RB[room].forEach((b, i) => {
    const br = wallMode === 0 ? .6 + .4 * Math.sin(t * 2 + i * 1.7) : wallMode === 1 ? 1 : ((((i - Math.floor(t * 7)) % 3) + 3) % 3 === 0 ? 1 : .15);
    b.glow.setAttribute('opacity', (br * (night ? 1 : .7)).toFixed(2));
    b.core.setAttribute('fill-opacity', (.4 + .6 * br).toFixed(2));
  });
  $('#fireGlow').setAttribute('opacity', ((night ? .75 : .28) + .08 * Math.sin(t * 9) + .05 * Math.sin(t * 23)).toFixed(2));
  if (Math.random() < .06 && litWins.length) pick(litWins).setAttribute('opacity', Math.random() < .3 ? '.05' : (.6 + Math.random() * .4).toFixed(2));
}
function setGlowSizes() { treeBulbs.forEach(b => b.glow.setAttribute('r', S.night ? 12 : 8)); }

/* window snow, sleigh, snow globe */
const sleigh = { on: false, x: 0, next: performance.now() + rnd(12000, 25000) };
function updateSnow(dt, t) {
  const L = SNOW[S.snow] || SNOW[1], W = ROOMS[room].win, x0 = W.x - 4, x1 = W.x + W.w + 4;
  flakes.forEach((f, i) => {
    if (i >= L.n) { if (f.on) { f.e.setAttribute('visibility', 'hidden'); f.on = false; } return; }
    if (!f.on) { f.e.setAttribute('visibility', 'visible'); f.on = true; }
    f.y += f.v * L.sp * dt * 32; f.x += (Math.sin(t * 1.4 + f.ph) * .35 + L.wind * f.v) * dt * 30;
    if (f.y > W.y + W.h + 4) { f.y = W.y - 4; f.x = rnd(x0, x1); } if (f.x > x1) f.x = x0; if (f.x < x0) f.x = x1;
    f.e.setAttribute('cx', f.x.toFixed(1)); f.e.setAttribute('cy', f.y.toFixed(1));
  });
}
function updateSleigh(dt, t, now) {
  const el = $('#sleigh'), W = ROOMS[room].win;
  if (!sleigh.on && now > sleigh.next && !S.night) { sleigh.on = true; sleigh.x = W.x + W.w + 12; el.setAttribute('visibility', 'visible'); }
  if (sleigh.on) {
    sleigh.x -= dt * 17;
    const y = W.y + W.h * .22 + Math.sin(t * 2) * 4;
    el.setAttribute('transform', `translate(${sleigh.x.toFixed(1)} ${y.toFixed(1)})`);
    if (Math.random() < dt * 14) spawnP('dot', sleigh.x + 44, y + rnd(-2, 4), { parent: '#winFx', c: '#ffe7a0', r: rnd(.5, 1.1), vx: rnd(4, 12), vy: rnd(-4, 8), life: 1 });
    if (sleigh.x < W.x - 50) { sleigh.on = false; el.setAttribute('visibility', 'hidden'); sleigh.next = now + rnd(30000, 55000); }
  }
}
function updateGlobe(dt) {
  for (const f of globeFlakes) {
    if (f.vx === 0 && f.vy === 0 && f.y >= 343) continue;
    f.vy += 9 * dt; f.vx *= Math.pow(.2, dt); f.vy *= Math.pow(.5, dt); f.x += f.vx * dt; f.y += f.vy * dt;
    const dx = f.x - 302, dy = f.y - 330, d = Math.hypot(dx, dy);
    if (d > 11) { f.x = 302 + dx / d * 11; f.y = 330 + dy / d * 11; f.vx *= -.5; }
    if (f.y >= 343 && Math.abs(f.vy) < 4) { f.y = 343; f.vx = 0; f.vy = 0; }
    f.e.setAttribute('cx', f.x.toFixed(1)); f.e.setAttribute('cy', f.y.toFixed(1));
  }
}

/* ---------------- PARTICLES ---------------- */
const parts = [];
const CONF = ['#ff4f5e', '#ffd447', '#4fdc7a', '#4fb0ff', '#ff7be5', '#ffffff'];
function spawnP(kind, x, y, o = {}) {
  const g = $(o.parent || '#fx'); let e;
  if (kind === 'heart') e = mk('path', { d: 'M0 4C-7 -1 -6 -7 -2.4 -7C-1 -7 0 -6 0 -4.6C0 -6 1 -7 2.4 -7C6 -7 7 -1 0 4Z', fill: o.c || '#ff5c86' }, g);
  else if (kind === 'spark' || kind === 'glint') e = mk('path', { d: starPath(o.r || 5, (o.r || 5) * .3, 4), fill: o.c || '#ffe58a' }, g);
  else if (kind === 'note') { e = mk('text', { 'font-size': 18, fill: '#ffe9b0', 'text-anchor': 'middle', 'font-family': 'serif' }, g); e.textContent = pick(['♪', '♫']); }
  else if (kind === 'z') { e = mk('text', { 'font-size': o.s || 16, fill: '#d7defe', 'font-family': 'Pangolin, cursive' }, g); e.textContent = 'z'; }
  else if (kind === 'drop') e = mk('ellipse', { rx: 1.7, ry: 3.2, fill: '#8fd0ff' }, g);
  else if (kind === 'needle') e = mk('rect', { x: -3.5, y: -.7, width: 7, height: 1.4, rx: .7, fill: TREECOL[S.color][1] }, g);
  else if (kind === 'conf') e = mk('rect', { x: -2, y: -3.5, width: 4, height: 7, rx: .8, fill: o.c || pick(CONF) }, g);
  else if (kind === 'ring') e = mk('circle', { r: 2, fill: 'none', stroke: o.c || '#fff', 'stroke-width': o.w || 2 }, g);
  else if (kind === 'candy') e = mk('path', { d: 'M1.5 6V-2.5A2.3 2.3 0 0 0 -3 -2.5', fill: 'none', stroke: '#e23b4a', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g);
  else e = mk('circle', { r: o.r || 1.6, fill: o.c || '#fff' }, g);
  const life = o.life ?? 1.4;
  const p = { e, kind, x, y, vx: o.vx ?? rnd(-20, 20), vy: o.vy ?? rnd(-60, -30), g: o.g ?? 0, drag: o.drag ?? 0, life, max: life, rot: o.rot ?? rnd(-30, 30), vr: o.vr ?? 0, floor: o.floor ?? 9999, grow: o.grow || 0, onEnd: o.onEnd, flutter: kind === 'conf' ? rnd(2, 5) : 0 };
  parts.push(p); return p;
}
function updateParts(dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.vy += p.g * dt; if (p.drag) { const k = Math.pow(1 - p.drag, dt * 60); p.vx *= k; p.vy *= k; }
    p.x += (p.vx + (p.flutter ? Math.sin(p.life * p.flutter * 3) * 30 : 0)) * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.life -= dt;
    if (p.y > p.floor) p.life = Math.min(p.life, .05);
    if (p.life <= 0) { p.e.remove(); parts.splice(i, 1); if (p.onEnd) p.onEnd(p); continue; }
    const k = 1 - p.life / p.max;
    if (p.kind === 'ring') { p.e.setAttribute('r', (2 + p.grow * Math.sqrt(k)).toFixed(1)); p.e.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`); p.e.setAttribute('opacity', (1 - k).toFixed(2)); continue; }
    const sc = p.kind === 'glint' ? Math.sin(Math.PI * k) * 1.4 : p.kind === 'conf' ? Math.abs(Math.cos(p.life * p.flutter * 2)) * .8 + .2 : 1;
    p.e.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.rot.toFixed(0)}) scale(${p.kind === 'conf' ? '1 ' + sc.toFixed(2) : sc.toFixed(2)})`);
    if (p.kind !== 'glint') p.e.setAttribute('opacity', Math.min(1, p.life / p.max * 2).toFixed(2));
  }
}
function burst(kind, x, y, n, o = {}) { for (let i = 0; i < n; i++) spawnP(kind, x + rnd(-6, 6), y + rnd(-6, 6), { vx: rnd(-55, 55), vy: rnd(-85, -25), g: 90, life: rnd(.8, 1.3), vr: rnd(-200, 200), ...o }); }
function confetti(x, y, n = 40) { for (let i = 0; i < n; i++) { const a = rnd(-Math.PI * .95, -Math.PI * .05), s = rnd(90, 240); spawnP('conf', x, y, { vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 260, drag: .03, life: rnd(1.6, 2.6), vr: rnd(-500, 500) }); } }
function ripple(x, y, c) { spawnP('ring', x, y, { vx: 0, vy: 0, life: .45, grow: 22, c: c || 'rgba(255,255,255,.8)' }); }
function poof(x, y, n = 18) {
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, s = rnd(50, 110); spawnP(i % 3 ? 'spark' : 'dot', x, y, { vx: Math.cos(a) * s, vy: Math.sin(a) * s * .8, drag: .06, life: rnd(.6, 1), c: pick(['#ffe58a', '#ffffff', '#ffd0e0']), r: rnd(2.5, 5), vr: rnd(-300, 300) }); }
  spawnP('ring', x, y, { vx: 0, vy: 0, life: .6, grow: 70, c: 'rgba(255,240,200,.9)', w: 3 });
}
function firework(delay = 0) {
  setTimeout(() => {
    const W = ROOMS[room].win, x = rnd(W.x + 12, W.x + W.w - 12), c = pick(['#ff5a6a', '#ffd447', '#6fdc8f', '#6fb6ff', '#ff8be8', '#ffffff']);
    SFX.firework();
    spawnP('dot', x, W.y + W.h - 2, { parent: '#winFx', vx: rnd(-8, 8), vy: -rnd(190, 240), g: 120, life: rnd(.7, .9), r: 1.6, c: '#fff2c0', onEnd: p => {
      for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, s = rnd(28, 58); spawnP('dot', p.x, p.y, { parent: '#winFx', vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 30, drag: .035, life: rnd(1, 1.6), r: rnd(.9, 1.6), c: i % 4 ? c : '#fff' }); }
      spawnP('dot', p.x, p.y, { parent: '#winFx', vx: 0, vy: 0, life: .25, r: 14, c: 'rgba(255,240,200,.35)' });
    } });
  }, delay);
}
function salute(n = 6) { for (let i = 0; i < n; i++) firework(i * rnd(350, 600)); }
let indoorSnowUntil = 0;

/* watering can */
let canT = -1;
function updateCan(dt) {
  if (canT < 0) return;
  canT += dt; const t = canT, el = $('#can'), body = $('#canBody'), x = 262, y = 236;
  let a = 0, op = 1;
  if (t < .3) op = t / .3; else if (t < .5) a = -42 * (t - .3) / .2; else if (t < 1.4) a = -42; else if (t < 1.7) a = -42 * (1 - (t - 1.4) / .3); else op = Math.max(0, 1 - (t - 1.7) / .3);
  el.setAttribute('opacity', op.toFixed(2));
  el.setAttribute('transform', `translate(${x} ${y - (t < .3 ? (1 - t / .3) * 20 : 0)})`);
  body.setAttribute('transform', `rotate(${a.toFixed(1)})`);
  if (t > .5 && t < 1.4 && Math.random() < .8) {
    const r = a * Math.PI / 180, tx = x + (-37 * Math.cos(r) + 15 * Math.sin(r)), ty = y + (-37 * Math.sin(r) - 15 * Math.cos(r));
    spawnP('drop', tx + rnd(-3, 3), ty, { vx: rnd(-35, -10), vy: rnd(10, 40), g: 420, life: 1.6, floor: rnd(380, 600) });
  }
  if (t > 2) { canT = -1; el.setAttribute('opacity', 0); }
}

/* ---------------- BUBBLE ---------------- */
const bubble = $('#bubble'); let bubbleUntil = 0;
function say(text, o = {}) {
  bubble.textContent = text; bubble.hidden = false;
  bubble.classList.remove('in'); void bubble.offsetWidth; bubble.classList.add('in');
  const now = performance.now(), dur = Math.max(2000, text.length * 75);
  bubbleUntil = now + dur + 900;
  // every line the tree says is voiced; 'Скажи' always speaks, other lines follow the chosen voice
  const voice = o.tts ? (S.voice === 'low' ? 'low' : 'high') : S.voice;
  if (voice !== 'off' && speak(text, voice === 'high')) talkUntil = now + dur;
  else { chatter(Math.min(8, Math.ceil(text.length / 6))); talkUntil = now + Math.min(1500, 300 + text.length * 45); }
  positionBubble();
}
function svgToClient(x, y) { const m = svg.getScreenCTM(); return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }; }
function positionBubble() {
  if (bubble.hidden) return;
  const st = $('#stage').getBoundingClientRect(), p = svgToClient(CX, GLOW_TOPS.includes(S.topper) ? 124 : 128);
  const w = bubble.offsetWidth, h = bubble.offsetHeight, x = p.x - st.left;
  const minTop = 10;
  const cx = clamp(x, w / 2 + 12, st.width - w / 2 - 12), y = Math.max(h + minTop, p.y - st.top);
  bubble.style.left = cx + 'px'; bubble.style.top = y + 'px';
  bubble.style.setProperty('--tail', clamp(50 + (x - cx) / w * 100, 15, 85) + '%');
}

/* ---------------- HUD ---------------- */
const ICON = {
  on: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  off: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/><path d="M16 4.5h3l-3 3.5h3" stroke-linecap="round"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',
  dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/><circle cx="15" cy="9" r="1.2" fill="currentColor"/><circle cx="9" cy="15" r="1.2" fill="currentColor"/></svg>',
  undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 0 12"/></svg>'
};
function moodState(now) {
  if (isSleeping(now)) return ['sleep', 'спит'];
  if (S.water < 25) return ['sad', 'хочет пить'];
  if (S.energy < 18) return ['sleepy', 'сонная'];
  if (S.joy < 25) return ['sad', 'скучает'];
  if (S.joy > 80) return ['happy', 'счастлива'];
  return ['smile', 'весёлая'];
}
function moodSVG(k) {
  const c = TREECOL[S.color] || TREECOL.green;
  const mouth = { happy: '<path d="M11 19Q15 25 19 19Z" fill="#5a1a22"/>', sad: '<path d="M11.5 22Q15 18.5 18.5 22" stroke="#3a1418" stroke-width="1.6" fill="none" stroke-linecap="round"/>', sleep: '<path d="M12.5 21h5" stroke="#3a1418" stroke-width="1.6" stroke-linecap="round"/>', sleepy: '<path d="M12.5 21h5" stroke="#3a1418" stroke-width="1.6" stroke-linecap="round"/>', smile: '<path d="M11.5 19.5Q15 23 18.5 19.5" stroke="#3a1418" stroke-width="1.6" fill="none" stroke-linecap="round"/>' }[k];
  const eyes = k === 'sleep' || k === 'sleepy' ? '<path d="M9.5 15.5q2 1.6 4 0M16.5 15.5q2 1.6 4 0" stroke="#123a22" stroke-width="1.4" fill="none" stroke-linecap="round"/>' : '<circle cx="11.5" cy="15" r="2.3" fill="#fff"/><circle cx="18.5" cy="15" r="2.3" fill="#fff"/><circle cx="11.8" cy="15.4" r="1.1" fill="#1b1b2b"/><circle cx="18.8" cy="15.4" r="1.1" fill="#1b1b2b"/>';
  return `<path d="M15 3L27 27H3Z" fill="${c[1]}" stroke="${c[2]}" stroke-width="1.2" stroke-linejoin="round"/>${eyes}${mouth}<path d="${starPath(3.6, 1.5)}" transform="translate(15 3.5)" fill="#f2bd4b"/>`;
}
let moodKind = '', prevReady = [];
function updateHUD() {
  [['#mWater', S.water], ['#mJoy', S.joy], ['#mEnergy', S.energy]].forEach(([id, v]) => { $(id).style.strokeDashoffset = (113.1 * (1 - v / 100)).toFixed(1); });
  $('#mW').classList.toggle('low', S.water < 25); $('#mJ').classList.toggle('low', S.joy < 20); $('#mE').classList.toggle('low', S.energy < 18);
  $('#sndBtn').innerHTML = muted ? ICON.off : ICON.on;
  $('#nightBtn').innerHTML = `<span class="ic">${S.night ? ICON.sun : ICON.moon}</span>${S.night ? 'Утро' : 'Спать'}`;
  $('#app').classList.toggle('night', S.night);
  $('#night').style.opacity = S.night ? .62 : 0;
  const [mk2, txt] = moodState(performance.now()), key = mk2 + S.color;
  if (key !== moodKind) { moodKind = key; $('#moodFace').innerHTML = moodSVG(mk2); $('#moodTxt').textContent = txt; const m = $('#mood'); m.classList.remove('bump'); void m.offsetWidth; m.classList.add('bump'); }
  const d = daysToNY(); $('#calN').textContent = d; $('#calW').textContent = plural(d, ['день', 'дня', 'дней']);
  const n = new Date(), mi = n.getMinutes(), h = n.getHours() % 12 + mi / 60;
  $('#clkM').setAttribute('x2', (377 + Math.sin(mi / 60 * Math.PI * 2) * 7.5).toFixed(2)); $('#clkM').setAttribute('y2', (328 - Math.cos(mi / 60 * Math.PI * 2) * 7.5).toFixed(2));
  $('#clkH').setAttribute('x2', (377 + Math.sin(h / 12 * Math.PI * 2) * 5).toFixed(2)); $('#clkH').setAttribute('y2', (328 - Math.cos(h / 12 * Math.PI * 2) * 5).toFixed(2));
  roomHUD(mi, h);
  const now = Date.now();
  giftEls.forEach((g, i) => {
    const ready = now >= (S.gifts[i] || 0);
    if (ready && prevReady[i] === false) { g.classList.remove('wrap'); void g.getBoundingClientRect(); g.classList.add('wrap'); const b = GIFTS[i]; burst('spark', b.x + b.w / 2, b.y, 6, { g: 30 }); }
    prevReady[i] = ready; g.classList.toggle('ready', ready); g.classList.toggle('used', !ready);
  });
  document.querySelectorAll('#dock button').forEach(b => b.classList.toggle('on', b.dataset.dock === sheet));
}
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(() => t.hidden = true, 2600); }
const joy = v => { S.joy = clamp(S.joy + v, 0, 100); };

/* ---------------- INTERACTIONS ---------------- */
let tapTimes = [];
function svgPt(e) { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
function treePt(e) { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform($('#treeT').getScreenCTM().inverse()); }
function insideTree(x, y) { return TIERS.some(t => y >= t.ay + 14 && y <= t.by - 1 && Math.abs(x - CX) <= t.hw * ((y - t.ay) / (t.by - t.ay)) * .86); }
const inFace = (x, y) => x > CX - 44 && x < CX + 44 && y > 364 && y < 448;
function freeSpot() {
  for (let k = 0; k < 60; k++) { const x = rnd(40, 310), y = rnd(190, 560); if (insideTree(x, y) && !inFace(x, y) && S.orn.every(o => Math.hypot(o.x - x, o.y - y) > 22)) return { x: Math.round(x), y: Math.round(y) }; }
  return null;
}
function treeTap(hit, p) {
  const now = performance.now();
  if (isSleeping(now)) { wakeUntil = now + 3500; say(pick(PH.wake)); face('sleepy', 3200); impulse(18); SFX.boing(); return; }
  tapTimes = tapTimes.filter(x => now - x < 2200); tapTimes.push(now);
  if (tapTimes.length >= 7) { tapTimes = []; say(pick(PH.annoyed)); face('angry', 2600); impulse(90 * (Math.random() < .5 ? -1 : 1), 1.2); SFX.buzz(); joy(-3); burst('needle', CX, 420, 10); return; }
  if (hit === 'pot') { SFX.boing(); impulse(0, -1.6); face('o', 1100); if (Math.random() < .6) say(pick(PH.pot)); return; }
  if (hit === 'face' && (Math.hypot(p.x - 152, p.y - 388) < 17 || Math.hypot(p.x - 198, p.y - 388) < 17)) { blinkEnd = now + 450; face('angry', 1400); SFX.pop(); impulse(20); say(pick(PH.eye)); return; }
  if (p.y < 215) { topSpin = 16; impulse(0, -.8); SFX.chime(); face('happy', 1600); say(GLOW_TOPS.includes(S.topper) || S.topper === 'none' ? pick(PH.star) : pick(['Как тебе моя шапка?', 'Не снимай, мне идёт!', 'Модная макушка, правда?'])); burst('spark', CX, 150, 10, { g: 40 }); joy(2); return; }
  SFX.giggle(); vib(12); face('laugh', 1400); impulse(p.x < CX ? -70 : 70, .6); burst('needle', p.x, p.y, 4); joy(2);
  if (Math.random() < .65) say(pick(PH.tickle), { silent: true });
}
function pet(p) {
  if (isSleeping(performance.now())) { spawnP('z', CX + 30, 360, { vx: 12, vy: -24, life: 1.8, s: 18 }); return; }
  SFX.purr(); face('happy', 1600); joy(3); spawnP('heart', p.x, p.y, { vx: rnd(-15, 15), vy: -45, life: 1.4 });
  impulse(rnd(-8, 8)); if (Math.random() < .3) say(pick(PH.pet), { silent: true });
}
// add/remove one ornament without rebuilding the others, so their sway is not reset
function ornCount() { const c = document.getElementById('ornCnt'); if (c) c.textContent = S.orn.length + ' / 40'; }
function addOrn(o) { S.orn.push(o); const el = mk('g', { transform: `translate(${o.x} ${o.y}) scale(0)` }, $('#orns')); el.innerHTML = ornMarkup(o.t, o.c); ornEls.push({ el, x: o.x, y: o.y, a: 0, v: 0, ph: rnd(0, 6), sc: 0, scv: 0, delay: 0 }); ornCount(); }
function removeOrn(i) { const o = S.orn[i]; S.orn.splice(i, 1); const st = ornEls.splice(i, 1)[0]; if (st) st.el.remove(); ornCount(); return o; }
function decorTap(p) {
  for (let i = S.orn.length - 1; i >= 0; i--) { const o = S.orn[i]; if (Math.hypot(o.x - p.x, o.y - p.y) < 11) { removeOrn(i); SFX.pop(); burst('spark', o.x, o.y, 5, { g: 40, c: '#fff' }); save(); return; } }
  if (inFace(p.x, p.y)) { say('Только не на лицо!'); face('o', 1300); return; }
  if (!insideTree(p.x, p.y)) return;
  if (S.orn.length >= 40) { toast('На ёлке уже 40 игрушек. Сними одну, чтобы повесить новую.'); return; }
  addOrn({ t: selOrn, c: selCol, x: Math.round(p.x), y: Math.round(p.y) });
  SFX.place(); impulse(rnd(-12, 12)); joy(1); face('happy', 900); ripple(p.x, p.y, 'rgba(255,230,160,.9)');
  if (Math.random() < .22) say(pick(PH.decor), { silent: true });
  save();
}
function water() {
  if (canT >= 0) return;
  if (S.water > 94) { say(pick(PH.full)); face('o', 1200); return; }
  canT = 0; setTimeout(() => SFX.splash(), 500);
  setTimeout(() => { S.water = clamp(S.water + 35, 0, 100); joy(3); face('happy', 1800); say(pick(PH.water)); impulse(15); burst('spark', CX, 300, 8, { c: '#bfe6ff' }); updateHUD(); save(); }, 1300);
  if (S.night) wakeUntil = performance.now() + 4000;
}
function toggleNight() {
  if (!S.night && room !== 'bedroom') { goRoom('bedroom'); setTimeout(() => { if (!S.night) toggleNight(); }, 640); return; }
  S.night = !S.night; wakeUntil = 0; setGlowSizes(); updateHUD(); save();
  if (S.night) { say('Спокойной ночи…', { silent: true }); tone(523, .4, 'sine', .1); tone(392, .6, 'sine', .1, .3); }
  else { face('happy', 2000); say(S.energy > 80 ? 'Доброе утро! Я выспалась!' : 'Уже утро? Я ещё сонная…'); tone(523, .3, 'sine', .12); tone(784, .5, 'sine', .12, .2); burst('spark', CX, 150, 10, { g: 30 }); }
}
function flyToy(gi = Math.floor(Math.random() * GIFTS.length)) {
  const spot = freeSpot(); if (!spot || S.orn.length >= 40) return false;
  const t = pick(CAT.orn)[0], c = pick(Object.keys(COLORS)), g = mk('g', {}, $('#fx')); g.innerHTML = ornMarkup(t, c);
  const b = GIFTS[gi], x0 = b.x + b.w / 2, y0 = b.y, t0 = performance.now();
  const step = now => {
    const k = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - k, 2);
    g.setAttribute('transform', `translate(${x0 + (spot.x - x0) * e} ${y0 + (spot.y - y0) * e - Math.sin(Math.PI * k) * 110}) rotate(${(1 - k) * 360}) scale(${.5 + k * .5})`);
    if (Math.random() < .5) spawnP('spark', x0 + (spot.x - x0) * e, y0 + (spot.y - y0) * e - Math.sin(Math.PI * k) * 110, { vx: 0, vy: 10, life: .5, r: 3 });
    if (k < 1) requestAnimationFrame(step); else { g.remove(); addOrn({ t, c, ...spot }); SFX.place(); ripple(spot.x, spot.y, 'rgba(255,230,160,.9)'); save(); }
  };
  requestAnimationFrame(step); return true;
}
let lastSurprise = '';
function openGift(i, el) {
  if (Date.now() < (S.gifts[i] || 0)) { face('smile'); say(`Этот подарок снова упакуется через ${Math.ceil((S.gifts[i] - Date.now()) / 1000)} сек`, { silent: true }); SFX.pop(); return; }
  el.classList.remove('pop'); void el.getBoundingClientRect(); el.classList.add('pop'); setTimeout(() => el.classList.remove('pop'), 1000);
  const b = GIFTS[i]; confetti(b.x + b.w / 2, b.y, 38); SFX.jingle(); vib(25); joy(6); face('happy', 2400);
  S.gifts[i] = Date.now() + 40000; prevReady[i] = false;
  let kind; do kind = pick(['salute', 'outfit', 'snow', 'dance', 'toy', 'hearts']); while (kind === lastSurprise);
  lastSurprise = kind;
  if (kind === 'dance' && (muted || music)) kind = 'hearts';
  if (kind === 'toy' && !flyToy(i)) kind = 'hearts';
  setTimeout(() => {
    if (kind === 'salute') { salute(7); say('Салют за окном! Ура!', { silent: true }); }
    else if (kind === 'outfit') { randomLook(); say('Сюрприз! У меня новый наряд!', { silent: true }); }
    else if (kind === 'snow') { indoorSnowUntil = performance.now() + 5000; say('Ой, снег прямо в доме!', { silent: true }); SFX.whoosh(); }
    else if (kind === 'dance') { playSong(); S.song++; say('Подарок с музыкой! Танцуем!', { silent: true }); }
    else if (kind === 'toy') say('Новая игрушка летит ко мне!', { silent: true });
    else { burst('heart', CX, 420, 16, { vy: -120, g: 40, life: 1.8 }); say('Это любовь!', { silent: true }); }
  }, 350);
  updateHUD(); save();
}
function handleHit(hit, el, e, p) {
  const now = performance.now(); lastAct = now;
  switch (hit) {
    case 'tree': case 'face': case 'pot':
      if (sheet === 'decor' && tab === 'orn' && hit !== 'pot') decorTap(treePt(e)); else treeTap(hit, treePt(e)); break;
    case 'gift': openGift(+el.dataset.i, el); break;
    case 'stock': {
      const i = +el.dataset.i, inner = stockEls[i], x = [300, 336, 372][i];
      inner.classList.remove('swing'); void inner.getBoundingClientRect(); inner.classList.add('swing'); setTimeout(() => inner.classList.remove('swing'), 950);
      SFX.jingle();
      if (Date.now() >= (S.stock[i] || 0)) { S.stock[i] = Date.now() + 15000; spawnP('candy', x - 4, 392, { vx: rnd(-40, -10), vy: -150, g: 330, vr: 400, life: 1.3 }); burst('spark', x - 4, 392, 5); joy(2); face('happy', 1500); say(pick(['В носке конфетка!', 'Ой, сладкое!', 'Сюрприз в носке!']), { silent: true }); }
      else say('Носок пока пустой', { silent: true });
      save(); break;
    }
    case 'window': S.snow = (S.snow + 1) % 3; SFX.whoosh(); say(SNOW[S.snow].name, { silent: true }); face('o', 1000); save(); break;
    case 'sleigh':
      if (sleigh.on) { sleigh.on = false; $('#sleigh').setAttribute('visibility', 'hidden'); sleigh.next = now + rnd(40000, 70000); SFX.jingle(); salute(4); joy(5); face('happy', 2200); say('Дед Мороз пролетел! Хо-хо-хо!', { silent: true }); }
      break;
    case 'fire': { const f = $('#fire'); f.classList.add('roar'); setTimeout(() => f.classList.remove('roar'), 1500); SFX.crackle(); joy(1); burst('spark', 348, 470, 10, { c: '#ffb347', vy: -90 }); if (Math.random() < .7) say(pick(PH.fire), { silent: true }); break; }
    case 'globe': { const g = $('#globe'); g.classList.remove('shake'); void g.getBoundingClientRect(); g.classList.add('shake'); globeFlakes.forEach(f => { f.vx = rnd(-60, 60); f.vy = rnd(-90, -30); f.y = Math.min(f.y, 342.9); }); SFX.jingle(); say(pick(PH.globe), { silent: true }); break; }
    case 'calendar': { const d = daysToNY(); SFX.place(); face('happy', 1500); say(`До Нового года ${d} ${plural(d, ['день', 'дня', 'дней'])}!`, { silent: true }); burst('spark', 340, 140, 6); break; }
    case 'clock': { const n = new Date(); SFX.place(); say(`Сейчас ${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}. Ждём боя курантов!`, { silent: true }); break; }
    case 'radio':
      if (music) { stopSong(); say(pick(PH.radioOff), { silent: true }); }
      else if (muted) toast('Включи звук, чтобы послушать радио');
      else if (playSong()) { const nm = SONGS[S.song % SONGS.length].name; S.song++; say(`${pick(PH.radioOn)} «${nm}»`, { silent: true }); face('happy', 2500); if (S.night) wakeUntil = now + 4000; save(); }
      break;
    case 'mandarin': SFX.pop(); joy(1); face('happy', 1300); say(pick(PH.mandarin), { silent: true }); burst('spark', 107, 272, 6, { c: '#ffb347' }); break;
    case 'wreath': { const w = $('#wreath'); w.classList.remove('shake'); void w.getBoundingClientRect(); w.classList.add('shake'); SFX.jingle(); if (Math.random() < .5) say(pick(PH.wreath), { silent: true }); break; }
    case 'garland': wallMode = (wallMode + 1) % 3; SFX.place(); break;
    default: roomHit(hit, el, e, p);
  }
}
let down = null;
svg.addEventListener('pointerdown', e => {
  unlocked = true; ac();
  const p = svgPt(e), el = e.target.closest('[data-hit]');
  lookP = p; lookUntil = performance.now() + 2500; ripple(p.x, p.y);
  down = { x0: e.clientX, y0: e.clientY, lx: e.clientX, ly: e.clientY, dist: 0, hit: el ? el.dataset.hit : null, el, petAt: 0, id: e.pointerId };
  try { svg.setPointerCapture(e.pointerId); } catch (err) { }
});
svg.addEventListener('pointermove', e => {
  if (!down || e.pointerId !== down.id) return;
  const p = svgPt(e); lookP = p; lookUntil = performance.now() + 2500;
  down.dist += Math.hypot(e.clientX - down.lx, e.clientY - down.ly); down.lx = e.clientX; down.ly = e.clientY;
  const now = performance.now();
  if ((down.hit === 'tree' || down.hit === 'face') && sheet !== 'decor' && down.dist > 50 && now - down.petAt > 650) { down.petAt = now; pet(p); lastAct = now; }
});
svg.addEventListener('pointerup', e => {
  if (!down || e.pointerId !== down.id) return;
  const dx = e.clientX - down.x0, dy = e.clientY - down.y0;
  if (down.dist < 14 && down.hit) handleHit(down.hit, down.el, e, svgPt(e));
  // a horizontal swipe on the room (not on the tree, which is for petting) walks to the next room
  else if (!sheet && down.hit !== 'tree' && down.hit !== 'face' && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) goRoom(ROOMS[room][dx < 0 ? 'right' : 'left']);
  down = null;
});
svg.addEventListener('pointercancel', () => { down = null; });
document.addEventListener('pointerdown', () => { unlocked = true; primeTTS(); }, { capture: true });
document.addEventListener('touchstart', () => { }, { passive: true }); // lets iOS show :active press states

/* idle life */
let nextIdle = performance.now() + 14000, nextGlint = 0, nextZ = 0;
function idleAct(now) {
  if (S.water < 30) { say(pick(PH.thirsty), { silent: true }); face('sad', 2500); return; }
  if (S.energy < 40 && Math.random() < .5) { face('yawn', 1600); SFX.yawn(); say('Ааах… Как спать хочется…', { silent: true }); return; }
  const r = Math.random();
  if (r < .22) { face('sneeze', 750); setTimeout(() => { SFX.sneeze(); impulse(rnd(-70, 70), -1.3); burst('needle', CX, 420, 10); if (S.snowLvl) burst('dot', CX, 330, 14, { c: '#fff', r: 1.8 }); say('Апчхи!', { silent: true }); face('laugh', 900); }, 650); }
  else if (r < .44) { SFX.hum(); face('happy', 1500); for (let i = 0; i < 4; i++) setTimeout(() => spawnP('note', CX + rnd(-10, 10), 418, { vx: rnd(-20, 20), vy: -40, life: 1.6 }), i * 230); }
  else if (r < .62) { topSpin = 10; burst('spark', CX, 152, 8, { g: 30 }); SFX.chime(); }
  else say(S.joy < 25 ? 'Мне скучно… поиграй со мной!' : pick(room === 'living' ? PH.idle : PH[room]), { silent: true });
}
function idleTick(now) {
  if (now > nextGlint && ornEls.length && !isSleeping(now)) { nextGlint = now + rnd(250, 550); const o = pick(ornEls); spawnP('glint', o.x - 3 + rnd(-2, 2), o.y - 4, { vx: 0, vy: 0, life: .7, r: rnd(3.5, 5.5), c: '#fffbe8', rot: 0 }); }
  if (isSleeping(now) && now > nextZ) { nextZ = now + 1500; spawnP('z', CX + 26, 372, { vx: rnd(8, 16), vy: -22, life: 2.4, s: rnd(13, 20) }); }
  if (music && music.src.room === room && Math.random() < .035) spawnP('note', music.src.x, music.src.y, { vx: rnd(-6, 14), vy: -30, life: 2 });
  if (room === 'bedroom') $('#projStars').setAttribute('transform', `rotate(${(now / 1000 * 3) % 360} 112 156)`);
  if (now < indoorSnowUntil && Math.random() < .7) spawnP('dot', rnd(-40, 440), -20, { c: '#fff', r: rnd(1, 2.6), vx: rnd(-12, 12), vy: rnd(40, 80), life: 9, floor: rnd(560, 680) });
  if (now > nextIdle) { nextIdle = now + rnd(11000, 18000); if (!sheet && now - lastAct > 6000 && !isSleeping(now)) idleAct(now); }
}

/* ---------------- ROOMS ---------------- */
const ORDER = ['kitchen', 'living', 'bedroom'];
FOODS.cocoa = { joy: 4, water: 18, say: ['Какао! Тепло и сладко!', 'Ммм, с зефиркой!'] };
let switching = false, fridgeT = 0, kettleBusy = false, baking = false, nextShoot = 0;
const HOLES = {
  living: () => '<rect x="25" y="78" width="112" height="214" fill="#5a5a5a"/><path d="M314 530 L314 446 Q348 418 382 446 L382 530 Z" fill="#000"/>',
  kitchen: () => '<rect x="244" y="86" width="124" height="164" fill="#5a5a5a"/>' + (baking ? '<rect x="312" y="436" width="62" height="52" rx="6" fill="#000"/>' : ''),
  bedroom: () => '<rect x="260" y="92" width="116" height="164" fill="#5a5a5a"/>' + (S.lamp ? '<circle cx="112" cy="156" r="46" fill="#1a1a1a"/>' : '')
};
function setMask() { $('#nightMask').innerHTML = '<rect x="-800" y="-1000" width="2000" height="2800" fill="#fff"/>' + HOLES[room](); }
function syncLamp() {
  $('#nlampGlow').setAttribute('opacity', S.lamp ? (S.night ? .9 : .35) : 0);
  $('#projStars').setAttribute('opacity', S.lamp && S.night ? 1 : 0);
  $('#kLampGlow').setAttribute('opacity', S.night ? .12 : .35);
}
function roomHUD(mi, h) {
  $('#kkM').setAttribute('x2', (50 + Math.sin(mi / 60 * Math.PI * 2) * 15).toFixed(2)); $('#kkM').setAttribute('y2', (130 - Math.cos(mi / 60 * Math.PI * 2) * 15).toFixed(2));
  $('#kkH').setAttribute('x2', (50 + Math.sin(h / 12 * Math.PI * 2) * 10).toFixed(2)); $('#kkH').setAttribute('y2', (130 - Math.cos(h / 12 * Math.PI * 2) * 10).toFixed(2));
  syncLamp();
}
function navUpdate() { document.querySelectorAll('#rooms button').forEach(b => { const on = b.dataset.room === room; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); }
function applyRoom() {
  ORDER.forEach(r => { const on = r === room; $('#room-' + r).style.display = on ? '' : 'none'; $('#glow-' + r).style.display = on ? '' : 'none'; });
  const win = document.getElementById(ROOMS[room].winEl), slotB = win.querySelector('.slotB');
  win.querySelector('.slotA').appendChild($('#winFx')); slotB.appendChild($('#sleigh')); slotB.appendChild($('#snowG'));
  const W = ROOMS[room].win; flakes.forEach(f => { f.x = rnd(W.x, W.x + W.w); f.y = rnd(W.y, W.y + W.h); });
  sleigh.on = false; $('#sleigh').setAttribute('visibility', 'hidden');
  $('#gifts').style.display = room === 'living' ? '' : 'none';
  $('#fridge').classList.remove('open'); $('#wardrobe').classList.remove('open');
  $('#app').dataset.room = room;
  setMask(); syncLamp(); navUpdate();
}
function goRoom(id) {
  if (!id || !ROOMS[id] || id === room || switching || GAME) return;
  switching = true; lastAct = performance.now(); bubble.hidden = true;
  if (sheet) closeSheet();
  const dir = ORDER.indexOf(id) > ORDER.indexOf(room) ? 1 : -1, from = room, o = { duration: 520, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' };
  const ins = [$('#room-' + id), $('#glow-' + id)], outs = [$('#room-' + from), $('#glow-' + from)];
  ins.forEach(e => e.style.display = '');
  const anims = [
    ...outs.map(e => e.animate([{ opacity: 1, transform: 'translateX(0px)' }, { opacity: 0, transform: `translateX(${-dir * 80}px)` }], o)),
    ...ins.map(e => e.animate([{ opacity: 0, transform: `translateX(${dir * 80}px)` }, { opacity: 1, transform: 'translateX(0px)' }], o))
  ];
  hopT = 0; impulse(dir * 40, -.6); SFX.whoosh(); tone(380, .3, 'sine', .1, 0, 820);
  setTimeout(() => {
    room = id; S.room = id; applyRoom(); anims.forEach(a => a.cancel()); switching = false; save();
    const tag = $('#roomTag'); tag.textContent = ROOMS[id].name; tag.hidden = false; tag.style.animation = 'none'; void tag.offsetWidth; tag.style.animation = '';
    clearTimeout(tag.h); tag.h = setTimeout(() => tag.hidden = true, 1800);
    face('happy', 1200);
    if (!S.night && Math.random() < .6) setTimeout(() => say(pick(id === 'living' ? PH.idle : PH[id]), { silent: true }), 350);
  }, 540);
}
function restart(el, cls) { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); }
function flyItem(markup, x0, y0, x1, y1, ms, done, arc = 90) {
  const g = mk('g', {}, $('#fx')); g.innerHTML = markup; const t0 = performance.now();
  const step = now => {
    const k = Math.min(1, (now - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    g.setAttribute('transform', `translate(${(x0 + (x1 - x0) * e).toFixed(1)} ${(y0 + (y1 - y0) * e - Math.sin(Math.PI * k) * arc).toFixed(1)}) rotate(${(k * 300).toFixed(0)}) scale(${(1 + .3 * Math.sin(Math.PI * k)).toFixed(2)})`);
    if (k < 1) requestAnimationFrame(step); else { g.remove(); if (done) done(); }
  };
  requestAnimationFrame(step);
}
function eat(id) {
  const F = FOODS[id];
  if (F.yuck) { face('angry', 1800); SFX.buzz(); impulse(-45, .5); joy(F.joy); say(pick(F.say), { silent: true }); flyItem(foodMarkup(id), CX, 425, CX + 95, 636, 650, () => burst('dot', CX + 95, 630, 8, { parent: '#fx', c: '#e9c27a', r: 1.6 }), 60); updateHUD(); return; }
  face('happy', 2200); talkUntil = performance.now() + 900;
  [0, 180, 360, 540].forEach(d => setTimeout(() => { tone(rnd(170, 250), .07, 'square', .07); noise(.05, .1, 1800); }, d));
  burst('dot', CX, 432, 10, { c: { compote: '#c62d3a', mandarin: '#f59a26', cocoa: '#7a4520', olivier: '#f3e3b0' }[id] || '#e8c48a', r: 1.6, vy: -40, g: 300, life: .8 });
  joy(F.joy); if (F.water) S.water = clamp(S.water + F.water, 0, 100);
  if (F.love) burst('heart', CX, 400, 8, { vy: -100, g: 30, life: 1.6 });
  setTimeout(() => say(pick(F.say), { silent: true }), 300); impulse(12, -.5); updateHUD(); save();
}
function openFridge(open) {
  const f = $('#fridge'); open = open ?? !f.classList.contains('open');
  f.classList.toggle('open', open); tone(open ? 300 : 220, .15, 'sine', .15, 0, open ? 520 : 150);
  clearTimeout(fridgeT);
  if (open) { fridgeT = setTimeout(() => openFridge(false), 9000); face('o', 900); say(pick(['Что тут вкусненького?', 'Ой, сколько еды! Выбирай!']), { silent: true }); }
}
function feed(id) {
  const i = FOOD_ORDER.indexOf(id), x0 = 28, y0 = 352 + i * 36;
  lookP = { x: x0, y: y0 }; lookUntil = performance.now() + 800; face('o', 700); SFX.pop();
  flyItem(foodMarkup(id), x0, y0, CX, 425, 650, () => eat(id));
  clearTimeout(fridgeT); fridgeT = setTimeout(() => openFridge(false), 9000);
}
function kettle() {
  if (kettleBusy) { say('Чайник уже греется…', { silent: true }); return; }
  kettleBusy = true; $('#kFlame').setAttribute('opacity', 1); noise(1.8, .05, 300, 0, 'lowpass');
  let n = 0; const iv = setInterval(() => { spawnP('dot', 344 + rnd(-2, 2), 342, { c: '#fff', r: rnd(1.6, 3.6), vx: rnd(4, 18), vy: rnd(-42, -24), life: 1.2, drag: .02 }); if (++n > 30) clearInterval(iv); }, 60);
  say('Ставлю чайник!', { silent: true });
  setTimeout(() => {
    tone(1500, .8, 'sine', .06, 0, 1700); tone(1525, .8, 'sine', .05, .05, 1760);
    $('#kFlame').setAttribute('opacity', 0); restart($('#kettle'), 'hop');
    say('Какао с зефиркой готово!', { silent: true });
    flyItem(foodMarkup('cocoa'), 316, 340, CX, 425, 700, () => { eat('cocoa'); kettleBusy = false; });
  }, 1900);
}
function bake() {
  if (baking) { say('Пряники ещё пекутся…', { silent: true }); return; }
  baking = true; setMask(); const gl = $('#ovenGlow'), ol = $('#ovenLight'), tray = $('#ovenTray');
  tray.setAttribute('opacity', 1); say('Печём тульские пряники!', { silent: true }); face('happy', 1500);
  let k = 0; const iv = setInterval(() => { k++; gl.setAttribute('opacity', (.45 + .25 * Math.sin(k * .6)).toFixed(2)); ol.setAttribute('opacity', (.55 + .2 * Math.sin(k * .6)).toFixed(2)); if (k % 5 === 0) tone(900, .05, 'square', .04); }, 100);
  setTimeout(() => {
    clearInterval(iv); gl.setAttribute('opacity', 0); ol.setAttribute('opacity', 0); tray.setAttribute('opacity', 0); baking = false; setMask();
    SFX.chime(); burst('spark', 343, 450, 10, { c: '#ffd35a' });
    const sp = freeSpot(), c = pick(['red', 'green', 'blue', 'pink']);
    if (sp && S.orn.length < 40) { say('Свежий пряник — прямо на ветку!', { silent: true }); flyItem(ornMarkup('ginger', c), 343, 450, sp.x, sp.y, 850, () => { addOrn({ t: 'ginger', c, ...sp }); SFX.place(); ripple(sp.x, sp.y, 'rgba(255,230,160,.9)'); save(); }, 120); }
    else flyItem(foodMarkup('ginger'), 343, 450, CX, 425, 700, () => eat('ginger'));
  }, 3200);
}
function cuckoo() {
  const b = $('#cuckooBird'); if (b.dataset.busy) return; b.dataset.busy = '1';
  const n = new Date(), tm = `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
  [0, 700].forEach(d => setTimeout(() => { b.style.opacity = 1; b.classList.add('out'); tone(784, .18, 'sine', .14); tone(622, .3, 'sine', .14, .2); setTimeout(() => b.classList.remove('out'), 450); }, d));
  setTimeout(() => { b.style.opacity = 0; delete b.dataset.busy; }, 1500);
  setTimeout(() => say(`Ку-ку! Сейчас ${tm}`, { silent: true }), 900);
}
function shootingStar() {
  const W = ROOMS.bedroom.win, g = mk('path', { d: 'M0 0L28 -11', stroke: '#fff', 'stroke-width': 2, 'stroke-linecap': 'round' }, $('#winFx'));
  const x0 = W.x + W.w - 8, y0 = W.y + 14, x1 = W.x + 22, y1 = W.y + 78, t0 = performance.now();
  const step = now => {
    const k = Math.min(1, (now - t0) / 750), x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k;
    g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); g.setAttribute('opacity', Math.sin(Math.PI * k).toFixed(2));
    if (Math.random() < .5) spawnP('dot', x, y, { parent: '#winFx', c: '#fff6c8', r: rnd(.5, 1.1), vx: rnd(-6, 6), vy: rnd(-4, 6), life: .7 });
    if (k < 1) requestAnimationFrame(step); else g.remove();
  };
  requestAnimationFrame(step); SFX.chime();
}
function roomHit(hit, el) {
  switch (hit) {
    case 'fridge': openFridge(); break;
    case 'food': feed(el.dataset.f); break;
    case 'kettle': kettle(); break;
    case 'oven': bake(); break;
    case 'cuckoo': cuckoo(); break;
    case 'snowman': restart($('#snowArm'), 'wave'); SFX.jingle(); face('happy', 1500); say(pick(['Привет, снеговик!', 'Снеговик машет мне!']), { silent: true }); break;
    case 'jam': restart(el, 'hop'); SFX.pop(); joy(1); say(pick(['Варенье малиновое — бабушкино!', 'Абрикосовое, вишнёвое и черничное!']), { silent: true }); break;
    case 'teapot': restart(el, 'hop'); SFX.place(); say('Чайник из Гжели — бело-синий, как зима!', { silent: true }); break;
    case 'soup': for (let i = 0; i < 8; i++) setTimeout(() => spawnP('dot', 369 + rnd(-10, 10), 345, { c: '#fff', r: rnd(1.5, 3), vx: rnd(-6, 6), vy: -30, life: 1 }), i * 90); say(pick(['Варится компот!', 'Пахнет щами!']), { silent: true }); break;
    case 'klamp': { const l = $('#klamp'); l.style.transformBox = 'view-box'; l.style.transformOrigin = '175px -400px'; l.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(-2deg)' }, { transform: 'rotate(1deg)' }, { transform: 'rotate(0)' }], { duration: 1500, easing: 'ease-out' }); SFX.place(); break; }
    case 'bwindow': shootingStar(); face('o', 1200); say(pick(['Падающая звезда! Загадай желание!', 'Ух ты! Скорее загадывай!']), { silent: true }); break;
    case 'bed': if (!S.night) say('Пора баиньки!', { silent: true }); toggleNight(); break;
    case 'lamp': S.lamp = !S.lamp; syncLamp(); setMask(); tone(1300, .04, 'square', .08); say(S.lamp ? (S.night ? 'Смотри, звёзды на стенах!' : 'Ночник включён. Ночью будут звёзды!') : 'Ночник выключен', { silent: true }); save(); break;
    case 'musicbox':
      if (music && music.song === LULLABY) stopSong();
      else if (muted) toast('Включи звук, чтобы послушать шкатулку');
      else if (playSong(LULLABY, { room: 'bedroom', x: 72, y: 150 })) { $('#mbox').classList.add('on'); say(S.night ? 'Колыбельная… засыпаю…' : 'Колыбельная из шкатулки', { silent: true }); }
      break;
    case 'teddy': restart(el, 'hop'); tone(900, .12, 'sine', .2, 0, 1400); tone(1400, .15, 'sine', .15, .12, 900); joy(2); burst('heart', 30, 140, 5, { parent: '#fx', vy: -60, g: 20 }); say(pick(['Это мой мишка!', 'Мишка, спокойной ночи!']), { silent: true }); break;
    case 'wardrobe': $('#wardrobe').classList.add('open'); tone(210, .45, 'sawtooth', .03, 0, 140); setTimeout(() => { tab = 'acc'; if (sheet === 'decor') renderSheet(true); else openSheet('decor'); }, 380); say('Что наденем?', { silent: true }); break;
    case 'slippers': restart(el, 'hop'); SFX.pop(); say('Тапочки-зайчики! Жаль, у меня нет ножек', { silent: true }); break;
  }
}
$('#rooms').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; unlocked = true; if (b.dataset.room === room) { SFX.pop(); impulse(0, -.8); } else goRoom(b.dataset.room); });
document.addEventListener('keydown', e => {
  if (e.target && e.target.closest && e.target.closest('input')) return;
  if (e.key === 'Escape') { if (GAME) closeGame(); else if (sheet) closeSheet(); }
  else if (!GAME && !sheet && e.key === 'ArrowLeft') goRoom(ROOMS[room].left);
  else if (!GAME && !sheet && e.key === 'ArrowRight') goRoom(ROOMS[room].right);
});
function roomTick(now) {
  if (room === 'bedroom' && S.night && now > nextShoot) { nextShoot = now + rnd(14000, 26000); if (nextShoot && Math.random() < .8) shootingStar(); }
}

/* ---------------- SHEETS ---------------- */
let sheet = null, tab = 'looks', selOrn = 'ball', selCol = 'red', confirmClear = false, highVoice = true;
const VIEW_FULL = [0, 0, 400, 700], VIEW_TREE = [8, 112, 336, 544];
let view = VIEW_FULL.slice(), viewFrom = view.slice(), viewTo = view.slice(), viewT = 1;
function setView(v) { viewFrom = view.slice(); viewTo = v.slice(); viewT = 0; }
// close-up of the tree that matches the stage's shape, so a short or wide stage never falls back to the whole room
function treeView() {
  const r = $('#stage').getBoundingClientRect(), a = r.width / Math.max(1, r.height);
  // the ornaments tab needs every branch reachable, the other tabs get a tighter close-up
  const top = 108, full = 548, maxW = sheet === 'decor' && tab === 'orn' ? 560 : 430;
  let h = full, w = h * a;
  if (w > maxW) { w = maxW; h = w / a; }
  return [CX - w / 2, h >= full ? top - (h - full) / 2 : top, w, h];
}
// the room view always keeps the whole room width and the strip from the window tops to the rug, sized to the screen
function roomView() {
  const r = $('#stage').getBoundingClientRect(), a = r.width / Math.max(1, r.height);
  const y0 = 44, nw = 400, nh = 636;
  let w, h;
  if (a >= nw / nh) { h = nh; w = h * a; } else { w = nw; h = w / a; }
  return [200 - w / 2, y0 - (h - nh) * .6, w, h];
}
function updateView(dt) {
  if (viewT >= 1) return;
  viewT = Math.min(1, viewT + dt / .45); const e = 1 - Math.pow(1 - viewT, 3);
  view = viewFrom.map((a, i) => a + (viewTo[i] - a) * e); svg.setAttribute('viewBox', view.map(v => v.toFixed(2)).join(' '));
}
function openSheet(kind) {
  if (sheet === kind) { closeSheet(); return; }
  sheet = kind; confirmClear = false; bubble.hidden = true;
  $('#sheet').hidden = false; $('#stage').classList.add('zoom'); $('#app').classList.add('panel'); renderSheet(true); setView(treeView()); updateHUD();
}
function closeSheet() { sheet = null; $('#sheet').hidden = true; $('#stage').classList.remove('zoom'); $('#app').classList.remove('panel'); $('#wardrobe').classList.remove('open'); setView(roomView()); updateHUD(); }

const TOPCOL = { star: '#f2bd4b', ruby: '#d81f2c', comet: '#f2bd4b', flake: '#bfe6ff', heart: '#f06aa8', bow: '#d62f3a', santa: '#d62f3a', antlers: '#8a5a3b', crown: '#e8b33c', kokoshnik: '#3a7bd5', ushanka: '#8a6440', none: 'none' };
const STANDCOL = { bucket: '#b8262f', crate: '#a0693d', skirt: '#c62d3a', vase: '#e8b33c', basket: '#c9954f', drift: '#f4f8ff' };
function miniTree(look, oc) {
  const L = { ...DEF_LOOK, ...look }, c = TREECOL[L.color];
  const dots = [[31, 22], [24, 33], [38, 34], [19, 46], [31, 45], [44, 47]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${COLORS[oc[i % oc.length]][1]}"/>`).join('');
  const snow = L.snowLvl ? '<path d="M18 27Q31 31 44 27M12 41Q31 45 50 41M7 55Q31 59 55 55" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/>' : '';
  const tc = TOPCOL[L.topper];
  const top = L.topper === 'none' ? '' : GLOW_TOPS.includes(L.topper) ? `<path transform="translate(31 9)" d="${starPath(6, 2.6)}" fill="${tc}"/>` : `<path d="M24 14Q31 0 38 14Z" fill="${tc}"/>`;
  return `<svg viewBox="0 0 62 70"><path d="M31 7L46 30H16Z M31 18L52 44H10Z M31 30L58 58H4Z" fill="${c[1]}" stroke="${c[2]}" stroke-linejoin="round"/>${snow}${dots}<rect x="23" y="58" width="16" height="10" rx="2" fill="${STANDCOL[L.stand]}"/>${top}</svg>`;
}
function tile(k, v, name, pv) { const sel = String(S[k]) === String(v); return `<button class="tile ${sel ? 'sel' : ''}" data-k="${k}" data-v="${v}" aria-pressed="${sel}"><span class="pv">${pv}</span><span class="nm">${name}</span></button>`; }
function chips(k) { return `<div class="chips">${CAT[k].map(([v, n]) => `<button class="chip ${String(S[k]) === String(v) ? 'sel' : ''}" data-k="${k}" data-v="${v}">${n}</button>`).join('')}</div>`; }
const pvOrn = id => `<svg width="36" height="44" viewBox="-14 -18 28 36">${ornMarkup(id, selCol)}</svg>`;
function pvGarland(id) {
  const xs = [8, 16, 24, 32, 40], y = x => 9 + 5 * Math.sin(Math.PI * x / 48);
  const cols = id === 'rainbow' ? ['#ff4f5e', '#ffb347', '#ffe14d', '#4fdc7a', '#4fb0ff'] : id === 'none' ? ['#cfc4bb'] : GCOL[id];
  return `<svg width="50" height="22" viewBox="0 0 48 20"><path d="M2 6 Q24 18 46 6" stroke="${id === 'none' ? '#9a8a80' : '#2b3a2b'}" fill="none"/>` + xs.map((x, i) => (id === 'none' ? '' : `<circle cx="${x}" cy="${y(x)}" r="5" fill="${cols[i % cols.length]}" opacity=".35"/>`) + `<circle cx="${x}" cy="${y(x)}" r="${id === 'retro' ? 3.4 : 2.8}" fill="${cols[i % cols.length]}"/>`).join('') + '</svg>';
}
const pvTop = id => GLOW_TOPS.includes(id) ? `<svg width="42" height="42" viewBox="-22 -22 44 44">${topperMarkup(id)}</svg>` : id === 'none' ? '<svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 8L32 32H8Z" fill="none" stroke="#c9b9aa" stroke-width="2" stroke-dasharray="3 3"/></svg>' : `<svg width="44" height="44" viewBox="128 120 94 94">${hatMarkup(id)}</svg>`;
const pvColor = id => { const c = TREECOL[id]; return `<svg width="34" height="40" viewBox="0 0 34 40"><path d="M17 2L31 34H3Z" fill="${c[1]}" stroke="${c[2]}"/><path d="M17 2L25 20H9Z" fill="${c[0]}"/><rect x="14" y="34" width="6" height="5" fill="#6b3e22"/></svg>`; };
function pvTinsel(id) {
  const P = 'M3 8 Q24 26 45 8';
  if (TINSEL[id]) return `<svg width="48" height="24" viewBox="0 0 48 24"><path d="${P}" stroke="${TINSEL[id][0]}" stroke-width="7" stroke-dasharray="1.3 1.1" fill="none"/><path d="${P}" stroke="${TINSEL[id][1]}" stroke-width="1.3" fill="none"/></svg>`;
  const pts = Array.from({ length: 9 }, (_, i) => { const t = i / 8; return [3 + 42 * t, 8 + 18 * t * (1 - t) * 2]; });
  if (id === 'pearl' || id === 'goldbeads') return `<svg width="48" height="24" viewBox="0 0 48 24">${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${id === 'pearl' ? 'url(#pearl)' : 'url(#rg-gold)'}"/>`).join('')}</svg>`;
  if (id === 'chain') return `<svg width="48" height="24" viewBox="0 0 48 24">${pts.map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${i % 2 ? 1.3 : 3.6}" ry="${i % 2 ? 3.2 : 2.3}" fill="none" stroke="${['#e23b4a', '#f2bd4b', '#2fae66', '#3b8ee0'][i % 4]}" stroke-width="1.8"/>`).join('')}</svg>`;
  if (id === 'berries') return `<svg width="48" height="24" viewBox="0 0 48 24"><path d="${P}" stroke="#6b3e22" fill="none"/>${pts.filter((_, i) => i % 2 === 0).map(([x, y]) => `<circle cx="${x - 2}" cy="${y}" r="2.2" fill="url(#rg-red)"/><circle cx="${x + 2}" cy="${y}" r="2.2" fill="url(#rg-red)"/><circle cx="${x}" cy="${y + 2.6}" r="2.2" fill="url(#rg-red)"/>`).join('')}</svg>`;
  return `<svg width="48" height="24" viewBox="0 0 48 24"><path d="${P}" stroke="#cfc4bb" stroke-width="2" stroke-dasharray="3 3" fill="none"/></svg>`;
}
const pvStand = id => `<svg width="56" height="30" viewBox="92 582 166 70">${standMarkup(id)}</svg>`;
function pvScarf(id) {
  if (id === 'none') return '<svg width="48" height="32" viewBox="0 0 48 32"><path d="M4 10Q24 18 44 10L44 17Q24 25 4 17Z" fill="none" stroke="#c9b9aa" stroke-width="1.6" stroke-dasharray="3 3"/></svg>';
  const b = { red: ['#d62f3a', '#a3202b'], green: ['#2f9a57', '#1f6b3b'], stripes: ['#d62f3a', '#a3202b'], rainbow: ['#ff4f5e', '#b8303c'] }[id];
  const st = id === 'stripes' ? '<path d="M4 13.5Q24 21.5 44 13.5" stroke="#fff" stroke-width="7" stroke-dasharray="5 5" fill="none"/>' : id === 'rainbow' ? ['#ff4f5e', '#ffb02e', '#ffe14d', '#4fdc7a', '#4fb0ff'].map((c, i) => `<path d="M4 13.5Q24 21.5 44 13.5" stroke="${c}" stroke-width="7" stroke-dasharray="5 20" stroke-dashoffset="${-i * 5}" fill="none"/>`).join('') : '';
  return `<svg width="48" height="32" viewBox="0 0 48 32"><path d="M31 16L38 15L41 29L34 30Z" fill="${b[1]}"/><path d="M4 10Q24 18 44 10L44 17Q24 25 4 17Z" fill="${b[0]}"/>${st}</svg>`;
}
function pvGlasses(id) {
  const g = {
    none: '<path d="M6 14a7 7 0 1 0 14 0a7 7 0 1 0-14 0M28 14a7 7 0 1 0 14 0a7 7 0 1 0-14 0" fill="none" stroke="#c9b9aa" stroke-width="1.6" stroke-dasharray="3 3"/>',
    round: '<g fill="rgba(200,230,255,.3)" stroke="#2b1519" stroke-width="2"><circle cx="13" cy="14" r="8"/><circle cx="35" cy="14" r="8"/></g><path d="M21 13Q24 10 27 13" stroke="#2b1519" stroke-width="2" fill="none"/>',
    sun: '<path d="M4 8H22Q23 18 16 21H10Q3 19 4 8ZM26 8H44Q45 19 38 21H32Q25 18 26 8Z" fill="#1b1b2b"/><path d="M22 10Q24 8 26 10" stroke="#1b1b2b" stroke-width="2" fill="none"/>',
    hearts: '<path d="M13 23C2 17 3 6 9 6C11 6 13 8 13 10C13 8 15 6 17 6C23 6 24 17 13 23ZM35 23C24 17 25 6 31 6C33 6 35 8 35 10C35 8 37 6 39 6C45 6 46 17 35 23Z" fill="rgba(255,90,140,.5)" stroke="#e0315e" stroke-width="1.8"/>',
    party: `<path transform="translate(13 14)" d="${starPath(10, 5.5)}" fill="rgba(255,210,80,.45)" stroke="#e0a52a" stroke-width="1.8"/><path transform="translate(35 14)" d="${starPath(10, 5.5)}" fill="rgba(255,210,80,.45)" stroke="#e0a52a" stroke-width="1.8"/>`
  }[id];
  return `<svg width="48" height="28" viewBox="0 0 48 28">${g}</svg>`;
}
function renderSheet(fresh) {
  const H = $('#shHead'), B = $('#shBody');
  // keep horizontal rows, the tab strip and the body where they were, so picking an item does not jump back to the start
  const keep = { rows: [...B.querySelectorAll('.row')].map(r => r.scrollLeft), top: B.scrollTop, tabs: H.querySelector('.tabs')?.scrollLeft || 0 };
  if (sheet === 'decor') {
    const tabs = [['looks', 'Образы'], ['orn', 'Игрушки'], ['lights', 'Огоньки'], ['top', 'Макушка'], ['tree', 'Ёлка'], ['acc', 'Аксессуары']];
    H.innerHTML = `<div class="tabs" role="tablist">${tabs.map(([k, n]) => `<button class="tab ${tab === k ? 'on' : ''}" data-tab="${k}" role="tab" aria-selected="${tab === k}">${n}</button>`).join('')}</div><button class="done ic" data-act="close" aria-label="Готово"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button>`;
    if (tab === 'looks') B.innerHTML = `<p class="hint">Готовые образы целиком переодевают ёлку. Всё бесплатно — меняй сколько хочешь.</p>
      <div class="acts"><button class="btn main" data-act="random">${ICON.dice}Случайный наряд</button><button class="btn" data-act="reset">${ICON.undo}Как было</button></div>
      <div class="presets">${PRESETS.map(p => `<button class="preset" data-preset="${p.id}">${miniTree(p.look, p.oc)}<b>${p.name}</b></button>`).join('')}</div>`;
    else if (tab === 'orn') B.innerHTML = `<p class="hint">Выбери игрушку и цвет, потом нажми на ветку. Нажмёшь на игрушку на ёлке — она снимется.</p>
      <div class="row">${CAT.orn.map(([id, n]) => `<button class="tile ${selOrn === id ? 'sel' : ''}" data-orn="${id}"><span class="pv">${pvOrn(id)}</span><span class="nm">${n}</span></button>`).join('')}</div>
      <div class="sw-row">${Object.keys(COLORS).map(k => `<button class="sw ${selCol === k ? 'sel' : ''}" data-col="${k}" style="background:radial-gradient(circle at 35% 30%,${COLORS[k][0]},${COLORS[k][1]} 60%,${COLORS[k][2]})" aria-label="${k}"></button>`).join('')}</div>
      <div class="acts"><button class="btn" data-act="fill">Развесить</button><button class="btn" data-act="undo">Отменить</button><button class="btn ${confirmClear ? 'warn' : ''}" data-act="clear">${confirmClear ? 'Точно снять всё?' : 'Снять всё'}</button><span class="cnt" id="ornCnt">${S.orn.length} / 40</span></div>`;
    else if (tab === 'lights') B.innerHTML = `<div class="lbl">Гирлянда</div><div class="row">${CAT.garland.map(([v, n]) => tile('garland', v, n, pvGarland(v))).join('')}</div><div class="lbl">Как горит</div>${chips('gmode')}`;
    else if (tab === 'top') B.innerHTML = `<p class="hint">Звёзды светятся в темноте, а шапки и короны можно примерить для смеха.</p><div class="row">${CAT.topper.map(([v, n]) => tile('topper', v, n, pvTop(v))).join('')}</div>`;
    else if (tab === 'tree') B.innerHTML = `<div class="lbl">Цвет хвои</div><div class="row">${CAT.color.map(([v, n]) => tile('color', v, n, pvColor(v))).join('')}</div>
      <div class="lbl">Снег на ветках</div>${chips('snowLvl')}
      <div class="lbl">Мишура и бусы</div><div class="row">${CAT.tinsel.map(([v, n]) => tile('tinsel', v, n, pvTinsel(v))).join('')}</div>
      <div class="lbl">Подставка</div><div class="row">${CAT.stand.map(([v, n]) => tile('stand', v, n, pvStand(v))).join('')}</div>`;
    else B.innerHTML = `<div class="lbl">Шарф</div><div class="row">${CAT.scarf.map(([v, n]) => tile('scarf', v, n, pvScarf(v))).join('')}</div>
      <div class="lbl">Очки</div><div class="row">${CAT.glasses.map(([v, n]) => tile('glasses', v, n, pvGlasses(v))).join('')}</div>
      <div class="lbl">Глаза</div><div class="sw-row">${CAT.eyes.map(([v, c]) => `<button class="sw ${S.eyes === v ? 'sel' : ''}" data-k="eyes" data-v="${v}" style="background:radial-gradient(circle,${c} 0 42%,#fff 45%)" aria-label="Цвет глаз"></button>`).join('')}</div>
      ${chips('lashes')}<div class="lbl">Нос</div>${chips('nose')}<div class="lbl">Щёчки</div>${chips('cheeks')}`;
  } else if (sheet === 'games') {
    H.innerHTML = '<div class="sh-title">Мини-игры</div><button class="done" data-act="close">Закрыть</button>';
    const b = S.best;
    B.innerHTML = `<div class="gcards">
      <button class="gcard" data-game="catch"><svg viewBox="0 0 54 54"><rect width="54" height="54" rx="14" fill="#1b2550"/><rect x="18" y="8" width="16" height="14" rx="2" fill="#c62d3a"/><rect x="24.5" y="8" width="3" height="14" fill="#f2c14e"/><path d="M12 32H42Q46 46 27 47Q8 46 12 32Z" fill="#b8262f"/><ellipse cx="27" cy="32" rx="15" ry="3.5" fill="#f2bd4b"/></svg><span class="tx"><b>Мешок подарков</b><span>Лови подарки, уголь пропускай. ${b.catch ? 'Рекорд: ' + b.catch : 'Рекорда пока нет'}</span></span><span class="play">Играть</span></button>
      <button class="gcard" data-game="simon"><svg viewBox="0 0 54 54"><rect width="54" height="54" rx="14" fill="#1b2550"/><path d="M4 14Q27 30 50 14" stroke="#6f8a74" fill="none"/><ellipse cx="13" cy="26" rx="5" ry="7" fill="#ff4f5e"/><ellipse cx="27" cy="31" rx="5" ry="7" fill="#ffd447"/><ellipse cx="41" cy="26" rx="5" ry="7" fill="#4fdc7a" opacity=".45"/></svg><span class="tx"><b>Гирлянда-повторяшка</b><span>Запомни, как мигают огоньки. ${b.simon ? 'Рекорд: ' + b.simon + ' ' + plural(b.simon, ['раунд', 'раунда', 'раундов']) : 'Рекорда пока нет'}</span></span><span class="play">Играть</span></button>
      <button class="gcard" data-game="memory"><svg viewBox="0 0 54 54"><rect width="54" height="54" rx="14" fill="#1b2550"/><rect x="9" y="12" width="16" height="22" rx="3" fill="#c62d3a"/><path d="M17 12V34M9 23H25" stroke="#f2c14e" stroke-width="2.4"/><rect x="29" y="18" width="16" height="22" rx="3" fill="#fffaf1"/><circle cx="37" cy="30" r="5" fill="url(#rg-blue)"/></svg><span class="tx"><b>Пары игрушек</b><span>Найди одинаковые игрушки. ${b.memory ? 'Лучший результат: ' + b.memory + ' ' + plural(b.memory, ['ход', 'хода', 'ходов']) : 'Рекорда пока нет'}</span></span><span class="play">Играть</span></button>
    </div>`;
  } else if (sheet === 'say') {
    H.innerHTML = '<div class="sh-title">Скажи ёлке</div><button class="done" data-act="close">Закрыть</button>';
    const quick = ['С Новым годом!', 'Ты самая красивая!', 'Хочу подарок!', 'Дед Мороз, приходи!', 'Я тебя люблю'];
    B.innerHTML = `<p class="hint">Напиши что-нибудь — ёлка повторит своим голосом.</p>
      <form class="say-row" id="sayForm" autocomplete="off"><input id="sayIn" maxlength="120" placeholder="Привет, ёлочка!" enterkeyhint="send"><button class="btn main" type="submit">Повтори!</button></form>
      <div class="chips">${quick.map(q => `<button class="chip" data-quick="${q}">${q}</button>`).join('')}</div>
      <div class="lbl">Голос ёлки</div><div class="chips">${[['high', 'Тоненький'], ['low', 'Басом'], ['off', 'Без слов']].map(([v, n]) => `<button class="chip ${S.voice === v ? 'sel' : ''}" data-voice="${v}">${n}</button>`).join('')}</div>
      <p class="hint">Этим голосом ёлка произносит всё, что говорит. «Без слов» — смешно лопочет.</p>`;
    $('#sayForm').addEventListener('submit', ev => { ev.preventDefault(); const v = $('#sayIn').value.trim(); if (!v) { $('#sayIn').focus(); return; } repeat(v); $('#sayIn').value = ''; });
    $('#sayIn').addEventListener('focus', () => face('listen', 4000));
    $('#sayIn').addEventListener('input', () => { face('listen', 3000); lookP = { x: CX, y: 700 }; lookUntil = performance.now() + 2000; });
  }
  B.classList.toggle('fade', !!fresh);
  if (fresh) B.scrollTop = 0; else { B.querySelectorAll('.row').forEach((r, i) => r.scrollLeft = keep.rows[i] || 0); B.scrollTop = keep.top; }
  const tb = H.querySelector('.tabs');
  if (tb) { tb.scrollLeft = keep.tabs; const on = tb.querySelector('.on'); if (on) { const l = on.offsetLeft, r = l + on.offsetWidth; if (l < tb.scrollLeft) tb.scrollLeft = l - 8; else if (r > tb.scrollLeft + tb.clientWidth - 24) tb.scrollLeft = r - tb.clientWidth + 32; } }
}
function repeat(text) { unlocked = true; if (S.night) wakeUntil = performance.now() + 4000 + text.length * 90; joy(3); impulse(10); say(text, { tts: true }); }
const POOF_AT = { topper: [[CX, 158]], scarf: [[110, 466], [240, 470]], glasses: [[CX, 390]], nose: [[CX, 407]], cheeks: [[148, 414], [202, 414]], eyes: [[152, 388], [198, 388]], lashes: [[152, 380], [198, 380]], stand: [[CX, 612]] };
function celebrate(points) { SFX.poof(); face('happy', 1600); impulse(rnd(-25, 25), -.9); points.forEach(([x, y], i) => setTimeout(() => poof(x, y, 14), i * 90)); if (Math.random() < .35) say(pick(PH.decor), { silent: true }); }
function applyLook(k, raw) {
  const v = k === 'snowLvl' ? Number(raw) : k === 'lashes' ? raw === 'true' : raw;
  if (S[k] === v) return; S[k] = v;
  if (k === 'color' || k === 'snowLvl') { renderTiers(); updateHUD(); }
  else if (k === 'tinsel') renderTinsel();
  else if (k === 'garland') { renderLights(); setGlowSizes(); }
  else if (k === 'topper') { renderTopper(); topSpin = 14; }
  else if (k === 'scarf') renderScarf();
  else if (k === 'stand') renderStand();
  else if (k !== 'gmode') renderFace();
  celebrate(POOF_AT[k] || [[CX, 260], [110, 420], [240, 500]]);
  save();
}
function applyLookAll(look, orn) {
  Object.assign(S, DEF_LOOK, look); S.orn = orn;
  renderTree('stagger'); setGlowSizes(); updateHUD(); topSpin = 18; impulse(0, -1.4);
  SFX.poof(); face('happy', 2200); [[CX, 200], [110, 400], [240, 400], [CX, 540]].forEach(([x, y], i) => setTimeout(() => poof(x, y, 16), i * 120));
  save(); if (sheet === 'decor') renderSheet();
}
function applyPreset(p) { applyLookAll(p.look, presetOrn(p)); say(`Образ «${p.name}»!`, { silent: true }); }
function randomLook() {
  const look = {}; for (const k of LOOK_KEYS) look[k] = pick(CAT[k])[0];
  if (Math.random() < .5) look.glasses = 'none'; if (Math.random() < .6) look.nose = 'none';
  const ot = shuffle(CAT.orn.map(o => o[0])).slice(0, 3), oc = shuffle(Object.keys(COLORS)).slice(0, 3);
  applyLookAll(look, presetOrn({ ot, oc }));
}
$('#sheet').addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.act === 'close') return closeSheet();
  if (t.dataset.tab) { tab = t.dataset.tab; confirmClear = false; renderSheet(true); setView(treeView()); return; }
  if (t.dataset.preset) return applyPreset(PRESETS.find(p => p.id === t.dataset.preset));
  if (t.dataset.act === 'random') { randomLook(); say('Вот это поворот!', { silent: true }); return; }
  if (t.dataset.act === 'reset') return applyPreset(PRESETS[0]);
  if (t.dataset.orn) { selOrn = t.dataset.orn; SFX.pop(); return renderSheet(); }
  if (t.dataset.col) { selCol = t.dataset.col; SFX.pop(); return renderSheet(); }
  if (t.dataset.k) { applyLook(t.dataset.k, t.dataset.v); return renderSheet(); }
  if (t.dataset.game) return openGame(t.dataset.game);
  if (t.dataset.quick) return repeat(t.dataset.quick);
  if (t.dataset.voice) { S.voice = t.dataset.voice; save(); face('happy', 1200); say(S.voice === 'high' ? 'Вот так я разговариваю!' : S.voice === 'low' ? 'А вот так, басом!' : 'Ля-ля-ля!'); return renderSheet(); }
  if (t.dataset.act === 'undo') { if (S.orn.length) { const o = removeOrn(S.orn.length - 1); SFX.pop(); burst('spark', o.x, o.y, 5, { g: 40, c: '#fff' }); save(); } return; }
  if (t.dataset.act === 'fill') {
    // reserve all spots first so two new ornaments never land on the same branch
    const spots = [];
    for (let i = 0; i < 8 && S.orn.length < 40; i++) { const sp = freeSpot(); if (!sp) break; spots.push(sp); S.orn.push({ t: selOrn, c: selCol, ...sp }); }
    S.orn.splice(S.orn.length - spots.length, spots.length);
    const n = spots.length;
    spots.forEach((sp, i) => setTimeout(() => { if (S.orn.length < 40) { addOrn({ t: selOrn, c: i % 3 ? selCol : pick(Object.keys(COLORS)), ...sp }); SFX.place(); ripple(sp.x, sp.y, 'rgba(255,230,160,.9)'); save(); } }, i * 90));
    if (!n) toast('Свободных веток не осталось — сними пару игрушек'); else face('happy', 2000);
    return;
  }
  if (t.dataset.act === 'clear') { if (!confirmClear) { confirmClear = true; return renderSheet(); } S.orn.forEach(o => burst('spark', o.x, o.y, 2, { g: 60, c: '#fff' })); S.orn = []; confirmClear = false; renderOrns(); SFX.whoosh(); save(); face('o', 1500); say('Ой, я совсем голенькая!', { silent: true }); return renderSheet(); }
});
$('#dock').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return; unlocked = true; lastAct = performance.now();
  const k = b.dataset.dock;
  if (k === 'water') water(); else if (k === 'night') toggleNight(); else openSheet(k);
});
$('#sndBtn').addEventListener('click', () => { muted = !muted; if (muted) { stopSong(); try { speechSynthesis.cancel(); } catch (e) { } } else { unlocked = true; ac(); SFX.place(); } updateHUD(); });
$('#mood').addEventListener('click', () => { const [, txt] = moodState(performance.now()); toast(`Ёлка ${txt}. Поливай её, гладь, играй с ней и не забывай укладывать спать.`); });
$('#mW').addEventListener('click', () => toast(`Вода: ${Math.round(S.water)}%. Нажми «Полить», когда ёлке захочется пить.`));
$('#mJ').addEventListener('click', () => toast(`Радость: ${Math.round(S.joy)}%. Гладь ёлку, наряжай, открывай подарки и играй.`));
$('#mE').addEventListener('click', () => toast(`Бодрость: ${Math.round(S.energy)}%. Нажми «Спать», чтобы ёлка отдохнула.`));

// drag the bottom sheet down by its handle to close it, like a native phone sheet
(function sheetDrag() {
  const sh = $('#sheet'), grab = $('#grab'); let y0 = null, dy = 0;
  grab.addEventListener('pointerdown', e => { y0 = e.clientY; dy = 0; sh.style.transition = 'none'; try { grab.setPointerCapture(e.pointerId); } catch (err) { } });
  grab.addEventListener('pointermove', e => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); sh.style.transform = `translateY(${dy}px)`; });
  const end = () => { if (y0 === null) return; y0 = null; sh.style.transition = 'transform .2s'; sh.style.transform = ''; if (dy > 60) closeSheet(); else if (dy < 6) closeSheet(); };
  grab.addEventListener('pointerup', end); grab.addEventListener('pointercancel', () => { y0 = null; sh.style.transform = ''; });
})();

/* ---------------- MINI-GAMES ---------------- */
const gArea = $('#gArea');
let GAME = null, lastGame = null, bgRaf = 0;
function startBackdrop() {
  const cv = $('#gBg'), ctx = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = cv.clientWidth, H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  seed = 3; const rows = [];
  [['#1e2a55', .62, .78, 26, 46, .25], ['#121834', .72, .86, 34, 60, .38]].forEach(([fill, t0, t1, w0, w1, lit]) => {
    const row = { fill, b: [] }; let x = -10;
    while (x < W + 10) { const w = w0 + srnd() * (w1 - w0), top = H * (t0 + srnd() * (t1 - t0)), wins = []; for (let wy = top + 10; wy < H - 40; wy += 16) for (let wx = x + 6; wx < x + w - 8; wx += 12) if (srnd() < lit) wins.push([wx, wy, srnd() < .15 ? pick(['#ff8f8f', '#9fe6a8', '#9fc8ff']) : '#ffd98a']); row.b.push({ x, w, top, wins }); x += w + 3 + srnd() * 8; }
    rows.push(row);
  });
  const stars = Array.from({ length: 40 }, () => [srnd() * W, srnd() * H * .55, .5 + srnd() * 1.2, srnd() * 6]);
  const fl = Array.from({ length: 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: rnd(.8, 2.6), v: rnd(15, 45), ph: rnd(0, 6) }));
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#0a1230'); sky.addColorStop(1, '#3a4a82');
  let last = performance.now();
  const loop = now => {
    const dt = Math.min(.05, (now - last) / 1000), t = now / 1000; last = now;
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    for (const [x, y, r, p] of stars) { ctx.globalAlpha = .45 + .45 * Math.sin(t * 1.6 + p); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
    const mx = W * .8, my = H * .14, mg = ctx.createRadialGradient(mx, my, 4, mx, my, 70); mg.addColorStop(0, 'rgba(255,246,207,.7)'); mg.addColorStop(1, 'rgba(255,246,207,0)');
    ctx.fillStyle = mg; ctx.fillRect(mx - 70, my - 70, 140, 140); ctx.fillStyle = '#fdf3c8'; ctx.beginPath(); ctx.arc(mx, my, 20, 0, 7); ctx.fill();
    rows.forEach((row, ri) => { for (const b of row.b) { ctx.fillStyle = row.fill; ctx.fillRect(b.x, b.top, b.w, H - b.top); for (const [wx, wy, c] of b.wins) { ctx.fillStyle = c; ctx.globalAlpha = .75; ctx.fillRect(wx, wy, 5, 7); } ctx.globalAlpha = 1; } if (ri === 0) { const tx = W * .42; ctx.fillStyle = row.fill; ctx.fillRect(tx, H * .5, 18, H * .5); ctx.beginPath(); ctx.moveTo(tx - 3, H * .5 + 4); ctx.lineTo(tx + 9, H * .44); ctx.lineTo(tx + 21, H * .5 + 4); ctx.fill(); ctx.fillStyle = '#ff3b3b'; ctx.beginPath(); ctx.arc(tx + 9, H * .435, 4, 0, 7); ctx.fill(); } });
    ctx.fillStyle = '#dfe8f5'; ctx.beginPath(); ctx.moveTo(0, H - 34); ctx.quadraticCurveTo(W * .3, H - 54, W * .6, H - 36); ctx.quadraticCurveTo(W * .85, H - 24, W, H - 42); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    for (const f of fl) { f.y += f.v * dt; f.x += Math.sin(t + f.ph) * .3; if (f.y > H) { f.y = -4; f.x = Math.random() * W; } ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 7); ctx.fill(); }
    bgRaf = requestAnimationFrame(loop);
  };
  cancelAnimationFrame(bgRaf); bgRaf = requestAnimationFrame(loop);
}
function openGame(id) {
  closeSheet(); stopSong();
  const g = $('#game'); g.hidden = false; g.classList.remove('in'); void g.offsetWidth; g.classList.add('in');
  $('#gResult').hidden = true;
  GAME = GAMES[id]; $('#gTitle').textContent = GAME.title; $('#gScore').innerHTML = '';
  requestAnimationFrame(() => { startBackdrop(); GAME.start(); });
}
function closeGame() { if (GAME) GAME.stop(); GAME = null; cancelAnimationFrame(bgRaf); $('#game').hidden = true; gArea.innerHTML = ''; }
const starSVG = on => `<svg viewBox="-12 -12 24 24" class="${on ? '' : 'off'}"><path d="${starPath(11, 4.8)}" fill="#f2bd4b" stroke="#a8741a" stroke-width="1" stroke-linejoin="round"/></svg>`;
function finishGame(o) {
  if (!GAME) return; GAME.stop(); lastGame = GAME;
  const prev = S.best[o.key]; let rec = false;
  if (o.higher) { if (o.score > prev) { S.best[o.key] = o.score; rec = o.score > 0; } }
  else if (!prev || o.score < prev) { S.best[o.key] = o.score; rec = true; }
  const gain = 6 + o.stars * 6; joy(gain); save(); updateHUD();
  (o.stars > 0 ? SFX.win : SFX.lose)();
  const r = $('#gResult'); r.hidden = false;
  r.innerHTML = `<div class="rcard"><svg class="mascot" viewBox="0 -2 30 32">${moodSVG(o.stars ? 'happy' : 'smile')}</svg><h3>${rec ? 'Новый рекорд!' : o.stars >= 2 ? 'Здорово!' : o.stars ? 'Неплохо!' : 'Попробуй ещё'}</h3>
    <div class="stars">${[1, 2, 3].map(i => starSVG(i <= o.stars)).join('')}</div><p>${o.label}</p><p>${S.best[o.key] ? o.bestLabel(S.best[o.key]) : 'Рекорда пока нет'}</p>
    <div class="earn"><svg viewBox="0 0 16 16"><path fill="#ff6f8f" d="M8 14C2 10 1 6.6 2.6 4.4 4 2.6 6.6 2.8 8 4.8c1.4-2 4-2.2 5.4-.4C15 6.6 14 10 8 14z"/></svg>Радость ёлки +${gain}</div>
    <div class="acts"><button class="btn" data-r="again">Ещё раз</button><button class="btn main" data-r="home">К ёлке</button></div></div>`;
  if (o.stars >= 2) { const c = r.querySelector('.rcard').getBoundingClientRect(); for (let i = 0; i < 26; i++) { const d = document.createElement('i'); d.style.cssText = `position:fixed;left:${c.left + c.width / 2}px;top:${c.top + 30}px;width:7px;height:11px;border-radius:2px;background:${pick(CONF)};z-index:60;pointer-events:none`; document.body.appendChild(d); const a = rnd(-Math.PI, 0), s = rnd(120, 260); d.animate([{ transform: 'translate(0,0) rotate(0)' }, { transform: `translate(${Math.cos(a) * s}px,${Math.sin(a) * s + 260}px) rotate(${rnd(-720, 720)}deg)`, opacity: 0 }], { duration: rnd(1200, 1900), easing: 'cubic-bezier(.2,.6,.4,1)' }).onfinish = () => d.remove(); } }
  r.querySelector('[data-r="again"]').onclick = () => { r.hidden = true; GAME = lastGame; GAME.start(); };
  r.querySelector('[data-r="home"]').onclick = () => { closeGame(); face('happy', 2500); impulse(0, -1); burst('heart', CX, 400, 8, { vy: -90, g: 30 }); say(o.stars ? 'Спасибо за игру! Мне так весело!' : 'Ничего, в следующий раз получится!', { silent: true }); };
}
$('#gClose').addEventListener('click', closeGame);

function rr(ctx, x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
function cStar(ctx, R, fill) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? R * .44 : R; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = 'rgba(120,70,10,.6)'; ctx.lineWidth = 1.5; ctx.stroke(); }
const Catch = {
  title: 'Мешок подарков',
  start() {
    gArea.innerHTML = '<canvas></canvas><p class="g-hint" id="gHint">Води пальцем по экрану. Лови подарки и игрушки, уголь не лови!</p>';
    const cv = gArea.querySelector('canvas'), ctx = cv.getContext('2d'), R = gArea.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = R.width, H = R.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const k = clamp(W / 390, .85, 1.3), bw = 92 * k, by = H - 84 * k, sp = clamp(H / 640, .8, 1.4);
    const s = this.s = { x: W / 2, tx: W / 2, items: [], pops: [], sparks: [], score: 0, lives: 3, combo: 0, t: 0, next: 1, last: performance.now(), over: false, shake: 0, squash: 0, slow: 0 };
    const mv = e => { const r = cv.getBoundingClientRect(); s.tx = clamp(e.clientX - r.left, bw / 2, W - bw / 2); const h = $('#gHint'); if (h) h.style.opacity = 0; };
    cv.addEventListener('pointerdown', mv); cv.addEventListener('pointermove', mv);
    const mult = () => 1 + Math.min(2, Math.floor(s.combo / 5));
    const hud = () => { $('#gScore').innerHTML = `<b>${s.score}</b>${mult() > 1 ? `<span class="combo">×${mult()}</span>` : ''}<span class="lives">${'♥'.repeat(Math.max(0, s.lives))}<i>${'♥'.repeat(3 - Math.max(0, s.lives))}</i></span>`; };
    hud();
    const lose = (x, y, txt) => { s.lives--; s.combo = 0; s.shake = .35; SFX.buzz(); s.pops.push({ x, y, txt, c: '#ff9a9a', l: 1 }); hud(); };
    const loop = now => {
      if (s.over) return;
      const rdt = Math.min(.05, (now - s.last) / 1000); s.last = now; if (s.slow > 0) s.slow -= rdt;
      const dt = rdt * (s.slow > 0 ? .45 : 1); s.t += dt;
      s.x += (s.tx - s.x) * Math.min(1, rdt * 16); s.squash *= Math.pow(.02, rdt);
      s.next -= dt;
      if (s.next <= 0) {
        s.next = Math.max(.32, .9 - s.t * .012) * rnd(.7, 1.25);
        const pc = Math.min(.32, .13 + s.t * .004), r = Math.random();
        const type = r < pc ? 'coal' : r < pc + .02 && s.lives < 3 ? 'life' : r < pc + .04 ? 'flake' : r < pc + .11 ? 'star' : r < pc + .52 ? 'gift' : 'ball';
        s.items.push({ type, x: rnd(26, W - 26), y: -30, vy: (130 + s.t * 4.5 + rnd(0, 60)) * sp, rot: rnd(-.4, .4), vr: rnd(-2, 2), gi: Math.floor(Math.random() * 4), c: pick(['red', 'gold', 'blue', 'purple', 'green', 'pink']) });
      }
      for (const it of s.items) {
        it.y += it.vy * dt; it.rot += it.vr * dt;
        if (!it.done && it.y > by - 12 && it.y < by + 24 && Math.abs(it.x - s.x) < bw / 2 + 4) {
          it.done = true; s.squash = 1;
          if (it.type === 'coal') lose(it.x, by - 24, 'Уголь!');
          else if (it.type === 'life') { s.lives = Math.min(3, s.lives + 1); SFX.chime(); s.pops.push({ x: it.x, y: by - 24, txt: '+♥', c: '#ff8fb0', l: 1 }); hud(); }
          else if (it.type === 'flake') { s.slow = 4; SFX.chime(); s.pops.push({ x: it.x, y: by - 24, txt: 'Замедление!', c: '#bfe6ff', l: 1.2 }); }
          else { s.combo++; const v = (it.type === 'star' ? 5 : it.type === 'gift' ? 2 : 1) * mult(); s.score += v; (it.type === 'star' ? SFX.chime : SFX.place)(); s.pops.push({ x: it.x, y: by - 24, txt: '+' + v, c: '#ffe08a', l: 1 }); hud(); }
          for (let i = 0; i < 8; i++) s.sparks.push({ x: it.x, y: by - 6, vx: rnd(-90, 90), vy: rnd(-160, -40), l: rnd(.4, .8), c: it.type === 'coal' ? '#555' : pick(CONF) });
        }
        if (!it.done && it.y > H + 24) { it.done = true; if (it.type === 'gift') lose(it.x, H - 40, 'Упал!'); }
      }
      s.items = s.items.filter(i => !i.done);
      ctx.save(); ctx.clearRect(0, 0, W, H);
      if (s.shake > 0) { s.shake -= rdt; ctx.translate(rnd(-5, 5), rnd(-4, 4)); }
      if (s.slow > 0) { ctx.fillStyle = `rgba(191,230,255,${Math.min(.18, s.slow * .06)})`; ctx.fillRect(0, 0, W, H); }
      for (const it of s.items) {
        ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot);
        if (it.type === 'gift') { const z = 30 * k, gc = GIFTS[it.gi]; ctx.fillStyle = gc.c; rr(ctx, -z / 2, -z / 2, z, z, 3); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.fillRect(z * .22, -z / 2, z * .28, z); ctx.fillStyle = gc.r; ctx.fillRect(-z * .09, -z / 2, z * .18, z); ctx.fillRect(-z / 2, -z * .09, z, z * .18); ctx.beginPath(); ctx.ellipse(-z * .2, -z / 2 - 3, z * .2, z * .11, -.5, 0, 7); ctx.ellipse(z * .2, -z / 2 - 3, z * .2, z * .11, .5, 0, 7); ctx.fill(); }
        else if (it.type === 'ball') { const r = 13 * k, C = COLORS[it.c], g = ctx.createRadialGradient(-r * .35, -r * .4, 1, 0, 0, r); g.addColorStop(0, C[0]); g.addColorStop(.55, C[1]); g.addColorStop(1, C[2]); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.fillStyle = '#e5bf55'; ctx.fillRect(-3.5, -r - 4, 7, 5); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.ellipse(-r * .35, -r * .4, r * .28, r * .16, -.6, 0, 7); ctx.fill(); }
        else if (it.type === 'star') { const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 30 * k); g.addColorStop(0, 'rgba(255,224,138,.6)'); g.addColorStop(1, 'rgba(255,224,138,0)'); ctx.fillStyle = g; ctx.fillRect(-30 * k, -30 * k, 60 * k, 60 * k); cStar(ctx, 17 * k, '#ffd24a'); }
        else if (it.type === 'life') { ctx.scale(1.6 * k, 1.6 * k); ctx.fillStyle = '#ff6f8f'; ctx.beginPath(); ctx.moveTo(0, 7); ctx.bezierCurveTo(-12, -1, -8, -10, 0, -4); ctx.bezierCurveTo(8, -10, 12, -1, 0, 7); ctx.fill(); }
        else if (it.type === 'flake') { ctx.strokeStyle = '#dff3ff'; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; for (let i = 0; i < 6; i++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -15 * k); ctx.moveTo(0, -9 * k); ctx.lineTo(-4 * k, -13 * k); ctx.moveTo(0, -9 * k); ctx.lineTo(4 * k, -13 * k); ctx.stroke(); } }
        else { const r = 14 * k; ctx.fillStyle = '#1a1617'; ctx.beginPath(); for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, q = r * (i % 2 ? .82 : 1); ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,140,90,.55)'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#4a4245'; ctx.beginPath(); ctx.arc(-r * .3, -r * .3, r * .25, 0, 7); ctx.fill(); }
        ctx.restore();
      }
      const x = s.x, sqx = 1 + s.squash * .12, sqy = 1 - s.squash * .1;
      ctx.save(); ctx.translate(x, by); ctx.scale(sqx, sqy);
      ctx.fillStyle = '#b8262f'; ctx.beginPath(); ctx.moveTo(-bw / 2, 0); ctx.quadraticCurveTo(-bw / 2 - 12 * k, 52 * k, 0, 56 * k); ctx.quadraticCurveTo(bw / 2 + 12 * k, 52 * k, bw / 2, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.beginPath(); ctx.moveTo(bw * .15, 0); ctx.quadraticCurveTo(bw / 2 + 12 * k, 52 * k, 0, 56 * k); ctx.quadraticCurveTo(bw * .3, 40 * k, bw * .15, 0); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.85)'; [[-.25, .45], [.2, .3], [.05, .7], [.3, .65], [-.3, .75]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a * bw, b * 50 * k, 2.2 * k, 0, 7); ctx.fill(); });
      ctx.fillStyle = '#5a0f16'; ctx.beginPath(); ctx.ellipse(0, 0, bw / 2, 8 * k, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = '#f2bd4b'; ctx.lineWidth = 4 * k; ctx.beginPath(); ctx.ellipse(0, 0, bw / 2, 8 * k, 0, 0, 7); ctx.stroke();
      ctx.restore();
      for (const p of s.sparks) { p.l -= rdt; p.vy += 400 * rdt; p.x += p.vx * rdt; p.y += p.vy * rdt; ctx.globalAlpha = Math.max(0, p.l * 1.5); ctx.fillStyle = p.c; ctx.fillRect(p.x - 2, p.y - 2, 4, 4); }
      s.sparks = s.sparks.filter(p => p.l > 0);
      ctx.font = `700 ${20 * k}px Rubik, sans-serif`; ctx.textAlign = 'center';
      for (const p of s.pops) { p.l -= rdt * 1.2; p.y -= rdt * 40; ctx.globalAlpha = Math.max(0, Math.min(1, p.l)); ctx.fillStyle = p.c; ctx.fillText(p.txt, p.x, p.y); }
      ctx.globalAlpha = 1; s.pops = s.pops.filter(p => p.l > 0);
      ctx.restore();
      if (s.lives <= 0) { s.over = true; const st = s.score >= 60 ? 3 : s.score >= 30 ? 2 : s.score >= 10 ? 1 : 0; setTimeout(() => { if (GAME === Catch && this.s === s) finishGame({ score: s.score, stars: st, key: 'catch', higher: true, label: `Очков: ${s.score}`, bestLabel: b => `Рекорд: ${b}` }); }, 500); return; }
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  },
  stop() { cancelAnimationFrame(this.raf); if (this.s) this.s.over = true; }
};
const SIMON_F = [523.25, 659.25, 783.99, 1046.5];
const Simon = {
  title: 'Гирлянда-повторяшка',
  start() {
    gArea.innerHTML = `<div class="simon" id="simon"><svg class="wire" viewBox="0 0 300 90" preserveAspectRatio="none"><path d="M-10 20 Q75 90 150 45 Q225 0 310 55" stroke="#2c4a33" stroke-width="2.5" fill="none" vector-effect="non-scaling-stroke"/></svg>
      <div class="bulbs">${[0, 1, 2, 3].map(i => `<button class="sb sb${i}" data-i="${i}" aria-label="Огонёк ${i + 1}"></button>`).join('')}</div><div class="s-dots" id="sDots"></div><p class="s-msg" id="sMsg">Смотри, как мигают огоньки…</p></div>`;
    this.seq = []; this.alive = true; this.acc = false; this.timers = []; this.idx = 0; this.lives = 2;
    gArea.querySelectorAll('.sb').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); this.press(+b.dataset.i); }));
    this.hud(); this.later(() => this.next(), 800);
  },
  later(f, ms) { this.timers.push(setTimeout(() => { if (this.alive) f(); }, ms)); },
  msg(t) { const m = $('#sMsg'); if (m) m.textContent = t; },
  dots() { const d = $('#sDots'); if (d) d.innerHTML = this.seq.map((_, i) => `<i class="${i < this.idx ? 'ok' : ''}"></i>`).join(''); },
  hud() { $('#gScore').innerHTML = `Раунд <b>${Math.max(1, this.seq.length)}</b><span class="lives">${'♥'.repeat(this.lives)}<i>${'♥'.repeat(2 - this.lives)}</i></span>`; },
  flash(i, ms) { const b = gArea.querySelectorAll('.sb')[i]; if (!b) return; b.classList.add('on'); tone(SIMON_F[i], ms / 1000, 'triangle', .2); tone(SIMON_F[i] * 2, ms / 1500, 'sine', .05); setTimeout(() => b.classList.remove('on'), ms); },
  play() {
    this.acc = false; this.idx = 0; this.dots(); this.msg('Смотри…');
    const gap = Math.max(280, 640 - this.seq.length * 30);
    this.seq.forEach((v, k) => this.later(() => this.flash(v, gap * .7), 450 + k * gap));
    this.later(() => { this.acc = true; this.msg('Теперь ты!'); }, 450 + this.seq.length * gap);
  },
  next() { this.seq.push(Math.floor(Math.random() * 4)); this.hud(); this.play(); },
  press(i) {
    if (!this.acc) return; this.flash(i, 230);
    if (i === this.seq[this.idx]) {
      this.idx++; this.dots();
      if (this.idx === this.seq.length) { this.acc = false; this.msg(pick(['Верно!', 'Отлично!', 'Здорово!', 'Умница!'])); this.later(() => [0, 1, 2, 3].forEach(j => this.flash(j, 180)), 250); this.later(() => this.next(), 900); }
    } else {
      this.acc = false; SFX.buzz(); this.lives--; this.hud();
      const sm = $('#simon'); sm.classList.remove('bad'); void sm.offsetWidth; sm.classList.add('bad');
      if (this.lives > 0) { this.msg('Ой! Смотри ещё раз'); this.later(() => this.play(), 1100); }
      else { this.msg('Огоньки перепутались!'); const r = this.seq.length - 1, st = r >= 10 ? 3 : r >= 6 ? 2 : r >= 3 ? 1 : 0; this.later(() => finishGame({ score: r, stars: st, key: 'simon', higher: true, label: `Пройдено раундов: ${r}`, bestLabel: b => `Рекорд: ${b} ${plural(b, ['раунд', 'раунда', 'раундов'])}` }), 900); }
    }
  },
  stop() { this.alive = false; (this.timers || []).forEach(clearTimeout); }
};
const Memory = {
  title: 'Пары игрушек',
  start() {
    const kinds = shuffle(CAT.orn.map(o => o[0])).slice(0, 8), cols = shuffle(['red', 'gold', 'blue', 'purple', 'pink', 'green']);
    const deck = shuffle(kinds.flatMap((t, i) => [[t, cols[i % cols.length]], [t, cols[i % cols.length]]]));
    this.moves = 0; this.found = 0; this.open = []; this.lock = false; this.alive = true; this.timers = []; this.t0 = performance.now();
    gArea.innerHTML = `<div class="mem">${deck.map(([t, c]) => `<button class="card" data-s="${t}" aria-label="Карточка"><span class="back"></span><span class="front"><svg viewBox="-15 -18 30 36">${ornMarkup(t, c)}</svg></span></button>`).join('')}</div>`;
    const hud = () => { $('#gScore').innerHTML = `Ходы <b>${this.moves}</b>`; }; hud();
    gArea.querySelectorAll('.card').forEach(c => c.addEventListener('click', () => {
      if (!this.alive || this.lock || c.classList.contains('up')) return;
      c.classList.add('up'); tone(700, .08, 'sine', .15, 0, 1000); this.open.push(c);
      if (this.open.length < 2) return;
      this.moves++; hud(); this.lock = true; const [a, b] = this.open;
      if (a.dataset.s === b.dataset.s) {
        this.timers.push(setTimeout(() => {
          a.classList.add('done'); b.classList.add('done'); this.open = []; this.lock = false; this.found++; SFX.place();
          if (this.found === 8) { const st = this.moves <= 12 ? 3 : this.moves <= 16 ? 2 : 1; this.timers.push(setTimeout(() => finishGame({ score: this.moves, stars: st, key: 'memory', higher: false, label: `Все пары найдены за ${this.moves} ${plural(this.moves, ['ход', 'хода', 'ходов'])}`, bestLabel: b => `Лучший результат: ${b} ${plural(b, ['ход', 'хода', 'ходов'])}` }), 600)); }
        }, 320));
      } else this.timers.push(setTimeout(() => { a.classList.remove('up'); b.classList.remove('up'); this.open = []; this.lock = false; }, 850));
    }));
  },
  stop() { this.alive = false; (this.timers || []).forEach(clearTimeout); }
};
const GAMES = { catch: Catch, simon: Simon, memory: Memory };

/* ---------------- LOOPS & START ---------------- */
let last = performance.now(), lastLights = 0;
function frame(now) {
  if (LOW && now - last < 31) { requestAnimationFrame(frame); return; } // ~30 fps on phones saves battery
  const dt = Math.min(.05, (now - last) / 1000); last = now; const t = now / 1000;
  if (!GAME) {
    updateSnow(dt, t); updateTree(dt, t, now); updateOrns(dt, t); updateFace(now, t); updateParts(dt); updateCan(dt); updateSleigh(dt, t, now); updateGlobe(dt); updateView(dt);
    if (now - lastLights > 60) { lightsTick(t); lastLights = now; }
    if (!bubble.hidden) { if (now > bubbleUntil) bubble.hidden = true; else positionBubble(); }
    idleTick(now); roomTick(now);
  }
  requestAnimationFrame(frame);
}
let tick = 0;
setInterval(() => {
  if (!S) return;
  S.water = clamp(S.water - 1 / 30, 0, 100);
  S.joy = clamp(S.joy - 1 / 45 + (music ? .2 : 0), 0, 100);
  S.energy = clamp(S.night ? S.energy + (room === 'bedroom' ? .6 : .35) + (music && music.song === LULLABY ? .4 : 0) : S.energy - 1 / 50, 0, 100);
  updateHUD(); if (++tick % 5 === 0) save();
}, 1000);
document.addEventListener('visibilitychange', () => { if (document.hidden && S) persist(true); });
window.addEventListener('resize', () => { positionBubble(); if (GAME) startBackdrop(); if (sheet) setView(treeView()); else { view = roomView(); viewT = 1; svg.setAttribute('viewBox', view.map(v => v.toFixed(2)).join(' ')); } });
function start(data) {
  load(data);
  room = S.room; applyRoom();
  view = roomView(); svg.setAttribute('viewBox', view.map(v => v.toFixed(2)).join(' '));
  renderTree('stagger'); setGlowSizes();
  $('#night').style.opacity = .9; sq = -.3; sqV = 0; topSpin = 18;
  requestAnimationFrame(() => requestAnimationFrame(() => updateHUD()));
  requestAnimationFrame(frame);
  setTimeout(() => {
    const d = daysToNY();
    if (!S.greeted) { S.greeted = true; save(); say('Привет! Я Ёлка. Погладь меня, пощекочи или переодень во что-нибудь!', { silent: true }); }
    else if (S.night) say('Тсс… я сплю. Нажми «Утро», чтобы разбудить.', { silent: true });
    else say(pick(['С возвращением! Я скучала!', `Ура, ты пришёл! До Нового года ${d} ${plural(d, ['день', 'дня', 'дней'])}!`, 'Привет-привет! Поиграем?']), { silent: true });
    face('happy', 2500); burst('spark', CX, 152, 10, { g: 30 });
  }, 700);
}
fetch(API).then(r => r.ok ? r.json() : null).catch(() => null).then(S => start({ S }));
})();
