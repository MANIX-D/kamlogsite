<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class InfrastructureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom_fr' => ['required', 'string', 'max:255'],
            'nom_en' => ['required', 'string', 'max:255'],
            'description_fr' => ['required', 'string'],
            'description_en' => ['required', 'string'],
            'surface' => ['nullable', 'string', 'max:100'],
            'capacite' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'sometimes'],
            'image_alt_fr' => ['nullable', 'string', 'max:255'],
            'image_alt_en' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'in:entrepot,bureau,atelier,showroom,autre'],
            'equipements' => ['nullable', 'array'],
            'specifications_techniques' => ['nullable', 'array'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'is_available' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom_fr.required' => 'Le nom en français est requis.',
            'nom_en.required' => 'Le nom en anglais est requis.',
            'description_fr.required' => 'La description en français est requise.',
            'description_en.required' => 'La description en anglais est requise.',
            'type.in' => 'Le type doit être entrepot, bureau, atelier, showroom ou autre.',
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
