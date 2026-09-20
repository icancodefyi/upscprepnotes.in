import { spawn } from "child_process";
import fs from "fs";

async function runCapture() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank"
  ]);

  let version = null;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9222/json/version");
      version = await res.json();
      break;
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // 1. Mobile Capture
  const targetResM = await fetch("http://127.0.0.1:9222/json/new?http://localhost:3000/landing", { method: "PUT" });
  const targetM = await targetResM.json();
  const wsM = new WebSocket(targetM.webSocketDebuggerUrl);

  let idM = 1;
  const pendM = new Map();
  function sendM(method, params = {}) {
    return new Promise(r => {
      const id = idM++;
      pendM.set(id, r);
      wsM.send(JSON.stringify({ id, method, params }));
    });
  }
  wsM.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.id && pendM.has(d.id)) {
      const r = pendM.get(d.id);
      pendM.delete(d.id);
      r(d.result);
    }
  };
  await new Promise(r => wsM.onopen = r);
  await sendM("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await sendM("Emulation.setUserAgentOverride", {
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
  });
  await sendM("Page.navigate", { url: "http://localhost:3000/landing" });
  await new Promise(r => setTimeout(r, 2500));
  const shotM = await sendM("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("/Users/zaidrakhange/.gemini/antigravity-cli/brain/8cf25b63-4094-419f-9daf-514c84a2d3b9/hero_mobile_verified.png", Buffer.from(shotM.data, "base64"));
  wsM.close();

  // 2. Desktop Capture
  const targetResD = await fetch("http://127.0.0.1:9222/json/new?http://localhost:3000/landing", { method: "PUT" });
  const targetD = await targetResD.json();
  const wsD = new WebSocket(targetD.webSocketDebuggerUrl);

  let idD = 1;
  const pendD = new Map();
  function sendD(method, params = {}) {
    return new Promise(r => {
      const id = idD++;
      pendD.set(id, r);
      wsD.send(JSON.stringify({ id, method, params }));
    });
  }
  wsD.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.id && pendD.has(d.id)) {
      const r = pendD.get(d.id);
      pendD.delete(d.id);
      r(d.result);
    }
  };
  await new Promise(r => wsD.onopen = r);
  await sendD("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await sendD("Page.navigate", { url: "http://localhost:3000/landing" });
  await new Promise(r => setTimeout(r, 2500));
  const shotD = await sendD("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("/Users/zaidrakhange/.gemini/antigravity-cli/brain/8cf25b63-4094-419f-9daf-514c84a2d3b9/hero_desktop_verified.png", Buffer.from(shotD.data, "base64"));
  wsD.close();

  chrome.kill();
  console.log("Both screenshots saved!");
  process.exit(0);
}

runCapture().catch(e => { console.error(e); process.exit(1); });
