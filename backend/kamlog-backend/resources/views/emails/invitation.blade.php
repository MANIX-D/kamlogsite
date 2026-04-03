<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Invitation KAMLOG</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          {{-- Header --}}
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%);padding:40px 48px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 24px;margin-bottom:20px;">
                <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:2px;">KAMLOG</span>
              </div>
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;line-height:1.3;">
                Vous êtes invité(e) à rejoindre<br/>l'administration KAMLOG
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
                <strong>{{ $inviter->name }}</strong> vous invite à rejoindre le panneau d'administration de <strong>KAMLOG</strong> en tant que
                <strong style="color:#1d4ed8;">
                  @switch($invitation->role)
                    @case('super_admin') Super Administrateur @break
                    @case('admin') Administrateur @break
                    @default Éditeur
                  @endswitch
                </strong>.
              </p>

              {{-- Role Badge --}}
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 20px;margin-bottom:32px;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="color:#1e40af;font-size:14px;font-weight:600;">🎭 Rôle attribué :</span>
                  <span style="background:#1d4ed8;color:#fff;border-radius:20px;padding:4px 16px;font-size:13px;font-weight:600;display:inline-block;">
                    @switch($invitation->role)
                      @case('super_admin') Super Admin @break
                      @case('admin') Admin @break
                      @default Éditeur
                    @endswitch
                  </span>
                </div>
                @if($invitation->role === 'editor' && !empty($invitation->permissions))
                <div style="margin-top:12px;">
                  <span style="color:#374151;font-size:13px;font-weight:600;">Sections autorisées :</span>
                  <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">
                    @foreach(array_keys($invitation->permissions) as $section)
                    <span style="background:#e0e7ff;color:#3730a3;border-radius:20px;padding:2px 12px;font-size:12px;font-weight:500;display:inline-block;margin:2px;">
                      {{ ucfirst(str_replace('_', ' ', $section)) }}
                    </span>
                    @endforeach
                  </div>
                </div>
                @endif
              </div>

              {{-- CTA Button --}}
              <div style="text-align:center;margin:32px 0;">
                <a href="{{ $invitationLink }}"
                   style="display:inline-block;background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:12px;letter-spacing:0.5px;box-shadow:0 4px 14px rgba(220,38,38,0.4);">
                  ✉ Créer mon compte
                </a>
              </div>

              {{-- Expiry Warning --}}
              <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:14px 18px;margin-bottom:24px;text-align:center;">
                <span style="color:#92400e;font-size:13px;font-weight:600;">
                  ⏰ Ce lien expire dans <strong>24 heures</strong>
                  ({{ $invitation->expires_at->format('d/m/Y à H:i') }})
                </span>
              </div>

              {{-- Link fallback --}}
              <p style="color:#6b7280;font-size:13px;line-height:1.6;margin-bottom:8px;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
              </p>
              <p style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px;word-break:break-all;color:#1d4ed8;font-size:12px;margin-bottom:32px;">
                {{ $invitationLink }}
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;"/>

              <p style="color:#9ca3af;font-size:12px;text-align:center;line-height:1.6;margin:0;">
                Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.<br/>
                Cet email a été envoyé automatiquement par le système KAMLOG.<br/>
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
