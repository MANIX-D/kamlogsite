<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetMail;
use App\Models\PasswordResetToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /**
     * Étape 1 : Envoi du lien + code par email.
     */
    public function sendResetLink(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            // Répondre positivement même si l'email n'existe pas (sécurité)
            return response()->json([
                'success' => true,
                'message' => 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
            ]);
        }

        // Invalider les anciens tokens pour cet email
        PasswordResetToken::where('email', $validated['email'])
            ->whereNull('used_at')
            ->update(['used_at' => now()]);

        // Générer le token et le code
        $plainToken = Str::random(64);
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $resetToken = PasswordResetToken::create([
            'email'      => $validated['email'],
            'token_hash' => hash('sha256', $plainToken),
            'code'       => $code,
            'expires_at' => now()->addMinutes(5),
        ]);

        // Envoyer l'email
        Mail::to($validated['email'])->send(
            new PasswordResetMail($resetToken, $plainToken)
        );

        return response()->json([
            'success' => true,
            'message' => 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
        ]);
    }

    /**
     * Étape 2 : Vérification du code à 6 chiffres.
     */
    public function verifyCode(Request $request, string $token): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $resetToken = $this->findValidToken($token);

        if (!$resetToken) {
            return response()->json([
                'success' => false,
                'message' => 'Ce lien est invalide ou a expiré.',
            ], 422);
        }

        // Vérifier le code
        if ($resetToken->code !== $validated['code']) {
            return response()->json([
                'success' => false,
                'message' => 'Code de vérification incorrect.',
            ], 422);
        }

        // Marquer comme vérifié
        $resetToken->markAsVerified();

        return response()->json([
            'success' => true,
            'message' => 'Code vérifié avec succès. Vous pouvez maintenant réinitialiser votre mot de passe.',
        ]);
    }

    /**
     * Étape 3 : Réinitialisation du mot de passe.
     */
    public function resetPassword(Request $request, string $token): JsonResponse
    {
        $validated = $request->validate([
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*#?&]/',
            ],
        ], [
            'password.regex' => 'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial (@$!%*#?&).',
        ]);

        $resetToken = $this->findValidToken($token);

        if (!$resetToken) {
            return response()->json([
                'success' => false,
                'message' => 'Ce lien est invalide ou a expiré.',
            ], 422);
        }

        // Vérifier que le code a été validé
        if (!$resetToken->isVerified()) {
            return response()->json([
                'success' => false,
                'message' => 'Le code de vérification n\'a pas été validé.',
            ], 422);
        }

        // Mettre à jour le mot de passe
        $user = User::where('email', $resetToken->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur introuvable.',
            ], 404);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Révoquer tous les tokens d'authentification existants
        $user->tokens()->delete();

        // Marquer le token de reset comme utilisé
        $resetToken->markAsUsed();

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
        ]);
    }

    /**
     * Valider un token (vérifie que le lien est encore valide — appelé au chargement de la page).
     */
    public function validateToken(string $token): JsonResponse
    {
        $resetToken = $this->findValidToken($token);

        if (!$resetToken) {
            return response()->json([
                'success' => false,
                'message' => 'Ce lien est invalide ou a expiré.',
            ], 422);
        }

        return response()->json([
            'success'  => true,
            'data'     => [
                'email'      => $this->maskEmail($resetToken->email),
                'expires_at' => $resetToken->expires_at->toIso8601String(),
                'verified'   => $resetToken->isVerified(),
            ],
        ]);
    }

    /**
     * Retrouver un token valide par son hash.
     */
    private function findValidToken(string $plainToken): ?PasswordResetToken
    {
        $hash = hash('sha256', $plainToken);

        return PasswordResetToken::where('token_hash', $hash)
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->first();
    }

    /**
     * Masquer partiellement l'email pour la sécurité.
     */
    private function maskEmail(string $email): string
    {
        [$local, $domain] = explode('@', $email);
        $maskedLocal = substr($local, 0, 2) . str_repeat('*', max(strlen($local) - 2, 0));
        return $maskedLocal . '@' . $domain;
    }
}
