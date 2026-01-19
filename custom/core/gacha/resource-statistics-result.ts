import { ref } from 'vue';
import type {
  AllGachaResource,
  GachaResourceStatisticsResult
} from 'shared/types/gacha-calculator';

export const resourceStatisticsResult = ref<GachaResourceStatisticsResult>({
  totalPulls: {
    existingResources: 0,
    dailyResources: 0,
    activityResources: 0,
    potentialResources: 0,
    rechargeResources: 0,
    otherResources: 0,
    allResources: 0,
  },
  rechargeAmount: 0,
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaStandardTen: 0,
  ticketgachaSpecialTen: 0,
});

export const allGachaResource = ref<AllGachaResource>({
  existing: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
  },
  daily: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
  },
  activity: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
  },
  task: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
  },
  permanent: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
  },
  recharge: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
  },
  other: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
  },
});
