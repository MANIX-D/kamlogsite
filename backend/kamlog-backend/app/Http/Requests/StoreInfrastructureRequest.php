<?php

namespace App\Http\Requests;

class StoreInfrastructureRequest extends BaseFormRequest
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
                'min:3',
                'max:255',
            ],
            'type' => $this->enumRules(\App\Enums\InfrastructureType::class, true),
            'adresse' => [
                'required',
                'string',
                'min:10',
                'max:500',
            ],
            'ville' => [
                'required',
                'string',
                'min:2',
                'max:100',
            ],
            'pays' => [
                'required',
                'string',
                'min:2',
                'max:100',
            ],
            'superficie' => [
                'nullable',
                'numeric',
                'min:0',
                'max:1000000',
            ],
            'capacite' => [
                'nullable',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
                'max:2000',
            ],
            'image_url' => $this->urlRules(false, 500),
            'latitude' => [
                'nullable',
                'numeric',
                'between:-90,90',
            ],
            'longitude' => [
                'nullable',
                'numeric',
                'between:-180,180',
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
            'nom.required' => 'Le nom de l\'infrastructure est obligatoire.',
            'nom.min' => 'Le nom doit contenir au moins 3 caractères.',
            'nom.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            
            'type.required' => 'Le type d\'infrastructure est obligatoire.',
            'type.in' => 'Le type doit être : entrepôt, plateforme, bureau ou autre.',
            
            'adresse.required' => 'L\'adresse est obligatoire.',
            'adresse.min' => 'L\'adresse doit contenir au moins 10 caractères.',
            'adresse.max' => 'L\'adresse ne peut pas dépasser 500 caractères.',
            
            'ville.required' => 'La ville est obligatoire.',
            'ville.min' => 'La ville doit contenir au moins 2 caractères.',
            'ville.max' => 'La ville ne peut pas dépasser 100 caractères.',
            
            'pays.required' => 'Le pays est obligatoire.',
            'pays.min' => 'Le pays doit contenir au moins 2 caractères.',
            'pays.max' => 'Le pays ne peut pas dépasser 100 caractères.',
            
            'superficie.numeric' => 'La superficie doit être un nombre.',
            'superficie.min' => 'La superficie doit être supérieure ou égale à 0.',
            'superficie.max' => 'La superficie ne peut pas dépasser 1 000 000 m².',
            
            'capacite.max' => 'La capacité ne peut pas dépasser 255 caractères.',
            
            'description.max' => 'La description ne peut pas dépasser 2000 caractères.',
            
            'image_url.url' => 'L\'URL de l\'image doit être valide.',
            'image_url.max' => 'L\'URL de l\'image ne peut pas dépasser 500 caractères.',
            
            'latitude.numeric' => 'La latitude doit être un nombre.',
            'latitude.between' => 'La latitude doit être entre -90 et 90.',
            
            'longitude.numeric' => 'La longitude doit être un nombre.',
            'longitude.between' => 'La longitude doit être entre -180 et 180.',
        ];
    }

    public function attributes(): array
    {
        return [
            'nom' => 'nom de l\'infrastructure',
            'type' => 'type',
            'adresse' => 'adresse',
            'ville' => 'ville',
            'pays' => 'pays',
            'superficie' => 'superficie',
            'capacite' => 'capacité',
            'description' => 'description',
            'image_url' => 'URL de l\'image',
            'latitude' => 'latitude',
            'longitude' => 'longitude',
            'actif' => 'statut actif',
        ];
    }

    protected function getAuthorizationErrorMessage(): string
    {
        return 'Vous n\'avez pas l\'autorisation de créer une infrastructure.';
    }
}
