<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nouvelle actualité KAMLOG</title>
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
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;line-height:1.3;">
                📰 Nouvelle actualité
              </h1>
            </td>
          </tr>

          {{-- Image --}}
          @if($news->image_url)
          <tr>
            <td style="padding:0;">
              <img src="{{ $news->image_url }}" alt="{{ $news->image_alt_fr ?? $news->titre_fr }}" style="width:100%;max-height:300px;object-fit:cover;display:block;" />
            </td>
          </tr>
          @endif

          {{-- Body --}}
          <tr>
            <td style="padding:48px;">

              {{-- Type badge --}}
              <div style="margin-bottom:16px;">
                <span style="background:#eff6ff;color:#1e40af;border-radius:20px;padding:4px 16px;font-size:12px;font-weight:600;display:inline-block;text-transform:uppercase;">
                  {{ $news->type ?? 'Article' }}
                </span>
                @if($news->date_publication)
                <span style="color:#6b7280;font-size:13px;margin-left:12px;">
                  {{ $news->date_publication->format('d/m/Y') }}
                </span>
                @endif
              </div>

              <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;line-height:1.4;">
                {{ $news->titre_fr }}
              </h2>

              <p style="color:#374151;font-size:15px;margin:0 0 24px;line-height:1.7;">
                {{ Str::limit(strip_tags($news->contenu_fr), 250) }}
              </p>

              {{-- CTA Button --}}
              <div style="text-align:center;margin:32px 0;">
                <a href="{{ $newsLink }}"
                   style="display:inline-block;background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:12px;letter-spacing:0.5px;box-shadow:0 4px 14px rgba(220,38,38,0.4);">
                  Lire l'article complet
                </a>
              </div>

              @if($news->location)
              <p style="color:#6b7280;font-size:13px;text-align:center;margin:0 0 24px;">
                📍 {{ $news->location }}
              </p>
              @endif

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 24px;"/>

              <p style="color:#9ca3af;font-size:12px;text-align:center;line-height:1.6;margin:0;">
                Vous recevez cet email car vous êtes abonné(e) à la newsletter KAMLOG.<br/>
                <a href="{{ $unsubscribeLink }}" style="color:#6b7280;text-decoration:underline;">Se désinscrire</a><br/><br/>
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
