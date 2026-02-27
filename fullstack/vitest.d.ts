import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";

declare global {
  var expect: typeof expect;
  var describe: typeof describe;
  var it: typeof it;
  var beforeEach: typeof beforeEach;
  var afterEach: typeof afterEach;
  var vi: typeof vi;
}

export {};
