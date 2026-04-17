<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class PartnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name_fr' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'logo_url' => ['nullable', 'sometimes', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:2048'],
            'description_fr' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'category' => ['nullable', 'in:maritime,logistics,industrial,institutional,logistique,transport,technologie,financier,autre'],
            'sector_fr' => ['nullable', 'string', 'max:255'],
            'sector_en' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:500'],
            'partnership_level' => ['nullable', 'in:strategic,premium,standard,basic'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name_fr.required' => 'Le nom en français est requis.',
            'name_en.required' => 'Le nom en anglais est requis.',
            'logo_url.image' => 'Le fichier doit être une image.',
            'logo_url.mimes' => 'Le logo doit être au format JPEG, JPG, PNG, GIF ou WEBP.',
            'logo_url.max' => 'Le logo ne doit pas dépasser 2 Mo.',
            'category.in' => 'La catégorie doit être maritime, logistics, industrial, institutional, logistique, transport, technologie, financier ou autre.',
            'partnership_level.in' => 'Le niveau doit être strategic, premium, standard ou basic.',
            'website.url' => 'Le site web doit être une URL valide.',
            'email.email' => 'L\'email doit être valide.',
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
