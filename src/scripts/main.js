import 'lazysizes';
import svg4everybody from 'svg4everybody';
import isMobile from 'ismobilejs';
import { DOMUtil, $class } from './util';
import linkeaTelefonos from './telefonos';
import Functions from './Functions/index';

//  require('es6-promise').polyfill()

window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.init = false;

function readyDOM() {
  // Load the function based on the body tag data-function=""
  const func = DOMUtil.getFunctionName(document.body.attributes);

  if (isMobile.phone) linkeaTelefonos();

  window.lazySizes.init();
  svg4everybody();

  if (func !== undefined) {
    func.forEach((funcion) => {
      if (Functions[funcion] !== undefined) {
        Functions[funcion]();
      }
    });
  }

  $class('siteHeader__menuPrincipal__toggle').addEventListener('click', () => {
    $class('siteHeader__menuPrincipal').classList.toggle('activo');
  });

  if (window.location.hostname === 'www.green-fix.com' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
}

DOMUtil.ready(readyDOM);
