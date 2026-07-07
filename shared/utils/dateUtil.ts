/**
 * 根据传入时间格式字符串格式化时间
 * @param input {Date|number|string} 时间类
 * @param template {string} 时间格式字符串
 * @return {string} 传入时间类的格式化字符串
 * @example dateUtil(date, format = 'yyyy/MM/dd') 将返回 2024/01/01
 */
function dateFormat(input: Date | number | string, template: string = 'yyyy/MM/dd'): string {
  const date = checkType(input);

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

  const formatKeys: Record<string, string> = {
    yyyy: year,
    MM: month,
    dd: day,
    HH: hour,
    mm: minute,
    ss: second,
    SSS: milliseconds,
  };

  // 替换模板中的标记符，添加默认值处理
  return template.replace(/yyyy|MM|dd|HH|mm|ss|SSS/g, (match) => formatKeys[match] || match);
}

function checkType(input: Date | string | number): Date {
  if (typeof input === 'object' && input instanceof Date) {
    return input;
  }

  if (typeof input === 'string' || typeof input === 'number') {
    return new Date(input);
  }

  return new Date();
}

export { dateFormat };
