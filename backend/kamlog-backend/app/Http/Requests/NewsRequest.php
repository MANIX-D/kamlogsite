<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class NewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $newsId = $this->route('id') ?? $this->route('news');
        
        return [
            'titre_fr' => ['required', 'string', 'max:255'],
            'titre_en' => ['required', 'string', 'max:255'],
            'contenu_fr' => ['required', 'string'],
            'contenu_en' => ['required', 'string'],
            'slug_fr' => ['required', 'string', 'max:255', 'unique:news,slug_fr,' . $newsId],
            'slug_en' => ['required', 'string', 'max:255', 'unique:news,slug_en,' . $newsId],
            'type' => ['required', 'in:article,annonce,offre'],
            'image' => ['nullable', 'string', 'max:255'],
            'image_alt_fr' => ['nullable', 'string', 'max:255'],
            'image_alt_en' => ['nullable', 'string', 'max:255'],
            'date_publication' => ['nullable', 'date'],
            'is_published' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'titre_fr.required' => 'Le titre en français est requis.',
            'titre_en.required' => 'Le titre en anglais est requis.',
            'contenu_fr.required' => 'Le contenu en français est requis.',
            'contenu_en.required' => 'Le contenu en anglais est requis.',
            'slug_fr.unique' => 'Ce slug français existe déjà.',
            'slug_en.unique' => 'Ce slug anglais existe déjà.',
            'type.in' => 'Le type doit être article, annonce ou offre.',
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
