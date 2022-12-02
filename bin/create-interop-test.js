#!/usr/bin/env node
import * as path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";

const packageJsonType = process.argv[2] || process.env.PACKAGE_JSON_TYPE || 'commonjs'
const tsconfigModule = process.argv[2] || process.env.TSCONFIG_MODULE || 'Node'
const tsconfigModuleResolution = process.argv[2] || process.env.TSCONFIG_MODULE_RESOLUTION ||'Node'

const thisPath = fileURLToPath(import.meta.url);
const rootPath = path.join(path.dirname(thisPath), "..");
const testPath = path.join(rootPath, 'test_interop');

const indexTs = `import helmet from 'helmet'
import { helmet as namedHelmet} from 'helmet'
import * as helmetStar from "helmet"
const requiredHelmet = require('helmet')
const requiredNamedHelmet = require('helmet').helmet
const defaultNamedHelmet = require('helmet').default

import { equal } from "assert"

equal(typeof helmet, 'function')
equal(typeof namedHelmet, 'function')
equal(typeof requiredHelmet, 'function')
equal(typeof requiredNamedHelmet, 'function')
equal(typeof defaultNamedHelmet, 'function')
equal(typeof helmetStar, 'function')
equal(typeof helmetStar.default, 'function')
equal(typeof helmetStar.helmet, 'function')
`

const tsconfigJson = JSON.stringify({
  "compilerOptions": {
    "module": tsconfigModule,
    "moduleResolution": tsconfigModuleResolution
  }
}, null, 2)

const packageJson = JSON.stringify({
  "name": "helmet-test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": packageJsonType,
  "scripts": {
    "test-interop": "tsc -p . && node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@types/node": "^18.11.10",
    "typescript": "^4.9.3"
  }
}, null, 2)

async function main() {
  await fs.mkdir(testPath)
  await fs.writeFile(path.join(testPath, "package.json"), packageJson);
  await fs.writeFile(path.join(testPath, "tsconfig.json"), tsconfigJson);
  await fs.writeFile(path.join(testPath, "index.ts"), indexTs);
}

main(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
