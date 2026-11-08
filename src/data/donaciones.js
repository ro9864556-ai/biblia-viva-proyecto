// Enlaces de apoyo voluntario al proyecto.
// Si un enlace está vacío, no se muestra. Si ninguno tiene valor, no aparece la tarjeta.
// Donar es voluntario: no es necesario para usar la aplicación.

const DONACIONES = {
  githubSponsors: '',   // https://github.com/sponsors/...
  kofi: '',             // https://ko-fi.com/...
  paypal: ''            // https://paypal.me/...
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
