const fs = require('fs');
const css = `
/* 모바일 및 반응형 레이아웃 */
.calc-main-wrapper {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.calc-sidebar-wrapper {
  width: 380px;
  position: sticky;
  top: 2rem;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .calc-main-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  .calc-sidebar-wrapper {
    width: 100%;
    position: static;
    margin-top: 1rem;
  }
}

@media (max-width: 600px) {
  .contact-title {
    font-size: 2rem !important;
  }
  .calculator-container {
    padding: 3rem 0 !important;
  }
  .calculator-container .service-card {
    padding: 1rem;
  }
}
`;
fs.appendFileSync('src/components/Calculator.css', css, 'utf8');
