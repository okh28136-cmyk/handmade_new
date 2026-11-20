# 프로젝트 로그

## 프로젝트 시작
- **시작 일시:** 2026-06-21
- **폴더 확인:** 현재 폴더(`수작업팩토리_NEW`) 내에 `1920-800.jpg`, `랜딩페이지.jpg` 이미지 파일이 있음.
- **스킬 확인 완료:** `D:\Antigravity\skills` 폴더에 다양한 스킬(SEO, 프론트엔드 디자인, 한국형 프리미엄 디자인 등)이 준비되어 있음.

## 작업 내용
- 현재 폴더에 있는 자료 및 사용 가능한 스킬 목록 확인.
- 프로젝트 로그(PROJECT_LOG.md) 파일 생성.
- `랜딩페이지.jpg` 이미지 내용 상세 분석 완료 (헤더, 히어로, 서비스 소개, 강점, 현장스케치, 단가표, FAQ, 문의폼, 푸터 구조 파악).
- Vercel, GitHub, Firebase 연동을 위한 `implementation_plan.md` 생성.
- 사용자 피드백 반영: 견적 문의 폼 로직 구현은 추후 결정으로 보류, 비용 가이드는 관리자가 직접 수정할 수 있도록 Firebase 연동 방향으로 확정.
- **2026-10-22:** 관리자 페이지 견적 문의 목록(`InquiryList.jsx`, `InquiryList.css`) 하단 페이지네이션(`이전 1 2 3 ... 다음`) 디자인 스타일 누락 수정 및 10월 이후 두 자리 월/일 날짜 표기 시 시간(분)이 잘리는 현상 수정.
- **2026-10-23:** 관리자 페이지 전반 오류 개선 및 배포:
  1. `InquiryList.jsx`: 엑셀 다운로드 시 `서비스분야`, `예상물량`, `문의내용`이 빈칸(`-`)으로 출력되던 필드명 불일치 버그 수정, 연락처·서비스 유형 검색 확장, 마지막 항목 삭제 시 빈 페이지에 머무는 버그 수정.
  2. `AdminPayments.jsx` / `AdminPayments.css`: KCP 결제 상태값(`결제완료` vs `입금 완료`) 불일치로 인해 결제완료 건이 노란색(대기) 뱃지로 표시되던 버그 수정, 상태 필터(전체/결제완료/결제대기)·검색·원클릭 삭제 버튼·페이지네이션 추가.
  3. `AdminPricing.jsx`: 단가 입력칸에서 백스페이스로 마지막 숫자를 지울 수 없던 입력 잠김 현상 개선.
- **2026-10-23 (SEO 고도화):** B2B 검색량 상위 7대 핵심 키워드(`임가공 업체`, `포장 대행 업체`, `수작업 포장 대행`, `화장품 포장 임가공`, `라벨 부착 대행`, `DM 발송 대행`, `선물세트 포장 대행`)를 `index.html`(메타 태그, OpenGraph, JSON-LD `Service` 및 `OfferCatalog`), `App.jsx`(`Helmet`), `Service.jsx`(시맨틱 헤딩 및 이미지 alt), `About.jsx`, `sitemap.xml`에 전면 반영 및 배포.
- **2026-11-20 (전문가 SEO 100점 패키지 적용 및 배포):**
  1. `Header.jsx` 상단 메뉴 '현장스케치' 깨진 앵커(`#sketch` ➔ `#gallery`) 수정 및 `Footer.jsx` 서브페이지 링크를 크롤러 친화적인 `<Link>`(`<a>`)로 전환.
  2. `Hero.jsx` 따옴표 오타(`"`) 수정 및 `Service.jsx`, `Features.jsx` 본문 가시 텍스트에 7대 B2B 핵심 키워드 자연스럽게 반영.
  3. `index.html` 내 네이버 Yeti 및 초기 HTML 크롤러용 정적 시맨틱 폴백 콘텐츠 추가, `FAQPage` JSON-LD에 7대 키워드 Q&A 확장.
  4. `App.jsx`, `About.jsx`, `Location.jsx` 페이지별 독립 `Canonical URL` 지정 및 `robots.txt` 비공개 경로(`/admin`, `/payment`, `/quote-test`) 크롤링 차단.
  5. `Service.jsx`, `Gallery.jsx`, `AdminGallery.jsx` 이미지 `loading="lazy"` 및 SEO 키워드형 `alt` 자동 부여 적용.
