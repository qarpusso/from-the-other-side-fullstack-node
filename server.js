import http from "node:http"
import fs from "node:fs"

import { serveStatic } from "./utils/serveStatic.js"

const PORT = 8000
const __dirname = import.meta.dirname

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`)
  const content = fs.readFile(serveStatic())

  if (urlObj.pathname === "/api") {
    const data = { ok: true }
    const json = JSON.stringify(data)
    res.writeHead(200, {
      "Content-Type": "application/json charset=utf-8",
      "Content-Length": Buffer.byteLength(json),
    })
    res.end(json)
    return
  }

  res.writeHead(200, {
    "Content-Type": "text/html charset=utf-8",
    "Content-Length": Buffer.byteLength(content),
  })
  res.end(content)
})

server.listen(PORT, () => console.log("Server started at PORT:", PORT))
