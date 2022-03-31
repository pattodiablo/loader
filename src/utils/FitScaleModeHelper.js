
export function getGameDimensions(defaultWidth, defaultHeight) {
    const deviceRatio = window.innerHeight / window.innerWidth;
    const vertical = deviceRatio > 1;

    let newWidth = vertical ? defaultHeight : defaultWidth;
    let newHeight = vertical ? defaultWidth : defaultHeight;

    const gameRatio = newHeight / newWidth;

    if (gameRatio < deviceRatio) {
      newHeight = deviceRatio * newWidth;
    } else {
      newWidth = newHeight / deviceRatio;
    }
    return { width: newWidth, height: newHeight };
}