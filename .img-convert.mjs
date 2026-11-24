import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9444;

const [base, sourcePath, targetPath, widthArg, qualityArg] = process.argv.slice(2);
const maxWidth = Number(widthArg || 1600);
const quality = Number(qualityArg || 0.82);

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tmpdir()}\\imgconv`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "about:blank",
  ],
  { stdio: "ignore" }
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function endpoint() {
  for (let i = 0; i < 80; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return res.json();
    } catch {
      /* belum siap */
    }
    await sleep(250);
  }
  throw new Error("endpoint debug chrome tidak siap");
}

const info = await endpoint();
const socket = new WebSocket(info.webSocketDebuggerUrl);
let nextId = 0;
const pending = new Map();

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id) return;
  const entry = pending.get(message.id);
  if (!entry) return;
  pending.delete(message.id);
  if (message.error) entry.reject(new Error(JSON.stringify(message.error)));
  else entry.resolve(message.result);
});

await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));

const send = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    nextId += 1;
    const message = { id: nextId, method, params };
    if (sessionId) message.sessionId = sessionId;
    pending.set(nextId, { resolve, reject });
    socket.send(JSON.stringify(message));
  });

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
await send("Page.navigate", { url: base }, sessionId);
await sleep(1500);

const expression = `(async () => {
  const img = new Image();
  img.src = ${JSON.stringify(sourcePath)};
  await (img.decode ? img.decode() : new Promise((res, rej) => { img.onload = res; img.onerror = rej; }));
  const scale = Math.min(1, ${maxWidth} / img.naturalWidth);
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);
  const dataUrl = canvas.toDataURL("image/webp", ${quality});
  return {
    w,
    h,
    mime: dataUrl.slice(5, dataUrl.indexOf(";")),
    bytes: dataUrl.length,
    data: dataUrl.slice(dataUrl.indexOf(",") + 1)
  };
})()`;

const result = await send(
  "Runtime.evaluate",
  { expression, awaitPromise: true, returnByValue: true },
  sessionId
);

if (result.exceptionDetails) {
  console.error(JSON.stringify(result.exceptionDetails, null, 1));
  socket.close();
  chrome.kill();
  process.exit(1);
}

const { w, h, mime, data } = result.result.value;
const buffer = Buffer.from(data, "base64");
writeFileSync(targetPath, buffer);
console.log(JSON.stringify({ target: targetPath, width: w, height: h, mime, bytes: buffer.length }));

socket.close();
chrome.kill();
