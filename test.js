const assert = require("assert");
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const vm = require("vm");

const source = fs.readFileSync(path.join(__dirname, "index.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;

const sandbox = {
  exports: {},
  module: { exports: {} },
  document: { getElementById: () => null },
};
sandbox.exports = sandbox.module.exports;
vm.runInNewContext(compiled, sandbox);
const getComputedLabel = sandbox.module.exports.default;

const createElement = (attributes, innerText, tagName) => ({
  tagName: tagName || "BUTTON",
  ownerDocument: sandbox.document,
  innerText: innerText || "",
  getAttribute: (name) => {
    if (!Object.prototype.hasOwnProperty.call(attributes, name)) return null;
    return attributes[name];
  },
  querySelector: () => null,
});

const labelledByNodes = {
  heading: { innerText: "Main heading" },
  detail: { innerText: "extra detail" },
  empty: { innerText: "" },
};

sandbox.document = {
  getElementById: (id) => labelledByNodes[id] || null,
};

assert.strictEqual(
  getComputedLabel(
    createElement(
      { "aria-labelledby": "heading detail", "aria-label": "Fallback label" },
      "Inner text"
    )
  ),
  "Main heading extra detail",
  "concatenates multiple aria-labelledby references in order"
);

assert.strictEqual(
  getComputedLabel(
    createElement(
      { "aria-labelledby": " missing   heading   empty ", "aria-label": "Fallback label" },
      "Inner text"
    )
  ),
  "Main heading",
  "ignores missing or empty aria-labelledby references"
);

assert.strictEqual(
  getComputedLabel(
    createElement(
      { "aria-labelledby": "missing empty", "aria-label": "Fallback label" },
      "Inner text"
    )
  ),
  "Fallback label",
  "falls back to aria-label when all aria-labelledby references are missing or empty"
);

const iframeDocument = {
  getElementById: (id) =>
    id === "heading" ? { innerText: "Frame heading" } : null,
};
const iframeButton = createElement(
  { "aria-labelledby": "heading", "aria-label": "Fallback label" },
  "Inner text"
);
iframeButton.ownerDocument = iframeDocument;
assert.strictEqual(
  getComputedLabel(iframeButton),
  "Frame heading",
  "resolves aria-labelledby within the element's own document"
);

console.log("All tests passed");
