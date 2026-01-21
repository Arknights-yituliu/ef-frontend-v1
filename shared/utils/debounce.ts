

/**
 * 函数防抖
 * @param {function(...[*])} func 传入一个函数
 * @param {number} duration  防抖间隔时间 单位ms
 * @returns {(function(...[*]): void)|*} 返回一个参数可空的函数
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  duration: number = 500
): (...args: Parameters<T>) => void {
  let timeout:any = 0;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, duration);
  };
}

/**
 * 节流函数 执行间隔内（当前时间-传入时间）只会执行一次函数
 * @param {function(...[*])} func 传入一个函数
 * @param {Date} begin 传入一个时间，需要在传入的函数中将他再次赋值为当前时间
 * @param {number} delay 执行函数间隔
 * @param {string} message 操作频繁时的弹窗消息提示内容
 * @returns {(function(...[*]): void)|*} 返回一个参数可空的函数
 */
function throttle<T extends (...args: any[]) => any>(
  func: T,
  begin: Date,
  delay: number = 500,
  message: string = '操作过于频繁'
): (...args: Parameters<T>) => void {
  return function (...args: Parameters<T>) {
    const current = new Date();
    if (current.getTime() - begin.getTime() >= delay) {
      func.apply(this, args);
    } else {
      console.log(message);
    }
  };
}

export {
  debounce,
  throttle
};
