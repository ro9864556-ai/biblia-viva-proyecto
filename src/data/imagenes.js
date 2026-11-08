// Imágenes asociadas a versículos.
// Clave: "Libro|cap|ver". Cada imagen es una ilustración artística, no una fotografía
// ni una prueba histórica, y se identifica como tal en su leyenda.

const IMAGENES_VERSICULOS = {
  'Génesis|1|1': {
    archivo: 'img/genesis-1-1.png',
    alt: 'Ilustración de la tierra vista desde el espacio, con el sol naciendo y el texto de Génesis 1:1',
    leyenda: 'Ilustración artística de Génesis 1:1. Texto bíblico: Versión Biblia Libre (VBL).'
  }
};

function imagenVersiculo(clave) {
  const img = IMAGENES_VERSICULOS[clave];
  if (!img) return '';
  return `<figure class="imagen-versiculo">
    <img src="${escapar(img.archivo)}" alt="${escapar(img.alt)}" loading="lazy">
    <figcaption class="suave pequeno">${escapar(img.leyenda)}</figcaption>
  </figure>`;
}
