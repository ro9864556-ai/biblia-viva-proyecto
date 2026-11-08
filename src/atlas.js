/*
 * Biblia Viva: src/atlas.js
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
// Atlas de ejemplo (Génesis).
// Usa ATLAS_GENESIS (src/data/atlas-genesis.js), BIBLIA y las funciones de app.js.
//
// Mapa esquemático: sin costas ni relieve, porque aún no hay un fondo con licencia.
// Las coordenadas son aproximadas (ver atlas-genesis.js).
// ---------------------------------------------------------------

let atlasLugar = null;      // clave del lugar seleccionado
let atlasCapitulo = null;   // capítulo de Génesis seleccionado en la línea de tiempo
let atlasPasaje = null;     // { cap, desde, hasta } del pasaje que se muestra

const ATLAS_VISTA = { latMin: 28.5, latMax: 37.5, lonMin: 29.5, lonMax: 48.5, ancho: 760, alto: 460 };
const ATLAS_RUTA_ABRAHAM = ['ur', 'haran', 'siquem', 'betel', 'hebron', 'egipto'];
const ATLAS_TIPOS = { acontecimiento: 'Acontecimiento', mencion: 'Mención', ruta: 'Ruta', profetico: 'Profético' };
const ATLAS_CERTEZA = { alta: 'Certeza alta', media: 'Certeza media', discutida: 'Ubicación discutida' };

function atlasProyectar(coord) {
  const x = (coord.lon - ATLAS_VISTA.lonMin) / (ATLAS_VISTA.lonMax - ATLAS_VISTA.lonMin) * ATLAS_VISTA.ancho;
  const y = (ATLAS_VISTA.latMax - coord.lat) / (ATLAS_VISTA.latMax - ATLAS_VISTA.latMin) * ATLAS_VISTA.alto;
  return { x: x.toFixed(1), y: y.toFixed(1) };
}

function atlasEventos() {
  return ATLAS_GENESIS.eventos.filter((e) =>
    (!atlasLugar || e.lugar === atlasLugar) &&
    (!atlasCapitulo || e.pasajes[0].cap === atlasCapitulo)
  );
}

function atlasMapaSvg() {
  const V = ATLAS_VISTA;
  let rejilla = '';
  for (let lon = Math.ceil(V.lonMin); lon <= V.lonMax; lon += 2) {
    const x = atlasProyectar({ lat: V.latMax, lon }).x;
    rejilla += `<line class="rejilla" x1="${x}" y1="0" x2="${x}" y2="${V.alto}"/>`;
    rejilla += `<text class="rejilla-texto" x="${x}" y="${V.alto - 4}">${lon}°E</text>`;
  }
  for (let lat = Math.ceil(V.latMin); lat <= V.latMax; lat += 2) {
    const y = atlasProyectar({ lat, lon: V.lonMin }).y;
    rejilla += `<line class="rejilla" x1="0" y1="${y}" x2="${V.ancho}" y2="${y}"/>`;
    rejilla += `<text class="rejilla-texto" x="4" y="${y - 3}">${lat}°N</text>`;
  }

  const puntos = ATLAS_RUTA_ABRAHAM.map((k) => ATLAS_GENESIS.lugares[k].coord ? atlasProyectar(ATLAS_GENESIS.lugares[k].coord) : null).filter(Boolean);
  const ruta = puntos.length > 1
    ? `<polyline class="ruta" points="${puntos.map((p) => p.x + ',' + p.y).join(' ')}"/>`
    : '';

  const marcadores = Object.entries(ATLAS_GENESIS.lugares)
    .filter(([, l]) => l.coord)
    .map(([k, l]) => {
      const p = atlasProyectar(l.coord);
      const activo = k === atlasLugar ? ' activo' : '';
      return `<g class="marcador${activo}" data-atlas="lugar" data-lugar="${k}" role="button" tabindex="0">
        <circle cx="${p.x}" cy="${p.y}" r="${k === atlasLugar ? 9 : 6}"/>
        <text x="${Number(p.x) + 10}" y="${Number(p.y) + 4}">${escapar(l.nombre)}</text>
      </g>`;
    }).join('');

  return `<svg class="atlas-mapa" viewBox="0 0 ${V.ancho} ${V.alto}" role="img" aria-label="Mapa esquemático de los lugares de Génesis">
    <rect class="fondo-mapa" x="0" y="0" width="${V.ancho}" height="${V.alto}"/>
    ${rejilla}
    ${ruta}
    ${marcadores}
  </svg>
  <p class="nota-muestra">Mapa esquemático: sin costas ni relieve. Coordenadas aproximadas, solo para este ejemplo.</p>`;
}

function atlasLineaTiempoSvg() {
  const ancho = 760, capitulos = 50;
  const x = (c) => ((c - 1) / (capitulos - 1)) * (ancho - 20) + 10;
  let marcas = '';
  for (let c = 1; c <= capitulos; c += 5) {
    marcas += `<text class="tiempo-etiqueta" x="${x(c)}" y="54">${c}</text>`;
  }
  const puntos = ATLAS_GENESIS.eventos.map((e) => {
    const cap = e.pasajes[0].cap;
    const activo = atlasCapitulo === cap ? ' activo' : '';
    return `<circle class="punto-tiempo${activo}" cx="${x(cap)}" cy="30" r="5" data-atlas="cap" data-cap="${cap}" role="button" tabindex="0"><title>Génesis ${cap}</title></circle>`;
  }).join('');
  return `<svg class="atlas-tiempo" viewBox="0 0 ${ancho} 60" role="img" aria-label="Línea de tiempo de Génesis por capítulos">
    <line class="eje-tiempo" x1="10" y1="30" x2="${ancho - 10}" y2="30"/>
    ${puntos}
    ${marcas}
  </svg>
  <p class="nota-muestra">Orden del relato en Génesis (capítulos), no una cronología histórica.${atlasCapitulo ? ` Mostrando Génesis ${atlasCapitulo}. <button data-atlas="cap" data-cap="${atlasCapitulo}">Quitar filtro</button>` : ''}</p>`;
}

// Imagen asociada a cualquier versículo del pasaje (si existe en imagenes.js).
function atlasImagenPasaje(p) {
  for (let v = p.desde; v <= p.hasta; v++) {
    const html = imagenVersiculo(`${p.libro}|${p.cap}|${v}`);
    if (html) return `<div class="atlas-miniatura">${html}</div>`;
  }
  return '';
}

function atlasListaEventos() {
  const eventos = atlasEventos();
  if (!eventos.length) return '<p class="suave">No hay acontecimientos para esta selección.</p>';
  return eventos.map((e) => {
    const p = e.pasajes[0];
    const lugar = ATLAS_GENESIS.lugares[e.lugar];
    const ref = p.desde === p.hasta ? `Génesis ${p.cap}:${p.desde}` : `Génesis ${p.cap}:${p.desde}-${p.hasta}`;
    return `<div class="elemento-atlas">
      <div>
        <span class="tipo">${escapar(ATLAS_TIPOS[e.tipo] || e.tipo)}</span>
        <span class="tipo">${escapar(ATLAS_CERTEZA[e.certeza] || e.certeza)}</span>
        <h3>${escapar(e.titulo)}</h3>
        ${atlasImagenPasaje(p)}
        <p class="suave">${escapar(lugar.nombre)} · ${escapar(ref)}</p>
        <p>${escapar(e.resumen)}</p>
      </div>
      <div class="acciones">
        <button data-atlas="pasaje" data-cap="${p.cap}" data-desde="${p.desde}" data-hasta="${p.hasta}">Ver pasaje</button>
      </div>
    </div>`;
  }).join('');
}

function atlasPasajeHtml() {
  if (!atlasPasaje) return '';
  const { cap, desde, hasta } = atlasPasaje;
  let versos = '';
  for (let v = desde; v <= hasta; v++) {
    const t = textoDe('Génesis', cap, v);
    if (t) versos += `<p><span class="num">${v}</span> ${escapar(t)}</p>`;
  }
  return `<div class="tarjeta atlas-pasaje">
    <button class="cerrar" data-atlas="cerrar-pasaje">Cerrar</button>
    <h3>Génesis ${cap}:${desde}${desde !== hasta ? '-' + hasta : ''}</h3>
    ${atlasImagenPasaje({ libro: 'Génesis', cap, desde, hasta })}
    <div class="texto-panel">${versos}</div>
    <p class="suave pequeno">${escapar(TRADUCCION)}</p>
    <div class="acciones">
      <button data-atlas="abrir-lector" data-cap="${cap}" data-ver="${desde}">Abrir en el lector</button>
    </div>
  </div>`;
}

function vistaAtlas() {
  const lugarSel = atlasLugar ? ATLAS_GENESIS.lugares[atlasLugar] : null;
  const encabezado = lugarSel
    ? `<h2>${escapar(lugarSel.nombre)}</h2><p class="suave">${escapar(lugarSel.nota)}${lugarSel.coord ? '' : ' Sin coordenadas verificadas: no aparece en el mapa.'}</p>`
    : '<h2>Atlas de Génesis</h2><p class="suave">Selecciona un lugar en el mapa o un capítulo en la línea de tiempo.</p>';

  return `
    <section class="atlas">
      ${encabezado}
      <div class="atlas-grid">
        <div>
          ${atlasMapaSvg()}
          <h3>Línea de tiempo</h3>
          ${atlasLineaTiempoSvg()}
        </div>
        <div>
          ${atlasPasajeHtml()}
          <h3>Acontecimientos</h3>
          ${atlasListaEventos()}
          ${atlasLugar ? '<div class="acciones"><button data-atlas="todos">Ver todo Génesis</button></div>' : ''}
        </div>
      </div>
    </section>`;
}

document.addEventListener('click', (evento) => {
  const el = evento.target.closest('[data-atlas]');
  if (!el) return;
  const accion = el.dataset.atlas;

  if (accion === 'lugar') {
    atlasLugar = atlasLugar === el.dataset.lugar ? null : el.dataset.lugar;
    atlasCapitulo = null;
    atlasPasaje = null;
  } else if (accion === 'cap') {
    const cap = Number(el.dataset.cap);
    atlasCapitulo = atlasCapitulo === cap ? null : cap;
    atlasLugar = null;
    atlasPasaje = null;
  } else if (accion === 'pasaje') {
    atlasPasaje = { cap: Number(el.dataset.cap), desde: Number(el.dataset.desde), hasta: Number(el.dataset.hasta) };
  } else if (accion === 'cerrar-pasaje') {
    atlasPasaje = null;
  } else if (accion === 'todos') {
    atlasLugar = null;
    atlasCapitulo = null;
    atlasPasaje = null;
  } else if (accion === 'abrir-lector') {
    abrirVersiculoNuevo('Génesis', Number(el.dataset.cap), Number(el.dataset.ver));
    return;
  } else {
    return;
  }
  render();
});

document.addEventListener('keydown', (evento) => {
  if ((evento.key === 'Enter' || evento.key === ' ') && evento.target.dataset && evento.target.dataset.atlas) {
    evento.preventDefault();
    evento.target.click();
  }
});
