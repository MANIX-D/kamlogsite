<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Seuls les admins peuvent uploader des images
        return $this->user() && $this->user()->tokenCan('admin:*');
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'image' => [
                'required',
                'file',
                'image',
                'mimes:jpeg,jpg,png,gif,webp',
                'max:5120', // 5MB max
            ],
            'folder' => [
                'sometimes',
                'string',
                'in:services,news,partners,infrastructures,jobs,announcements,general',
            ],
            'max_width' => [
                'sometimes',
                'integer',
                'min:100',
                'max:4000',
            ],
            'max_height' => [
                'sometimes',
                'integer',
                'min:100',
                'max:4000',
            ],
            'quality' => [
                'sometimes',
                'integer',
                'min:1',
                'max:100',
            ],
            'thumbnail' => [
                'sometimes',
                'boolean',
            ],
            'thumb_width' => [
                'sometimes',
                'integer',
                'min:50',
                'max:1000',
            ],
            'thumb_height' => [
                'sometimes',
                'integer',
                'min:50',
                'max:1000',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'image.required' => 'Veuillez sélectionner une image.',
            'image.file' => 'Le fichier doit être une image valide.',
            'image.image' => 'Le fichier doit être une image.',
            'image.mimes' => 'L\'image doit être au format JPEG, PNG, GIF ou WebP.',
            'image.max' => 'L\'image ne doit pas dépasser 5 Mo.',
            'folder.in' => 'Le dossier spécifié n\'est pas valide.',
            'max_width.integer' => 'La largeur maximale doit être un nombre entier.',
            'max_width.min' => 'La largeur maximale doit être d\'au moins 100 pixels.',
            'max_width.max' => 'La largeur maximale ne peut pas dépasser 4000 pixels.',
            'max_height.integer' => 'La hauteur maximale doit être un nombre entier.',
            'max_height.min' => 'La hauteur maximale doit être d\'au moins 100 pixels.',
            'max_height.max' => 'La hauteur maximale ne peut pas dépasser 4000 pixels.',
            'quality.integer' => 'La qualité doit être un nombre entier.',
            'quality.min' => 'La qualité doit être d\'au moins 1.',
            'quality.max' => 'La qualité ne peut pas dépasser 100.',
            'thumb_width.integer' => 'La largeur de la miniature doit être un nombre entier.',
            'thumb_width.min' => 'La largeur de la miniature doit être d\'au moins 50 pixels.',
            'thumb_width.max' => 'La largeur de la miniature ne peut pas dépasser 1000 pixels.',
            'thumb_height.integer' => 'La hauteur de la miniature doit être un nombre entier.',
            'thumb_height.min' => 'La hauteur de la miniature doit être d\'au moins 50 pixels.',
            'thumb_height.max' => 'La hauteur de la miniature ne peut pas dépasser 1000 pixels.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        throw new \Illuminate\Validation\ValidationException(
            $validator,
            response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
