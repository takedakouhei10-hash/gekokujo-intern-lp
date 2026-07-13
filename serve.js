const http = require("http");
const fs = require("fs");
const path = require("path");
const ROOT = "/Users/takedakouhei/Desktop/Claude Code/下剋上インターンLP";
http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split("?")[0]);
  const file = path.join(ROOT, p === "/" ? "index.html" : p);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    const type = file.endsWith(".html") ? "text/html; charset=utf-8" : "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache" });
    res.end(data);
  });
}).listen(8899, () => console.log("LP preview on http://localhost:8899"));
