import $ from 'jquery';
import { TweenMax, Circ } from 'gsap';
import classie from 'classie';

import Component from './Component';

export default class Contact extends Component {
  constructor($view, options) {
    super($view);

    this.$view = $view;
    this.options = options;

    this.contactForm = document.getElementById('contact-form');
    this.email = this.contactForm.querySelector('.email');
    this.submitButton = this.contactForm.querySelector('.submit');

    this.messageEl = document.getElementById('form-message');

    this.render();
  }
  render() {
    this.events();
  }
  events() {
    this.contactForm.addEventListener('submit', this.formSubmit);
  }
  formSubmit = (event) => {
    event.preventDefault();

    const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    let valid = true;

    if (this.email.value !== '') {
      if (this.email.value.search(re) === -1) {
        this.messageEl.innerHTML = 'Please provide a valid email address';
        valid = false;
      }
    } else {
      this.messageEl.innerHTML = 'Please fill the blank.';
      valid = false;
    }

    return (valid) ? this.ajaxProcess() : false;
  }
  ajaxProcess() {
    const formData = $(this.contactForm).serialize();

    $.ajax({
      type: 'POST',
      url: this.contactForm.getAttribute('action'),
      data: formData,
    })
      .done((response) => {
        $('input, textarea').not('.submit').val('');

        TweenMax.to(this.contactForm, 1.2, {
          height: 0,
          opacity: 0,
          delay: 0.4,
          ease: Circ.easeOut,
          onComplete: () => {
            this.messageEl.innerHTML = 'Thank you! We\'ll be in touch.';
            classie.addClass(this.messageEl, 'is-done');
          },
        });
      })
      .fail((data) => {
        const errorMessage = 'Oops! An error occured and your message could not be sent.';
        this.messageEl.textContent = (data.responseText !== '') ? data.responseText : errorMessage;
      });
  }
}

Component.Contact = Contact;
