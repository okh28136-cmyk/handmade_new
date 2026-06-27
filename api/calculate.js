import { PRICING_CONFIG } from './config/pricing.js';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAw2ZTmqjqlJoML16Hub9LbDEUP1u7qD5E",
  authDomain: "handmadefactorynew.firebaseapp.com",
  projectId: "handmadefactorynew",
  storageBucket: "handmadefactorynew.firebasestorage.app",
  messagingSenderId: "515632397449",
  appId: "1:515632397449:web:ff89646c5b051664ee5a58",
  measurementId: "G-1644YLRKK3"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { project, cart } = req.body;
  
  if (!project || !cart) {
    return res.status(400).json({ message: 'Missing project or cart data' });
  }

  const { quantity, weight } = project;
  
  // Firestore에서 설정값 불러오기
  let pricing = PRICING_CONFIG;
  try {
    const pricingDoc = await getDoc(doc(db, 'settings', 'pricing'));
    if (pricingDoc.exists()) {
      pricing = pricingDoc.data();
    }
  } catch (error) {
    console.error('Pricing data fetch error:', error);
  }

  const hourlyRate = pricing.hourlyRate;

  const quantityNum = parseInt(quantity) || 0;
  
  // 만약 DB에서 setupCostTiers가 넘어온다면 구버전 호환, 없다면 setupCost 사용
  let C_setup = 0;
  if (quantityNum > 0) {
    if (pricing.setupCost !== undefined) {
      C_setup = pricing.setupCost;
    } else if (pricing.setupCostTiers) {
      const tier = pricing.setupCostTiers.find(t => quantityNum >= t.min && quantityNum <= t.max);
      C_setup = tier ? tier.cost : 0;
    } else {
      C_setup = 30000;
    }
  }

  let totalWorkCost = 0;
  let totalPackingCost = 0;
  
  const enrichedCart = cart.map(item => {
    let cost;
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
