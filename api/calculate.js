import { PRICING_CONFIG } from './config/pricing.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { project, cart } = req.body;
  
  if (!project || !cart) {
    return res.status(400).json({ message: 'Missing project or cart data' });
  }

  const { quantity, weight } = project;
  const pricing = PRICING_CONFIG;
  const hourlyRate = pricing.hourlyRate;

  const quantityNum = parseInt(quantity) || 0;
  const tier = pricing.setupCostTiers.find(t => quantityNum >= t.min && quantityNum <= t.max);
  const C_setup = tier ? tier.cost : (quantityNum > 0 ? 50000 : 0);

  let totalWorkCost = 0;
  let totalPackingCost = 0;
  
  const enrichedCart = cart.map(item => {
    let cost = 0;
    if (item.type === 'outPacking') {
      const uph = pricing.uph.outPacking[item.base];
      cost = uph ? (hourlyRate / uph) : 0;
      totalPackingCost += cost;
    } else {
      let uph = 1;
      if (item.type === 'kitting') uph = pricing.uph.itemCount[item.base];
      if (item.type === 'attach') uph = pricing.uph.attach[item.base];
      if (item.type === 'assemble') uph = pricing.uph.boxType[item.base];
      
      const baseCost = uph ? (hourlyRate / uph) : 0;
      
      let mSum = 1.0;
      if (item.multipliers) {
        Object.values(item.multipliers).forEach(val => {
          mSum += (parseFloat(val) - 1.0);
        });
      }
      cost = baseCost * mSum;
      totalWorkCost += cost;
    }
    return { ...item, calculatedPrice: cost };
  });

  const R_loss = 0.03;
  const weightNum = parseFloat(weight) || 1.0;
  const costWithWeight = totalWorkCost * weightNum;
  const unitPriceWithoutSetup = costWithWeight * (1 + R_loss);
  
  const finalUnitPrice = unitPriceWithoutSetup;
  const totalPrice = (finalUnitPrice * quantityNum) + C_setup;

  return res.status(200).json({
    enrichedCart,
    unitPrice: Math.round(finalUnitPrice),
    totalPrice: Math.round(totalPrice),
    setupCost: C_setup,
    workCost: Math.round(unitPriceWithoutSetup),
    packingCost: Math.round(totalPackingCost)
  });
}
