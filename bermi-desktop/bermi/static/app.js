// ---------- Bermi front-end ----------
const $ = (s) => document.querySelector(s);
const log = $("#log"), activity = $("#activity");
const stateTag = $("#state-tag"), orbCaption = $("#orb-caption");
let CFG = { assistant_name: "Bermi", tts_engine: "edge" };
let history = [];               // [{role, content}]
let state = "idle";             // idle | listening | thinking | speaking

// ---------- setup ----------
init();
async function init() {
  try {
    CFG = await (await fetch("/api/config")).json();
    $("#brand-name").textContent = CFG.assistant_name.toUpperCase();
    $("#model-tag").textContent = CFG.model || "—";
    $("#conn-dot").classList.toggle("on", CFG.has_key);
    if (!CFG.has_key) addMsg("bermi", "No OpenRouter key found. Add OPENROUTER_API_KEY to your .env and restart me.");
    else addMsg("bermi", `Systems online. I'm ${CFG.assistant_name} — ask me anything, or tell me to run something on your computer.`);
  } catch (e) { console.error(e); }
  setState("idle");
  drawOrb();
}

// ---------- tabs ----------
document.querySelectorAll(".tab").forEach(t => t.onclick = () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
  t.classList.add("active");
  $("#tab-chat").classList.toggle("hidden", t.dataset.tab !== "chat");
  $("#tab-activity").classList.toggle("hidden", t.dataset.tab !== "activity");
});

// ---------- messaging UI ----------
function addMsg(who, text) {
  const el = document.createElement("div");
  el.className = `msg ${who}`;
  if (who === "bermi") el.dataset.name = CFG.assistant_name;
  el.textContent = text;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}
function addActivity(cls, title, body) {
  const el = document.createElement("div");
  el.className = `act ${cls}`;
  el.innerHTML = `<span class="k">${title}</span>` + (body ? `<pre>${escapeHtml(body)}</pre>` : "");
  activity.appendChild(el);
  activity.scrollTop = activity.scrollHeight;
}
const escapeHtml = (s) => (s || "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function setState(s) {
  state = s;
  stateTag.textContent = s;
  const cap = { idle: "Tap the orb or hold Space to speak", listening: "Listening…", thinking: "Thinking…", speaking: "Speaking…" };
  orbCaption.textContent = cap[s] || "";
}

// ---------- send a turn ----------
async function send(text) {
  if (!text.trim() || state === "thinking") return;
  addMsg("user", text);
  history.push({ role: "user", content: text });
  setState("thinking");
  let thinkingEl = addMsg("bermi thinking", "…");
  let finalText = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const parts = buf.split("\n\n"); buf = parts.pop();
      for (const p of parts) {
        const line = p.replace(/^data: /, "").trim();
        if (!line) continue;
        const evt = JSON.parse(line);
        finalText = handleEvent(evt, thinkingEl, finalText);
      }
    }
  } catch (e) {
    thinkingEl.classList.remove("thinking");
    thinkingEl.textContent = "Connection error: " + e.message;
  }
  setState("idle");
}

function handleEvent(evt, thinkingEl, finalText) {
  switch (evt.type) {
    case "token":
      finalText += evt.text;
      break;
    case "tool":
      addActivity("", `▶ ${evt.name}`, JSON.stringify(evt.args, null, 2));
      break;
    case "result":
      addActivity("result", `✓ ${evt.name}`, evt.output);
      break;
    case "confirm":
      askConfirm(evt);
      addActivity("", `⏸ awaiting approval · ${evt.name}`, JSON.stringify(evt.args, null, 2));
      break;
    case "done":
      finalText = evt.text || finalText || "Done.";
      thinkingEl.classList.remove("thinking");
      thinkingEl.textContent = finalText;
      history.push({ role: "assistant", content: finalText });
      speak(finalText);
      break;
    case "error":
      thinkingEl.classList.remove("thinking");
      thinkingEl.textContent = "⚠ " + evt.text;
      addActivity("err", "error", evt.text);
      break;
  }
  return finalText;
}

// ---------- confirmation modal ----------
function askConfirm(evt) {
  $("#confirm-name").textContent = evt.name;
  $("#confirm-args").textContent = JSON.stringify(evt.args, null, 2);
  $("#confirm-overlay").classList.remove("hidden");
  const done = (approved) => {
    $("#confirm-overlay").classList.add("hidden");
    fetch("/api/approve", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: evt.id, approved }) });
  };
  $("#allow").onclick = () => done(true);
  $("#deny").onclick = () => done(false);
}

// ---------- TTS ----------
async function speak(text) {
  if (CFG.tts_engine === "off" || !text) return;
  try {
    setState("speaking");
    const res = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }) });
    const buf = await res.arrayBuffer();
    if (buf.byteLength === 0) { setState("idle"); return; }
    const audio = new Audio(URL.createObjectURL(new Blob([buf])));
    audio.onended = () => setState("idle");
    speaking = true; audio.play();
  } catch { setState("idle"); }
}

// ---------- composer ----------
$("#composer").onsubmit = (e) => {
  e.preventDefault();
  const t = $("#text").value; $("#text").value = "";
  send(t);
};

// ---------- voice capture ----------
let mediaRecorder, chunks = [], audioCtx, analyser, dataArray, micStream;
async function startRec() {
  if (state === "thinking") return;
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch { addMsg("bermi", "I couldn't access your microphone. Check browser permissions."); return; }
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser(); analyser.fftSize = 256;
  audioCtx.createMediaStreamSource(micStream).connect(analyser);
  dataArray = new Uint8Array(analyser.frequencyBinCount);
  chunks = [];
  mediaRecorder = new MediaRecorder(micStream);
  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
  mediaRecorder.onstop = onRecStop;
  mediaRecorder.start();
  $("#mic").classList.add("rec");
  setState("listening");
}
async function stopRec() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
  $("#mic").classList.remove("rec");
}
async function onRecStop() {
  micStream.getTracks().forEach(t => t.stop());
  if (audioCtx) audioCtx.close();
  const blob = new Blob(chunks, { type: "audio/webm" });
  if (blob.size < 1200) { setState("idle"); return; }
  setState("thinking");
  const fd = new FormData(); fd.append("audio", blob, "speech.webm");
  try {
    const { text } = await (await fetch("/api/stt", { method: "POST", body: fd })).json();
    if (text) send(text); else { addMsg("bermi", "I didn't catch that."); setState("idle"); }
  } catch { setState("idle"); }
}

$("#mic").onmousedown = startRec;
$("#mic").onmouseup = stopRec;
$("#mic").onmouseleave = () => { if ($("#mic").classList.contains("rec")) stopRec(); };
$("#orb").onclick = () => { state === "listening" ? stopRec() : startRec(); };
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && document.activeElement.tagName !== "INPUT" && state !== "listening") { e.preventDefault(); startRec(); }
});
document.addEventListener("keyup", (e) => { if (e.code === "Space" && state === "listening") stopRec(); });

// ---------- the arc-reactor orb ----------
let speaking = false;
function drawOrb() {
  const c = $("#orb"), ctx = c.getContext("2d");
  const W = c.width, H = c.height, cx = W / 2, cy = H / 2;
  let t = 0;
  (function frame() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    let level = 0.3 + 0.08 * Math.sin(t * 2);
    if (state === "listening" && analyser) {
      analyser.getByteFrequencyData(dataArray);
      level = 0.3 + (dataArray.reduce((a, b) => a + b, 0) / dataArray.length) / 180;
    } else if (state === "thinking") level = 0.45 + 0.15 * Math.sin(t * 8);
    else if (state === "speaking") level = 0.5 + 0.2 * Math.abs(Math.sin(t * 10));

    const base = 120, R = base * (0.9 + level * 0.35);
    const col = state === "listening" ? "255,93,108" : state === "thinking" ? "255,207,107" : "57,215,255";

    // outer rotating rings
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${col},${0.14 + i * 0.05})`;
      ctx.lineWidth = 1.5;
      const rr = R + 26 + i * 22 + Math.sin(t + i) * 3;
      const seg = 40 + i * 10, gap = 0.12;
      for (let a = 0; a < Math.PI * 2; a += Math.PI * 2 / seg) {
        const rot = t * (i % 2 ? -0.3 : 0.3);
        ctx.moveTo(cx + rr * Math.cos(a + rot), cy + rr * Math.sin(a + rot));
        ctx.arc(cx, cy, rr, a + rot, a + rot + Math.PI * 2 / seg * (1 - gap));
      }
      ctx.stroke();
    }
    // glow core
    const g = ctx.createRadialGradient(cx, cy, 4, cx, cy, R);
    g.addColorStop(0, `rgba(${col},0.9)`);
    g.addColorStop(0.4, `rgba(${col},0.35)`);
    g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    // inner core ring
    ctx.beginPath(); ctx.strokeStyle = `rgba(${col},0.85)`; ctx.lineWidth = 2.5;
    ctx.arc(cx, cy, base * 0.55, 0, Math.PI * 2); ctx.stroke();
    // waveform bars when listening/speaking
    if (state === "listening" && analyser) {
      const n = 48;
      for (let i = 0; i < n; i++) {
        const v = (dataArray[i * 2] || 0) / 255;
        const a = (i / n) * Math.PI * 2;
        const r1 = base * 0.62, r2 = r1 + v * 40;
        ctx.beginPath(); ctx.strokeStyle = `rgba(${col},0.8)`; ctx.lineWidth = 2;
        ctx.moveTo(cx + r1 * Math.cos(a), cy + r1 * Math.sin(a));
        ctx.lineTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a)); ctx.stroke();
      }
    }
    requestAnimationFrame(frame);
  })();
}
