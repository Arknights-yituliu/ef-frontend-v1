/**
 * 格式化数字
 * @param {Object} num 数字
 * @param {number} acc 位数
 * @returns {string} 格式化后的数字
 */
function formatNumber (num: number, acc = 2) {
  acc = acc !== undefined ? acc : 2;
  if (num === undefined) return '';
  return Number.parseFloat(num?.toString()).toFixed(acc);
}

function numberRound(number: number, decimalPlaces: number = 2) {
  // 参数验证
  if (isNaN(number)) {
    throw new TypeError('第一个参数必须是有效的数字');
  }

  if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0) {
    throw new Error('第二个参数必须是非负整数');
  }

  // 处理特殊情况：小数位数为0时，直接使用Math.round
  if (decimalPlaces === 0) {
    return Math.round(number);
  }

  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(number * multiplier) / multiplier;
}

function numberFloor(number: any, decimalPlaces: number = 2) {
  // 参数验证
  if (isNaN(number)) {
    console.log('第一个参数必须是有效的数字，传入参数：'+number)
    // throw new Error('第一个参数必须是有效的数字，传入参数：'+number);
  }

  if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0) {
    console.log('第二个参数必须是非负整数')
    // throw new Error('第二个参数必须是非负整数');
  }

  // 处理特殊情况：小数位数为0时，直接使用Math.floor
  if (decimalPlaces === 0) {
    return Math.floor(number);
  }

  // 计算方法：乘以10的decimalPlaces次方，向下取整，再除以10的decimalPlaces次方
  const factor = Math.pow(10, decimalPlaces);
  return Math.floor(number * factor) / factor;
}

export { numberFloor, numberRound };
