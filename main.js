/*
 * Biblia Viva: main.js
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

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Archivo único de datos personales, fuera de la carpeta del programa.
// Así una actualización del programa no lo sobrescribe.
function rutaDatos() {
  return path.join(app.getPath('userData'), 'biblia-viva-datos.json');
}

function crearVentana() {
  const ventana = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 720,
    minHeight: 540,
    title: 'Biblia Viva',
    autoHideMenuBar: true,
    backgroundColor: '#0B1E4D',
    icon: path.join(__dirname, 'src', 'img', 'icono.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  // Los enlaces externos (por ejemplo, donaciones) se abren en el navegador del sistema.
  ventana.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  ventana.webContents.on('will-navigate', (evento) => evento.preventDefault());

  ventana.loadFile(path.join(__dirname, 'src', 'index.html'));
}

ipcMain.handle('datos:cargar', () => {
  try {
    return JSON.parse(fs.readFileSync(rutaDatos(), 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
});

ipcMain.handle('datos:guardar', (_evento, datos) => {
  const destino = rutaDatos();
  const temporal = destino + '.tmp';
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  // Escritura en dos pasos: el archivo original solo se reemplaza
  // cuando el nuevo contenido ya está completo en disco.
  fs.writeFileSync(temporal, JSON.stringify(datos, null, 2), 'utf8');
  fs.renameSync(temporal, destino);
  return true;
});

app.whenReady().then(crearVentana);

app.on('window-all-closed', () => {
  app.quit();
});
