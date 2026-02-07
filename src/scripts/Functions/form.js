// de http://blueashes.com/2013/web-development/html5-form-validation-fallback/
function hasHtml5Validation() {
  return typeof document.createElement('input').checkValidity === 'function';
}

function initForm() {
  const form = document.forms[0];

  if (form != null) {
    form.addEventListener('submit', (evt) => {
      if (hasHtml5Validation()) {
        if (!form.checkValidity()) {
          evt.preventDefault();
          form.classList.add('invalid');
        } else if (document.forms[0] && window.FormData) {
          const posturl = form.action;

          const message = {
            loading: 'Enviando...',
            success: 'Muchas gracias. Recibimos tu mensaje.',
            failure: 'Tuvimos un problema al enviar tu mensaje.',
          };

          const statusMessage = document.createElement('div');
          statusMessage.className = 'status';

          const request = new XMLHttpRequest();
          request.open('POST', posturl, true);
          request.setRequestHeader('accept', 'application/json');

          evt.preventDefault();
          form.getElementsByTagName('button')[0].disabled = true;
          form.appendChild(statusMessage);

          const formData = new FormData(form);

          request.send(formData);

          request.onreadystatechange = () => {
            // <4 =  waiting on response from server
            if (request.readyState < 4) {
              statusMessage.innerHTML = message.loading;

            // 4 = Response from server has been completely loaded.
            } else if (request.readyState === 4) {
              // 200 - 299 = successful
              if (request.status === 200 && request.status < 300) {
                const respuesta = JSON.parse(request.response);
                if (respuesta.ok) {
                  statusMessage.innerHTML = respuesta.ok;
                  window.dataLayer.push({
                    event: 'formSubmitted',
                    formName: form.id,
                  });
                } else if (respuesta.errores) {
                  statusMessage.innerHTML = respuesta.errores;
                } else {
                  statusMessage.innerHTML = message.failure;
                }
              } else {
                form.insertAdjacentHTML('beforeend', message.failure);
              }
            }
          };
        }
      }
    });
  }
}

export default initForm;
