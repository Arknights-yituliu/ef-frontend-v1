import { ref } from 'vue';
import type {
  GachaResourceStatisticsResult
} from '#shared/types/gacha-calculator';


export const gachaResourceStatisticsResult = ref<GachaResourceStatisticsResult>({
  totalPulls: {
    existing: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    },
    dailyTask: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    },
    activity: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    },
    potential: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    },
    recharge: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    },
    permanent: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    },
    regional: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    },
    total: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    }
  },
  rechargeAmount: 0,
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0

});




