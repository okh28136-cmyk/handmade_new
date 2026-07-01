import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
  const navigate = useNavigate();

  // KCP 심사 및 실제 표준 단가표용 패키지 데이터
  const packages = [
    {
      id: 'pack-basic',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      title: '단순 OPP 포장 패키지',
      desc: '기본적인 비닐(OPP) 포장 및 분류 작업',
      details: '기본수량 1,000개 기준 / 1개당 60원',
      price: 60000,
    },
    {
      id: 'pack-box',
      image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      title: '단상자 조립 및 포장',
      desc: '단상자 조립 후 상품 인서트 및 마감 처리',
      details: '기본수량 1,000개 기준 / 1개당 200원',
      price: 200000,
    },
    {
      id: 'pack-premium',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      title: '프리미엄 세트 포장',
      desc: '다양한 구성품 세팅, 띠지 작업 및 리본 마감',
      details: '기본수량 1,000개 기준 / 1개당 350원',
      price: 350000,
    }
  ];

  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">STANDARD PACKAGE</h2>
        </div>

        <div className="package-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '40px' }}>
          {packages.map((pkg) => (
            <div key={pkg.id} className="package-card" style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <div className="package-img" style={{ height: '200px', overflow: 'hidden' }}>
                <img src={pkg.image} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="package-info" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>{pkg.title}</h3>
                <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '16px' }}>{pkg.desc}</p>
                <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', color: '#374151' }}>
                  {pkg.details}
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#d90429' }}>
                    {pkg.price.toLocaleString()}원
                  </span>
                  <button 
                    onClick={() => navigate(`/payment?amount=${pkg.price}`)}
                    style={{ background: '#111827', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    결제하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="policy-notice" style={{ marginTop: '50px', background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#475569', lineHeight: '1.6' }}>
          <strong style={{ color: '#0f172a', display: 'block', marginBottom: '8px', fontSize: '1rem' }}>📌 배송 및 교환/환불 정책 안내</strong>
          - <strong>배송 안내:</strong> 모든 작업물은 협의된 납기일에 맞춰 택배, 퀵, 또는 화물로 안전하게 배송됩니다. (배송비 별도 협의)<br />
          - <strong>취소/환불 규정:</strong> 본 서비스는 1:1 맞춤형 주문제작 방식입니다. 결제 후 <strong>작업 착수(인쇄/수작업 등)가 시작된 이후에는 단순 변심으로 인한 취소 및 환불이 원칙적으로 절대 불가</strong>합니다.<br />
          - <strong>교환 안내:</strong> 당사의 과실로 인한 작업 불량, 파손 등의 하자가 발생한 경우 상품 수령일로부터 7일 이내에 연락 주시면 100% 무상 재작업 및 교환 처리해 드립니다.<br />
          - 보다 자세한 내용은 결제 페이지 및 하단 <strong>이용약관</strong>, <strong>개인정보처리방침</strong>을 참고해 주시기 바랍니다.
        </div>
      </div>
    </section>
  );
};

export default Pricing;
