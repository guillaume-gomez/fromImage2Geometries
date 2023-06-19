

export async function resizeImage(baseUrl64: string) : Promise<string> {
  const canvas = document.createElement('canvas');
  await fromDataUrlToCanvas(baseUrl64, canvas);
  const maxWidth = 1920;
  const maxHeight = 1080;

  if(canvas.width > maxWidth) {
    const width = maxWidth;
    const height = (canvas.width/canvas.height) * width;
    resizeImageCanvas(canvas, canvas, width, height);
  }
  else if(canvas.height > maxHeight) {
    const height = maxHeight;
    const width = (canvas.width/canvas.height) * height;
    resizeImageCanvas(canvas, canvas, width, height);
  }

  return canvas.toDataURL();
}

// mutate the canvas
async function fromDataUrlToCanvas(baseUrl64: string, originCanvas: HTMLCanvasElement) :Promise<void> {
  const context = originCanvas.getContext('2d');

  if(!context) {
    throw new Error("Cannot find context");
  }

  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      originCanvas.width = image.width;
      originCanvas.height = image.height;
      context.drawImage(image, 0, 0);
      resolve();
    };
    image.src = baseUrl64;
  });
}


function resizeImageCanvas(originCanvas: HTMLCanvasElement, targetCanvas: HTMLCanvasElement, expectedWidth: number, expectedHeight: number) {
  // resize image
  const canvasBuffer = document.createElement("canvas");
  const contextBuffer = canvasBuffer.getContext("2d");
  if(!contextBuffer) {
    throw new Error("Cannot find context");
  }

  // resize to 50%
  canvasBuffer.width = originCanvas.width * 0.5;
  canvasBuffer.height = originCanvas.height * 0.5;
  contextBuffer.drawImage(originCanvas, 0, 0, canvasBuffer.width, canvasBuffer.height);

  contextBuffer.drawImage(canvasBuffer, 0, 0, canvasBuffer.width * 0.5, canvasBuffer.height * 0.5);

  const contextTarget = targetCanvas.getContext("2d");
  if(!contextTarget) {
    throw new Error("Cannot find context");
  }

  targetCanvas.width = expectedWidth;
  targetCanvas.height = expectedHeight;

  contextTarget.drawImage(
    canvasBuffer,
    0,
    0,
    canvasBuffer.width * 0.5,
    canvasBuffer.height * 0.5,
    0,
    0,
    expectedWidth,
    expectedHeight
  );
}