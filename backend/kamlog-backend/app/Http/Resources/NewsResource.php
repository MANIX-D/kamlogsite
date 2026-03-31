<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class NewsResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'slug' => $this->slug,
            'contenu' => $this->contenu,
            'extrait' => $this->extrait,
            'image_url' => $this->image_url,
            'type' => $this->type,
            'auteur' => $this->auteur,
            'date_publication' => $this->formatDate($this->date_publication),
            'vues' => $this->vues,
            'is_featured' => $this->formatBoolean($this->is_featured),
            'is_published' => $this->formatBoolean($this->is_published),
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
            'deleted_at' => $this->formatDate($this->deleted_at),
        ];
    }

    protected function getMessage(): string
    {
        return 'Actualité récupérée avec succès';
    }
}
