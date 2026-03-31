<?php

namespace App\Http\Requests;

class StoreAnnouncementRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->authorizeAdmin(['super_admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'titre' => [
                'required',
                'string',
                'min:5',
                'max:255',
            ],
            'contenu' => [
                'required',
                'string',
                'min:20',
                'max:10000',
            ],
            'type' => $this->enumRules(\App\Enums\AnnouncementType::class, true),
            'priorite' => $this->enumRules(\App\Enums\Priority::class, true),
            'date_debut' => [
                'required',
                'date',
                'after_or_equal:' . now()->startOfDay()->toDateString(),
            ],
            'date_fin' => [
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
            'date_debut.after_or_equal' => 'La date de début ne peut pas être dans le passé.',
            
            'date_fin.required' => 'La date de fin est obligatoire.',
            'date_fin.date' => 'La date de fin doit être une date valide.',
            'date_fin.after' => 'La date de fin doit être postérieure à la date de début.',
            
            'cible.in' => 'La cible doit être : tous, clients, partenaires ou employés.',
        ];
    }

    public function attributes(): array
    {
        return [
            'titre' => 'titre',
            'contenu' => 'contenu',
            'type' => 'type',
            'priorite' => 'priorité',
            'date_debut' => 'date de début',
            'date_fin' => 'date de fin',
            'cible' => 'cible',
            'actif' => 'statut actif',
        ];
    }

    protected function getAuthorizationErrorMessage(): string
    {
        return 'Vous n\'avez pas l\'autorisation de créer une annonce.';
    }
}
