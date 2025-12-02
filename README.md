
---

markdown
# **Minimal Developer Portfolio Template**
A clean and minimal developer portfolio template.  
Customize just **3 HTML files** to launch your personal portfolio instantly.

---

## **Folder Structure**


/assets  
/css/style.css  
/img/    (image folder)

index.html  
projects.html  
project-detail.html  
README.md

---

# **Editable Sections (3 Files)**

Update the following fields in each file with your own information.

---

## **1) index.html**

### **Name**
```

HELLO, I'M <span class="accent">YOUR NAME</span>

```

### **Job Title / Short Introduction**
```

<p class="hero-subtitle">
  Frontend Developer · AI Enthusiast · Problem Solver
</p>
```

### **Core Values**

```
<div class="value-card">Reliability</div>
<div class="value-card">Problem Solving</div>
<div class="value-card">Ownership</div>
<div class="value-card">Quality & Speed</div>
```

### **Email**

```
<p>Email: yourmail@gmail.com</p>
```

### **Resume PDF Link**

```
<a href="resume.pdf" class="resume-button">Download Resume</a>
```

### **Skills**
```
<p class="skill-list">
  HTML · CSS · JavaScript · React · Git · Figma
</p>

```
### **Experience (Timeline)**
```
<div class="timeline-item">
  <span class="timeline-date">2024 – Present</span>
  <p class="timeline-desc">Freelance Developer — Web Development / AI Projects</p>
</div>
```

---

## **2) projects.html**

### **Thumbnail Image**

```
<img src="assets/img/sample1.jpg" alt="Project Thumbnail">
```

### **Project Title**

```
<h3>Portfolio Template</h3>
```

### **Tech Stack**

```
<p class="project-tags">HTML · CSS · Responsive</p>
```

### **Short Description**

```
<p class="project-desc">
  A minimal and responsive portfolio web template.
</p>
```

### **Detail Page Link**

```
<a href="project-detail.html" class="project-card">
```

## **Add the projects**
To add more projects, open projects.html and copy the entire project card block shown below (from <a class="project-card"> to </a>). Paste it under the last card and edit the image, title, tech stack, and description.
```
<a href="project-detail.html" class="project-card" data-type="solo">
  <img src="assets/img/sample1.jpg" alt="Project Thumbnail">
  <h3>Project Title</h3>
  <p class="project-tags">HTML · CSS · Responsive</p>
  <p class="project-desc">A clean and minimal responsive portfolio template.</p>
</a>
```

## **Project Type (Solo / Freelance / Team)**
When adding a new project, choose its type by setting the data-type value inside the project card. This controls how it appears under the filter buttons (All / Solo / Freelance / Team). Use data-type="solo" for personal projects, data-type="freelance" for client work, and data-type="team" for team projects.
```
<a href="project-detail.html" class="project-card" data-type="solo"> … </a>
<a href="project-detail.html" class="project-card" data-type="freelance"> … </a>
<a href="project-detail.html" class="project-card" data-type="team"> … </a>

```


---

## **3) project-detail.html**

### **Project Name**

```
<h2 class="project-title">Project Name</h2>
```

### **Role**

```
<p>Frontend Developer</p>
```

### **Stack**

```
<p>HTML · CSS · JavaScript</p>
```

### **Duration**

```
<p>2024.01 – 2024.03</p>
```

### **C.A.R.D.S Sections**

#### **Challenge**

```
<p>Describe the main problem or challenge of the project.</p>
```

#### **Action**

```
<p>Explain your approach and what you implemented.</p>
```

#### **Result**

```
<p>Mention measurable outcomes or improvements.</p>
```

#### **Design & Architecture**

```
<p>Add structural details or an architecture diagram if needed.</p>
```

#### **Summary**

```
<p>Summarize what you learned and the final takeaway.</p>
```

### **Architecture Image**

```
<img src="assets/img/architecture.png" alt="Architecture Diagram">
```

---

# **How to Replace Images**

All template images are stored in:

```
assets/img/
```

Update the file names in `src="assets/img/filename"` to use your own images.

---

# **Deploying on GitHub Pages**

1. Push the project to your GitHub repository.
2. Go to **Settings → Pages**.
3. Set:

   * **Branch:** `main`
   * **Folder:** `/root`
4. Click **Save**.
5. Your portfolio will be automatically published.
   Example:
   [https://username.github.io/repository-name/](https://username.github.io/repository-name/)

---

# **License**

* Free for personal and commercial use.
* Redistribution or reselling of the template itself is not allowed.

---

# **Contact**

If you need custom modifications or a personalized version of this template, feel free to contact the creator.

Email: **[lzu32437@gmail.com](mailto:lzu32437@gmail.com)**


