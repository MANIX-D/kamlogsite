<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class VisitRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'company' => ['nullable', 'string', 'max:255'],
            'date' => ['required', 'date', 'after:today'],
            'heure' => ['required', 'string', 'regex:/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/'],
            'type_visite' => ['required', 'in:guidee,autonome,virtuelle,rencontre'],
            'message' => ['nullable', 'string'],
            'infrastructure_id' => ['nullable', 'exists:infrastructures,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est requis.',
            'email.required' => 'L\'email est requis.',
            'email.email' => 'L\'email doit être valide.',
            'phone.required' => 'Le téléphone est requis.',
            'date.required' => 'La date est requise.',
            'date.after' => 'La date doit être dans le futur.',
            'heure.required' => 'L\'heure est requise.',
            'heure.regex' => 'L\'heure doit être au format HH:MM.',
            'type_visite.in' => 'Le type de visite doit être guidee, autonome, virtuelle ou rencontre.',
            'infrastructure_id.exists' => 'L\'infrastructure sélectionnée n\'existe pas.',
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
