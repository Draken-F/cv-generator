import data from './data.json'
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const setdata = (data) => {
  const wrapper = document.getElementById('cv-wrapper');
  let html = ''
  html = `
    <div class="left-side">
      <h1>${data.nom}</h1>
      <h2>${data.titre}</h2>

      <section>
        <h2>Profil</h2>
        <p>${data.profil}</p>
      </section>

      <section>
        <h2>Expérience</h2>
  `;

  data.experiences.forEach(exp => {
    html += `
      <div class="item">
        <h4>${exp.poste} - ${exp.entreprise}</h4>
        <p class="date">${exp.periode}</p>
        <p>${exp.description}</p>
      </div>
    `;
  });

  html += `
      </section>
      <section>
        <h2>Formation</h2>
  `;

  data.formations.forEach(edu => {
    html += `
      <div class="item">
        <h4>${edu.diplome} - ${edu.ecole}</h4>
        <p class="date">${edu.periode}</p>
        <p>${edu.description}</p>
      </div>
    `;
  });

  html += `
      </section>
      <section>
        <h2>Projets</h2>
  `;

  data.projets.forEach(proj => {
    html += `
      <div class="item">
        <h4>${proj.nom}</h4>
        <p>${proj.description}</p>
      </div>
    `;
  });

  html += `
    </section>
  </div>

  <div class="right-side">
      <div class="profile-photo-container">
        <input type="file" id="imageInput" accept="image/*" style="display: none;">
        <br><br>
        <img id="preview" src="" alt="Aperçu de l’image" style="max-width: 300px; display: none;" class="profile-img">
        <label for="imageInput" class="change-photo-btn">📷</label>
      </div>

    <div class="contact">
      <h2>Contact</h2>
      <p>Email : ${data.contact.email}</p>
      <p>Tél : ${data.contact.telephone}</p>
      <p>Ville : ${data.contact.ville}</p>
      <p><a href="${data.contact.linkedin}" target="_blank">LinkedIn</a></p>
      <p><a href="${data.contact.portfolio}" target="_blank">Portfolio</a></p>
    </div>

    <div class="skills">
      <h2>Compétences</h2>
  `;

  data.competences.forEach(skill => {
    html += `
      <p>${skill.nom}</p>
      <div class="skill-bar">
        <div class="skill-bar-fill" style="width:${skill.niveau}%"></div>
      </div>
    `;
  });

  html += `
    </div>

    <div class="languages">
      <h2>Langues</h2>
  `;

  data.langues.forEach(lang => {
    const stars = '★'.repeat(lang.niveau) + '☆'.repeat(5 - lang.niveau);
    html += `<p>${lang.langue} : <span class="language-stars"> ${stars}</span></p>`;
  });

  html += `
    </div>
  </div>
  `;

  wrapper.innerHTML = html;
  const input = document.getElementById('imageInput');
    const preview = document.getElementById('preview');

    // Si une image est déjà enregistrée, on l'affiche
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      preview.src = savedImage;
      preview.style.display = 'block';
    }

    input.addEventListener('change', function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const base64 = e.target.result;
          preview.src = base64;
          preview.style.display = 'block';
          localStorage.setItem('profileImage', base64); // 🔒 Sauvegarde
        };
        reader.readAsDataURL(file);
      }
    });
};




const chargejson = () => {
  const savedData = localStorage.getItem('cvData');
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      setdata(parsedData);
    } catch (err) {
      console.error("Erreur lors du chargement des données sauvegardées");
    }
  }
  document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
    
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      localStorage.setItem('cvData', JSON.stringify(importedData));
      setdata(importedData); // Mets à jour le CV
    } catch (error) {
      alert('Erreur lors de l\'importation du fichier JSON.');
      console.error(error);
    }
  };

  reader.readAsText(file);
});
}

chargejson()

function resetcv() {
  localStorage.removeItem('cvData');
  localStorage.removeItem('profileImage'); // Supprime l'image de profil sauvegardée
  location.reload(); // Recharge la page pour réinitialiser le CV
}

document.getElementById('reset').addEventListener('click', resetcv);

function downloadCVasPDF() {
  const element = document.getElementById('cv-wrapper');
  html2canvas(element, { scale: 2, useCORS: true }).then(canvas => {
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calcul du ratio pour remplir la page A4
    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    pdf.save('cv.pdf');
  });
}

document.getElementById('downloadCV').addEventListener('click', downloadCVasPDF);


