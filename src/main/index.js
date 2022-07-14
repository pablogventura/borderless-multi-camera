// alwais on top, borderless, transparent, camera
const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const version = require('../../package.json').version

var ipc = require('electron').ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function gotDevices() {
  window.deviceInfos = deviceInfos; // make available to console

}

ipc.on('invokeAction', function (event, data) {
  // var result = processData(data);
  if (data === 'appVersion') {
    event.returnValue = version
  }

  if (data === 'appQuit') {
    app.quit()
  }

  if (data === 'debugMode') {
    win.webContents.openDevTools()
  }

  if (data === 'toggleVisibleOnAllWorkspaces') {
    win.setVisibleOnAllWorkspaces(false)
    console.log(win)
  }

  if (data === 'toggleAlwaysOnTop') {
    win.setAlwaysOnTop(false)
    console.log(win)
  }
  if (data === 'gotDevices') {
    deviceInfos = navigator.mediaDevices.enumerateDevices();
    console.log('Available input and output devices:', deviceInfos);
    for (const deviceInfo of deviceInfos) {
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      console.log(deviceInfo.deviceId)
      if (deviceInfo.kind === 'audioinput') {
        option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
        audioSelect.appendChild(option);
      } else if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
        videoSelect.appendChild(option);
      }
    }
  }

  console.log(data)
  // win.setAlwaysOnTop(false)

  // event.sender.send('actionReply', result);
});

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 480,
    height: 320,
    transparent: true,
    // titleBarStyle: 'hidden-inset',
    frame: false,
    // toolbar: false,
  })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.resolve(__dirname, '../renderer/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.setVisibleOnAllWorkspaces(true)

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // ontop
  win.setAlwaysOnTop(true)
  // win.show()




  // setInterval(function(){ win.setAlwaysOnTop(true);}, 10000);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.