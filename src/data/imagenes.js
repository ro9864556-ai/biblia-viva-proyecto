/*
 * Biblia Viva: src/data/imagenes.js
 * Copyright (C) 2026 Osvaldo Rivera
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
