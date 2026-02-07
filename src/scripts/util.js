export const DOMUtil = {
  ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      document.attachEvent('onreadystatechange', () => {
        if (document.readyState !== 'loading') {
          fn();
        }
      });
    }
  },

  getFunctionName(attributes) {
    let func = [];

    Array.prototype.slice.call(attributes).forEach((item) => {
      if (item.name === 'data-function') {
        func = item.value.split(',');
      }
    });

    return func;
  },
};

export const $class = (className, all = false) => {
  const selection = document.getElementsByClassName(className);
  return (all) ? Array.from(selection) : selection[0];
};

export const $id = id => document.getElementById(id);
