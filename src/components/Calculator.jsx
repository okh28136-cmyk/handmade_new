import React, { useState, useRef } from 'react';
import { useQuote } from '../context/QuoteContext';
import { Package, Tag, Box, Truck, Plus, X, ArrowRight, Settings, Info, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Calculator.css';
import './Contact.css';

const EMAILJS_SERVICE_ID  = 'service_1tncfue';
const EMAILJS_TEMPLATE_ID = 'template_jjsvsad';
const EMAILJS_PUBLIC_KEY  = 'xAmHtsU9Nfdgoee-t';

const Calculator = () => {
  const { state, quoteResult, setProject, addToCart, removeFromCart, isLoading } = useQuote();
  const { project } = state;
  const [activeModal, setActiveModal] = useState(null); 
  const [step, setStep] = useState(1); // 1: 기본설정, 2: 공정선택, 3: 문의폼 작성

  // 폼 관련 State
  const formRef = useRef(null);
  const [fileName, setFileName] = useState('파일을 첨부하시려면 클릭하세요.');
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | sending | success | error
  const [kittingBase, setKittingBase] = useState('');
  const [kittingInsert, setKittingInsert] = useState('');
  const [kittingExtra, setKittingExtra] = useState('');

  const [attachBase, setAttachBase] = useState('');
  const [attachArea, setAttachArea] = useState('');
  const [attachSize, setAttachSize] = useState('');

  const [assembleBase, setAssembleBase] = useState('');
  const [assembleInner, setAssembleInner] = useState('');
  const [assembleFinish, setAssembleFinish] = useState('');

  const [outPackingBase, setOutPackingBase] = useState('');

  const openModal = (type) => {
    // 모달 열 때 상태 초기화 (매번 새롭게 선택하도록)
    if (type === 'kitting') { setKittingBase(''); setKittingInsert(''); setKittingExtra(''); }
    if (type === 'attach') { setAttachBase(''); setAttachArea(''); setAttachSize(''); }
    if (type === 'assemble') { setAssembleBase(''); setAssembleInner(''); setAssembleFinish(''); }
    if (type === 'outPacking') { setOutPackingBase(''); }
    setActiveModal(type);
  };

  const handleAddKitting = () => {
    addToCart({ type: 'kitting', base: kittingBase, multipliers: { insertMethod: kittingInsert, extraPacking: kittingExtra }, label: '포장재 담기' });
    setActiveModal(null);
  };
  const handleAddAttach = () => {
    addToCart({ type: 'attach', base: attachBase, multipliers: { attachArea, attachSize }, label: '스티커/라벨 부착' });
    setActiveModal(null);
  };
  const handleAddAssemble = () => {
    addToCart({ type: 'assemble', base: assembleBase, multipliers: { innerPad: assembleInner, finishing: assembleFinish }, label: '상자 조립/만들기' });
    setActiveModal(null);
  };
  const handleAddOutPacking = () => {
    addToCart({ type: 'outPacking', base: outPackingBase, label: '최종 출고 포장' });
    setActiveModal(null);
  };

  const handleNextStep = () => {
    if (!isProjectValid) {
      alert('기본 설정을 모두 입력해주세요.');
      return;
    }
    setStep(2);
  };

  const labelMap = {
    simple: '1종 (단순 합포장)', normal: '2~3종 (일반 키팅)', complex: '4종 이상 (복잡 키팅)',
    precision: '정밀 부착', folding: '이중/삼중 꺾임 상자', hard: '고급 싸바리 세팅',
    courier: '개별 택배 포장', outerBox: '대형 외박스 합포장', pallet: '팔레트 단위 납품'
  };
  const getLabel = (key) => labelMap[key] || '일반 기준';

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map(f => f.name).join(', ');
      setFileName(fileNames);
    } else {
      setFileName('파일을 첨부하시려면 클릭하세요.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');

    const formData = new FormData(e.target);
    const files = formData.getAll('attachment');
    let attachments = [];

    if (files.length > 0 && files[0].name !== '') {
      for (const file of files) {
        const fileRef = ref(storage, `inquiries/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        attachments.push({ name: file.name, url });
      }
    }

    const templateParams = {
      from_company : formData.get('company')  || '(미입력)',
      from_name    : formData.get('name'),
      from_phone   : formData.get('phone'),
      from_email   : formData.get('email'),
      service_type : '자동견적 시스템 접수건',
      amount       : `${project.quantity} 세트`,
      message      : formData.get('message'),
      to_email     : 'jyy1422@iroum.co.kr',
      to_email2    : 'okh@iroum.co.kr',
      cart_details : quoteResult.enrichedCart.map(item => `- ${item.label} (${item.base}): ${item.calculatedPrice}원`).join('\n'),
      total_price  : `${quoteResult.totalPrice.toLocaleString()}원`,
      attachment_url: attachments.length > 0 ? attachments.map(a => a.url).join(', ') : '첨부파일 없음'
    };

    try {
      const emailPromise = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);

      const firestorePromise = Promise.race([
        addDoc(collection(db, 'inquiries'), {
          ...templateParams,
          attachments: attachments,
          quote_details: quoteResult,
          project_settings: project,
          status: 'new',
          memos: [],
          createdAt: serverTimestamp(),
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore Timeout')), 3000))
      ]).catch(err => console.error('Firestore 저장 오류:', err));

      await emailPromise;
      await firestorePromise;

      setSubmitStatus('success');
      formRef.current.reset();
      setFileName('파일을 첨부하시려면 클릭하세요.');
    } catch (mailErr) {
      console.error('전송 오류:', mailErr);
      setSubmitStatus('error');
    }
  };

  // 각 모달별 필수 선택 완료 여부 체크
  const isKittingValid = kittingBase !== '' && kittingInsert !== '' && kittingExtra !== '';
  const isAttachValid = attachBase !== '' && attachArea !== '' && attachSize !== '';
  const isAssembleValid = assembleBase !== '' && assembleInner !== '' && assembleFinish !== '';
  const isOutPackingValid = outPackingBase !== '';

  // 기본 프로젝트 설정 완료 여부 체크
  const isProjectValid = project.quantity !== '' && project.quantity > 0 && project.weight !== '' && project.hasBOM !== '';

  return (
    <section id="contact" className="calculator-container" style={{ padding: '6rem 0', background: 'var(--bg-color)', color: 'var(--text-main)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* 헤더 부분 */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="contact-tag font-playfair" style={{ display: 'inline-block', color: 'var(--primary)', fontWeight: '700', letterSpacing: '2px', marginBottom: '1rem', fontSize: '0.875rem' }}>AUTO QUOTE SYSTEM</span>
          <h2 className="contact-title font-playfair" style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1.2', margin: 0 }}>자동 견적 산출</h2>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '1.125rem' }}>
            기다릴 필요 없이, 즉석에서 수작업 견적을 확인하고 바로 문의하세요.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }} className="animate-slide-up">
      
      {/* Left Panel: Services Menu & Project Settings */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: step === 1 ? 'center' : 'stretch' }}>
        
        {/* Step 1: Project Settings Section */}
        {step === 1 && (
          <section style={{ width: '100%', maxWidth: '800px', background: 'var(--surface)', padding: '3rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }} className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Settings size={24} color="var(--primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Step 1. 기본 프로젝트 설정</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>총 예상 수량 (세트)</label>
                <input 
                  type="number" 
                  value={project.quantity === '' ? '' : project.quantity} 
                  onChange={(e) => setProject('quantity', e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="form-input"
                  placeholder="예: 1000"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>제품 무게/크기</label>
                <select 
                  value={project.weight === '' ? '' : project.weight} 
                  onChange={(e) => setProject('weight', parseFloat(e.target.value))}
                  className="form-input"
                >
                  <option value="" disabled>항목을 선택해주세요</option>
                  <option value={1.0}>가벼움 (한 손 취급 가능)</option>
                  <option value={1.2}>보통 (양손 취급 필요)</option>
                  <option value={1.5}>무거움 (5kg 이상, 취급 주의)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>부자재 공급 방식</label>
                <select 
                  value={project.hasBOM === '' ? '' : project.hasBOM.toString()} 
                  onChange={(e) => setProject('hasBOM', e.target.value === 'true')}
                  className="form-input"
                >
                  <option value="" disabled>항목을 선택해주세요</option>
                  <option value="false">고객 전량 입고 (순수 임가공)</option>
                  <option value="true">이룸팩토리에 제작 동시 의뢰</option>
                </select>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!isProjectValid}
              style={{
                width: '100%', marginTop: '2rem', padding: '1rem',
                background: isProjectValid ? 'var(--primary)' : '#e2e8f0',
                color: isProjectValid ? '#fff' : '#94a3b8',
                border: 'none', borderRadius: 'var(--radius-md)',
                fontWeight: '700', fontSize: '1rem',
                cursor: isProjectValid ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
              }}
            >
              다음 단계로 (공정 선택) <ArrowRight size={18} />
            </button>
          </section>
        )}

        {/* Step 2: Services Menu Section */}
        {step === 2 && (
          <section className="animate-slide-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>Step 2. 필요 공정 선택하기</h2>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>작업이 필요한 항목만 클릭하여 견적에 추가하세요.</span>
              </div>
              <button 
                onClick={() => setStep(1)} 
                style={{ background: 'none', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.target.style.background = 'var(--bg-color)'; e.target.style.color = 'var(--text-main)'; }}
                onMouseOut={(e) => { e.target.style.background = 'none'; e.target.style.color = 'var(--text-muted)'; }}
              >
                ← 이전 (설정 수정)
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              
              <button className="service-card" onClick={() => openModal('kitting')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="icon-wrapper"><Package size={24} /></div>
                  <div style={{ background: 'var(--bg-color)', color: 'var(--text-muted)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}><Plus size={14} /> 선택</div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem' }}>상품 담기 (Kitting)</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>비닐, 상자, 파우치 등에 내용물을 분류하여 담는 작업</p>
                </div>
              </button>

              <button className="service-card" onClick={() => openModal('attach')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="icon-wrapper"><Tag size={24} /></div>
                  <div style={{ background: 'var(--bg-color)', color: 'var(--text-muted)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}><Plus size={14} /> 선택</div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem' }}>스티커/라벨 부착</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>바코드, 품질표시, 봉인 라벨 등의 정확한 부착 작업</p>
                </div>
              </button>

              <button className="service-card" onClick={() => openModal('assemble')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="icon-wrapper"><Box size={24} /></div>
                  <div style={{ background: 'var(--bg-color)', color: 'var(--text-muted)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}><Plus size={14} /> 선택</div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem' }}>상자 조립/만들기</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>납작한 단상자 접기, 싸바리 세팅, 슬리브 마감 작업</p>
                </div>
              </button>

              {/* [출고/물류 포장] 항목 임시 숨김 처리 (서비스 불가)
              <button className="service-card" onClick={() => openModal('outPacking')}>
                ...
              </button>
              */}

            </div>
          </section>
        )}

        {/* Step 3: Contact Form Section */}
        {step === 3 && (
          <section className="animate-fade-in" style={{ width: '100%', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '2rem', background: 'var(--primary)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Step 3. 이 견적으로 상담 문의하기</h2>
                <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>산출된 견적 정보를 포함하여 담당자에게 상세 상담을 요청합니다.</p>
              </div>
              <button 
                onClick={() => setStep(2)} 
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', color: '#fff', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                ← 이전 단계
              </button>
            </div>

            <div style={{ padding: '2rem' }}>
              {submitStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1.5rem auto' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>견적 문의가 성공적으로 접수되었습니다!</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    자동 견적 내역과 남겨주신 정보가 담당자에게 전달되었습니다.<br/>
                    평균 영업일 기준 1일 이내에 연락드리겠습니다.
                  </p>
                  <button onClick={() => { setStep(1); setSubmitStatus('idle'); }} style={{ marginTop: '2rem', padding: '0.75rem 2rem', background: 'var(--text-main)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600' }}>
                    처음으로 돌아가기
                  </button>
                </div>
              ) : (
                <form className="contact-form" ref={formRef} onSubmit={handleFormSubmit} style={{ margin: 0 }}>
                  {submitStatus === 'error' && (
                    <div style={{ padding: '1rem', background: '#fef2f2', color: '#ef4444', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: '600' }}>
                      ❌ 접수 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요.
                    </div>
                  )}

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

                  <button type="submit" className="submit-btn" disabled={submitStatus === 'sending'} style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.125rem' }}>
                    {submitStatus === 'sending' ? '전송 중...' : '견적 및 상담 요청하기 →'}
                  </button>
                </form>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Right Panel: Quote Cart (Sticky) - Only visible in Step 2 or 3 */}
      {(step === 2 || step === 3) && (
        <div style={{ width: '380px', position: 'sticky', top: '2rem' }} className="animate-fade-in">
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          
          <div style={{ padding: '1.5rem', background: 'var(--text-main)', color: '#fff' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              견적 산출 내역
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>선택하신 공정이 합산됩니다.</p>
          </div>
          
          <div style={{ padding: '1.5rem', maxHeight: '40vh', overflowY: 'auto', background: '#fafafa', position: 'relative' }}>
            {isLoading && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                <div style={{ padding: '0.75rem 1.5rem', background: 'var(--surface)', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-md)', fontWeight: '700', color: 'var(--primary)', fontSize: '0.875rem' }} className="animate-pulse">
                  견적 산출 중...
                </div>
              </div>
            )}
            {quoteResult.enrichedCart.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', opacity: 0.5 }}>
                  <Package size={48} />
                </div>
                <p style={{ fontWeight: '600' }}>아직 추가된 공정이 없습니다.</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>좌측 메뉴에서 필요한 항목을 선택해 주세요.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {quoteResult.enrichedCart.map((item, index) => (
                  <div key={item.id} style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="animate-fade-in">
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{getLabel(item.base)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.95rem' }}>
                        +{Math.round(item.calculatedPrice).toLocaleString()}원
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>순수 수작업 단가합</span>
              <strong style={{ color: 'var(--text-main)' }}>{quoteResult.workCost.toLocaleString()} 원</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>기본 라인 세팅비</span>
              <strong style={{ color: 'var(--text-main)' }}>{quoteResult.setupCost.toLocaleString()} 원</strong>
            </div>
            {/* 출고/포장비 UI 임시 숨김 처리
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>출고/포장비 (별도)</span>
              <strong style={{ color: 'var(--text-main)' }}>{quoteResult.packingCost.toLocaleString()} 원</strong>
            </div>
            */}
            
            <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>총 예상 비용</span>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '1.875rem', color: 'var(--primary)', lineHeight: '1', letterSpacing: '-0.02em' }}>
                  {quoteResult.totalPrice.toLocaleString()}
                </strong>
                <span style={{ fontSize: '1rem', color: 'var(--primary)', marginLeft: '0.25rem', fontWeight: '600' }}>원</span>
              </div>
            </div>
            
            {project.hasBOM && (
              <div style={{ display: 'flex', gap: '0.5rem', background: '#fffbeb', color: '#b45309', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginTop: '1rem', fontSize: '0.8125rem' }}>
                <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <p>부자재 제작 비용은 실비 정산으로 위 견적에는 포함되지 않았습니다.</p>
              </div>
            )}
            
            {step === 2 && (
              <button onClick={() => setStep(3)} style={{ width: '100%', padding: '1rem', background: 'var(--text-main)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '1rem', marginTop: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = '#334155'} onMouseOut={(e) => e.target.style.background = 'var(--text-main)'}>
                이 견적으로 상담 문의하기 <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Modals for Adding Items */}
      {activeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} className="animate-fade-in">
          <div style={{ background: 'var(--surface)', padding: '2.5rem 2rem', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '560px', boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(255,255,255,0.1)' }} className="animate-modal-pop">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
                {activeModal === 'kitting' && '📦 상품 담기 상세 설정'}
                {activeModal === 'attach' && '🏷️ 스티커 부착 상세 설정'}
                {activeModal === 'assemble' && '🎁 상자 조립 상세 설정'}
                {activeModal === 'outPacking' && '🚚 출고/포장 상세 설정'}
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            {activeModal === 'kitting' && (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.95rem' }}>포장 안에 몇 종류의 상품이 들어가나요?</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>부자재를 제외한 실제 투입 품목의 가짓수를 의미합니다.</p>
                  <select value={kittingBase} onChange={(e) => setKittingBase(e.target.value)} className="form-input">
                    <option value="" disabled>항목을 선택해주세요</option>
                    <option value="simple">1종 (가장 단순한 합포장)</option>
                    <option value="normal">2~3종 (일반적인 세트 구성)</option>
                    <option value="complex">4종 이상 (복잡한 뷰티 키트, 기획세트 등)</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.95rem' }}>투입 방식 (입구를 벌려야 하나요?)</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>지퍼백, OPP 비닐 등 입구를 수작업으로 열어야 하는지 여부입니다.</p>
                  <select value={kittingInsert} onChange={(e) => setKittingInsert(parseFloat(e.target.value))} className="form-input">
                    <option value="" disabled>항목을 선택해주세요</option>
                    <option value={1.0}>쉬움 (일반 단상자, 트레이 등 넓은 입구)</option>
                    <option value={1.3}>보통 (일반 OPP 비닐, 봉투 등 벌리기 필요)</option>
                    <option value={1.6}>어려움 (정전기가 심한 비닐, 뻑뻑한 지퍼백 등)</option>
                  </select>
                </div>
                <div style={{ marginBottom: '2.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.95rem' }}>담기 전 개별 포장 등 추가 작업 여부</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>파손 방지를 위해 개별적으로 에어캡을 감싸야 하는지 선택해 주세요.</p>
                  <select value={kittingExtra} onChange={(e) => setKittingExtra(parseFloat(e.target.value))} className="form-input">
                    <option value="" disabled>항목을 선택해주세요</option>
                    <option value={1.0}>추가 작업 없음 (그대로 투입)</option>
                    <option value={1.5}>에어캡/비닐 등 개별 완충 작업 필요</option>
                    <option value={2.0}>고급 유산지 감싸기 및 마감 스티커 부착</option>
                  </select>
                </div>
                
                <button 
                  onClick={handleAddKitting} 
                  disabled={!isKittingValid}
                  style={{ width: '100%', padding: '1rem', background: isKittingValid ? 'var(--primary)' : '#e2e8f0', color: isKittingValid ? '#fff' : '#94a3b8', border: 'none', borderRadius: 'var(--radius-md)', cursor: isKittingValid ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '1rem', transition: 'all 0.2s' }}
                >
                  견적에 추가하기
                </button>
              </>
            )}

            {activeModal === 'attach' && (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.95rem' }}>정밀도가 필요한가요?</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>인쇄된 가이드라인에 맞춰 오차 없이 부착해야 하는지 여부입니다.</p>
                  <select value={attachBase} onChange={(e) => setAttachBase(e.target.value)} className="form-input">
                    <option value="" disabled>항목을 선택해주세요</option>
                    <option value="normal">일반 부착 (여백이 넓어 눈대중으로 부착 가능)</option>
                    <option value="precision">정밀 부착 (선에 맞춰 오차 1~2mm 내외로 정확히 부착)</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.95rem' }}>부착 부위 난이도</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>스티커가 붙을 상품의 표면 형태를 선택해 주세요.</p>
                  <select value={attachArea} onChange={(e) => setAttachArea(parseFloat(e.target.value))} className="form-input">
                    <option value="" disabled>항목을 선택해주세요</option>
                    <option value={1.0}>평면 (평평한 단상자 표면 등 가장 쉬움)</option>
                    <option value={1.2}>곡면/모서리 (라운드 화장품 병, 모서리 꺾임 등)</option>
                    <option value={1.5}>봉인/교차면 (단상자 입구를 막는 등 두 면이 만나는 지점)</option>
                  </select>
                </div>
                <div style={{ marginBottom: '2.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.95rem' }}>스티커 크기</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>부착할 스티커 라벨의 대략적인 크기입니다.</p>
                  <select value={attachSize} onChange={(e) => setAttachSize(parseFloat(e.target.value))} className="form-input">
                    <option value="" disabled>항목을 선택해주세요</option>
                    <option value={1.0}>일반 (손가락 두 마디 ~ 명함 사이즈)</option>
                    <option value={1.2}>작음 (핀셋 작업이 필요할 정도의 초소형)</option>
                    <option value={1.5}>큼 (손바닥 이상의 큰 크기, 기포 발생 우려)</option>
                  </select>
                </div>
                
                <button 
                  onClick={handleAddAttach} 
                  disabled={!isAttachValid}
                  style={{ width: '100%', padding: '1rem', background: isAttachValid ? 'var(--primary)' : '#e2e8f0', color: isAttachValid ? '#fff' : '#94a3b8', border: 'none', borderRadius: 'var(--radius-md)', cursor: isAttachValid ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '1rem', transition: 'all 0.2s' }}
                >
                  견적에 추가하기
                </button>
              </>
            )}

            {activeModal === 'assemble' && (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.95rem' }}>조립할 상자 형태</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>단상자, G골 박스, 싸바리 등 상자의 기본 형태입니다.</p>
                  <select value={assembleBase} onChange={(e) => setAssembleBase(e.target.value)} className="form-input">
                    <option value="" disabled>항목을 선택해주세요</option>
                    <option value="normal">일반 단상자 (단순 맞뚜껑/십자형 뚜껑)</option>
                    <option value="folding">이중/삼중 꺾임 조립상자 (보통 택배용 G골 박스)</option>
                    <option value="hard">고급 싸바리 세팅 (형태를 잡거나 양면테이프 작업)</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.95rem' }}>상자 내부 고정틀(패드) 조립 여부</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>상품이 흔들리지 않도록 잡아주는 내부 패드 조립 여부입니다.</p>
                  <select value={assembleInner} onChange={(e) => setAssembleInner(parseFloat(e.target.value))} className="form-input">
                    <option value="" disabled>항목을 선택해주세요</option>
                    <option value={1.0}>패드 없음 (상자 외형만 접음)</option>
                    <option value={1.2}>기본 패드 조립 (단순히 한두 번 접어 삽입)</option>
                    <option value={1.5}>다중 꺾임/복잡한 고정틀 입체로 접어 넣기</option>
                  </select>
                </div>
                <div style={{ marginBottom: '2.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.95rem' }}>마무리 수작업</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>상자 조립 완료 후 외관에 추가되는 디자인 마감입니다.</p>
                  <select value={assembleFinish} onChange={(e) => setAssembleFinish(parseFloat(e.target.value))} className="form-input">
                    <option value="" disabled>항목을 선택해주세요</option>
                    <option value={1.0}>추가 마감 없음</option>
                    <option value={1.2}>겉면에 띠지(슬리브) 두르기 및 끼우기</option>
                    <option value={1.5}>리본 예쁘게 묶기 등 복잡한 디자인 마감</option>
                  </select>
                </div>
                
                <button 
                  onClick={handleAddAssemble} 
                  disabled={!isAssembleValid}
                  style={{ width: '100%', padding: '1rem', background: isAssembleValid ? 'var(--primary)' : '#e2e8f0', color: isAssembleValid ? '#fff' : '#94a3b8', border: 'none', borderRadius: 'var(--radius-md)', cursor: isAssembleValid ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '1rem', transition: 'all 0.2s' }}
                >
                  견적에 추가하기
                </button>
              </>
            )}

            {/* outPacking 모달 숨김 처리 */}
          </div>
        </div>
      )}

      </div>
      </div>
    </section>
  );
};

export default Calculator;
