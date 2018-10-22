import $ from 'jquery';
import { TweenMax, Sine } from 'gsap';
import { w } from '../app/globals';

import DefaultPage from './DefaultPage';

const SCROLL_PERCENTAGE = 400;

export default class Home extends DefaultPage {
  constructor($view, options) {
    super($view);

    this.$view = $view;
    this.options = options;
    this.$listNav = $('.js-list-nav');
    // this.render();
  }

  handleScroll = () => {
    const st = $(window).scrollTop();
    if (w.height >= st) {
      const imagePercentage = st / SCROLL_PERCENTAGE;
      TweenMax.set('.js-home-video', { opacity: 1 - imagePercentage });
    }

    if (200 >= st) {
      TweenMax.to('.js-home-video', 0.6, { opacity: 1 });
    }
  }

  splitWord = () => (
    new Promise((resolve) => {
      const $elements = $('.js-title');

      $elements.each((i, el) => {
        const $ps = $(el).find('p');

        $ps.each((i, p) => {
          const tar = $(p).text();
          const str = tar.split('');
          const spanClass = 'splited';

          let markup = '';

          for (let n = 0; n < str.length; n += 1) {
            let spanCssClass = spanClass;
            if (str[n] === ' ') {
              spanCssClass = `${spanClass}--space`;
              str[n] = '';
            }
            markup += `<span class="${spanCssClass}">${str[n]}</span>`;
          }
          $(p).html(markup);
        })

        if (i === $elements.length - 1) {
          resolve();
        }
      });
    })
  );

  heroAnim = () => {
    // const $letters = $('.js-hero').find('.splited');
    TweenMax.set('.js-title', { opacity: 1 });
    // TweenMax.staggerTo($letters, 0.8, { y: 0, opacity: 1, delay: 0.3, ease: Sine.easeOut }, 0.06);
  };

  postReveal = (e) => {
    const $parent = $(e.currentTarget).parents('.post');
    const $image = $parent.find('.post__image');

    $image.addClass('is-active');
  };

  postHide = (e) => {
    const $parent = $(e.currentTarget).parents('.post');
    const $image = $parent.find('.post__image');

    $image.removeClass('is-active');
  };

  events() {
    $(window).on('scroll', this.handleScroll);
    this.$view.find('.post__link').on('mouseover', this.postReveal);
    this.$view.find('.post__link').on('mouseleave', this.postHide);
  }

  destroy() {
    super.destroy();
    $(window).off('scroll', this.handleScroll);
    this.$view.find('.post__link').off('mouseover', this.postReveal);
    this.$view.find('.post__link').off('mouseleave', this.postHide);
  }

  render() {
    this.splitWord().then(() => {
      this.heroAnim();
    });
    this.events();
  }
}

// Component.Home = Home;
