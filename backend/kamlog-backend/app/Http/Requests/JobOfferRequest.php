<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class JobOfferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title_fr' => ['required', 'string', 'max:255'],
            'title_en' => ['required', 'string', 'max:255'],
            'description_fr' => ['required', 'string'],
            'description_en' => ['required', 'string'],
            'requirements_fr' => ['required', 'string'],
            'requirements_en' => ['required', 'string'],
            'benefits_fr' => ['nullable', 'string'],
            'benefits_en' => ['nullable', 'string'],
            'contract_type' => ['required', 'in:CDI,CDD,Stage,Freelance,Alternance'],
            'location' => ['required', 'string', 'max:255'],
            'experience_level' => ['required', 'in:junior,confirme,senior,expert'],
            'salary_range' => ['nullable', 'string', 'max:100'],
            'department' => ['nullable', 'string', 'max:255'],
            'application_deadline' => ['nullable', 'date', 'after:today'],
            'is_active' => ['nullable', 'boolean'],
            'is_urgent' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title_fr.required' => 'Le titre en français est requis.',
            'title_en.required' => 'Le titre en anglais est requis.',
            'description_fr.required' => 'La description en français est requise.',
            'description_en.required' => 'La description en anglais est requise.',
            'requirements_fr.required' => 'Les exigences en français sont requises.',
            'requirements_en.required' => 'Les exigences en anglais sont requises.',
            'contract_type.in' => 'Le type de contrat doit être CDI, CDD, Stage, Freelance ou Alternance.',
            'experience_level.in' => 'Le niveau doit être junior, confirmé, senior ou expert.',
            'application_deadline.after' => 'La date limite doit être dans le futur.',
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
