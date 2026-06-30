const fs = require('fs');
const path = 'src/components/Calculator.jsx';
let code = fs.readFileSync(path, 'utf8');

const kittingRegex = /\{activeModal === 'kitting' && \(\s*<>([\s\S]*?)<\/>\s*\)\}/;
const attachRegex = /\{activeModal === 'attach' && \(\s*<>([\s\S]*?)<\/>\s*\)\}/;
const assembleRegex = /\{activeModal === 'assemble' && \(\s*<>([\s\S]*?)<\/>\s*\)\}/;

const kittingMatch = code.match(kittingRegex);
const attachMatch = code.match(attachRegex);
const assembleMatch = code.match(assembleRegex);

if (!kittingMatch || !attachMatch || !assembleMatch) {
    console.log("Could not find one of the forms");
    process.exit(1);
}

const formVariables = `
  const KittingForm = (
    <div className="accordion-inner-form" onClick={(e) => e.stopPropagation()}>
${kittingMatch[1]}
    </div>
  );

  const AttachForm = (
    <div className="accordion-inner-form" onClick={(e) => e.stopPropagation()}>
${attachMatch[1]}
    </div>
  );

  const AssembleForm = (
    <div className="accordion-inner-form" onClick={(e) => e.stopPropagation()}>
${assembleMatch[1]}
    </div>
  );
`;

code = code.replace('  return (', formVariables + '\n  return (');

code = code.replace(kittingRegex, "{activeModal === 'kitting' && KittingForm}");
code = code.replace(attachRegex, "{activeModal === 'attach' && AttachForm}");
code = code.replace(assembleRegex, "{activeModal === 'assemble' && AssembleForm}");

code = code.replace(
  /<button className="service-card" style=\{\{(.*?)\}\} onClick=\{\(\) => openModal\('kitting'\)\}>([\s\S]*?)<\/button>/,
  '<div className="service-card" style={{$1}} onClick={() => setActiveModal(activeModal === "kitting" ? null : "kitting")}>$2<div className={`mobile-accordion ${activeModal === "kitting" ? "open" : ""}`}>{activeModal === "kitting" && KittingForm}</div></div>'
);

code = code.replace(
  /<button className="service-card" style=\{\{(.*?)\}\} onClick=\{\(\) => openModal\('attach'\)\}>([\s\S]*?)<\/button>/,
  '<div className="service-card" style={{$1}} onClick={() => setActiveModal(activeModal === "attach" ? null : "attach")}>$2<div className={`mobile-accordion ${activeModal === "attach" ? "open" : ""}`}>{activeModal === "attach" && AttachForm}</div></div>'
);

code = code.replace(
  /<button className="service-card" style=\{\{(.*?)\}\} onClick=\{\(\) => openModal\('assemble'\)\}>([\s\S]*?)<\/button>/,
  '<div className="service-card" style={{$1}} onClick={() => setActiveModal(activeModal === "assemble" ? null : "assemble")}>$2<div className={`mobile-accordion ${activeModal === "assemble" ? "open" : ""}`}>{activeModal === "assemble" && AssembleForm}</div></div>'
);

code = code.replace(
  /\{activeModal && \(\s*<div style=\{\{ position: 'fixed', top: 0,/,
  '{activeModal && (\n        <div className="desktop-modal" style={{ position: "fixed", top: 0,'
);

fs.writeFileSync(path, code);
console.log("Refactoring complete");
