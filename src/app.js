/*
 * Biblia Viva: src/app.js
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

// ---------------------------------------------------------------
// Estado de la aplicación
// ---------------------------------------------------------------

const ESTADO_INICIAL = {
  bienvenidaVista: false,
  pantalla: 'inicio',
  libro: 'Juan',
  capitulo: 3,
  tamano: 18,
  marcadores: [],   // claves "Libro|cap|ver"
  notas: []         // { ref: "Libro|cap|ver", texto: "..." }
};

// Estado persistente (se guarda en disco)
let estado = structuredClone(ESTADO_INICIAL);

// Estado solo en memoria (no se guarda nunca)
let panel = null;                 // versículo abierto en el panel contextual
let cadena = [];                  // ruta de exploración de referencias
let respuestaBienvenida = null;   // la respuesta de la bienvenida no se guarda

const TRADUCCION = BIBLIA.traduccion;

const RESPUESTAS_BIENVENIDA = {
  si: 'Gracias por compartirlo. Te animamos a seguir creciendo en la fe, a estudiar las Escrituras y a perseverar en el conocimiento de Cristo.',
  no: 'Dios te ama y te invita a conocerle. Jesucristo es el camino para reconciliarnos con el Padre, y la Escritura enseña que la salvación es un don de Dios que se recibe por la fe. Puedes explorar el texto con calma, cuando quieras.',
  quiero: 'Ese deseo es el comienzo de un camino con Dios. Puedes expresarle tu deseo con tus propias palabras, en oración. Ninguna fórmula garantiza nada por sí misma: la salvación es obra de la gracia de Dios y se recibe por la fe. Te sugerimos leer Juan 3 para comprender el nuevo nacimiento.'
};

const TEXTO_ACERCA = [
  'Biblia Viva es un proyecto creado por Osvaldo Rivera con el deseo de poner herramientas de estudio bíblico al alcance de todas las personas, de manera gratuita y accesible.',
  'Nace de la gratitud a nuestro Señor Jesucristo por Su misericordia, Su amor y la obra que ha hecho en mi vida. Deseo poner mis capacidades y esfuerzos al servicio de una herramienta que ayude a más personas a acercarse a las Escrituras, conocer el mensaje del Evangelio y profundizar en la Palabra de Dios.',
  'Este proyecto no busca la exaltación personal de su creador, sino servir como un instrumento para el estudio de las Escrituras. Toda la honra y la gloria pertenecen a nuestro Señor Jesucristo.'
];

const PANTALLAS = [
  { id: 'inicio', nombre: 'Inicio' },
  { id: 'biblia', nombre: 'Biblia' },
  { id: 'atlas', nombre: 'Atlas' },
  { id: 'biblioteca', nombre: 'Mi biblioteca' }
];

// ---------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------

function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function clave(libro, cap, ver) {
  return `${libro}|${cap}|${ver}`;
}

function parsearClave(k) {
  const [libro, cap, ver] = k.split('|');
  return { libro, cap: Number(cap), ver: Number(ver) };
}

function refTexto(libro, cap, ver) {
  return `${libro} ${cap}:${ver}`;
}

function capitulosDe(nombreLibro) {
  const libro = libroPorNombre(nombreLibro);
  if (!libro) return [];
  return Object.keys(libro.capitulos).map(Number).sort((a, b) => a - b);
}

function versiculosDe(nombreLibro, cap) {
  const libro = libroPorNombre(nombreLibro);
  if (!libro || !libro.capitulos[cap]) return [];
  return Object.keys(libro.capitulos[cap]).map(Number).sort((a, b) => a - b);
}

function esMarcado(k) {
  return estado.marcadores.includes(k);
}

function notaDe(k) {
  const nota = estado.notas.find((n) => n.ref === k);
  return nota ? nota.texto : '';
}

function avisar(mensaje) {
  const el = document.getElementById('aviso');
  el.textContent = mensaje;
  el.hidden = false;
  clearTimeout(avisar.temporizador);
  avisar.temporizador = setTimeout(() => { el.hidden = true; }, 3500);
}

async function guardar() {
  try {
    await window.bv.guardar(estado);
  } catch (error) {
    avisar('No se pudieron guardar los cambios: ' + error.message);
  }
}

function copiar(texto) {
  navigator.clipboard.writeText(texto)
    .then(() => avisar('Copiado al portapapeles.'))
    .catch(() => avisar('No se pudo copiar el texto.'));
}

// ---------------------------------------------------------------
// Navegación
// ---------------------------------------------------------------

function irA(pantalla) {
  estado.pantalla = pantalla;
  if (pantalla !== 'biblia') {
    panel = null;
    cadena = [];
  }
  guardar();
  render();
}

function abrirCapitulo(libro, cap) {
  estado.libro = libro;
  estado.capitulo = cap;
  panel = null;
  cadena = [];
  irA('biblia');
}

// Abre un versículo desde el lector o desde Mi biblioteca: inicia una nueva cadena.
function abrirVersiculoNuevo(libro, cap, ver) {
  estado.libro = libro;
  estado.capitulo = cap;
  estado.pantalla = 'biblia';
  panel = { libro, cap, ver };
  cadena = [{ libro, cap, ver }];
  guardar();
  render();
}

// Abre una referencia relacionada: continúa la cadena de exploración.
function abrirRelacionada(libro, cap, ver) {
  const ultimo = cadena[cadena.length - 1];
  const esElMismo = ultimo && ultimo.libro === libro && ultimo.cap === cap && ultimo.ver === ver;
  if (!esElMismo) cadena.push({ libro, cap, ver });
  estado.libro = libro;
  estado.capitulo = cap;
  panel = { libro, cap, ver };
  guardar();
  render();
}

// ---------------------------------------------------------------
// Vistas
// ---------------------------------------------------------------

function render() {
  renderNav();
  document.documentElement.style.setProperty('--tam', estado.tamano + 'px');

  const app = document.getElementById('app');
  let html;

  if (!estado.bienvenidaVista || estado.pantalla === 'bienvenida') {
    html = vistaBienvenida();
  } else if (estado.pantalla === 'biblia') {
    html = vistaBiblia();
  } else if (estado.pantalla === 'atlas') {
    html = vistaAtlas();
  } else if (estado.pantalla === 'biblioteca') {
    html = vistaBiblioteca();
  } else {
    html = vistaInicio();
  }

  app.innerHTML = html;
}

function renderNav() {
  const nav = document.getElementById('nav');
  if (!estado.bienvenidaVista) {
    nav.innerHTML = '';
    return;
  }
  nav.innerHTML = PANTALLAS.map((p) =>
    `<button data-accion="ir" data-destino="${p.id}" class="${estado.pantalla === p.id ? 'activo' : ''}">${escapar(p.nombre)}</button>`
  ).join('');
}

function vistaBienvenida() {
  const juan146 = textoDe('Juan', 14, 6);
  const juan33 = textoDe('Juan', 3, 3);

  const respuesta = respuestaBienvenida
    ? `<div class="tarjeta" role="note"><p class="bienvenida-texto">${escapar(RESPUESTAS_BIENVENIDA[respuestaBienvenida])}</p></div>`
    : '';

  return `
    <section class="pantalla">
      <h1>BIENVENIDO A BIBLIA VIVA</h1>
      <h2>La Palabra de Dios te espera.</h2>

      <p class="bienvenida-texto">Este espacio ha sido creado para ayudarte a conocer las Escrituras, comprender el mensaje del Evangelio y profundizar en lo que la Biblia enseña acerca de Jesucristo.</p>

      <div class="tarjeta">
        <p class="bienvenida-texto">Dios nos llama a reconciliarnos con Él. Jesucristo murió por nuestros pecados y resucitó. La salvación es por la gracia de Dios y se recibe mediante la fe en Jesucristo.</p>
        <blockquote class="cita-destacada">
          ${escapar(juan146)}
          <cite>Juan 14:6, ${escapar(TRADUCCION)}</cite>
        </blockquote>
      </div>

      <h3>¿Has recibido al Señor Jesucristo como tu Señor y Salvador?</h3>
      <div class="opciones">
        <button data-accion="respuesta" data-valor="si">Sí, he recibido a Jesucristo.</button>
        <button data-accion="respuesta" data-valor="no">No, todavía no.</button>
        <button data-accion="respuesta" data-valor="quiero">Quiero recibir a Jesucristo.</button>
      </div>
      ${respuesta}

      <div class="tarjeta">
        <h3>¿Qué significa nacer de nuevo?</h3>
        <p class="bienvenida-texto">Jesús habló con Nicodemo sobre el nuevo nacimiento. Esta es una de sus palabras:</p>
        <blockquote class="cita-destacada">
          ${escapar(juan33)}
          <cite>Juan 3:3, ${escapar(TRADUCCION)}</cite>
        </blockquote>
        <p class="suave">Para pensar: ¿qué cambia cuando una persona nace de nuevo? ¿Qué papel tiene la Palabra en ese proceso?</p>
        <div class="acciones">
          <button data-accion="leer-desde-bienvenida" data-libro="Juan" data-cap="3">Leer Juan 3</button>
        </div>
      </div>

      <div class="acciones">
        <button class="primario" data-accion="entrar">Entrar a Biblia Viva</button>
      </div>
      <p class="suave">Tu respuesta no se guarda y no es necesaria para usar la aplicación.</p>
    </section>`;
}

function vistaInicio() {
  const ultimo = `${estado.libro} ${estado.capitulo}`;
  return `
    <section class="pantalla">
      <h1>Inicio</h1>
      <p class="lema">La Palabra de Dios, viva para siempre.</p>
      <p class="suave">Explora las Escrituras, comprende su contexto y profundiza en la Palabra de Dios.</p>

      <div class="tarjeta">
        <h3>Continuar leyendo</h3>
        <p>${escapar(ultimo)}</p>
        <div class="acciones">
          <button class="primario" data-accion="abrir-capitulo-nuevo" data-libro="${escapar(estado.libro)}" data-cap="${estado.capitulo}">Seguir leyendo</button>
          <button data-accion="ir" data-destino="biblioteca">Mi biblioteca</button>
        </div>
      </div>

      <div class="tarjeta">
        <h3>Ajustes de lectura</h3>
        <label for="tamano">Tamaño del texto: <span id="tamano-valor">${estado.tamano}</span> px</label>
        <div>
          <input id="tamano" class="rango" type="range" min="14" max="28" step="1" value="${estado.tamano}">
        </div>
      </div>

      <div class="tarjeta">
        <h3>Acerca del proyecto</h3>
        ${TEXTO_ACERCA.map((p) => `<p>${escapar(p)}</p>`).join('')}
        <p class="cita-destacada">${escapar(BIBLIA.libros.find((l) => l.nombre === "Salmos").capitulos[115][1])}<cite>Salmos 115:1, ${escapar(BIBLIA.traduccion)}</cite></p>
        <p class="suave pequeno">Texto bíblico: ${escapar(BIBLIA.traduccion)}. ${escapar(BIBLIA.copyright)}. Licencia: ${escapar(BIBLIA.licencia)}. Fuente: ${escapar(BIBLIA.fuente)}</p>
        ${donacionesHtml()}
      </div>

    </section>`;
}

function vistaBiblia() {
  const caps = capitulosDe(estado.libro);
  const cap = caps.includes(estado.capitulo) ? estado.capitulo : caps[0];
  estado.capitulo = cap;

  const versiculos = versiculosDe(estado.libro, cap);
  const indice = caps.indexOf(cap);
  const anterior = indice > 0 ? caps[indice - 1] : null;
  const siguiente = indice < caps.length - 1 ? caps[indice + 1] : null;

  const libros = BIBLIA.libros.map((l) =>
    `<button data-accion="abrir-libro" data-libro="${escapar(l.nombre)}" class="${l.nombre === estado.libro ? 'activo' : ''}">${escapar(l.nombre)}</button>`
  ).join('');

  const capitulosHtml = caps.map((c) =>
    `<button data-accion="abrir-capitulo" data-cap="${c}" class="${c === cap ? 'activo' : ''}">${c}</button>`
  ).join('');

  const versiculosHtml = versiculos.map((v) => {
    const k = clave(estado.libro, cap, v);
    return `<button class="versiculo ${esMarcado(k) ? 'marcado' : ''}" data-accion="abrir-versiculo" data-libro="${escapar(estado.libro)}" data-cap="${cap}" data-ver="${v}">` +
      `<span class="num">${v}</span>${escapar(textoDe(estado.libro, cap, v))}</button>`;
  }).join('');

  const navegacion = `
    <div class="navegacion-capitulo">
      ${anterior !== null ? `<button data-accion="abrir-capitulo" data-cap="${anterior}">← ${anterior}</button>` : '<span></span>'}
      ${siguiente !== null ? `<button data-accion="abrir-capitulo" data-cap="${siguiente}">${siguiente} →</button>` : '<span></span>'}
    </div>`;

  return `
    <div class="lector ${panel ? 'con-panel' : ''}">
      <aside class="lista-libros" aria-label="Libros">${libros}</aside>
      <section>
        <div class="capitulos" aria-label="Capítulos">${capitulosHtml}</div>
        <article class="texto-biblico">
          <h2>${escapar(estado.libro)} ${cap} <span class="suave pequeno">${escapar(TRADUCCION)}</span></h2>
          ${versiculosHtml || '<p>No hay versículos disponibles en este capítulo.</p>'}
          <p class="nota-muestra">${escapar(BIBLIA.traduccion)} · ${escapar(BIBLIA.copyright)} · ${escapar(BIBLIA.licencia)}</p>
        </article>
        ${navegacion}
      </section>
      ${panel ? vistaPanel() : ''}
    </div>`;
}

function vistaPanel() {
  const { libro, cap, ver } = panel;
  const k = clave(libro, cap, ver);
  const texto = textoDe(libro, cap, ver);
  const relacionadas = REFERENCIAS_MUESTRA[k] || [];

  const relacionadasHtml = relacionadas.length
    ? relacionadas.map((r) => {
        const disponible = textoDe(r.libro, r.cap, r.ver) !== null;
        return `<button class="relacionada" data-accion="relacionada" data-libro="${escapar(r.libro)}" data-cap="${r.cap}" data-ver="${r.ver}">` +
          `<span class="tipo">${escapar(r.tipo)}</span><br>${escapar(refTexto(r.libro, r.cap, r.ver))}` +
          `<small>${escapar(r.descripcion)}</small></button>`;
      }).join('')
    : '<p class="suave">No hay referencias relacionadas para este versículo.</p>';

  const cadenaHtml = cadena.length > 1
    ? `<h3>Ruta de exploración</h3><div class="cadena">${cadena.map((c, i) =>
        `<button data-accion="cadena" data-i="${i}">${escapar(refTexto(c.libro, c.cap, c.ver))}</button>`
      ).join(' → ')}</div>`
    : '';

  return `
    <aside class="panel" aria-label="Detalle del versículo">
      <button class="cerrar" data-accion="cerrar-panel">Cerrar</button>
      <h3>${escapar(refTexto(libro, cap, ver))}</h3>
      ${imagenVersiculo(k)}
      <p class="texto-panel">${texto !== null ? escapar(texto) : 'Versículo no disponible.'}</p>
      <p class="suave pequeno">${escapar(TRADUCCION)}</p>

      <div class="acciones">
        <button data-accion="favorito">${esMarcado(k) ? 'Quitar favorito' : 'Guardar como favorito'}</button>
        <button data-accion="copiar-ref">Copiar referencia</button>
        <button data-accion="copiar-texto" ${texto !== null ? '' : 'disabled'}>Copiar texto</button>
      </div>

      <h3>Referencias relacionadas</h3>
      ${relacionadasHtml}
      ${cadenaHtml}

      <h3>Mi nota</h3>
      <textarea id="nota" aria-label="Nota personal">${escapar(notaDe(k))}</textarea>
      <div class="acciones">
        <button data-accion="guardar-nota">Guardar nota</button>
      </div>
    </aside>`;
}

function vistaBiblioteca() {
  const marcadores = estado.marcadores.map((k) => {
    const p = parsearClave(k);
    return `<div class="elemento">
      <div>
        <strong>${escapar(refTexto(p.libro, p.cap, p.ver))}</strong>
        <p>${escapar(textoDe(p.libro, p.cap, p.ver) || 'Texto no disponible.')}</p>
      </div>
      <div class="acciones">
        <button data-accion="abrir-guardado" data-k="${escapar(k)}">Abrir</button>
        <button data-accion="quitar-marcador" data-k="${escapar(k)}">Quitar</button>
      </div>
    </div>`;
  }).join('');

  const notas = estado.notas.map((n) => {
    const p = parsearClave(n.ref);
    return `<div class="elemento">
      <div>
        <strong>${escapar(refTexto(p.libro, p.cap, p.ver))}</strong>
        <p>${escapar(n.texto)}</p>
      </div>
      <div class="acciones">
        <button data-accion="abrir-guardado" data-k="${escapar(n.ref)}">Abrir</button>
        <button data-accion="borrar-nota" data-k="${escapar(n.ref)}">Borrar</button>
      </div>
    </div>`;
  }).join('');

  return `
    <section class="pantalla">
      <h1>Mi biblioteca</h1>
      <p class="suave">Tus favoritos y notas se guardan solo en este equipo.</p>

      <h2>Favoritos</h2>
      ${marcadores || '<p class="suave">Todavía no tienes favoritos. Toca un versículo y elige «Guardar como favorito».</p>'}

      <h2>Notas</h2>
      ${notas || '<p class="suave">Todavía no tienes notas.</p>'}
    </section>`;
}

// ---------------------------------------------------------------
// Acciones (delegación de eventos)
// ---------------------------------------------------------------

const ACCIONES = {
  entrar() {
    estado.bienvenidaVista = true;
    respuestaBienvenida = null;
    irA('inicio');
  },

  ir(el) {
    irA(el.dataset.destino);
  },

  respuesta(el) {
    respuestaBienvenida = el.dataset.valor;
    render();
  },

  'abrir-capitulo-nuevo'(el) {
    abrirCapitulo(el.dataset.libro, Number(el.dataset.cap));
  },

  'leer-desde-bienvenida'(el) {
    // Marca la bienvenida como vista; de lo contrario se volvería a mostrar.
    estado.bienvenidaVista = true;
    respuestaBienvenida = null;
    abrirCapitulo(el.dataset.libro, Number(el.dataset.cap));
  },

  'abrir-libro'(el) {
    const caps = capitulosDe(el.dataset.libro);
    abrirCapitulo(el.dataset.libro, caps[0]);
  },

  'abrir-capitulo'(el) {
    abrirCapitulo(estado.libro, Number(el.dataset.cap));
  },

  'abrir-versiculo'(el) {
    abrirVersiculoNuevo(el.dataset.libro, Number(el.dataset.cap), Number(el.dataset.ver));
  },

  relacionada(el) {
    abrirRelacionada(el.dataset.libro, Number(el.dataset.cap), Number(el.dataset.ver));
  },

  cadena(el) {
    const i = Number(el.dataset.i);
    cadena = cadena.slice(0, i + 1);
    const c = cadena[i];
    panel = { libro: c.libro, cap: c.cap, ver: c.ver };
    estado.libro = c.libro;
    estado.capitulo = c.cap;
    render();
  },

  'cerrar-panel'() {
    panel = null;
    cadena = [];
    render();
  },

  favorito() {
    if (!panel) return;
    const k = clave(panel.libro, panel.cap, panel.ver);
    if (esMarcado(k)) {
      estado.marcadores = estado.marcadores.filter((x) => x !== k);
    } else {
      estado.marcadores.push(k);
    }
    guardar();
    render();
  },

  'copiar-ref'() {
    if (!panel) return;
    copiar(`${refTexto(panel.libro, panel.cap, panel.ver)} (${TRADUCCION})`);
  },

  'copiar-texto'() {
    if (!panel) return;
    const texto = textoDe(panel.libro, panel.cap, panel.ver);
    if (texto === null) return;
    copiar(`«${texto}» — ${refTexto(panel.libro, panel.cap, panel.ver)} (${TRADUCCION})`);
  },

  'guardar-nota'() {
    if (!panel) return;
    const k = clave(panel.libro, panel.cap, panel.ver);
    const texto = document.getElementById('nota').value.trim();
    const indice = estado.notas.findIndex((n) => n.ref === k);

    if (!texto) {
      if (indice >= 0) estado.notas.splice(indice, 1);
    } else if (indice >= 0) {
      estado.notas[indice].texto = texto;
    } else {
      estado.notas.push({ ref: k, texto });
    }

    guardar();
    avisar('Nota guardada.');
    render();
  },

  'abrir-guardado'(el) {
    const p = parsearClave(el.dataset.k);
    abrirVersiculoNuevo(p.libro, p.cap, p.ver);
  },

  'quitar-marcador'(el) {
    estado.marcadores = estado.marcadores.filter((k) => k !== el.dataset.k);
    guardar();
    render();
  },

  'borrar-nota'(el) {
    estado.notas = estado.notas.filter((n) => n.ref !== el.dataset.k);
    guardar();
    render();
  }
};

document.addEventListener('click', (evento) => {
  const el = evento.target.closest('[data-accion]');
  if (!el) return;
  const accion = ACCIONES[el.dataset.accion];
  if (accion) accion(el);
});

// Tamaño del texto: se aplica al instante y se guarda al cambiar.
document.addEventListener('input', (evento) => {
  if (evento.target.id !== 'tamano') return;
  estado.tamano = Number(evento.target.value);
  document.documentElement.style.setProperty('--tam', estado.tamano + 'px');
  document.getElementById('tamano-valor').textContent = estado.tamano;
});

document.addEventListener('change', (evento) => {
  if (evento.target.id === 'tamano') guardar();
});

// ---------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------

async function iniciar() {
  try {
    const guardado = await window.bv.cargar();
    if (guardado && typeof guardado === 'object') {
      estado = { ...ESTADO_INICIAL, ...guardado };
    }
  } catch (error) {
    avisar('No se pudieron leer los datos guardados. Se usará la configuración inicial.');
  }

  if (!libroPorNombre(estado.libro)) {
    estado.libro = BIBLIA.libros[0].nombre;
    estado.capitulo = capitulosDe(estado.libro)[0];
  }

  render();
}

iniciar();
