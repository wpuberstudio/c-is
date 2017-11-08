import $ from 'jquery';
import { TweenMax, Sine } from 'gsap';

import Component from './Component';

export default class About extends Component {
  constructor($view, options) {
    super($view);

    this.$view = $view;
    this.options = options;

    this.$serviceDetail = $('.about-detail');
    this.counter = 0;

    this.render();
  }

  render() {
    this.events();
  }

  events() {
    $(window).on('scroll', this.parallax);
  }

  parallax = () => {
    const scrolled = $(window).scrollTop();
    const $secondContent = this.$serviceDetail;
    const secondContentOffset = $secondContent.offset().top;

    TweenMax.killTweensOf('.about-detail__image, .about-detail__thumbnail');
    TweenMax.set('.about-detail__image', { y: `${4 + -(scrolled * 0.06)}%`, roundProps: ['y'], ease: Sine.easeOut });
    TweenMax.set('.about-detail__thumbnail', { y: `${70 + -(scrolled * 0.03)}%`, roundProps: ['y'], ease: Sine.easeOut });
    // $('.white-wall').css('top',70 + -(scrolled*0.05)+'%');

    if (scrolled >= secondContentOffset / 1.666) {
      this.counter += 1;
      TweenMax.to('.js-storyline', 0.1, { height: `${20 + (this.counter * 0.6)}%` });
    }
  }
}

Component.About = About;
