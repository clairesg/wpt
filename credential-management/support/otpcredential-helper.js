// These tests rely on the User Agent providing an implementation of
// the sms retriever.
//
// In Chromium-based browsers this implementation is provided by a polyfill
// in order to reduce the amount of test-only code shipped to users. To enable
// these tests the browser must be run with these options:
// //   --enable-blink-features=MojoJS,MojoJSTest

import {isChromiumBased} from '/resources/test-only-api.m.js';

let Provider;

async function createSmsProvider() {
  if (!Provider && isChromiumBased) {
    const {SmsProvider} =
        await import('/resources/chromium/mock-sms-receiver.js');
    Provider = SmsProvider;
  }
  if (!Provider)
    throw new Error('Mojo testing interface is not available.');
  return new Provider();
}

export function receive() {
  throw new Error("expected to be overriden by tests");
}

export function expect(call) {
  return {
    async andReturn(callback) {
      const mock = await createSmsProvider();
      mock.pushReturnValuesForTesting(call.name, callback);
    }
  }
}
