import $ from 'jquery';

export default function utilControl() {
  const $control = $('.util-control');
  const $gridControl = $control.find('.util-grid-controller');

  $gridControl.on('change', ({ currentTarget }) => {
    const checked = currentTarget.checked;
    if (checked) {
      $('.util-grids').addClass('is-active');
    } else {
      $('.util-grids').removeClass('is-active');
    }
  });
}