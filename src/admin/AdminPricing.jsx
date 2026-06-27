import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AdminLayout from './AdminLayout';
import './AdminPricing.css';
import { PRICING_CONFIG as DEFAULT_PRICING } from '../../api/config/pricing';

const AdminPricing = () => {
  const [loading, setLoading] = useState(true);
  const [pricing, setPricing] = useState(DEFAULT_PRICING);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const docRef = doc(db, 'settings', 'pricing');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPricing(docSnap.data());
        }
      } catch (err) {
        console.error('Error fetching pricing:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'settings', 'pricing'), pricing);
      alert('단가표가 성공적으로 저장되었습니다.');
    } catch (err) {
      console.error('Error saving pricing:', err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleChange = (category, subCategory, key, value) => {
    setPricing((prev) => {
      const updated = { ...prev };
      
      if (!subCategory) {
        // e.g., hourlyRate
        updated[category] = Number(value);
      } else if (category === 'setupCostTiers') {
        // Handle array for setupCostTiers
        updated.setupCostTiers[key].cost = Number(value);
      } else {
        // e.g., uph.itemCount.simple
        updated[category][subCategory][key] = Number(value);
      }
      return updated;
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="page-header">
          <h2>💰 단가 및 견적 설정</h2>
        </div>
        <p style={{ padding: '20px' }}>단가표를 불러오는 중입니다...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <h2>💰 단가 및 견적 설정</h2>
        <p>자동견적 계산에 사용되는 <strong>시간당 목표 시급</strong>과 <strong>공정별 UPH(시간당 처리량)</strong>를 설정합니다.</p>
      </div>

      <div className="admin-pricing-container">
        <div className="pricing-panel">
          <h3>🕒 기준 시급 및 기본 세팅비</h3>
          <p className="panel-desc">모든 단가 계산의 베이스가 되는 시급과 작업 준비(세팅) 고정 비용입니다.</p>
          
          <div className="form-group-row">
            <div className="form-group">
              <label>목표 시급 (원)</label>
              <input 
                type="number" 
                value={pricing.hourlyRate} 
                onChange={(e) => handleChange('hourlyRate', null, null, e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>소량 작업 세팅비 (999개 이하)</label>
              <input 
                type="number" 
                value={pricing.setupCostTiers[0].cost} 
                onChange={(e) => handleChange('setupCostTiers', null, 0, e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="pricing-panel">
          <h3>📦 공정별 UPH (시간당 처리량)</h3>
          <p className="panel-desc">작업자가 1시간 동안 처리할 수 있는 수량(UPH)을 입력하세요. 단가는 <strong>[시급 ÷ UPH]</strong>로 자동 계산됩니다.</p>
          
          <div className="uph-grid">
            <div className="uph-section">
              <h4>1. 담다 (Kitting & Packing)</h4>
              <div className="form-group">
                <label>1종 (단순 합포장)</label>
                <input type="number" value={pricing.uph.itemCount.simple} onChange={(e) => handleChange('uph', 'itemCount', 'simple', e.target.value)} />
              </div>
              <div className="form-group">
                <label>2종 (일반 키팅)</label>
                <input type="number" value={pricing.uph.itemCount.normal} onChange={(e) => handleChange('uph', 'itemCount', 'normal', e.target.value)} />
              </div>
              <div className="form-group">
                <label>3종 이상 (다양한 구성품)</label>
                <input type="number" value={pricing.uph.itemCount.complex} onChange={(e) => handleChange('uph', 'itemCount', 'complex', e.target.value)} />
              </div>
            </div>

            <div className="uph-section">
              <h4>2. 붙이다 (Attaching)</h4>
              <div className="form-group">
                <label>일반 스티커 부착</label>
                <input type="number" value={pricing.uph.attach.normal} onChange={(e) => handleChange('uph', 'attach', 'normal', e.target.value)} />
              </div>
              <div className="form-group">
                <label>정밀 부착 (위치/각도 중요)</label>
                <input type="number" value={pricing.uph.attach.precision} onChange={(e) => handleChange('uph', 'attach', 'precision', e.target.value)} />
              </div>
            </div>

            <div className="uph-section">
              <h4>3. 만들다 (Assembling)</h4>
              <div className="form-group">
                <label>일반 종이 상자 조립</label>
                <input type="number" value={pricing.uph.boxType.normal} onChange={(e) => handleChange('uph', 'boxType', 'normal', e.target.value)} />
              </div>
              <div className="form-group">
                <label>조립형 골판지 상자</label>
                <input type="number" value={pricing.uph.boxType.folding} onChange={(e) => handleChange('uph', 'boxType', 'folding', e.target.value)} />
              </div>
              <div className="form-group">
                <label>고급 싸바리 세팅</label>
                <input type="number" value={pricing.uph.boxType.hard} onChange={(e) => handleChange('uph', 'boxType', 'hard', e.target.value)} />
              </div>
            </div>
            
            <div className="uph-section">
              <h4>4. 출고 (Out Packing)</h4>
              <div className="form-group">
                <label>개별 택배 포장</label>
                <input type="number" value={pricing.uph.outPacking.courier} onChange={(e) => handleChange('uph', 'outPacking', 'courier', e.target.value)} />
              </div>
              <div className="form-group">
                <label>대형 외박스 합포장</label>
                <input type="number" value={pricing.uph.outPacking.outerBox} onChange={(e) => handleChange('uph', 'outPacking', 'outerBox', e.target.value)} />
              </div>
              <div className="form-group">
                <label>팔레트 단위 래핑 납품</label>
                <input type="number" value={pricing.uph.outPacking.pallet} onChange={(e) => handleChange('uph', 'outPacking', 'pallet', e.target.value)} />
              </div>
            </div>
          </div>

          <button className="btn-save-pricing" onClick={handleSave}>
            단가표 저장 및 즉시 반영
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPricing;
