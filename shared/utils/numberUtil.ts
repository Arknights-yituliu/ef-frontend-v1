/**
 * 格式化数字
 * @param {Object} num 数字
 * @param {number} acc 位数
 * @returns {string} 格式化后的数字
 */
const formatNumber = (num:number, acc = 2) => {
    acc = typeof acc !== "undefined" ? acc : 2;
    if (typeof num === "undefined") return ''
    return parseFloat(num?.toString()).toFixed(acc);
}

function numberRound(number:number, decimalPlaces:number=2) {
    // 参数验证
    if (isNaN(number)) {
        throw new Error('第一个参数必须是有效的数字');
    }

    if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0) {
        throw new Error('第二个参数必须是非负整数');
    }

    // 处理特殊情况：小数位数为0时，直接使用Math.round
    if (decimalPlaces === 0) {
        return Math.round(number);
    }

    const multiplier = Math.pow(10,decimalPlaces);
    return Math.round(number * multiplier) / multiplier;
}

function numberFloor(number:number, decimalPlaces:number=2) {

    // 参数验证
    if (isNaN(number)) {
        throw new Error('第一个参数必须是有效的数字');
    }

    console.log()
    if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0) {
        throw new Error('第二个参数必须是非负整数');
    }

    // 处理特殊情况：小数位数为0时，直接使用Math.floor
    if (decimalPlaces === 0) {
        return Math.floor(number);
    }

    // 计算方法：乘以10的decimalPlaces次方，向下取整，再除以10的decimalPlaces次方
    const factor = Math.pow(10, decimalPlaces);
    return Math.floor(number * factor) / factor;
}

export {
    numberRound,numberFloor
}
