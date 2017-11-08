import $ from 'jquery';
import { TweenMax } from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import createHistory from 'history/createBrowserHistory';

const History = createHistory();

const content = '.container';
const header = '.header';
const footer = '.footer';

const timingIn = 1;
const timingOut = 0.4;

export default class Trigger {
  static TIME_LIMIT = 5000;
  static CONTENT_SELECTOR = '#container';

  static back(url) {
    if (history.length > 2 || document.referrer.length > 0) {
      History.back();
    } else if (url) {
      History.replace(null, null, url);
    } else {
      History.replace(null, null, '/');
    }
  }

  static pagePosition(position) {
    this.position = position || this.position;

    return this.position;
  }

  static setHistory = (e) => {
    const baseURL = (e) ? $(e.currentTarget).attr('href').replace(`http://${window.location.host}`, '') : window.location.pathname;
    const oldTitle = (history.state) ? history.state.title : '';
    const pageTitle = (e) ? $(e.currentTarget).attr('data-title') : $(['data-page-title']).data('data-page-title');
    const path = baseURL.replace(/\//g, '');
    const stateObj = {
      randomData: Math.random(),
      title: pageTitle,
      prevTitle: oldTitle,
      slag: path,
    };

    window.history.pushState(stateObj, '', baseURL);
  }

  static setTitle = (event) => {
    const title = $(event.currentTarget).data('title') || $(['data-page-title']).data('data-page-title');
    document.title = `${title} | C is`;
  }

  constructor() {
    this.request = null;
    this.timeout = null;
  }

  animateOut = () => {
    const scrollPos = $(window).scrollTop();
    const contentHeight = $(content).offset().top;
    const fadeDirection = (scrollPos > (contentHeight / 2)) ? 100 : -100;

    return new Promise((resolve) => {
      TweenMax.to(header, timingOut, { y: '-100%' });
      TweenMax.to(footer, timingOut, { y: '100%', alpha: 0 });

      $('body').removeClass('load-completed');

      TweenMax.to(content, 0.8, {
        alpha: 0,
        y: fadeDirection,
        onComplete: () => {
          TweenMax.set(window, { scrollTo: 0 });
          resolve();
        },
      });
    });
  }

  animateIn = (backTo) => {
    if (backTo) {
      TweenMax.to(content, 0.2, {
        y: 0,
        onComplete: () => {
          TweenMax.set(window, { scrollTo: position });
          TweenMax.to(content, timingIn, { alpha: 1, delay: 0.4 });
        },
      });
    } else {
      TweenMax.fromTo(content, timingIn, {
        alpha: 0,
        y: 0,
      }, {
        alpha: 1,
        delay: 0.4,
        onComplete: () => {
          $(content).css('transform', '');
        },
      });
    }
  }

  load() {
    // cancel old request:
    if (this.request) this.request.abort();

    // define url
    const path = window.location.pathname;
    const search = window.location.search || '';
    const url = path + search;

    // define timeout
    window.clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.request) window.location.reload();
    }, Trigger.TIME_LIMIT);

    // return promise
    // and do the request:
    return new Promise((resolve, reject) => {
      // do the usual xhr stuff:
      this.request = new XMLHttpRequest();
      this.request.open('GET', url);
      this.request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      // onload handler:
      this.request.onload = () => {
        if (this.request.status === 200) {
          this.loadedData = this.request.responseText;
          // this.trigger(PushStatesEvents.PROGRESS, 1);
          resolve(true);
        } else {
          reject(Error(this.request.statusText));

          if (this.request.statusText !== 'abort') {
            window.location.reload();
          }
        }

        this.request = null;
        window.clearTimeout(this.timeout);
      };

      // catching errors:
      this.request.onerror = () => {
        console.log('error');
        reject(Error('Network Error'));
        window.clearTimeout(this.timeout);
        this.request = null;
      };

      // catch progress
      this.request.onprogress = (e) => {
        if (e.lengthComputable) {
          // this.trigger(PushStatesEvents.PROGRESS, e.loaded / e.total);
        }
      };

      // send request:
      this.request.send();
    });
  }

  render() {
    const data = this.loadedData;
    const container = Trigger.CONTENT_SELECTOR;
    const $loadedContent = $(container, data)[0] ? $(container, data) : $(data).filter(container);
    const code = $loadedContent.html();

    $(container).html(code);
  }
}
