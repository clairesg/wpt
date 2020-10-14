import {WebOTPService, WebOTPServiceReceiver} from '/gen/third_party/blink/public/mojom/sms/webotp_service.mojom.m.js';

class MockWebOTPService {
  constructor() {
    this.mojoReceiver_ = new WebOTPServiceReceiver(this);

    this.interceptor_ =
        new MojoInterfaceInterceptor(WebOTPService.$interfaceName);

    this.interceptor_.oninterfacerequest = (e) => {
      this.mojoReceiver_.$.bindHandle(e.handle);
    };
    this.interceptor_.start();

    this.returnValues_ = {};
  }

  async receive() {
    let call = this.returnValues_.receive ?
        this.returnValues_.receive.shift() : null;
    if (!call)
      return;
    return call();
  }

  async abort() {}

  pushReturnValuesForTesting(callName, value) {
    this.returnValues_[callName] = this.returnValues_[callName] || [];
    this.returnValues_[callName].push(value);
    return this;
  }
}

const mockWebOTPService = new MockWebOTPService();

export class SmsProvider {
  constructor() {
    Object.freeze(this); // Make it immutable.
  }

  pushReturnValuesForTesting(callName, callback) {
    mockWebOTPService.pushReturnValuesForTesting(callName, callback);
  }
}

