function getWindowPosition(position) {
  return new Promise((resolve) => {
    chrome.system.display.getInfo((displays) => {
      const primaryDisplay = displays.find(display => display.isPrimary) || displays[0];
      const screenWidth = primaryDisplay.bounds.width;
      const screenHeight = primaryDisplay.bounds.height;
      const width = Math.round(screenWidth * 1 / 3);
      const height = screenHeight;

      let left = 0;
      switch (position) {
        case "middle": left = Math.round(screenWidth * 1 / 3); break;
        case "right": left = Math.round(screenWidth * 2 / 3); break;
      }

      resolve({ left, top: 0, width, height });
    });
  });
}

function resizeWindow() {
  return new Promise((resolve) => {
    chrome.windows.getCurrent((currentWindow) => {
      chrome.system.display.getInfo((displays) => {
        const primaryDisplay = displays.find(display => display.isPrimary) || displays[0];
        const screenHeight = primaryDisplay.bounds.height;
        const newHeight = Math.round(screenHeight / 2);

        let top = 0;
        if (currentWindow.top === 0) {
          top = Math.round(screenHeight / 2);
        }

        chrome.windows.update(currentWindow.id, { top, height: newHeight }, resolve);
      });
    });
  });
}

chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "move_window_left":
    case "move_window_middle":
    case "move_window_right":
      const currentWindow = await chrome.windows.getCurrent();
      const position = await getWindowPosition(command.replace("move_window_", ""));
      chrome.windows.update(currentWindow.id, position);
      break;
    case "move_window_pos_half":
      await resizeWindow(0.5);
      break;
  }
});