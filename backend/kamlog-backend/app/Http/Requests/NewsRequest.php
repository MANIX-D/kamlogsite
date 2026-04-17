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

    protected function prepareForValidation(): void
    {
        if (!$this->filled('slug_fr') && $this->filled('titre_fr')) {
            $baseSlug = \Illuminate\Support\Str::slug($this->input('titre_fr'));
            $slug = $baseSlug;
            $counter = 1;
            
            // Ensure unique slug
            while (\App\Models\News::where('slug_fr', $slug)->where('id', '!=', $this->route('id'))->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            
            $this->merge(['slug_fr' => $slug]);
        }
        
        if (!$this->filled('slug_en') && $this->filled('titre_en')) {
            $baseSlug = \Illuminate\Support\Str::slug($this->input('titre_en'));
            $slug = $baseSlug;
            $counter = 1;
            
            // Ensure unique slug
            while (\App\Models\News::where('slug_en', $slug)->where('id', '!=', $this->route('id'))->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            
            $this->merge(['slug_en' => $slug]);
        }
    }

    public function rules(): array
    {
        $newsId = $this->route('id') ?? $this->route('news');
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch') || $this->input('_method') === 'PUT';
        
        return [
            'titre_fr' => ['required', 'string', 'max:255'],
            'titre_en' => ['required', 'string', 'max:255'],
            'contenu_fr' => ['required', 'string'],
            'contenu_en' => ['required', 'string'],
            'slug_fr' => ['required', 'string', 'max:255', 'unique:news,slug_fr,' . $newsId],
            'slug_en' => ['required', 'string', 'max:255', 'unique:news,slug_en,' . $newsId],
            'type' => ['required', 'in:article,annonce,offre'],
            'location' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'sometimes', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:2048'],
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
            'image.image' => 'Le fichier doit être une image.',
            'image.mimes' => 'L\'image doit être au format JPEG, JPG, PNG, GIF ou WEBP.',
            'image.max' => 'L\'image ne doit pas dépasser 2 MB.',
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
