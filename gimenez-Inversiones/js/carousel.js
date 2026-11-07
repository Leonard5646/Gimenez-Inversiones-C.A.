document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.galeria-grid');
  const prev = document.querySelector('.g-prev-global');
  const next = document.querySelector('.g-next-global');
  
  if (!track || !prev || !next) return;

  const items = track.querySelectorAll('.g-item');

  const get = () => {
    if (!items.length) return { step: track.clientWidth, visible: 1 };
    const w = items[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 18;
    return { step: Math.round(w + gap), visible: Math.max(1, Math.floor(track.clientWidth / w)) };
  };

  // Botón Siguiente (Next)
  next.addEventListener('click', () => {
    const m = get();
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    
    // Si ya llegó al final (o muy cerca del borde derecho), regresa al inicio
    if (track.scrollLeft >= maxScrollLeft - 10) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: m.step * m.visible, behavior: 'smooth' });
    }
  });

  // Botón Anterior (Prev)
  prev.addEventListener('click', () => {
    const m = get();
    
    // Si está al principio (o cerca del borde izquierdo), salta al final del carrusel
    if (track.scrollLeft <= 10) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -m.step * m.visible, behavior: 'smooth' });
    }
  });

  track.tabIndex = 0;
  track.addEventListener('keydown', e => { 
    if (e.key === 'ArrowRight') next.click(); 
    if (e.key === 'ArrowLeft') prev.click(); 
  });

  // ==========================================
  // NUEVO: Funcionalidad de Zoom / Lightbox
  // ==========================================
  
  // 1. Crear el contenedor modal flotante de forma dinámica
  const lightbox = document.createElement('div');
  lightbox.id = 'gallery-lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close">&times;</span>
      <img class="lightbox-img" src="" alt="Imagen ampliada">
    </div>
  `;
  document.body.appendChild(lightbox);

  // 2. Inyectar los estilos necesarios para que se vea profesional y centrado
  const style = document.createElement('style');
  style.innerHTML = `
    #gallery-lightbox {
      display: none;
      position: fixed;
      z-index: 99999;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.85);
      justify-content: center;
      align-items: center;
      padding: 15px;
      box-sizing: border-box;
    }
    #gallery-lightbox.active {
      display: flex;
    }
    .lightbox-content {
      position: relative;
      max-width: 95%;
      max-height: 95%;
    }
    .lightbox-img {
      max-width: 100%;
      max-height: 85vh;
      display: block;
      margin: 0 auto;
      border-radius: 8px;
      object-fit: contain;
      box-shadow: 0 4px 25px rgba(0,0,0,0.6);
    }
    .lightbox-close {
      position: absolute;
      top: -40px;
      right: 0;
      color: #fff;
      font-size: 38px;
      font-weight: bold;
      cursor: pointer;
      line-height: 1;
    }
  `;
  document.head.appendChild(style);

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  // 3. Asignar el evento de clic a cada imagen del carrusel
  items.forEach(item => {
    const img = item.querySelector('img');
    if (img) {
      img.style.cursor = 'pointer'; // Cambia el cursor para indicar que se puede hacer clic
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      });
    }
  });

  // 4. Métodos para cerrar el visor (botón X, fondo oscuro o tecla Escape)
  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
    }
  });
});