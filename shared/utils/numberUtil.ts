function numberRound(number: number, decimalPlaces: number = 2) {
  // 参数验证
  if (Number.isNaN(number)) {
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
  if (Number.isNaN(number)) {
    console.log('第一个参数必须是有效的数字，传入参数：' + number);
    // throw new Error('第一个参数必须是有效的数字，传入参数：'+number);
  }

  if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0) {
    console.log('第二个参数必须是非负整数');
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

function stringToNumber(str: string | number | undefined): number {
  if (str === undefined || str === null) return 0;
  if (typeof str === 'number') return str;
  const num = Number.parseFloat(str.replace(/[^\d.-]/g, ''));
  return Number.isNaN(num) ? 0 : num;
}

/** 紧凑数字的单位：中文以「万」为分界，英文以「K」为分界 */
const compactUnitMap: Record<string, { divisor: number; unit: string }> = {
  'zh-CN': { divisor: 10_000, unit: '万' },
  'en-US': { divisor: 1000, unit: 'K' },
};

/**
 * 将数字压缩为紧凑写法，例如 12345 在保留 1 位小数时为 1.2万（中文）/ 12.3K（英文）。
 * 小于 10000 的数字保持原样，避免丢失精度。
 */
function numberCompact(value: number, locale: string, fractionDigits: number = 0): string {
  const { divisor, unit } = compactUnitMap[locale] ?? compactUnitMap['zh-CN']!;

  if (Math.abs(value) >= 10_000) {
    const compact = numberRound(value / divisor, fractionDigits);
    return `${compact.toFixed(fractionDigits)}${unit}`;
  }

  return fractionDigits > 0
    ? numberRound(value, fractionDigits).toFixed(fractionDigits)
    : `${numberRound(value, 0)}`;
}

export { numberCompact, numberFloor, numberRound, stringToNumber };
