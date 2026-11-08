/*
 * Biblia Viva: src/data/atlas-genesis.js
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

// EJEMPLO: atlas de Génesis.
//
// ADVERTENCIA: las coordenadas son APROXIMADAS, tomadas como referencia para
// este ejemplo, y NO están verificadas con una fuente con licencia.
// Deben reemplazarse por datos de OpenBible.info (CC BY 4.0) antes de publicar.
// Los lugares sin coordenadas se muestran en la lista, pero no en el mapa.
//
// Los pasajes y palabras clave se validan contra el texto de la VBL (biblia-vbl.js).
// El orden de la línea de tiempo es el orden del relato, no una cronología histórica.

const ATLAS_GENESIS = {
  lugares: {
    edén:    { nombre: 'Edén', coord: null, nota: 'Ubicación discutida.' },
    ur:      { nombre: 'Ur de los caldeos', coord: { lat: 30.96, lon: 46.10 }, nota: 'Ciudad de Mesopotamia.' },
    haran:   { nombre: 'Harán', coord: { lat: 36.85, lon: 39.03 }, nota: 'Ciudad del norte de Mesopotamia.' },
    siquem:  { nombre: 'Siquén', coord: { lat: 32.22, lon: 35.27 }, nota: 'Ciudad de Samaria, cerca de Nablus.' },
    betel:   { nombre: 'Betel', coord: { lat: 31.93, lon: 35.23 }, nota: 'Ciudad al norte de Jerusalén.' },
    hebron:  { nombre: 'Hebrón', coord: { lat: 31.53, lon: 35.10 }, nota: 'Ciudad de Judá, junto al encinar de Mamré.' },
    beerseba:{ nombre: 'Beerseba', coord: { lat: 31.24, lon: 34.79 }, nota: 'Ciudad del Neguev.' },
    gerar:   { nombre: 'Gerar', coord: { lat: 31.38, lon: 34.48 }, nota: 'Ubicación aproximada; discutida.' },
    sodoma:  { nombre: 'Sodoma', coord: null, nota: 'Ubicación discutida: no hay consenso sobre su sitio.' },
    moriah:  { nombre: 'Tierra de Moriah', coord: null, nota: 'Tradicionalmente asociada a Jerusalén; discutida.' },
    dotan:   { nombre: 'Dotán', coord: { lat: 32.52, lon: 35.19 }, nota: 'Ciudad del norte de Israel.' },
    peniel:  { nombre: 'Peniel', coord: { lat: 32.12, lon: 35.64 }, nota: 'Junto al río Jaboc; ubicación discutida.' },
    egipto:  { nombre: 'Egipto', coord: { lat: 29.85, lon: 31.25 }, nota: 'Punto de referencia en la región de Menfis; Egipto es una región amplia.' },
    gosen:   { nombre: 'Gosén', coord: { lat: 30.50, lon: 31.90 }, nota: 'Región de Egipto; ubicación discutida.' },
    creacion:{ nombre: 'Sin lugar determinado', coord: null, nota: 'La creación no tiene una ubicación geográfica en el relato.' },
    belen:   { nombre: 'Belén (Efrat)', coord: { lat: 31.70, lon: 35.20 }, nota: 'Ciudad de Judá.' }
  },

  eventos: [
    { id: 'g-creacion', lugar: 'creacion', tipo: 'acontecimiento', certeza: 'discutida',
      titulo: 'La creación', periodo: null,
      resumen: 'En el principio, Dios creó los cielos y la tierra.',
      pasajes: [{ libro: 'Génesis', cap: 1, desde: 1, hasta: 1 }], palabra: 'creó' },

    { id: 'g-eden', lugar: 'edén', tipo: 'acontecimiento', certeza: 'discutida',
      titulo: 'El jardín del Edén', periodo: null,
      resumen: 'Dios planta un jardín y pone allí al ser humano.',
      pasajes: [{ libro: 'Génesis', cap: 2, desde: 8, hasta: 14 }], palabra: 'Edén' },

    { id: 'g-salida-ur', lugar: 'ur', tipo: 'ruta', certeza: 'alta',
      titulo: 'Téraj sale de Ur rumbo a Canaán', periodo: null,
      resumen: 'La familia de Téraj sale de Ur de los caldeos, pero se establece en Harán.',
      pasajes: [{ libro: 'Génesis', cap: 11, desde: 31, hasta: 32 }], palabra: 'Harán' },

    { id: 'g-llamado', lugar: 'haran', tipo: 'acontecimiento', certeza: 'alta',
      titulo: 'Dios llama a Abram en Harán', periodo: null,
      resumen: 'Dios ordena a Abram salir de su tierra y de su parentela, y le promete una gran nación.',
      pasajes: [{ libro: 'Génesis', cap: 12, desde: 1, hasta: 5 }], palabra: 'Harán' },

    { id: 'g-siquem', lugar: 'siquem', tipo: 'acontecimiento', certeza: 'alta',
      titulo: 'Dios promete la tierra en Siquén', periodo: null,
      resumen: 'Abram llega a Siquén, y Dios le promete dar esa tierra a su descendencia.',
      pasajes: [{ libro: 'Génesis', cap: 12, desde: 6, hasta: 7 }], palabra: 'Siquén' },

    { id: 'g-betel-altar', lugar: 'betel', tipo: 'acontecimiento', certeza: 'alta',
      titulo: 'Abram edifica un altar en Betel', periodo: null,
      resumen: 'Abram levanta un altar entre Betel y Hai e invoca el nombre de Jehová.',
      pasajes: [{ libro: 'Génesis', cap: 12, desde: 8, hasta: 8 }], palabra: 'Betel' },

    { id: 'g-egipto-abram', lugar: 'egipto', tipo: 'acontecimiento', certeza: 'alta',
      titulo: 'Abram desciende a Egipto por el hambre', periodo: null,
      resumen: 'Por el hambre, Abram baja a Egipto y allí se produce el episodio con Sarai.',
      pasajes: [{ libro: 'Génesis', cap: 12, desde: 10, hasta: 20 }], palabra: 'Egipto' },

    { id: 'g-hebron', lugar: 'hebron', tipo: 'acontecimiento', certeza: 'alta',
      titulo: 'Abram en el encinar de Mamré, en Hebrón', periodo: null,
      resumen: 'Abram se establece junto al encinar de Mamré, en Hebrón, y edifica un altar.',
      pasajes: [{ libro: 'Génesis', cap: 13, desde: 18, hasta: 18 }], palabra: 'Hebrón' },

    { id: 'g-sodoma', lugar: 'sodoma', tipo: 'acontecimiento', certeza: 'discutida',
      titulo: 'Sodoma y Gomorra', periodo: null,
      resumen: 'Lot vive en Sodoma; dos visitantes lo sacan de la ciudad antes de su destrucción.',
      pasajes: [{ libro: 'Génesis', cap: 19, desde: 1, hasta: 29 }], palabra: 'Sodoma' },

    { id: 'g-beerseba', lugar: 'beerseba', tipo: 'acontecimiento', certeza: 'alta',
      titulo: 'El pacto de Beerseba', periodo: null,
      resumen: 'Abraham hace un pacto con Abimelec en Beerseba.',
      pasajes: [{ libro: 'Génesis', cap: 21, desde: 31, hasta: 34 }], palabra: 'Beerseba' },

    { id: 'g-moriah', lugar: 'moriah', tipo: 'acontecimiento', certeza: 'discutida',
      titulo: 'La prueba de Abraham en Moriah', periodo: null,
      resumen: 'Dios pide a Abraham ofrecer a Isaac en la tierra de Moriah; Dios provee un carnero.',
      pasajes: [{ libro: 'Génesis', cap: 22, desde: 1, hasta: 19 }], palabra: 'Moriah' },

    { id: 'g-gerar', lugar: 'gerar', tipo: 'acontecimiento', certeza: 'media',
      titulo: 'Isaac en Gerar', periodo: null,
      resumen: 'Dios renueva a Isaac la promesa de la tierra mientras vive en Gerar.',
      pasajes: [{ libro: 'Génesis', cap: 26, desde: 1, hasta: 6 }], palabra: 'Gerar' },

    { id: 'g-betel-sueno', lugar: 'betel', tipo: 'acontecimiento', certeza: 'alta',
      titulo: 'El sueño de Jacob en Betel', periodo: null,
      resumen: 'Jacob sueña con una escalera y, al despertar, llama al lugar Betel.',
      pasajes: [{ libro: 'Génesis', cap: 28, desde: 10, hasta: 22 }], palabra: 'Betel' },

    { id: 'g-peniel', lugar: 'peniel', tipo: 'acontecimiento', certeza: 'media',
      titulo: 'Jacob lucha junto al Jaboc', periodo: null,
      resumen: 'Jacob lucha toda la noche con un varón y recibe el nombre de Israel.',
      pasajes: [{ libro: 'Génesis', cap: 32, desde: 22, hasta: 32 }], palabra: 'Peniel' },

    { id: 'g-belen-raquel', lugar: 'belen', tipo: 'mencion', certeza: 'alta',
      titulo: 'Muerte de Raquel camino a Efrat', periodo: null,
      resumen: 'Raquel muere en el camino a Efrat, es decir Belén.',
      pasajes: [{ libro: 'Génesis', cap: 35, desde: 19, hasta: 19 }], palabra: 'Efrat' },

    { id: 'g-dotan', lugar: 'dotan', tipo: 'acontecimiento', certeza: 'alta',
      titulo: 'José es vendido en Dotán', periodo: null,
      resumen: 'Sus hermanos lo ven llegar a Dotán y deciden venderlo.',
      pasajes: [{ libro: 'Génesis', cap: 37, desde: 17, hasta: 28 }], palabra: 'Dotán' },

    { id: 'g-gosen', lugar: 'gosen', tipo: 'acontecimiento', certeza: 'media',
      titulo: 'Jacob y su familia se establecen en Gosén', periodo: null,
      resumen: 'Jacob y sus hijos llegan a Egipto y se asientan en la tierra de Gosén.',
      pasajes: [{ libro: 'Génesis', cap: 46, desde: 28, hasta: 34 }], palabra: 'Gosén' }
  ]
};
