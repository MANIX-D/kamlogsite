<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateQuoteRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['nullable', 'in:nouveau,en_cours,envoyé,accepte,refuse'],
            'user_id' => ['nullable', 'exists:users,id'],
            'estimated_amount' => ['nullable', 'numeric', 'min:0'],
            'notes_admin' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Le statut doit être nouveau, en_cours, envoyé, accepte ou refuse.',
            'user_id.exists' => 'L\'administrateur sélectionné n\'existe pas.',
            'estimated_amount.numeric' => 'Le montant estimé doit être un nombre.',
            'estimated_amount.min' => 'Le montant estimé doit être positif.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
