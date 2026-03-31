<?php

namespace Tests\Feature\Api;

use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\AuthHelpers;

class AdminServicesCrudTest extends TestCase
{
    use RefreshDatabase, AuthHelpers;

    private string $baseUrl = '/api/v1/admin/services';

    // ============================================
    // CREATE
    // ============================================

    public function test_admin_can_create_service(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, [
            'nom_fr' => 'Nouveau Service',
            'nom_en' => 'New Service',
            'description_fr' => 'Description en français',
            'description_en' => 'Description in English',
            'icon' => 'truck',
            'display_order' => 1,
            'is_active' => true,
        ]);

        $response->assertCreated()
            ->assertJson([
                'success' => true,
                'message' => 'Service créé avec succès',
            ]);

        $this->assertDatabaseHas('services', [
            'nom_fr' => 'Nouveau Service',
            'nom_en' => 'New Service',
        ]);
    }

    public function test_create_service_validates_required_fields(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, []);

        $response->assertStatus(422)
            ->assertJson(['success' => false])
            ->assertJsonValidationErrors(['nom_fr', 'nom_en', 'description_fr', 'description_en']);
    }

    public function test_unauthenticated_user_cannot_create_service(): void
    {
        $response = $this->postJson($this->baseUrl, [
            'nom_fr' => 'Test',
            'nom_en' => 'Test',
            'description_fr' => 'Test',
            'description_en' => 'Test',
        ]);

        $response->assertStatus(401);
    }

    public function test_editor_cannot_create_service(): void
    {
        $this->actingAsEditor();

        $response = $this->postJson($this->baseUrl, [
            'nom_fr' => 'Test',
            'nom_en' => 'Test',
            'description_fr' => 'Test',
            'description_en' => 'Test',
        ]);

        $response->assertStatus(403);
    }

    // ============================================
    // UPDATE
    // ============================================

    public function test_admin_can_update_service(): void
    {
        $this->actingAsSuperAdmin();

        $service = Service::create([
            'nom_fr' => 'Original',
            'nom_en' => 'Original',
            'description_fr' => 'Description originale',
            'description_en' => 'Original description',
        ]);

        $response = $this->putJson("{$this->baseUrl}/{$service->id}", [
            'nom_fr' => 'Modifié',
            'nom_en' => 'Modified',
            'description_fr' => 'Description modifiée',
            'description_en' => 'Modified description',
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Service mis à jour avec succès',
            ]);

        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'nom_fr' => 'Modifié',
        ]);
    }

    public function test_update_nonexistent_service_returns_404(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->putJson("{$this->baseUrl}/9999", [
            'nom_fr' => 'Test',
            'nom_en' => 'Test',
            'description_fr' => 'Test',
            'description_en' => 'Test',
        ]);

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // DELETE (Soft Delete)
    // ============================================

    public function test_admin_can_delete_service(): void
    {
        $this->actingAsSuperAdmin();

        $service = Service::create([
            'nom_fr' => 'À supprimer',
            'nom_en' => 'To delete',
            'description_fr' => 'Description',
            'description_en' => 'Description',
        ]);

        $response = $this->deleteJson("{$this->baseUrl}/{$service->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Service supprimé avec succès',
            ]);

        $this->assertSoftDeleted('services', ['id' => $service->id]);
    }

    public function test_delete_nonexistent_service_returns_404(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->deleteJson("{$this->baseUrl}/9999");

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    public function test_unauthenticated_user_cannot_delete_service(): void
    {
        $service = Service::create([
            'nom_fr' => 'Test',
            'nom_en' => 'Test',
            'description_fr' => 'Test',
            'description_en' => 'Test',
        ]);

        $response = $this->deleteJson("{$this->baseUrl}/{$service->id}");

        $response->assertStatus(401);
    }

    // ============================================
    // RESTORE
    // ============================================

    public function test_admin_can_restore_deleted_service(): void
    {
        $this->actingAsSuperAdmin();

        $service = Service::create([
            'nom_fr' => 'Supprimé',
            'nom_en' => 'Deleted',
            'description_fr' => 'Description',
            'description_en' => 'Description',
        ]);
        $service->delete();

        $response = $this->postJson("{$this->baseUrl}/{$service->id}/restore");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Service restauré avec succès',
            ]);

        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'deleted_at' => null,
        ]);
    }

    public function test_restore_non_deleted_service_returns_error(): void
    {
        $this->actingAsSuperAdmin();

        $service = Service::create([
            'nom_fr' => 'Actif',
            'nom_en' => 'Active',
            'description_fr' => 'Description',
            'description_en' => 'Description',
        ]);

        $response = $this->postJson("{$this->baseUrl}/{$service->id}/restore");

        $response->assertStatus(400)
            ->assertJson(['success' => false]);
    }
}
