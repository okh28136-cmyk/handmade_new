import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Contact.css';

// ====================================================
// ✅ EmailJS 설정값 (대표님이 직접 채워 넣으셔야 합니다)
// 아래 링크에서 가입 후 값을 확인하세요: https://www.emailjs.com/
// ====================================================
const EMAILJS_SERVICE_ID  = 'service_1tncfue';
const EMAILJS_TEMPLATE_ID = 'template_jjsvsad';
const EMAILJS_PUBLIC_KEY  = 'xAmHtsU9Nfdgoee-t';

const Contact = () => {
  const formRef = useRef(null);
  const [fileName, setFileName] = useState('파일을 첨부하시려면 클릭하세요.');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files.length === 1
        ? e.target.files[0].name
        : `선택된 파일 ${e.target.files.length}개`
      );
    } else {
      setFileName('파일을 첨부하시려면 클릭하세요.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(formRef.current);
    const templateParams = {
      from_company : formData.get('company')  || '(미입력)',
      from_name    : formData.get('name'),
      from_phone   : formData.get('phone'),
      from_email   : formData.get('email'),
      service_type : formData.get('type'),
      amount       : formData.get('amount')   || '(미입력)',
      message      : formData.get('message'),
      to_email     : 'jyy1422@iroum.co.kr',   // 첫 번째 수신 이메일
      to_email2    : 'okh@iroum.co.kr',        // 두 번째 수신 이메일 (템플릿에 {{to_email2}} 추가)
    };

    // ── Firestore 먼저 저장 (이메일 실패와 무관하게 항상 저장)
    let firestoreOk = false;
    try {
      await addDoc(collection(db, 'inquiries'), {
        from_company : templateParams.from_company,
        from_name    : templateParams.from_name,
        from_phone   : templateParams.from_phone,
        from_email   : templateParams.from_email,
        service_type : templateParams.service_type,
        amount       : templateParams.amount,
        message      : templateParams.message,
        status       : 'new',
        memos        : [],
        createdAt    : serverTimestamp(),
      });
      firestoreOk = true;
    } catch (fsErr) {
      console.error('Firestore 저장 오류:', fsErr);
    }

    // ── EmailJS 전송 (실패해도 폼 접수는 완료로 처리)
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
    } catch (mailErr) {
      console.error('EmailJS 전송 오류:', mailErr);
      // 이메일 실패는 사용자에게 표시하지 않음 (Firestore 저장이 완료됐으므로)
    }

    if (firestoreOk) {
      setStatus('success');
      formRef.current.reset();
      setFileName('파일을 첨부하시려면 클릭하세요.');
    } else {
      setStatus('error');
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-wrapper">
          
          {/* 좌측 안내 문구 영역 */}
          <div className="contact-info">
            <span className="contact-tag font-playfair">EXPERT CONSULTATION</span>
            <h2 className="contact-title font-playfair">REQUEST<br/>A QUOTE</h2>
            <p className="contact-desc">
              작업의 난이도, 물량, 일정에 맞는<br/>최적의 단가와 솔루션을 제안해 드립니다.
            </p>
            
            <div className="contact-details">
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <div className="detail-text-group">
                  <span className="detail-label">Address</span>
                  <span className="detail-value-small">서울특별시 중구 필동로9</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">✉️</span>
                <div className="detail-text-group">
                  <span className="detail-label">EMAIL</span>
                  <span className="detail-value-small">jyy1422@iroum.co.kr</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">📞</span>
                <div className="detail-text-group">
                  <span className="detail-label">Direct Line</span>
                  <span className="detail-value-bold">02-2268-7512</span>
                  <span className="detail-sub">Fax: 02-2268-7514</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">🕒</span>
                <div className="detail-text-group">
                  <span className="detail-label">Business Hours</span>
                  <span className="detail-value-small">평일 09:00 - 18:00</span>
                  <span className="detail-sub">점심시간 12:00 - 13:00</span>
                </div>
              </div>
            </div>

            <div className="contact-notice">
              <p>* 방문 상담을 원하실 경우 사전에 전화로 일정을 예약해 주시기 바랍니다.</p>
              <p>* 대량 견적의 경우 샘플을 보내주시면 더 정확한 산출이 가능합니다.</p>
            </div>
          </div>

          {/* 우측 견적 문의 폼 영역 */}
          <div className="contact-form-container">
            <div className="form-header">
              <h3 className="form-title">온라인 견적 문의</h3>
              <p className="form-subtitle">상세 내용을 남겨주시면 담당자가 확인 후 신속히 연락드립니다.</p>
            </div>

            {/* ─── 전송 완료: 큰 성공 화면 ─── */}
            {status === 'success' ? (
              <div className="form-success-screen">
                <div className="success-icon">✅</div>
                <h3 className="success-title">견적 문의가 접수되었습니다!</h3>
                <p className="success-desc">
                  담당자가 확인 후 빠르게 연락드리겠습니다.<br/>
                  평균 응답 시간: <strong>영업일 기준 1일 이내</strong>
                </p>
                <div className="success-summary">
                  <p>📞 긴급 문의: <strong>02-2268-7512</strong></p>
                  <p>💬 카카오톡 채널 상담도 가능합니다</p>
                </div>
                <button className="success-reset-btn" onClick={() => setStatus('')}>
                  새 문의 작성하기
                </button>
              </div>
            ) : (
              <></>
            )}
            {status === 'error' && (
              <div className="form-result form-result--error">
                ❌ 접수 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 전화(02-2268-7512)로 문의해 주세요.
              </div>
            )}

            {/* 성공 상태면 폼 숨기기 */}
            {status !== 'success' && (
              <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company">회사명 <span className="optional">(선택)</span></label>
                  <input type="text" id="company" name="company" placeholder="업체명" />
                </div>
                <div className="form-group">
                  <label htmlFor="name">담당자명 <span className="required">*</span></label>
                  <input type="text" id="name" name="name" placeholder="성함을 입력해주세요" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">연락처 <span className="required">*</span></label>
                  <input type="tel" id="phone" name="phone" placeholder="010-0000-0000" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">이메일 <span className="required">*</span></label>
                  <input type="email" id="email" name="email" placeholder="example@company.com" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">문의 유형 <span className="required">*</span></label>
                  <div className="select-wrapper">
                    <select id="type" name="type" required>
                      <option value="">서비스 선택</option>
                      <option value="담기 (포장)">담기 (포장)</option>
                      <option value="붙이기 (라벨링)">붙이기 (라벨링)</option>
                      <option value="보내기 (물류)">보내기 (물류)</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="amount">예상 물량 <span className="optional">(선택)</span></label>
                  <input type="text" id="amount" name="amount" placeholder="예: 1,000개 / 미정" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">상세 문의 내용 <span className="required">*</span></label>
                <textarea id="message" name="message" rows="4" placeholder="작업하시려는 제품의 종류, 크기, 포장 방식 등 구체적인 내용을 적어주시면 더 정확한 견적이 가능합니다." required></textarea>
              </div>

              <div className="form-group file-upload-group">
                <label htmlFor="attachment">참고 자료 첨부 <span className="optional">(선택)</span></label>
                <div className="file-upload-wrapper">
                  <input type="file" id="attachment" name="attachment" className="file-input" multiple onChange={handleFileChange} />
                  <div className="file-upload-ui">
                    <span className="file-icon">📎</span>
                    <span className="file-text">{fileName}</span>
                    <span className="file-btn">찾아보기</span>
                  </div>
                </div>
              </div>

              <div className="privacy-policy">
                <label className="custom-checkbox privacy-checkbox">
                  <input type="checkbox" required />
                  <span className="checkmark"></span>
                  <span className="privacy-text">
                    <strong>개인정보 수집 및 이용</strong>에 동의합니다.<br/>
                    <small>입력하신 정보는 견적 산출 및 상담 목적으로만 사용됩니다.</small>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? '전송 중...' : '견적 및 상담 요청하기 →'}
              </button>
              </form>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Contact;
