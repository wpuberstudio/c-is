// triangulation using https://github.com/ironwallaby/delaunay
 
import { TweenMax, TimelineMax, Cubic } from 'gsap';
import Component from './Component';
import Fragment from './Fragment';
import Delaunay from '../vendor/Delaunay';
import { w } from '../app/globals';

const TWO_PI = Math.PI * 2;
const imageWidth = w.width;
const imageHeight = w.height;
const clickPosition = [imageWidth * 0.5, imageHeight * 0.5];

//////////////
// MATH UTILS
//////////////

function randomRange(min, max) {
    return min + (max - min) * Math.random();
}

function clamp(x, min, max) {
    return x < min ? min : (x > max ? max : x);
}

function sign(x) {
    return x < 0 ? -1 : 1;
}

export default class LoaderEffect extends Component {
  constructor($view, callback) {
    super($view);

    this.vertices = [];
    this.indices = [];
    this.fragments = [];

    this.container = $view[0];
    this.callback = callback;
    // this.image = new Image();
  }

  init() {
    this.image = this.container.querySelector('img');
    this.render();
  }

  loadImage() {
    return new Promise(resolve => {
      let loaded = 0;

      this.image.onload = () => {
        if (++loaded === 1) {
          resolve();
        }
      }

      // const URL = '/assets/images/home-image.png';
      // const URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/crayon.jpg';
      const URL = '/assets/images/loader-image.jpg';
      this.image.src = URL;
    });
  }

  createImage() {
    this.container.appendChild(this.image);
  }

  triangulate() {
    const rings = [
      {r: 50, c:12 },
      {r: 150, c:12 },
      {r: 300, c:12 },
      {r: 1200, c:12 } // very large in case of corner clicks
    ];

    let x;
    let y;
    let centerX = clickPosition[0];
    let centerY = clickPosition[1];

    this.vertices.push([centerX, centerY]);

    rings.forEach((ring) => {
      const radius = ring.r;
      const count = ring.c;
      const variance = radius * 0.25;

      for (let i = 0; i < count; i++) {
        x = Math.cos((i / count) * TWO_PI) * radius + centerX + randomRange(-variance, variance);
        y = Math.sin((i / count) * TWO_PI) * radius + centerY + randomRange(-variance, variance);
        this.vertices.push([x, y]);
      }
    });

    this.vertices.forEach((v) => {
      v[0] = clamp(v[0], 0, imageWidth);
      v[1] = clamp(v[1], 0, imageHeight);
    });

    this.indices = Delaunay.triangulate(this.vertices);
  }

  shatterCompleteHandler = () => {
    // console.log(this.fragments);
    // add pooling?
    this.callback();
    this.fragments.forEach((f) => {
      this.container.removeChild(f.canvas);
    });

    this.fragments.length = 0;
    this.vertices.length = 0;
    this.indices.length = 0;

    this.createImage();

    // placeImage();
  };

  shatter() {
    let p0;
    let p1;
    let p2;
    let fragment;

    const tl0 = new TimelineMax({ onComplete: this.shatterCompleteHandler });

    for (let i = 0; i < this.indices.length; i += 3) {
      p0 = this.vertices[this.indices[i + 0]];
      p1 = this.vertices[this.indices[i + 1]];
      p2 = this.vertices[this.indices[i + 2]];

      fragment = new Fragment(p0, p1, p2, this.image);

      const dx = fragment.centroid[0] - clickPosition[0];
      const dy = fragment.centroid[1] - clickPosition[1];
      const d = Math.sqrt(dx * dx + dy * dy);
      const rx = 30 * sign(dy);
      const ry = 90 * -sign(dx);
      const delay = d * 0.003 * randomRange(0.9, 1.1);

      fragment.canvas.style.zIndex = Math.floor(d).toString();

      const tl1 = new TimelineMax();

      tl1.to(fragment.canvas, 0.5, {
          z: -500,
          rotationX: rx,
          rotationY: ry,
          ease: Cubic.easeIn,
      });

      tl1.to(fragment.canvas, 0.3,{ opacity: 0 }, 0.3);
      tl0.insert(tl1, delay);

      this.fragments.push(fragment);
      this.container.appendChild(fragment.canvas);
    }

    this.container.removeChild(this.image);
    // image.removeEventListener('click', imageClickHandler);
  }

  render() {
    TweenMax.set(this.container, { perspective: 500 });
    this.triangulate();
    this.shatter();
    // this.loadImage().then(() => {
      // this.createImage();
    // })
    // placeImage(false);
  }
}

