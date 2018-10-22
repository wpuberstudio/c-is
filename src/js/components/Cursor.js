import { TweenMax } from 'gsap';

import { w } from '../app/globals';
import * as Utils from '../utils/utils';
import Component from './Component';

export default class Cursor extends Component {
  constructor($view) {
    super($view);

    this.view = $view;
    this.cursor = this.view[0];

    this.hoverElementsSelector = '.js-button-standard';
    this.lightElementsSelector = '.js-button-light, [data-theme="dark"]';
    this.arrowElementsSelector = '.js-button-arrows';
    // this.darkElementsSelector = '.js-cursor-dark, [data-theme="light"]'
    // this.darkLeaveElementsSelector = '.js-cursor-dark-leave, [data-theme="light"] .js-cursor-light'
    // this.backAreaElementsSelector = '.js-back-area'

    this.hoverElements = document.body.querySelectorAll(this.hoverElementsSelector);
    this.lightElements = document.body.querySelectorAll(this.lightElementsSelector);
    this.arrowElements = document.body.querySelectorAll(this.arrowElementsSelector);
    // this.darkElements = document.body.querySelectorAll(this.darkElementsSelector)
    // this.darkLeaveElements = document.body.querySelectorAll(this.darkLeaveElementsSelector)
    // this.backAreaElements = document.body.querySelectorAll(this.backAreaElementsSelector)

    this.currentX = (w.width / 2)
    this.currentY = (w.height / 2)

    this.targetX = (w.width / 2)
    this.targetY = (w.height / 2)

    // Bindings
    this.resetElementsBound = this.resetElements.bind(this)
    this.getInitialPosBound = this.getInitialPos.bind(this)
    this.getPosBound = this.getPos.bind(this)
    this.setPosBound = this.setPos.bind(this)
    this.hideBound = this.hide.bind(this)
    this.showBound = this.show.bind(this)
    this.growBound = this.grow.bind(this)
    this.shrinkBound = this.shrink.bind(this)
    this.darkBound = this.dark.bind(this)
    this.lightBound = this.light.bind(this)
    this.sliderModeOnBound = this.sliderModeOn.bind(this)
    this.sliderModeOffBound = this.sliderModeOff.bind(this)
    this.sliderDirectionBound = this.sliderDirection.bind(this)

    this.events();
  }

  events () {
    // super.initEvents()

    window.addEventListener('mousemove', this.getInitialPosBound)
    // document.body.addEventListener('mouseleave', this.hideBound)
    document.body.addEventListener('mouseenter', this.showBound)

    for (let x = 0; x < this.hoverElements.length; x++) {
      this.hoverElements[x].addEventListener('mouseenter', this.growBound)
      this.hoverElements[x].addEventListener('mouseleave', this.shrinkBound)
    }

    for (let x = 0; x < this.lightElements.length; x++) {
      this.lightElements[x].addEventListener('mouseenter', this.lightBound)
      this.lightElements[x].addEventListener('mouseleave', this.darkBound)
    }

    for (let x = 0; x < this.arrowElements.length; x++) {
      this.arrowElements[x].addEventListener('mouseenter', this.sliderModeOnBound)
      this.arrowElements[x].addEventListener('mouseleave', this.sliderModeOffBound)
    }

    // for (var x = 0; x < this.darkElements.length; x++) {
    //   this.darkElements[x].addEventListener('mouseenter', this.darkBound)
    // }

    // for (var x = 0; x < this.darkLeaveElements.length; x++) {
    //   this.darkLeaveElements[x].addEventListener('mouseleave', this.darkBound)
    // }

    // for (var x = 0; x < this.backAreaElements.length; x++) {
    //   this.backAreaElements[x].addEventListener('mouseenter', this.backBound)
    //   this.backAreaElements[x].addEventListener('mouseleave', this.backOutBound)
    // }
  }

  destroyEvents () {
    // super.destroyEvents()

    window.removeEventListener('mousemove', this.getInitialPosBound)
    window.removeEventListener('mousemove', this.getPosBound)
    // document.body.removeEventListener('mouseleave', this.hideBound)
    document.body.removeEventListener('mouseenter', this.showBound)

    for (let x = 0; x < this.hoverElements.length; x++) {
      this.hoverElements[x].removeEventListener('mouseenter', this.growBound)
      this.hoverElements[x].removeEventListener('mouseleave', this.shrinkBound)
    }

    for (let x = 0; x < this.lightElements.length; x++) {
      this.lightElements[x].removeEventListener('mouseenter', this.lightBound)
      this.lightElements[x].removeEventListener('mouseleave', this.darkBound)
    }

    for (let x = 0; x < this.arrowElements.length; x++) {
      this.arrowElements[x].removeEventListener('mouseenter', this.sliderModeOnBound)
      this.arrowElements[x].removeEventListener('mouseleave', this.sliderModeOffBound)
    }

    // for (var x = 0; x < this.darkElements.length; x++) {
    //   this.darkElements[x].removeEventListener('mouseenter', this.darkBound)
    // }

    // for (var x = 0; x < this.darkLeaveElements.length; x++) {
    //   this.darkLeaveElements[x].removeEventListener('mouseleave', this.darkBound)
    // }

    // for (var x = 0; x < this.backAreaElements.length; x++) {
    //   this.backAreaElements[x].removeEventListener('mouseenter', this.backBound)
    //   this.backAreaElements[x].removeEventListener('mouseleave', this.backOutBound)
    // }
  }

  resetElements () {
    console.log('reset');
    // Grow Areas
    for (let x = 0; x < this.hoverElements.length; x++) {
      this.hoverElements[x].removeEventListener('mouseenter', this.growBound)
      this.hoverElements[x].removeEventListener('mouseleave', this.shrinkBound)
    }

    this.hoverElements = document.body.querySelectorAll(this.hoverElementsSelector)

    for (let x = 0; x < this.hoverElements.length; x++) {
      this.hoverElements[x].addEventListener('mouseenter', this.growBound)
      this.hoverElements[x].addEventListener('mouseleave', this.shrinkBound)
    }

    // // Light Cursor Areas

    // for (let x = 0; x < this.lightElements.length; x++) {
    //   this.lightElements[x].addEventListener('mouseenter', this.lightBound)
    //   this.lightElements[x].addEventListener('mouseleave', this.darkBound)
    // }

    // // Arrow Cursor Areas

    // for (let x = 0; x < this.lightElements.length; x++) {
    //   this.lightElements[x].addEventListener('mouseenter', this.lightBound)
    //   this.lightElements[x].addEventListener('mouseleave', this.darkBound)
    // }

    // this.lightElements = document.body.querySelectorAll(this.lightElementsSelector)

    // for (var x = 0; x < this.lightElements.length; x++) {
    //   this.lightElements[x].addEventListener('mouseenter', this.lightBound)
    // }

    // // Dark Cursor Areas

    // for (var x = 0; x < this.darkElements.length; x++) {
    //   this.darkElements[x].removeEventListener('mouseenter', this.darkBound)
    // }

    // this.darkElements = document.body.querySelectorAll(this.darkElementsSelector)

    // for (var x = 0; x < this.darkElements.length; x++) {
    //   this.darkElements[x].addEventListener('mouseenter', this.darkBound)
    // }

    // // Dark Cursor Areas

    // for (var x = 0; x < this.darkLeaveElements.length; x++) {
    //   this.darkLeaveElements[x].removeEventListener('mouseleave', this.darkBound)
    // }

    // this.darkLeaveElements = document.body.querySelectorAll(this.darkLeaveElementsSelector)

    // for (var x = 0; x < this.darkLeaveElements.length; x++) {
    //   this.darkLeaveElements[x].addEventListener('mouseleave', this.darkBound)
    // }

    // // Back Areas

    // for (var x = 0; x < this.backAreaElements.length; x++) {
    //   this.backAreaElements[x].removeEventListener('mouseEnter', this.backBound)
    //   this.backAreaElements[x].removeEventListener('mouseleave', this.backOutBound)
    // }

    // this.backAreaElements = document.body.querySelectorAll(this.backAreaElementsSelector)

    // for (var x = 0; x < this.backAreaElements.length; x++) {
    //   this.backAreaElements[x].addEventListener('mouseenter', this.backBound)
    //   this.backAreaElements[x].addEventListener('mouseleave', this.backOutBound)
    // }
  }

  getInitialPos (e) {
    if (w.width < 1024) return false
    window.removeEventListener('mousemove', this.getInitialPosBound)

    this.targetX = e.clientX
    this.targetY = e.clientY
    this.currentX = this.targetX
    this.currentY = this.targetY

    window.requestAnimationFrame(this.setPosBound)
    window.addEventListener('mousemove', this.getPosBound)
  }

  getPos (e) {
    this.targetX = e.clientX
    this.targetY = e.clientY
  }

  setPos () {
    this.currentX += (this.targetX - this.currentX) * .5
    this.currentY += (this.targetY - this.currentY) * .5

    TweenMax.set(this.cursor, {x: this.currentX, y: this.currentY})

    window.requestAnimationFrame(this.setPosBound)
  }

  hide () {
    Utils.setAttribute(this.cursor, 'hidden', true)
  }

  show () {
    Utils.setAttribute(this.cursor, 'hidden', false)
  }

  grow () {
    // Utils.setAttribute(this.cursor, 'arrows', false)
    Utils.setAttribute(this.cursor, 'expand', true)
  }

  shrink () {
    // Utils.setAttribute(this.cursor, 'arrows', false)
    Utils.setAttribute(this.cursor, 'expand', false)
  }

  light () {
    // Utils.setAttribute(this.cursor, 'arrows', false)
    Utils.setAttribute(this.cursor, 'light', true)
  }

  dark () {
    // Utils.setAttribute(this.cursor, 'arrows', false)
    Utils.setAttribute(this.cursor, 'light', false)
  }

  sliderModeOn () {
    Utils.setAttribute(this.cursor, 'arrows', true)
  }

  sliderModeOff () {
    Utils.setAttribute(this.cursor, 'arrows', false)
  }

  sliderDirection (dir = 'both') {
    Utils.setAttribute(this.cursor, 'direction', dir)
  }
}
