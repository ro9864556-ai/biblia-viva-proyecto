/*
 * Biblia Viva: src/data/eventos.js
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

// Acontecimientos bíblicos vinculados a lugares.
//
// Regla: cada lugar muestra acontecimientos curados, no todos los versículos
// donde aparece su nombre. Cada acontecimiento indica su naturaleza y su grado de certeza.
//
// Tipos (según la especificación, sección 6.4):
//   "acontecimiento"  el relato sitúa el hecho en el lugar
//   "mencion"         el pasaje menciona el lugar, sin que ocurra allí
//   "ruta"            el texto describe un desplazamiento
//   "profetico"       lenguaje profético o simbólico
//
// Certeza:
//   "alta"       el relato lo sitúa claramente en el lugar
//   "media"      la ubicación es clara, pero el lugar exacto o la fecha son debatidos
//   "discutida"  existen dudas sobre la identificación del lugar
//
// Las fechas no se inventan: si no hay base suficiente, el campo "periodo" queda en texto aproximado.
//
// PENDIENTE: las coordenadas de cada lugar deben tomarse de una fuente con licencia
// (por ejemplo, el conjunto de datos de OpenBible.info, CC BY 4.0) y no de memoria.

const LUGARES = {
  jerico: {
    nombre: 'Jericó',
    coordenadas: null, // pendiente de fuente verificada
    notaGeografica: 'Ciudad cercana al río Jordán, al norte del Mar Muerto.'
  },
  belen: {
    nombre: 'Belén',
    coordenadas: null, // pendiente de fuente verificada
    notaGeografica: 'Ciudad de Judá, a poca distancia al sur de Jerusalén.'
  }
};

const EVENTOS = [
  // ---- Jericó ----
  {
    id: 'jerico-espias',
    lugar: 'jerico',
    tipo: 'acontecimiento',
    certeza: 'alta',
    titulo: 'Los espías en la casa de Rahab',
    periodo: 'Conquista de Canaán (fecha discutida)',
    resumen: 'Dos espías entran en Jericó y se esconden en la casa de Rahab, que los protege.',
    pasajes: [{ libro: 'Josué', cap: 2, desde: 1, hasta: 24 }]
  },
  {
    id: 'jerico-muros',
    lugar: 'jerico',
    tipo: 'acontecimiento',
    certeza: 'alta',
    titulo: 'La caída de los muros de Jericó',
    periodo: 'Conquista de Canaán (fecha discutida)',
    resumen: 'Israel rodea la ciudad durante siete días y, al sonido de las trompetas, los muros caen.',
    pasajes: [{ libro: 'Josué', cap: 6, desde: 1, hasta: 27 }]
  },
  {
    id: 'jerico-aguas',
    lugar: 'jerico',
    tipo: 'acontecimiento',
    certeza: 'media',
    titulo: 'Eliseo sana las aguas de Jericó',
    periodo: 'Reino de Israel, siglo IX a. C. (aprox.)',
    resumen: 'Eliseo purifica las aguas malsanas de la ciudad.',
    pasajes: [{ libro: '2 Reyes', cap: 2, desde: 18, hasta: 22 }]
  },
  {
    id: 'jerico-zaqueo',
    lugar: 'jerico',
    tipo: 'acontecimiento',
    certeza: 'alta',
    titulo: 'Jesús y Zaqueo',
    periodo: 'Ministerio de Jesús, siglo I d. C. (aprox.)',
    resumen: 'Jesús entra en Jericó, se hospeda con Zaqueo y este cambia su vida.',
    pasajes: [{ libro: 'Lucas', cap: 19, desde: 1, hasta: 10 }]
  },
  {
    id: 'jerico-bartimeo',
    lugar: 'jerico',
    tipo: 'acontecimiento',
    certeza: 'alta',
    titulo: 'Bartimeo recupera la vista',
    periodo: 'Ministerio de Jesús, siglo I d. C. (aprox.)',
    resumen: 'Un ciego junto al camino de Jericó clama a Jesús y recibe la vista.',
    pasajes: [{ libro: 'Marcos', cap: 10, desde: 46, hasta: 52 }]
  },
  {
    id: 'jerico-fe',
    lugar: 'jerico',
    tipo: 'mencion',
    certeza: 'alta',
    titulo: 'La fe de los muros caídos',
    periodo: null,
    resumen: 'La carta a los Hebreos recuerda que los muros cayeron por la fe.',
    pasajes: [{ libro: 'Hebreos', cap: 11, desde: 30, hasta: 30 }]
  },

  // ---- Belén ----
  {
    id: 'belen-nacimiento',
    lugar: 'belen',
    tipo: 'acontecimiento',
    certeza: 'alta',
    titulo: 'El nacimiento de Jesús',
    periodo: 'Siglo I a. C. (aprox.)',
    resumen: 'Jesús nace en Belén, en un pesebre, durante el censo ordenado por el imperio.',
    pasajes: [{ libro: 'Lucas', cap: 2, desde: 1, hasta: 20 }]
  },
  {
    id: 'belen-magos',
    lugar: 'belen',
    tipo: 'acontecimiento',
    certeza: 'alta',
    titulo: 'Los magos buscan al rey recién nacido',
    periodo: 'Siglo I a. C. (aprox.)',
    resumen: 'Unos magos llegan a Jerusalén siguiendo una estrella y son enviados a Belén.',
    pasajes: [{ libro: 'Mateo', cap: 2, desde: 1, hasta: 12 }]
  },
  {
    id: 'belen-profecia',
    lugar: 'belen',
    tipo: 'mencion',
    certeza: 'alta',
    titulo: 'Belén en la profecía de Miqueas',
    periodo: null,
    resumen: 'Los escribas citan a Miqueas al indicar que el Mesías nacería en Belén.',
    pasajes: [{ libro: 'Mateo', cap: 2, desde: 6, hasta: 6 }]
  }
];

// Pasajes de un lugar, en orden de aparición en la lista de acontecimientos.
function eventosDeLugar(clave) {
  return EVENTOS.filter((e) => e.lugar === clave);
}
