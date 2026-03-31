<?php

namespace Tests\Feature\Api;

use App\Models\Announcement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\AuthHelpers;

class AdminAnnouncementsCrudTest extends TestCase
{
    use RefreshDatabase, AuthHelpers;

    private string $baseUrl = '/api/v1/admin/announcements';

    private function validAnnouncementData(array $overrides = []): array
    {
        return array_merge([
            'title_fr' => 'Annonce importante',
            'title_en' => 'Important announcement',
            'content_fr' => 'Contenu de l\'annonce en français.',
            'content_en' => 'Announcement content in English.',
            'priority' => 'normal',
            'type' => 'info',
            'is_active' => true,
            'is_popup' => false,
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addMonth()->format('Y-m-d'),
        ], $overrides);
    }

    // ============================================
    // CREATE
    // ============================================

    public function test_admin_can_create_announcement(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, $this->validAnnouncementData());

        $response->assertCreated()
            ->assertJson([
                'success' => true,
                'message' => 'Annonce créée avec succès',
            ]);

        $this->assertDatabaseHas('announcements', [
            'title_fr' => 'Annonce importante',
            'priority' => 'normal',
            'type' => 'info',
        ]);
    }

    public function test_create_announcement_validates_required_fields(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, []);

        $response->assertStatus(422)
            ->assertJson(['success' => false])
            ->assertJsonValidationErrors(['title_fr', 'title_en', 'content_fr', 'content_en', 'priority', 'type']);
    }

    public function test_create_announcement_validates_priority_enum(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, $this->validAnnouncementData([
            'priority' => 'invalide',
        ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['priority']);
    }

    public function test_create_announcement_validates_type_enum(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, $this->validAnnouncementData([
            'type' => 'invalide',
        ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    public function test_create_announcement_validates_end_date_after_start(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, $this->validAnnouncementData([
            'start_date' => now()->addMonth()->format('Y-m-d'),
            'end_date' => now()->format('Y-m-d'),
        ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['end_date']);
    }

    public function test_unauthenticated_user_cannot_create_announcement(): void
    {
        $response = $this->postJson($this->baseUrl, $this->validAnnouncementData());

        $response->assertStatus(401);
    }

    public function test_editor_cannot_create_announcement(): void
    {
        $this->actingAsEditor();

        $response = $this->postJson($this->baseUrl, $this->validAnnouncementData());

        $response->assertStatus(403);
    }

    // ============================================
    // UPDATE
    // ============================================

    public function test_admin_can_update_announcement(): void
    {
        $this->actingAsSuperAdmin();

        $announcement = Announcement::create([
            'title_fr' => 'Original',
            'title_en' => 'Original EN',
            'content_fr' => 'Contenu original',
            'content_en' => 'Original content',
            'priority' => 'low',
            'type' => 'info',
            'is_active' => true,
            'start_date' => now(),
        ]);

        $response = $this->putJson("{$this->baseUrl}/{$announcement->id}", $this->validAnnouncementData([
            'title_fr' => 'Annonce Modifiée',
            'priority' => 'urgent',
            'type' => 'alerte',
        ]));

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Annonce mise à jour avec succès',
            ]);

        $this->assertDatabaseHas('announcements', [
            'id' => $announcement->id,
            'title_fr' => 'Annonce Modifiée',
            'priority' => 'urgent',
            'type' => 'alerte',
        ]);
    }

    public function test_update_nonexistent_announcement_returns_404(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->putJson("{$this->baseUrl}/9999", $this->validAnnouncementData());

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // DELETE
    // ============================================

    public function test_admin_can_delete_announcement(): void
    {
        $this->actingAsSuperAdmin();

        $announcement = Announcement::create([
            'title_fr' => 'À supprimer',
            'title_en' => 'To delete',
            'content_fr' => 'Contenu',
            'content_en' => 'Content',
            'priority' => 'low',
            'type' => 'info',
            'start_date' => now(),
        ]);

        $response = $this->deleteJson("{$this->baseUrl}/{$announcement->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Annonce supprimée avec succès',
            ]);

        $this->assertSoftDeleted('announcements', ['id' => $announcement->id]);
    }

    public function test_delete_nonexistent_announcement_returns_404(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->deleteJson("{$this->baseUrl}/9999");

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // RESTORE
    // ============================================

    public function test_admin_can_restore_deleted_announcement(): void
    {
        $this->actingAsSuperAdmin();

        $announcement = Announcement::create([
            'title_fr' => 'Supprimé',
            'title_en' => 'Deleted',
            'content_fr' => 'Contenu',
            'content_en' => 'Content',
            'priority' => 'high',
            'type' => 'info',
            'start_date' => now(),
        ]);
        $announcement->delete();

        $response = $this->postJson("{$this->baseUrl}/{$announcement->id}/restore");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Annonce restaurée avec succès',
            ]);

        $this->assertDatabaseHas('announcements', [
            'id' => $announcement->id,
            'deleted_at' => null,
        ]);
    }

    public function test_restore_non_deleted_announcement_returns_error(): void
    {
        $this->actingAsSuperAdmin();

        $announcement = Announcement::create([
            'title_fr' => 'Actif',
            'title_en' => 'Active',
            'content_fr' => 'Contenu',
            'content_en' => 'Content',
            'priority' => 'low',
            'type' => 'info',
            'start_date' => now(),
        ]);

        $response = $this->postJson("{$this->baseUrl}/{$announcement->id}/restore");

        $response->assertStatus(400)
            ->assertJson(['success' => false]);
    }
}
