import { Component } from 'react';

// The CTA's smoke is decorative, but it is a WebGL component: where a context
// cannot be acquired — a VM, a remote desktop, a blocklisted driver, a tab that
// has hit the browser's context limit — it throws during render. <Suspense>
// only catches promises, so without this the throw unwinds past the button and
// takes the whole CTA off the page. Caught here, the fill is simply absent and
// `.btn-cta`'s copper gradient underneath stands in, which is what the button
// looked like before the smoke existed.
export default class SmokeBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
