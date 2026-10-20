const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const host = "127.0.0.1", port = 8766, base = "http://" + host + ":" + port;
const server = spawn(process.env.PYTHON || "python", ["-m","uvicorn","app.main:app","--host",host,"--port",String(port)], {stdio:["ignore","pipe","pipe"]});
let output = "";
server.stdout.on("data", x => output += x.toString());
server.stderr.on("data", x => output += x.toString());
async function ready() {
  const until = Date.now() + 20000;
  while (Date.now() < until) {
    try { if ((await fetch(base + "/health")).ok) return; } catch (_) {}
    if (server.exitCode !== null) throw Error("API exited: " + output);
    await new Promise(r => setTimeout(r, 250));
  }
  throw Error("API not ready: " + output);
}
async function main() {
  let browser;
  const errors = [];
  try {
    await ready();
    browser = await chromium.launch({headless:true});
    const page = await browser.newPage({acceptDownloads:true});
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(base + "/opportunity-lab", {waitUntil:"domcontentloaded"});
    assert.match(await page.title(), /Real-Estate Operations Intelligence Lab/);

    await page.locator('[data-view="launch"]').click();
    await page.locator("#launchUpload").setInputFiles({name:"launch.csv",mimeType:"text/csv",buffer:Buffer.from("id,name,owner,day,weight,ready,depends_on\nA,Design,Design team,2,50,true,\nB,Readiness,Project controls,4,50,false,A\n")});
    await page.waitForFunction(() => document.querySelector("#launchImportMsg").textContent.includes("Loaded 2 checklist items"));
    assert.match(await page.locator("#launchList").innerText(), /Depends on A/);
    assert.match(await page.locator("#launchActions").innerText(), /Resolve dependencies/);
    let dl = page.waitForEvent("download");
    await page.locator("#launchExport").click();
    assert.equal((await dl).suggestedFilename(), "launchiq-readiness.csv");

    await page.locator('[data-view="documents"]').click();
    await page.locator("#docUpload").setInputFiles({name:"DOC-123_design_R02.txt",mimeType:"text/plain",buffer:Buffer.from("Document ID: DOC-123\nRevision R02\nOwner: Design Team\nStatus: Approved\nProject: Demo\n")});
    await page.waitForFunction(() => document.querySelector("#docImportMsg").textContent.includes("Inspected 1 file"));
    assert.match(await page.locator("#dRows").innerText(), /DOC-123_design_R02/);
    dl = page.waitForEvent("download");
    await page.locator("#docExport").click();
    assert.equal((await dl).suggestedFilename(), "documentiq-report.csv");

    await page.locator('[data-view="vendors"]').click();
    await page.locator("#vendorUpload").setInputFiles({name:"po.csv",mimeType:"text/csv",buffer:Buffer.from("id,vendor,item,promised_day,actual_day,ordered_qty,received_qty,po_amount,invoice_amount\nPO-X,Demo Vendor,Panels,5,9,10,8,100,110\n")});
    await page.waitForFunction(() => document.querySelector("#vendorImportMsg").textContent.includes("Loaded 1 orders"));
    assert.match(await page.locator("#vRows").innerText(), /4 days late/);
    assert.match(await page.locator("#vRows").innerText(), /20.0%/);
    dl = page.waitForEvent("download");
    await page.locator("#vendorExport").click();
    assert.equal((await dl).suggestedFilename(), "vendoriq-exceptions.csv");

    await page.locator('[data-view="service"]').click();
    await page.locator("#serviceUpload").setInputFiles({name:"tickets.csv",mimeType:"text/csv",buffer:Buffer.from("id,unit,summary,category,priority,age_days,status\nSR-X,Unit 1,Water seepage near window,,,5,Open\n")});
    await page.waitForFunction(() => document.querySelector("#serviceImportMsg").textContent.includes("Loaded 1 tickets"));
    assert.match(await page.locator("#sRows").innerText(), /Water seepage/);
    assert.match(await page.locator("#sRows").innerText(), /High/);
    assert.match(await page.locator("#serviceRules").innerText(), /Keyword and age rules/);
    dl = page.waitForEvent("download");
    await page.locator("#serviceExport").click();
    assert.equal((await dl).suggestedFilename(), "serviceiq-triage.csv");

    assert.deepEqual(errors, [], "Browser errors: " + errors.join("; "));
    console.log("Opportunity Lab E2E passed: LaunchIQ dependency CSV, DocumentIQ local text inspection, VendorIQ CSV exception analysis, ServiceIQ rule-based triage, and four report downloads.");
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
