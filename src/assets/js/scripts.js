import $ from 'jquery';
import Promise from 'promise-polyfill';
import FastClick from 'fastclick';
import Page from './app/Page';

$(document).ready(() => {
  if (!window.Promise) { window.Promise = Promise; }
  const app = new Page();
  FastClick.attach(document.body);
});
