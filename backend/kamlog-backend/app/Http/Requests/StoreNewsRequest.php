<?php

namespace App\Http\Requests;

class StoreNewsRequest extends BaseFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->authorizeAdmin(['super_admin', 'admin', 'editor']);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'titre' => [
                'required',
                'string',
                'min:5',
                'max:255',
            ],
            'slug' => $this->slugRules('news', true),
            'contenu' => [
                'required',
                'string',
                'min:50',
                'max:50000',
            ],
            'extrait' => [
                'nullable',
                'string',
                'max:500',
            ],
            'image_url' => $this->urlRules(false, 500),
            'type' => $this->enumRules(\App\Enums\NewsType::class, true),
            'auteur' => [
                'nullable',
                'string',
                'max:255',
            ],
            'date_publication' => [
                'nullable',
                'date',
                'after_or_equal:' . now()->startOfDay()->toDateString(),
            ],
            'is_featured' => [
                'sometimes',
                'boolean',
            ],
            'is_published' => [
                'sometimes',
                'boolean',
            ],
            'meta_description' => [
                'nullable',
                'string',
                'max:160',
            ],
            'meta_keywords' => [
                'nullable',
                'string',
                'max:255',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'titre.required' => 'Le titre de l\'actualité est obligatoire.',
            'titre.min' => 'Le titre doit contenir au moins 5 caractères.',
            'titre.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            
            'slug.required' => 'Le slug est obligatoire.',
            'slug.regex' => 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets.',
            'slug.unique' => 'Ce slug est déjà utilisé par une autre actualité.',
            
            'contenu.required' => 'Le contenu est obligatoire.',
            'contenu.min' => 'Le contenu doit contenir au moins 50 caractères.',
            
            'extrait.max' => 'L\'extrait ne peut pas dépasser 500 caractères.',
            
            'image_url.url' => 'L\'URL de l\'image doit être valide.',
            'image_url.max' => 'L\'URL de l\'image ne peut pas dépasser 500 caractères.',
            
            'type.required' => 'Le type d\'actualité est obligatoire.',
            'type.in' => 'Le type doit être : actualité, événement ou communiqué.',
            
            'auteur.max' => 'Le nom de l\'auteur ne peut pas dépasser 255 caractères.',
            
            'date_publication.date' => 'La date de publication doit être une date valide.',
            'date_publication.after_or_equal' => 'La date de publication ne peut pas être dans le passé.',
            
            'meta_description.max' => 'La meta description ne peut pas dépasser 160 caractères.',
            'meta_keywords.max' => 'Les meta keywords ne peuvent pas dépasser 255 caractères.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'titre' => 'titre',
            'slug' => 'slug',
            'contenu' => 'contenu',
            'extrait' => 'extrait',
            'image_url' => 'URL de l\'image',
            'type' => 'type',
            'auteur' => 'auteur',
            'date_publication' => 'date de publication',
            'is_featured' => 'à la une',
            'is_published' => 'publié',
            'meta_description' => 'meta description',
            'meta_keywords' => 'meta keywords',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Générer l'extrait automatiquement si non fourni
        if (!$this->has('extrait') && $this->has('contenu')) {
            $extrait = $this->generateExcerpt($this->contenu, 200);
            if ($extrait !== null) {
                $this->merge(['extrait' => $extrait]);
            }
        }

        // Définir l'auteur par défaut
        if (!$this->has('auteur')) {
            $fullName = $this->getUserFullName();
            if ($fullName !== null) {
                $this->merge(['auteur' => $fullName]);
            }
        }
    }

    /**
     * Get the authorization error message.
     */
    protected function getAuthorizationErrorMessage(): string
    {
        return 'Vous n\'avez pas l\'autorisation de créer une actualité.';
    }
}
