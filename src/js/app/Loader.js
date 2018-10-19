import $ from 'jquery';
import { TweenMax, Sine } from 'gsap';
import { LoaderEffect } from '../components';
import { isInitialLoad } from './globals';

const TIMING_IN = 1;
const TIMING_OUT = 0.4;


export default class Loader {
  constructor() {
    this.$view = $('.main');
  }

  loaderOutInitial = (resolve) => {
    setTimeout(() => {
      const $container = $('.js-loader');
      TweenMax.to('.js-loader-count', 0.6, { opacity: 0 });

      const callback = (() => {
        TweenMax.set('.js-loader', { autoAlpha: 0 });
        $('.js-loader-count').text('0');
        TweenMax.to('#wrapper', 0.6, { opacity: 1 });
        resolve();
      });
      const loaderEffect = new LoaderEffect($container, callback);
      loaderEffect.init();
    }, 500);
  };

  loaderIn = () => {
    return new Promise((resolve) => {
      TweenMax.set('#wrapper', { opacity: 0 });
      TweenMax.to('.js-loader', 0.5, {
        autoAlpha: 1,
        ease: Sine.easeOut,
        onComplete: () => {
          resolve();
        },
      });
    });
  };

  loaderOut = (amount) => {
    let val = amount || 100;
    val = (amount >= 100) ? 100 : amount;

    return new Promise((resolve) => {
      // TweenMax.killTweensOf('.js-loader-count');
      $('.js-loader-count').text(val);


      if (val >= 100) {
        console.log(isInitialLoad);
        if (isInitialLoad) this.loaderOutInitial(resolve);
        else {
          TweenMax.to('.js-loader', 0.6, {
            autoAlpha: 0,
            ease: Sine.easeIn,
            delay: 0.8,
            onComplete: () => {
              $('.js-loader-count').text('0');
            },
          });
        }
      }
    });
  };

  loaderSet = () => {
    // TweenMax.set('.loader', { x: '-2%', rotationZ: 0 });
  };
}
