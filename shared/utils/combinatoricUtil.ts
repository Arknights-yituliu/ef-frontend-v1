/**
 * 从数组中选择 `k` 个不重复元素的所有组合
 * @param array 输入数组
 * @param k 组合的元素数量
 * @returns 生成器，依次产生所有可能的组合
 */
export function* combinations<T>(array: T[], k: number): Generator<T[]> {
  const n = array.length;

  if (!Number.isInteger(k)) {
    throw new TypeError(`k must be an integer, but got ${k}`);
  }

  if (k > n || k < 0) {
    return;
  }

  // 我们不直接操作原数组的元素，而是操作一个代表元素索引的数组 indices。
  const indices = Array.from({ length: k }, (_, i) => i);

  while (true) {
    // 产出当前组合
    yield indices.map((i) => array[i]!);

    // 计算下一个组合的索引
    // 在产出当前组合后，我们需要更新 indices 数组，使其指向下一个组合。
    // 寻找可增加的索引:
    //   我们从 indices 数组的最右边开始检查 (i = k - 1)。
    //   n - k + i 代表了索引 i 所能达到的最大值。
    //     例如，对于 C(4, 3)，indices 是 [0, 1, 2]，n=4, k=3。
    //       对于 i=2 (最右边)，它的最大值是 4 - 3 + 2 = 3。
    //       对于 i=1，它的最大值是 4 - 3 + 1 = 2。
    //   while 循环会从右向左寻找第一个没有达到其最大值的索引位置。
    // 终止条件:
    //   如果循环结束后 i < 0，意味着所有索引都达到了它们的最大值。
    //   这表示所有组合都已生成完毕，我们用 break 退出 while (true) 循环。
    let i = k - 1;
    while (i >= 0 && indices[i] === n - k + i) {
      i--;
    }
    if (i < 0) {
      break;
    }

    // 更新索引数组
    // indices[i]++: 将我们找到的那个可以增加的索引值加 1。
    // for (let j = i + 1; j < k; j++): 对于该索引右侧的所有其他索引，我们需要将它们重置。
    // indices[j] = indices[j - 1] + 1: 将它们设置为其左边邻居索引值加 1。这确保了新的组合是字典序中的下一个，并且索引是递增的。
    indices[i]!++;
    for (let j = i + 1; j < k; j++) {
      indices[j] = indices[j - 1]! + 1;
    }
  }
}

/**
 * 从数组中选择 `k` 个元素（允许重复）的所有组合
 * @param array 输入数组
 * @param k 组合的元素数量
 * @returns 生成器，依次产生所有可能的组合
 */
export function* combinationsWithReplacement<T>(array: T[], k: number): Generator<T[]> {
  const n = array.length;

  if (!Number.isInteger(k)) {
    throw new TypeError(`k must be an integer, but got ${k}`);
  }

  if (k < 0) {
    return;
  }

  const indices = Array.from({ length: k }, () => 0);

  while (true) {
    yield indices.map((i) => array[i]!);

    let i = k - 1;
    while (i >= 0 && indices[i] === n - 1) {
      i--;
    }
    if (i < 0) {
      break;
    }

    indices[i]!++;
    for (let j = i + 1; j < k; j++) {
      indices[j] = indices[i]!;
    }
  }
}

/**
 * 从数组中生成 `k` 个元素的所有排列。
 * 这是一个非递归的实现，使用了 Steinhaus-Johnson-Trotter 算法的一种变体，该算法可以有效地生成所有排列。
 * AI 写的，我也看不懂（
 * @param array 输入数组
 * @param k 排列的元素数量
 * @returns 生成器，依次产生所有可能的排列
 */
export function* permutations<T>(array: T[], k: number): Generator<T[]> {
  const n = array.length;

  if (!Number.isInteger(k)) {
    throw new TypeError(`k must be an integer, but got ${k}`);
  }

  if (k > n || k < 0) {
    return;
  }

  // 索引数组，初始为 [0, 1, ..., n-1]
  const indices = Array.from({ length: n }, (_, i) => i);
  // 周期数组，用于控制交换。cycles[i] 的值表示在第 i 个位置上，元素还能移动多少次。
  // 初始值为 [n, n-1, ..., n-k+1]
  const cycles = Array.from({ length: k }, (_, i) => n - i);

  // 产出初始排列的前 k 个元素
  yield indices.slice(0, k).map((i) => array[i]!);

  while (true) {
    // 从右向左遍历排列的前 k 个位置
    let i = k - 1;
    while (i >= 0) {
      // 当前位置的周期减一
      cycles[i]!--;
      if (cycles[i]! === 0) {
        // 如果当前位置的周期结束，则将该位置的索引移到末尾，并重置周期。
        // 这相当于完成了一个子排列的完整循环。
        const removed = indices.splice(i, 1)[0]!;
        indices.push(removed);
        cycles[i] = n - i;
        // 继续向左检查下一个位置
        i--;
      } else {
        // 如果周期未结束，则进行交换。
        // j 是一个基于当前周期的偏移量，用于确定与哪个索引进行交换。
        const j = cycles[i]!;
        // 交换索引 i 和索引 n-j 的元素。
        [indices[i], indices[n - j]] = [indices[n - j]!, indices[i]!];
        // 产出新的排列
        yield indices.slice(0, k).map((idx) => array[idx]!);
        // 完成一次交换和产出后，跳出内层循环，等待下一次调用 next()
        break;
      }
    }
    // 如果 i < 0，意味着所有位置的周期都已经完成，所有排列已生成完毕。
    if (i < 0) {
      break;
    }
  }
}
