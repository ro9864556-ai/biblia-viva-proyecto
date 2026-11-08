const { contextBridge, ipcRenderer } = require('electron');

// La interfaz solo puede cargar y guardar datos; no tiene acceso a Node.js.
contextBridge.exposeInMainWorld('bv', {
  cargar: () => ipcRenderer.invoke('datos:cargar'),
  guardar: (datos) => ipcRenderer.invoke('datos:guardar', datos)
});
