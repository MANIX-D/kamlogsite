<?php

namespace Tests\Feature\Api;

use App\Models\Partner;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\AuthHelpers;

class AdminPartnersCrudTest extends TestCase
{
    use RefreshDatabase, AuthHelpers;

    private string $baseUrl = '/api/v1/admin/partners';

    private function validPartnerData(array $overrides = []): array
    {
        return array_merge([
            'name_fr' => 'Partenaire Test',
            'name_en' => 'Test Partner',
            'category' => 'logistique',
            'partnership_level' => 'standard',
            'description_fr' => 'Description en français',
            'description_en' => 'Description in English',
            'website' => 'https://partenaire.com',
            'email' => 'contact@partenaire.com',
            'phone' => '+33 1 00 00 00 00',
            'is_active' => true,
            'is_featured' => false,
        ], $overrides);
    }

    // ============================================
    // CREATE
    // ============================================

    public function test_admin_can_create_partner(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, $this->validPartnerData());

        $response->assertCreated()
            ->assertJson([
                'success' => true,
                'message' => 'Partenaire créé avec succès',
            ]);

        $this->assertDatabaseHas('partners', [
            'name_fr' => 'Partenaire Test',
            'category' => 'logistique',
            'partnership_level' => 'standard',
        ]);
    }

    public function test_create_partner_validates_required_fields(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, []);

        $response->assertStatus(422)
            ->assertJson(['success' => false])
            ->assertJsonValidationErrors(['name_fr', 'name_en', 'category', 'partnership_level']);
    }

    public function test_create_partner_validates_category_enum(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, $this->validPartnerData([
            'category' => 'invalide',
        ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category']);
    }

    public function test_create_partner_validates_partnership_level_enum(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, $this->validPartnerData([
            'partnership_level' => 'invalide',
        ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['partnership_level']);
    }

    public function test_unauthenticated_user_cannot_create_partner(): void
    {
        $response = $this->postJson($this->baseUrl, $this->validPartnerData());

        $response->assertStatus(401);
    }

    public function test_editor_cannot_create_partner(): void
    {
        $this->actingAsEditor();

        $response = $this->postJson($this->baseUrl, $this->validPartnerData());

        $response->assertStatus(403);
    }

    // ============================================
    // UPDATE
    // ============================================

    public function test_admin_can_update_partner(): void
    {
        $this->actingAsSuperAdmin();

        $partner = Partner::create([
            'name_fr' => 'Original',
            'name_en' => 'Original EN',
            'category' => 'logistique',
            'partnership_level' => 'standard',
            'is_active' => true,
        ]);

        $response = $this->putJson("{$this->baseUrl}/{$partner->id}", $this->validPartnerData([
            'name_fr' => 'Partenaire Modifié',
            'name_en' => 'Modified Partner',
            'partnership_level' => 'premium',
        ]));

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Partenaire mis à jour avec succès',
            ]);

        $this->assertDatabaseHas('partners', [
            'id' => $partner->id,
            'name_fr' => 'Partenaire Modifié',
            'partnership_level' => 'premium',
        ]);
    }

    public function test_update_nonexistent_partner_returns_404(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->putJson("{$this->baseUrl}/9999", $this->validPartnerData());

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // DELETE (Soft Delete)
    // ============================================

    public function test_admin_can_delete_partner(): void
    {
        $this->actingAsSuperAdmin();

        $partner = Partner::create([
            'name_fr' => 'À supprimer',
            'name_en' => 'To delete',
            'category' => 'transport',
            'partnership_level' => 'standard',
            'is_active' => true,
        ]);

        $response = $this->deleteJson("{$this->baseUrl}/{$partner->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Partenaire supprimé avec succès',
            ]);

        $this->assertSoftDeleted('partners', ['id' => $partner->id]);
    }

    public function test_delete_nonexistent_partner_returns_404(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->deleteJson("{$this->baseUrl}/9999");

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // RESTORE
    // ============================================

    public function test_admin_can_restore_deleted_partner(): void
    {
        $this->actingAsSuperAdmin();

        $partner = Partner::create([
            'name_fr' => 'Supprimé',
            'name_en' => 'Deleted',
            'category' => 'technologie',
            'partnership_level' => 'strategic',
            'is_active' => true,
        ]);
        $partner->delete();

        $response = $this->postJson("{$this->baseUrl}/{$partner->id}/restore");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Partenaire restauré avec succès',
            ]);

        $this->assertDatabaseHas('partners', [
            'id' => $partner->id,
            'deleted_at' => null,
        ]);
    }

    public function test_restore_non_deleted_partner_returns_error(): void
    {
        $this->actingAsSuperAdmin();

        $partner = Partner::create([
            'name_fr' => 'Actif',
            'name_en' => 'Active',
            'category' => 'financier',
            'partnership_level' => 'premium',
            'is_active' => true,
        ]);

        $response = $this->postJson("{$this->baseUrl}/{$partner->id}/restore");

        $response->assertStatus(400)
            ->assertJson(['success' => false]);
    }
}
