<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class QuoteRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'contact_person' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:500'],
            'service_type' => ['required', 'in:logistique,stockage,transport,personnalise'],
            'project_description' => ['required', 'string'],
            'requirements' => ['nullable', 'array'],
            'budget_range' => ['nullable', 'string', 'max:100'],
            'desired_start_date' => ['nullable', 'date', 'after:today'],
            'desired_end_date' => ['nullable', 'date', 'after:desired_start_date'],
        ];
    }

    public function messages(): array
    {
        return [
            'company_name.required' => 'Le nom de l\'entreprise est requis.',
            'contact_person.required' => 'Le nom du contact est requis.',
            'email.required' => 'L\'email est requis.',
            'email.email' => 'L\'email doit être valide.',
            'phone.required' => 'Le téléphone est requis.',
            'service_type.in' => 'Le type de service doit être logistique, stockage, transport ou personnalise.',
            'project_description.required' => 'La description du projet est requise.',
            'desired_start_date.after' => 'La date de début doit être dans le futur.',
            'desired_end_date.after' => 'La date de fin doit être après la date de début.',
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
