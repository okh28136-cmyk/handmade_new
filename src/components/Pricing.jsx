import React from 'react';
import './Pricing.css';

const Pricing = () => {
  // 3개의 벤토 박스를 위한 데이터 구성 (담다, 붙이다, 보내다)
  const bentoData = [
    {
      id: 'pack',
      icon: '📦',
      title: '담기',
      desc: '포장부터 세트 구성까지 기본 작업',
      items: [
        { id: 1, name: '단순 OPP 포장', price: '60원' },
        { id: 2, name: '박스 조립 및 포장', price: '200원' },
        { id: 3, name: '세트 상품 구성', price: '상담후결정' },
      ]
    },
    {
      id: 'attach',
      icon: '🏷️',
      title: '붙이기',
      desc: '라벨링 및 스티커 세밀 작업',
      items: [
        { id: 4, name: '바코드 라벨링', price: '60원' },
        { id: 5, name: '양면 테이프 부착', price: '60원' },
        { id: 6, name: '봉인 스티커 작업', price: '별도 문의' },
      ]
    },
    {
      id: 'send',
      icon: '🚚',
      title: '보내기',
      desc: '우편부터 대량 지점 배송까지 완벽하게',
      items: [
        { id: 7, name: 'DM 발송', price: '상담 후 결정' },
        { id: 8, name: '택배 발송', price: '건당 최저가' },
        { id: 9, name: '지점별 배송', price: '맞춤 견적' },
      ]
    }
  ];

  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">PRICING</h2>
          <p className="section-subtitle">합리적이고 투명한 3단계 수작업 비용 가이드</p>
        </div>

        {/* 벤토(Bento) 그리드 레이아웃 */}
        <div className="bento-grid">
          {bentoData.map((bento) => (
            <div key={bento.id} className={`bento-box bento-${bento.id}`}>
              <div className="bento-header">
                <div className="bento-title-wrapper">
                  <h3 className="bento-title">{bento.title}</h3>
                  <p className="bento-desc">{bento.desc}</p>
                </div>
              </div>
              <ul className="bento-list">
                {bento.items.map(item => (
                  <li key={item.id} className="bento-list-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pricing-notice">
          <p>* 위 단가는 기본 가이드라인이며, 작업 난이도 및 수량에 따라 최종 단가가 변동될 수 있습니다.</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
