<?php

date_default_timezone_set('America/Mexico_City');

require '../phplib/autoload.php';

$app = new \Slim\Slim();

function enviarCorreo($datos) {
  
  $from = 'webmaster@green-fix.com';
  $cc = 'contacto@green-fix.com';

  require $_SERVER['DOCUMENT_ROOT'].'/../green-fix-oauth.php';

  $mailer = new PHPMailerOAuth;
  $mailer->isSMTP();
  $mailer->SMTPDebug = 0;
  $mailer->Debugoutput = 'html';
  $mailer->Host = 'smtp.gmail.com';
  $mailer->Port = 587;
  $mailer->SMTPSecure = 'tls';
  $mailer->SMTPAuth = true;
  $mailer->AuthType = 'XOAUTH2';
  $mailer->oauthUserEmail = $from;
  $mailer->oauthClientId = $gf_oauthClientId;
  $mailer->oauthClientSecret = $gf_oauthClientSecret;
  $mailer->oauthRefreshToken = $gf_oauthRefreshToken;
  
  $nombre = $datos['nombre'];
  $reply = $datos['correo'];
  $titulo = 'Contacto desde green-fix.com';
  $body = '';
  foreach ($datos as $key => $value) {
    if ($key == 'intereses') {
      $body = $body.$key.': ';
      foreach ($value as $key => $value) {
        $body = $body.filter_var($value, FILTER_SANITIZE_STRING).', ';
      }
      $body = $body.'<br />';
    } elseif (substr( $key, 0, 1 ) !== '_') {
      $body = $body.$key.': '.filter_var($value, FILTER_SANITIZE_STRING).'<br />';
    }
  }

  $mailer->clearAllRecipients();
  $mailer->setFrom($from, 'Sitio Web Green Fix');
  $mailer->addAddress($from, 'webmaster');
  $mailer->addReplyTo($reply, $nombre);
  $mailer->addCC($cc);

  $mailer->Subject = $titulo;
  $mailer->Body = $body;
  $mailer->AltBody = $body;

  if(!$mailer->send()) {
    return $mailer->ErrorInfo;
  } else {
    return 'enviado';
  }
}

$app->post('/contacto', function () use ($app) {

  $request = $app->request();
  $post = $app->request->post();

  $respuesta = array();
  $errores = array();

  if ( empty($post['_gotcha']) ) {
    if ( !isset( $post['correo'] ) || empty( $post['correo'] ) || !filter_var( trim( $post['correo'] ), FILTER_VALIDATE_EMAIL ) ) 
    {
      $errores['correo'] = 'Es necesario el correo';
    }
    elseif ( !isset( $post['nombre'] ) || empty( $post['nombre'] ) )
    {
      $errores['nombre'] = 'Es necesario el nombre';
    }
    else
    {
      if ( $_SERVER['HTTP_HOST'] != 'multisite-joseanu.c9users.io' ) {
        $correo = enviarCorreo($post);
        if ( $correo == 'enviado' ) {
          $respuesta['ok'] = 'Gracias por contactarnos. Recibimos tus datos y en breve nos comunicaremos.';
        } else {
          $errores['envio'] = $correo;
        }
      }
      else
      {
        $respuesta['ok'] = 'Gracias por contactarnos. Recibimos tus datos y en breve nos comunicaremos.';
      }
    }
    if ( count($errores) > 0 ) {
      $respuesta['errores'] = $errores;
    }
    $app->response->write( json_encode($respuesta) );
  }
  else
  {
    $app->response->write( 'mal' );
  }
});

$app->run();