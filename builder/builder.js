const logEl = document.getElementById("log");

function log(msg) {
  console.log(msg);
  logEl.textContent += msg + "\n";
}

document.getElementById("addProjectBtn").addEventListener("click", addProjectBox);
document.getElementById("downloadBtn").addEventListener("click", () => {
  generatePortfolio().catch(err => {
    log("❌ 오류: " + err.message);
    alert("에러가 발생했습니다. 콘솔/로그를 확인하세요.");
  });
});

let projectCount = 0;

// 프로젝트 입력 박스 추가
function addProjectBox() {
  projectCount++;

  const container = document.getElementById("projects");
  const box = document.createElement("div");
  box.classList.add("project-box");

  box.innerHTML = `
    <h3>프로젝트 ${projectCount}</h3>

    <label>프로젝트 제목</label>
    <input type="text" class="p-title" />

    <label>한 줄 설명</label>
    <input type="text" class="p-summary" />

    <label>스택 (쉼표로 구분)</label>
    <input type="text" class="p-stack" />

    <label>기간</label>
    <input type="text" class="p-period" />

    <label>Challenge</label>
    <textarea class="p-challenge"></textarea>

    <label>Action</label>
    <textarea class="p-action"></textarea>

    <label>Result</label>
    <textarea class="p-result"></textarea>

    <label>Summary</label>
    <textarea class="p-detail-summary"></textarea>

    <label>썸네일 이미지 업로드</label>
    <input type="file" class="p-thumb" accept="image/*" />

    <label>Architecture 이미지 업로드 (선택)</label>
    <input type="file" class="p-arch" accept="image/*" />
  `;

  container.appendChild(box);
}

// 메인: ZIP 생성
async function generatePortfolio() {
  logEl.textContent = "";
  log("=== ZIP 생성 시작 ===");

  const zip = new JSZip();

  // 1) 템플릿 파일 읽기
  log("템플릿 파일 읽는 중...");
  const [indexTemplate, listTemplate, detailTemplate, styleCss] = await Promise.all([
    fetch("../template/index.html").then(r => r.text()),
    fetch("../template/projects.html").then(r => r.text()),
    fetch("../template/project-detail.html").then(r => r.text()),
    fetch("../template/assets/css/style.css").then(r => r.text()),
  ]);

  // 2) 기본 정보
  const name = document.getElementById("name").value || "Your Name";
  const role = document.getElementById("role").value || "Developer";
  const desc = document.getElementById("description").value || "";
  const email = document.getElementById("email").value || "";
  const coreValuesRaw = document.getElementById("coreValues").value || "";

  const coreList = coreValuesRaw
    ? coreValuesRaw.split(",").map(v => `<li>${v.trim()}</li>`).join("")
    : "";

  const resumeFile = document.getElementById("resume").files[0];
  const resumePath = "assets/resume.pdf";

  // 3) 프로젝트들
  const projectBoxes = document.querySelectorAll(".project-box");
  if (projectBoxes.length === 0) {
    alert("프로젝트를 최소 1개 이상 추가해주세요.");
    log("프로젝트가 0개라서 중단됨.");
    return;
  }

  let projectCardsHtml = "";
  const detailFiles = [];
  const imgFiles = [];

  let projectIndex = 1;

  for (const box of projectBoxes) {
    const title = box.querySelector(".p-title").value || `Project ${projectIndex}`;
    const summary = box.querySelector(".p-summary").value || "";
    const stack = box.querySelector(".p-stack").value || "";
    const period = box.querySelector(".p-period").value || "";
    const challenge = box.querySelector(".p-challenge").value || "";
    const action = box.querySelector(".p-action").value || "";
    const result = box.querySelector(".p-result").value || "";
    const sm = box.querySelector(".p-detail-summary").value || "";

    const thumbInput = box.querySelector(".p-thumb");
    const archInput = box.querySelector(".p-arch");
    const thumbFile = thumbInput.files[0];
    const archFile = archInput.files[0];

    if (!thumbFile) {
      alert(`프로젝트 ${projectIndex} 에 썸네일 이미지를 업로드해주세요.`);
      log(`프로젝트 ${projectIndex} 썸네일 없음 → 중단`);
      return;
    }

    const thumbName = `thumb_${projectIndex}.png`;
    const archName = archFile ? `arch_${projectIndex}.png` : "";

    // projects.html 카드
    projectCardsHtml += `
      <div class="project-card">
        <img src="assets/img/${thumbName}" alt="${title}">
        <h3>${title}</h3>
        <p>${summary}</p>
        <p class="tags">${stack}</p>
        <a href="project-detail-${projectIndex}.html">자세히 보기</a>
      </div>
    `;

    // 상세 페이지
    let detailHtml = detailTemplate
      .replace(/{{NAME}}/g, name)
      .replace(/{{PROJECT_TITLE}}/g, title)
      .replace(/{{PROJECT_STACK}}/g, stack)
      .replace(/{{PROJECT_PERIOD}}/g, period)
      .replace(/{{PROJECT_CHALLENGE}}/g, challenge)
      .replace(/{{PROJECT_ACTION}}/g, action)
      .replace(/{{PROJECT_RESULT}}/g, result)
      .replace(/{{PROJECT_SUMMARY}}/g, sm)
      .replace(/{{PROJECT_THUMBNAIL}}/g, `assets/img/${thumbName}`)
      .replace(/{{PROJECT_ARCHITECTURE}}/g, archName ? `assets/img/${archName}` : "");

    detailFiles.push({ name: `project-detail-${projectIndex}.html`, content: detailHtml });

    imgFiles.push({ file: thumbFile, name: thumbName });
    if (archFile) {
      imgFiles.push({ file: archFile, name: archName });
    }

    projectIndex++;
  }

  // 4) index.html 치환
  log("index.html 치환 중...");
  let indexHtml = indexTemplate
    .replace(/{{NAME}}/g, name)
    .replace(/{{ROLE}}/g, role)
    .replace(/{{DESCRIPTION}}/g, desc)
    .replace(/{{EMAIL}}/g, email)
    .replace(/{{CORE_VALUES}}/g, coreList)
    .replace(/{{RESUME_LINK}}/g, resumePath)
    // index.html에서 {{PROJECT_LIST}} 안 쓰고 싶으면 제거해도 됨
    .replace(/{{PROJECT_LIST}}/g, projectCardsHtml);

  // 5) projects.html 치환
  log("projects.html 치환 중...");
  let listHtml = listTemplate
    .replace(/{{NAME}}/g, name)
    .replace(/{{PROJECT_CARDS}}/g, projectCardsHtml);

  // 6) ZIP에 파일 추가
  log("ZIP 파일 구성 중...");
  zip.file("index.html", indexHtml);
  zip.file("projects.html", listHtml);
  zip.file("assets/css/style.css", styleCss);

  detailFiles.forEach(f => {
    zip.file(f.name, f.content);
  });

  // 이미지 폴더
  const imgFolder = zip.folder("assets/img");
  for (const img of imgFiles) {
    const data = await img.file.arrayBuffer();
    imgFolder.file(img.name, data);
  }

  // resume
  if (resumeFile) {
    const resumeData = await resumeFile.arrayBuffer();
    zip.file("assets/resume.pdf", resumeData);
  }

  // 7) ZIP 생성
  log("ZIP 압축 생성 중...");
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "portfolio.zip");
  log("✅ ZIP 생성 완료");
  alert("포트폴리오 ZIP 생성이 완료되었습니다.");
}
