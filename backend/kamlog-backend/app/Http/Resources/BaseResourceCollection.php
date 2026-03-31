<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

abstract class BaseResourceCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
        ];
    }

    /**
     * Wrap the resource collection in a standard response format
     */
    public function with(Request $request): array
    {
        $response = [
            'success' => true,
            'message' => $this->getMessage(),
        ];

        // Add pagination if available
        if ($this->resource instanceof \Illuminate\Pagination\AbstractPaginator) {
            $response['pagination'] = [
                'total' => $this->total(),
                'count' => $this->count(),
                'per_page' => $this->perPage(),
                'current_page' => $this->currentPage(),
                'total_pages' => $this->lastPage(),
                'from' => $this->firstItem(),
                'to' => $this->lastItem(),
            ];
        }

        return $response;
    }

    /**
     * Get the message for the response
     */
    protected function getMessage(): string
    {
        return 'Liste récupérée avec succès';
    }
}
