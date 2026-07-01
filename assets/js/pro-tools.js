(() => {
  const $ = (id) => document.getElementById(id);
  const clean = (text) => (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9+#.\s-]/g, ' ');
  const fieldIds = ['fullname','jobtitle','email','phone','address','website','summary','skills','education','eduDate','expRole','expCompany','expDate','expLocation','expDescription'];
  const getValue = (id) => ($(id)?.value || '').trim();
  const cvText = () => fieldIds.map(getValue).join(' ');
  const stop = new Set(['avec','pour','dans','vous','nous','poste','profil','mission','missions','emploi','candidat','recherche','travail','experience','competence','competences','formation','entreprise','votre','notre','sans','plus','moins','afin','ainsi','les','des','une','sur','aux','par','est','sont']);
  const words = (text) => [...new Set(clean(text).split(/\s+/).filter((w) => w.length > 3 && !stop.has(w)))];

  const proFeatures = [
    'Scanner ATS local', 'Matching avec offre', 'Mots-clés manquants', 'Banque de phrases', 'Objectif professionnel',
    'Résumé automatique', 'Email de candidature', 'Pitch recruteur', 'Questions d’entretien', 'Checklist avant envoi',
    'Versions multiples', 'Historique local', 'Score impact', 'Score lisibilité', 'Score contact',
    'Nuage de compétences', 'Verbes d’action', 'Reformulation expérience', 'Analyse longueur', 'Analyse chiffres',
    'Analyse portfolio', 'Analyse téléphone', 'Analyse email', 'Analyse formation', 'Analyse compétences',
    'Analyse cohérence poste', 'Conseils recruteur', 'Plan d’amélioration', 'Bio LinkedIn', 'Bio portfolio',
    'Message WhatsApp recruteur', 'Message LinkedIn', 'Lettre courte', 'Lettre formelle', 'Lettre spontanée',
    'Export JSON', 'Import JSON', 'Export PDF', 'Mode sombre', 'Palettes couleur',
    'Modèles CV', 'Photo locale', 'QR contact visuel', 'Sauvegarde navigateur', 'Interface mobile'
  ];

  function inject() {
    if ($('pro-suite')) return;
    const target = document.querySelector('#lettre') || document.querySelector('footer');
    const section = document.createElement('section');
    section.id = 'pro-suite';
    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-badge">Suite Pro candidature</span>
          <h2 class="section-title">Un espace complet pour créer, analyser et renforcer une candidature.</h2>
          <p>Collez une offre d’emploi, comparez votre CV, récupérez les mots-clés, générez des textes de candidature et suivez vos versions.</p>
        </div>
        <div class="pro-dashboard">
          <div class="pro-tile"><span>Score global</span><strong id="proGlobalScore">0</strong></div>
          <div class="pro-tile"><span>Matching offre</span><strong id="proMatchScore">0%</strong></div>
          <div class="pro-tile"><span>Niveau ATS</span><strong id="proAtsLevel">—</strong></div>
          <div class="pro-tile"><span>Compétences</span><strong id="proSkillCount">0</strong></div>
        </div>
        <div class="pro-feature-wall">${proFeatures.map((f, i) => `<article class="pro-pill"><b>${String(i + 1).padStart(2, '0')}</b><span>${f}</span></article>`).join('')}</div>
        <div class="pro-layout">
          <article class="pro-card">
            <h3>Analyse d’offre d’emploi</h3>
            <textarea id="proJobOffer" placeholder="Collez ici l’offre d’emploi complète : missions, profil recherché, compétences, logiciels, niveau, expériences..."></textarea>
            <div class="generator-actions">
              <button class="btn btn-primary" id="proAnalyzeBtn">Analyser</button>
              <button class="btn btn-secondary" id="proBoostBtn">Renforcer l’expérience</button>
              <button class="btn btn-outline" id="proSaveBtn">Sauver version</button>
            </div>
          </article>
          <article class="pro-card">
            <h3>Diagnostic candidature</h3>
            <div class="pro-score-grid">
              <div class="metric big"><span>ATS</span><strong id="proAtsScore">0</strong></div>
              <div class="metric big"><span>Match</span><strong id="proMatchPercent">0%</strong></div>
              <div class="metric big"><span>Impact</span><strong id="proImpactScore">0</strong></div>
            </div>
            <div id="proKeywordCloud" class="keyword-cloud"></div>
            <div id="proDiagnostic" class="diagnostic">Collez une annonce puis lancez l’analyse.</div>
          </article>
        </div>
        <div class="pro-layout second">
          <article class="pro-card"><h3>Pitch recruteur</h3><textarea id="proPitch"></textarea><button class="btn btn-secondary" data-copy-pro="proPitch">Copier</button></article>
          <article class="pro-card"><h3>Email de candidature</h3><textarea id="proEmail"></textarea><button class="btn btn-secondary" data-copy-pro="proEmail">Copier</button></article>
        </div>
        <div class="pro-layout second">
          <article class="pro-card"><h3>Questions d’entretien</h3><textarea id="proInterview"></textarea><button class="btn btn-secondary" data-copy-pro="proInterview">Copier</button></article>
          <article class="pro-card"><h3>Versions enregistrées</h3><div id="proVersions" class="versions-list"></div></article>
        </div>
      </div>`;
    target.parentNode.insertBefore(section, target);

    const nav = $('nav-links');
    if (nav && !document.querySelector('a[href="#pro-suite"]')) {
      const link = document.createElement('a');
      link.href = '#pro-suite';
      link.className = 'nav-link';
      link.textContent = 'Suite Pro';
      nav.appendChild(link);
    }
  }

  function scoreBase() {
    let score = 0;
    if (getValue('email').includes('@')) score += 12;
    if (getValue('phone').length > 6) score += 12;
    if (getValue('summary').length > 90) score += 18;
    if (getValue('skills').split(',').filter(Boolean).length >= 5) score += 18;
    if (/\d|%|ans|année|annee|projet|client|budget|équipe|equipe/i.test(getValue('expDescription'))) score += 20;
    if (getValue('website').length > 5) score += 10;
    if (getValue('education').length > 5) score += 10;
    return Math.min(100, score);
  }

  function analyze() {
    const offerWords = words(getValue('proJobOffer'));
    const resumeWords = words(cvText());
    const found = offerWords.filter((w) => resumeWords.includes(w));
    const missing = offerWords.filter((w) => !resumeWords.includes(w)).slice(0, 24);
    const match = offerWords.length ? Math.round((found.length / offerWords.length) * 100) : 0;
    const ats = scoreBase();
    const impact = Math.min(100, Math.round((ats + match) / 2) + (/\d|%/.test(getValue('expDescription')) ? 8 : 0));

    setText('proAtsScore', ats);
    setText('proMatchPercent', match + '%');
    setText('proImpactScore', impact);
    setText('proGlobalScore', Math.round((ats + impact + match) / 3));
    setText('proMatchScore', match + '%');
    setText('proAtsLevel', ats > 82 ? 'Excellent' : ats > 65 ? 'Bon' : 'À renforcer');
    setText('proSkillCount', getValue('skills').split(',').filter(Boolean).length);

    const cloud = $('proKeywordCloud');
    if (cloud) {
      cloud.innerHTML = (missing.length ? missing : found.slice(0, 18)).map((k) => `<span class="keyword ${missing.includes(k) ? 'missing' : 'found'}">${k}</span>`).join('');
    }

    const diagnostic = [];
    diagnostic.push(match >= 70 ? 'Votre CV reprend bien les mots-clés de l’offre.' : 'Votre CV doit reprendre davantage les termes exacts de l’offre.');
    diagnostic.push(ats >= 75 ? 'La structure est claire pour un tri automatique.' : 'Renforcez le résumé, les compétences, le contact et les résultats mesurables.');
    diagnostic.push(missing.length ? 'Mots-clés à intégrer : ' + missing.slice(0, 10).join(', ') + '.' : 'Aucun mot-clé prioritaire manquant détecté.');
    $('proDiagnostic').innerHTML = diagnostic.map((d) => `<p>${d}</p>`).join('');

    generateTexts(match, missing);
  }

  function generateTexts(match, missing) {
    const name = getValue('fullname') || 'Votre nom';
    const job = getValue('jobtitle') || 'ce poste';
    const role = getValue('expRole') || 'professionnel';
    const skills = getValue('skills').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 5).join(', ');
    setValue('proPitch', `Bonjour, je suis ${name}. Mon profil de ${role} est orienté ${job}. Je peux apporter une contribution concrète grâce à mes compétences en ${skills || 'organisation, analyse et exécution'}. Le niveau de correspondance estimé avec l’offre est de ${match}%. ${missing.length ? 'Je peux renforcer le CV avec : ' + missing.slice(0, 5).join(', ') + '.' : ''}`);
    setValue('proEmail', `Bonjour,\n\nVeuillez trouver ci-joint ma candidature pour le poste de ${job}. Mon profil correspond aux attentes du poste et je serais heureux d’échanger avec vous.\n\nCordialement,\n${name}`);
    const qs = ['Présentez votre parcours en 60 secondes.', 'Quel résultat concret pouvez-vous prouver ?', 'Pourquoi ce poste vous intéresse-t-il ?', 'Comment organisez-vous vos priorités ?', ...missing.slice(0, 5).map((k) => `Comment démontrez-vous votre maîtrise de ${k} ?`)];
    setValue('proInterview', qs.join('\n'));
  }

  function boostExperience() {
    const exp = $('expDescription');
    if (!exp) return;
    const role = getValue('expRole') || 'poste';
    const company = getValue('expCompany') || 'l’entreprise';
    exp.value = `Dans le cadre du poste de ${role} chez ${company}, j’ai contribué à la réalisation de missions clés, à l’amélioration de la qualité des livrables, à l’optimisation des méthodes de travail et au respect des délais. Résultat : meilleure organisation, exécution plus fiable et impact mesurable sur les projets confiés.`;
    exp.dispatchEvent(new Event('input', { bubbles: true }));
    analyze();
  }

  function saveVersion() {
    const versions = JSON.parse(localStorage.getItem('cv-pro-suite-versions') || '[]');
    const item = { date: new Date().toLocaleString('fr-FR'), name: getValue('fullname') || 'CV', job: getValue('jobtitle') || '', values: {} };
    fieldIds.forEach((id) => item.values[id] = getValue(id));
    versions.unshift(item);
    localStorage.setItem('cv-pro-suite-versions', JSON.stringify(versions.slice(0, 10)));
    renderVersions();
  }

  function renderVersions() {
    const list = $('proVersions');
    if (!list) return;
    const versions = JSON.parse(localStorage.getItem('cv-pro-suite-versions') || '[]');
    list.innerHTML = versions.length ? versions.map((v, i) => `<button class="version-item" data-pro-version="${i}"><strong>${v.name}</strong><span>${v.job}</span><small>${v.date}</small></button>`).join('') : '<p>Aucune version enregistrée.</p>';
    list.querySelectorAll('[data-pro-version]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const v = versions[Number(btn.dataset.proVersion)];
        fieldIds.forEach((id) => {
          if ($(id) && v.values[id] !== undefined) {
            $(id).value = v.values[id];
            $(id).dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      });
    });
  }

  function setText(id, value) { if ($(id)) $(id).textContent = value; }
  function setValue(id, value) { if ($(id)) $(id).value = value; }

  function bind() {
    $('proAnalyzeBtn')?.addEventListener('click', analyze);
    $('proBoostBtn')?.addEventListener('click', boostExperience);
    $('proSaveBtn')?.addEventListener('click', saveVersion);
    document.querySelectorAll('[data-copy-pro]').forEach((btn) => btn.addEventListener('click', () => navigator.clipboard?.writeText($(btn.dataset.copyPro)?.value || '')));
    fieldIds.forEach((id) => $(id)?.addEventListener('input', () => setTimeout(analyze, 80)));
    renderVersions();
    analyze();
  }

  document.addEventListener('DOMContentLoaded', () => {
    inject();
    bind();
  });
})();
