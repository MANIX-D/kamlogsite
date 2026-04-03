<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Réinitialisation de mot de passe</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          {{-- Header --}}
          <tr>
            <td style="background:linear-gradient(135deg,#dc2626 0%,#991b1b 100%);padding:40px 48px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 24px;margin-bottom:20px;">
                <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:2px;">KAMLOG</span>
              </div>
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;line-height:1.3;">
                Réinitialisation de votre<br/>mot de passe
              </h1>
            </td>
          </tr>

          {{-- Body --}}
          <tr>
            <td style="padding:48px;">

              <p style="color:#374151;font-size:16px;margin:0 0 24px;line-height:1.7;">
                Bonjour,
              </p>
              <p style="color:#374151;font-size:16px;margin:0 0 24px;line-height:1.7;">
                Nous avons reçu une demande de réinitialisation de mot de passe pour le compte associé à
                <strong style="color:#1d4ed8;">{{ $email }}</strong>.
              </p>

              {{-- Verification Code --}}
              <div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:12px;padding:24px;margin-bottom:24px;text-align:center;">
                <p style="color:#92400e;font-size:14px;font-weight:600;margin:0 0 12px;">
                  🔑 Votre code de vérification :
                </p>
                <div style="display:inline-block;background:#ffffff;border:2px dashed #f59e0b;border-radius:8px;padding:16px 32px;">
                  <span style="font-size:36px;font-weight:800;color:#1e3a8a;letter-spacing:8px;font-family:'Courier New',monospace;">
                    {{ $code }}
                  </span>
                </div>
              </div>

              {{-- CTA Button --}}
              <div style="text-align:center;margin:32px 0;">
                <a href="{{ $resetLink }}"
                   style="display:inline-block;background:linear-gradient(135deg,#1d4ed8 0%,#1e40af 100%);color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:12px;letter-spacing:0.5px;box-shadow:0 4px 14px rgba(29,78,216,0.4);">
                  🔓 Réinitialiser mon mot de passe
                </a>
              </div>

              {{-- Expiry Warning --}}
              <div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:8px;padding:14px 18px;margin-bottom:24px;text-align:center;">
                <span style="color:#991b1b;font-size:13px;font-weight:600;">
                  ⚠️ Ce code et ce lien expirent dans <strong>5 minutes</strong>
                </span>
              </div>

              {{-- Link fallback --}}
              <p style="color:#6b7280;font-size:13px;line-height:1.6;margin-bottom:8px;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
              </p>
              <p style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px;word-break:break-all;color:#1d4ed8;font-size:12px;margin-bottom:32px;">
                {{ $resetLink }}
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;"/>

              <p style="color:#9ca3af;font-size:12px;text-align:center;line-height:1.6;margin:0;">
                Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.<br/>
                Votre mot de passe restera inchangé.<br/><br/>
                © {{ date('Y') }} KAMLOG — Société Camerounaise de Magasinage et de Logistique
              </p>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
