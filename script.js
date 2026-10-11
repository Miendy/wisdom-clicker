/* ================= LOAD WISDOM ================= */
let wisdom = [];
let resetting = false;

/* Forward-declared so early calls don't crash */
let tutPaused = false;
const STORY_KEY = "wisdom-clicker-story";
const TUT_KEY = "wisdom-clicker-tutorial";
const bannerQueue = [];
let bannerActive = false;

fetch("wisdoms.txt")
  .then((r) => r.text())
  .then((txt) => {
    wisdom = [...new Set(
      txt.split("\n")
        .map((l) => l.trim().replace(/,$/, "").replace(/^"|"$/g, ""))
        .filter(Boolean)
    )];
  })
  .catch(() => {
    wisdom = [
      "Patience is the companion of wisdom.",
      "The quieter you become, the more you can hear.",
      "A cat that naps wisely shall rise refreshed.",
      "Do not chase the tangerine. Let the tangerine chase you.",
      "Wisdom is knowing when to stop clicking.",
      "Even the smallest paw leaves a mark.",
      "To sit in the sunbeam is to sit in truth.",
      "The mind is like a cat: it comes when it is ready.",
      "He who rushes gains nothing but a sore thumb.",
      "Sleep is the purest form of wisdom."
    ];
  });

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const words = document.getElementById("words");
const bubble = document.getElementById("bubble");
const frame = document.getElementById("frame");
const live = document.getElementById("live");
const btn = document.getElementById("btn");

let bag = [];
let last = -1;
let typer = null;

function next() {
  if (!wisdom.length) return "Wisdom is loading...";
  if (bag.length === 0) {
    bag = wisdom.map((_, i) => i).sort(() => Math.random() - 0.5);
    if (bag[bag.length - 1] === last && bag.length > 1) bag.unshift(bag.pop());
  }
  last = bag.pop();
  return wisdom[last];
}

function replay(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

function fitBubble(text) {
  words.style.fontSize = "";
  words.textContent = text;
  const cs = getComputedStyle(bubble);
  const avail = bubble.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  let size = parseFloat(getComputedStyle(words).fontSize);
  while (words.scrollHeight > avail && size > 13) {
    size -= 1;
    words.style.fontSize = size + "px";
  }
  words.textContent = "";
}

function type(text) {
  fitBubble(text);
  clearInterval(typer);
  if (reduce || instant) {
    words.textContent = text;
    return;
  }
  let i = 0;
  words.textContent = "";
  words.classList.add("cursor");
  typer = setInterval(() => {
    i += 1;
    words.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(typer);
      words.classList.remove("cursor");
    }
  }, 22);
}

const bits = ["🍊", "✨", "⭐", "🐾", "🍊", "💫", "🧡"];

function burst(count = 26) {
  const r = frame.getBoundingClientRect();
  const cx = (r.left + r.width / 2) / ROOT_ZOOM;
  const cy = (r.top + r.height * 0.25) / ROOT_ZOOM;
  for (let n = 0; n < count; n++) {
    const el = document.createElement("span");
    el.className = "bit";
    el.textContent = bits[Math.floor(Math.random() * bits.length)];
    document.body.appendChild(el);
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 190;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 60;
    const spin = (Math.random() - 0.5) * 720;
    const size = 0.7 + Math.random() * 1.1;
    const anim = el.animate([
      { transform: `translate(${cx}px, ${cy}px) scale(0.2) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${cx + dx}px, ${cy + dy}px) scale(${size}) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${cx + dx * 1.15}px, ${cy + dy + 220}px) scale(${size * 0.8}) rotate(${spin}deg)`, opacity: 0 }
    ], { duration: 1100 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.4,1)" });
    anim.onfinish = () => el.remove();
  }
}

function speak() {
  const text = next();
  live.textContent = text;
  type(text);
  replay(bubble, "hit");
  if (!reduce) {
    replay(frame, clicks % 25 === 0 ? "jump" : "tap");
    burst(5);
  }
}

frame.addEventListener("animationend", (e) => {
  if (e.animationName === "jump" || e.animationName === "tap") frame.classList.remove(e.animationName);
});

const scolds = ["Slow down, youngin. Wisdom is not a slot machine.","Your thumb needs a hobby.","Click again and I will push your phone off the table.","Did you think wisdom comes faster if you tap harder?","Patience, kitten. Even the tangerine took its time.","That is not how a wise one clicks. That is how a goldfish clicks.","I have napped through longer attention spans than yours.","One more and I will sit on your keyboard.","Breathe. Blink slowly. Then click like you mean it.","You are making me lose my zen, youngin."];
const taunts = ["Is that all you have?","My tangerines are ripe for revenge.","Click faster. I dare you.","You will nap in shame.","Dodge this, youngin.","Your reflexes are as ripe as an old banana.","I have napped through worse. Much worse.","Bonk. Bonk. Bonk. That is the sound of defeat.","You call that dodging? I have seen sleepier.","The tangerines are not afraid of you.","One slip and it is nap time, youngin.","Is your thumb tired yet? Mine is not. I do not have a thumb."];
const bossIntros = ["You clicked too fast, youngin. Now you face my wrath.","A hundred years I napped in peace. Then you came, clicking.","Your thumb has woken something old, youngin.","I was dreaming of sunbeams. You ruined it. Prepare yourself.","Wisdom is patient. You are not. That ends today.","So. You wish to take the tangerine. Cute.","Every click echoed through my nap. Every. Single. One.","I tried to warn you, youngin. Now the oranges fly."];
const bossPhaseTwoLines = ["Enough games. You want my tangerine? Come and take it.","Impressive, youngin. Now I stop holding back. Take it if you can.","You dodged my fruit. Now dodge my gaze. Steal it. Quietly.","The tangerine is right here. I am right here. Asleep. Mostly.","Ha. You think this is over? Come closer. Softly.","Enough fruit. Now it is a battle of patience. My specialty.","Sneak, then. I have not blinked in a hundred years.","Take it slow, youngin. I am watching. Sometimes."];
const bossWinLines = ["You stole my tangerine. Nobody has ever done that. Take this:","Hmph. The tangerine is yours. A parting word, youngin:","I blinked. For one second. And you took it. Remember this:","Well played. I will go back to napping. Keep this:","The old orchard bows to you. Carry this wisdom:","I am not angry. I am... very, very sleepy. Here:"];
const bossLoseLines = ["Go nap, youngin. Come back when your thumb has calmed down.","Too many oranges, too few reflexes. Rest, and return.","The tangerine remains mine. Try again when you are wiser.","You fought bravely. Also clumsily. Go nap.","Even the wisest cats get bonked by fruit. Come back stronger.","I would say better luck next time, but luck is not wisdom. Train."];

const BOSS_FORMS = ["king", "ghost", "default"];
const BOSS_NAMES = { default: "The Tangerine Cat", ghost: "Ghost Tangerine", king: "Tangerine King" };
const BOSS_FORMS_INFO = {
  default: { icon: "🍊", name: "The Tangerine Cat", blurb: "Classic fruit-based combat." },
  ghost:   { icon: "👻", name: "Ghost Tangerine",   blurb: "Faster throws, paired decoys." },
  king:    { icon: "👑", name: "Tangerine King",     blurb: "Curving shots, longer stare." }
};
const BOSS_SUBS = { default: "Sage of the Sunbeam", ghost: "Haunter of Fruit Bowls", king: "Ruler of the Orchard" };
const bossForm = () => (bossLevel + 1 >= 4 ? BOSS_FORMS[(bossLevel + 1) % 3] : "default");
const bossSpecialChance = () => { const lvl = bossLevel + 1; return lvl >= 6 ? 0.35 : lvl >= 4 ? 0.25 : lvl >= 2 ? 0.15 : 0; };
let fightForm = "default";
const crownEl = document.getElementById("crown");

const cut = document.getElementById("cut");
const cutline = document.getElementById("cutline");
const skip = document.getElementById("skip");
const flashEl = document.getElementById("flash");
const arena = document.getElementById("arena");
const bossBox = document.getElementById("boss");
const hpEl = document.getElementById("hp");
const hearts = document.getElementById("hearts");
const taunt = document.getElementById("taunt");
const field = document.getElementById("field");
const endEl = document.getElementById("end");
const endT = document.getElementById("endt");
const endP = document.getElementById("endp");
const again = document.getElementById("again");

document.querySelectorAll(".bossimg").forEach((img) => { img.src = frame.querySelector("img").src; });

let rage = 0;
let lastClick = 0;
let fighting = false;
let skipped = false;
let wake = null;
let boss = 100;
let me = 3;
let running = false;
let won = false;
let spawner = null;
let takenDamage = false;

/* ================= COMBO ================= */
let combo = 0;
let lastComboAt = 0;
let comboTimer = null;
const comboEl = document.getElementById("combo");
const comboN = document.getElementById("comboN");

function bumpCombo() {
  const now = performance.now();
  combo = now - lastComboAt < comboWindowMs() ? combo + 1 : 1;
  lastComboAt = now;
  if (combo >= 3) {
    comboEl.hidden = false;
    comboN.textContent = "×" + Math.min(combo, 99);
    comboEl.classList.remove("pop");
    void comboEl.offsetWidth;
    comboEl.classList.add("pop");
    comboEl.dataset.tier = combo >= 30 ? "3" : combo >= 15 ? "2" : combo >= 8 ? "1" : "0";
  }
  clearTimeout(comboTimer);
  comboTimer = setTimeout(() => { combo = 0; comboEl.hidden = true; }, comboWindowMs() + 200);
}

function comboMult() {
  const cap = treeBought("flow4") ? 150 : treeBought("flow3") ? 100 : 50;
  const step = treeBought("flow5") ? 0.025 : 0.02;
  return 1 + Math.min(combo, cap) * step;
}

const sleep = (ms) => (skipped || reduce) ? Promise.resolve() : new Promise((r) => { wake = r; setTimeout(r, ms); });

skip.addEventListener("click", () => { skipped = true; if (wake) wake(); });
frame.addEventListener("animationend", (e) => { if (e.animationName === "mad") frame.classList.remove("mad"); });
frame.addEventListener("click", () => { if (!fighting) btn.click(); });

function scold() {
  sfx("scold");
  const text = scolds[Math.floor(Math.random() * scolds.length)];
  bubble.classList.add("angry");
  live.textContent = text;
  type(text);
  replay(bubble, "hit");
  replay(frame, "mad");
}

function flash() { flashEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450 }); }

async function cutscene() {
  if (fighting && !(tutState.active && tutState.chapterId === "boss")) return;
  fighting = true;
  try {
    hidePhone();
    mute.hidden = false;
    audio();
    skipped = false;
    clearInterval(typer);
    words.classList.remove("cursor");
    fightForm = bossForm();
    cutsm.textContent = BOSS_SUBS[fightForm];
    cutbig.textContent = BOSS_NAMES[fightForm];
    cut.className = "cut";
    cut.hidden = false;
    void cut.offsetWidth;
    cut.classList.add("on");
    replay(cut, "shake");
    await sleep(900);
    cut.classList.add("zoom");
    await sleep(1200);
    cut.classList.add("eyes");
    flash();
    boom();
    sfx("pop");
    replay(cut, "shake");
    await sleep(1100);
    cut.classList.add("title");
    flash();
    boom();
    sfx("pop");
    await sleep(1600);
    cutline.textContent = pick(bossIntros);
    cut.classList.add("talk");
    await sleep(2400);
    cut.hidden = true;
    startFight();
  } catch (error) {
    console.error("Boss fight failed to start", error);
    running = false;
    clearTimeout(spawner);
    cut.hidden = true;
    arena.hidden = true;
    mute.hidden = true;
    fighting = false;
    showPhone();
    render();
  }
}

function draw() {
  hpEl.style.width = boss + "%";
  hearts.textContent = "❤️".repeat(me) + "🖤".repeat(3 - me);
}

function say(text) { taunt.textContent = text; }

function startFight() {
  boss = 100; me = 3; running = true; takenDamage = false;
  field.innerHTML = ""; endEl.hidden = true;
  arena.classList.remove("rage", "stealing", "watch", "twitch");
  arena.dataset.form = fightForm;
  hpEl.className = "f-" + fightForm;
  crownEl.hidden = fightForm !== "king";
  arena.querySelector(".hud span").textContent = BOSS_NAMES[fightForm];
  field.hidden = false; stealEl.hidden = true; sneak.hidden = true; hud2.hidden = true; arena.hidden = false;
  draw(); say("Tangerine time.");
  if (!tutState.seen.boss || (tutState.active && tutState.chapterId === "boss")) spawnBossHover();
  startBossTheme();
  loop();
}

function loop() { if (!running) return; throwOne(); spawner = setTimeout(loop, 900); }

function dropOrange(left, dur, opts = {}) {
  const el = document.createElement("span");
  el.className = "orange" + (opts.ghost ? " ghost" : "");
  el.textContent = "🍊";
  el.style.left = left + "%";
  el.decoy = !!opts.decoy;
  el.pair = opts.pair || null;
  field.appendChild(el);
  el.anim = el.animate([
    { transform: "translateY(-70px) rotate(0deg)" },
    { transform: `translateY(${field.clientHeight - 50}px) rotate(540deg)` }
  ], { duration: dur, easing: "ease-in" });
  if (fightForm === "king") {
    const dx = (left < 50 ? 1 : -1) * (50 + Math.random() * 50);
    el.drift = el.animate([
      { translate: "0px 0px" },
      { translate: `${dx}px 0px`, offset: 0.35 },
      { translate: `${-dx * 0.7}px 0px`, offset: 0.7 },
      { translate: `${dx * 0.3}px 0px` }
    ], { duration: dur, easing: "linear" });
  }
  el.addEventListener("pointerdown", () => {
    if (!running || el.dead) return;
    el.dead = true; pop(el, el.decoy);
    if (el.decoy) return;
    if (el.pair) pairHit(el);
    hitBoss();
  });
  el.anim.onfinish = () => {
    if (el.dead || !running) return;
    el.dead = true; el.remove();
    if (el.decoy) return;
    hurtMe();
  };
  return el;
}

function pairHit(el) {
  const p = el.pair;
  if (p.first) { clearTimeout(p.timer); return; }
  p.first = performance.now();
  p.timer = setTimeout(() => {
    const other = p.els.find((o) => o !== el);
    if (!running || !other || other.dead) return;
    other.dead = true; pop(other, true); hurtMe();
    say("Both at once, youngin. BOTH.");
    if (bossHoverEl) mittensSay("Both at once. How *imaginative* of him.");
  }, 400);
}

function throwOne() {
  sfx("throw");
  const ghost = fightForm === "ghost";
  const base = Math.max(1300, 2300 - bossLevel * 180) + Math.random() * 400;
  let kind = null;
  if (Math.random() < bossSpecialChance()) kind = pick(ghost ? ["fast", "feint"] : ["double", "fast", "feint"]);
  const dur = kind === "fast" ? base / 1.4 : base;
  const used = [];
  const slot = () => {
    let x = 6 + Math.random() * 80;
    for (let k = 0; k < 12 && used.some((u) => Math.abs(u - x) < 16); k++) x = 6 + Math.random() * 80;
    used.push(x); return x;
  };
  for (let n = 0; n < (kind === "double" ? 2 : 1); n++) {
    const d = dur + n * 250;
    if (ghost) {
      const pair = { first: 0, timer: 0, els: [] };
      pair.els.push(dropOrange(slot(), d, { ghost, pair }), dropOrange(slot(), d, { ghost, pair }));
    } else { dropOrange(slot(), d); }
  }
  if (kind === "feint") dropOrange(slot(), dur, { ghost, decoy: true });
}

function pop(el, decoy) {
  sfx(decoy ? "nope" : "pop");
  const cs = getComputedStyle(el);
  const t = cs.transform;
  const tr = cs.translate;
  el.anim.cancel();
  if (el.drift) { el.drift.cancel(); el.style.translate = tr; }
  el.style.transform = t;
  el.textContent = decoy ? "💨" : "💥";
  el.animate([{ opacity: 1, scale: "1" }, { opacity: 0, scale: "2" }], { duration: 300 }).onfinish = () => el.remove();
}

function shakeArena(dmg) {
  if (reduce) return;
  const a = 4 + dmg * 3;
  arena.animate([
    { transform: "translate(0)" },
    { transform: `translate(${-a}px, ${a / 3}px)` },
    { transform: `translate(${a}px, ${-a / 2}px)` },
    { transform: `translate(${-a * 0.8}px, ${-a / 3}px)` },
    { transform: `translate(${a * 0.6}px, ${a / 2}px)` },
    { transform: "translate(0)" }
  ], { duration: 250 + dmg * 150 });
}

function hitBoss() {
  boss -= 5; draw(); replay(bossBox, "hurt");
  if (boss === 50) { phaseTwo(); }
  else if (boss > 0 && boss % 20 === 0) { say(taunts[Math.floor(Math.random() * taunts.length)]); }
}

function hurtMe() {
  sfx("hurt");
  takenDamage = true; me -= 1; draw();
  shakeArena(3 - me);
  say("Ha! Too slow.");
  if (bossHoverEl) mittensSay(pick(BOSS_HOVER_LINES.miss));
  if (me <= 0) finish(false);
}

function finish(result) {
  won = result;
  if (won) bossesWon += 1;
  let bonus = 0;
  if (won) {
    if (!takenDamage) achFlags.flawless = true;
    bossLevel += 1; mult *= 2;
    bonus = Math.ceil(Math.max(perSec(), perClick()) * 300 / boostMul());
    earn(bonus); save();
  }
  running = false;
  clearTimeout(spawner); clearInterval(ticker); stopMusic(); release();
  arena.classList.remove("watch", "twitch");
  field.querySelectorAll(".orange").forEach((o) => o.remove());
  endT.textContent = won ? "Victory" : "Defeated";
  endP.textContent = won ? `${pick(bossWinLines)} "${next()}"` : pick(bossLoseLines);
  endEl.hidden = false;
  reward.hidden = !won;
  reward.innerHTML = `<b>×2</b> wisdom forever<br><b>+${fmt(bonus)}</b> bonus wisdom`;
  sfx(won ? "win" : "lose");
  if (won) burst();
  if (bossHoverEl) { mittensSay(won ? pick(BOSS_HOVER_LINES.win) : pick(BOSS_HOVER_LINES.lose)); setTimeout(removeBossHover, 2400); }
  showPhone();
}

again.addEventListener("click", () => {
  sfx("blip", { pitch: 1000 });
  arena.hidden = true; mute.hidden = true; fighting = false; rage = 0;
  lastClick = performance.now();
  bubble.classList.remove("angry"); render();
  const text = won ? "Hmph. Respect, youngin. Click as fast as you like." : "Hmph. Come back when you are ready, youngin.";
  live.textContent = text; type(text); replay(bubble, "hit");
});

const mute = document.getElementById("mute");
const cutsm = document.getElementById("cutsm");
const cutbig = document.getElementById("cutbig");
const hud2 = document.getElementById("hud2");
const sbar = document.getElementById("sbar");
const stealEl = document.getElementById("steal");
const hand = document.getElementById("hand");
const sneak = document.getElementById("sneak");

let ctx = null, master = null, bus = null, noiseBuf = null, musicTimer = null;
let step = 0, nextTime = 0, intense = false, muted = false, ticker = null;
let progress = 0, holding = false, caught = false, musicMode = "idle";

const roots = [82.41, 82.41, 65.41, 73.42, 82.41, 82.41, 65.41, 87.31];
const chords = [[329.63, 392, 493.88], [329.63, 392, 493.88], [261.63, 329.63, 392], [293.66, 369.99, 440], [329.63, 392, 493.88], [329.63, 392, 493.88], [261.63, 329.63, 392], [349.23, 440, 523.25]];
const darkChords = [[261.63, 311.13, 392.00], [261.63, 311.13, 392.00], [233.08, 277.18, 349.23], [246.94, 311.13, 369.99], [261.63, 311.13, 392.00], [261.63, 311.13, 392.00], [220.00, 261.63, 329.63], [207.65, 246.94, 311.13]];
const darkRoots = [73.42, 73.42, 58.27, 65.41, 73.42, 73.42, 55.00, 77.78];
const octs = [0, 0, 12, 0, 0, 0, 12, 0, 0, 0, 12, 0, 0, 12, 0, 12];
const arp = [0, 1, 2, 1];

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    bus = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    bus.connect(master); master.connect(comp); comp.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function unfade() { bus.gain.cancelScheduledValues(ctx.currentTime); bus.gain.setValueAtTime(1, ctx.currentTime); }

function tone(type, freq, t, dur, vol, opts = {}) {
  const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (opts.to) o.frequency.exponentialRampToValueAtTime(opts.to, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  let node = o;
  if (opts.lp) { const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = opts.lp; o.connect(f); node = f; }
  node.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.02);
}

function noise(t, dur, vol, hp) {
  const s = ctx.createBufferSource(); const f = ctx.createBiquadFilter(); const g = ctx.createGain();
  s.buffer = noiseBuf; f.type = "highpass"; f.frequency.value = hp;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  s.connect(f); f.connect(g); g.connect(bus); s.start(t); s.stop(t + dur + 0.02);
}

function play(s, t) {
  const dark = musicMode !== "idle";
  const rootArr = dark ? darkRoots : roots;
  const chordArr = dark ? darkChords : chords;
  const bar = Math.floor(s / 16) % 8; const i = s % 16;
  if (i % 4 === 0 || (intense && i === 14)) tone("sine", 160, t, 0.14, 0.9, { to: 40 });
  if (i === 4 || i === 12) { noise(t, 0.15, 0.5, 1500); tone("triangle", 190, t, 0.08, 0.3); }
  if (intense && s % 32 >= 28) noise(t, 0.05, 0.3, 2500);
  if (intense || i % 2 === 0) noise(t, 0.04, 0.15, 7000);
  tone("sawtooth", rootArr[bar] * 2 ** (octs[i] / 12), t, 0.1, 0.28, { lp: intense ? 1100 : 500 });
  if (dark && i % 8 === 0) tone("sine", rootArr[bar] * 0.5, t, 0.5, 0.35, { lp: 300 });
  if (dark && i % 4 === 2) tone("triangle", rootArr[bar] * 1.5, t, 0.22, 0.14, { lp: 800 });
  if (intense || i % 2 === 0) {
    const k = arp[Math.floor(i / (intense ? 1 : 2)) % 4];
    const lift = intense && bar % 2 ? 2 : 1;
    tone("square", chordArr[bar][k] * lift, t, 0.09, 0.07, { lp: 3000 });
  }
}

function schedule() {
  const bpm = musicMode === "duel" ? 184 : musicMode === "steal" ? 176 : musicMode === "boss" ? 156 : 148;
  const spb = 60 / bpm / 4;
  if (nextTime < ctx.currentTime) nextTime = ctx.currentTime + 0.05;
  while (nextTime < ctx.currentTime + 0.2) { play(step, nextTime); step += 1; nextTime += spb; }
}

function startMusic(mode) {
  if (!audio()) return;
  clearInterval(musicTimer); unfade();
  musicMode = mode;
  intense = mode === "steal" || mode === "duel";
  step = 0; nextTime = ctx.currentTime + 0.1;
  musicTimer = setInterval(schedule, 40);
  ambSet(mode);
}

function startBossTheme() {
  if (!audio()) return;
  const t = ctx.currentTime;
  tone("sine", 55, t, 1.0, 1.0, { to: 110 });
  noise(t, 0.6, 0.6, 200);
  tone("sawtooth", 110, t + 0.05, 0.9, 0.5, { to: 220, lp: 900 });
  tone("sawtooth", 220, t + 0.4, 0.6, 0.35, { to: 440, lp: 1400 });
  tone("sine", 440, t + 0.9, 0.4, 0.28, { lp: 2000 });
  tone("sine", 82.41, t + 1.0, 1.6, 0.5, { to: 41 });
  setTimeout(() => { if (running && musicMode !== "steal" && musicMode !== "duel") startMusic("boss"); }, 1400);
}

function stopMusic() {
  clearInterval(musicTimer); musicTimer = null;
  if (bus) bus.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
  ambStop(1.5);
}

function boom() { if (!audio()) return; unfade(); const t = ctx.currentTime; tone("sine", 90, t, 1.2, 1, { to: 28 }); noise(t, 0.8, 0.5, 200); }

const AMB_CHORDS = { idle: [130.81, 164.81, 196.00, 246.94], boss: [110.00, 130.81, 164.81, 196.00], steal: [98.00, 116.54, 146.83, 174.61], duel: [87.31, 103.83, 130.81, 155.56] };
let ambGain = null, ambNodes = [], ambOn = false, ambMode = null, ambSwitchTimer = null;

function ambStart(mode) {
  if (!audio() || ambOn) return;
  ambOn = true; ambMode = mode;
  ambGain = ctx.createGain(); ambGain.gain.value = 0; ambGain.connect(bus);
  const filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 700; filter.Q.value = 0.6; filter.connect(ambGain);
  const lfo = ctx.createOscillator(); const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.06; lfoGain.gain.value = 220;
  lfo.connect(lfoGain); lfoGain.connect(filter.frequency); lfo.start();
  const notes = AMB_CHORDS[mode] || AMB_CHORDS.idle;
  notes.forEach((freq, i) => {
    const o1 = ctx.createOscillator(); const o2 = ctx.createOscillator(); const g = ctx.createGain();
    o1.type = "sine"; o2.type = "triangle";
    o1.frequency.value = freq; o2.frequency.value = freq * 1.005;
    g.gain.value = 0.03 - i * 0.008;
    o1.connect(g); o2.connect(g); g.connect(filter);
    o1.start(); o2.start(); ambNodes.push(o1, o2);
  });
  const breath = ctx.createOscillator(); const breathGain = ctx.createGain();
  breath.frequency.value = 0.045; breathGain.gain.value = 0.35;
  breath.connect(breathGain); breathGain.connect(ambGain.gain); breath.start();
  ambNodes.push(breath, lfo, breathGain, lfoGain, filter);
  const t = ctx.currentTime;
  ambGain.gain.setValueAtTime(0, t);
  ambGain.gain.linearRampToValueAtTime(0.9, t + 4);
}

function ambStop(fade = 2) {
  if (!ambOn || !ambGain) return;
  const t = ctx.currentTime;
  ambGain.gain.cancelScheduledValues(t);
  ambGain.gain.setValueAtTime(ambGain.gain.value, t);
  ambGain.gain.linearRampToValueAtTime(0, t + fade);
  const nodes = ambNodes; const kill = ambGain;
  ambNodes = []; ambOn = false; ambMode = null;
  setTimeout(() => { nodes.forEach((n) => { try { n.stop(); } catch (e) {} try { n.disconnect(); } catch (e) {} }); try { kill.disconnect(); } catch (e) {} }, (fade + 0.3) * 1000);
}

function ambSet(mode) {
  if (ambSwitchTimer) { clearTimeout(ambSwitchTimer); ambSwitchTimer = null; }
  if (!ambOn) { ambStart(mode); return; }
  if (ambMode === mode) return;
  ambStop(1.4);
  ambSwitchTimer = setTimeout(() => { ambSwitchTimer = null; if (!ambOn) ambStart(mode); }, 1500);
}

function sfx(kind, opts = {}) {
  if (!audio()) return;
  unfade();
  const t = ctx.currentTime;
  switch (kind) {
    case "click": { const base = 620 + Math.min(combo, 20) * 18; tone("triangle", base, t, 0.08, 0.13, { to: base * 1.5, lp: 2600 }); tone("sine", base * 0.5, t, 0.1, 0.09); if (combo >= 15) tone("square", base * 2, t, 0.05, 0.05, { to: base * 3, lp: 4000 }); break; }
    case "buy": { tone("triangle", 523.25, t, 0.12, 0.18); tone("triangle", 659.25, t + 0.08, 0.14, 0.18); tone("triangle", 783.99, t + 0.16, 0.22, 0.16, { lp: 3000 }); break; }
    case "nope": { tone("sawtooth", 180, t, 0.14, 0.22, { to: 120, lp: 900 }); tone("square", 90, t, 0.16, 0.12); break; }
    case "scold": { tone("sawtooth", 320, t, 0.12, 0.18, { to: 180, lp: 1200 }); tone("sawtooth", 220, t + 0.1, 0.22, 0.18, { to: 120, lp: 1000 }); break; }
    case "throw": { noise(t, 0.12, 0.25, 3000); tone("triangle", 700, t, 0.12, 0.12, { to: 350, lp: 2200 }); break; }
    case "pop": { noise(t, 0.06, 0.4, 4000); tone("square", 880, t, 0.08, 0.2, { to: 1320, lp: 3500 }); tone("sine", 200, t, 0.14, 0.35, { to: 60 }); break; }
    case "hurt": { tone("sawtooth", 240, t, 0.18, 0.28, { to: 90, lp: 1100 }); noise(t, 0.2, 0.25, 400); break; }
    case "win": { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone("triangle", f, t + i * 0.12, 0.28, 0.2, { lp: 3500 })); tone("sine", 130.81, t, 0.6, 0.25); break; }
    case "lose": { [392, 349.23, 293.66, 220].forEach((f, i) => tone("sawtooth", f, t + i * 0.16, 0.3, 0.18, { lp: 1400 })); break; }
    case "correct": { tone("square", 880, t, 0.1, 0.15, { lp: 3200 }); tone("square", 1174.66, t + 0.1, 0.14, 0.15, { lp: 3200 }); tone("triangle", 1567.98, t + 0.2, 0.24, 0.14, { lp: 3500 }); break; }
    case "wrong": { tone("square", 300, t, 0.15, 0.2, { to: 220, lp: 1400 }); tone("square", 220, t + 0.16, 0.25, 0.2, { to: 140, lp: 1200 }); break; }
    case "fanfare": { [659.25, 783.99, 987.77, 1318.5].forEach((f, i) => tone("triangle", f, t + i * 0.1, 0.22, 0.18, { lp: 3500 })); tone("sine", 164.81, t, 0.5, 0.22); break; }
    case "blip": { const p = opts.pitch || 900; tone("square", p, t, 0.05, 0.08, { to: p * 1.3, lp: 3000 }); break; }
    case "coin": { tone("triangle", 1200, t, 0.07, 0.1, { to: 1800, lp: 3500 }); break; }
    case "golden": { [880, 1108.73, 1318.51, 1760, 2217.46].forEach((f, i) => tone("triangle", f, t + i * 0.06, 0.18, 0.16, { lp: 5000 })); tone("sine", 440, t, 0.4, 0.2); break; }
    case "goldenhit": { [1318.51, 1760, 2217.46, 2637.02].forEach((f, i) => tone("triangle", f, t + i * 0.05, 0.14, 0.18, { lp: 6000 })); noise(t, 0.1, 0.25, 5000); break; }
    case "combo": { tone("triangle", 700 + Math.min(combo, 30) * 22, t, 0.06, 0.09, { to: 1400, lp: 4000 }); break; }
    case "hareld_fall": { tone("sine", 1800, t, 0.5, 0.2, { to: 300 }); tone("triangle", 2400, t, 0.5, 0.08, { to: 400, lp: 4000 }); break; }
    case "hareld_in": { tone("sawtooth", 500, t, 0.5, 0.35, { to: 2400, lp: 5000 }); tone("square", 760, t, 0.5, 0.2, { to: 3200, lp: 6000 }); tone("sawtooth", 90, t, 0.45, 0.5, { to: 40 }); noise(t, 0.5, 0.55, 1200); break; }
    case "screech": {
      const o = ctx.createOscillator(), o2 = ctx.createOscillator(), lfo = ctx.createOscillator();
      const lg = ctx.createGain(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = "sawtooth"; o2.type = "square";
      o.frequency.setValueAtTime(900, t); o.frequency.linearRampToValueAtTime(1500, t + 0.3); o.frequency.linearRampToValueAtTime(1100, t + 2);
      o2.frequency.setValueAtTime(1350, t); o2.frequency.linearRampToValueAtTime(2250, t + 0.3); o2.frequency.linearRampToValueAtTime(1650, t + 2);
      lfo.frequency.value = 9; lg.gain.value = 70;
      lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
      f.type = "lowpass"; f.frequency.value = 5000;
      g.gain.setValueAtTime(0.001, t); g.gain.exponentialRampToValueAtTime(0.4, t + 0.05); g.gain.setValueAtTime(0.4, t + 1.7); g.gain.exponentialRampToValueAtTime(0.001, t + 2);
      o.connect(f); o2.connect(f); f.connect(g); g.connect(bus);
      [o, o2, lfo].forEach((n) => { n.start(t); n.stop(t + 2.05); });
      noise(t, 2, 0.12, 2500);
      break;
    }
    case "mittens_in": { tone("triangle", 523.25, t, 0.14, 0.18); tone("triangle", 587.33, t + 0.1, 0.14, 0.18); tone("triangle", 659.25, t + 0.2, 0.26, 0.16, { lp: 3000 }); break; }
    case "mittens_talk": { tone("triangle", 720, t, 0.04, 0.06, { to: 900, lp: 2800 }); break; }
    case "smack": { noise(t, 0.05, 0.6, 5000); tone("square", 1200, t, 0.06, 0.3, { to: 240, lp: 2000 }); tone("sine", 90, t, 0.4, 0.7, { to: 30 }); break; }
    case "chime": { tone("triangle", 1320, t, 0.14, 0.1, { lp: 5000 }); tone("triangle", 1980, t + 0.08, 0.2, 0.08, { lp: 6000 }); break; }
    case "vignette": { tone("sine", 55, t, 3.0, 0.3, { to: 40, lp: 200 }); break; }
  }
}

mute.addEventListener("click", () => { muted = !muted; mute.textContent = muted ? "🔇" : "🔊"; if (master) master.gain.value = muted ? 0 : 0.5; });

async function phaseTwo() {
  running = false;
  clearTimeout(spawner);
  field.querySelectorAll(".orange").forEach((o) => o.remove());
  stopMusic();
  skipped = false;
  cutsm.textContent = "He is not amused";
  cutbig.textContent = "Phase Two";
  cutline.textContent = pick(bossPhaseTwoLines);
  cut.className = "cut";
  cut.hidden = false;
  void cut.offsetWidth;
  cut.classList.add("on", "zoom");
  replay(cut, "shake");
  boom();
  await sleep(600);
  cut.classList.add("eyes"); flash(); sfx("pop");
  await sleep(700);
  cut.classList.add("title", "talk"); flash(); boom(); sfx("pop");
  await sleep(2200);
  if (bossHoverEl) mittensSay(pick(BOSS_HOVER_LINES.phase2));
  cut.hidden = true;
  startSteal();
}

function startSteal() {
  me = Math.max(me, 2);
  progress = 0; holding = false; caught = false; takenDamage = false;
  draw();
  arena.classList.add("rage", "stealing");
  field.hidden = true; stealEl.hidden = false; sneak.hidden = false; hud2.hidden = false;
  sbar.style.width = "0%"; hand.style.transform = "none";
  running = true;
  startMusic("steal");
  cycle();
  ticker = setInterval(tick, 50);
}

function cycle() {
  if (!running) return;
  arena.classList.remove("watch", "twitch");
  say("...zzz...");
  const calm = Math.max(500, 1800 - bossLevel * 120 - progress * 10) + Math.random() * 800;
  spawner = setTimeout(() => {
    arena.classList.add("twitch");
    say("...hm?");
    spawner = setTimeout(() => {
      arena.classList.remove("twitch");
      arena.classList.add("watch");
      say("I SEE YOU!");
      spawner = setTimeout(cycle, (900 + Math.random() * 700) * (fightForm === "king" ? 1.5 : 1));
    }, 380);
  }, calm);
}

function tick() {
  if (!running) return;
  const watching = arena.classList.contains("watch");
  if (holding && !caught) {
    if (watching) {
      caught = true;
      progress = Math.max(0, progress - 25);
      replay(bossBox, "hurt");
      hurtMe();
      say("CAUGHT! Hands off!");
      if (bossHoverEl) mittensSay(pick(BOSS_HOVER_LINES.caught));
    } else {
      progress = Math.min(100, progress + 1.1);
      if (progress >= 100) { finish(true); return; }
    }
  }
  sbar.style.width = progress + "%";
  hand.style.transform = `translateY(-${(progress / 100) * Math.max(0, stealEl.clientHeight - 90)}px)`;
}

function press() { holding = true; sneak.classList.add("down"); }
function release() { holding = false; caught = false; sneak.classList.remove("down"); }

sneak.addEventListener("pointerdown", (e) => { e.preventDefault(); press(); });
["pointerup", "pointercancel", "pointerleave"].forEach((ev) => sneak.addEventListener(ev, release));
sneak.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("keydown", (e) => { if (e.code === "Space" && running && arena.classList.contains("stealing")) { e.preventDefault(); press(); } });
document.addEventListener("keyup", (e) => { if (e.code === "Space") release(); });

/* ================= SAVE / LOAD ================= */
const KEY = "wisdom-clicker-save";

const ups = [
  { name: "Slow Blink",        desc: "+1 per click",          base: 25,        click: 1,     tier: "common" },
  { name: "Sunbeam Nap",       desc: "+1 per second",         base: 80,        sec: 1,       tier: "common" },
  { name: "Tangerine Polish",  desc: "+6 per click",          base: 600,       click: 6,     tier: "common" },
  { name: "Cardboard Box",     desc: "+6 per second",         base: 900,       sec: 6,       tier: "common" },
  { name: "Window Seat",       desc: "+40 per second",        base: 8000,      sec: 40,      tier: "rare" },
  { name: "Zen Stare",         desc: "+40 per click",         base: 9000,      click: 40,    tier: "rare" },
  { name: "Midnight Zoomies",  desc: "+260 per second",       base: 70000,     sec: 260,     tier: "rare" },
  { name: "Sage Aura",         desc: "+300 per click",        base: 120000,    click: 300,   tier: "rare" },
  { name: "Tangerine Grove",   desc: "+1,800 per second",     base: 600000,    sec: 1800,    tier: "epic" },
  { name: "Third Eye",         desc: "+2,500 per click",      base: 3000000,   click: 2500,  tier: "epic" },
  { name: "Council of Cats",   desc: "+14,000 per second",    base: 5500000,   sec: 14000,   tier: "epic" },
  { name: "Moon Monastery",    desc: "+110,000 per second",   base: 50000000,  sec: 110000,  tier: "legendary" },
  { name: "Cosmic Loaf",       desc: "+900,000 per second",   base: 480000000, sec: 900000,  tier: "legendary" },
  { name: "Sunwheel",          desc: "+7,500 per click",      base: 40000000,   click: 7500,   tier: "epic" },
  { name: "Starlit Purr",      desc: "+340,000 per second",   base: 250000000,  sec: 340000,   tier: "epic" },
  { name: "Whisker Compass",   desc: "+55,000 per click",     base: 800000000,  click: 55000,  tier: "legendary" },
  { name: "Nebula Saucer",     desc: "+4,800,000 per second", base: 6000000000, sec: 4800000,  tier: "legendary" },
  { name: "Time Crouch",       desc: "+600,000 per click",    base: 80000000000,  click: 600000, tier: "legendary" },
  { name: "Star Forge",        desc: "+120,000,000 per second",base: 120000000000, sec: 120000000, tier: "legendary" },
  { name: "Eternal Purr",      desc: "+2,200,000 per click",  base: 700000000000, click: 2200000, tier: "legendary" },
  { name: "Cosmic Chorus",     desc: "+500,000,000 per second",base: 900000000000,sec: 500000000, tier: "legendary" },
  { name: "Galaxy Loaf",       desc: "+20,000,000 per second",base: 14000000000,  sec: 20000000, tier: "legendary" },
  { name: "Moonlit Focus",     desc: "+180,000 per click",    base: 9000000000,   click: 180000, tier: "legendary" },
  { name: "Nebula Nest",       desc: "+3,200,000 per second", base: 2500000000,   sec: 3200000,  tier: "epic" },
  { name: "Star Chart",        desc: "+40,000 per click",     base: 1200000000,   click: 40000,  tier: "epic" },
  { name: "Echo Chamber",      desc: "+80 per click",           base: 5000000,       click: 80,    tier: "epic",
    syn: { target: 0, per: 40, stat: "click" }, synDesc: "+40 per Slow Blink owned" },
  { name: "Resonant Nap",      desc: "+90 per sec",             base: 12000000,      sec: 90,      tier: "epic",
    syn: { target: 1, per: 30, stat: "sec" }, synDesc: "+30 per Sunbeam Nap owned" },
  { name: "Cardboard Kingdom", desc: "+500 per sec",            base: 90000000,      sec: 500,     tier: "epic",
    syn: { target: 3, per: 120, stat: "sec" }, synDesc: "+120 per Cardboard Box owned" },
  { name: "Sunbeam Chorus",    desc: "+800 per sec",            base: 800000000,     sec: 800,     tier: "legendary",
    syn: { target: 4, per: 200, stat: "sec" }, synDesc: "+200 per Window Seat owned" },
  { name: "Zen Cascade",       desc: "+1,200 per click",        base: 6000000000,    click: 1200,  tier: "legendary",
    syn: { target: 5, per: 260, stat: "click" }, synDesc: "+260 per Zen Stare owned" },
  { name: "Tangerine Halo",    desc: "+30,000 per sec",         base: 40000000000,   sec: 30000,   tier: "legendary",
    syn: { target: 8, per: 4000, stat: "sec" }, synDesc: "+4,000 per Tangerine Grove owned" },
  { name: "Third Eye Chakra",  desc: "+22,000 per click",       base: 150000000000,  click: 22000, tier: "legendary",
    syn: { target: 9, per: 3000, stat: "click" }, synDesc: "+3,000 per Third Eye owned" }
];

/* ================= WISDOM TREE ================= */
const TREE_NODES = [
  { id: "core",        icon: "🍊", branch: "core",    angle: 0,   radius: 0,    cost: 0, minPrestige: 0, name: "Tangerine Heart", desc: "The center of all wisdom." },
  { id: "sleep1",      icon: "💤", branch: "sleep",   angle: -140, radius: 0.38, cost: 3,  minPrestige: 0, name: "Deep Slumber",   desc: "Offline cap: 8h → 16h",             requires: "core" },
  { id: "sleep2",      icon: "🌙", branch: "sleep",   angle: -140, radius: 0.62, cost: 8,  minPrestige: 1, name: "Long Rest",      desc: "Offline cap: 16h → 24h",            requires: "sleep1" },
  { id: "sleep3",      icon: "💭", branch: "sleep",   angle: -140, radius: 0.86, cost: 25, minPrestige: 3, name: "Dream Walking",  desc: "Offline earns at 2× the rate",      requires: "sleep2" },
  { id: "sleep4",      icon: "🛌", branch: "sleep",   angle: -140, radius: 1.08, cost: 60, minPrestige: 5, name: "Moon Nap",       desc: "Offline cap: 48 hours",              requires: "sleep3" },
  { id: "sleep5",      icon: "🌌", branch: "sleep",   angle: -140, radius: 1.28, cost: 120,minPrestige: 8, name: "Eternal Rest",   desc: "Offline earnings +25%",              requires: "sleep4" },
  { id: "luck1",       icon: "🍀", branch: "luck",    angle: 140,  radius: 0.38, cost: 4,  minPrestige: 0, name: "Golden Nose",    desc: "Golden spawn interval halved",      requires: "core" },
  { id: "luck2",       icon: "👁️", branch: "luck",    angle: 140,  radius: 0.62, cost: 10, minPrestige: 1, name: "Keen Eye",       desc: "Golden spawn interval halved again", requires: "luck1" },
  { id: "luck3",       icon: "✨", branch: "luck",    angle: 140,  radius: 0.86, cost: 30, minPrestige: 3, name: "Golden Cascade", desc: "Goldens grant 2 rewards each",      requires: "luck2" },
  { id: "luck4",       icon: "🪙", branch: "luck",    angle: 140,  radius: 1.08, cost: 50, minPrestige: 5, name: "Fortune Teller", desc: "Golden rewards are 25% stronger",    requires: "luck3" },
  { id: "luck5",       icon: "💰", branch: "luck",    angle: 140,  radius: 1.28, cost: 100,minPrestige: 8, name: "Orchard Vault",  desc: "Golden rewards are 50% stronger",    requires: "luck4" },
  { id: "flow1",       icon: "🧠", branch: "flow",    angle: -90,  radius: 0.40, cost: 3,  minPrestige: 0, name: "Long Memory",    desc: "Combo window: 900ms → 1150ms",      requires: "core" },
  { id: "flow2",       icon: "🐾", branch: "flow",    angle: -90,  radius: 0.64, cost: 7,  minPrestige: 1, name: "Steady Paw",     desc: "Combo window: 1150ms → 1400ms",     requires: "flow1" },
  { id: "flow3",       icon: "🌟", branch: "flow",    angle: -90,  radius: 0.88, cost: 22, minPrestige: 3, name: "Perfect Flow",   desc: "Combo multiplier caps at ×2.0",     requires: "flow2" },
  { id: "flow4",       icon: "⚡", branch: "flow",    angle: -90,  radius: 1.08, cost: 55, minPrestige: 5, name: "Lightning Paw",  desc: "Combo multiplier caps at ×3.0",     requires: "flow3" },
  { id: "flow5",       icon: "🌊", branch: "flow",    angle: -90,  radius: 1.28, cost: 110,minPrestige: 8, name: "Endless Rhythm", desc: "Each combo step is worth 2.5%",      requires: "flow4" },
  { id: "pride1",      icon: "🏆", branch: "pride",   angle: -40,  radius: 0.40, cost: 12, minPrestige: 1, name: "Trophy Polish",  desc: "Achievement buffs doubled",         requires: "core" },
  { id: "pride2",      icon: "🎖️", branch: "pride",   angle: -40,  radius: 0.68, cost: 35, minPrestige: 3, name: "Laurel Crown",   desc: "All wisdom gains +10%",              requires: "pride1" },
  { id: "pride3",      icon: "👑", branch: "pride",   angle: -40,  radius: 0.96, cost: 80, minPrestige: 6, name: "Legendary Ego",  desc: "All wisdom gains +25%",              requires: "pride2" },
  { id: "insight1",    icon: "💎", branch: "insight", angle: 40,   radius: 0.40, cost: 5,  minPrestige: 0, name: "Deep Insight",   desc: "Insight bonus: +10% → +12.5%/pt",   requires: "core" },
  { id: "insight2",    icon: "🔮", branch: "insight", angle: 40,   radius: 0.64, cost: 15, minPrestige: 2, name: "Ancient Wisdom", desc: "Insight bonus: +12.5% → +15%/pt",   requires: "insight1" },
  { id: "insight3",    icon: "🌊", branch: "insight", angle: 40,   radius: 0.88, cost: 40, minPrestige: 4, name: "Deepest Well",   desc: "Insight bonus: +15% → +20%/pt",     requires: "insight2" },
  { id: "insight4",    icon: "🪞", branch: "insight", angle: 40,   radius: 1.08, cost: 70, minPrestige: 6, name: "Clear Mirror",   desc: "Insight bonus: +20% → +25%/pt",     requires: "insight3" },
  { id: "insight5",    icon: "🔭", branch: "insight", angle: 40,   radius: 1.28, cost: 160,minPrestige: 10,name: "Cosmic Perspective",desc: "Insight bonus: +25% → +30%/pt",   requires: "insight4" },
  { id: "gremlin1",    icon: "😼", branch: "gremlin", angle: 90,   radius: 0.55, cost: 20, minPrestige: 2, name: "Gremlin Pact",   desc: "Silly Cat no longer steals wisdom", requires: "core" },
  { id: "gremlin2",    icon: "🧤", branch: "gremlin", angle: 90,   radius: 0.82, cost: 35, minPrestige: 4, name: "Sticky Paws",    desc: "Silly Cat steals 40% instead of 60%", requires: "gremlin1" },
  { id: "gremlin3",    icon: "🎭", branch: "gremlin", angle: 90,   radius: 1.09, cost: 90, minPrestige: 8, name: "Chaos Encore",   desc: "Silly Cat's victory boost lasts longer", requires: "gremlin2" },
  { id: "focus1",      icon: "🎯", branch: "focus",   angle: -65,  radius: 0.38, cost: 6,  minPrestige: 0, name: "Soft Focus",      desc: "Click wisdom +10%",                  requires: "core" },
  { id: "focus2",      icon: "🔆", branch: "focus",   angle: -65,  radius: 0.68, cost: 18, minPrestige: 2, name: "Bright Focus",    desc: "Click wisdom +20%",                  requires: "focus1" },
  { id: "focus3",      icon: "☄️", branch: "focus",   angle: -65,  radius: 0.98, cost: 55, minPrestige: 5, name: "Laser Thought",   desc: "Click wisdom +35%",                  requires: "focus2" },
  { id: "harvest1",    icon: "🌾", branch: "harvest", angle: 65,   radius: 0.38, cost: 6,  minPrestige: 0, name: "Quiet Harvest",   desc: "Passive wisdom +10%",                requires: "core" },
  { id: "harvest2",    icon: "🌻", branch: "harvest", angle: 65,   radius: 0.68, cost: 18, minPrestige: 2, name: "Rich Soil",       desc: "Passive wisdom +25%",                requires: "harvest1" },
  { id: "harvest3",    icon: "🌳", branch: "harvest", angle: 65,   radius: 0.98, cost: 55, minPrestige: 5, name: "Orchard Engine",  desc: "Passive wisdom +50%",                requires: "harvest2" }
];

function treeBought(id) { return id === "core" || !!insightPurchases[id]; }
function maxPrestige() { return prestigeCount || 0; }
function treeVisible(node) { if (node.id === "core") return true; return maxPrestige() >= node.minPrestige; }
function treeCanBuy(node) { if (treeBought(node.id)) return false; if (!treeVisible(node)) return false; if (node.requires && !treeBought(node.requires)) return false; return insight >= node.cost; }
function treeWhy(node) {
  if (treeBought(node.id)) return "Already unlocked";
  if (!treeVisible(node)) return `Requires ${node.minPrestige} Transcend${node.minPrestige === 1 ? "" : "s"}`;
  if (node.requires && !treeBought(node.requires)) { const req = TREE_NODES.find(n => n.id === node.requires); return `Requires ${req ? req.name : node.requires}`; }
  if (insight < node.cost) return `Need ${node.cost} ✨`;
  return "Tap to unlock";
}

function buyTreeNode(id) {
  const node = TREE_NODES.find(n => n.id === id);
  if (!node || !treeCanBuy(node)) { sfx("nope"); return; }
  insight -= node.cost; insightSpent += node.cost; insightPurchases[id] = 1;
  sfx("buy");
  if (id === "pride1") recalcAchMul();
  if (id.startsWith("luck") && goldenTimer) { clearTimeout(goldenTimer); goldenTimer = setTimeout(spawnGolden, goldenIntervalMs()); }
  save(); render(); renderTree();
}

function refundTree() {
  let refund = 0;
  for (const n of TREE_NODES) { if (n.id === "core") continue; if (insightPurchases[n.id]) refund += n.cost; }
  if (refund === 0) { sfx("nope"); return; }
  if (insight < 5) { sfx("nope"); return; }
  insight -= 5; insightSpent += 5 - refund;
  for (const n of TREE_NODES) { if (n.id === "core") continue; delete insightPurchases[n.id]; }
  insight += refund;
  sfx("buy"); recalcAchMul(); save(); render(); renderTree();
}

function insLv(id) { return insightPurchases[id] || 0; }

const wis = document.getElementById("wis");
const pc = document.getElementById("pc");
const ps = document.getElementById("ps");
const liveClick = document.getElementById("liveClick");
const liveSec = document.getElementById("liveSec");
const mu = document.getElementById("mu");
const bo = document.getElementById("bo");
const list = document.getElementById("ups");
const challenge = document.getElementById("challenge");
const chsub = document.getElementById("chsub");
const layout = document.querySelector(".layout");
const tab = document.getElementById("tab");
const hint = document.getElementById("hint");
const reward = document.getElementById("reward");
const classBadge = document.getElementById("classBadge");
const classBadgeIcon = document.getElementById("classBadgeIcon");
const classBadgeName = document.getElementById("classBadgeName");
const classBadgeDesc = document.getElementById("classBadgeDesc");
const buyMaxBtn = document.getElementById("buyMax");
const dailyCard = document.getElementById("dailyCard");
const dailyTitle = document.getElementById("dailyTitle");
const dailyProgress = document.getElementById("dailyProgress");
const dailyReward = document.getElementById("dailyReward");

let bank = 0, earned = 0, mult = 1, bossLevel = 0;
let owned = ups.map(() => 0);
let clicks = 0, instant = false, msIdx = 0, boostEnd = 0;
let hareldBoostEnd = 0, hareldBoostMul = 1;
let insight = 0, insightEarned = 0, insightSpent = 0, insightPurchases = {}, prestigeCount = 0;
let classId = null, pendingClassId = null;
let dailyCompletedDate = "";

const CLASSES = {
  pouncing: { icon: "🐾", name: "Pouncing Scholar", desc: "For active players", click: 1.5, sec: 0.5, offline: 1, offlineCap: 8 },
  dreaming: { icon: "💤", name: "Dreaming Sage", desc: "For idle players", click: 0.5, sec: 1.5, offline: 1, offlineCap: 8 },
  watcher: { icon: "🌙", name: "Night Watcher", desc: "For players who return later", click: 1, sec: 1, offline: 2, offlineCap: 24 }
};

const units = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod", "Vg"];
function fmt(n) {
  if (!isFinite(n)) return "∞";
  if (n < 0) return "-" + fmt(-n);
  if (n < 1000) return n < 10 && n % 1 ? n.toFixed(1) : String(Math.floor(n));
  const e = Math.floor(Math.log10(n) / 3);
  if (e >= units.length) return n.toExponential(2).replace("e+", "e");
  return (n / 1000 ** e).toFixed(2).replace(/\.?0+$/, "") + units[e];
}

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (!s) return;
    bank = s.bank || 0; earned = s.earned || 0; mult = s.mult || 1;
    bossLevel = s.bossLevel || 0; msIdx = s.msIdx || 0;
    owned = ups.map((_, i) => (s.owned && s.owned[i]) || 0);
    classId = CLASSES[s.classId] ? s.classId : null;
    dailyCompletedDate = s.dailyCompletedDate || "";
    insight = s.insight || 0;
    prestigeCount = s.prestigeCount != null ? s.prestigeCount : (s.insight > 0 || s.insightEarned > 0 || s.insightSpent > 0 ? 1 : 0);
    if (s.insightEarned != null) { insightEarned = s.insightEarned; insightSpent = s.insightSpentNew || 0; insightPurchases = s.insightPurchases || {}; }
    else { insightEarned = s.insightSpent || 0; insightSpent = 0; }
  } catch (e) { owned = ups.map(() => 0); }
}

function save() {
  if (resetting) return;
  try { localStorage.setItem(KEY, JSON.stringify({ bank, earned, mult, bossLevel, owned, msIdx, insight, insightEarned, insightSpentNew: insightSpent, insightPurchases, prestigeCount, classId, dailyCompletedDate })); } catch (e) { return; }
}

const ACHS = [
  { id: "click1",   name: "First Wisdom",       desc: "Click once",                       check: () => clicks >= 1,             buff: { click: 1.01 } },
  { id: "click100", name: "Thumb Workout",      desc: "Click 100 times",                  check: () => clicks >= 100,           buff: { click: 1.05 } },
  { id: "click1000",name: "Slot Machine",       desc: "Click 1,000 times",                check: () => clicks >= 1000,          buff: { click: 1.10 } },
  { id: "combo15",  name: "In The Zone",        desc: "Reach a ×15 combo",                check: () => achFlags.bestCombo >= 15, buff: { click: 1.05 } },
  { id: "combo40",  name: "Unstoppable",        desc: "Reach a ×40 combo",                check: () => achFlags.bestCombo >= 40, buff: { click: 1.15 } },
  { id: "up1",      name: "First Upgrade",      desc: "Buy any upgrade",                  check: () => owned.some(o => o >= 1), buff: { all: 1.02 } },
  { id: "up10",     name: "Collector",          desc: "Own 10 total upgrades",            check: () => owned.reduce((a,b)=>a+b,0) >= 10, buff: { all: 1.05 } },
  { id: "up50",     name: "Hoarder",            desc: "Own 50 total upgrades",            check: () => owned.reduce((a,b)=>a+b,0) >= 50, buff: { all: 1.10 } },
  { id: "up200",    name: "Warehouse",          desc: "Own 200 total upgrades",           check: () => owned.reduce((a,b)=>a+b,0) >= 200, buff: { all: 1.20 } },
  { id: "bank1k",   name: "Pocket Wisdom",      desc: "Bank 1,000 wisdom",                check: () => bank >= 1000,            buff: { all: 1.03 } },
  { id: "bank1m",   name: "Wise Investor",      desc: "Bank 1,000,000 wisdom",            check: () => bank >= 1e6,             buff: { all: 1.05 } },
  { id: "bank1b",   name: "Vault Keeper",       desc: "Bank 1,000,000,000 wisdom",        check: () => bank >= 1e9,             buff: { all: 1.10 } },
  { id: "earn1m",   name: "Millionaire",        desc: "Earn 1,000,000 total wisdom",      check: () => earned >= 1e6,           buff: { all: 1.10 } },
  { id: "earn1b",   name: "Billionaire",        desc: "Earn 1,000,000,000 total wisdom",  check: () => earned >= 1e9,           buff: { all: 1.20 } },
  { id: "boss1",    name: "Tangerine Thief",    desc: "Beat the Tangerine Cat",           check: () => bossLevel >= 1,          buff: { all: 1.15 } },
  { id: "boss3",    name: "Boss Slayer",        desc: "Beat the boss 3 times",            check: () => bossLevel >= 3,          buff: { all: 1.25 } },
  { id: "boss6",    name: "Orchard Conqueror",  desc: "Beat the boss 6 times",            check: () => bossLevel >= 6,          buff: { all: 1.35 } },
  { id: "riddle",   name: "Riddle Solver",      desc: "Solve Silly Cat's riddle first try", check: () => achFlags.riddleFirstTry, buff: { all: 1.10 } },
  { id: "survive",  name: "Untouchable",        desc: "Win a boss fight without being hit", check: () => achFlags.flawless,     buff: { all: 1.20 } },
  { id: "golden1",  name: "Golden Paw",         desc: "Catch a Golden Tangerine",         check: () => achFlags.goldenCaught >= 1, buff: { all: 1.05 } },
  { id: "golden5",  name: "Golden Hoard",       desc: "Catch 5 Golden Tangerines",        check: () => achFlags.goldenCaught >= 5, buff: { all: 1.10 } },
  { id: "golden20", name: "Golden Legend",      desc: "Catch 20 Golden Tangerines",       check: () => achFlags.goldenCaught >= 20, buff: { all: 1.20 } },
  { id: "syn1",     name: "Resonance",          desc: "Own a synergy upgrade",            check: () => ups.some((u, i) => u.syn && owned[i] > 0), buff: { all: 1.05 } },
  { id: "syn5",     name: "Chorus",             desc: "Own 5 synergy upgrades",           check: () => ups.filter((u, i) => u.syn && owned[i] > 0).length >= 5, buff: { all: 1.15 } }
];

const ACH_KEY = "wisdom-clicker-achs";
let unlocked = {};
let achFlags = { riddleFirstTry: false, flawless: false, goldenCaught: 0, bestCombo: 0 };
let achMul = { all: 1, click: 1 };
const toasts = document.getElementById("toasts");

function loadAchs() {
  try { const s = JSON.parse(localStorage.getItem(ACH_KEY)); if (s) { unlocked = s.unlocked || {}; achFlags = { ...achFlags, ...(s.achFlags || {}) }; } } catch (e) {}
  recalcAchMul();
}

function saveAchs() { if (resetting) return; try { localStorage.setItem(ACH_KEY, JSON.stringify({ unlocked, achFlags })); } catch (e) {} }

function recalcAchMul() {
  const double = treeBought("pride1");
  const amplify = (v) => double ? 1 + (v - 1) * 2 : v;
  achMul = { all: 1, click: 1 };
  for (const a of ACHS) {
    if (!unlocked[a.id]) continue;
    if (a.buff.all) achMul.all *= amplify(a.buff.all);
    if (a.buff.click) achMul.click *= amplify(a.buff.click);
  }
}

const toastList = [];
function layoutToasts() { toastList.forEach((el, k) => { const i = toastList.length - 1 - k; el.style.setProperty("--i", i); el.dataset.deep = i > 2 ? "1" : "0"; }); }
function armToast(el, ms) { clearTimeout(el._t); el._left = ms; el._t0 = performance.now(); el._t = setTimeout(() => dismissToast(el), ms); }
function dismissToast(el) { const k = toastList.indexOf(el); if (k < 0) return; clearTimeout(el._t); toastList.splice(k, 1); layoutToasts(); el.classList.add("out"); setTimeout(() => el.remove(), 500); }
function pauseToasts() { toastList.forEach((el) => { clearTimeout(el._t); el._left = Math.max(2500, el._left - (performance.now() - el._t0)); }); }
function resumeToasts() { toastList.forEach((el) => armToast(el, el._left)); }
toasts.addEventListener("mouseenter", pauseToasts);
toasts.addEventListener("mouseleave", resumeToasts);

function toast(name, desc, kind = "ach") {
  const el = document.createElement("div");
  el.className = "toast";
  const icons = { ach: "🏆", silly: "😼", golden: "🍊", story: "📖", hareld: "🐰", transcend: "✨", daily: "📅" };
  const labels = { ach: "Achievement unlocked", silly: "Silly Cat", golden: "Gift", story: "Story", hareld: "Hareld", transcend: "System", daily: "Daily Wisdom" };
  el.innerHTML = `<span class="tico">${icons[kind] || "🔔"}</span><div class="tbody"><small class="tlabel">${labels[kind] || "Notification"}<i>now</i></small><b></b><span class="tdesc"></span></div>`;
  el.querySelector("b").textContent = name;
  el.querySelector(".tdesc").textContent = desc;
  toastList.forEach((o) => armToast(o, Math.max(4500, o._left - (performance.now() - o._t0))));
  toastList.push(el);
  toasts.appendChild(el);
  layoutToasts();
  armToast(el, 8000);
  el.addEventListener("click", () => dismissToast(el));
  addPhoneNotif(kind, name);
  if (kind === "ach") el.addEventListener("click", () => { renderAchPanel(); achModal.hidden = false; });
  sfx("buy");
}

function checkAchs() {
  if (tutPaused) return;
  let changed = false;
  for (const a of ACHS) {
    if (unlocked[a.id]) continue;
    if (a.check()) { unlocked[a.id] = true; changed = true; toast(a.name, a.desc); }
  }
  if (changed) { recalcAchMul(); saveAchs(); renderAchCount(); renderTrophyWall(); if (typeof achModal !== "undefined" && !achModal.hidden) renderAchPanel(); }
}

function renderAchCount() { const got = Object.keys(unlocked).length; const el = document.getElementById("achCount"); if (el) el.textContent = `${got}/${ACHS.length}`; }

const achModal = document.getElementById("achModal");
const achGrid = document.getElementById("achGrid");
const achModalCount = document.getElementById("achModalCount");
const TIER_COLORS = { common: "#6a6180", click: "#e5577f", milestone: "#f0c24f", boss: "#d48813", golden: "#ffb347", secret: "#9b3fd6" };

function achTier(a) {
  if (a.id.startsWith("boss")) return "boss";
  if (a.id.startsWith("golden")) return "golden";
  if (a.id.startsWith("combo")) return "click";
  if (a.id.startsWith("click")) return "click";
  if (a.id.startsWith("syn")) return "secret";
  if (a.id.startsWith("bank") || a.id.startsWith("earn")) return "milestone";
  if (a.id === "riddle" || a.id === "survive") return "secret";
  return "common";
}

function achBuffLabel(a) { const parts = []; if (a.buff.all) parts.push(`+${Math.round((a.buff.all - 1) * 100)}% all`); if (a.buff.click) parts.push(`+${Math.round((a.buff.click - 1) * 100)}% click`); return parts.join(" · ") || "no bonus"; }

function renderAchPanel() {
  const got = Object.keys(unlocked).length;
  achModalCount.textContent = `${got}/${ACHS.length}`;
  achGrid.innerHTML = "";
  for (const a of ACHS) {
    const isGot = !!unlocked[a.id];
    const tier = achTier(a);
    const card = document.createElement("div");
    card.className = "ach-card" + (isGot ? " got" : " locked");
    card.style.setProperty("--tier", TIER_COLORS[tier]);
    card.innerHTML = `<div class="ach-badge"><span class="ach-ico">${isGot ? "🏆" : "❔"}</span></div><div class="ach-info"><b>${a.name}</b><small>${a.desc}</small><em>${isGot ? achBuffLabel(a) : "locked"}</em></div>`;
    achGrid.appendChild(card);
  }
}

document.getElementById("achBtn").addEventListener("click", () => { sfx("blip", { pitch: 1100 }); renderAchPanel(); achModal.hidden = false; });
document.getElementById("achClose").addEventListener("click", () => { sfx("blip", { pitch: 700 }); achModal.hidden = true; });
achModal.addEventListener("click", (e) => { if (e.target === achModal) { achModal.hidden = true; sfx("blip", { pitch: 700 }); } });

const treeModal = document.getElementById("treeModal");
const treeStage = document.getElementById("treeStage");
const treeLines = document.getElementById("treeLines");
const treeNodes = document.getElementById("treeNodes");
const treeList = document.getElementById("treeList");
const treeInsight = document.getElementById("treeInsight");
const treeHint = document.getElementById("treeHint");
let treeEls = {};
let treePanX = 0, treePanY = 0;
let treeDragging = false, treeDragMoved = false, treeDragPointerId = null;
let treeDragStartX = 0, treeDragStartY = 0, treePanStartX = 0, treePanStartY = 0;
let treeSuppressClickUntil = 0;

function applyTreePan() {
  const transform = `translate(${treePanX}px, ${treePanY}px)`;
  treeLines.style.transform = transform;
  treeNodes.style.transform = transform;
}

treeStage.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  treeDragging = true;
  treeDragMoved = false;
  treeDragPointerId = event.pointerId;
  treeDragStartX = event.clientX;
  treeDragStartY = event.clientY;
  treePanStartX = treePanX;
  treePanStartY = treePanY;
  treeStage.classList.add("dragging");
});

treeStage.addEventListener("pointermove", (event) => {
  if (!treeDragging || event.pointerId !== treeDragPointerId) return;
  const dx = event.clientX - treeDragStartX;
  const dy = event.clientY - treeDragStartY;
  if (Math.abs(dx) + Math.abs(dy) > 5) treeDragMoved = true;
  if (!treeDragMoved) return;
  event.preventDefault();
  treePanX = treePanStartX + dx;
  treePanY = treePanStartY + dy;
  applyTreePan();
});

function finishTreeDrag(event) {
  if (!treeDragging || event.pointerId !== treeDragPointerId) return;
  if (treeDragMoved) treeSuppressClickUntil = performance.now() + 100;
  treeDragging = false;
  treeStage.classList.remove("dragging");
  treeDragPointerId = null;
}

treeStage.addEventListener("pointerup", finishTreeDrag);
treeStage.addEventListener("pointercancel", finishTreeDrag);

const TREE_POSITIONS = {
  core: [500, 350],
  sleep1: [430, 280], sleep2: [360, 210], sleep3: [290, 140], sleep4: [220, 70], sleep5: [150, 70],
  luck1: [430, 420], luck2: [360, 490], luck3: [290, 560], luck4: [220, 630], luck5: [150, 630],
  flow1: [500, 280], flow2: [500, 210], flow3: [500, 140], flow4: [500, 70], flow5: [500, 30],
  pride1: [570, 350], pride2: [640, 350], pride3: [710, 350],
  insight1: [570, 420], insight2: [640, 490], insight3: [710, 560], insight4: [780, 630], insight5: [850, 630],
  gremlin1: [430, 350], gremlin2: [360, 350], gremlin3: [290, 350],
  focus1: [570, 280], focus2: [640, 210], focus3: [710, 140],
  harvest1: [500, 420], harvest2: [500, 490], harvest3: [500, 560]
};

function treeNodePos(node) {
  const position = TREE_POSITIONS[node.id];
  if (position) return { x: position[0], y: position[1] };
  return { x: 500, y: 350 };
}

function treeOrthogonalPath(from, to) {
  const bend = Math.abs(to.x - from.x) >= Math.abs(to.y - from.y)
    ? { x: to.x, y: from.y }
    : { x: from.x, y: to.y };
  return `M ${from.x} ${from.y} L ${bend.x} ${bend.y} L ${to.x} ${to.y}`;
}

function renderTreeLines() {
  treeLines.innerHTML = "";
  for (const n of TREE_NODES) {
    if (!n.requires) continue;
    const from = TREE_NODES.find(x => x.id === n.requires);
    if (!from) continue;
    const a = treeNodePos(from);
    const b = treeNodePos(n);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", treeOrthogonalPath(a, b));
    line.setAttribute("class", treeBought(n.id) ? "tree-line on" : treeBought(from.id) && treeVisible(n) ? "tree-line ready" : "tree-line locked");
    treeLines.appendChild(line);
  }
}

function renderTreeNodes() {
  treeNodes.innerHTML = ""; treeEls = {};
  for (const n of TREE_NODES) {
    const p = treeNodePos(n);
    const bought = treeBought(n.id);
    const visible = treeVisible(n);
    const canBuy = treeCanBuy(n);
    const el = document.createElement("button");
    el.type = "button";
    el.className = "tree-node" + (bought ? " bought" : "") + (!visible ? " hidden-node" : "") + (canBuy ? " ready" : "");
    el.style.left = (p.x / 1000 * 100) + "%"; el.style.top = (p.y / 700 * 100) + "%";
    el.dataset.id = n.id;
    el.innerHTML = `
      <span class="tn-orb" data-icon="${n.icon || "★"}"></span>
      <span class="tn-label">${visible ? n.name : "???"}</span>
      ${bought ? '<span class="tn-check">✓</span>' : ''}
      <span class="tn-tip"><b>${n.name}</b><small>${n.desc}</small><em>${treeWhy(n)}</em></span>
    `;
    if (canBuy) el.addEventListener("click", () => { if (performance.now() < treeSuppressClickUntil) return; buyTreeNode(n.id); });
    else if (!bought) el.addEventListener("click", () => { if (performance.now() < treeSuppressClickUntil) return; sfx("nope"); treeHint.textContent = treeWhy(n); setTimeout(() => { treeHint.textContent = "Drag to explore · tap a glowing star to unlock it."; }, 2200); });
    el.addEventListener("mouseenter", () => { if (el._chime) return; el._chime = true; sfx("chime"); });
    treeNodes.appendChild(el); treeEls[n.id] = el;
  }
}

function renderTreeList() {
  treeList.innerHTML = "";
  const branches = ["sleep", "luck", "flow", "pride", "insight", "gremlin", "focus", "harvest"];
  for (const b of branches) {
    const nodes = TREE_NODES.filter(n => n.branch === b);
    if (!nodes.length) continue;
    if (!nodes.some(treeVisible)) continue;
    const group = document.createElement("div");
    group.className = "tree-group";
    group.innerHTML = `<h3>${b}</h3>`;
    for (const n of nodes) {
      if (!treeVisible(n)) continue;
      const bought = treeBought(n.id); const canBuy = treeCanBuy(n);
      const row = document.createElement("button"); row.type = "button";
      row.className = "tree-row" + (bought ? " bought" : "") + (canBuy ? " ready" : "");
      row.innerHTML = `<span class="tr-orb"></span><span class="tr-info"><b>${n.name}</b><small>${n.desc}</small></span><span class="tr-cost">${bought ? "✓" : "✨ " + n.cost}</span>`;
      if (canBuy) row.addEventListener("click", () => buyTreeNode(n.id));
      else if (!bought) row.addEventListener("click", () => { sfx("nope"); treeHint.textContent = treeWhy(n); setTimeout(() => { treeHint.textContent = "Tap a glowing star to unlock it."; }, 2200); });
      group.appendChild(row);
    }
    treeList.appendChild(group);
  }
}

function renderTree() { treeInsight.textContent = insight + " ✨"; renderTreeLines(); renderTreeNodes(); renderTreeList(); applyTreePan(); treeHint.textContent = "Drag to explore · tap a glowing star to unlock it."; }

document.getElementById("insightBtn").addEventListener("click", () => { sfx("blip", { pitch: 1100 }); renderTree(); treeModal.hidden = false; });
document.getElementById("treeClose").addEventListener("click", () => { sfx("blip", { pitch: 700 }); treeModal.hidden = true; });
document.getElementById("treeReset").addEventListener("click", () => { refundTree(); });
treeModal.addEventListener("click", (e) => { if (e.target === treeModal) { treeModal.hidden = true; sfx("blip", { pitch: 700 }); } });

const statsModal = document.getElementById("statsModal");
const statsGrid = document.getElementById("statsGrid");
const STATS_KEY = "wisdom-clicker-stats";
let lifetimeClicks = 0, lifetimeEarned = 0, lifetimeInsight = 0;
let bossesWon = 0, sillyWins = 0, sillyLosses = 0, goldenTotal = 0;
let firstPlayedAt = Date.now();

function loadStats() {
  try { const s = JSON.parse(localStorage.getItem(STATS_KEY)); if (!s) return;
    lifetimeClicks = s.lifetimeClicks || 0; lifetimeEarned = s.lifetimeEarned || 0; lifetimeInsight = s.lifetimeInsight || 0;
    bossesWon = s.bossesWon || 0; sillyWins = s.sillyWins || 0; sillyLosses = s.sillyLosses || 0;
    goldenTotal = s.goldenTotal || 0; firstPlayedAt = s.firstPlayedAt || Date.now();
  } catch (e) {}
}

function saveStats() { if (resetting) return; try { localStorage.setItem(STATS_KEY, JSON.stringify({ lifetimeClicks, lifetimeEarned, lifetimeInsight, bossesWon, sillyWins, sillyLosses, goldenTotal, firstPlayedAt })); } catch (e) {} }

function prettyTime(ms) { const s = Math.floor(ms / 1000); const d = Math.floor(s / 86400); const h = Math.floor((s % 86400) / 3600); const m = Math.floor((s % 3600) / 60); if (d > 0) return `${d}d ${h}h`; if (h > 0) return `${h}h ${m}m`; return `${m}m`; }

function renderStats() {
  const rows = [
    ["✨ Current wisdom", fmt(bank)],
    ["✨ Lifetime wisdom", fmt(lifetimeEarned)],
    ["👆 Total clicks", lifetimeClicks.toLocaleString()],
    ["🔥 Best combo", "×" + achFlags.bestCombo],
    ["🛒 Total upgrades", owned.reduce((a,b)=>a+b,0).toLocaleString()],
    ["⚔️ Boss fights won", bossesWon],
    ["😼 Silly wins / losses", `${sillyWins} / ${sillyLosses}`],
    ["🍊 Golden tangerines", goldenTotal],
    ["🏆 Achievements", `${Object.keys(unlocked).length}/${ACHS.length}`],
    ["✨ Total Insight earned", lifetimeInsight],
    ["✨ Current Insight", insight],
    ["🌟 Insight spent", insightSpent],
    ["⏱️ Time played", prettyTime(Date.now() - firstPlayedAt)]
  ];
  statsGrid.innerHTML = rows.map(([k, v]) => `<div class="stat-row"><span>${k}</span><b>${v}</b></div>`).join("");
}

document.getElementById("statsBtn").addEventListener("click", () => { sfx("blip", { pitch: 1000 }); renderStats(); statsModal.hidden = false; });
document.getElementById("statsClose").addEventListener("click", () => { sfx("blip", { pitch: 700 }); statsModal.hidden = true; });
statsModal.addEventListener("click", (e) => { if (e.target === statsModal) { statsModal.hidden = true; sfx("blip", { pitch: 700 }); } });

const notifModal = document.getElementById("notifModal");
const notifHistory = document.getElementById("notifHistory");
const notifCount = document.getElementById("notifCount");
document.getElementById("notifBtn").addEventListener("click", () => { sfx("blip", { pitch: 1000 }); renderNotifHistory(); notifModal.hidden = false; });
document.getElementById("notifClose").addEventListener("click", () => { sfx("blip", { pitch: 700 }); notifModal.hidden = true; });
notifModal.addEventListener("click", (e) => { if (e.target === notifModal) { notifModal.hidden = true; sfx("blip", { pitch: 700 }); } });

const rollState = { cur: 0, target: 0, raf: null };
const BIG_NUM_MAX_STEP = 0.14;
function rollTo(value) { rollState.target = value; if (rollState.raf) return; rollState.raf = requestAnimationFrame(rollTick); }
function rollTick() {
  const diff = rollState.target - rollState.cur;
  if (Math.abs(diff) < Math.max(1, rollState.target * 0.0005)) { rollState.cur = rollState.target; wis.textContent = fmt(rollState.cur); rollState.raf = null; return; }
  rollState.cur += diff * BIG_NUM_MAX_STEP;
  wis.textContent = fmt(rollState.cur);
  rollState.raf = requestAnimationFrame(rollTick);
}

const trophyRow = document.createElement("div");
trophyRow.className = "trophy-row";
trophyRow.id = "trophyRow";
trophyRow.title = "Click to see all achievements";
trophyRow.addEventListener("click", () => { sfx("blip", { pitch: 1100 }); renderAchPanel(); achModal.hidden = false; });
document.getElementById("achBtn").after(trophyRow);

function renderTrophyWall() {
  trophyRow.innerHTML = "";
  ACHS.forEach((a) => {
    const got = !!unlocked[a.id];
    const t = document.createElement("span");
    t.className = "trophy" + (got ? " got" : "");
    t.title = got ? a.name : "???";
    t.textContent = got ? "🏆" : "·";
    t.style.setProperty("--tier", TIER_COLORS[achTier(a)]);
    trophyRow.appendChild(t);
  });
}

loadStats();
renderTrophyWall();
setInterval(saveStats, 5000);
window.addEventListener("beforeunload", saveStats);
setInterval(checkAchs, 800);

const OFFLINE_KEY = "wisdom-clicker-last-seen";
function recordSeen() { if (resetting) return; try { localStorage.setItem(OFFLINE_KEY, String(Date.now())); } catch (e) {} }

function computeOffline() {
  let lastSeen = 0;
  try { lastSeen = parseInt(localStorage.getItem(OFFLINE_KEY)) || 0; } catch (e) {}
  if (!lastSeen) return null;
  const away = Math.min(Date.now() - lastSeen, offlineCapMs());
  if (away < 60000) return null;
  const activeClass = classId ? CLASSES[classId] : null;
  const rate = perSec();
  if (rate <= 0) return null;
  const dreamBonus = treeBought("sleep3") ? 2 : 1;
  const classCap = activeClass ? activeClass.offlineCap * 3600 * 1000 : 0;
  const cappedAway = Math.min(away, classCap || away);
  const offlineMul = treeBought("sleep5") ? 1.25 : 1;
  const gain = rate * (cappedAway / 1000) * dreamBonus * offlineMul * (activeClass ? activeClass.offline : 1);
  return { away: cappedAway, gain };
}

function showOffline(gain, away) {
  const mins = Math.floor(away / 60000); const hrs = Math.floor(mins / 60); const rem = mins % 60;
  const pretty = hrs > 0 ? `${hrs}h ${rem}m` : `${mins}m`;
  document.getElementById("otext").innerHTML = `You were away <b>${pretty}</b>.<br>Your cats earned <b>✨ ${fmt(gain)}</b> wisdom.`;
  const el = document.getElementById("offline");
  el.hidden = false;
  document.getElementById("oclaim").onclick = () => { earn(gain); render(); save(); el.hidden = true; sfx("buy"); floatText("+" + fmt(gain), innerWidth / 2, innerHeight / 3); };
}

document.addEventListener("visibilitychange", () => { if (document.hidden) { save(); recordSeen(); } });
window.addEventListener("beforeunload", () => { save(); recordSeen(); });
setInterval(recordSeen, 15000);

const GOLDENS_PER_INSIGHT = 3;
function insightGain() { return Math.floor(Math.sqrt(goldenTotal / GOLDENS_PER_INSIGHT)); }

function updatePrestigeButton() {
  const el = document.getElementById("prestige");
  const sub = document.getElementById("psub");
  if (!el || !sub) return;
  const gain = insightGain();
  if (gain < 1) { el.hidden = true; return; }
  el.hidden = false;
  if (!window._prestigePinged) { window._prestigePinged = true; pushBanner("transcend", "Transcend ready", "You may take the Great Nap.", () => {}); }
  const nextTier = gain + 1;
  const needForNext = nextTier * nextTier * GOLDENS_PER_INSIGHT;
  const closeness = goldenTotal / needForNext;
  const isHot = closeness > 0.8;
  el.classList.toggle("hot", isHot);
  if (isHot) { const remainPct = Math.round((1 - closeness) * 100); sub.innerHTML = `+${gain} Insight · +${gain * 10}% forever<br><em>${remainPct}% to +${nextTier} Insight · catch more goldens</em>`; }
  else { sub.textContent = `+${gain} Insight · +${gain * 10}% wisdom forever`; }
}

function openPrestigeModal() {
  const gain = insightGain();
  if (gain < 1) return;
  const next = insight + gain; const nextBonus = next * 10;
  document.getElementById("ptext").innerHTML = `You will gain <b>+${gain} Insight</b>.<br>Total Insight: <b>${next}</b> → <b>+${nextBonus}%</b> wisdom forever.<br><br>You will lose: wisdom, upgrades, boss level, and the ×boss bonus.<br>You will keep: achievements, Insight.`;
  const first = !classId;
  const choice = document.getElementById("classChoice");
  const yes = document.getElementById("pyes");
  if (first) {
    pendingClassId = null;
    renderClassChoices();
    choice.hidden = false;
    yes.textContent = "Choose a class first";
    yes.disabled = true;
  } else {
    choice.hidden = true;
    yes.textContent = "Transcend";
    yes.disabled = false;
  }
  document.getElementById("pmodal").hidden = false;
}

function renderClassChoices() {
  const grid = document.getElementById("classGrid");
  if (!grid) return;
  grid.innerHTML = "";
  Object.entries(CLASSES).forEach(([id, info]) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "class-card" + (pendingClassId === id ? " selected" : "");
    card.innerHTML = `<span class="class-icon">${info.icon}</span><b>${info.name}</b><small>${info.desc}</small><em>Click ×${info.click} · Passive ×${info.sec}<br>Offline ×${info.offline} · ${info.offlineCap}h cap</em>`;
    card.addEventListener("click", () => {
      pendingClassId = id;
      grid.querySelectorAll(".class-card").forEach((el) => el.classList.toggle("selected", el === card));
      const yes = document.getElementById("pyes");
      yes.textContent = "Transcend as " + info.name;
      yes.disabled = false;
      sfx("blip", { pitch: 1000 });
    });
    grid.appendChild(card);
  });
}

function doPrestige() {
  const gain = insightGain();
  if (gain < 1) return;
  if (!classId) {
    if (!pendingClassId) return;
    classId = pendingClassId;
  }
  insight += gain; prestigeCount += 1; lifetimeInsight += gain; insightEarned += gain;
  bank = 0; earned = 0; mult = 1; bossLevel = 0;
  owned = ups.map(() => 0);
  clicks = 0; boostEnd = 0;
  rollState.cur = 0; rollState.target = 0;
  wis.textContent = "0";
  document.getElementById("pmodal").hidden = true;
  save(); sfx("win"); render(); replay(wis.parentElement, "landed"); updatePrestigeButton();
  const text = `Welcome back, wise one. You carry ${insight} Insight.`;
  live.textContent = text; type(text); replay(bubble, "hit"); renderAchCount();
  pendingClassId = null;
}

document.getElementById("prestige").addEventListener("click", () => { sfx("blip", { pitch: 1100 }); openPrestigeModal(); });
document.getElementById("pyes").addEventListener("click", doPrestige);
document.getElementById("pno").addEventListener("click", () => { sfx("nope"); document.getElementById("pmodal").hidden = true; });

function insightRate() { if (treeBought("insight5")) return 0.30; if (treeBought("insight4")) return 0.25; if (treeBought("insight3")) return 0.20; if (treeBought("insight2")) return 0.15; if (treeBought("insight1")) return 0.125; return 0.10; }
const insightMul = () => 1 + insight * insightRate();

const cost = (i) => Math.ceil(ups[i].base * 1.22 ** owned[i]);

let upgradeFilter = "all";
function upgradeMatches(u, i) {
  if (upgradeFilter === "affordable") return bank >= cost(i);
  if (upgradeFilter === "owned") return owned[i] > 0;
  if (upgradeFilter === "click") return !!u.click;
  if (upgradeFilter === "sec") return !!u.sec;
  return true;
}

function boostInfo() {
  const n = performance.now();
  const a = n < boostEnd ? { m: 5, left: boostEnd - n } : null;
  const b = n < hareldBoostEnd ? { m: hareldBoostMul, left: hareldBoostEnd - n } : null;
  if (a && b) return a.m > b.m || (a.m === b.m && a.left >= b.left) ? a : b;
  return a || b || { m: 1, left: 0 };
}
const boostMul = () => boostInfo().m;

function comboWindowMs() { if (treeBought("flow2")) return 1400; if (treeBought("flow1")) return 1150; return 900; }

function baseClickFlat() {
  let flat = 1;
  for (let i = 0; i < ups.length; i++) {
    const u = ups[i];
    flat += (u.click || 0) * owned[i];
    if (u.syn && u.syn.stat === "click") flat += owned[i] * u.syn.per * owned[u.syn.target];
  }
  return flat;
}

function baseSecFlat() {
  let flat = 0;
  for (let i = 0; i < ups.length; i++) {
    const u = ups[i];
    flat += (u.sec || 0) * owned[i];
    if (u.syn && u.syn.stat === "sec") flat += owned[i] * u.syn.per * owned[u.syn.target];
  }
  return flat;
}

function activeClass() { return classId ? CLASSES[classId] : null; }
function treeWisdomMul(kind) {
  let value = 1;
  if (kind === "click") {
    if (treeBought("focus1")) value *= 1.10;
    if (treeBought("focus2")) value *= 1.20 / 1.10;
    if (treeBought("focus3")) value *= 1.35 / 1.20;
  }
  if (kind === "sec") {
    if (treeBought("harvest1")) value *= 1.10;
    if (treeBought("harvest2")) value *= 1.25 / 1.10;
    if (treeBought("harvest3")) value *= 1.50 / 1.25;
  }
  if (treeBought("pride2")) value *= 1.10;
  if (treeBought("pride3")) value *= 1.25 / 1.10;
  return value;
}

const perClick = () => baseClickFlat() * mult * boostMul() * achMul.all * achMul.click * insightMul() * comboMult() * treeWisdomMul("click") * (activeClass() ? activeClass().click : 1);
const perSec = () => baseSecFlat() * mult * boostMul() * achMul.all * insightMul() * treeWisdomMul("sec") * (activeClass() ? activeClass().sec : 1);
const bossNeed = () => 2000 * 8 ** bossLevel;

const DAILY_CHALLENGES = [
  { title: "Make 100 clicks", target: 100, metric: () => lifetimeClicks, progress: (target) => Math.min(target, lifetimeClicks) },
  { title: "Earn 50K wisdom", target: 50000, metric: () => lifetimeEarned, progress: (target) => Math.min(target, lifetimeEarned) },
  { title: "Catch a Golden Tangerine", target: 1, metric: () => goldenTotal, progress: (target) => Math.min(target, goldenTotal) },
  { title: "Reach a ×15 combo", target: 15, metric: () => achFlags.bestCombo, progress: (target) => Math.min(target, achFlags.bestCombo) },
  { title: "Win a boss fight", target: 1, metric: () => bossesWon, progress: (target) => Math.min(target, bossesWon) }
];

function dailyDate() { return new Date().toISOString().slice(0, 10); }
function dailyChallenge() {
  const date = dailyDate();
  const seed = date.split("-").reduce((sum, part) => sum + Number(part), 0);
  return DAILY_CHALLENGES[seed % DAILY_CHALLENGES.length];
}
function updateDailyChallenge() {
  if (!dailyCard) return;
  const challengeOfDay = dailyChallenge();
  const date = dailyDate();
  const progress = challengeOfDay.progress(challengeOfDay.target);
  const complete = dailyCompletedDate === date;
  if (!complete && challengeOfDay.metric() >= challengeOfDay.target) {
    dailyCompletedDate = date;
    const rewardAmount = Math.max(1000, Math.ceil(perClick() * 25));
    earn(rewardAmount);
    toast("Daily wisdom complete", `+${fmt(rewardAmount)} wisdom`, "daily");
    save();
  }
  dailyCard.hidden = false;
  dailyTitle.textContent = challengeOfDay.title;
  dailyProgress.textContent = complete || dailyCompletedDate === date ? "Complete ✓" : `${fmt(progress)} / ${fmt(challengeOfDay.target)}`;
  dailyReward.textContent = complete || dailyCompletedDate === date ? "Come back tomorrow" : "Reward: wisdom bonus";
}

function offlineCapMs() {
  const treeCap = treeBought("sleep4") ? 48 : treeBought("sleep2") ? 24 : treeBought("sleep1") ? 16 : 8;
  return Math.max(treeCap, activeClass() ? activeClass().offlineCap : 0) * 3600 * 1000;
}
function goldenIntervalMs() { const base = 80000 + Math.random() * 60000; if (treeBought("luck2")) return base / 4; if (treeBought("luck1")) return base / 2; return base; }

function goldenRewardMul() { return treeBought("luck5") ? 1.5 : treeBought("luck4") ? 1.25 : 1; }

function earn(n) { if (tutPaused) return; bank += n; earned += n; lifetimeEarned += n; }

const rows = ups.map((u, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "up t-" + u.tier + (u.syn ? " has-syn" : "");
  const synBadge = u.syn ? `<span class="syn-badge" title="${u.synDesc || ""}">🔗</span>` : "";
  const synDesc = u.synDesc ? `<em class="syn-desc">${u.synDesc}</em>` : "";
  b.innerHTML = `<span class="tier">${u.tier}</span>${synBadge}<span class="own">0</span><span class="info"><b>${u.name}</b><small>${u.desc}</small>${synDesc}</span><span class="cost"></span>`;
  b.addEventListener("click", () => buy(i));
  list.appendChild(b);
  return { b, own: b.querySelector(".own"), cost: b.querySelector(".cost") };
});

function render() {
  rollTo(bank);
  const clickRate = perClick();
  const secRate = perSec();
  const selectedClass = activeClass();
  if (classBadge && selectedClass) {
    classBadge.hidden = false;
    classBadgeIcon.textContent = selectedClass.icon;
    classBadgeName.textContent = selectedClass.name;
    classBadgeDesc.textContent = `Click ×${selectedClass.click} · Passive ×${selectedClass.sec} · Offline ×${selectedClass.offline}`;
  }
  updateDailyChallenge();
  pc.textContent = "+" + fmt(clickRate) + " per click";
  ps.textContent = fmt(secRate) + " per sec";
  if (liveClick) liveClick.textContent = "+" + fmt(clickRate);
  if (liveSec) liveSec.textContent = fmt(secRate);
  mu.textContent = "×" + fmt(mult) + " boss bonus";
  mu.hidden = mult <= 1;
  const insEl = document.getElementById("ins");
  if (insEl) { insEl.hidden = insight <= 0; const pct = Math.round(insightRate() * 100); insEl.textContent = "✨ " + insight + " Insight · +" + pct + "%"; }
  const insBtn = document.getElementById("insightBtn");
  if (insBtn) insBtn.hidden = insight <= 0 && insightSpent <= 0;
  updatePrestigeButton();
  const bi = boostInfo(); const bl = bi.left;
  document.body.classList.toggle("boosted", bl > 0);
  bo.hidden = bl <= 0;
  if (bl > 0) bo.textContent = "⚡ ×" + bi.m + " wisdom · " + (bl / 1000).toFixed(1) + "s";
  rows.forEach((r, i) => {
    const c = cost(i); const u = ups[i];
    r.own.textContent = owned[i];
    r.cost.textContent = "✨ " + fmt(c);
    r.b.classList.toggle("poor", bank < c);
    r.b.hidden = !(owned[i] || earned >= u.base * 0.4) || !upgradeMatches(u, i);
    if (u.syn) { const active = owned[u.syn.target] > 0 && owned[i] > 0; const ready = owned[u.syn.target] > 0 && owned[i] === 0; r.b.classList.toggle("syn-active", active); r.b.classList.toggle("syn-ready", ready); }
  });
  const visibleRows = rows.filter((r) => !r.b.hidden);
  hint.hidden = visibleRows.length > 0 && upgradeFilter === "all";
  if (visibleRows.length === 0 && upgradeFilter !== "all") {
    hint.textContent = upgradeFilter === "owned" ? "Owned upgrades will appear here." : "Nothing matches this filter yet.";
  } else if (upgradeFilter === "all") {
    hint.textContent = "More upgrades appear as you earn wisdom.";
  }
  const ready = earned >= bossNeed();
  challenge.disabled = !ready;
  challenge.classList.toggle("ready", ready);
  const nextForm = bossForm();
  const formInfo = BOSS_FORMS_INFO[nextForm];
  const formHint = bossLevel < 3 ? "Ghost form unlocks at Boss Lv 4" : bossLevel < 5 ? "King form unlocks at Boss Lv 6" : "All boss forms unlocked";
  if (ready) {
    challenge.querySelector("b").textContent = "⚔️ Challenge!";
    chsub.innerHTML = `<span class="bf-tag" data-form="${nextForm}">${formInfo.icon} ${formInfo.name}</span> Boss Lv ${bossLevel + 1} · ${formInfo.blurb}<small class="form-hint">${formHint}</small>`;
  } else {
    challenge.querySelector("b").textContent = "Challenge";
    chsub.innerHTML = `Next: <span class="bf-tag" data-form="${nextForm}">${formInfo.icon} ${formInfo.name}</span><br>${fmt(earned)} / ${fmt(bossNeed())}<small class="form-hint">${formHint}</small>`;
  }
}

document.querySelectorAll(".upgrade-filter").forEach((filter) => {
  filter.addEventListener("click", () => {
    upgradeFilter = filter.dataset.filter || "all";
    document.querySelectorAll(".upgrade-filter").forEach((button) => button.classList.toggle("active", button === filter));
    render();
  });
});

/* ================= WISDOM ARCADE ================= */
const mgRoot = document.getElementById("minigames");
const mgMenu = document.getElementById("mgMenu");
const mgPlay = document.getElementById("mgPlay");
const mgTitle = document.getElementById("mgTitle");
const mgPrompt = document.getElementById("mgPrompt");
const mgScoreEl = document.getElementById("mgScore");
const mgTimerEl = document.getElementById("mgTimer");
const mgField = document.getElementById("mgField");
const mgMeter = document.getElementById("mgMeter");
const mgZone = document.getElementById("mgZone");
const mgMarker = document.getElementById("mgMarker");
const mgAction = document.getElementById("mgAction");
const mgStatus = document.getElementById("mgStatus");
let mgGame = null, mgRunning = false, mgFinished = false, mgDeadline = 0, mgScore = 0, mgRound = 0, mgSpawnAt = 0, mgRaf = null;

function mgSetScore(value) { mgScore = value; mgScoreEl.textContent = value; }
function mgSetZone() {
  const width = mgGame === "hareld" ? 16 : 22;
  mgZone.style.width = width + "%";
  mgZone.style.left = (10 + Math.random() * (80 - width)) + "%";
}
function mgOpen() {
  if (fighting || sillyBusy || vnBusy) return;
  mgRoot.hidden = false; mgMenu.hidden = false; mgPlay.hidden = true; mgTitle.textContent = "Choose a challenge"; fighting = true;
}
function mgClose() { mgStop(); mgRoot.hidden = true; fighting = false; }
function mgStop() { mgRunning = false; clearTimeout(mgSpawnAt); cancelAnimationFrame(mgRaf); mgField.innerHTML = ""; }
function mgReward(label, amount) {
  mgFinished = true; mgStop(); mgAction.textContent = "Back to arcade"; mgStatus.textContent = label + "  ✨ +" + fmt(amount) + " wisdom"; earn(amount); render(); save(); sfx("win");
}
function mgLose(label) { mgFinished = true; mgStop(); mgAction.textContent = "Back to arcade"; mgStatus.textContent = label; sfx("wrong"); }
function mgFinishToss() {
  const reward = Math.max(100, Math.ceil(perClick() * 12) + mgScore * 120);
  mgReward("Tangerines caught!", reward);
}
function mgSpawnTangerine() {
  if (!mgRunning || mgGame !== "toss") return;
  const fruit = document.createElement("button");
  fruit.type = "button"; fruit.className = "mg-fruit"; fruit.textContent = pick(["🍊", "🍊", "🍊", "✨"]);
  fruit.style.left = (8 + Math.random() * 84) + "%"; fruit.style.top = (12 + Math.random() * 68) + "%";
  fruit.addEventListener("click", () => { if (!mgRunning) return; mgScore += fruit.textContent === "✨" ? 3 : 1; mgSetScore(mgScore); sfx("coin"); fruit.remove(); });
  mgField.appendChild(fruit); setTimeout(() => fruit.remove(), 1050);
}
function mgStartToss() {
  mgRunning = true; mgDeadline = performance.now() + 15000; mgSpawnAt = 0; mgAction.textContent = "Catch!"; mgPrompt.textContent = "Catch as many tangerines as you can."; mgTick();
}
function mgStartMeter(game) {
  mgRunning = true; mgDeadline = performance.now() + (game === "hareld" ? 18000 : 15000); mgRound = 0; mgSetZone(); mgAction.textContent = game === "hareld" ? "SCREAM" : "Catch the beam"; mgPrompt.textContent = game === "hareld" ? "Hit the golden zone five times. Miss once and Hareld wins." : "Tap when the marker lands in the golden zone."; mgTick();
}
function mgTick(now = performance.now()) {
  if (!mgRunning) return;
  const left = Math.max(0, mgDeadline - now);
  mgTimerEl.textContent = (left / 1000).toFixed(1) + "s";
  if (left <= 0) { mgGame === "toss" ? mgFinishToss() : mgLose(mgGame === "hareld" ? "Hareld screams louder. Boss fight lost." : "The sunbeam slipped away."); return; }
  if (mgGame === "toss" && now >= mgSpawnAt) { mgSpawnTangerine(); mgSpawnAt = now + 520; }
  if (mgGame !== "toss") {
    const phase = (now / 900) % 2; const pos = phase <= 1 ? phase * 100 : (2 - phase) * 100;
    mgMarker.style.left = pos + "%";
  }
  mgRaf = requestAnimationFrame(mgTick);
}
function mgStart(game) {
  mgGame = game; mgFinished = false; mgSetScore(0); mgStatus.textContent = ""; mgMenu.hidden = true; mgPlay.hidden = false; mgMeter.hidden = game === "toss"; mgField.hidden = game !== "toss"; mgTitle.textContent = game === "toss" ? "Tangerine Toss" : game === "balance" ? "Sunbeam Balance" : "Hareld: Boss Fight";
  if (game === "toss") mgStartToss(); else mgStartMeter(game);
}
mgAction.addEventListener("click", () => {
  if (mgFinished) { mgMenu.hidden = false; mgPlay.hidden = true; mgFinished = false; mgTitle.textContent = "Choose a challenge"; return; }
  if (!mgRunning) return;
  if (mgGame === "toss") return;
  const pos = parseFloat(mgMarker.style.left) || 0; const zoneLeft = parseFloat(mgZone.style.left) || 0; const zoneWidth = parseFloat(mgZone.style.width) || 0;
  if (pos < zoneLeft || pos > zoneLeft + zoneWidth) { mgGame === "hareld" ? mgLose("Hareld screams louder. Boss fight lost.") : mgLose("Missed the sunbeam. Try again."); return; }
  mgRound += 1; mgSetScore(mgRound); sfx("correct");
  if (mgGame === "hareld" && mgRound >= 5) { mgReward("Hareld defeated!", Math.max(500, Math.ceil(perClick() * 30))); return; }
  if (mgGame === "balance" && mgRound >= 5) { mgReward("Perfect balance!", Math.max(250, Math.ceil(perClick() * 18))); return; }
  mgStatus.textContent = mgGame === "hareld" ? "Hareld is getting louder... " + (5 - mgRound) + " rounds left." : "Nice catch. Keep the rhythm."; mgSetZone();
});
document.querySelectorAll(".mg-choice").forEach((choice) => choice.addEventListener("click", () => mgStart(choice.dataset.game)));
document.getElementById("minigameBtn").addEventListener("click", () => { sfx("blip", { pitch: 1100 }); mgOpen(); });
document.getElementById("mgClose").addEventListener("click", () => { sfx("blip", { pitch: 700 }); mgClose(); });
mgRoot.addEventListener("click", (e) => { if (e.target === mgRoot) mgClose(); });

function buy(i) {
  const c = cost(i);
  if (bank < c) { replay(rows[i].b, "nope"); sfx("nope"); return; }
  bank -= c; owned[i] += 1;
  sfx("buy"); replay(rows[i].b, "bought");
  render(); save();
}

function buyMax() {
  let bought = 0;
  rows.forEach((row, i) => {
    while (bank >= cost(i)) {
      bank -= cost(i);
      owned[i] += 1;
      bought += 1;
    }
  });
  if (!bought) { sfx("nope"); return; }
  sfx("buy");
  render();
  save();
}

if (buyMaxBtn) buyMaxBtn.addEventListener("click", buyMax);

const ROOT_ZOOM = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;

function floatText(text, x, y, cls) {
  if (!cls) sfx("coin");
  const el = document.createElement("span");
  el.className = "float" + (cls ? " " + cls : "");
  el.textContent = text;
  el.style.left = (x / ROOT_ZOOM) + "px";
  el.style.top = (y / ROOT_ZOOM) + "px";
  document.body.appendChild(el);
  el.animate([{ transform: "translate(-50%, 0)", opacity: 1 }, { transform: "translate(-50%, -70px)", opacity: 0 }], { duration: 800, easing: "ease-out" }).onfinish = () => el.remove();
}

btn.addEventListener("click", (e) => {
  if (fighting || tutPaused || !wisdom.length) return;
  if (!ambOn) { audio(); ambStart("idle"); }
  const now = performance.now();
  rage = now - lastClick < 400 ? Math.min(rage + 1, 20) : 0;
  instant = rage > 0; lastClick = now;
  clicks += 1; lifetimeClicks += 1;
  bumpCombo();
  if (combo > achFlags.bestCombo) achFlags.bestCombo = combo;
  if (combo > 1) sfx("combo");
  const gain = perClick();
  earn(gain); sfx("click");
  const r = btn.getBoundingClientRect();
  const x = e.detail ? e.clientX : r.left + r.width / 2;
  const y = e.detail ? e.clientY : r.top;
  floatText("+" + fmt(gain), x + (Math.random() - 0.5) * 60, y - 10, combo >= 15 ? "hot" : null);
  if (combo > 0 && combo % 25 === 0) replay(document.body, "shake");
  if (rage >= 4 && Math.random() < 0.2) scold();
  else { bubble.classList.remove("angry"); speak(); }
  render();
});

challenge.addEventListener("click", () => {
  const bossTutorialLaunch = tutState.active && tutState.chapterId === "boss";
  if (earned < bossNeed() || (fighting && !bossTutorialLaunch) || vnBusy || sillyBusy || hareldBusy || mgRunning) return;
  if (!ambOn) { audio(); ambStart("idle"); }
  sfx("blip", { pitch: 1200 });
  cutscene();
});

const resetModal = document.getElementById("resetModal");
const resetInput = document.getElementById("resetInput");
const resetConfirm = document.getElementById("resetConfirm");
const resetCancel = document.getElementById("resetCancel");

document.getElementById("reset").addEventListener("click", () => { sfx("nope"); resetModal.hidden = false; resetInput.value = ""; validateReset(); setTimeout(() => resetInput.focus({ preventScroll: true }), 50); });
function validateReset() { const ok = resetInput.value.trim().toLowerCase() === "erase"; resetConfirm.disabled = !ok; resetConfirm.classList.toggle("armed", ok); }
resetInput.addEventListener("input", validateReset);
resetInput.addEventListener("keydown", (e) => { if (e.key === "Enter" && !resetConfirm.disabled) resetConfirm.click(); });
resetCancel.addEventListener("click", () => { sfx("blip", { pitch: 700 }); resetModal.hidden = true; });
resetConfirm.addEventListener("click", () => {
  if (resetConfirm.disabled) return;
  sfx("blip", { pitch: 400 });
  resetting = true;
  try { [KEY, ACH_KEY, STATS_KEY, OFFLINE_KEY, STORY_KEY, TUT_KEY].forEach((k) => localStorage.removeItem(k)); Object.keys(localStorage).filter((k) => k.startsWith("wisdom-clicker")).forEach((k) => localStorage.removeItem(k)); }
  catch (e) { resetting = false; return; }
  resetModal.hidden = true;
  document.body.classList.add("wiping");
  setTimeout(() => location.reload(), 500);
});
resetModal.addEventListener("click", (e) => { if (e.target === resetModal) resetModal.hidden = true; });

load(); loadAchs(); recalcAchMul(); loadStats();
rollState.cur = bank; rollState.target = bank;
render(); renderAchCount(); renderTrophyWall();

setTimeout(() => { const off = computeOffline(); if (off) showOffline(off.gain, off.away); recordSeen(); }, 400);
setInterval(() => { if (tutPaused) return; const s = perSec(); if (s) earn(s / 10); render(); }, 100);
setInterval(save, 5000);

tab.addEventListener("click", () => { sfx("blip", { pitch: 800 }); const hidden = layout.classList.toggle("hide"); tab.setAttribute("aria-expanded", String(!hidden)); tab.setAttribute("aria-label", hidden ? "Show upgrades" : "Hide upgrades"); render(); });

document.addEventListener("keydown", (e) => { if (e.code === "Space" && e.target === document.body && !e.repeat && !fighting) { e.preventDefault(); btn.click(); } });

/* ================= TUTORIAL ================= */
const tutState = { seen: {}, active: false, chapterId: null, stepIndex: 0, steps: [] };
const tutRoot = document.getElementById("tut");
const tutMaskHole = document.getElementById("tutMaskHole");
const tutRing = document.getElementById("tutRing");
const tutCat = document.getElementById("tutCat");
const tutBubbleWrap = document.getElementById("tutBubbleWrap");
const tutSkip = document.getElementById("tutSkip");
const tutHint = document.getElementById("tutHint");

function loadTut() { try { const s = JSON.parse(localStorage.getItem(TUT_KEY)); if (s && s.seen) tutState.seen = s.seen; } catch (e) {} }
function saveTut() { if (resetting) return; try { localStorage.setItem(TUT_KEY, JSON.stringify({ seen: tutState.seen })); } catch (e) {} }
loadTut();

function tutTargetRect(el) { const r = el.getBoundingClientRect(); return { x: r.left / ROOT_ZOOM, y: r.top / ROOT_ZOOM, w: r.width / ROOT_ZOOM, h: r.height / ROOT_ZOOM, cx: (r.left + r.width / 2) / ROOT_ZOOM, cy: (r.top + r.height / 2) / ROOT_ZOOM }; }

function tutPositionCat(rect, position) {
  const vw = window.innerWidth / ROOT_ZOOM;
  const vh = window.innerHeight / ROOT_ZOOM;
  const catW = 240, catH = 200;
  let x, y;
  const prefer = position || "auto";
  const hasTop = rect.y > catH + 20, hasBot = rect.y + rect.h + catH + 20 < vh;
  const hasLeft = rect.x > catW + 20, hasRight = rect.x + rect.w + catW + 20 < vw;
  if (prefer === "above" && hasTop) { x = rect.cx - catW / 2; y = rect.y - catH - 12; }
  else if (prefer === "below" && hasBot) { x = rect.cx - catW / 2; y = rect.y + rect.h + 12; }
  else if (prefer === "left" && hasLeft) { x = rect.x - catW - 12; y = rect.cy - catH / 2; }
  else if (prefer === "right" && hasRight) { x = rect.x + rect.w + 12; y = rect.cy - catH / 2; }
  else if (hasBot) { x = rect.cx - catW / 2; y = rect.y + rect.h + 12; }
  else if (hasTop) { x = rect.cx - catW / 2; y = rect.y - catH - 12; }
  else { x = (vw - catW) / 2; y = vh - catH - 20; }
  x = Math.max(12, Math.min(vw - catW - 12, x));
  y = Math.max(12, Math.min(vh - catH - 12, y));
  tutCat.style.left = x + "px"; tutCat.style.top = y + "px";
}

function tutDrawMask(rect, pad) {
  pad = pad || 12;
  tutMaskHole.setAttribute("x", rect.x - pad); tutMaskHole.setAttribute("y", rect.y - pad);
  tutMaskHole.setAttribute("width", rect.w + pad * 2); tutMaskHole.setAttribute("height", rect.h + pad * 2);
  tutRing.style.left = (rect.x - pad) + "px"; tutRing.style.top = (rect.y - pad) + "px";
  tutRing.style.width = (rect.w + pad * 2) + "px"; tutRing.style.height = (rect.h + pad * 2) + "px";
}

function tutClearMask() { tutMaskHole.setAttribute("x", -1000); tutMaskHole.setAttribute("y", -1000); tutMaskHole.setAttribute("width", 0); tutMaskHole.setAttribute("height", 0); tutRing.hidden = true; }

function tutTypeBubble(text) {
  tutBubbleWrap.innerHTML = "";
  const bubble = document.createElement("div");
  bubble.className = "tut-bubble";
  bubble.innerHTML = `<span class="tut-typing"><i></i><i></i><i></i></span>`;
  tutBubbleWrap.appendChild(bubble);
  const chars = [...text]; let i = 0;
  setTimeout(() => { bubble.innerHTML = ""; const write = () => { if (i < chars.length) { bubble.textContent += chars[i++]; setTimeout(write, 18); } }; write(); }, 500);
}

function tutRenderStep() {
  const step = tutState.steps[tutState.stepIndex];
  if (!step) { tutEndChapter(); return; }
  tutHint.textContent = step.advance === "click" ? "Click the glowing element" : "Click anywhere to continue";
  if (step.target) {
    const el = document.querySelector(step.target);
    if (el && el.offsetParent !== null) { const rect = tutTargetRect(el); tutDrawMask(rect, step.pad); tutCat.hidden = false; tutPositionCat(rect, step.position); }
    else { tutClearMask(); tutCat.hidden = false; tutCat.style.left = "50%"; tutCat.style.top = "50%"; tutCat.style.transform = "translate(-50%, -50%)"; }
  } else { tutClearMask(); tutCat.hidden = false; const vw = window.innerWidth / ROOT_ZOOM; const vh = window.innerHeight / ROOT_ZOOM; tutCat.style.left = (vw / 2 - 120) + "px"; tutCat.style.top = (vh * 0.35) + "px"; }
  tutTypeBubble(step.text || "");
  if (step.onEnter) try { step.onEnter(); } catch (e) {}
}

function tutAdvance() { const step = tutState.steps[tutState.stepIndex]; if (!step) return; tutState.stepIndex += 1; tutRenderStep(); }

function tutHandleAdvanceClick(e) {
  if (!tutState.active) return;
  if (e.target && (e.target.id === "tutSkip" || (e.target.closest && e.target.closest("#tutSkip")))) return;
  const step = tutState.steps[tutState.stepIndex]; if (!step) return;
  if (step.advance === "click" && step.target) {
    const target = document.querySelector(step.target);
    if (!target) { e.preventDefault(); e.stopPropagation(); return; }
    const directHit = e.target === target || target.contains(e.target);
    const r = target.getBoundingClientRect();
    const inBox = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (directHit || inBox) { e.stopPropagation(); e.preventDefault(); try { target.click(); } catch (err) {} tutState.stepIndex += 1; setTimeout(tutRenderStep, 60); return; }
    e.stopPropagation(); e.preventDefault(); return;
  }
  e.stopPropagation(); e.preventDefault(); tutAdvance();
}

function tutKeyAdvance(e) { if (!tutState.active) return; if (e.code !== "Space" && e.key !== "Enter") return; const step = tutState.steps[tutState.stepIndex]; if (!step) return; if (step.advance === "click" && step.target) return; e.preventDefault(); tutAdvance(); }

function tutStartChapter(id, onDone) {
  if (tutState.active) return;
  const chapter = TUT_CHAPTERS[id]; if (!chapter) return;
  if (tutState.seen[id]) { if (onDone) onDone(); return; }
  tutState.active = true; tutState.chapterId = id; tutState.stepIndex = 0; tutState.steps = chapter.steps;
  tutBubbleWrap.innerHTML = ""; tutPaused = true; tutRoot.hidden = false; tutRenderStep();
  if (onDone) tutState.onDone = onDone;
}

function tutEndChapter() {
  if (!tutState.active) return;
  tutState.seen[tutState.chapterId] = true;
  saveTut();
  const chapterId = tutState.chapterId; const onDone = tutState.onDone;
  tutState.onDone = null; tutState.active = false; tutState.chapterId = null; tutState.steps = [];
  tutPaused = false; tutRoot.hidden = true; tutRing.hidden = true; tutCat.hidden = true; tutBubbleWrap.innerHTML = "";
  sfx("blip", { pitch: 900 });
  if (onDone) onDone(chapterId);
}

tutSkip.addEventListener("click", () => { sfx("blip", { pitch: 500 }); tutEndChapter(); });
tutRoot.addEventListener("click", tutHandleAdvanceClick, true);
document.addEventListener("keydown", tutKeyAdvance, true);

const TUT_CHAPTERS = {
  intro: { steps: [
    { target: "#btn", text: "Right then. Observe this button. Press it. Yes, with your finger.", advance: "click", position: "above" },
    { target: "#btn", text: "Exquisite. That is wisdom, accruing. Notice the number above.", advance: "click", position: "above" },
    { target: null, text: "I shall now *observe*. Continue as you were, youngin. I will speak up when something new appears.", advance: "next" }
  ]},
  boss: { steps: [ { target: "#challenge", text: "The Challenge button. Before you — a boss fight. I shall be observing from the corner. Do not embarrass me.", advance: "click", position: "right" } ]},
  tree: { steps: [
    { target: "#insightBtn", text: "Ahh. The Wisdom Tree. A constellation of permanent boons. Click any glowing star to purchase it with Insight.", advance: "click", position: "right" },
    { target: "#insightBtn", text: "Insight is precious. Do not spend it... recklessly. A-hem. Enjoy the stars.", advance: "next", position: "right" }
  ]}
};

/* ================= MITTENS VN SCENE ================= */
const vnFlash = document.getElementById("vnFlash");
const vnSmackCat = document.getElementById("vnSmackCat");
const vnVignette = document.getElementById("vnVignette");

async function mittensScene() {
  vnBusy = true; fighting = true; vnSkip = false;
  vnChap.textContent = "interlude"; vnHead.textContent = "A Learned Gentleman"; vnSub.textContent = "in which a stranger arrives, unbidden";
  vnBegin.textContent = "Begin";
  vnTitle.classList.remove("gone"); vn.hidden = false;
  vn.style.opacity = ""; vn.style.transition = "";
  vnSmackCat.classList.remove("on"); vnVignette.classList.remove("on");
  await new Promise((res) => { const go = () => res(); vnBegin.addEventListener("click", go, { once: true }); vnCancel = () => { vnBegin.removeEventListener("click", go); res(); }; });
  if (!ambOn) { audio(); ambStart("idle"); }
  vnTitle.classList.add("gone");
  await nap(700);
  const lines = [
    ["n", "The sunbeam shifts. Someone else is here."],
    ["m", "...Hmph. So THIS is the operation."],
    ["m", "A sunbeam. A tangerine. A cat who naps for a *living*."],
    ["m", "I am Professor Mittens. *Distinguished* scholar. *Certified* pedagogue."],
    ["m", "I have observed your... *primitive* clicking. It is, as it were, *agricultural*."],
    ["m", "Fear not. I shall *instill* within you the *fundamental axioms* of wisdom."],
    ["m", "First: the button. You press. Wisdom *emerges*. Like a *metaphorical* egg."],
    ["m", "Second: upgrades. *Capitalism*, but for cats. *Marvelous.*"],
    ["m", "...Any questions? No? *Splendid.* Allow me to *demonstrate*—"]
  ];
  const catImg = vnSage;
  catImg.src = "img/mittens.jpeg";
  for (let i = 0; i < lines.length; i++) {
    if (vnSkip) break;
    const [who, text] = lines[i];
    if (i === lines.length - 1) { vnVignette.classList.add("on"); sfx("vignette"); }
    if (who === "m") sfx("mittens_talk"); else sfx("mittens_in");
    await vnLine(who === "m" ? "Prof. Mittens" : null, text);
    await nap(200);
  }
  if (!vnSkip) {
    vnBox.classList.add("box-hide");
    await nap(120);
    sfx("smack"); boom();
    vnFlash.classList.add("flash");
    vnSmackCat.classList.add("on");
    document.body.classList.add("shake");
    await nap(400);
    vnFlash.classList.remove("flash");
    await nap(500);
    vnSmackCat.classList.remove("on");
    document.body.classList.remove("shake");
    await nap(300);
    catImg.src = "img/mittens.jpeg";
    vnBox.classList.remove("box-hide");
    await vnLine("Prof. Mittens", "A-hem. A-HEM. As I was SAYING. Where was I. Ah. Yes.");
    await nap(300);
  }
  clearInterval(vnTimer);
  vn.style.transition = "opacity 0.6s"; vn.style.opacity = "0";
  await nap(600);
  vn.hidden = true; vn.style.opacity = ""; vn.style.transition = "";
  vnSmackCat.classList.remove("on"); vnVignette.classList.remove("on");
  vnBusy = false; fighting = false;
}

/* ================= MITTENS HOVER ================= */
let bossHoverEl = null;
const BOSS_HOVER_LINES = {
  miss: ["Oh dear. A fruit. You were DEFEATED by a FRUIT.", "That was a tangerine. It was not even moving fast.", "Clumsy. Very clumsy.", "The fruit has won. Absorb that.", "I have seen SLEEPIER cats dodge better."],
  phase2: ["Ah, now the stealing portion. Do try to be QUIET.", "Sneaking now, are we? How *dignified*.", "Phase two. Silence, please. I am watching.", "Now you SNEAK. Do not get caught. I shall be *mortified*."],
  caught: ["You were CAUGHT. The tangerine was *right there*.", "Caught. By a sleeping cat. A SLEEPING cat.", "Hands OFF. You have been seen.", "That was *excruciating* to watch."],
  win: ["Well. I stand CORRECTED. That was... *impressive*, I suppose.", "You won. A fruit-based victory. *Astonishing.*", "Victory. Do not let it go to your head. It is a small head.", "Acceptable. Barely."],
  lose: ["Predictable. Go nap. Try again when your *reflexes* mature.", "You lost. The tangerine remains his. As it should.", "Defeated. Take a nap. It is the only thing you are good at.", "A loss. How *unforeseen*."]
};

function spawnBossHover() { if (bossHoverEl) return; bossHoverEl = document.createElement("div"); bossHoverEl.className = "boss-hover"; bossHoverEl.innerHTML = `<img class="bh-img" src="img/mittens.jpeg" alt=""><div class="bh-bubble"></div>`; document.body.appendChild(bossHoverEl); }
function mittensSay(line) { if (!bossHoverEl) return; const bubble = bossHoverEl.querySelector(".bh-bubble"); if (!line) { bubble.classList.remove("on"); return; } bubble.textContent = line; bubble.classList.remove("on"); void bubble.offsetWidth; bubble.classList.add("on"); clearTimeout(bubble._t); bubble._t = setTimeout(() => bubble.classList.remove("on"), 3200); }
function removeBossHover() { if (!bossHoverEl) return; bossHoverEl.style.transition = "opacity 0.5s cubic-bezier(.4, 0, .2, 1), transform 0.5s cubic-bezier(.4, 0, .2, 1)"; bossHoverEl.style.opacity = "0"; bossHoverEl.style.transform = "translateX(-120px)"; const el = bossHoverEl; bossHoverEl = null; setTimeout(() => el.remove(), 550); }

/* ================= SILLY CAT ================= */
const silly = document.getElementById("silly");
const schat = silly.querySelector(".schat");
const slog = document.getElementById("slog");
const sinput = document.getElementById("sinput");
const sans = document.getElementById("sans");
const ssend = document.getElementById("ssend");
const sstat = document.getElementById("sstat");
const stimer = document.getElementById("stimer");
const stime = document.getElementById("stime");
const pclock = document.getElementById("pclock");
const snote = document.getElementById("snote");
const sdone = document.getElementById("sdone");
const sdonebtn = document.getElementById("sdonebtn");

const nap = (ms) => (skipped || reduce) ? Promise.resolve() : new Promise((r) => { wake = r; setTimeout(r, ms); });
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const msNeed = (i) => 300 * 7 ** i;

let sillyBusy = false, touched = false, riddleBag = [], riddleSubmit = null;
const SILLY_COOLDOWN_MS = 3 * 60 * 1000;
let lastSillyAt = 0;

["pointerdown", "keydown"].forEach((ev) => document.addEventListener(ev, () => { touched = true; if (!ambOn && !fighting) { audio(); ambStart("idle"); } }, { once: true }));

const riddles = [
  { q: "What has hands but can't clap?", a: ["clock", "clocks", "watch"], show: "a clock" },
  { q: "I have keys but no locks, and space but no room. What am I?", a: ["keyboard", "keyboards"], show: "a keyboard" },
  { q: "What gets wetter the more it dries?", a: ["towel", "towels"], show: "a towel" },
  { q: "What has to be broken before you can use it?", a: ["egg", "eggs"], show: "an egg" },
  { q: "The more of me you take, the more you leave behind. What am I?", a: ["footsteps", "footstep", "footprints", "footprint", "steps", "step"], show: "footsteps" },
  { q: "What can run but never walks, and has a mouth but never talks?", a: ["river", "rivers", "stream"], show: "a river" },
  { q: "What goes up but never comes back down?", a: ["age", "aging", "ageing"], show: "your age" },
  { q: "What has many teeth but can't bite?", a: ["comb", "combs", "zipper", "zip"], show: "a comb" },
  { q: "I'm tall when I'm young and short when I'm old. What am I?", a: ["candle", "candles"], show: "a candle" },
  { q: "What has one eye but can't see?", a: ["needle", "needles"], show: "a needle" },
  { q: "What can you catch but never throw?", a: ["cold", "colds"], show: "a cold" },
  { q: "What is full of holes but still holds water?", a: ["sponge", "sponges"], show: "a sponge" },
  { q: "What has a neck but no head?", a: ["bottle", "bottles", "shirt"], show: "a bottle" },
  { q: "What building has the most stories?", a: ["library", "libraries"], show: "a library" },
  { q: "Forward I'm heavy, backward I'm not. What am I?", a: ["ton"], show: "a ton" },
  { q: "What has words but never speaks?", a: ["book", "books"], show: "a book" },
  { q: "What gets bigger the more you take away?", a: ["hole", "holes"], show: "a hole" },
  { q: "What can travel around the world while staying in a corner?", a: ["stamp", "stamps"], show: "a stamp" },
  { q: "What belongs to you, but other people use it more than you do?", a: ["name", "names"], show: "your name" },
  { q: "What comes down but never goes up?", a: ["rain", "raindrop", "raindrops"], show: "rain" },
  { q: "What begins with T, ends with T, and has T inside it?", a: ["teapot", "teapots"], show: "a teapot" },
  { q: "What is always in front of you but can't be seen?", a: ["future", "tomorrow"], show: "the future" },
  { q: "What has a thumb and four fingers but isn't alive?", a: ["glove", "gloves", "mitten"], show: "a glove" },
  { q: "What goes through towns and over hills but never moves?", a: ["road", "roads", "path"], show: "a road" },
  { q: "What word is spelled wrong in every dictionary?", a: ["wrong"], show: "the word \"wrong\"" }
];

const intros = ["psst. psst. hi. it's me. silly cat. 😼","MILESTONE?! i smelled wisdom from three rooms away 👃","*falls out of the ceiling* hi. i live here now.","hehe. nice wisdom. would be a shame if something happened to it.","knock knock. no wait, i'm already in. 🚪","*appears in your notifications* sorry, i don't have an appointment 📱","is this thing on?? hello?? it's the cat. the better one. 😸","i was napping in a box and then i smelled numbers. WHAT'S UP","surprise!! it's me!! the thing you didn't ask for!! 🎉","*slides in on a roomba* sup. nice stash you got there. 🤖","hi hi hi hi hi. new phone who dis. oh wait it's me, i'm dis 😼","your wisdom number went up and my tail went FWOOMP. let's chat 🐾","yoooo. you've got the good stuff. don't mind me. just browsing. 🛒","i bring chaos and also a riddle. mostly chaos. 🌀"];
const sillyAsk = ["gimme your wisdom. or solve my riddle and i'll be nice. fail and i take A LOT.","riddle time!! get it right and i'll be nice. get it wrong and i take A LOT. 😈","two options: gimme your wisdom OR beat my riddle. (there's only one real option. riddle.)","answer my riddle or i'm taking your stuff. no pressure 😇 (pressure)","rules: i ask. you answer. if you're wrong i yoink. if you're right i cry. 😿","solve this and i'll leave you alone. flunk it and i'm taking SO MUCH. 😼","here's the deal: riddle. you win = i get mad. you lose = i get RICH 💰"];
const sillyTimeUp = ["TIME'S UP!! 😹","too slow!! tick tock!! ⏰","*yawns* i got bored waiting. time's up 😴","the clock has spoken!! and it said NO 🕐","bzzzt!! out of time!! 😹","i could've napped three times in that wait. TIME'S UP"];
const sillyWrong = ["WRONG!! 😹","nope nope nope nope nope 🙅","lol. no. 😹","bzzzt!! incorrect!! sad trombone 🎺","that's not even close!! 🤣","WRONG!! my cat brain is bigger than yours 🧠"];
const sillyReveal = ["it was {a}, dummy.","the answer was {a}. obviously. 🙄","{a}!! it was {a}!! how did you not get {a}?? 😹","psst. it was {a}. easiest thing ever.","for the record: {a}. you're welcome. 😼","the answer was {a}. i thought about it for like one second."];
const sillyPact = ["...but we have a Pact. so. i guess i can't take anything. 😾 rude.","*reaches for your wisdom* *remembers the Pact* *sighs dramatically* 😾","ugh the Pact. i hate the Pact. i can't take anything. 🙄","i would steal your wisdom but my signature is on that stupid Pact 😾","the Pact says paws off. i'm leaving. this isn't over. 😤","fine. FINE. the Pact wins this time. 😾"];
const sillyBroke = ["you have no wisdom?? sad. i'll be back 😼","your pockets are empty 😹 i'll come back when you're richer","nothing to steal?? what a waste of a riddle 😿","you're broke!! i can't even yoink!! 😭 next time.","zero wisdom. zero fun. i'll be back 😼","*checks your pockets* ...lint. just lint. 🧶 bye"];
const sillyYoink = ["yoink. 😼","YOINK!! 😼","*grabs wisdom* mine. 😈","snatch!! 🤏😼","mmm tasty wisdom 😋 *nom*","thank you for your donation!! 💸😼","bye bye wisdom~ 👋😼"];
const sillyTook = ["i took {n} wisdom. thanks!! bye!! 👋","{n} wisdom?? MINE NOW. see ya!! 😼","grabbed {n} wisdom. don't be mad. (be mad) 😹","{n} wisdom richer!! you're welcome!! 💰","ty for the {n} wisdom!! smell ya later 👃","just a little snack. {n} wisdom. nom nom 🍽️ bye!!"];
const sillyShock = ["...WHAT. no way. you actually got it?!","...hold on. HOLD ON. that's... correct?? 😳","nuh uh. no way. you cheated. 😾 ...did you cheat?","WHAT?! how did a human beat ME?? 😱","...wait what. you just. got it. 🫠","ERROR. cat brain overload. you actually solved it?!","that's... right?? who gave you the answers 🕵️"];
const sillyCall = ["fine. FINE. hold on. i'm calling the wisdom cat. 😼","ugh. fine. hold on. *dials grandpa* 📞😾","i hate this. one sec. calling the old cat 😒","fine. you win. i'm telling the wisdom cat. he's gonna be so mad 🙄","*grumbles* i'm calling the grandpa. don't look at me. 😾","okay okay okay. i'll get the wisdom cat. he's gonna love this. NOT. 😤","FINE. wisdom cat!! get over here!! ⚔️"];

function nextRiddle() { if (!riddleBag.length) riddleBag = riddles.map((_, i) => i).sort(() => Math.random() - 0.5); return riddles[riddleBag.pop()]; }
function meow() { if (!audio()) return; unfade(); const t = ctx.currentTime; tone("sawtooth", 420, t, 0.18, 0.22, { to: 880, lp: 2200 }); tone("sawtooth", 880, t + 0.17, 0.3, 0.22, { to: 380, lp: 2200 }); }
function pip() { if (!audio()) return; unfade(); tone("square", 660, ctx.currentTime, 0.06, 0.1, { to: 880, lp: 3000 }); }

function addMsg(text, who, cls = "") { const el = document.createElement("div"); el.className = "sm " + who + " " + cls; el.textContent = text; slog.appendChild(el); slog.scrollTop = slog.scrollHeight; return el; }

async function catSays(text, cls = "") {
  sstat.textContent = "typing...";
  const t = document.createElement("div");
  t.className = "sm cat typing";
  t.innerHTML = "<i></i><i></i><i></i>";
  slog.appendChild(t); slog.scrollTop = slog.scrollHeight;
  await nap(Math.min(2000, 700 + text.length * 28));
  t.remove(); addMsg(text, "cat", cls);
  sstat.textContent = "online";
  pip();
  await nap(600 + Math.min(2200, text.length * 26));
}

function waitDone(label) {
  return new Promise((res) => {
    sdonebtn.textContent = label; sdone.hidden = false;
    sdonebtn.focus({ preventScroll: true });
    const go = () => { sdone.hidden = true; sdonebtn.removeEventListener("click", go); document.removeEventListener("keydown", key); res(); };
    const key = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } };
    sdonebtn.addEventListener("click", go);
    document.addEventListener("keydown", key);
  });
}

schat.addEventListener("animationend", (e) => { if (e.animationName === "sillyin") silly.classList.remove("in"); });

function checkMilestone() {
  if (document.hidden || tutPaused) return;
  if (!touched || fighting || sillyBusy) return;
  if (document.querySelector(".offline:not([hidden]), .panel-modal:not([hidden])")) return;
  if (performance.now() - lastSillyAt < SILLY_COOLDOWN_MS) return;
  if (earned < msNeed(msIdx)) return;
  while (earned >= msNeed(msIdx + 1)) msIdx += 1;
  lastSillyAt = performance.now();
  save();
  sillyVisit();
}

function typoDist(a, b) {
  const d = [];
  for (let i = 0; i <= a.length; i++) { d[i] = [i]; for (let j = 1; j <= b.length; j++) d[i][j] = i ? 0 : j; }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

function typoNear(w, ans) { if (w === ans) return true; const limit = ans.length <= 3 ? 0 : ans.length <= 5 ? 1 : 2; return limit > 0 && typoDist(w, ans) <= limit; }
function riddleMatch(words, answers) { const joined = words.join(""); return [...words, joined].some((w) => answers.some((a) => typoNear(w, a))); }

function askRiddle(r) {
  return new Promise((res) => {
    const total = 45000;
    const t0 = performance.now();
    let tries = 2;
    sinput.hidden = false; stimer.hidden = false; stime.style.width = "100%";
    sans.value = ""; sans.focus({ preventScroll: true });
    const done = (v) => { clearInterval(iv); riddleSubmit = null; sinput.hidden = true; stimer.hidden = true; if (v === "ok") sfx("correct"); else if (v === "wrong" || v === "time") sfx("wrong"); res(v); };
    const iv = setInterval(() => { const left = 1 - (performance.now() - t0) / total; stime.style.width = Math.max(0, left * 100) + "%"; if (left <= 0) done("time"); }, 100);
    riddleSubmit = () => {
      const v = sans.value.trim(); if (!v) return;
      sans.value = ""; addMsg(v, "me");
      const words = v.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
      if (riddleMatch(words, r.a)) { if (tries === 2) achFlags.riddleFirstTry = true; return done("ok"); }
      tries -= 1;
      if (tries <= 0) return done("wrong");
      replay(schat, "jolt"); sfx("wrong"); catSays("nope 😹 one more try.");
    };
  });
}

ssend.addEventListener("click", () => riddleSubmit && riddleSubmit());
sans.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); if (riddleSubmit) riddleSubmit(); } });

async function sillyVisit() {
  sillyBusy = true;
  document.dispatchEvent(new Event("wc:sillyVisit"));
  hidePhone();
  pushBanner("silly", "Silly Cat", "psst. you up? 😼", () => {});
  fighting = true; instant = false;
  clearInterval(typer); words.classList.remove("cursor");
  slog.innerHTML = ""; sinput.hidden = true; stimer.hidden = true;
  sstat.textContent = "online"; sdone.hidden = true;
  pclock.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (!reduce) replay(frame, "mad");
  sfx("fanfare"); meow();
  snote.hidden = false; replay(snote, "drop");
  await nap(2300);
  snote.hidden = true;
  silly.className = "silly in"; silly.hidden = false;
  await nap(1200);
  await catSays(pick(intros));
  await catSays(pick(sillyAsk));
  const r = nextRiddle();
  await catSays(r.q, "riddle");
  const result = await askRiddle(r);
  if (result === "ok") await sillyBeaten();
  else await sillySteals(r, result);
}

async function sillyLeave() {
  silly.classList.remove("in");
  document.dispatchEvent(new Event("wc:sillyLeave"));
  showPhone();
  silly.classList.add("out");
  await nap(400);
  silly.hidden = true;
  silly.classList.remove("out");
}

async function drain(loss) {
  const t0 = performance.now();
  let taken = 0;
  await new Promise((res) => {
    const iv = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / 900);
      const want = loss * k;
      bank -= want - taken;
      taken = want;
      render();
      if (k >= 1) { clearInterval(iv); res(); }
    }, 30);
  });
}

async function sillySteals(r, why) {
  sillyLosses += 1;
  await catSays(pick(why === "time" ? sillyTimeUp : sillyWrong));
  await catSays(pick(sillyReveal).replaceAll("{a}", r.show));
  if (treeBought("gremlin1")) {
    await catSays(pick(sillyPact));
    save();
    await waitDone("Close chat");
    await sillyLeave();
    fighting = false; sillyBusy = false; lastSillyAt = performance.now();
    bubble.classList.remove("angry");
    const text = "The Pact holds. That gremlin can't touch your wisdom.";
    live.textContent = text; type(text); replay(bubble, "hit");
    return;
  }
  const lossRate = treeBought("gremlin2") ? 0.4 : 0.6;
  const loss = Math.floor(bank * lossRate);
  if (loss < 1) { await catSays(pick(sillyBroke)); }
  else {
    await catSays(pick(sillyYoink));
    replay(schat, "jolt"); meow();
    const wr = wis.getBoundingClientRect();
    floatText("-" + fmt(loss), wr.left + wr.width / 2, wr.top);
    await drain(loss);
    await catSays(pick(sillyTook).replaceAll("{n}", fmt(loss)));
  }
  save();
  await waitDone("Close chat");
  await sillyLeave();
  fighting = false; sillyBusy = false; lastSillyAt = performance.now();
  bubble.classList.add("angry");
  const text = "That gremlin stole my wisdom... Win it back, youngin.";
  live.textContent = text; type(text); replay(bubble, "hit");
}

async function sillyBeaten() {
  sillyWins += 1;
  await catSays(pick(sillyShock));
  await catSays(pick(sillyCall));
  await waitDone("Bring it on ⚔️");
  await sillyLeave();
  await duelScene();
  boostEnd = performance.now() + (treeBought("gremlin3") ? 15000 : 10000);
  render();
  fighting = false; sillyBusy = false; lastSillyAt = performance.now();
  bubble.classList.remove("angry");
  const text = "Silly Cat made me do this. ×5 wisdom. CLICK, youngin!";
  live.textContent = text; type(text); replay(bubble, "hit");
}

const duel = document.getElementById("duel");
const dw = document.getElementById("dw");
const ds = document.getElementById("ds");
const dline = document.getElementById("dline");
const dflash = document.getElementById("dflash");

document.getElementById("dskip").addEventListener("click", () => { skipped = true; if (wake) wake(); });

const P = {
  wApart: "translateX(calc(var(--d) * -1))", sApart: "translateX(var(--d))",
  wWind: "translateX(calc(var(--d) * -1 - 36px)) scale(.94) rotate(-6deg)",
  sWind: "translateX(calc(var(--d) + 36px)) scale(.94) rotate(6deg)",
  wHit: "translateX(calc(var(--c) * -1)) scale(1.08) rotate(5deg)",
  sHit: "translateX(var(--c)) scale(1.08) rotate(-5deg)"
};

function pose(el, t, ms, ease) { const d = skipped || reduce ? 0 : ms; el.style.transition = `transform ${d}ms ${ease || "cubic-bezier(.2,1.4,.4,1)"}`; el.style.transform = t; }
function dsay(who, text) { dline.innerHTML = ""; dline.classList.toggle("on", !!who); if (!who) return; const b = document.createElement("b"); b.textContent = who; b.className = who.startsWith("Silly") ? "sc" : "wc"; dline.append(b, text); }

function comic(text, color) { const el = document.createElement("span"); el.className = "dtext"; el.textContent = text; el.style.color = color || "#ffe066"; duel.appendChild(el); const r = (Math.random() - 0.5) * 24; el.animate([{ transform: `translate(-50%, -50%) scale(.2) rotate(${r}deg)`, opacity: 0 },{ transform: `translate(-50%, -50%) scale(1.25) rotate(${r}deg)`, opacity: 1, offset: 0.25 },{ transform: `translate(-50%, -75%) scale(1.45) rotate(${r}deg)`, opacity: 0 }], { duration: 950 }).onfinish = () => el.remove(); }
function ring() { const el = document.createElement("span"); el.className = "dring"; duel.appendChild(el); el.animate([{ transform: "scale(.2)", opacity: 1 },{ transform: "scale(10)", opacity: 0 }], { duration: 650, easing: "ease-out" }).onfinish = () => el.remove(); }

function sparks(n = 16) {
  const glyphs = ["💥", "✨", "⭐", "💫", "🐾"];
  for (let i = 0; i < n; i++) {
    const el = document.createElement("span"); el.className = "dspark"; el.textContent = pick(glyphs); duel.appendChild(el);
    const a = Math.random() * Math.PI * 2; const dist = 120 + Math.random() * 220;
    el.animate([{ transform: "translate(-50%, -50%) scale(.3)", opacity: 1 },{ transform: `translate(calc(-50% + ${Math.cos(a) * dist}px), calc(-50% + ${Math.sin(a) * dist}px)) scale(${0.8 + Math.random()}) rotate(${Math.random() * 540}deg)`, opacity: 0 }], { duration: 700 + Math.random() * 400, easing: "cubic-bezier(.2,.7,.4,1)" }).onfinish = () => el.remove();
  }
}

function smash(text, color) { if (skipped) return; dflash.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450 }); boom(); sfx("pop"); replay(duel, "shake"); duel.classList.add("hot"); ring(); sparks(); comic(text, color); }

async function duelRound(text, color) {
  pose(dw, P.wWind, 320, "ease-out"); pose(ds, P.sWind, 320, "ease-out");
  await sleep(360);
  pose(dw, P.wHit, 90, "ease-in"); pose(ds, P.sHit, 90, "ease-in");
  await sleep(100);
  smash(text, color);
  await sleep(550);
  pose(dw, P.wApart, 260, "ease-out"); pose(ds, P.sApart, 260, "ease-out");
  await sleep(300);
}

async function duelScene() {
  skipped = false;
  hidePhone();
  mute.hidden = false;
  audio();
  startMusic("duel");
  [dw, ds].forEach((el) => { el.style.transition = "none"; el.style.transform = ""; });
  dw.classList.remove("aura"); dsay(null);
  duel.className = "duel"; duel.hidden = false;
  void duel.offsetWidth;
  duel.classList.add("on");
  await sleep(600);
  pose(dw, P.wApart, 700); pose(ds, P.sApart, 700);
  await sleep(800);
  duel.classList.add("vs");
  dflash.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450 });
  boom(); replay(duel, "shake");
  await sleep(1100);
  duel.classList.remove("vs");
  dsay("Wisdom Cat", "Silly Cat. You dare steal a mortal's wisdom?");
  await sleep(2100);
  dsay("Silly Cat", "hehe. try me, grandpa. 😛");
  await sleep(1800);
  dsay(null);
  await duelRound("POW!", "#ffe066");
  await duelRound("BAM!", "#ff7ab0");
  pose(dw, P.wWind, 300, "ease-out");
  pose(ds, "translateX(calc(var(--d) + 80px)) scale(1) rotate(10deg)", 300, "ease-out");
  await sleep(450);
  pose(ds, "translateX(calc(var(--c) * -1.4)) scale(1.4) rotate(-8deg)", 100, "ease-in");
  pose(dw, "translate(calc(var(--d) * -2.6), -34vh) rotate(-1080deg) scale(.2)", 1100, "ease-out");
  await sleep(110);
  smash("K.O.!", "#ff3030");
  await sleep(1100);
  duel.classList.remove("hot");
  pose(ds, "translateX(0) scale(1.3)", 400);
  dsay("Silly Cat", "get up, wisdom cat. we need to talk.");
  await sleep(1200);
  pose(dw, "translateX(calc(var(--d) * -1.15)) scale(.8) rotate(-10deg)", 700);
  await sleep(1200);
  pose(ds, "translateX(calc(var(--d) * -.7)) scale(1.3) rotate(-12deg)", 120, "ease-in");
  await sleep(130);
  smash("SLAP!", "#ffffff");
  pose(dw, "translateX(calc(var(--d) * -1.5)) scale(.75) rotate(-25deg)", 200);
  await sleep(600);
  pose(ds, "translateX(0) scale(1.3)", 300);
  dsay("Silly Cat", "this human beat my riddle. so you're giving them ×5 wisdom. 10 seconds. NOW.");
  await sleep(2800);
  dsay("Wisdom Cat", "...yes, boss.");
  pose(dw, P.wApart, 500);
  await sleep(1300);
  dsay(null);
  dw.classList.add("aura");
  duel.classList.add("buff", "hot");
  dflash.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600 });
  boom(); replay(duel, "shake");
  await sleep(2000);
  duel.hidden = true;
  duel.className = "duel";
  dw.classList.remove("aura");
  stopMusic();
  mute.hidden = true;
  showPhone();
}

setInterval(checkMilestone, 500);

const HARELD_COOLDOWN_MS = 8 * 60 * 1000;
const hareldRollGap = () => HARELD_COOLDOWN_MS * (0.75 + Math.random() * 0.75);
let lastHareldAt = 0, hareldBusy = false, hareldGap = hareldRollGap(), hareldPress = null, hareldSubmit = null, hareldChoice = null;

const hRoot = document.getElementById("hareld");
const hFlash = document.getElementById("hflash");
const hSay = document.getElementById("hsay");
const hDuel = document.getElementById("hduel");
const hMark = document.getElementById("hmark");
const hScream = document.getElementById("hscream");
const hInput = document.getElementById("hinput");
const hAns = document.getElementById("hans");
const hSend = document.getElementById("hsend");
const hChoice = document.getElementById("hchoice");
const hFine = document.getElementById("hfine");
const hNo = document.getElementById("hno");

const hareldIntros = ["HELLO. I AM THE HELLO. ARE YOU THE TANGERINE?","I HAVE BROUGHT... THE LOUDNESS. IT IS MINE NOW.","WAIT. IS THIS A TUESDAY? I FORGOT HOW TO BE A TUESDAY.","I WILL EAT YOUR WISDOM. WITH A FORK. I DO NOT HAVE A FORK.","GOOD MORNING. I CAME THROUGH A DOOR. I THINK IT WAS A DOOR.","I AM HARELD. I AM HERE. I AM VERY HERE."];
const hareldDuelOpen = ["AAAAAAAAAAA!! SCREAM WITH ME OR I WILL SCREAM LOUDER.","AAAAAAAAAAAAAAAA. NOW YOU. PUT THE SCREAM IN THE GREEN.","I CHALLENGE YOU TO A SCREAM. THE GREEN IS THE GOOD PART. AAAAAAA!"];
const hareldDuelWin = ["YOU SCREAM GOOD. I RESPECT. BYE.","THAT WAS A VERY ROUND SCREAM. YOU HAVE THE LOUDNESS NOW.","AAAAA! YES! YOU ARE A GOOD SCREAMER. TAKE THE NUMBERS."];
const hareldDuelLose = ["WRONG SCREAM. SAD. BYE.","THAT SCREAM WAS NOT IN THE GREEN. I AM SCREAMING ABOUT IT.","YOU MISSED THE SCREAM. IT WAS RIGHT THERE. LIKE A SHOE."];
const hareldRiddleOpen = ["WHAT IS GREEN AND HUMS? ... I FORGOT. WHAT IS IT?","WHAT HAS FOUR LEGS AND IS ALSO A TUESDAY? I DO NOT KNOW. YOU TELL ME.","WHY IS A SPOON LOUD ON WEDNESDAYS? I HAVE THE QUESTION BUT NOT THE OTHER PART."];
const hareldRiddleOk = ["YES. THAT IS IT. YOU ARE VERY SMART. HERE.","CORRECT. I HAD FORGOTTEN BUT NOW I REMEMBER. HERE IS A NUMBER.","THAT IS THE ANSWER. I WILL TELL THE OTHER HARES. HERE."];
const hareldTaxOpen = ["GIVE ME ONE THING OR I SCREAM FOR A THOUSAND YEARS.","I REQUIRE A TAX. IT IS ONE THING. THE BEST THING.","THIS IS A ROBBERY. A POLITE ONE. GIVE ME YOUR BEST UPGRADE."];
const hareldTaxYes = ["THANK YOU. I WILL PUT IT IN MY POCKET. I HAVE NO POCKET. TAKE THE LOUDNESS.","GOOD. A TAX HAS BEEN PAID. HERE IS A BOOST. IT IS VERY SHOUTY.","YOU ARE KIND. I AM HAPPY. AAAAA. HAPPY SCREAMING."];
const hareldTaxNo = ["FINE. I WILL SCREAM ELSEWHERE. BUT I WILL BE BACK. PROBABLY TUESDAY.","NO?! I AM VERY ANGRY. LIKE A KETTLE. I WILL BE BACK.","RUDE. I WILL SCREAM AT YOUR WALLS. THEY WILL REMEMBER."];
const hareldExits = ["BYE. I AM GOING TO THE OTHER ROOM.","I MUST GO. A SANDWICH IS SCREAMING FOR ME.","GOODBYE. DO NOT FOLLOW ME. I AM VERY FAST. SOMETIMES.","I AM LEAVING THROUGH THE DOOR I CAME FROM. OR A WINDOW."];

function hareldShout(text) { hSay.textContent = text; replay(hSay, "hpunch"); }

function hareldDuel() {
  return new Promise((res) => {
    hareldShout(pick(hareldDuelOpen));
    hDuel.hidden = false;
    const t0 = performance.now(); const period = 1400;
    let raf = 0, over = false;
    const posAt = () => { const ph = ((performance.now() - t0) % period) / period; return ph < 0.5 ? ph * 2 : 2 - ph * 2; };
    const sweep = () => { hMark.style.left = posAt() * 100 + "%"; raf = requestAnimationFrame(sweep); };
    sweep();
    const end = (hit) => {
      if (over) return; over = true; cancelAnimationFrame(raf); clearTimeout(limit);
      hareldPress = null; hDuel.hidden = true;
      if (hit) { hareldBoostMul = 3; hareldBoostEnd = performance.now() + 20000; sfx("correct"); hareldShout(pick(hareldDuelWin) + "\n⚡ ×3 WISDOM · 20s"); }
      else { sfx("wrong"); hareldShout(pick(hareldDuelLose)); }
      render(); res();
    };
    const limit = setTimeout(() => end(false), 3000);
    hareldPress = () => { const p = posAt(); end(p >= 0.4 && p <= 0.6); };
  });
}

function hareldRiddle() {
  return new Promise((res) => {
    hareldShout(pick(hareldRiddleOpen));
    hInput.hidden = false; hAns.value = ""; hAns.focus({ preventScroll: true });
    hareldSubmit = () => {
      if (!hAns.value.trim()) return;
      hareldSubmit = null; hInput.hidden = true;
      const gain = Math.max(perSec() * 600, perClick() * 50);
      earn(gain); sfx("correct");
      hareldShout(pick(hareldRiddleOk) + "\n✨ +" + fmt(gain));
      render(); save(); res();
    };
  });
}

function hareldTax() {
  return new Promise((res) => {
    hareldShout(pick(hareldTaxOpen));
    hChoice.hidden = false;
    hareldChoice = async (fine) => {
      hareldChoice = null; hChoice.hidden = true;
      if (fine) {
        let top = -1;
        ups.forEach((u, i) => { if (owned[i] > 0 && (top < 0 || u.base > ups[top].base)) top = i; });
        if (top < 0) { sfx("nope"); hareldShout("YOU HAVE NOTHING. I AM SADDER NOW."); }
        else {
          owned[top] -= 1; hareldBoostMul = 5; hareldBoostEnd = performance.now() + 15000;
          sfx("correct"); hareldShout(pick(hareldTaxYes) + "\n-1 " + ups[top].name.toUpperCase() + " · ⚡ ×5 · 15s");
          render(); save();
        }
      } else {
        sfx("screech");
        hRoot.classList.remove("drop", "slam"); hRoot.classList.add("rage");
        hareldShout("AAAAAAAAAAAAAAAAAAAAAAAAA");
        await nap(2000);
        hRoot.classList.remove("rage");
        hareldShout(pick(hareldTaxNo));
      }
      res();
    };
  });
}

function hareldThud() {
  const el = document.createElement("span");
  el.className = "hthud"; el.textContent = "THUD!!";
  hRoot.appendChild(el);
  el.animate([{ transform: "translate(-50%, -50%) scale(0.2) rotate(-8deg)", opacity: 0 },{ transform: "translate(-50%, -50%) scale(1.3) rotate(-8deg)", opacity: 1, offset: 0.25 },{ transform: "translate(-50%, -80%) scale(1.5) rotate(-8deg)", opacity: 0 }], { duration: 900 }).onfinish = () => el.remove();
}

async function hareldVisit() {
  hareldBusy = true;
  hidePhone();
  pushBanner("hareld", "Hareld is here", "He is very loud.", () => {});
  fighting = true; instant = false;
  clearInterval(typer); words.classList.remove("cursor");
  lastHareldAt = performance.now();
  hDuel.hidden = true; hInput.hidden = true; hChoice.hidden = true;
  hSay.textContent = "";
  hRoot.classList.remove("rage", "slam", "leave");
  hRoot.hidden = false; replay(hRoot, "drop"); sfx("hareld_fall");
  try {
    await nap(reduce ? 0 : 520);
    hRoot.classList.add("slam");
    sfx("hareld_in");
    hFlash.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450 });
    replay(document.body, "shake");
    hareldThud();
    await nap(900);
    hareldShout(pick(hareldIntros));
    await nap(2600);
    const kind = Math.floor(Math.random() * 3);
    if (kind === 0) await hareldDuel();
    else if (kind === 1) await hareldRiddle();
    else await hareldTax();
    await nap(2200);
    hareldShout(pick(hareldExits));
    await nap(1600);
    hRoot.classList.add("leave");
    await nap(reduce ? 0 : 450);
  } finally {
    hRoot.hidden = true;
    hRoot.classList.remove("drop", "slam", "leave", "rage");
    hareldPress = null; hareldSubmit = null; hareldChoice = null;
    fighting = false; hareldBusy = false;
    lastHareldAt = performance.now();
    hareldGap = hareldRollGap();
    showPhone();
    render(); save();
  }
}

function checkHareld() {
  if (document.hidden || tutPaused) return;
  if (!touched || earned < 50000) return;
  if (fighting || sillyBusy || hareldBusy || vnBusy) return;
  if (document.querySelector(".offline:not([hidden]), .panel-modal:not([hidden]), .tree:not([hidden])")) return;
  if (performance.now() - lastHareldAt < hareldGap) return;
  if (Math.random() > 0.05) return;
  hareldVisit();
}

hScream.addEventListener("click", () => hareldPress && hareldPress());
hSend.addEventListener("click", () => hareldSubmit && hareldSubmit());
hFine.addEventListener("click", () => hareldChoice && hareldChoice(true));
hNo.addEventListener("click", () => hareldChoice && hareldChoice(false));
hAns.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); if (hareldSubmit) hareldSubmit(); } });
document.addEventListener("keydown", (e) => { if (e.code === "Space" && hareldPress) { e.preventDefault(); if (!e.repeat) hareldPress(); } });
setInterval(checkHareld, 500);

const goldBag = ["boost", "windfall", "upgrade", "mega"];
let goldenEl = null, goldenTimer = null;

function spawnGolden() {
  if (fighting || goldenEl || tutPaused) return;
  const el = document.createElement("button");
  el.type = "button"; el.className = "golden"; el.textContent = "🍊";
  el.setAttribute("aria-label", "Golden Tangerine");
  document.body.appendChild(el);
  const startY = 15 + Math.random() * 60;
  const dir = Math.random() < 0.5 ? 1 : -1;
  const vw = window.innerWidth / ROOT_ZOOM;
  const startX = dir === 1 ? -80 : vw + 80;
  const endX = dir === 1 ? vw + 80 : -80;
  const midY = startY + (Math.random() - 0.5) * 30;
  el.style.left = startX + "px"; el.style.top = startY + "%";
  const duration = 7000 + Math.random() * 3000;
  const anim = el.animate([
    { transform: "translate(-50%, -50%) scale(1) rotate(0deg)", offset: 0 },
    { transform: `translate(-50%, -50%) translateX(${(endX - startX) * 0.5}px) translateY(${(midY - startY) * 6}px) scale(1.1) rotate(${dir * 240}deg)`, offset: 0.5 },
    { transform: `translate(-50%, -50%) translateX(${endX - startX}px) translateY(${(startY - midY) * 4}px) scale(1) rotate(${dir * 480}deg)`, offset: 1 }
  ], { duration, easing: "linear" });
  sfx("golden");
  pushBanner("golden", "Golden Tangerine", "A gift drifts past...", () => {});
  goldenEl = el;
  const remove = () => { if (goldenEl === el) goldenEl = null; el.remove(); };
  el.addEventListener("click", () => {
    if (!goldenEl) return;
    anim.cancel(); sfx("goldenhit"); grantGolden(el);
    achFlags.goldenCaught = (achFlags.goldenCaught || 0) + 1; saveAchs(); remove();
  });
  anim.onfinish = remove;
  clearTimeout(goldenTimer);
  goldenTimer = setTimeout(spawnGolden, goldenIntervalMs());
}

function grantGolden(el) {
  goldenTotal += 1;
  const rolls = treeBought("luck3") ? 2 : 1;
  for (let k = 0; k < rolls; k++) grantGoldenReward(el, k === 0);
  render(); save();
}

function grantGoldenReward(el, showFloat) {
  const kind = pick(goldBag);
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  let msg = "";
  const rewardMul = goldenRewardMul();
  if (kind === "boost") { boostEnd = Math.max(boostEnd, performance.now()) + 15000 * rewardMul; msg = "⚡ ×5 for " + (15 * rewardMul).toFixed(1) + "s!"; }
  else if (kind === "windfall") { const gain = Math.max(perSec() * 900, perClick() * 50, 500) * rewardMul; earn(gain); msg = "💰 +" + fmt(gain); }
  else if (kind === "upgrade") { const idxs = ups.map((_, i) => i).filter((i) => cost(i) <= Math.max(bank, 1) * 50); const i = idxs.length ? pick(idxs) : 0; bank += cost(i) * rewardMul; owned[i] += 1; msg = "🎁 " + ups[i].name + "!"; }
  else { boostEnd = Math.max(boostEnd, performance.now()) + 7777 * rewardMul; msg = "✨ MEGA ×5 for " + (7.777 * rewardMul).toFixed(1) + "s!"; }
  floatText(msg, x, y - 20, "hot");
  render(); save();
}

function spawnFirstGolden() {
  if (goldenEl) return;
  if (fighting || tutPaused) { setTimeout(spawnFirstGolden, 5000); return; }
  spawnGolden();
}
setTimeout(spawnFirstGolden, 15000);

requestAnimationFrame(() => { document.querySelectorAll("#rail > *").forEach((el, i) => { el.style.setProperty("--d", 60 + i * 55 + "ms"); el.classList.add("in-left"); }); });

let storySeen = {};
let vnBusy = false, vnSkip = false, vnTimer = null, vnAdvance = null, vnCancel = null, lastStoryAt = -1e9;

const vn = document.getElementById("vn");
const vnTitle = document.getElementById("vnTitle");
const vnChap = document.getElementById("vnChap");
const vnHead = document.getElementById("vnHead");
const vnSub = document.getElementById("vnSub");
const vnBegin = document.getElementById("vnBegin");
const vnSage = document.getElementById("vnSage");
const vnBox = document.getElementById("vnBox");
const vnName = document.getElementById("vnName");
const vnText = document.getElementById("vnText");
const vnChoices = document.getElementById("vnChoices");
const vnNext = document.getElementById("vnNext");

function loadStory() { try { storySeen = JSON.parse(localStorage.getItem(STORY_KEY)) || {}; } catch (e) { storySeen = {}; } }
function saveStory() { if (resetting) return; try { localStorage.setItem(STORY_KEY, JSON.stringify(storySeen)); } catch (e) { return; } }
loadStory();

const SCENES = {
  intro: {
    title: ["chapter one", "The Sleepy Sage", "a tale of one tangerine and a great deal of napping"],
    beats: [
      ["n", "Somewhere between a sunbeam and a nap, there sits a cat who knows everything."],
      ["n", "On his head balances a tangerine. It has not fallen in a hundred years."],
      ["w", "...You are standing in my sunbeam, youngin."],
      ["q", [["Sorry! Are you the Wise Cat?", "I am. Also the Sleepy Cat. Also the Tangerine Cat. I answer to snacks."],["Is that a tangerine on your head?", "It is. Do not ask how. It is the one question I refuse to answer."],["I came here to learn wisdom.", "Hm. Brave. Or lost. Either way, welcome."]]],
      ["w", "Wisdom is not found, youngin. It is gathered. One word at a time."],
      ["w", "Ask, and I will share a little. Gather enough, and you can spend it on better ways to nap... I mean, to think."],
      ["q", [["That sounds easy.", "Everything sounds easy to someone who has never napped under pressure."],["What do I spend it on?", "Slow blinks. Cardboard boxes. Sunbeams. Each one makes the wisdom come faster."],["Is there a catch?", "...There is a gremlin."]]],
      ["w", "A small grey menace called the Silly Cat. Whenever your wisdom reaches a milestone, he will text you."],
      ["w", "He will ask a riddle. Solve it, and I will be forced to give you a mighty boost. Fail, and he takes most of your wisdom."],
      ["w", "Also: sometimes a golden tangerine drifts past. Catch it. Do not ask why. It is always a good idea."],
      ["w", "One last thing. When you have gathered enough, challenge me. Steal my tangerine, and your wisdom will double. Forever."],
      ["w", "Now. Press the button and ask for your first word of wisdom. Go on, youngin."]
    ]
  },
  silly: {
    title: ["chapter two", "The Gremlin", "in which a very small cat causes a very large problem"],
    beats: [
      ["n", "The phone goes quiet. Somewhere, a very small cat is laughing."],
      ["w", "Ah. So you have met him."],
      ["q", [["Who IS that cat?", "The Silly Cat. Once my apprentice. He studied wisdom for exactly one afternoon, then discovered it was shiny, and that it could be stolen."],["He called you grandpa.", "He calls everyone grandpa. In cat years I am, admittedly, extremely old. It is rude and also accurate."],["Is he always like that?", "Only on milestones. And weekdays. And weekends."]]],
      ["w", "He is not wicked, merely unsupervised. Beat his riddles and he must give you a favour. Lose, and he collects."],
      ["w", "Keep your wits, youngin. And mind your spelling. He is judging."]
    ]
  },
  boss: {
    title: ["chapter three", "The Tangerine", "which turns out to be lighter than it looks"],
    beats: [
      ["n", "The tangerine glows in your paws. Warm. Lighter than it looks."],
      ["w", "You took it. Nobody has taken it in a hundred years."],
      ["q", [["What is it, really?", "The last tangerine of the Old Orchard. Every wise cat has carried it. It holds one thing: patience."],["Was that a test?", "Everything is a test. Naps especially."],["Do I have to give it back?", "Ha. No. It chooses who carries it. For now, it chose you."]]],
      ["w", "Each time you win it, a little more wisdom flows through you. Doubled, then doubled again."],
      ["w", "But be warned. Gather enough, and it grows heavy. There is a way to set the weight down. I call it the Great Nap."],
      ["w", "When you are ready, you may Transcend. Fold your wisdom into Insight, and begin again, lighter."]
    ]
  },
  transcend: {
    title: ["chapter four", "The Great Nap", "where everything is forgotten, and somehow understood"],
    beats: [
      ["n", "The room goes quiet. The sunbeam stretches across the whole world."],
      ["w", "Welcome back, youngin. How does it feel?"],
      ["q", [["Lighter.", "Yes. Wisdom you carry makes you heavy. Wisdom you have become makes you light."],["Like I forgot everything, but know more.", "Exactly. Insight is what stays when the facts drift away."],["Can I do it again?", "As many times as you like. Each nap leaves you wiser. Mind the gremlin."]]],
      ["w", "The sunbeam moves. Move with it."],
      ["w", "Whenever you are ready, climb again. I will be here. Probably asleep."]
    ]
  },
  tree: {
    title: ["interlude", "The Wisdom Tree", "in which the sage explains the stars"],
    beats: [
      ["n", "A star blinks awake in the sunbeam. Then another. Then a whole sky of them."],
      ["w", "Ah. You have found the Wisdom Tree, youngin. It was always here. You simply had nothing to feed it."],
      ["w", "Every Transcend leaves Insight behind. The more wisdom you gather before a nap, the more Insight you carry out."],
      ["q", [["What does Insight do?", "Two things. Every point makes all your wisdom flow ten percent faster, forever. That part happens on its own."],["Where is the Tree?", "In the rail on the left. The button with the little star. Open it and the sky appears."],["Do I lose it when I Transcend?", "Never. Wisdom fades. Insight stays. That is rather the point."]]],
      ["w", "The second thing: you may spend Insight on stars. Tap a glowing one and it is yours, through every Great Nap to come."],
      ["w", "There are six branches. I will name them slowly, because I am sleepy."],
      ["w", "Sleep stretches how long your cats keep earning while you are away. The last star there doubles what they earn."],
      ["w", "Luck brings golden tangerines more often. Its last star makes each one grant two gifts."],
      ["w", "Flow is for the clickers. It widens your combo window, and its last star lets the combo bonus climb higher."],
      ["w", "Pride doubles what your achievements give you. Trophies, youngin. Finally useful."],
      ["w", "Insight makes every point of Insight stronger than ten percent. Wisdom feeding on wisdom."],
      ["w", "And the Gremlin branch. One star, a Pact with Silly Cat. After that he can no longer steal your wisdom. He will sulk. Gloriously."],
      ["q", [["Can I buy any star?", "Each branch begins near the center. A star needs the one before it, and the far ones stay hidden until you have Transcended enough times."],["What if I choose wrong?", "There is a Refund button. It costs five Insight and returns everything you spent. A small fee for a changed mind."],["Which branch is best?", "The one that suits how you play. Clicker, napper, or gremlin-hater. I will not choose for you. I am far too sleepy."]]],
      ["w", "Climb, nap, spend, climb again. That is the whole secret of the Tree."],
      ["w", "Now go and look at the stars. And mind the gremlin."]
    ]
  },
  legend: {
    title: ["final chapter", "The Keeper", "a confession, delivered sleepily"],
    beats: [
      ["n", "Three times you have taken the tangerine. Three times it has found its way back to him."],
      ["w", "I have a confession. The tangerine was never mine. It was only waiting for someone to keep it long enough."],
      ["q", [["Then why did you guard it?", "Because nobody keeps a thing well until they have to protect it. That is the whole secret."],["So is it mine now?", "It is yours as long as you keep clicking. Which, I notice, you have not stopped doing."],["What about the Silly Cat?", "Oh, he knew. He has always known. He just likes the fighting."]]],
      ["w", "There is nothing more I can teach you, youngin. Except this: the best wisdom is the kind you share."],
      ["w", "Go on. Click gently."]
    ]
  }
};

function vnLine(who, text, auto) {
  return new Promise((res) => {
    const quiet = who === null || who === "You";
    vnName.textContent = who || "";
    vnName.hidden = who === null;
    vnBox.classList.toggle("narr", who === null);
    vnSage.classList.toggle("dim", quiet);
    vnChoices.innerHTML = "";
    vnNext.hidden = true;
    vnText.textContent = "";
    vnCancel = res;
    const finish = () => {
      clearInterval(vnTimer);
      vnText.textContent = text;
      vnSage.classList.remove("talk");
      if (auto) { vnAdvance = null; setTimeout(res, 900); return; }
      vnNext.hidden = false;
      vnAdvance = () => { vnAdvance = null; res(); };
    };
    vnAdvance = finish;
    if (reduce || vnSkip) { finish(); return; }
    vnSage.classList.toggle("talk", !quiet);
    let i = 0;
    vnTimer = setInterval(() => {
      i += 1;
      vnText.textContent = text.slice(0, i);
      if (!quiet && i % 3 === 0) pip();
      if (i >= text.length) finish();
    }, 24);
  });
}

function vnAsk(name, prompt, labels) {
  return new Promise((res) => {
    vnName.textContent = name; vnName.hidden = false;
    vnBox.classList.remove("narr");
    vnSage.classList.add("dim"); vnSage.classList.remove("talk");
    vnText.textContent = prompt; vnNext.hidden = true;
    vnAdvance = null;
    vnCancel = () => res(-1);
    vnChoices.innerHTML = "";
    labels.forEach((label, k) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = label;
      b.addEventListener("click", () => { sfx("blip", { pitch: 700 }); vnChoices.innerHTML = ""; res(k); });
      vnChoices.appendChild(b);
    });
  });
}

async function runScene(id, replayOnly) {
  const sc = SCENES[id];
  vnBusy = true;
  if (!replayOnly && !storySeen[id]) { if (sc) pushBanner("story", sc.title[1], "A new chapter is available.", () => {}); }
  fighting = true;
  vnSkip = false;
  vnChap.textContent = sc.title[0]; vnHead.textContent = sc.title[1]; vnSub.textContent = sc.title[2];
  vnBegin.textContent = id === "intro" ? "Begin" : "Continue";
  vnTitle.classList.remove("gone");
  vn.hidden = false;
  vnSage.src = "img/wisdom_cat.jpg";
  await new Promise((res) => {
    const go = () => res();
    vnBegin.addEventListener("click", go, { once: true });
    vnCancel = () => { vnBegin.removeEventListener("click", go); res(); };
  });
  if (!ambOn) { audio(); ambStart("idle"); }
  vnTitle.classList.add("gone");
  await nap(700);
  for (const beat of sc.beats) {
    if (vnSkip) break;
    if (beat[0] === "n") { await vnLine(null, beat[1]); }
    else if (beat[0] === "w") { await vnLine("Wise Cat", beat[1]); }
    else {
      const k = await vnAsk("You", "What do you say?", beat[1].map((o) => o[0]));
      if (vnSkip || k < 0) break;
      await vnLine("You", beat[1][k][0], true);
      if (vnSkip) break;
      await vnLine("Wise Cat", beat[1][k][1]);
    }
  }
  clearInterval(vnTimer);
  vn.style.transition = "opacity 0.6s"; vn.style.opacity = "0";
  await nap(600);
  vn.hidden = true; vn.style.opacity = ""; vn.style.transition = "";
  vnBusy = false; fighting = false;
  if (!replayOnly) { storySeen[id] = true; saveStory(); lastStoryAt = performance.now(); }
  if (id === "intro" && !replayOnly) {
    btn.classList.add("nudge");
    btn.addEventListener("click", () => btn.classList.remove("nudge"), { once: true });
    const text = "Go on, youngin. Press the button.";
    live.textContent = text; type(text); replay(bubble, "hit");
    setTimeout(() => runMittensThenTutorial(), 1400);
  }
}

async function runMittensThenTutorial() { await mittensScene(); tutStartChapter("intro", () => {}); }

async function openStoryMenu() {
  if (fighting || sillyBusy || vnBusy) return;
  const open = Object.keys(SCENES).filter((id) => storySeen[id]);
  if (!open.length) { const text = "The story has barely begun, youngin. Keep clicking."; live.textContent = text; type(text); replay(bubble, "hit"); return; }
  vnBusy = true; fighting = true; vnSkip = false;
  vnTitle.classList.add("gone"); vn.hidden = false;
  vnSage.src = "img/wisdom_cat.jpg";
  const labels = open.map((id) => SCENES[id].title[0] + ": " + SCENES[id].title[1]).concat("Never mind");
  const k = await vnAsk("Chapters", "Which chapter shall we revisit?", labels);
  vn.hidden = true; vnBusy = false; fighting = false;
  if (k >= 0 && k < open.length) runScene(open[k], true);
}

function sceneReady(id) {
  if (storySeen[id]) return false;
  if (id === "intro") return true;
  if (id === "silly") return sillyWins + sillyLosses >= 1;
  if (id === "boss") return bossesWon >= 1;
  if (id === "transcend") return lifetimeInsight > 0;
  if (id === "tree") return insight > 0 || insightSpent > 0;
  return bossesWon >= 3;
}

function checkStory() {
  if (fighting || sillyBusy || vnBusy) return;
  if (document.querySelector(".offline:not([hidden]), .panel-modal:not([hidden])")) return;
  if (!storySeen.intro && (earned > 0 || bossLevel > 0 || owned.some((o) => o > 0))) { storySeen.intro = true; saveStory(); }
  const id = Object.keys(SCENES).find(sceneReady);
  if (!id) return;
  if (id !== "intro" && performance.now() - lastStoryAt < 20000) return;
  runScene(id, false);
}

vnBox.addEventListener("click", (e) => { if (!e.target.closest("button") && vnAdvance) vnAdvance(); });
document.addEventListener("keydown", (e) => { if (vn.hidden || !(e.code === "Space" || e.key === "Enter")) return; if (e.target.closest && e.target.closest("button")) return; e.preventDefault(); if (vnAdvance) vnAdvance(); });
document.getElementById("vnSkip").addEventListener("click", () => { vnSkip = true; clearInterval(vnTimer); if (vnCancel) vnCancel(); if (vnAdvance) vnAdvance(); });
document.getElementById("storyBtn").addEventListener("click", () => { sfx("blip", { pitch: 700 }); openStoryMenu(); });

setTimeout(checkStory, 700);
setInterval(checkStory, 1500);
setInterval(() => { if (!statsModal.hidden) renderStats(); }, 1000);

let lastTutCheck = 0;
setInterval(() => {
  if (tutPaused) return;
  if (document.hidden) return;
  if (vnBusy) return;
  const now = performance.now();
  if (now - lastTutCheck < 800) return;
  lastTutCheck = now;
  if (!tutState.seen.boss && earned >= 2000 && !fighting) { tutStartChapter("boss"); return; }
  if (!tutState.seen.tree && insight > 0 && !fighting) { tutStartChapter("tree"); return; }
}, 1000);

/* ================= NOTIFICATION BANNERS + CORNER PHONE ================= */
var bannersEl = document.getElementById("banners");
var phoneEl = document.getElementById("phone");
var phoneClock = document.getElementById("phoneClock");
var phoneDate = document.getElementById("phoneDate");
var phoneTime = document.getElementById("phoneTime");
var phoneNotifs = document.getElementById("phoneNotifs");
var phoneBadge = document.getElementById("phoneBadge");

const PHONE_NOTIF_MAX = 3;
const phoneNotifList = [];

function bannerIconFor(kind) { switch (kind) { case "silly": return "😼"; case "ach": return "🏆"; case "golden": return "🍊"; case "story": return "📖"; case "hareld": return "🐰"; case "transcend": return "✨"; case "daily": return "📅"; default: return "🔔"; } }
function bannerLabelFor(kind) { switch (kind) { case "silly": return "Message · now"; case "ach": return "Achievement · now"; case "golden": return "Gift · now"; case "story": return "Story · now"; case "hareld": return "Hareld · now"; case "transcend": return "System · now"; case "daily": return "Daily Wisdom · now"; default: return "Notification · now"; } }

function pushBanner(kind, title, desc, onClick) {
  toast(title, desc, kind);
}

function pumpBanner() {
  if (bannerActive) return;
  if (!bannersEl) return;
  const item = bannerQueue.shift();
  if (!item) return;
  bannerActive = true;
  const el = document.createElement("div");
  el.className = "banner";
  el.innerHTML = `<span class="b-ico">${bannerIconFor(item.kind)}</span><div class="b-body"><span class="b-label">${bannerLabelFor(item.kind)}</span><b class="b-title"></b><span class="b-desc"></span></div>`;
  el.querySelector(".b-title").textContent = item.title || "";
  el.querySelector(".b-desc").textContent = item.desc || "";
  bannersEl.appendChild(el);
  const dismiss = () => {
    if (el._out) return;
    el._out = true;
    el.classList.add("out");
    setTimeout(() => { el.remove(); bannerActive = false; pumpBanner(); }, 420);
  };
  el.addEventListener("click", () => { sfx("blip", { pitch: 900 }); if (item.onClick) { try { item.onClick(); } catch (e) {} } dismiss(); });
  setTimeout(dismiss, 6000);
}

function addPhoneNotif(kind, title) {
  phoneNotifList.unshift({ kind, title });
  if (phoneNotifList.length > PHONE_NOTIF_MAX) phoneNotifList.length = PHONE_NOTIF_MAX;
  renderNotifHistory();
  renderPhoneNotifs();
  peekPhone(4000);
}

function renderNotifHistory() {
  const historyEl = document.getElementById("notifHistory");
  const countEl = document.getElementById("notifCount");
  if (!historyEl || !countEl) return;
  historyEl.innerHTML = "";
  if (!phoneNotifList.length) {
    const empty = document.createElement("p");
    empty.className = "notif-empty";
    empty.textContent = "No notifications yet.";
    historyEl.appendChild(empty);
  } else {
    phoneNotifList.forEach((n) => {
      const item = document.createElement("div");
      item.className = "notif-history-item";
      item.innerHTML = `<span>${bannerIconFor(n.kind)}</span><b></b><small>${bannerLabelFor(n.kind)}</small>`;
      item.querySelector("b").textContent = n.title || "Notification";
      historyEl.appendChild(item);
    });
  }
  countEl.textContent = phoneNotifList.length;
}

function renderPhoneNotifs() {
  if (!phoneEl || !phoneNotifs || !phoneBadge) return;
  phoneNotifs.innerHTML = "";
  phoneNotifList.forEach((n) => {
    const el = document.createElement("div");
    el.className = "phone-notif";
    el.innerHTML = `<span class="pn-ico">${bannerIconFor(n.kind)}</span><span class="pn-txt"></span>`;
    el.querySelector(".pn-txt").textContent = n.title || "";
    phoneNotifs.appendChild(el);
  });
  const count = phoneNotifList.length;
  if (count > 0) { phoneBadge.hidden = false; phoneBadge.textContent = count > 9 ? "9+" : count; phoneEl.classList.add("has-notif"); }
  else { phoneBadge.hidden = true; phoneEl.classList.remove("has-notif"); }
}

function clearPhoneNotifs() { phoneNotifList.length = 0; renderNotifHistory(); renderPhoneNotifs(); }

function peekPhone(ms) {
  if (!phoneEl) return;
  phoneEl.classList.add("peek");
  clearTimeout(phoneEl._peekT);
  phoneEl._peekT = setTimeout(() => { if (!phoneEl.matches(":hover")) phoneEl.classList.remove("peek"); }, ms);
}

function updatePhoneClock() {
  if (!phoneClock || !phoneDate || !phoneTime) return;
  const now = new Date();
  const hh = now.getHours();
  const mm = String(now.getMinutes()).padStart(2, "0");
  const h12 = ((hh + 11) % 12) + 1;
  const ampm = hh >= 12 ? "PM" : "AM";
  const timeStr = h12 + ":" + mm;
  phoneClock.textContent = timeStr;
  phoneTime.textContent = timeStr + " " + ampm;
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  phoneDate.textContent = days[now.getDay()] + ", " + months[now.getMonth()] + " " + now.getDate();
}
updatePhoneClock();
setInterval(updatePhoneClock, 10000);
pumpBanner();

if (phoneEl) phoneEl.addEventListener("click", () => {
  sfx("blip", { pitch: 1100 });
  phoneEl.classList.add("grow");
  peekPhone(2200);
  setTimeout(() => phoneEl.classList.remove("grow"), 400);
  if (phoneNotifList.length > 0) { setTimeout(() => clearPhoneNotifs(), 500); }
});

function focusPhone() { if (!phoneEl || phoneEl.classList.contains("focused")) return; phoneEl.classList.add("focused"); sfx("blip", { pitch: 1000 }); setTimeout(() => { phoneEl.style.opacity = "0"; phoneEl.style.transition = "opacity 0.3s"; }, 700); }
function unfocusPhone() { if (!phoneEl || !phoneEl.classList.contains("focused")) return; phoneEl.style.opacity = ""; phoneEl.style.transition = ""; phoneEl.classList.remove("focused"); sfx("blip", { pitch: 700 }); }

document.addEventListener("wc:sillyLeave", () => { setTimeout(unfocusPhone, 200); });
document.addEventListener("wc:sillyVisit", () => { focusPhone(); });

function hidePhone() { if (phoneEl) phoneEl.style.display = "none"; }
function showPhone() { if (phoneEl) phoneEl.style.display = ""; }

/* ================= DEV PANEL ================= */
(function() {
  /* --- toggle open/close --- */
  const devPanel = document.getElementById("devpanel");
  const devToggle = document.getElementById("devToggle");
  if (devToggle && devPanel) {
    devToggle.addEventListener("click", () => {
      devPanel.classList.toggle("open");
    });
  }

  let autoClickOn = false, autoClickTimer = null;
  const autoBtn = document.getElementById("devAutoClick");
  autoBtn.addEventListener("click", () => {
    autoClickOn = !autoClickOn;
    if (autoClickOn) { autoClickTimer = setInterval(() => { btn.click(); }, 40); autoBtn.textContent = "🤖 Auto Clicker: ON"; autoBtn.classList.add("on"); }
    else { clearInterval(autoClickTimer); autoClickTimer = null; autoBtn.textContent = "🤖 Auto Clicker: OFF"; autoBtn.classList.remove("on"); }
  });
  document.getElementById("devSilly").addEventListener("click", () => { lastSillyAt = 0; sillyBusy = false; fighting = false; if (!touched) touched = true; sillyVisit(); });
  document.getElementById("devHareld").addEventListener("click", () => { lastHareldAt = 0; hareldBusy = false; fighting = false; if (!touched) touched = true; hareldVisit(); });
  document.getElementById("devWis1").addEventListener("click", () => { earn(1e6); render(); save(); sfx("buy"); });
  document.getElementById("devWis5").addEventListener("click", () => { earn(5e6); render(); save(); sfx("buy"); });
  document.getElementById("devWis100").addEventListener("click", () => { earn(100e6); render(); save(); sfx("buy"); });
  document.getElementById("devInsight").addEventListener("click", () => { insight += 5; insightEarned += 5; render(); save(); sfx("buy"); });
  document.getElementById("devGolden").addEventListener("click", () => { if (goldenEl) { goldenEl.remove(); goldenEl = null; } spawnGolden(); });
  document.getElementById("devWipe").addEventListener("click", () => { localStorage.removeItem("wisdom-clicker-tutorial"); localStorage.removeItem("wisdom-clicker-story"); tutState.seen = {}; storySeen = {}; location.reload(); });
})();

