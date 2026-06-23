document.addEventListener('DOMContentLoaded', () => {
    
    // 날짜 자동 입력 (오늘 날짜)
    const today = new Date();
    document.getElementById('date-year').value = today.getFullYear();
    document.getElementById('date-month').value = String(today.getMonth() + 1).padStart(2, '0');
    document.getElementById('date-day').value = String(today.getDate()).padStart(2, '0');

    // ✅ 관리자 페이지에서 넘어온 고객 정보 자동 입력
    const params = new URLSearchParams(window.location.search);
    const customerName    = params.get('name')    || '';
    const customerCompany = params.get('company') || '';
    const customerPhone   = params.get('phone')   || '';

    if (customerName || customerCompany) {
        const receiverInput = document.getElementById('receiver-name');
        if (receiverInput) {
            receiverInput.value = customerCompany
                ? `${customerCompany} ${customerName}`
                : customerName;
        }
    }


    // 기본 6줄 생성
    const itemsBody = document.getElementById('items-body');
    for (let i = 0; i < 6; i++) {
        addRow();
    }

    // 항목 추가 버튼
    document.getElementById('add-row-btn').addEventListener('click', () => {
        addRow();
    });

    // 항목 삭제 버튼
    document.getElementById('remove-row-btn').addEventListener('click', () => {
        if (itemsBody.children.length > 1) { // 최소 1줄은 유지
            itemsBody.removeChild(itemsBody.lastElementChild);
            updateRowNumbers();
            calculateTotal();
        } else {
            alert('최소 1줄은 남아있어야 합니다.');
        }
    });

    // 인쇄/PDF 저장 버튼
    document.getElementById('print-btn').addEventListener('click', () => {
        const element = document.getElementById('document-page');
        
        // html2canvas가 input의 현재 값을 읽을 수 있도록 DOM 속성에 동기화
        const inputs = element.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.tagName === 'INPUT') {
                input.setAttribute('value', input.value);
            } else if (input.tagName === 'TEXTAREA') {
                input.innerHTML = input.value;
            }
        });

        // box-shadow 등 PDF 렌더링에 불필요한 스타일 임시 제거
        const originalBoxShadow = element.style.boxShadow;
        element.style.boxShadow = 'none';

        const opt = {
            margin:       0,
            filename:     '견적서.pdf',
            image:        { type: 'jpeg', quality: 1.0 },
            html2canvas:  { scale: 4 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            // 스타일 원복
            element.style.boxShadow = originalBoxShadow;
        });
    });

    // 이벤트 위임을 이용한 자동 계산 및 텍스트에어리어 높이 조절
    itemsBody.addEventListener('input', (e) => {
        if (e.target.classList.contains('qty-input') || e.target.classList.contains('price-input')) {
            calculateRow(e.target.closest('tr'));
            calculateTotal();
        } else if (e.target.classList.contains('amount-input')) {
            // 사용자가 수동으로 금액칸을 직접 입력하는 경우 합계만 재계산
            calculateTotal();
        }
        
        // '내 용' 텍스트에어리어 자동 높이 조절
        if (e.target.classList.contains('desc-textarea')) {
            e.target.style.height = 'auto'; // 높이 초기화
            e.target.style.height = e.target.scrollHeight + 'px'; // 스크롤 높이만큼 늘림
        }
    });

    // 브랜드 전환 로직 (수작업팩토리 <-> 이룸프린트)
    const brandRadios = document.querySelectorAll('input[name="brandType"]');
    const dynamicBrandText = document.getElementById('dynamic-brand-text');
    const dynamicTermsList = document.getElementById('dynamic-terms-list');

    brandRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'sujak') {
                document.title = '견적서 - 수작업팩토리';
                dynamicBrandText.innerHTML = `
                    <div class="brand-item">
                        <span class="brand-name">수작업팩토리</span> 
                        <span class="brand-desc">수작업포장에서 DM 발송까지 실무자가 믿고 맡길 수 있는 풀필먼트 파트너 / <span class="url-text">www.iroum.com</span></span>
                    </div>
                `;
                dynamicTermsList.innerHTML = `
                    <li>본 견적은 결제 완료 후 수작업 및 포장 공정이 진행됩니다.</li>
                    <li>견적의 유효 기간은 발행일 기준 15일입니다.</li>
                    <li>작업 완료된 결과물은 홈페이지·블로그 등 온라인 마케팅 포트폴리오로 활용될 수 있습니다.</li>
                `;
            } else if (e.target.value === 'iroum') {
                document.title = '견적서 - 이룸프린트';
                dynamicBrandText.innerHTML = `
                    <div class="brand-item">
                        <span class="brand-name">이룸프린트</span> 
                        <span class="brand-desc">- 엽서, 포토카드, 패키지 박스, 슬리브 띠지 맞춤 제작 전문 / <span class="url-text">www.iroum.co.kr</span></span>
                    </div>
                `;
                dynamicTermsList.innerHTML = `
                    <li>본 견적은 결제 완료 후 제작이 진행됩니다.</li>
                    <li>견적의 유효 기간은 발행일 기준 15일입니다.</li>
                    <li>인쇄 특성상 모니터 색상과 실제 인쇄물의 색상은 차이가 있을 수 있으며, 이는 불량 사유에 해당하지 않습니다.</li>
                    <li>제작 완료된 제품은 홈페이지·블로그 등 온라인 마케팅에 활용될 수 있습니다.</li>
                `;
            }
        });
    });

    // 포커스 아웃 시 콤마 추가
    itemsBody.addEventListener('focusout', (e) => {
        if (e.target.classList.contains('qty-input') || e.target.classList.contains('price-input') || e.target.classList.contains('amount-input')) {
            let val = e.target.value.replace(/,/g, '');
            if (!isNaN(val) && val !== '') {
                e.target.value = Number(val).toLocaleString('ko-KR');
                if (e.target.classList.contains('amount-input')) calculateTotal();
            }
        }
    });

    // 포커스 인 시 콤마 제거
    itemsBody.addEventListener('focusin', (e) => {
        if (e.target.classList.contains('qty-input') || e.target.classList.contains('price-input') || e.target.classList.contains('amount-input')) {
            e.target.value = e.target.value.replace(/,/g, '');
        }
    });

    function addRow() {
        const rowCount = itemsBody.children.length + 1;
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td><input type="text" class="input-field no-input" value="${rowCount}" tabindex="-1" readonly></td>
            <td><textarea class="input-field desc-textarea" rows="1"></textarea></td>
            <td><input type="text" class="input-field qty-input"></td>
            <td><input type="text" class="input-field price-input"></td>
            <td><input type="text" class="input-field amount-input"></td>
        `;
        
        itemsBody.appendChild(tr);
        updateRowNumbers();
    }

    function updateRowNumbers() {
        const rows = itemsBody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.querySelector('.no-input').value = index + 1;
        });
    }

    function calculateRow(row) {
        const qtyInput = row.querySelector('.qty-input');
        const priceInput = row.querySelector('.price-input');
        const amountInput = row.querySelector('.amount-input');

        const qtyStr = qtyInput.value.replace(/,/g, '');
        const priceStr = priceInput.value.replace(/,/g, '');
        
        // 둘 다 비어있을 경우, 사용자가 금액을 수동으로 입력했을 수 있으므로 덮어쓰지 않음
        if (qtyStr === '' && priceStr === '') {
            return;
        }

        const qty = parseFloat(qtyStr) || 0;
        const price = parseFloat(priceStr) || 0;
        
        if (qty > 0 && price > 0) {
            amountInput.value = (qty * price).toLocaleString('ko-KR');
        } else {
            // 수량/단가 중 하나만 입력하거나 지운 경우 금액 빈칸 처리
            amountInput.value = '';
        }
    }

    function calculateTotal() {
        const amountInputs = itemsBody.querySelectorAll('.amount-input');
        let total = 0;

        amountInputs.forEach(input => {
            const val = parseFloat(input.value.replace(/,/g, '')) || 0;
            total += val;
        });

        // 1. 풋터 합계 계산 (합계, VAT, 총합계)
        const vat = Math.floor(total * 0.1);
        const grandTotal = total + vat;

        const footerSubtotal = document.getElementById('footer-subtotal');
        const footerVat = document.getElementById('footer-vat');
        const footerGrandTotal = document.getElementById('footer-grand-total');

        footerSubtotal.value = total > 0 ? total.toLocaleString('ko-KR') : '';
        footerVat.value = vat > 0 ? vat.toLocaleString('ko-KR') : '';
        footerGrandTotal.value = grandTotal > 0 ? grandTotal.toLocaleString('ko-KR') : '';

        // 2. 상단 총 합계 업데이트 (VAT 포함된 총합계금액 기준)
        const totalNumInput = document.getElementById('total-num-amount');
        const totalKoreanInput = document.getElementById('total-korean-amount');

        if (grandTotal > 0) {
            totalNumInput.value = grandTotal.toLocaleString('ko-KR');
            totalKoreanInput.value = numberToKorean(grandTotal) + "정";
        } else {
            totalNumInput.value = '';
            totalKoreanInput.value = '';
        }
    }

    function numberToKorean(number) {
        const koreanNumbers = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
        const units = ['', '십', '백', '천'];
        const bigUnits = ['', '만', '억', '조', '경'];

        let result = '';
        let numStr = String(number);
        let length = numStr.length;

        for (let i = 0; i < length; i++) {
            let digit = parseInt(numStr.charAt(i));
            let unitIndex = (length - i - 1) % 4;
            let bigUnitIndex = Math.floor((length - i - 1) / 4);

            if (digit !== 0) {
                result += koreanNumbers[digit] + units[unitIndex];
            }

            if (unitIndex === 0 && result.length > 0 && !result.endsWith(bigUnits[bigUnitIndex])) {
                // 해당 만/억/조 단위 내에 0이 아닌 숫자가 있었을 경우만 큰 단위를 붙임
                let subStr = numStr.substring(Math.max(0, i - 3), i + 1);
                if (parseInt(subStr) !== 0) {
                    result += bigUnits[bigUnitIndex];
                }
            }
        }

        return result ? result + "원" : "";
    }

    // ==========================================
    // Firebase 데이터베이스 (Firestore) 연동 로직
    // ==========================================
    
    // TODO: 사용자님! 아래 firebaseConfig 객체에 사용자님의 실제 Firebase 프로젝트 정보를 채워주세요.
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // Firebase 초기화 (설정값이 비어있으면 초기화 방지)
    let db = null;
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
    }

    // 견적서 저장 버튼 클릭 이벤트
    document.getElementById('save-quote-btn').addEventListener('click', async () => {
        if (!db) {
            alert('Firebase 연동 정보가 입력되지 않았습니다. script.js 파일에서 firebaseConfig를 설정해주세요!');
            return;
        }

        const receiverName = document.getElementById('receiver-name').value.trim() || '미지정';
        const grandTotal = document.getElementById('footer-grand-total').value || '0';
        const dateStr = `${document.getElementById('date-year').value}.${document.getElementById('date-month').value}.${document.getElementById('date-day').value}`;
        
        const title = prompt('저장할 견적서 제목을 입력하세요:', `[${dateStr}] ${receiverName} - ${grandTotal}원`);
        if (!title) return;

        // 화면의 모든 데이터를 JSON 객체로 수집
        const quoteData = {
            title: title,
            createdAt: new Date(),
            dateYear: document.getElementById('date-year').value,
            dateMonth: document.getElementById('date-month').value,
            dateDay: document.getElementById('date-day').value,
            receiverName: document.getElementById('receiver-name').value,
            brandType: document.querySelector('input[name="brandType"]:checked').value,
            items: []
        };

        const rows = document.querySelectorAll('#items-body tr');
        rows.forEach(row => {
            quoteData.items.push({
                desc: row.querySelector('.desc-textarea').value,
                qty: row.querySelector('.qty-input').value,
                price: row.querySelector('.price-input').value,
                amount: row.querySelector('.amount-input').value
            });
        });

        try {
            await db.collection('quotations').add(quoteData);
            alert('견적서가 성공적으로 저장되었습니다!');
        } catch (error) {
            console.error('저장 에러:', error);
            alert('저장 중 오류가 발생했습니다: ' + error.message);
        }
    });

    // 모달 DOM
    const quoteModal = document.getElementById('quote-modal');
    const quoteList = document.getElementById('quote-list');
    
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        quoteModal.style.display = 'none';
    });

    // 저장 목록 불러오기 버튼 클릭 이벤트
    document.getElementById('load-quote-btn').addEventListener('click', async () => {
        if (!db) {
            alert('Firebase 연동 정보가 입력되지 않았습니다.');
            return;
        }

        quoteList.innerHTML = '<li>로딩 중...</li>';
        quoteModal.style.display = 'flex';

        try {
            const snapshot = await db.collection('quotations').orderBy('createdAt', 'desc').get();
            quoteList.innerHTML = '';

            if (snapshot.empty) {
                quoteList.innerHTML = '<li>저장된 견적서가 없습니다.</li>';
                return;
            }

            snapshot.forEach(doc => {
                const data = doc.data();
                const li = document.createElement('li');
                li.className = 'quote-item';
                
                // 생성일 포맷
                let dateString = '';
                if (data.createdAt && data.createdAt.toDate) {
                    const date = data.createdAt.toDate();
                    dateString = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                }

                li.innerHTML = `
                    <div style="flex:1;">
                        <div class="quote-title">${data.title}</div>
                        <div class="quote-date">${dateString}</div>
                    </div>
                    <button class="delete-quote-btn" data-id="${doc.id}">삭제</button>
                `;

                // 견적서 클릭 시 불러오기
                li.querySelector('div').addEventListener('click', () => {
                    if (confirm(`'${data.title}' 견적서를 불러오시겠습니까? 현재 작성 중인 내용은 사라집니다.`)) {
                        loadQuoteData(data);
                        quoteModal.style.display = 'none';
                    }
                });

                // 삭제 버튼 로직
                li.querySelector('.delete-quote-btn').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm('정말로 이 견적서를 삭제하시겠습니까?')) {
                        await db.collection('quotations').doc(doc.id).delete();
                        li.remove();
                    }
                });

                quoteList.appendChild(li);
            });
        } catch (error) {
            console.error('불러오기 에러:', error);
            quoteList.innerHTML = `<li>오류 발생: ${error.message}</li>`;
        }
    });

    // 선택한 데이터를 화면에 복원하는 함수
    function loadQuoteData(data) {
        document.getElementById('date-year').value = data.dateYear || '';
        document.getElementById('date-month').value = data.dateMonth || '';
        document.getElementById('date-day').value = data.dateDay || '';
        document.getElementById('receiver-name').value = data.receiverName || '';

        // 브랜드 라디오 버튼 체크
        if (data.brandType) {
            const radio = document.querySelector(`input[name="brandType"][value="${data.brandType}"]`);
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change')); // 이벤트 강제 트리거 (하단 텍스트 변경용)
            }
        }

        // 아이템 목록 복원
        itemsBody.innerHTML = ''; // 기존 행 모두 삭제
        
        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                addRow();
                const lastRow = itemsBody.lastElementChild;
                lastRow.querySelector('.desc-textarea').value = item.desc || '';
                lastRow.querySelector('.qty-input').value = item.qty || '';
                lastRow.querySelector('.price-input').value = item.price || '';
                lastRow.querySelector('.amount-input').value = item.amount || '';
                
                // 텍스트에어리어 높이 복원
                const textarea = lastRow.querySelector('.desc-textarea');
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        } else {
            // 빈 데이터면 기본 6줄
            for (let i = 0; i < 6; i++) addRow();
        }

        calculateTotal();
    }
});
