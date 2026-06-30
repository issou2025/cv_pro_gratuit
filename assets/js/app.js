/* ==========================================================================
   STATE MANAGEMENT & DEFAULT DATA
   ========================================================================== */

// Modèle de données réaliste par défaut pour l'utilisateur
const defaultCVData = {
  fullname: "Jean Dupont",
  jobtitle: "Développeur Web Fullstack",
  email: "jean.dupont@email.com",
  phone: "06 12 34 56 78",
  address: "15 Rue de la Paix, 75002 Paris",
  linkedin: "linkedin.com/in/jeandupont",
  website: "jeandupont.dev",
  photo: null, // Sera encodé en Base64 après import
  summary: "Développeur Web passionné avec plus de 5 ans d'expérience dans le développement d'applications web performantes et intuitives. Spécialisé en JavaScript (React, Node.js) et passionné par l'UX/UI. Rigoureux et adepte du travail en équipe agile.",
  
  experiences: [
    {
      id: "exp-1",
      role: "Développeur Web Senior",
      company: "Tech Solutions",
      location: "Paris, France",
      startDate: "2023",
      endDate: "Présent",
      description: "• Conception et développement de la nouvelle plateforme e-commerce en React et Node.js.\n• Amélioration de 40% des performances de chargement des pages en optimisant le code.\n• Encadrement et mentorat de 3 développeurs juniors au sein de l'équipe."
    },
    {
      id: "exp-2",
      role: "Développeur Web Front-End",
      company: "WebAgency",
      location: "Lyon, France",
      startDate: "2021",
      endDate: "2023",
      description: "• Intégration de maquettes Figma complexes avec du HTML/CSS et JS pur et responsive.\n• Collaboration étroite avec l'équipe design pour améliorer l'expérience utilisateur.\n• Maintenance corrective et évolutive de plus de 20 sites clients."
    }
  ],
  
  educations: [
    {
      id: "edu-1",
      degree: "Master en Informatique - Spécialité Web",
      school: "Université Paris-Sorbonne",
      location: "Paris, France",
      startDate: "2018",
      endDate: "2020",
      description: "Mention Très Bien. Spécialisation développement web avancé, bases de données et sécurité informatique."
    },
    {
      id: "edu-2",
      degree: "Licence professionnelle Métiers de l'Internet",
      school: "IUT de Lyon",
      location: "Lyon, France",
      startDate: "2015",
      endDate: "2018",
      description: "Projet de fin d'études : Création d'un CMS léger open-source."
    }
  ],
  
  skills: "HTML5, CSS3, JavaScript, React.js, Node.js, Git, SQL, Figma, UI/UX",
  
  languages: [
    { id: "lang-1", name: "Français", level: "Langue maternelle" },
    { id: "lang-2", name: "Anglais", level: "Courant (C1 - TOEIC 945)" }
  ],
  
  certifications: [
    { id: "cert-1", title: "AWS Certified Developer", organization: "Amazon Web Services", year: "2024" },
    { id: "cert-2", title: "Professional Scrum Master I", organization: "Scrum.org", year: "2022" }
  ],
  
  projects: [
    { id: "proj-1", name: "Portfolio Interactif 3D", description: "Création d'un portfolio en ligne immersif utilisant WebGL et Three.js.", year: "2024" },
    { id: "proj-2", name: "TaskFlow - Gestion de tâches", description: "Application de productivité collaborative type Trello en JavaScript pur et WebSockets.", year: "2023" }
  ],
  
  interests: "Randonnée, Photographie argentique, Contribution Open Source, Échecs",
  
  // Paramètres visuels
  theme: "modern",
  accentColor: "#2563eb",
  fontSize: "14px",
  fontFamily: "var(--font-cv-sans)",
  showPhoto: true,
  twoColumns: false
};

// Variable d'état global
let state = {};

// Sauvegarde de secours manuelle
let manualBackup = null;

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  loadState();
  initFormValues();
  renderAllDynamicLists();
  initSettingsUI();
  setupEventListeners();
  renderCV();
}

// Charger l'état depuis localStorage ou utiliser les données par défaut
function loadState() {
  const savedState = localStorage.getItem("cv_gratuit_pro_data");
  if (savedState) {
    try {
      state = JSON.parse(savedState);
      // Fusionner avec defaultCVData pour ajouter les nouveaux champs s'ils manquent
      state = { ...defaultCVData, ...state };
    } catch (e) {
      console.error("Erreur lors de la lecture du LocalStorage, réinitialisation...", e);
      state = JSON.parse(JSON.stringify(defaultCVData));
    }
  } else {
    // Premier chargement : copie profonde des données par défaut
    state = JSON.parse(JSON.stringify(defaultCVData));
  }
}

// Enregistrer les données dans localStorage
function saveState() {
  localStorage.setItem("cv_gratuit_pro_data", JSON.stringify(state));
}

// Initialiser les valeurs des inputs statiques
function initFormValues() {
  document.getElementById("input-fullname").value = state.fullname || "";
  document.getElementById("input-jobtitle").value = state.jobtitle || "";
  document.getElementById("input-email").value = state.email || "";
  document.getElementById("input-phone").value = state.phone || "";
  document.getElementById("input-address").value = state.address || "";
  document.getElementById("input-linkedin").value = state.linkedin || "";
  document.getElementById("input-website").value = state.website || "";
  document.getElementById("input-summary").value = state.summary || "";
  document.getElementById("input-skills").value = state.skills || "";
  document.getElementById("input-interests").value = state.interests || "";
  
  if (state.photo) {
    document.getElementById("photo-preview").src = state.photo;
    document.getElementById("btn-remove-photo").style.display = "inline-flex";
  } else {
    document.getElementById("photo-preview").src = "assets/img/placeholder.svg";
    document.getElementById("btn-remove-photo").style.display = "none";
  }
}

// Initialiser l'état des options de personnalisation dans l'interface
function initSettingsUI() {
  // Sélection du thème
  const themeSelect = document.getElementById("select-theme");
  if (themeSelect) themeSelect.value = state.theme;
  
  // Sélection de la taille de police
  const fontSizeSelect = document.getElementById("select-font-size");
  if (fontSizeSelect) fontSizeSelect.value = state.fontSize;
  
  // Sélection de la police
  const fontSelect = document.getElementById("select-font-family");
  if (fontSelect) fontSelect.value = state.fontFamily;
  
  // Toggle de la photo
  const togglePhotoCheckbox = document.getElementById("toggle-photo");
  if (togglePhotoCheckbox) togglePhotoCheckbox.checked = state.showPhoto;
  
  // Toggle de la mise en page en 2 colonnes
  const toggleColumnsCheckbox = document.getElementById("toggle-columns");
  if (toggleColumnsCheckbox) toggleColumnsCheckbox.checked = state.twoColumns;
  
  // Activer la bonne couleur dans la palette
  const colorOptions = document.querySelectorAll(".color-option");
  colorOptions.forEach(opt => {
    if (opt.getAttribute("data-color") === state.accentColor) {
      opt.classList.add("active");
    } else {
      opt.classList.remove("active");
    }
  });

  // Appliquer le style css dynamique initial
  document.documentElement.style.setProperty('--cv-accent-color', state.accentColor);
  document.documentElement.style.setProperty('--cv-font-size', state.fontSize);
  document.documentElement.style.setProperty('--cv-font-family', state.fontFamily);
}

/* ==========================================================================
   DYNAMIC LISTS RENDERERS (FORM SIDEBAR)
   ========================================================================== */

function renderAllDynamicLists() {
  renderExperiencesList();
  renderEducationsList();
  renderLanguagesList();
  renderCertificationsList();
  renderProjectsList();
}

// Expériences
function renderExperiencesList() {
  const container = document.getElementById("experience-list");
  container.innerHTML = "";
  
  state.experiences.forEach((exp, index) => {
    const item = document.createElement("div");
    item.className = "list-item-card";
    item.innerHTML = `
      <div class="list-item-header">
        <span class="list-item-title">Expérience #${index + 1}</span>
        <button type="button" class="btn-remove-item" onclick="removeExperience('${exp.id}')" title="Supprimer cette expérience">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="form-group-grid">
        <div class="form-group">
          <label>Poste occupé</label>
          <input type="text" class="form-control exp-input" data-id="${exp.id}" data-field="role" value="${exp.role || ''}" placeholder="ex: Développeur Web">
        </div>
        <div class="form-group">
          <label>Entreprise</label>
          <input type="text" class="form-control exp-input" data-id="${exp.id}" data-field="company" value="${exp.company || ''}" placeholder="ex: Tech Solutions">
        </div>
        <div class="form-group">
          <label>Ville / Pays</label>
          <input type="text" class="form-control exp-input" data-id="${exp.id}" data-field="location" value="${exp.location || ''}" placeholder="ex: Paris, France">
        </div>
        <div class="form-group">
          <label>Période (Début - Fin)</label>
          <input type="text" class="form-control exp-input" data-id="${exp.id}" data-field="dates" value="${(exp.startDate || '') + (exp.endDate ? ' - ' + exp.endDate : '')}" placeholder="ex: 2021 - 2023 ou 08/2022 - Présent">
        </div>
        <div class="form-group form-group-full">
          <label>Description des missions</label>
          <textarea class="form-control exp-input" data-id="${exp.id}" data-field="description" placeholder="• Mission 1...\n• Mission 2...">${exp.description || ''}</textarea>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
  
  // Liaison des écouteurs sur les nouveaux inputs
  document.querySelectorAll(".exp-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = e.target.getAttribute("data-id");
      const field = e.target.getAttribute("data-field");
      const val = e.target.value;
      
      const exp = state.experiences.find(x => x.id === id);
      if (exp) {
        if (field === "dates") {
          // Extraire dates de début et fin pour retrocompatibilité
          const parts = val.split("-");
          exp.startDate = parts[0] ? parts[0].trim() : "";
          exp.endDate = parts[1] ? parts[1].trim() : "";
        } else {
          exp[field] = val;
        }
        saveState();
        renderCV();
      }
    });
  });
}

function addExperience() {
  const newExp = {
    id: "exp-" + Date.now(),
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: ""
  };
  state.experiences.push(newExp);
  saveState();
  renderExperiencesList();
  renderCV();
}

window.removeExperience = function(id) {
  state.experiences = state.experiences.filter(x => x.id !== id);
  saveState();
  renderExperiencesList();
  renderCV();
};

// Formations
function renderEducationsList() {
  const container = document.getElementById("education-list");
  container.innerHTML = "";
  
  state.educations.forEach((edu, index) => {
    const item = document.createElement("div");
    item.className = "list-item-card";
    item.innerHTML = `
      <div class="list-item-header">
        <span class="list-item-title">Formation #${index + 1}</span>
        <button type="button" class="btn-remove-item" onclick="removeEducation('${edu.id}')" title="Supprimer cette formation">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="form-group-grid">
        <div class="form-group">
          <label>Diplôme / Spécialité</label>
          <input type="text" class="form-control edu-input" data-id="${edu.id}" data-field="degree" value="${edu.degree || ''}" placeholder="ex: Master Informatique">
        </div>
        <div class="form-group">
          <label>École / Université</label>
          <input type="text" class="form-control edu-input" data-id="${edu.id}" data-field="school" value="${edu.school || ''}" placeholder="ex: Sorbonne">
        </div>
        <div class="form-group">
          <label>Ville / Pays</label>
          <input type="text" class="form-control edu-input" data-id="${edu.id}" data-field="location" value="${edu.location || ''}" placeholder="ex: Paris, France">
        </div>
        <div class="form-group">
          <label>Période (Début - Fin)</label>
          <input type="text" class="form-control edu-input" data-id="${edu.id}" data-field="dates" value="${(edu.startDate || '') + (edu.endDate ? ' - ' + edu.endDate : '')}" placeholder="ex: 2018 - 2020">
        </div>
        <div class="form-group form-group-full">
          <label>Description optionnelle</label>
          <textarea class="form-control edu-input" data-id="${edu.id}" data-field="description" placeholder="Optionnel : Spécialisation, mentions, etc.">${edu.description || ''}</textarea>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
  
  document.querySelectorAll(".edu-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = e.target.getAttribute("data-id");
      const field = e.target.getAttribute("data-field");
      const val = e.target.value;
      
      const edu = state.educations.find(x => x.id === id);
      if (edu) {
        if (field === "dates") {
          const parts = val.split("-");
          edu.startDate = parts[0] ? parts[0].trim() : "";
          edu.endDate = parts[1] ? parts[1].trim() : "";
        } else {
          edu[field] = val;
        }
        saveState();
        renderCV();
      }
    });
  });
}

function addEducation() {
  const newEdu = {
    id: "edu-" + Date.now(),
    degree: "",
    school: "",
    location: "",
    startDate: "",
    endDate: "",
    description: ""
  };
  state.educations.push(newEdu);
  saveState();
  renderEducationsList();
  renderCV();
}

window.removeEducation = function(id) {
  state.educations = state.educations.filter(x => x.id !== id);
  saveState();
  renderEducationsList();
  renderCV();
};

// Langues
function renderLanguagesList() {
  const container = document.getElementById("languages-list");
  container.innerHTML = "";
  
  state.languages.forEach((lang, index) => {
    const item = document.createElement("div");
    item.className = "list-item-card";
    item.innerHTML = `
      <div class="list-item-header">
        <span class="list-item-title">Langue #${index + 1}</span>
        <button type="button" class="btn-remove-item" onclick="removeLanguage('${lang.id}')" title="Supprimer cette langue">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="form-group-grid">
        <div class="form-group">
          <label>Langue</label>
          <input type="text" class="form-control lang-input" data-id="${lang.id}" data-field="name" value="${lang.name || ''}" placeholder="ex: Anglais">
        </div>
        <div class="form-group">
          <label>Niveau</label>
          <input type="text" class="form-control lang-input" data-id="${lang.id}" data-field="level" value="${lang.level || ''}" placeholder="ex: Courant (C1) ou Intermédiaire">
        </div>
      </div>
    `;
    container.appendChild(item);
  });
  
  document.querySelectorAll(".lang-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = e.target.getAttribute("data-id");
      const field = e.target.getAttribute("data-field");
      const val = e.target.value;
      
      const lang = state.languages.find(x => x.id === id);
      if (lang) {
        lang[field] = val;
        saveState();
        renderCV();
      }
    });
  });
}

function addLanguage() {
  const newLang = {
    id: "lang-" + Date.now(),
    name: "",
    level: ""
  };
  state.languages.push(newLang);
  saveState();
  renderLanguagesList();
  renderCV();
}

window.removeLanguage = function(id) {
  state.languages = state.languages.filter(x => x.id !== id);
  saveState();
  renderLanguagesList();
  renderCV();
};

// Certifications
function renderCertificationsList() {
  const container = document.getElementById("certifications-list");
  container.innerHTML = "";
  
  state.certifications.forEach((cert, index) => {
    const item = document.createElement("div");
    item.className = "list-item-card";
    item.innerHTML = `
      <div class="list-item-header">
        <span class="list-item-title">Certification #${index + 1}</span>
        <button type="button" class="btn-remove-item" onclick="removeCertification('${cert.id}')" title="Supprimer cette certification">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="form-group-grid">
        <div class="form-group form-group-full">
          <label>Titre de la certification</label>
          <input type="text" class="form-control cert-input" data-id="${cert.id}" data-field="title" value="${cert.title || ''}" placeholder="ex: AWS Certified Cloud Practitioner">
        </div>
        <div class="form-group">
          <label>Organisme certificateur</label>
          <input type="text" class="form-control cert-input" data-id="${cert.id}" data-field="organization" value="${cert.organization || ''}" placeholder="ex: Amazon Web Services">
        </div>
        <div class="form-group">
          <label>Année</label>
          <input type="text" class="form-control cert-input" data-id="${cert.id}" data-field="year" value="${cert.year || ''}" placeholder="ex: 2024">
        </div>
      </div>
    `;
    container.appendChild(item);
  });
  
  document.querySelectorAll(".cert-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = e.target.getAttribute("data-id");
      const field = e.target.getAttribute("data-field");
      const val = e.target.value;
      
      const cert = state.certifications.find(x => x.id === id);
      if (cert) {
        cert[field] = val;
        saveState();
        renderCV();
      }
    });
  });
}

function addCertification() {
  const newCert = {
    id: "cert-" + Date.now(),
    title: "",
    organization: "",
    year: ""
  };
  state.certifications.push(newCert);
  saveState();
  renderCertificationsList();
  renderCV();
}

window.removeCertification = function(id) {
  state.certifications = state.certifications.filter(x => x.id !== id);
  saveState();
  renderCertificationsList();
  renderCV();
};

// Projets
function renderProjectsList() {
  const container = document.getElementById("projects-list");
  container.innerHTML = "";
  
  state.projects.forEach((proj, index) => {
    const item = document.createElement("div");
    item.className = "list-item-card";
    item.innerHTML = `
      <div class="list-item-header">
        <span class="list-item-title">Projet #${index + 1}</span>
        <button type="button" class="btn-remove-item" onclick="removeProject('${proj.id}')" title="Supprimer ce projet">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="form-group-grid">
        <div class="form-group">
          <label>Nom du projet</label>
          <input type="text" class="form-control proj-input" data-id="${proj.id}" data-field="name" value="${proj.name || ''}" placeholder="ex: Application Web de Facturation">
        </div>
        <div class="form-group">
          <label>Année de réalisation</label>
          <input type="text" class="form-control proj-input" data-id="${proj.id}" data-field="year" value="${proj.year || ''}" placeholder="ex: 2023">
        </div>
        <div class="form-group form-group-full">
          <label>Brève description du projet</label>
          <textarea class="form-control proj-input" data-id="${proj.id}" data-field="description" placeholder="ex: Développement d'un outil complet en HTML/CSS/JS pour automatiser la génération de factures clients.">${proj.description || ''}</textarea>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
  
  document.querySelectorAll(".proj-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = e.target.getAttribute("data-id");
      const field = e.target.getAttribute("data-field");
      const val = e.target.value;
      
      const proj = state.projects.find(x => x.id === id);
      if (proj) {
        proj[field] = val;
        saveState();
        renderCV();
      }
    });
  });
}

function addProject() {
  const newProj = {
    id: "proj-" + Date.now(),
    name: "",
    description: "",
    year: ""
  };
  state.projects.push(newProj);
  saveState();
  renderProjectsList();
  renderCV();
}

window.removeProject = function(id) {
  state.projects = state.projects.filter(x => x.id !== id);
  saveState();
  renderProjectsList();
  renderCV();
};


/* ==========================================================================
   EVENT LISTENERS & ACTIONS
   ========================================================================== */

function setupEventListeners() {
  
  // 1. Text Inputs Binding
  bindInput("input-fullname", "fullname");
  bindInput("input-jobtitle", "jobtitle");
  bindInput("input-email", "email");
  bindInput("input-phone", "phone");
  bindInput("input-address", "address");
  bindInput("input-linkedin", "linkedin");
  bindInput("input-website", "website");
  bindInput("input-summary", "summary");
  bindInput("input-skills", "skills");
  bindInput("input-interests", "interests");
  
  // 2. Buttons to add dynamic items
  document.getElementById("btn-add-experience").addEventListener("click", addExperience);
  document.getElementById("btn-add-education").addEventListener("click", addEducation);
  document.getElementById("btn-add-language").addEventListener("click", addLanguage);
  document.getElementById("btn-add-certification").addEventListener("click", addCertification);
  document.getElementById("btn-add-project").addEventListener("click", addProject);
  
  // 3. Photo Import & Remove
  document.getElementById("input-photo").addEventListener("change", handlePhotoUpload);
  document.getElementById("btn-remove-photo").addEventListener("click", handlePhotoRemove);
  
  // 4. Personalization Bar Events
  document.getElementById("select-theme").addEventListener("change", (e) => {
    state.theme = e.target.value;
    // Mettre aussi à jour l'état actif des cartes templates en haut du site
    updateTemplateCardsActiveState(state.theme);
    saveState();
    renderCV();
  });
  
  document.getElementById("select-font-size").addEventListener("change", (e) => {
    state.fontSize = e.target.value;
    document.documentElement.style.setProperty('--cv-font-size', state.fontSize);
    saveState();
    renderCV();
  });
  
  document.getElementById("select-font-family").addEventListener("change", (e) => {
    state.fontFamily = e.target.value;
    document.documentElement.style.setProperty('--cv-font-family', state.fontFamily);
    saveState();
    renderCV();
  });
  
  document.getElementById("toggle-photo").addEventListener("change", (e) => {
    state.showPhoto = e.target.checked;
    saveState();
    renderCV();
  });
  
  document.getElementById("toggle-columns").addEventListener("change", (e) => {
    state.twoColumns = e.target.checked;
    saveState();
    renderCV();
  });

  // Color picker selection
  document.querySelectorAll(".color-option").forEach(option => {
    option.addEventListener("click", (e) => {
      document.querySelectorAll(".color-option").forEach(o => o.classList.remove("active"));
      e.target.classList.add("active");
      state.accentColor = e.target.getAttribute("data-color");
      document.documentElement.style.setProperty('--cv-accent-color', state.accentColor);
      saveState();
      renderCV();
    });
  });

  // 5. Template Showcase Card clicks
  document.querySelectorAll(".template-card").forEach(card => {
    card.addEventListener("click", () => {
      const selectedTpl = card.getAttribute("data-template");
      state.theme = selectedTpl;
      
      // Mettre à jour les deux selecteurs (celui des options et le visuel actif)
      document.getElementById("select-theme").value = selectedTpl;
      updateTemplateCardsActiveState(selectedTpl);
      
      saveState();
      renderCV();
      
      // Scroll doux vers l'aperçu si on clique en haut du site
      const element = document.getElementById("generateur");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      showToast("Modèle de CV appliqué avec succès !", "info");
    });
  });
  
  // 6. Local Storage Operations
  document.getElementById("btn-save-local").addEventListener("click", () => {
    manualBackup = JSON.parse(JSON.stringify(state));
    localStorage.setItem("cv_gratuit_pro_manual_backup", JSON.stringify(manualBackup));
    showToast("CV sauvegardé avec succès ! Vos données sont prêtes à être restaurées.");
  });
  
  document.getElementById("btn-restore-local").addEventListener("click", () => {
    const backupStr = localStorage.getItem("cv_gratuit_pro_manual_backup");
    if (backupStr) {
      manualBackup = JSON.parse(backupStr);
      state = JSON.parse(JSON.stringify(manualBackup));
      saveState();
      initApp();
      showToast("Dernière sauvegarde restaurée !");
    } else {
      showToast("Aucune sauvegarde manuelle trouvée. Cliquez sur 'Sauvegarder' d'abord.", "info");
    }
  });
  
  document.getElementById("btn-reset-data").addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment vider le CV et effacer toutes vos données de ce navigateur ?")) {
      // Vider les données : On réinitialise avec un profil vierge
      const emptyState = {
        fullname: "", jobtitle: "", email: "", phone: "", address: "", linkedin: "", website: "",
        photo: null, summary: "", experiences: [], educations: [], skills: "", languages: [],
        certifications: [], projects: [], interests: "",
        theme: "modern", accentColor: "#2563eb", fontSize: "14px", fontFamily: "var(--font-cv-sans)",
        showPhoto: true, twoColumns: false
      };
      state = emptyState;
      saveState();
      initApp();
      showToast("Formulaire de CV réinitialisé à blanc !", "info");
    }
  });

  // 7. PDF Printing Action
  document.getElementById("btn-download-pdf").addEventListener("click", () => {
    // Si l'utilisateur n'a pas mis de nom complet, alerte légère
    if (!state.fullname) {
      showToast("Conseil : Ajoutez votre nom avant d'exporter en PDF.", "info");
    }
    
    // Déclencher l'impression native du navigateur
    window.print();
  });

  // 8. Collapsible Sidebar Panels Accordion
  document.querySelectorAll(".form-card-header").forEach(header => {
    header.addEventListener("click", () => {
      const parent = header.parentElement;
      const wasCollapsed = parent.classList.contains("collapsed");
      
      // Refermer tous les autres accordéons
      document.querySelectorAll(".form-card").forEach(c => {
        c.classList.add("collapsed");
      });
      
      // Si le panneau cliqué était fermé, l'ouvrir
      if (wasCollapsed) {
        parent.classList.remove("collapsed");
      }
    });
  });

  // 9. FAQ Accordions Toggles
  document.querySelectorAll(".faq-question").forEach(q => {
    q.addEventListener("click", () => {
      const parent = q.parentElement;
      const isOpen = parent.classList.contains("open");
      
      document.querySelectorAll(".faq-item").forEach(item => {
        item.classList.remove("open");
      });
      
      if (!isOpen) {
        parent.classList.add("open");
      }
    });
  });

  // 10. Scroll to top button visibility and action
  const scrollTopBtn = document.getElementById("btn-scroll-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });
  
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 11. Responsive Hamburger Menu Toggle
  const hamburger = document.getElementById("hamburger-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    // Changement d'icône hamburger
    hamburger.querySelectorAll("span").forEach((span, idx) => {
      if (mobileMenu.classList.contains("open")) {
        if (idx === 0) span.style.transform = "rotate(45deg) translate(6px, 6px)";
        if (idx === 1) span.style.opacity = "0";
        if (idx === 2) span.style.transform = "rotate(-45deg) translate(6px, -6px)";
      } else {
        span.style.transform = "none";
        span.style.opacity = "1";
      }
    });
  });

  // 12. Navigation par onglets mobiles pour le générateur
  const tabButtons = document.querySelectorAll(".generator-tabs-nav .tab-btn");
  const generatorGrid = document.querySelector(".generator-grid");
  
  if (generatorGrid) {
    generatorGrid.classList.add("show-editor");
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const targetTab = btn.getAttribute("data-tab");
      if (targetTab === "preview") {
        generatorGrid.classList.remove("show-editor");
        generatorGrid.classList.add("show-preview");
        renderCV(); // Regénérer et adapter
      } else {
        generatorGrid.classList.remove("show-preview");
        generatorGrid.classList.add("show-editor");
      }
    });
  });

  // 13. Mettre à l'échelle sur redimensionnement
  window.addEventListener("resize", scaleCVPreview);
}

// Fonction utilitaire pour synchroniser les inputs textes de l'état
function bindInput(elementId, stateProperty) {
  const el = document.getElementById(elementId);
  if (el) {
    el.addEventListener("input", (e) => {
      state[stateProperty] = e.target.value;
      saveState();
      renderCV();
    });
  }
}

// Synchroniser les cartes templates actives en haut
function updateTemplateCardsActiveState(activeTheme) {
  document.querySelectorAll(".template-card").forEach(c => {
    if (c.getAttribute("data-template") === activeTheme) {
      c.classList.add("active");
    } else {
      c.classList.remove("active");
    }
  });
}

// Photo Upload Handler (Conversion en Base64)
function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  if (file.size > 2 * 1024 * 1024) {
    showToast("Erreur : L'image dépasse 2 Mo !", "danger");
    e.target.value = "";
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const base64Data = event.target.result;
    state.photo = base64Data;
    saveState();
    
    document.getElementById("photo-preview").src = base64Data;
    document.getElementById("btn-remove-photo").style.display = "inline-flex";
    
    renderCV();
    showToast("Photo ajoutée avec succès !");
  };
  reader.readAsDataURL(file);
}

// Photo Delete Handler
function handlePhotoRemove() {
  state.photo = null;
  saveState();
  
  document.getElementById("photo-preview").src = "assets/img/placeholder.svg";
  document.getElementById("btn-remove-photo").style.display = "none";
  document.getElementById("input-photo").value = "";
  
  renderCV();
  showToast("Photo supprimée.", "info");
}

// Toast Notifications popup
function showToast(message, type = "success") {
  const toast = document.getElementById("alert-toast");
  const msgSpan = document.getElementById("toast-message");
  
  msgSpan.textContent = message;
  toast.className = `alert-toast show toast-${type}`;
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}


/* ==========================================================================
   CV TEMPLATES COMPILING ENGINE (HTML GENERATION)
   ========================================================================== */

function renderCV() {
  const cvSheet = document.getElementById("cv-document-sheet");
  if (!cvSheet) return;
  
  // Appliquer le type de template comme classe CSS sur la feuille de style
  cvSheet.className = `cv-document template-${state.theme}`;
  
  // Compiler le code HTML en fonction du thème sélectionné
  let htmlContent = "";
  
  switch(state.theme) {
    case "classic":
      htmlContent = compileClassicTemplate();
      break;
    case "elegant":
      htmlContent = compileElegantTemplate();
      break;
    case "minimalist":
      htmlContent = compileMinimalistTemplate();
      break;
    case "modern":
    default:
      htmlContent = compileModernTemplate();
      break;
  }
  
  cvSheet.innerHTML = htmlContent;
  
  // Lancer l'adaptation d'échelle après injection HTML
  setTimeout(scaleCVPreview, 50);
}

// Mettre à l'échelle le CV A4 sur mobile pour l'intégrer proprement
function scaleCVPreview() {
  const wrapper = document.querySelector(".cv-scale-wrapper");
  const sheet = document.getElementById("cv-document-sheet");
  if (!wrapper || !sheet) return;
  
  const wrapperWidth = wrapper.clientWidth;
  const sheetWidth = 794; // Largeur de référence A4 en pixels
  
  if (wrapperWidth > 0 && wrapperWidth < sheetWidth) {
    const scale = wrapperWidth / sheetWidth;
    sheet.style.transform = `scale(${scale})`;
    sheet.style.transformOrigin = "top left";
    sheet.style.width = `${sheetWidth}px`;
    sheet.style.minWidth = `${sheetWidth}px`;
    
    // Correction de hauteur du parent pour éviter le blanc sous l'élément scalé
    const scaledHeight = sheet.offsetHeight * scale;
    wrapper.style.height = `${scaledHeight}px`;
  } else {
    sheet.style.transform = "none";
    sheet.style.width = "100%";
    sheet.style.minWidth = "auto";
    wrapper.style.height = "auto";
  }
}

// Helper: SVG Icons for CV contacts representation (inline vector representation to avoid print losses)
const contactIcons = {
  email: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  address: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
  website: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
};

// Helper: Compile general sections (Experience, Education, Projects, Certifications)
function compileExperiencesHTML() {
  if (!state.experiences || state.experiences.length === 0) return "";
  
  let itemsHTML = state.experiences.map(exp => {
    // Si pas de poste ni d'entreprise, ne pas afficher une case vide
    if (!exp.role && !exp.company) return "";
    
    return `
      <div class="cv-item">
        <div class="cv-item-header">
          <div>
            <span class="cv-item-title">${exp.role || "Poste sans titre"}</span>
            <span class="cv-item-meta">${exp.company ? ' | ' + exp.company : ''}${exp.location ? ' - ' + exp.location : ''}</span>
          </div>
          <span class="cv-item-date">${exp.startDate ? exp.startDate : ''}${exp.endDate ? ' - ' + exp.endDate : ''}</span>
        </div>
        ${exp.description ? `<p class="cv-item-desc">${exp.description}</p>` : ''}
      </div>
    `;
  }).join("");
  
  if (itemsHTML.replace(/\s/g, "") === "") return "";
  
  return `
    <div class="cv-section">
      <h3 class="cv-section-title">Expériences Professionnelles</h3>
      <div class="cv-list">
        ${itemsHTML}
      </div>
    </div>
  `;
}

function compileEducationsHTML() {
  if (!state.educations || state.educations.length === 0) return "";
  
  let itemsHTML = state.educations.map(edu => {
    if (!edu.degree && !edu.school) return "";
    
    return `
      <div class="cv-item">
        <div class="cv-item-header">
          <div>
            <span class="cv-item-title">${edu.degree || "Diplôme"}</span>
            <span class="cv-item-meta">${edu.school ? ' | ' + edu.school : ''}${edu.location ? ' - ' + edu.location : ''}</span>
          </div>
          <span class="cv-item-date">${edu.startDate ? edu.startDate : ''}${edu.endDate ? ' - ' + edu.endDate : ''}</span>
        </div>
        ${edu.description ? `<p class="cv-item-desc">${edu.description}</p>` : ''}
      </div>
    `;
  }).join("");
  
  if (itemsHTML.replace(/\s/g, "") === "") return "";
  
  return `
    <div class="cv-section">
      <h3 class="cv-section-title">Formations</h3>
      <div class="cv-list">
        ${itemsHTML}
      </div>
    </div>
  `;
}

function compileProjectsHTML() {
  if (!state.projects || state.projects.length === 0) return "";
  
  let itemsHTML = state.projects.map(proj => {
    if (!proj.name) return "";
    return `
      <div class="cv-item">
        <div class="cv-item-header">
          <span class="cv-item-title">${proj.name}</span>
          <span class="cv-item-date">${proj.year || ''}</span>
        </div>
        ${proj.description ? `<p class="cv-item-desc">${proj.description}</p>` : ''}
      </div>
    `;
  }).join("");
  
  if (itemsHTML.replace(/\s/g, "") === "") return "";
  
  return `
    <div class="cv-section">
      <h3 class="cv-section-title">Projets Réalisés</h3>
      <div class="cv-list">
        ${itemsHTML}
      </div>
    </div>
  `;
}

function compileCertificationsHTML() {
  if (!state.certifications || state.certifications.length === 0) return "";
  
  let itemsHTML = state.certifications.map(cert => {
    if (!cert.title) return "";
    return `
      <div class="cv-sublist-item">
        <div>
          <span class="cv-sublist-item-main">${cert.title}</span>
          <span class="cv-sublist-item-sub">${cert.organization ? ' — ' + cert.organization : ''}</span>
        </div>
        <span class="cv-item-date">${cert.year || ''}</span>
      </div>
    `;
  }).join("");
  
  if (itemsHTML.replace(/\s/g, "") === "") return "";
  
  return `
    <div class="cv-section">
      <h3 class="cv-section-title">Certifications</h3>
      <div class="cv-sublist-grid">
        ${itemsHTML}
      </div>
    </div>
  `;
}

function compileSkillsHTML() {
  if (!state.skills || state.skills.trim() === "") return "";
  
  const badgesHTML = state.skills.split(",").map(skill => {
    const trimmed = skill.trim();
    if (!trimmed) return "";
    return `<span class="cv-badge-item">${trimmed}</span>`;
  }).join("");
  
  return `
    <div class="cv-section">
      <h3 class="cv-section-title">Compétences</h3>
      <div class="cv-badges-list">
        ${badgesHTML}
      </div>
    </div>
  `;
}

function compileLanguagesHTML() {
  if (!state.languages || state.languages.length === 0) return "";
  
  let itemsHTML = state.languages.map(lang => {
    if (!lang.name) return "";
    return `
      <div class="cv-sublist-item">
        <span class="cv-sublist-item-main">${lang.name}</span>
        <span class="cv-sublist-item-sub">${lang.level || ''}</span>
      </div>
    `;
  }).join("");
  
  if (itemsHTML.replace(/\s/g, "") === "") return "";
  
  return `
    <div class="cv-section">
      <h3 class="cv-section-title">Langues</h3>
      <div class="cv-sublist-grid">
        ${itemsHTML}
      </div>
    </div>
  `;
}

function compileInterestsHTML() {
  if (!state.interests || state.interests.trim() === "") return "";
  
  const badgesHTML = state.interests.split(",").map(interest => {
    const trimmed = interest.trim();
    if (!trimmed) return "";
    return `<span class="cv-badge-item">${trimmed}</span>`;
  }).join("");
  
  return `
    <div class="cv-section">
      <h3 class="cv-section-title">Centres d'intérêt</h3>
      <div class="cv-badges-list">
        ${badgesHTML}
      </div>
    </div>
  `;
}

// Contacts section HTML standard
function compileContactsHTML() {
  let contacts = [];
  if (state.email) contacts.push(`<span class="cv-contact-item">${contactIcons.email} ${state.email}</span>`);
  if (state.phone) contacts.push(`<span class="cv-contact-item">${contactIcons.phone} ${state.phone}</span>`);
  if (state.address) contacts.push(`<span class="cv-contact-item">${contactIcons.address} ${state.address}</span>`);
  if (state.linkedin) contacts.push(`<span class="cv-contact-item">${contactIcons.linkedin} ${state.linkedin}</span>`);
  if (state.website) contacts.push(`<span class="cv-contact-item">${contactIcons.website} ${state.website}</span>`);
  
  if (contacts.length === 0) return "";
  return `<div class="cv-contacts-bar">${contacts.join("")}</div>`;
}

// Photo de profil HTML standard
function compileProfilePhotoHTML(className = "") {
  if (state.showPhoto && state.photo) {
    return `
      <div class="cv-profile-photo-wrapper ${className}">
        <img src="${state.photo}" alt="${state.fullname || 'Photo'}">
      </div>
    `;
  }
  return "";
}


/* --------------------------------------------------------------------------
   TEMPLATE 1 : MODÈLE CLASSIQUE (1 COLONNE CENTRÉE)
   -------------------------------------------------------------------------- */
function compileClassicTemplate() {
  const photoHTML = compileProfilePhotoHTML("classic-photo");
  const contactsHTML = compileContactsHTML();
  
  const detailsGridClass = state.twoColumns ? "cv-grid two-columns" : "cv-grid";
  
  return `
    <div class="cv-header">
      <div class="cv-header-flex" style="justify-content: center; text-align: center;">
        ${photoHTML}
        <div>
          <h1 class="cv-name">${state.fullname || "Votre Nom complet"}</h1>
          <h2 class="cv-title" style="color: var(--cv-accent-color);">${state.jobtitle || "Intitulé du poste"}</h2>
        </div>
      </div>
      ${contactsHTML}
    </div>
    
    ${state.summary ? `<p class="cv-summary" style="text-align: center;">${state.summary}</p>` : ''}
    
    ${compileExperiencesHTML()}
    ${compileEducationsHTML()}
    
    <div class="${detailsGridClass}">
      ${compileSkillsHTML()}
      ${compileLanguagesHTML()}
      ${compileCertificationsHTML()}
      ${compileProjectsHTML()}
      ${compileInterestsHTML()}
    </div>
  `;
}


/* --------------------------------------------------------------------------
   TEMPLATE 2 : MODÈLE MODERNE (2 COLONNES : BANDEAU GAUCHE + DROITE)
   -------------------------------------------------------------------------- */
function compileModernTemplate() {
  const photoHTML = compileProfilePhotoHTML();
  
  // Remplissage contacts sidebar
  let contactsSide = [];
  if (state.email) contactsSide.push(`<div class="cv-contact-item">${contactIcons.email} <span style="word-break: break-all;">${state.email}</span></div>`);
  if (state.phone) contactsSide.push(`<div class="cv-contact-item">${contactIcons.phone} <span>${state.phone}</span></div>`);
  if (state.address) contactsSide.push(`<div class="cv-contact-item">${contactIcons.address} <span>${state.address}</span></div>`);
  if (state.linkedin) contactsSide.push(`<div class="cv-contact-item">${contactIcons.linkedin} <span style="word-break: break-all;">${state.linkedin}</span></div>`);
  if (state.website) contactsSide.push(`<div class="cv-contact-item">${contactIcons.website} <span style="word-break: break-all;">${state.website}</span></div>`);
  
  // Formatage des compétences en liste simple pour la sidebar
  let skillsHTML = "";
  if (state.skills && state.skills.trim() !== "") {
    const badges = state.skills.split(",").map(skill => {
      const t = skill.trim();
      if (!t) return "";
      return `<span class="cv-badge-item" style="background-color:#ffffff;">${t}</span>`;
    }).join("");
    skillsHTML = `
      <div class="cv-section">
        <h3 class="cv-section-title">Compétences</h3>
        <div class="cv-badges-list">${badges}</div>
      </div>
    `;
  }

  // Formatage des langues pour la sidebar
  let languagesHTML = "";
  if (state.languages && state.languages.length > 0) {
    const items = state.languages.map(lang => {
      if (!lang.name) return "";
      return `
        <div style="font-size:0.85rem; margin-bottom: 6px;">
          <div style="font-weight:700;">${lang.name}</div>
          <div style="color:var(--text-medium); font-size:0.78rem;">${lang.level || ''}</div>
        </div>
      `;
    }).join("");
    
    if (items.replace(/\s/g, "") !== "") {
      languagesHTML = `
        <div class="cv-section">
          <h3 class="cv-section-title">Langues</h3>
          <div>${items}</div>
        </div>
      `;
    }
  }

  // Formatage centres d'intérêt sidebar
  let interestsHTML = "";
  if (state.interests && state.interests.trim() !== "") {
    const badges = state.interests.split(",").map(i => {
      const t = i.trim();
      if (!t) return "";
      return `<span class="cv-badge-item" style="background-color:#ffffff;">${t}</span>`;
    }).join("");
    interestsHTML = `
      <div class="cv-section">
        <h3 class="cv-section-title">Intérêts</h3>
        <div class="cv-badges-list">${badges}</div>
      </div>
    `;
  }
  
  // Contenu colonne droite
  const rightGridClass = state.twoColumns ? "cv-grid two-columns" : "cv-grid";

  return `
    <div class="cv-sidebar">
      ${photoHTML}
      
      <div class="cv-section">
        <h3 class="cv-section-title">Contact</h3>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${contactsSide.join("")}
        </div>
      </div>
      
      ${skillsHTML}
      ${languagesHTML}
      ${interestsHTML}
    </div>
    
    <div class="cv-main-content">
      <div class="cv-header">
        <h1 class="cv-name">${state.fullname || "Votre Nom complet"}</h1>
        <h2 class="cv-title" style="color: var(--cv-accent-color);">${state.jobtitle || "Intitulé du poste"}</h2>
      </div>
      
      ${state.summary ? `<p class="cv-summary">${state.summary}</p>` : ''}
      
      ${compileExperiencesHTML()}
      ${compileEducationsHTML()}
      
      <div class="${rightGridClass}">
        ${compileCertificationsHTML()}
        ${compileProjectsHTML()}
      </div>
    </div>
  `;
}


/* --------------------------------------------------------------------------
   TEMPLATE 3 : MODÈLE ÉLÉGANT (TYPOGRAPHIE RAFFINÉE, EN-TÊTE CHIC)
   -------------------------------------------------------------------------- */
function compileElegantTemplate() {
  const photoHTML = compileProfilePhotoHTML("elegant-photo");
  const contactsHTML = compileContactsHTML();
  
  const detailsGridClass = state.twoColumns ? "cv-grid two-columns" : "cv-grid";
  
  return `
    <div class="cv-header">
      ${photoHTML}
      <h1 class="cv-name">${state.fullname || "Votre Nom complet"}</h1>
      <h2 class="cv-title" style="color: var(--cv-accent-color); letter-spacing:1px;">${state.jobtitle || "Intitulé du poste"}</h2>
      ${contactsHTML}
    </div>
    
    ${state.summary ? `<p class="cv-summary" style="text-align: center; max-width: 90%; margin: 0 auto 20px auto;">${state.summary}</p>` : ''}
    
    ${compileExperiencesHTML()}
    ${compileEducationsHTML()}
    
    <div class="${detailsGridClass}">
      ${compileSkillsHTML()}
      ${compileLanguagesHTML()}
      ${compileCertificationsHTML()}
      ${compileProjectsHTML()}
      ${compileInterestsHTML()}
    </div>
  `;
}


/* --------------------------------------------------------------------------
   TEMPLATE 4 : MODÈLE MINIMALISTE (ÉPURÉ, CONTRASTE ET CLARTÉ)
   -------------------------------------------------------------------------- */
function compileMinimalistTemplate() {
  const photoHTML = compileProfilePhotoHTML("minimalist-photo");
  
  // Formatage contacts minimaliste (sans icônes)
  let contacts = [];
  if (state.email) contacts.push(`<span>${state.email}</span>`);
  if (state.phone) contacts.push(`<span>${state.phone}</span>`);
  if (state.address) contacts.push(`<span>${state.address}</span>`);
  if (state.linkedin) contacts.push(`<span>${state.linkedin}</span>`);
  if (state.website) contacts.push(`<span>${state.website}</span>`);
  
  const contactsHTML = contacts.length > 0 
    ? `<div class="cv-contacts-bar">${contacts.map(c => `<span class="cv-contact-item">${c}</span>`).join("")}</div>`
    : "";

  const detailsGridClass = state.twoColumns ? "cv-grid two-columns" : "cv-grid";
  
  return `
    <div class="cv-header" style="border-bottom: 2px solid #0f172a; padding-bottom:12px;">
      <div class="cv-header-flex" style="justify-content: space-between; align-items: flex-end; width:100%;">
        <div>
          <h1 class="cv-name" style="color:#0f172a; font-size:2rem; font-weight:800; text-transform:uppercase;">${state.fullname || "Votre Nom complet"}</h1>
          <h2 class="cv-title" style="color: var(--cv-accent-color); font-weight:500; font-size:1.1rem; margin-top:2px;">${state.jobtitle || "Intitulé du poste"}</h2>
        </div>
        ${photoHTML}
      </div>
    </div>
    
    <div style="margin-top:10px;">
      ${contactsHTML}
    </div>
    
    ${state.summary ? `<p class="cv-summary" style="margin-top:12px; border-left: 2px solid var(--cv-accent-color); padding-left:12px;">${state.summary}</p>` : ''}
    
    <div style="margin-top:12px;">
      ${compileExperiencesHTML()}
      ${compileEducationsHTML()}
    </div>
    
    <div class="${detailsGridClass}">
      ${compileSkillsHTML()}
      ${compileLanguagesHTML()}
      ${compileCertificationsHTML()}
      ${compileProjectsHTML()}
      ${compileInterestsHTML()}
    </div>
  `;
}
