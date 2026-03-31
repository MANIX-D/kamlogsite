<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponses
{
    /**
     * Réponse de succès standardisée
     */
    protected function successResponse($data = null, string $message = null, int $code = 200): JsonResponse
    {
        $response = [
            'success' => true,
        ];

        if ($message) {
            $response['message'] = $message;
        }

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json($response, $code);
    }

    /**
     * Réponse de succès avec pagination
     */
    protected function paginatedResponse($paginator, string $message = null): JsonResponse
    {
        $response = [
            'success' => true,
        ];

        if ($message) {
            $response['message'] = $message;
        }

        $response['data'] = $paginator->items();
        $response['pagination'] = [
            'total' => $paginator->total(),
            'per_page' => $paginator->perPage(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
        ];

        return response()->json($response, 200);
    }

    /**
     * Réponse d'erreur standardisée
     */
    protected function errorResponse(string $message, int $code = 400, $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Réponse 404 Not Found
     */
    protected function notFoundResponse(string $message = 'Ressource non trouvée'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }

    /**
     * Réponse 429 Too Many Requests
     */
    protected function rateLimitResponse(string $message = 'Trop de requêtes'): JsonResponse
    {
        return $this->errorResponse($message, 429);
    }

    /**
     * Réponse 201 Created
     */
    protected function createdResponse($data, string $message = 'Créé avec succès'): JsonResponse
    {
        return $this->successResponse($data, $message, 201);
    }

    /**
     * Réponse 204 No Content
     */
    protected function noContentResponse(): JsonResponse
    {
        return response()->json(null, 204);
    }
}
