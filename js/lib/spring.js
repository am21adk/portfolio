// A tiny critically-damped-ish spring integrator, used by tilt-cards.js to
// ease a value back to 0 (or towards a moving target) frame by frame.
// No physics library — this is the whole thing: Hooke's law plus damping,
// semi-implicit Euler integration.

export function createSpring({ stiffness = 0.12, damping = 0.78 } = {}) {
  let value = 0;
  let velocity = 0;
  let target = 0;

  return {
    set(t) {
      target = t;
    },
    snap(v) {
      value = v;
      velocity = 0;
    },
    step() {
      const force = (target - value) * stiffness;
      velocity = (velocity + force) * damping;
      value += velocity;
      return value;
    },
    get value() {
      return value;
    },
    get isSettled() {
      return Math.abs(velocity) < 0.01 && Math.abs(target - value) < 0.01;
    },
  };
}
