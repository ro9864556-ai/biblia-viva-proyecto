/*
 * Biblia Viva: src/data/referencias.js
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

// Referencias relacionadas entre pasajes. Cada una indica el tipo de relación.
// Los textos se toman de biblia-vbl.js.

// Referencias relacionadas. Cada una indica el tipo de relación,
// para no presentar todas como equivalentes.
const REFERENCIAS_MUESTRA = {
  'Juan|3|16': [
    {
      libro: '1 Juan', cap: 4, ver: 9, tipo: 'Tema compartido',
      descripcion: 'El amor de Dios manifestado al enviar a su Hijo.'
    },
    {
      libro: 'Romanos', cap: 5, ver: 8, tipo: 'Tema compartido',
      descripcion: 'El amor de Dios demostrado en la muerte de Cristo.'
    },
    {
      libro: 'Efesios', cap: 2, ver: 8, tipo: 'Relación doctrinal',
      descripcion: 'La salvación por gracia, recibida por la fe.'
    },
    {
      libro: 'Romanos', cap: 10, ver: 9, tipo: 'Relación doctrinal',
      descripcion: 'La fe en Jesucristo y la promesa de salvación.'
    }
  ],
  'Juan|3|3': [
    {
      libro: 'Juan', cap: 3, ver: 16, tipo: 'Explicación complementaria',
      descripcion: 'El nuevo nacimiento se conecta con el amor de Dios que da vida eterna.'
    }
  ]
};

function libroPorNombre(nombre) {
  return BIBLIA.libros.find((l) => l.nombre === nombre) || null;
}

function textoDe(libro, cap, ver) {
  const l = libroPorNombre(libro);
  if (!l || !l.capitulos[cap]) return null;
  const texto = l.capitulos[cap][ver];
  return texto === undefined ? null : texto;
}
