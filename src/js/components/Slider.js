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
    this.x = 0;
    this.dragPoint = 0;
    this.marginBetweenItems = null;
    this.margin = this.$view.width() - w.width;

    this.onSlideBound = this.onSlide.bind(this);
    this.onDragStartBound = this.onDragStart.bind(this);
    this.onDragEndBound = this.onDragEnd.bind(this);

    this.events();
  }

  events () {
    this.$view[0].addEventListener('mousedown', this.onDragStartBound);
    this.$view[0].addEventListener('mouseup', this.onDragEndBound);
  }

  destroy () {
    super.destroy();
    this.$view[0].removeEventListener('mousedown', this.onDragStartBound);
    this.$view[0].removeEventListener('mouseup', this.onDragEndBound);
  }

  getMargin() {
    const item1 = this.$items[0];
    const item2 = this.$items[1]
    const item1Pos = $(item1).offset().left + item1.clientWidth;
    const item2Pos = $(item2).offset().left;
    this.marginBetweenItems = (item2Pos - item1Pos) * 2;
  }

  onSlide(event) {
    const x = event.clientX; // 10
    // this.x = 500
    // 
    // const value = x - (w.width / 2);
    const value = x - this.x + this.dragPoint;

    if (x > this.x) {
      this.sliderDirection('left');
    } else {
      this.sliderDirection('right');
    }

    TweenMax.killTweensOf(this.$view, { x: true });
    TweenMax.to(this.$view, 0.4, { x: value });
    // this.dragPoint = value;
  }

  onDragStart(event) {
    if (event.target !== event.currentTarget) {
      return false;
    }

    this.$items.removeClass('is-active');

    this.x = event.clientX;
    if (this.x > this.dragPoint) {
      this.sliderDirection('left');
    } else {
      this.sliderDirection('right');
    }

    if (!this.marginBetweenItems) {
      this.getMargin();
    }

    this.$view[0].addEventListener('mousemove', this.onSlideBound);

  }

  onDragEnd(event) {
    const x = event.clientX;
    const centre = w.width / 2;
    const centreLeft = centre - this.marginBetweenItems;
    const centreRight = centre + this.marginBetweenItems;
    const value = x - this.x + this.dragPoint;

    // console.log({
    //   centreLeft,
    //   centreRight,
    //   margin: this.marginBetweenItems,
    // })

    this.$view[0].removeEventListener('mousemove', this.onSlideBound);
    this.sliderDirection('both');

    this.$items.each((index, element) => {
      const $element = $(element);
      const offsetLeft = $element.offset().left;
      const offsetRight = offsetLeft + $element.width();
      if (offsetLeft > centreLeft && centreRight > offsetRight) {
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

    this.dragPoint = value;
  }

  sliderDirection (dir = 'both') {
    Utils.setAttribute(this.cursor, 'direction', dir)
  }
}
