<?php

namespace App\Http\Requests;

class StorePartnerRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->authorizeAdmin(['super_admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'nom' => [
                'required',
                'string',
                'min:2',
                'max:255',
            ],
            'logo_url' => $this->urlRules(false, 500),
            'site_web' => $this->urlRules(false, 500),
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'type' => $this->enumRules(\App\Enums\PartnerType::class, true),
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

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom du partenaire est obligatoire.',
            'nom.min' => 'Le nom doit contenir au moins 2 caractères.',
            'nom.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            
            'logo_url.url' => 'L\'URL du logo doit être valide.',
            'logo_url.max' => 'L\'URL du logo ne peut pas dépasser 500 caractères.',
            
            'site_web.url' => 'L\'URL du site web doit être valide.',
            'site_web.max' => 'L\'URL du site web ne peut pas dépasser 500 caractères.',
            
            'description.max' => 'La description ne peut pas dépasser 1000 caractères.',
            
            'type.required' => 'Le type de partenaire est obligatoire.',
            'type.in' => 'Le type doit être : stratégique, opérationnel, institutionnel ou commercial.',
            
            'ordre.integer' => 'L\'ordre doit être un nombre entier.',
            'ordre.min' => 'L\'ordre doit être supérieur ou égal à 0.',
            'ordre.max' => 'L\'ordre ne peut pas dépasser 1000.',
        ];
    }

    public function attributes(): array
    {
        return [
            'nom' => 'nom du partenaire',
            'logo_url' => 'URL du logo',
            'site_web' => 'site web',
            'description' => 'description',
            'type' => 'type de partenaire',
            'ordre' => 'ordre d\'affichage',
            'actif' => 'statut actif',
        ];
    }

    protected function getAuthorizationErrorMessage(): string
    {
        return 'Vous n\'avez pas l\'autorisation de créer un partenaire.';
    }
}
