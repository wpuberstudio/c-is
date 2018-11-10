import $ from 'jquery';
import { TweenMax, Sine, Circ } from 'gsap';
import classie from 'classie';
import Hanlder from './Handler';

import { w, browserDetect } from '../app/globals';

export default class Scroll extends Hanlder {
  static destroyScroll(events) {
    $(window).off('scroll');

    Scroll.cache = {};
    Scroll.scroll = null;

    if (events) {
      for (let i = 0; i < events.length; i += 1) {
        $(window).off('scroll', events[i]);
      }
    }
  }

  static updateScroll() {
    Scroll.scroll = new Scroll();
  }

  constructor(props) {
    super(props);
    this.cache = {};
  }

  render() {
    this.saveAnimationCache();
    $(window).on('scroll', this.onScroll);
  }

  saveAnimationCache() {
    const animations = [];
    $('[data-animation]').each((i, element) => {
      const $el = $(element);
      animations.push({
        el: element,
        $el: $el,
        start: $el.data('start') || 0.1,
        y: $el.offset().top,
        height: $el.height(),
        done: $el.hasClass('is-passed'),
        type: $el.data('animation'),
        delay: $el.data('delay') || null,
        timing: $el.data('timing') || null,
      });
    });

    const parallaxes = [];
    $('[data-parallax]').each((i, el) => {
      let $el = $(el);
      let p = $el.data('parallax');
      parallaxes.push({
        $el: $el,
        start: 0,
        y: $el.offset().top,
        height: $el.height(),
        type: typeof p === 'string' ? p : null,
        shift: typeof p === 'number' ? p : null,
        done: false,
      });
    });

    this.cache.animations = animations;
    this.cache.parallaxes = parallaxes;

    this.onScroll();
  }

  onScroll = () => {
    const st = $(window).scrollTop();

    // this.sectionMove(st);

    if (this.cache.animations && this.cache.animations.length > 0) {
      for (let i = 0; i < this.cache.animations.length; i += 1) {
        const item = this.cache.animations[i];
        const itemY = !this.ignoreCache ? item.y : $(item.el).offset().top;
        const yBottom = st + ((1 - item.start) * w.height);
        const itemHeight = !this.ignoreCache ? item.height : $(item.el).height();

        if (!item.done && itemY <= yBottom && itemY + itemHeight >= st) {
          classie.add(item.el, 'is-passed');
          this.animation(item);
          item.done = true;
        }
      }
    }

    if (this.cache.parallaxes && this.cache.parallaxes.length > 0) {
      for (let i = 0; i < this.cache.parallaxes.length; i++) {
        this.parallax(this.cache.parallaxes[i], st, w.height);
      }
    }
  }

  sectionMove = (st) => {
    const sections = document.body.querySelectorAll('.js-section');
    for (let x = 0; x < sections.length; x++) {
      const section = sections[x];
      const sectionHeight = $(section).height();
      const sectionTop = $(section).offset().top;
      const sectionBottom = sectionTop + sectionHeight;
      const sectionMiddle = sectionTop + (sectionHeight / 2);
      const animStart = sectionTop + (sectionHeight / 1.5);
      if (st >= animStart & sectionBottom >= st) {
        const val = (st - animStart) / 500 * 2.5;
        if (val <= 1) TweenMax.set(section, { opacity: 1 - val });
        if (val <= 0) TweenMax.set(section, { opacity: 1 });
      }

      if (st >= sectionMiddle & animStart >= st) {
        TweenMax.set(section, { opacity: 1 });
      }
    }
  }

  animation = (item) => {
    const timing = item.timing || 1;
    const delay = item.delay || 0.1;

    switch (item.type) {
      case 'fadeUp':
        TweenMax.killTweensOf(item.el, { opacity: true, y: true });
        TweenMax.fromTo(
          item.el,
          timing,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: Sine.easeInOut,
            delay,
          },
        );
        classie.add(item.el, 'is-animated');

        break;

      case 'fadeRight':
        TweenMax.killTweensOf(item.el, { opacity: true, x: true });
        TweenMax.fromTo(
          item.el,
          timing,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            ease: Sine.easeInOut,
            delay,
          },
        );
        classie.add(item.el, 'is-animated');

        break;

      case 'fadeLeft':
        TweenMax.killTweensOf(item.el, { opacity: true, x: true });
        TweenMax.fromTo(
          item.el,
          timing,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            ease: Sine.easeInOut,
            delay,
          },
        );
        classie.add(item.el, 'is-animated');

        break;

      case 'grow':
        TweenMax.killTweensOf(item.el, { opacity: true, y: true });
        TweenMax.fromTo(
          item.el,
          timing,
          {
            y: 40,
            css: { scaleY: 0, opacity: 0 },
          },
          {
            css: { scaleY: 1, opacity: 1 },
            y: 0,
            ease: Sine.easeOut,
            delay,
          },
        );
        classie.add(item.el, 'is-animated');

        break;

      case 'growX':
        TweenMax.killTweensOf(item.el, { opacity: true, x: true });
        TweenMax.fromTo(
          item.el,
          timing,
          {
            x: 40,
            css: { scaleX: 0, opacity: 0 },
          },
          {
            css: { scaleX: 1, opacity: 1 },
            x: 0,
            ease: Sine.easeOut,
            delay,
          },
        );
        classie.add(item.el, 'is-animated');

        break;

      case 'splitText':
        TweenMax.killTweensOf(item.el, { opacity: true, y: true });
        TweenMax.staggerTo(item.$el.find('.splited'), timing, { y: 0, opacity: 1, delay, ease: Sine.easeOut }, 0.04);
        classie.add(item.el, 'is-animated');

        break;

      default:
        console.warn(`animation type "${item.type}"" does not exist`);
        break;
    }
  }

  parallax = (item, sT, windowHeight, headerHeight = 0) => {
    if (item.shift) {
      let $el = item.$el;
      let y = item.y;

      let pyBottom = sT + (1 - item.start) * windowHeight;
      let pyTop = sT - item.height;

      if (y >= (pyTop + headerHeight) && y <= pyBottom) {
        let percent = (y - sT + item.height - headerHeight) / (windowHeight + item.height - headerHeight);
        y = Math.round(percent * item.shift);

        let time = !item.done ? 0 : 0.5;
        item.done = true;

        TweenMax.killTweensOf($el);
        TweenMax.to($el, time, {
          y: y,
          roundProps: ['y'],
          // ease: Sine.easeOut,
        });
      }
    } else if (item.type) {
      switch (item.type) {
        case 'shape':
          TweenMax.set(item.$el, {
            y: !browserDetect().mobile ? sT * 0.5 : 0,
          });
          break;

        // case 'section':
        //   // console.log(sT + windowHeight * 0.5, item.y, item.height);
        //   if (sT + windowHeight * 0.5 > item.y) {
        //     Template.Nav.update(item.$el.attr('id'));
        //   }
        //   break;

        default:
          console.warn(`parallax type "${item.type}"" does not exist`);
          break;
      }
    }
  }
}
