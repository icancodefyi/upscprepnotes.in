import { spawn } from "child_process";
import fs from "fs";

async function main() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank"
  ]);

  // Wait for Chrome to be ready
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

  if (!version) {
    console.error("Chrome failed to start on 9222");
    chrome.kill();
    process.exit(1);
  }

  // Create target
  const newTargetRes = await fetch("http://127.0.0.1:9222/json/new?http://localhost:3000/landing", { method: "PUT" });
  const target = await newTargetRes.json();

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let msgId = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const resolve = pending.get(data.id);
      pending.delete(data.id);
      resolve(data.result);
    }
  };

  await new Promise(r => ws.onopen = r);

  // Set mobile device emulation
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send("Emulation.setUserAgentOverride", {
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
  });

  await send("Page.navigate", { url: "http://localhost:3000/landing" });
  await new Promise(r => setTimeout(r, 3000));

  // Evaluate overflowing elements
  const evalRes = await send("Runtime.evaluate", {
    expression: `
      (() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const bad = [];
        document.querySelectorAll("*").forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > winW + 5) {
            bad.push({
              tag: el.tagName,
              cls: el.className ? (typeof el.className === "string" ? el.className.slice(0, 80) : "") : "",
              id: el.id,
              right: Math.round(rect.right),
              scrollWidth: el.scrollWidth,
              text: el.innerText ? el.innerText.slice(0, 30).trim() : ""
            });
          }
        });
        return { docW, winW, bad: bad.slice(0, 15) };
      })()
    `,
    returnByValue: true
  });

  console.log("DOM Width Inspection Results:", JSON.stringify(evalRes?.result?.value, null, 2));

  // Capture Screenshot
  const shot = await send("Page.captureScreenshot", { format: "png" });
  const outPath = "/Users/zaidrakhange/.gemini/antigravity-cli/brain/8cf25b63-4094-419f-9daf-514c84a2d3b9/hero_mobile_cdp.png";
  fs.writeFileSync(outPath, Buffer.from(shot.data, "base64"));
  console.log(`Saved screenshot to ${outPath}`);

  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
