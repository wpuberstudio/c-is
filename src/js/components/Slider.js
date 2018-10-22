import { TweenMax } from 'gsap';
import $ from 'jquery';

import { w } from '../app/globals';
import * as Utils from '../utils/utils';
import Component from './Component';

export default class Slider extends Component {
  constructor($view) {
    super($view);

    this.$view = $view;
    this.$items = $view.children();
    this.cursor = document.querySelector('.js-cursor');
    this.dragPoint = 0;
    this.margin = this.$view.width() - w.width;
    this.initialSlidesPosition = [];

    this.onSlideBound = this.onSlide.bind(this);
    this.onDragStartBound = this.onDragStart.bind(this);
    this.onDragEndBound = this.onDragEnd.bind(this);

    this.events();
  }

  events () {
    document.addEventListener('mousedown', this.onDragStartBound);
    document.addEventListener('mouseup', this.onDragEndBound);
  }

  destroy () {
    super.destroy();
    document.removeEventListener('mousedown', this.onDragStartBound);
    document.removeEventListener('mouseup', this.onDragEndBound);
  }

  onSlide(event) {
    const x = event.clientX;
    const value = x - (w.width / 2);

    if (x > this.dragPoint) {
      this.sliderDirection('left');
    } else {
      this.sliderDirection('right');
    }

    TweenMax.killTweensOf(this.$view, { x: true });
    TweenMax.to(this.$view, 0.4, { x: value });
    this.dragPoint = x;
  }

  onDragStart(event) {
    const st = $(window).scrollTop();
    const offsetTop = this.$view.offset().top - (this.$view.height() / 2);
    const offsetBottom = offsetTop + ( this.$view.height() / 2 );

    if (st > offsetTop && st < offsetBottom ) {    
      this.$items.removeClass('is-active');

      const x = event.clientX;
      if (x > this.dragPoint) {
        this.sliderDirection('left');
      } else {
        this.sliderDirection('right');
      }

      window.addEventListener('mousemove', this.onSlideBound);

      this.dragPoint = x;
    } else {
      window.removeEventListener('mousemove', this.onSlideBound);
    }
  }

  onDragEnd(event) {
    const x = event.clientX;
    const centre = w.width / 2;

    window.removeEventListener('mousemove', this.onSlideBound);
    this.sliderDirection('both');

    this.$items.each((index, element) => {
      const $element = $(element);
      const offsetLeft = $element.offset().left;
      const offsetRight = offsetLeft + $element.width();
      if (offsetLeft < centre && centre < offsetRight) {
        this.$items.removeClass('is-active');
        $element.addClass('is-active');
      }
    })

    // this.initialSlidesPosition.forEach(({ $element, offsetLeft, offsetRight }) => {
    //   if (offsetLeft < centre && centre < offsetRight) {
    //     this.$items.removeClass('is-active');
    //     $element.addClass('is-active');
    //   }
    // })

    this.dragPoint = x;
  }

  sliderDirection (dir = 'both') {
    Utils.setAttribute(this.cursor, 'direction', dir)
  }
}
