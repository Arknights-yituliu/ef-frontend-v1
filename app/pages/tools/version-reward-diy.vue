<script setup lang="ts">
import type { RewardStatisticsResultDetail } from '#shared/types/gacha-calculator';

import { calculateDaysDifference, countTuesdaysBetweenV2 } from '#shared/utils/gacha-calculator';

import { numberFloor } from '#shared/utils/numberUtil';

import { ref, onMounted, watch } from 'vue';

import { activityReward } from '@/custom/core/gacha/activityReward';

import { AICQuotaReward, createVersionDailyReward } from '@/custom/core/gacha/dailyReward';

import {
    authorityLevelTaskRewards,
    authorityLevelUpReward,
    authorityLevelUpRewardTable,
    worldLevelReward,
} from '@/custom/core/gacha/levelReward';

import {
    operationalManualNodeReward,
    operationalManualReward,
} from '@/custom/core/gacha/operationalManualReward';

import {
    factoryManualReward,
    factoryManualRewardMax,
    intelArchiveReward,
    otherRewardTable,
} from '@/custom/core/gacha/otherReward';

import {
    beginnerSignInTaskReward,
    beginnerTicketgachaSpecialSingleTaskReward,
    etchSpaceSalvageReward,
    newHorizonsTaskReward,
    valleyIVTaskRewardTable,
    wulingTaskRewardTable,
} from '@/custom/core/gacha/permanentReward';

import {
    valleyIVAuryleneCollectReward,
    valleyIVAuryleneCollectStageTable,
    valleyIVBattleCrateReward,
    valleyIVBattleCrateRewardMax,
    valleyIVCrateReward,
    valleyIVCrateRewardMax,
    valleyIVDefenseConstructionReward,
    valleyIVDeltaBotReward,
    valleyIVDeltaBotRewardMax,
    valleyIVRegionalDevelopmentReward,
    valleyIVRegionalStockBillStoreReward,
    valleyIVSimulationReward,
} from '@/custom/core/gacha/valleyIVRegionalReward';
import { wulingRegionalAllRewardTable } from '@/custom/core/gacha/wulingRegionalReward';

// 控制台数据 - 初始化时使用默认图片
const controlPanel = ref({
    title: '',
    versionName: '新潮起·故渊离',
    updateDate: '2026-03-05',
    otherInfo: '部分资源为估算，仅供参考',
    kvImage: 'https://cos.yituliu.cn/endfield/other/kv-v1.1.webp',
});

// 组件挂载时从localStorage读取保存的数据
onMounted(() => {
    console.log('=== onMounted 开始执行 ===');

    // 检查localStorage是否可用
    if (typeof localStorage !== 'undefined') {
        console.log('localStorage 可用');
        try {
            // 读取图片
            const hasImage = localStorage.getItem('version-reward-kv-image');
            console.log('从localStorage读取的图片:', hasImage ? `找到图片 (长度: ${hasImage.length})` : '未找到图片');

            if (hasImage) {
                console.log('更新kvImage');
                controlPanel.value.kvImage = hasImage;
                console.log('当前kvImage值的前50个字符:', controlPanel.value.kvImage.substring(0, 50));
            } else {
                console.log('localStorage中没有保存的图片，使用默认图片');
            }

            // 读取标题
            const savedTitle = localStorage.getItem('version-reward-title');
            if (savedTitle) {
                console.log('读取到标题:', savedTitle);
                controlPanel.value.title = savedTitle;
            }

            // 读取版本名称
            const savedVersionName = localStorage.getItem('version-reward-version-name');
            if (savedVersionName) {
                console.log('读取到版本名称:', savedVersionName);
                controlPanel.value.versionName = savedVersionName;
            }

            // 读取更新日期
            const savedUpdateDate = localStorage.getItem('version-reward-update-date');
            if (savedUpdateDate) {
                console.log('读取到更新日期:', savedUpdateDate);
                controlPanel.value.updateDate = savedUpdateDate;
            }

            // 读取其他说明
            const savedOtherInfo = localStorage.getItem('version-reward-other-info');
            if (savedOtherInfo) {
                console.log('读取到其他说明:', savedOtherInfo);
                controlPanel.value.otherInfo = savedOtherInfo;
            }
        } catch (err) {
            console.error('从localStorage读取数据失败:', err);
        }
    } else {
        console.warn('localStorage 不可用');
    }

    console.log('=== onMounted 执行结束 ===');
});

// 监听控制台数据变化，自动保存到localStorage
watch(() => controlPanel.value.title, (newValue) => {
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem('version-reward-title', newValue);
            console.log('✓ 标题已保存到localStorage');
        } catch (err) {
            console.error('✗ 保存标题到localStorage失败:', err);
        }
    }
});

watch(() => controlPanel.value.versionName, (newValue) => {
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem('version-reward-version-name', newValue);
            console.log('✓ 版本名称已保存到localStorage');
        } catch (err) {
            console.error('✗ 保存版本名称到localStorage失败:', err);
        }
    }
});

watch(() => controlPanel.value.updateDate, (newValue) => {
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem('version-reward-update-date', newValue);
            console.log('✓ 更新日期已保存到localStorage');
        } catch (err) {
            console.error('✗ 保存更新日期到localStorage失败:', err);
        }
    }
});

watch(() => controlPanel.value.otherInfo, (newValue) => {
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem('version-reward-other-info', newValue);
            console.log('✓ 其他说明已保存到localStorage');
        } catch (err) {
            console.error('✗ 保存其他说明到localStorage失败:', err);
        }
    }
});

// 图片上传处理
function handleImageUpload(event: Event) {
    console.log('=== handleImageUpload 开始执行 ===');
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    console.log('选择的文件:', file);

    if (file) {
        console.log('文件名:', file.name, '原始文件大小:', file.size);

        // 创建Canvas压缩图片
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
            console.log('图片加载成功，开始压缩');
            console.log('原始图片尺寸:', img.width, 'x', img.height);

            // 设置最大宽度和高度
            const maxWidth = 1920;
            const maxHeight = 1080;

            let width = img.width;
            let height = img.height;

            // 计算缩放比例
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = width * ratio;
                height = height * ratio;
                console.log('缩放后的尺寸:', width, 'x', height);
            }

            canvas.width = width;
            canvas.height = height;

            // 绘制并压缩
            ctx?.drawImage(img, 0, 0, width, height);

            // 压缩为JPEG，质量0.7
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            console.log('压缩后数据长度:', compressedDataUrl.length, '约', (compressedDataUrl.length / 1024 / 1024).toFixed(2), 'MB');

            controlPanel.value.kvImage = compressedDataUrl;

            // 保存到localStorage
            try {
                localStorage.setItem('version-reward-kv-image', compressedDataUrl);
                console.log('✓ 图片已成功保存到localStorage');

                // 验证保存是否成功
                const saved = localStorage.getItem('version-reward-kv-image');
                console.log('验证保存:', saved ? '成功' : '失败');
                if (saved) {
                    console.log('保存的数据长度:', saved.length);
                }
            } catch (err: any) {
                console.error('✗ 保存图片到localStorage失败:', err.message);

                // 如果压缩后还是太大，尝试更低的压缩率
                if (err.name === 'QuotaExceededError') {
                    console.log('尝试更低的压缩率（0.5）...');
                    try {
                        const lowerQuality = canvas.toDataURL('image/jpeg', 0.5);
                        console.log('更低保真压缩后数据长度:', lowerQuality.length, '约', (lowerQuality.length / 1024 / 1024).toFixed(2), 'MB');
                        localStorage.setItem('version-reward-kv-image', lowerQuality);
                        console.log('✓ 图片已保存到localStorage（低质量）');
                        controlPanel.value.kvImage = lowerQuality;
                    } catch (err2: any) {
                        console.error('✗ 低质量压缩也失败了:', err2.message);
                        alert('图片太大，无法保存到localStorage。请使用小于2MB的图片。');
                    }
                }
            }
        };

        img.onerror = () => {
            console.error('图片加载失败');
            alert('图片加载失败，请尝试其他图片。');
        };

        img.src = URL.createObjectURL(file);
    } else {
        console.log('没有选择文件');
    }
    console.log('=== handleImageUpload 执行结束 ===');
}

const versionReward = ref<Reward[]>([]);

const currentVersionRewardTotal = ref<RewardStatisticsResultDetail[]>([]);

const versionTime = [
    {
        start: new Date('2026/01/22 12:00:00'),
        end: new Date('2026/03/12 12:00:00'),
        version: '零号委托',
    },
    {
        start: new Date('2026/03/12 12:00:00'),
        end: new Date('2026/04/16 12:00:00'),
        version: '新潮起·故渊离',
    },
];

for (const item of versionTime) {
    const rewards = createVersionDailyReward(item.start, item.end, item.version);
    versionReward.value.push(rewards[0] as Reward, rewards[1] as Reward);
}

for (const reward of AICQuotaReward.value) {
    versionReward.value.push(reward);
}

for (const reward of activityReward.value) {
    versionReward.value.push(reward);
}

for (const reward of otherRewardTable.value) {
    versionReward.value.push(reward);
}

versionReward.value.push(factoryManualReward.value);

for (const reward of intelArchiveReward.value) {
    versionReward.value.push(reward);
}

versionReward.value.push(
    valleyIVAuryleneCollectReward.value,
    valleyIVCrateReward.value,
    valleyIVBattleCrateReward.value,
    valleyIVDeltaBotReward.value,
    valleyIVRegionalDevelopmentReward.value,
    valleyIVRegionalStockBillStoreReward.value,
    valleyIVSimulationReward.value,
);

for (const reward of valleyIVDefenseConstructionReward.value) {
    versionReward.value.push(reward);
}

for (const reward of wulingRegionalAllRewardTable) {
    versionReward.value.push(reward);
}

for (const reward of authorityLevelTaskRewards.value) {
    versionReward.value.push(reward);
}

versionReward.value.push(
    authorityLevelUpReward.value,
    worldLevelReward.value,
    beginnerSignInTaskReward.value,
);

for (const reward of newHorizonsTaskReward.value) {
    versionReward.value.push(reward);
}

for (const reward of beginnerTicketgachaSpecialSingleTaskReward.value) {
    versionReward.value.push(reward);
}

for (const reward of etchSpaceSalvageReward.value) {
    versionReward.value.push(reward);
}

for (const reward of valleyIVTaskRewardTable.value) {
    versionReward.value.push(reward);
}

for (const reward of wulingTaskRewardTable.value) {
    versionReward.value.push(reward);
}

for (const reward of operationalManualReward.value) {
    versionReward.value.push(reward);
}

versionReward.value.push(operationalManualNodeReward.value);

const currentVersionReward = ref<Reward[]>([]);

function filterRewardByVersion(version: any) {
    const daysDiff = calculateDaysDifference(version.start, version.end);

    currentVersionRewardTotal.value = [];
    currentVersionReward.value = [];
    const result1: RewardStatisticsResultDetail = {
        name: '零氪',
        originiumRecharge: 3,
        diamond: 0,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 0,
        totalPulls: 0,
    };

    const result2: RewardStatisticsResultDetail = {
        name: '月卡',
        originiumRecharge: 3,
        diamond: numberFloor(daysDiff) * 200,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 0,
        totalPulls: 0,
    };

    const result3: RewardStatisticsResultDetail = {
        name: '月卡+通行证',
        originiumRecharge: 3 + 36,
        diamond: numberFloor(daysDiff) * 200,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 0,
        totalPulls: 0,
    };

    for (const reward of versionReward.value) {
        if (controlPanel.value.versionName === reward.version) {
            currentVersionReward.value.push(reward);
        }
    }

    for (const reward of currentVersionReward.value) {
        result1.originiumRecharge += reward.content.originiumRecharge;
        result1.diamond += reward.content.diamond;
        result1.ticketgachaStandardSingle += reward.content.ticketgachaStandardSingle;
        result1.ticketgachaSpecialSingle += reward.content.ticketgachaSpecialSingle;
    }

    result2.originiumRecharge += result1.originiumRecharge;
    result2.diamond += result1.diamond;
    result2.ticketgachaStandardSingle += result1.ticketgachaStandardSingle;
    result2.ticketgachaSpecialSingle += result1.ticketgachaSpecialSingle;

    result3.originiumRecharge += result1.originiumRecharge;
    result3.diamond += result1.diamond;
    result3.ticketgachaStandardSingle += result1.ticketgachaStandardSingle;
    result3.ticketgachaSpecialSingle += result1.ticketgachaSpecialSingle;

    result1.totalPulls =
        result1.originiumRecharge * 0.15 + result1.diamond / 500 + result1.ticketgachaSpecialSingle;
    result2.totalPulls =
        result2.originiumRecharge * 0.15 + result2.diamond / 500 + result2.ticketgachaSpecialSingle;
    result3.totalPulls =
        result3.originiumRecharge * 0.15 + result3.diamond / 500 + result3.ticketgachaSpecialSingle;

    currentVersionRewardTotal.value.push(result1, result2, result3);
}

filterRewardByVersion(versionTime[1]);
</script>
<template>
    <div class="version-reward-diy-container">
        <!-- 左侧绘图区 -->
        <div class="canvas-area">
            <!-- 头图 -->
            <img alt="" class="version-reward-bg-kv" :src="controlPanel.kvImage" />
            <!-- 等高线背景 -->
            <div class="contour-bg">
                <img alt="Map Background" src="~/assets/svg/map-bg.svg">
            </div>
            <!-- 内容区 -->
            <div id="rewards-area">
                <div id="title-area">
                    <!-- 大标题 -->
                    <div class="title-background"></div>
                    <div class="title-section">
                        <h1 v-if="controlPanel.title" class="main-title">{{ controlPanel.title }}</h1>
                    </div>

                    <!-- 版本名称 -->
                    <div class="version-section">
                        <h2 class="version-title">{{ controlPanel.versionName }}</h2>
                    </div>

                    <!-- 其他文本（更新日期和说明） -->
                    <div class="info-section">
                        <div v-if="controlPanel.updateDate" class="info-item">
                            更新日期：{{ controlPanel.updateDate }}
                        </div>
                        <div v-if="controlPanel.otherInfo" class="info-item">
                            {{ controlPanel.otherInfo }}
                        </div>
                    </div>
                </div>
                <div class="version-reward-item-group">
                    <div v-for="reward in currentVersionReward" class="version-reward-item">
                        <div>
                            <!-- <div class="version-reward-item-bar red-bar"></div> -->
                            <div class="version-reward-item-bar yellow-bar"></div>
                            <!-- <div class="version-reward-item-bar blue-bar"></div> -->
                        </div>
                        <div class="version-reward-item-name">{{ reward.name.zh }}</div>
                        <div v-show="reward.content.originiumRecharge > 0" class="version-reward-item-content">
                            <img alt="existing" class="version-reward-item-icon"
                                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp" />X
                            {{ reward.content.originiumRecharge }}
                        </div>
                        <div v-show="reward.content.diamond > 0" class="version-reward-item-content">
                            <img alt="existing" class="version-reward-item-icon"
                                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp" />X
                            {{ reward.content.diamond }}
                        </div>
                        <div v-show="reward.content.ticketgachaStandardSingle > 0" class="version-reward-item-content">
                            <img alt="existing" class="version-reward-item-icon"
                                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp" />X
                            {{ reward.content.ticketgachaStandardSingle }}
                        </div>
                        <div v-show="reward.content.ticketgachaSpecialSingle > 0" class="version-reward-item-content">
                            <img alt="existing" class="version-reward-item-icon"
                                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp" />X
                            {{ reward.content.ticketgachaSpecialSingle }}
                        </div>
                    </div>
                </div>
                <!-- 统计区 -->
                <div class="version-reward-result-group">
                    <div v-for="result in currentVersionRewardTotal" class="version-reward-result">
                        <div class="reward-result-border">
                            <div class="version-reward-result-color-border red-bg"></div>
                            <div class="version-reward-result-color-border yellow-bg"></div>
                            <div class="version-reward-result-color-border blue-bg"></div>
                        </div>
                        <div class="reward-result-text">
                            <div class="version-reward-result-name">{{ result.name }}</div>
                            <div class="version-reward-result-content">
                                <div class="version-reward-result-content-item">
                                    <img alt="existing" class="version-reward-item-icon"
                                        src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp" />×
                                    {{ result.originiumRecharge }}
                                </div>
                                <div class="version-reward-result-content-item">
                                    <img alt="existing" class="version-reward-item-icon"
                                        src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp" />×
                                    {{ result.diamond }}
                                </div>
                                <div class="version-reward-result-content-item">
                                    <img alt="existing" class="version-reward-item-icon"
                                        src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp" />×
                                    {{ result.ticketgachaStandardSingle }}
                                </div>
                                <div class="version-reward-result-content-item">
                                    <img alt="existing" class="version-reward-item-icon"
                                        src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp" />×
                                    {{ result.ticketgachaSpecialSingle }}
                                </div>
                            </div>
                            <div class="version-reward-result-type">
                                特许寻访
                                <div class="version-reward-result-number">{{ numberFloor(result.totalPulls) - 20 }}抽
                                </div>
                            </div>
                            <div class="version-reward-result-type">
                                限时寻访
                                <div class="version-reward-result-number">20抽</div>
                            </div>
                            <div class="version-reward-result-type">
                                基础寻访
                                <div class="version-reward-result-number">{{ result.ticketgachaStandardSingle }}抽</div>
                            </div>
                        </div>
                    </div>
                    <div id="shield">数据由攒抽计算器自动生成，以实际发放为准，可根据个人情况使用攒抽计算器自行调整</div>
                </div>
            </div>
            <!-- 页脚区 -->
            <div id="version-reward-footer">
                <table class="footer-table">
                    <tr>
                        <td>数据来源：</td>
                        <td>终末地一图流·攒抽计算器</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>https://ef.yituliu.cn/tools/gacha-calculator/</td>
                    </tr>
                    <tr>
                        <td>信息发布：</td>
                        <td>逻辑元LogicalByte@Bilibili</td>
                    </tr>
                </table>
                <img alt="existing"
                    src="https://cos.yituliu.cn/endfield/QR/httpsef.yituliu.cntoolsgacha-calculator.png" />
            </div>
        </div>
        <!-- 右侧控制台 -->
        <div class="control-panel">
            <h2>控制台</h2>

            <!-- 图片上传 -->
            <div class="control-item">
                <label>头图上传 (KV)</label>
                <input type="file" accept="image/*" @change="handleImageUpload" />
                <div v-if="controlPanel.kvImage" class="preview-image">
                    <img :src="controlPanel.kvImage" alt="预览" />
                </div>
            </div>

            <!-- 标题输入 -->
            <div class="control-item">
                <label>标题</label>
                <input v-model="controlPanel.title" type="text" placeholder="请输入标题" />
            </div>

            <!-- 版本名称输入 -->
            <div class="control-item">
                <label>版本名称</label>
                <input v-model="controlPanel.versionName" type="text" placeholder="请输入版本名称" />
            </div>

            <!-- 更新日期输入 -->
            <div class="control-item">
                <label>更新日期</label>
                <input v-model="controlPanel.updateDate" type="date" />
            </div>

            <!-- 其他说明输入 -->
            <div class="control-item">
                <label>其他说明</label>
                <textarea v-model="controlPanel.otherInfo" rows="4" placeholder="请输入其他说明"></textarea>
            </div>
        </div>
    </div>
</template>

<style>
/* ========== 1. 容器 ========== */
.version-reward-diy-container {
    display: flex;
    gap: 20px;
    padding: 20px;
    min-height: 100vh;
    background-color: #f5f5f5;
}

/* ========== 2. 左侧绘图区 ========== */
.canvas-area {
    width: 1080px;
    flex-shrink: 0;
    overflow-x: auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    position: relative;
}

/* ========== 2.1 头图 ========== */
.version-reward-bg-kv {
    width: 1080px;
    height: 540px;
    position: absolute;
    top: 0;
    object-fit: cover;
    object-position: top;
}

/* ========== 2.1.1 等高线背景 ========== */
.contour-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1080px;
    height: 1600px;
    pointer-events: none;
    z-index: 0;
}

.contour-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%) brightness(150%) contrast(80%);
}

/* ========== 2.2 内容区 ========== */
#rewards-area {
    position: relative;
    margin-top: 220px;
    background: linear-gradient(to bottom,
            rgba(255, 250, 0, 0) 0%,
            rgba(255, 250, 0, 1) 320px,
            rgba(216, 216, 216, 0.8) 720px,
            rgba(216, 216, 216, 0));
}

/* ========== 2.2.1 标题区 ========== */
#title-area {
    padding: 40px;
    height: 264px;
}

/* 大标题区块 */
.title-section {
    height: 84px;
    text-align: right;
    position: relative;
}

.title-background {
    position: absolute;
    right: 0;
    top: 30px;
    width: 480px;
    height: 120px;
    background: repeating-linear-gradient(45deg,
            rgba(192, 192, 192, 0.2),
            rgba(192, 192, 192, 0.2) 6px,
            rgba(64, 64, 64, 0.2) 6px,
            rgba(64, 64, 64, 0.2) 12px);
    z-index: 1;
}

/* 版本名称区块 */
.version-section {
    height: 48px;
    width: 400px;
    text-align: right;
    margin-left: auto;
    background-color: black;
    border-top: 6px solid;
    border-image-source: linear-gradient(to right, #ff00f0 0px, #ff00f0 100px, #fffa00 100px, #fffa00 200px, #00ffa2 200px, #00ffa2 300px);
    border-image-slice: 1;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
    position: relative;
    z-index: 2;
}

.main-title {
    font-size: 60px;
    font-weight: bold;
    color: #111;
    text-shadow: 0 0 16px rgba(255, 255, 255, 1);
    position: relative;
    z-index: 1;
}

.version-title {
    font-size: 24px;
    font-weight: bold;
    color: #fffa00;
    margin: 0;
    -webkit-text-stroke: 2px #333;
    paint-order: stroke fill;
}

/* 其他文本区块 */
.info-section {
    height: 60px;
    text-align: right;
    margin-top: 8px;
}

.info-item {
    font-size: 24px;
    font-weight: bold;
    color: #111;
}

/* ========== 2.2.2 奖励项组 ========== */
.version-reward-item-group {
    width: 1080px;
    padding: 0px 36px;
    display: block;
    columns: 2;
    column-gap: 24px;
    column-fill: auto;
    height: 1600px;
    box-sizing: border-box;
}

/* ========== 2.2.2.1 单个奖励项 ========== */
.version-reward-item {
    font-size: 26px;
    height: 64px;
    width: 492px;
    display: flex;
    align-items: center;
    padding: 0 4px;
    margin-bottom: 12px;
    background-color: rgb(32, 32, 32, 0.85);
    color: white;
    break-inside: avoid;
    border-radius: 8px;
}

.version-reward-item-name {
    padding: 0px 0px 0px 12px;
    width: 260px;
    overflow: hidden;
    white-space: nowrap;
}

.version-reward-item-content {
    padding: 0 4px;
    display: flex;
    align-items: center;
}

.version-reward-item-bar {
    height: 24px;
    width: 4px;
}

.version-reward-item-icon {
    width: 48px;
    height: 48px;
}

/* ========== 2.2.3 结果组 ========== */
.version-reward-result-group {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-around;

    #shield {
        font-size: 20px;
        background-color: #ffffff80;
        padding: 4px 12px;
        margin-bottom: 8px;
    }
}

/* ========== 2.2.3.1 单个结果 ========== */
.version-reward-result {
    width: 330px;
    background-color: rgb(32, 32, 32, 0.85);
    color: white;
    height: 288px;
    display: flex;
    margin: 12px 0;
    font-size: 24px;

    .version-reward-result-color-border {
        height: 60px;
        width: 4px;
    }

    .blue-bg.version-reward-result-color-border {
        height: 168px;
    }

    .version-reward-result-name {
        font-size: 32px;
        font-weight: bolder;
    }

    .reward-result-text {
        padding: 12px 20px;

        .version-reward-result-type {
            width: 270px;
            padding: 2px 12px;

            .version-reward-result-number {
                display: inline-block;
                padding-left: 32px;
            }
        }
    }


}

.version-reward-result-content {
    justify-content: flex-start;
    display: flex;
    flex-wrap: wrap;
}

.version-reward-result-content-item {
    width: 139px;
    display: flex;
    align-items: center;
}

/* ========== 2.3 页脚区 ========== */
#version-reward-footer {
    position: relative;
    z-index: 1;
    height: 144px;
    background: linear-gradient(to right, rgba(255, 250, 0, 0.8), rgba(255, 250, 0, 0.3));
    font-size: 28px;
    font-weight: 600;
    color: black;
    display: flex;
    align-items: center;
}

.footer-table {
    margin: 12px 32px 0px;
    flex: 1;
    /* height: 100%; */
    border-collapse: collapse;
    line-height: 1;
}

.footer-table tr:nth-child(1) {
    height: 36px;
}

.footer-table tr:nth-child(2) {
    height: 36px;
}

.footer-table tr:nth-child(3) {
    height: 60px;
}

.footer-table td:first-child {
    width: 96px;
}

.footer-table td:last-child {
    width: 480px;
}

#version-reward-footer img {
    width: 144px;
    height: 144px;
}

/* ========== 3. 右侧控制台 ========== */
.control-panel {
    flex: 1;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    min-width: 300px;
}

.control-panel h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #333;
    border-bottom: 2px solid #fffa00;
    padding-bottom: 10px;
}

.control-item {
    margin-bottom: 20px;
}

.control-item label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #555;
}

.control-item input[type="text"],
.control-item input[type="date"],
.control-item textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
}

.control-item input[type="file"] {
    width: 100%;
    padding: 10px;
    border: 1px dashed #ddd;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
}

.control-item input[type="file"]:hover {
    border-color: #fffa00;
}

.preview-image {
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
}

.preview-image img {
    width: 100%;
    height: auto;
    display: block;
}

/* ========== 4. 颜色工具类 ========== */
.yellow-bg {
    background-color: #fffa00;
}

.green-bg {
    background-color: #00ffa2;
}

.blue-bg {
    background-color: #00ffff;
}

.red-bg {
    background-color: #f44336;
}

/* ========== 5. 其他未使用的样式 ========== */
.version-reward-bg {
    background:
        linear-gradient(to bottom, rgba(255, 250, 0, 1) 100px, rgba(50, 50, 50, 0.1) 600px),
        url('https://cos.yituliu.cn/endfield/other/bg-1.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding-top: 400px;
    width: 1080px;
    margin: auto;
    font-size: 24px;
    overflow: hidden;
    position: relative;
}

.version-reward-title-image {
    width: 700px;
    position: absolute;
    top: 180px;
    right: 0;
}

.version-reward-bg-bottom-bar {
    display: flex;
}

.version-reward-bg-bottom-bar-1 {
    background-color: #bfbfbf;
    width: 20%;
    height: 10px;
}

.version-reward-bg-bottom-bar-2 {
    background-color: #ff00f0;
    width: 10%;
    height: 10px;
}

.version-reward-bg-bottom-bar-3 {
    background-color: #fffa00;
    width: 10%;
    height: 10px;
}

.version-reward-bg-bottom-bar-4 {
    background-color: #00ffa2;
    width: 10%;
    height: 10px;
}

.version-reward-bg-bottom-bar-5 {
    background-color: #bfbfbf;
    width: 50%;
    height: 10px;
}
</style>