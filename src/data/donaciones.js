/*
 * Biblia Viva: src/data/donaciones.js
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

// Enlaces de apoyo voluntario al proyecto.
// Si un enlace está vacío, no se muestra. Si ninguno tiene valor, no aparece la tarjeta.
// Donar es voluntario: no es necesario para usar la aplicación.

const DONACIONES = {
  githubSponsors: '',   // https://github.com/sponsors/...
  kofi: '',             // https://ko-fi.com/...
  paypal: 'https://paypal.me/OSVALDORIVERA719'
};

const DONACIONES_ETIQUETAS = {
  githubSponsors: 'GitHub Sponsors',
  kofi: 'Ko-fi',
  paypal: 'PayPal'
};

function donacionesHtml() {
  const enlaces = Object.entries(DONACIONES).filter(([, url]) => /^https:\/\//.test(url));
  if (!enlaces.length) return '';
  const botones = enlaces.map(([clave, url]) =>
    `<a class="boton" href="${escapar(url)}" target="_blank" rel="noopener noreferrer">${escapar(DONACIONES_ETIQUETAS[clave])}</a>`
  ).join('');
  return `<div class="tarjeta apoyo">
    <h3>Apoyar el proyecto</h3>
    <p>Biblia Viva es gratuita y seguirá siéndolo. Si te ha sido útil y deseas apoyar su desarrollo, puedes hacerlo de forma voluntaria.</p>
    <p class="suave">Donar no cambia nada en lo espiritual: no da ventajas en el estudio de la Biblia ni ante Dios. La salvación es un don de la gracia de Dios, no algo que se compra.</p>
    <div class="acciones">${botones}</div>
  </div>`;
}
