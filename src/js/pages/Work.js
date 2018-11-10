import $ from 'jquery';
import { TweenMax } from 'gsap';

import DefaultPage from './DefaultPage';

export default class Work extends DefaultPage {
  constructor($view, options) {
    super($view);

    this.$view = $view;
    this.options = options;
    this.$listNav = $('.js-list-nav');
    // this.render();
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

  events() {
    // $(window).on('scroll', this.parallax);
  }

  destroy() {
    super.destroy();
    // $(window).off('scroll', this.parallax);
  }

  render() {
    this.splitWord().then(() => {
      this.heroAnim();
    });
    this.events();
  }
}
