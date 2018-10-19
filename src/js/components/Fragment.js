export default class Fragment {
  constructor(v0, v1, v2, image) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.image = image;

    this.computeBoundingBox();
    this.computeCentroid();
    this.createCanvas();
    this.clip();
  }

  computeBoundingBox() {
    const xMin = Math.min(this.v0[0], this.v1[0], this.v2[0]);
    const xMax = Math.max(this.v0[0], this.v1[0], this.v2[0]);
    const yMin = Math.min(this.v0[1], this.v1[1], this.v2[1]);
    const yMax = Math.max(this.v0[1], this.v1[1], this.v2[1]);

    this.box ={
      x: xMin,
      y: yMin,
      w: xMax - xMin,
      h: yMax - yMin
    };
  }

  computeCentroid() {
    const x = (this.v0[0] + this.v1[0] + this.v2[0]) / 3;
    const y = (this.v0[1] + this.v1[1] + this.v2[1]) / 3;

    this.centroid = [x, y];
  }

  createCanvas () {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.box.w;
    this.canvas.height = this.box.h;
    this.canvas.style.width = this.box.w + 'px';
    this.canvas.style.height = this.box.h + 'px';
    this.canvas.style.left = this.box.x + 'px';
    this.canvas.style.top = this.box.y + 'px';
    this.ctx = this.canvas.getContext('2d');
  }

  clip () {
    this.ctx.translate(-this.box.x, -this.box.y);
    this.ctx.beginPath();
    this.ctx.moveTo(this.v0[0], this.v0[1]);
    this.ctx.lineTo(this.v1[0], this.v1[1]);
    this.ctx.lineTo(this.v2[0], this.v2[1]);
    this.ctx.closePath();
    this.ctx.clip();
    this.ctx.drawImage(this.image, 0, 0);
  }
}
