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
          const data = docSnap.data();
          // 만약 hourlyBreakdown이 없다면 기본값 추가 (이전 데이터 호환용)
          if (!data.hourlyBreakdown) {
            data.hourlyBreakdown = DEFAULT_PRICING.hourlyBreakdown;
          }
          setPricing(data);
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

  const handleBreakdownChange = (key, value) => {
    const numValue = Number(value);
    setPricing((prev) => {
      const updatedBreakdown = { ...prev.hourlyBreakdown, [key]: numValue };
      const newHourlyRate = updatedBreakdown.minimumWage + updatedBreakdown.overhead + updatedBreakdown.margin;
      return {
        ...prev,
        hourlyBreakdown: updatedBreakdown,
        hourlyRate: newHourlyRate
      };
    });
  };

  const handleSetupCostChange = (key, value) => {
    setPricing((prev) => {
      const updated = { ...prev };
      updated.setupCostTiers[key].cost = Number(value);
      return updated;
    });
  };

  // UPH ➔ 개당 단가로 보여주고 저장할 때 다시 UPH로 변환하는 함수
  const handleUnitPriceChange = (category, subCategory, key, value) => {
    const unitPrice = Number(value);
    if (unitPrice > 0) {
      setPricing((prev) => {
        const updated = { ...prev };
        // 개당 단가 = 시급 / UPH
        // UPH = 시급 / 개당 단가
        const newUph = prev.hourlyRate / unitPrice;
        updated[category][subCategory][key] = newUph;
        return updated;
      });
    }
  };

  // 렌더링용: UPH를 개당 단가로 변환
  const getUnitPrice = (uph) => {
    if (!uph || uph === 0) return 0;
    return Math.round(pricing.hourlyRate / uph);
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
        <p>각 공정별 <strong>개당 단가(원)</strong>를 직관적으로 입력할 수 있습니다. 입력된 단가와 시급을 바탕으로 시스템이 자동으로 계산합니다.</p>
      </div>

      <div className="admin-pricing-container">
        
        {/* 목표 시급 상세 설정 패널 */}
        <div className="pricing-panel">
          <h3>🕒 기준 시급 및 기본 세팅비</h3>
          <p className="panel-desc">
            모든 단가 계산의 베이스가 되는 시급입니다. 각 구성요소를 수정하면 <strong>합계 시급</strong>이 자동 계산됩니다.
          </p>
          
          <div className="form-group-row" style={{ marginBottom: '16px' }}>
            <div className="form-group">
              <label>1. 최저임금 기준 (원)</label>
              <input 
                type="number" 
                value={pricing.hourlyBreakdown.minimumWage} 
                onChange={(e) => handleBreakdownChange('minimumWage', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>2. 간접비 (원)</label>
              <input 
                type="number" 
                value={pricing.hourlyBreakdown.overhead} 
                onChange={(e) => handleBreakdownChange('overhead', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>3. 마진 (원)</label>
              <input 
                type="number" 
                value={pricing.hourlyBreakdown.margin} 
                onChange={(e) => handleBreakdownChange('margin', e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <label style={{ color: '#1d4ed8', fontWeight: '800' }}>총 목표 시급 합계</label>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b' }}>
                {pricing.hourlyRate.toLocaleString()} 원
              </div>
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label>소량 작업 세팅비 (999개 이하)</label>
              <input 
                type="number" 
                value={pricing.setupCostTiers[0].cost} 
                onChange={(e) => handleSetupCostChange(0, e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="pricing-panel">
          <h3>📦 공정별 개당 단가 설정 (원)</h3>
          <p className="panel-desc">
            실제로 고객에게 청구할 공정별 <strong>1개당 단가</strong>를 입력하세요. 내부적으로는 <strong>[시급 ÷ 입력하신 단가]</strong> 공식을 통해 시간당 처리수량(UPH)으로 자동 저장됩니다.
          </p>
          
          <div className="uph-grid">
            <div className="uph-section">
              <h4>1. 담다 (Kitting & Packing)</h4>
              <div className="form-group">
                <label>1종 (단순 합포장) - 개당 단가</label>
                <input type="number" value={getUnitPrice(pricing.uph.itemCount.simple)} onChange={(e) => handleUnitPriceChange('uph', 'itemCount', 'simple', e.target.value)} />
              </div>
              <div className="form-group">
                <label>2종 (일반 키팅) - 개당 단가</label>
                <input type="number" value={getUnitPrice(pricing.uph.itemCount.normal)} onChange={(e) => handleUnitPriceChange('uph', 'itemCount', 'normal', e.target.value)} />
              </div>
              <div className="form-group">
                <label>3종 이상 (다양한 구성품) - 개당 단가</label>
                <input type="number" value={getUnitPrice(pricing.uph.itemCount.complex)} onChange={(e) => handleUnitPriceChange('uph', 'itemCount', 'complex', e.target.value)} />
              </div>
            </div>

            <div className="uph-section">
              <h4>2. 붙이다 (Attaching)</h4>
              <div className="form-group">
                <label>일반 스티커 부착 - 개당 단가</label>
                <input type="number" value={getUnitPrice(pricing.uph.attach.normal)} onChange={(e) => handleUnitPriceChange('uph', 'attach', 'normal', e.target.value)} />
              </div>
              <div className="form-group">
                <label>정밀 부착 (위치/각도 중요) - 개당 단가</label>
                <input type="number" value={getUnitPrice(pricing.uph.attach.precision)} onChange={(e) => handleUnitPriceChange('uph', 'attach', 'precision', e.target.value)} />
              </div>
            </div>

            <div className="uph-section">
              <h4>3. 만들다 (Assembling)</h4>
              <div className="form-group">
                <label>일반 종이 상자 조립 - 개당 단가</label>
                <input type="number" value={getUnitPrice(pricing.uph.boxType.normal)} onChange={(e) => handleUnitPriceChange('uph', 'boxType', 'normal', e.target.value)} />
              </div>
              <div className="form-group">
                <label>조립형 골판지 상자 - 개당 단가</label>
                <input type="number" value={getUnitPrice(pricing.uph.boxType.folding)} onChange={(e) => handleUnitPriceChange('uph', 'boxType', 'folding', e.target.value)} />
              </div>
              <div className="form-group">
                <label>고급 싸바리 세팅 - 개당 단가</label>
                <input type="number" value={getUnitPrice(pricing.uph.boxType.hard)} onChange={(e) => handleUnitPriceChange('uph', 'boxType', 'hard', e.target.value)} />
              </div>
            </div>
            
            <div className="uph-section">
              <h4>4. 출고 (Out Packing)</h4>
              <div className="form-group">
                <label>개별 택배 포장 - 개당 단가</label>
                <input type="number" value={getUnitPrice(pricing.uph.outPacking.courier)} onChange={(e) => handleUnitPriceChange('uph', 'outPacking', 'courier', e.target.value)} />
              </div>
              <div className="form-group">
                <label>대형 외박스 합포장 - 개당 단가</label>
                <input type="number" value={getUnitPrice(pricing.uph.outPacking.outerBox)} onChange={(e) => handleUnitPriceChange('uph', 'outPacking', 'outerBox', e.target.value)} />
              </div>
              <div className="form-group">
                <label>팔레트 단위 래핑 납품 - 개당 단가</label>
                <input type="number" value={getUnitPrice(pricing.uph.outPacking.pallet)} onChange={(e) => handleUnitPriceChange('uph', 'outPacking', 'pallet', e.target.value)} />
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
