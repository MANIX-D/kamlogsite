<?php

namespace App\Http\Requests;

class UpdateAnnouncementRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->authorizeAdmin(['super_admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'titre' => [
                'sometimes',
                'required',
                'string',
                'min:5',
                'max:255',
            ],
            'contenu' => [
                'sometimes',
                'required',
                'string',
                'min:20',
                'max:10000',
            ],
            'type' => array_merge(
                ['sometimes'],
                $this->enumRules(\App\Enums\AnnouncementType::class, true)
            ),
            'priorite' => array_merge(
                ['sometimes'],
                $this->enumRules(\App\Enums\Priority::class, true)
            ),
            'date_debut' => [
                'sometimes',
                'required',
                'date',
            ],
            'date_fin' => [
                'sometimes',
                'required',
                'date',
                'after:date_debut',
            ],
            'cible' => [
                'nullable',
                'string',
                'in:tous,clients,partenaires,employes',
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
            'titre.required' => 'Le titre de l\'annonce est obligatoire.',
            'titre.min' => 'Le titre doit contenir au moins 5 caractères.',
            'titre.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            
            'contenu.required' => 'Le contenu est obligatoire.',
            'contenu.min' => 'Le contenu doit contenir au moins 20 caractères.',
            
            'type.required' => 'Le type d\'annonce est obligatoire.',
            'type.in' => 'Le type doit être : info, alerte, maintenance ou promotion.',
            
            'priorite.required' => 'La priorité est obligatoire.',
            'priorite.in' => 'La priorité doit être : basse, normale, haute ou urgente.',
            
            'date_debut.required' => 'La date de début est obligatoire.',
            'date_debut.date' => 'La date de début doit être une date valide.',
            
            'date_fin.required' => 'La date de fin est obligatoire.',
            'date_fin.date' => 'La date de fin doit être une date valide.',
            'date_fin.after' => 'La date de fin doit être postérieure à la date de début.',
            
            'cible.in' => 'La cible doit être : tous, clients, partenaires ou employés.',
        ];
    }

    protected function getAuthorizationErrorMessage(): string
    {
        return 'Vous n\'avez pas l\'autorisation de modifier cette annonce.';
    }
}
