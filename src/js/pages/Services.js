import $ from 'jquery';
import { TweenMax, Sine } from 'gsap';

import DefaultPage from './DefaultPage';

export default class Services extends DefaultPage {
  constructor($view, options) {
    super($view);

    this.$view = $view;
    this.options = options;
    this.$serviceDetail = $('.about-detail');
    this.counter = 0;

    this.render();
  }

  parallax = () => {
    const scrolled = $(window).scrollTop();
    const secondContentOffset = this.$serviceDetail.offset().top;

    TweenMax.killTweensOf('.about-detail__image, .about-detail__thumbnail');
    TweenMax.set('.about-detail__image', { y: `${4 + -(scrolled * 0.06)}%`, roundProps: ['y'], ease: Sine.easeOut });
    TweenMax.set('.about-detail__thumbnail', { y: `${70 + -(scrolled * 0.03)}%`, roundProps: ['y'], ease: Sine.easeOut });

    if (scrolled >= secondContentOffset / 1.666) {
      this.counter += 1;
      TweenMax.to('.js-storyline', 0.1, { height: `${20 + (this.counter * 0.6)}%` });
    }
  }

  events() {
    $(window).on('scroll', this.parallax);
  }

  destroy() {
    super.destroy();
    $(window).off('scroll', this.parallax);
  }

  render() {
    this.events();
  }
}
