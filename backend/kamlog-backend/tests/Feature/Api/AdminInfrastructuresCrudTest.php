<?php

namespace Tests\Feature\Api;

use App\Models\Infrastructure;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\AuthHelpers;

class AdminInfrastructuresCrudTest extends TestCase
{
    use RefreshDatabase, AuthHelpers;

    private string $baseUrl = '/api/v1/admin/infrastructures';

    private function validInfraData(array $overrides = []): array
    {
        return array_merge([
            'nom_fr' => 'Entrepôt Principal',
            'nom_en' => 'Main Warehouse',
            'description_fr' => 'Entrepôt de 10 000m² situé en zone industrielle.',
            'description_en' => '10,000m² warehouse in industrial zone.',
            'type' => 'entrepot',
            'surface' => '10000 m²',
            'capacite' => '5000 palettes',
            'is_active' => true,
            'is_available' => true,
        ], $overrides);
    }

    // ============================================
    // CREATE
    // ============================================

    public function test_admin_can_create_infrastructure(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, $this->validInfraData());

        $response->assertCreated()
            ->assertJson([
                'success' => true,
                'message' => 'Infrastructure créée avec succès',
            ]);

        $this->assertDatabaseHas('infrastructures', [
            'nom_fr' => 'Entrepôt Principal',
            'type' => 'entrepot',
        ]);
    }

    public function test_create_infrastructure_validates_required_fields(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, []);

        $response->assertStatus(422)
            ->assertJson(['success' => false])
            ->assertJsonValidationErrors(['nom_fr', 'nom_en', 'description_fr', 'description_en', 'type']);
    }

    public function test_create_infrastructure_validates_type_enum(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, $this->validInfraData([
            'type' => 'invalide',
        ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    public function test_unauthenticated_user_cannot_create_infrastructure(): void
    {
        $response = $this->postJson($this->baseUrl, $this->validInfraData());

        $response->assertStatus(401);
    }

    public function test_editor_cannot_create_infrastructure(): void
    {
        $this->actingAsEditor();

        $response = $this->postJson($this->baseUrl, $this->validInfraData());

        $response->assertStatus(403);
    }

    // ============================================
    // UPDATE
    // ============================================

    public function test_admin_can_update_infrastructure(): void
    {
        $this->actingAsSuperAdmin();

        $infra = Infrastructure::create([
            'nom_fr' => 'Original',
            'nom_en' => 'Original EN',
            'description_fr' => 'Description originale',
            'description_en' => 'Original description',
            'type' => 'entrepot',
            'is_active' => true,
        ]);

        $response = $this->putJson("{$this->baseUrl}/{$infra->id}", $this->validInfraData([
            'nom_fr' => 'Entrepôt Modifié',
            'type' => 'atelier',
        ]));

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Infrastructure mise à jour avec succès',
            ]);

        $this->assertDatabaseHas('infrastructures', [
            'id' => $infra->id,
            'nom_fr' => 'Entrepôt Modifié',
            'type' => 'atelier',
        ]);
    }

    public function test_update_nonexistent_infrastructure_returns_404(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->putJson("{$this->baseUrl}/9999", $this->validInfraData());

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // DELETE
    // ============================================

    public function test_admin_can_delete_infrastructure(): void
    {
        $this->actingAsSuperAdmin();

        $infra = Infrastructure::create([
            'nom_fr' => 'À supprimer',
            'nom_en' => 'To delete',
            'description_fr' => 'Description',
            'description_en' => 'Description',
            'type' => 'bureau',
            'is_active' => true,
        ]);

        $response = $this->deleteJson("{$this->baseUrl}/{$infra->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Infrastructure supprimée avec succès',
            ]);

        $this->assertSoftDeleted('infrastructures', ['id' => $infra->id]);
    }

    public function test_delete_nonexistent_infrastructure_returns_404(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->deleteJson("{$this->baseUrl}/9999");

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // RESTORE
    // ============================================

    public function test_admin_can_restore_deleted_infrastructure(): void
    {
        $this->actingAsSuperAdmin();

        $infra = Infrastructure::create([
            'nom_fr' => 'Supprimé',
            'nom_en' => 'Deleted',
            'description_fr' => 'Description',
            'description_en' => 'Description',
            'type' => 'entrepot',
        ]);
        $infra->delete();

        $response = $this->postJson("{$this->baseUrl}/{$infra->id}/restore");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Infrastructure restaurée avec succès',
            ]);

        $this->assertDatabaseHas('infrastructures', [
            'id' => $infra->id,
            'deleted_at' => null,
        ]);
    }

    public function test_restore_non_deleted_infrastructure_returns_error(): void
    {
        $this->actingAsSuperAdmin();

        $infra = Infrastructure::create([
            'nom_fr' => 'Actif',
            'nom_en' => 'Active',
            'description_fr' => 'Description',
            'description_en' => 'Description',
            'type' => 'autre',
        ]);

        $response = $this->postJson("{$this->baseUrl}/{$infra->id}/restore");

        $response->assertStatus(400)
            ->assertJson(['success' => false]);
    }
}
