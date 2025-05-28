export class RenderBatch {
  private operations: Array<() => void> = [];

  add(operation: () => void) {
    this.operations.push(operation);
  }

  execute(ctx: CanvasRenderingContext2D) {
    // Save context state once
    ctx.save();

    // Execute all operations
    for (const operation of this.operations) {
      operation();
    }

    // Restore context state once
    ctx.restore();

    // Clear operations
    this.operations = [];
  }

  clear() {
    this.operations = [];
  }
}

// Utility functions for common operations
export const RenderUtils = {
  drawImage(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement | HTMLCanvasElement,
    x: number,
    y: number,
    width?: number,
    height?: number
  ) {
    if (width && height) {
      ctx.drawImage(image, x, y, width, height);
    } else {
      ctx.drawImage(image, x, y);
    }
  },

  fillRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  },

  strokeRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    lineWidth: number = 1
  ) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, width, height);
  },

  fillCircle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  },

  fillText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    font: string,
    color: string,
    align: CanvasTextAlign = 'left',
    baseline: CanvasTextBaseline = 'alphabetic'
  ) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y);
  },
}; 