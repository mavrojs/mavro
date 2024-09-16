const test = require('node:test');
const assert = require('assert');
const fs = require('fs').promises;
const path = require('path');

const DIST_DIR = path.resolve(__dirname, "./dist");

test("TypeScript files should compile to JavaScript", async (t) => {
  await t.test("check if dist directory exists", async () => {
    try {
      await fs.access(DIST_DIR);
    } catch (err) {
      assert.fail('dist directory does not exist');
    }
  });

  await t.test("check if dist directory contains JavaScript files", async () => {
    try {
      const files = await fs.readdir(DIST_DIR);
      const jsFiles = files.filter((file) => file.endsWith(".js"));
      assert(jsFiles.length > 0, 'dist directory should contain at least one JavaScript file');
    } catch (err) {
      assert.fail('Failed to read dist directory');
    }
  });
});
