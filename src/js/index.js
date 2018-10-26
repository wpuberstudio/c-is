import $ from 'jquery';
import Promise from 'promise-polyfill';
import FastClick from 'fastclick';
import App from './app/App';
import utils from './utils/util-control';

import '../css/style.css';


$(document).ready(() => {
  if (!window.Promise) { window.Promise = Promise; }
  const app = new App();
  app.init();
  utils();
  FastClick.attach(document.body);
});
