

export function resizeImage(baseUrl64: string) : string {
  const canvas = document.createElement('canvas');
  fromDataUrlToCanvas(baseUrl64, canvas);
  // max width
  // max height
  resizeImageCanvas(canvas, canvas, 200, 200);
  canvas.toDataURL();
}


async function fromDataUrlToCanvas(baseUrl64: string, originCanvas: HTMLCanvasElement ) {
  const context = originCanvas.getContext('2d');

  if(!context) {
    throw new Error("Cannot find context");
  }

  const image = new Image();
  image.src = await new Promise(resolve => resolve(baseUrl64));
  image.onload = () => {
    context.drawImage(image, 0, 0);
  };
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