<?php

namespace App\Http\Requests;

class UpdateJobOfferRequest extends BaseFormRequest
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
            'description' => [
                'sometimes',
                'required',
                'string',
                'min:50',
            ],
            'type_contrat' => array_merge(
                ['sometimes'],
                $this->enumRules(\App\Enums\ContractType::class, true)
            ),
            'localisation' => [
                'sometimes',
                'required',
                'string',
                'min:2',
                'max:255',
            ],
            'salaire' => [
                'nullable',
                'string',
                'max:100',
            ],
            'experience_requise' => [
                'nullable',
                'string',
                'max:100',
            ],
            'niveau_etude' => [
                'nullable',
                'string',
                'max:100',
            ],
            'competences' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'date_limite' => [
                'nullable',
                'date',
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
            'titre.required' => 'Le titre de l\'offre est obligatoire.',
            'titre.min' => 'Le titre doit contenir au moins 5 caractères.',
            'titre.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            
            'description.required' => 'La description est obligatoire.',
            'description.min' => 'La description doit contenir au moins 50 caractères.',
            
            'type_contrat.required' => 'Le type de contrat est obligatoire.',
            'type_contrat.in' => 'Le type de contrat doit être : CDI, CDD, stage, alternance ou freelance.',
            
            'localisation.required' => 'La localisation est obligatoire.',
            'localisation.min' => 'La localisation doit contenir au moins 2 caractères.',
            'localisation.max' => 'La localisation ne peut pas dépasser 255 caractères.',
            
            'salaire.max' => 'Le salaire ne peut pas dépasser 100 caractères.',
            
            'experience_requise.max' => 'L\'expérience requise ne peut pas dépasser 100 caractères.',
            
            'niveau_etude.max' => 'Le niveau d\'étude ne peut pas dépasser 100 caractères.',
            
            'competences.max' => 'Les compétences ne peuvent pas dépasser 1000 caractères.',
            
            'date_limite.date' => 'La date limite doit être une date valide.',
        ];
    }

    protected function getAuthorizationErrorMessage(): string
    {
        return 'Vous n\'avez pas l\'autorisation de modifier cette offre d\'emploi.';
    }
}
