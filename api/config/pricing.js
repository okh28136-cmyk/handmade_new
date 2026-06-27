export const PRICING_CONFIG = {
  hourlyRate: 15000, // 타겟 시급 (최저시급 + 간접비/마진)
  hourlyBreakdown: {
    minimumWage: 10030,
    overhead: 2000,
    margin: 2970
  },
  setupCost: 30000,
  uph: {
    itemCount: { 
      simple: 300,  
      normal: 150,  
      complex: 83   
    },
    attach: { 
      normal: 300,  
      precision: 150 
    },
    boxType: { 
      normal: 250,  
      folding: 100, 
      hard: 60      
    },
    outPacking: { 
      courier: 25,   
      outerBox: 375, 
      pallet: 300    
    }
  }
};
