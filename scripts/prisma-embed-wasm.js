// Runs after `prisma generate`. Hostinger's deploy step drops the generated
// query_compiler_bg.wasm file, so make the Prisma client load the same query
// compiler from the base64 copy shipped as a .js file in @prisma/client/runtime.
const fs = require("fs");
const path = require("path");

const clientFile = path.join(__dirname, "..", "node_modules", ".prisma", "client", "index.js");
const original =
  "const queryCompilerWasmFilePath = require('path').join(config.dirname, 'query_compiler_bg.wasm')\n" +
  "        const queryCompilerWasmFileBytes = require('fs').readFileSync(queryCompilerWasmFilePath)";
const replacement =
  "const runtimeDir = require('path').dirname(require.resolve('@prisma/client/runtime/client.js'))\n" +
  "        const queryCompilerWasmFileBytes = Buffer.from(require(require('path').join(runtimeDir, 'query_compiler_bg.mysql.wasm-base64.js')).wasm, 'base64')";

const source = fs.readFileSync(clientFile, "utf8");
if (source.includes(replacement)) {
  console.log("prisma-embed-wasm: already patched");
} else if (source.includes(original)) {
  fs.writeFileSync(clientFile, source.replace(original, replacement));
  console.log("prisma-embed-wasm: patched", clientFile);
} else {
  // Fail the build loudly if a Prisma upgrade changes the generated code.
  console.error("prisma-embed-wasm: wasm loader not found in", clientFile);
  process.exit(1);
}
