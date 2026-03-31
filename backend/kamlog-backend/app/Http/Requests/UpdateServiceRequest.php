<?php

namespace App\Http\Requests;

class UpdateServiceRequest extends BaseFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->authorizeAdmin(['super_admin', 'admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $serviceId = $this->route('id');

        return [
            'titre' => [
                'sometimes',
                'required',
                'string',
                'min:3',
                'max:255',
            ],
            'slug' => array_merge(
                ['sometimes'],
                $this->slugRules('services', true, $serviceId)
            ),
            'description' => [
                'sometimes',
                'required',
                'string',
                'min:10',
                'max:5000',
            ],
            'icone' => [
                'nullable',
                'string',
                'max:100',
            ],
            'image_url' => $this->urlRules(false, 500),
            'ordre' => [
                'nullable',
                'integer',
                'min:0',
                'max:1000',
            ],
            'actif' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'titre.required' => 'Le titre du service est obligatoire.',
            'titre.min' => 'Le titre doit contenir au moins 3 caractères.',
            'titre.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            
            'slug.required' => 'Le slug est obligatoire.',
            'slug.regex' => 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets.',
            'slug.unique' => 'Ce slug est déjà utilisé par un autre service.',
            
            'description.required' => 'La description est obligatoire.',
            'description.min' => 'La description doit contenir au moins 10 caractères.',
            'description.max' => 'La description ne peut pas dépasser 5000 caractères.',
            
            'icone.max' => 'Le nom de l\'icône ne peut pas dépasser 100 caractères.',
            
            'image_url.url' => 'L\'URL de l\'image doit être valide.',
            'image_url.max' => 'L\'URL de l\'image ne peut pas dépasser 500 caractères.',
            
            'ordre.integer' => 'L\'ordre doit être un nombre entier.',
            'ordre.min' => 'L\'ordre doit être supérieur ou égal à 0.',
            'ordre.max' => 'L\'ordre ne peut pas dépasser 1000.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'titre' => 'titre du service',
            'slug' => 'slug',
            'description' => 'description',
            'icone' => 'icône',
            'image_url' => 'URL de l\'image',
            'ordre' => 'ordre d\'affichage',
            'actif' => 'statut actif',
        ];
    }

    /**
     * Get the authorization error message.
     */
    protected function getAuthorizationErrorMessage(): string
    {
        return 'Vous n\'avez pas l\'autorisation de modifier ce service.';
    }
}
