// 轻量游戏事件总线 — 发布订阅，解耦系统间直接调用
// 用法: emit(state, 'eventName', payload) → 所有 on('eventName') 监听器触发

const listeners = {};

export function on(event, fn) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(fn);
}

export function emit(state, event, payload) {
  const fns = listeners[event];
  if (!fns) return;
  for (const fn of fns) {
    fn(state, payload);
  }
}

export function clearAll() {
  for (const key of Object.keys(listeners)) {
    delete listeners[key];
  }
}
