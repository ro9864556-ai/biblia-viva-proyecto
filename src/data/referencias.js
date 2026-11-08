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
