import $ from 'jquery';
import createHistory from 'history/createBrowserHistory';

const History = createHistory();
const TIME_LIMIT = 5000;
const PAGE_TITLE = 'C Is';


export default class Trigger {
  static CONTENT_SELECTOR = '#wrapper';

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

  static setHistory = (event) => {
    const baseURL = event ? $(event.currentTarget).attr('href').replace(`http://${window.location.host}`, '') : window.location.pathname;
    const title = $(['data-page']).data('page');
    const prevTitle = history.state ? history.state.title : '';
    const slug = baseURL.replace(/\//g, '');

    const stateObj = {
      title,
      prevTitle,
      slug,
      randomData: Math.random(),
    };

    window.history.pushState(stateObj, '', baseURL);
  };

  constructor() {
    this.request = null;
    this.timeout = null;
  }

  load() {
    // cancel old request:
    if (this.request) this.request.abort();

    // define url
    const path = window.location.pathname;
    const search = window.location.search || '';
    let url = path + search;

    // define timeout
    window.clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.request) window.location.reload();
    }, TIME_LIMIT);

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
