import React, { useState, useEffect } from 'react';
import './ScamWarningBanner.css';

const ScamWarningBanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [doNotShowToday, setDoNotShowToday] = useState(false);

  useEffect(() => {
    const hideUntil = localStorage.getItem('hideScamPopupUntil');
    const now = Date.now();
    if (!hideUntil || now > parseInt(hideUntil, 10)) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (doNotShowToday) {
      const hideUntil = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('hideScamPopupUntil', hideUntil.toString());
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="scam-modal-overlay" role="dialog" aria-modal="true">
      <div className="scam-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="scam-modal-header">
          <div className="scam-modal-badge">🚨 긴급 사칭 사기 주의 공지</div>
          <h3>‘수작업팩토리’ 사칭 재택 부업 및 대표번호 개통 사기 주의</h3>
          <button
            type="button"
            className="scam-modal-x"
            onClick={handleClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="scam-modal-body">
          <div className="scam-alert-box">
            최근 네이버 쪽지·카페·카카오톡 오픈채팅을 통해 당사(<strong>수작업팩토리 / 이룸디자인</strong>)를 사칭하여{' '}
            <strong>‘자택 근무 단순포장 부업(손부업)’</strong>을 미끼로 접근한 뒤,{' '}
            <strong className="scam-red-underline">개인 명의의 대표번호(1577, 1588, 1599, 1661 등) 개통을 유도</strong>하는 보이스피싱 범죄가 발생하고 있습니다.
          </div>

          <div className="scam-pattern-section">
            <h4>⚠️ 아래와 같은 안내는 100% 당사를 사칭한 사기입니다!</h4>
            <ul className="scam-pattern-list">
              <li>
                <span className="pattern-tag">수법 1</span>
                <div>
                  <strong>“자택에서 근무하는 단순포장 외근직/개인외주(일급 10만 원 이상 당일 지급)로 등록해 준다”</strong>며 카카오톡 오픈채팅으로 유인
                </div>
              </li>
              <li>
                <span className="pattern-tag">수법 2</span>
                <div>
                  <strong>“개인 외주 전산 등록을 위해 1577 / 1588 / 1599 / 1661 등 대표번호(안심번호)를 본인 명의로 발급받아야 물건을 배송해 줄 수 있다”</strong>고 요구
                </div>
              </li>
              <li>
                <span className="pattern-tag">수법 3</span>
                <div>
                  <strong>“통신요금 명목으로 매월 20만 원을 고정 지원하며, 남은 차액은 식대 등 자유롭게 써도 된다”</strong>며 번호 개통을 유도
                </div>
              </li>
            </ul>
          </div>

          <div className="scam-fact-box">
            <h4>✅ 수작업팩토리 공식 안내</h4>
            <p>
              • 당사는 <strong>자택 단순포장 부업(손부업) 아르바이트를 일절 모집하지 않으며</strong>, 어떠한 경우에도 개인에게 대표번호(안심번호) 개통을 요구하지 않습니다.
            </p>
            <p>
              • 사기범의 안내에 따라 본인 명의로 대표번호를 개통해 넘길 경우 <strong>보이스피싱 범죄(대포폰)에 악용되어 형사 처벌 및 통신비 피해</strong>를 입을 수 있으니 절대 응하지 마시고 <strong>즉시 경찰(112)에 신고</strong>해 주시기 바랍니다.
            </p>
          </div>
        </div>

        <div className="scam-modal-footer">
          <label className="scam-today-check">
            <input
              type="checkbox"
              checked={doNotShowToday}
              onChange={(e) => setDoNotShowToday(e.target.checked)}
            />
            <span>오늘 하루 열지 않기</span>
          </label>
          <button
            type="button"
            className="scam-modal-confirm-btn"
            onClick={handleClose}
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScamWarningBanner;
