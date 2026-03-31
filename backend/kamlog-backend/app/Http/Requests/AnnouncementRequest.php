<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title_fr' => ['required', 'string', 'max:255'],
            'title_en' => ['required', 'string', 'max:255'],
            'content_fr' => ['required', 'string'],
            'content_en' => ['required', 'string'],
            'priority' => ['required', 'in:low,normal,high,urgent'],
            'type' => ['required', 'in:info,alerte,maintenance,promotion'],
            'is_active' => ['nullable', 'boolean'],
            'is_popup' => ['nullable', 'boolean'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title_fr.required' => 'Le titre en français est requis.',
            'title_en.required' => 'Le titre en anglais est requis.',
            'content_fr.required' => 'Le contenu en français est requis.',
            'content_en.required' => 'Le contenu en anglais est requis.',
            'priority.in' => 'La priorité doit être low, normal, high ou urgent.',
            'type.in' => 'Le type doit être info, alerte, maintenance ou promotion.',
            'end_date.after' => 'La date de fin doit être après la date de début.',
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
