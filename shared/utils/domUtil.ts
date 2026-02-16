// 获取实际的 DOM 元素（处理组件实例的情况）
export function getDOMElement (el: any): HTMLElement | null {
  if (!el) return null;

  // 如果是 DOM 元素，直接返回
  if (el instanceof HTMLElement) {
    return el;
  }

  // 如果是 Vue 组件实例（Vue 2 风格），尝试获取 $el
  if (el.$el) {
    if (el.$el instanceof HTMLElement) {
      return el.$el;
    }
    // 如果 $el 也是组件，递归查找
    const nested = getDOMElement(el.$el);
    if (nested) return nested;
  }

  // 尝试获取 ref 属性（Vue 3 的 ref 可能包装在 .value 中）
  if (el.value) {
    if (el.value instanceof HTMLElement) {
      return el.value;
    }
    // 如果 value 也是组件，递归查找
    const nested = getDOMElement(el.value);
    if (nested) return nested;
  }

  // 尝试直接访问 el（可能是原始 DOM，检查 nodeType）
  if (el.nodeType === 1 && typeof el.tagName === 'string') {
    return el as HTMLElement;
  }

  // 如果 el 有 getBoundingClientRect 方法，可能是 DOM 元素但类型检查失败
  if (typeof el.getBoundingClientRect === 'function') {
    try {
      const rect = el.getBoundingClientRect();
      if (rect && typeof rect === 'object') {
        return el as HTMLElement;
      }
    } catch {
      // 忽略错误
    }
  }

  return null;
}
