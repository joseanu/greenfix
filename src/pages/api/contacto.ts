import type { APIRoute } from 'astro';

const TO_EMAIL = 'contacto@green-fix.com';
const CC_EMAIL = 'admin@ulloa.mx';
const FROM_EMAIL = 'contacto@green-fix.com';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function cleanText(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    if (cleanText(data.get('_gotcha'))) {
      return new Response(JSON.stringify({ success: false }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const nombre = cleanText(data.get('nombre'));
    const correo = cleanText(data.get('correo'));
    const empresa = cleanText(data.get('empresa'));
    const mensaje = cleanText(data.get('mensaje'));

    if (!nombre || !correo || !mensaje) {
      return new Response(JSON.stringify({ success: false, error: 'Campos requeridos incompletos.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(correo)) {
      return new Response(JSON.stringify({ success: false, error: 'Correo invalido.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const textBody = [
      'Nuevo contacto desde green-fix.com',
      '',
      `Nombre: ${nombre}`,
      `Correo: ${correo}`,
      `Empresa: ${empresa || 'No especificada'}`,
      'Mensaje:',
      mensaje,
    ].join('\n');

    const htmlBody = [
      '<h2>Nuevo contacto desde green-fix.com</h2>',
      `<p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>`,
      `<p><strong>Correo:</strong> ${escapeHtml(correo)}</p>`,
      `<p><strong>Empresa:</strong> ${escapeHtml(empresa || 'No especificada')}</p>`,
      `<p><strong>Mensaje:</strong><br>${escapeHtml(mensaje).replaceAll('\n', '<br>')}</p>`,
    ].join('');

    const mailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: TO_EMAIL }],
            cc: [{ email: CC_EMAIL }],
          },
        ],
        from: {
          email: FROM_EMAIL,
          name: 'Sitio Web Green Fix',
        },
        reply_to: {
          email: correo,
          name: nombre,
        },
        subject: 'Nuevo contacto desde green-fix.com',
        content: [
          {
            type: 'text/plain',
            value: textBody,
          },
          {
            type: 'text/html',
            value: htmlBody,
          },
        ],
      }),
    });

    if (!mailResponse.ok) {
      return new Response(JSON.stringify({ success: false }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
