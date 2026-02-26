// Silence warnings from showWarning utility during tests. These warnings are expected.

// eslint-disable-next-line no-console
const originalWarn = console.warn;

beforeEach(() => {
  globalThis.console.warn = (message: unknown, ...args: unknown[]) => {
    if (
      typeof message === "string" &&
      message.startsWith("CssSelectorGenerator:")
    ) {
      return;
    }
    originalWarn(message, ...args);
  };
});

afterEach(() => {
  globalThis.console.warn = originalWarn;
});
