import type {
  GachaResourceStatisticsResult
} from '#shared/types/gacha-calculator';
import { ref } from 'vue';


export const gachaResourceStatisticsResult = ref<GachaResourceStatisticsResult>({
  totalPulls: {
    existing: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
    daily: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
    regional: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
    activity: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  
    recharge: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
    permanent: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
    archivePermanent: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
    total: {
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
   
    
  },
  rechargeAmount: 0,
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaLimitedSingle: 0,

});




