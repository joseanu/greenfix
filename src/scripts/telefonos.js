import { $class } from './util';

export default function linkeaTelefonos() {
  $class('phone-number', true).forEach((el) => {
    const tel = el.dataset.href;
    const clases = (el.classList.length > 0) ? ` class="${el.classList}"` : '';
    el.outerHTML = `<a href="${tel}"${clases}>${el.innerHTML}</a>`;
  });
}
