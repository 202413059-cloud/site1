document.getElementById("addProjectBtn").addEventListener("click", addProjectBox);
document.getElementById("downloadBtn").addEventListener("click", generatePortfolio);

let projectCount = 0;

// 프로젝트 입력 UI 박스 생성
function addProjectBox() {
    projectCount++;

    const container = document.getElementById("projects");
    const box = document.createElement("div");
    box.classList.add("project-box");

    box.innerHTML = `
        <h3>프로젝트 ${projectCount}</h3>

        <label>프로젝트 제목</label>
        <input type="text" class="p-title">

        <label>한 줄 설명</label>
        <input type="text" class="p-summary">

        <label>스택 (쉼표로 구분)</label>
        <input type="text" class="p-stack">

        <label>기간</label>
        <input type="text" class="p-period">

        <label>Challenge</label>
        <textarea class="p-challenge"></textarea>

        <label>Action</label>
        <textarea class="p-action"></textarea>

        <label>Result</label>
        <textarea class="p-result"></textarea>

        <label>Summary</label>
        <textarea class="p-detail-summary"></textarea>

        <label>썸네일 이미지 업로드</label>
        <input type="file" class="p-thumb" accept="image/*">

        <label>Architecture 이미지 업로드 (선택)</label>
        <input type="file" class="p-arch" accept="image/*">
    `;

    container.appendChild(box);
}

// ZIP 생성
async function generatePortfolio() {
    const zip = new JSZip();

    // ----- 1) template 파일 읽기 -----
    const indexTemplate = await fetch("../template/index.html").then(r => r.text());
    const listTemplate = await fetch("../template/projects.html").then(r => r.text());
    const detailTemplate = await fetch("../template/project-detail.html").then(r => r.text());
    const styleCss = await fetch("../template/assets/css/style.css").then(r => r.text());

    // ----- 2) 사용자 정보 -----
    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;
    const desc = document.getElementById("description").value;
    const email = document.getElementById("email").value;
    const coreValuesRaw = document.getElementById("coreValues").value;

    const coreList = coreValuesRaw.split(",").map(v => `<li>${v.trim()}</li>`).join("");

    // resume
    let resumePath = "assets/resume.pdf";
    const resumeFile = document.getElementById("resume").files[0];

    // ----- 3) 프로젝트 정보 -----
    const projectBoxes = document.querySelectorAll(".project-box");

    let projectCardsHtml = "";
    let detailFiles = [];
    let imgFiles = [];

    let projectIndex = 1;

    for (let box of projectBoxes) {

        const title = box.querySelector(".p-title").value;
        const summary = box.querySelector(".p-summary").value;
        const stack = box.querySelector(".p-stack").value;
        const period = box.querySelector(".p-period").value;
        const challenge = box.querySelector(".p-challenge").value;
        const action = box.querySelector(".p-action").value;
        const result = box.querySelector(".p-result").value;
        const sm = box.querySelector(".p-detail-summary").value;

        const thumbFile = box.querySelector(".p-thumb").files[0];
        const archFile = box.querySelector(".p-arch").files[0];

        // 파일명 자동 생성
        const thumbName = `thumb_${projectIndex}.png`;
        const archName = archFile ? `arch_${projectIndex}.png` : "";

        // 프로젝트 카드 HTML (projects.html용)
        projectCardsHtml += `
        <div class="project-card">
            <img src="assets/img/${thumbName}">
            <h3>${title}</h3>
            <p>${summary}</p>
            <p>${stack}</p>
            <a href="project-detail-${projectIndex}.html">자세히 보기</a>
        </div>
        `;

        // 상세 페이지 HTML
        let detailHtml = detailTemplate
            .replace(/{{PROJECT_TITLE}}/g, title)
            .replace(/{{PROJECT_SUMMARY}}/g, summary)
            .replace(/{{PROJECT_STACK}}/g, stack)
            .replace(/{{PROJECT_PERIOD}}/g, period)
            .replace(/{{PROJECT_CHALLENGE}}/g, challenge)
            .replace(/{{PROJECT_ACTION}}/g, action)
            .replace(/{{PROJECT_RESULT}}/g, result)
            .replace(/{{PROJECT_SUMMARY}}/g, sm)
            .replace(/{{PROJECT_THUMBNAIL}}/g, `assets/img/${thumbName}`)
            .replace(/{{PROJECT_ARCHITECTURE}}/g, archName ? `assets/img/${archName}` : "");

        detailFiles.push({
            name: `project-detail-${projectIndex}.html`,
            content: detailHtml
        });

        // 이미지 파일 처리
        imgFiles.push({ file: thumbFile, name: thumbName });

        if (archFile) {
            imgFiles.push({ file: archFile, name: archName });
        }

        projectIndex++;
    }

    // ----- 4) index.html 치환 -----
    let indexHtml = indexTemplate
        .replace(/{{NAME}}/g, name)
        .replace(/{{ROLE}}/g, role)
        .replace(/{{DESCRIPTION}}/g, desc)
        .replace(/{{EMAIL}}/g, email)
        .replace(/{{CORE_VALUES}}/g, coreList)
        .replace(/{{RESUME_LINK}}/g, resumePath)
        .replace(/{{PROJECT_LIST}}/g, projectCardsHtml);

    // ----- 5) projects.html 치환 -----
    let listHtml = listTemplate
        .replace(/{{NAME}}/g, name)
        .replace(/{{PROJECT_CARDS}}/g, projectCardsHtml);

    // ----- 6) ZIP 구성 -----
    zip.file("index.html", indexHtml);
    zip.file("projects.html", listHtml);

    detailFiles.forEach(f => {
        zip.file(f.name, f.content);
    });

    zip.file("assets/css/style.css", styleCss);

    // resume 처리
    const folder = zip.folder("assets/img");
    for (let img of imgFiles) {
        const data = await img.file.arrayBuffer();
        folder.file(img.name, data);
    }

    if (resumeFile) {
        const resumeData = await resumeFile.arrayBuffer();
        zip.file("assets/resume.pdf", resumeData);
    }

    // ----- 7) ZIP 다운로드 -----
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "portfolio.zip");

    alert("ZIP 파일 생성 완료!");
}

