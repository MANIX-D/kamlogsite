<?php

namespace Tests\Feature\Api;

use App\Models\News;
use App\Models\Partner;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\AuthHelpers;

class RoleAuthorizationTest extends TestCase
{
    use RefreshDatabase, AuthHelpers;

    // ============================================
    // EDITOR READ-ONLY ACCESS
    // ============================================

    public function test_editor_can_read_admin_services(): void
    {
        $this->actingAsEditor();

        Service::create([
            'nom_fr' => 'Service test',
            'nom_en' => 'Test service',
            'description_fr' => 'Description',
            'description_en' => 'Description',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/admin/services');

        $response->assertOk()
            ->assertJson(['success' => true]);
    }

    public function test_editor_can_read_admin_news(): void
    {
        $this->actingAsEditor();

        $response = $this->getJson('/api/v1/admin/news');

        $response->assertOk()
            ->assertJson(['success' => true]);
    }

    public function test_editor_can_read_admin_partners(): void
    {
        $this->actingAsEditor();

        $response = $this->getJson('/api/v1/admin/partners');

        $response->assertOk()
            ->assertJson(['success' => true]);
    }

    // ============================================
    // EDITOR CANNOT WRITE
    // ============================================

    public function test_editor_cannot_create_service(): void
    {
        $this->actingAsEditor();

        $response = $this->postJson('/api/v1/admin/services', [
            'nom_fr' => 'Test',
            'nom_en' => 'Test',
            'description_fr' => 'Test',
            'description_en' => 'Test',
        ]);

        $response->assertStatus(403);
    }

    public function test_editor_cannot_create_news(): void
    {
        $this->actingAsEditor();

        $response = $this->postJson('/api/v1/admin/news', [
            'titre_fr' => 'Test',
            'titre_en' => 'Test',
            'contenu_fr' => 'Test',
            'contenu_en' => 'Test',
        ]);

        $response->assertStatus(403);
    }

    public function test_editor_cannot_delete_service(): void
    {
        $this->actingAsEditor();

        $service = Service::create([
            'nom_fr' => 'Test',
            'nom_en' => 'Test',
            'description_fr' => 'Test',
            'description_en' => 'Test',
        ]);

        $response = $this->deleteJson("/api/v1/admin/services/{$service->id}");

        $response->assertStatus(403);
    }

    public function test_editor_cannot_create_partner(): void
    {
        $this->actingAsEditor();

        $response = $this->postJson('/api/v1/admin/partners', [
            'name_fr' => 'Test',
            'name_en' => 'Test',
        ]);

        $response->assertStatus(403);
    }

    // ============================================
    // ADMIN WRITE ACCESS
    // ============================================

    public function test_admin_role_can_create_service(): void
    {
        $this->actingAsAdmin();

        $response = $this->postJson('/api/v1/admin/services', [
            'nom_fr' => 'Service Admin',
            'nom_en' => 'Admin Service',
            'description_fr' => 'Créé par un admin',
            'description_en' => 'Created by admin',
        ]);

        $response->assertCreated()
            ->assertJson(['success' => true]);
    }

    public function test_admin_role_can_delete_news(): void
    {
        $this->actingAsAdmin();

        $news = News::create([
            'titre_fr' => 'À supprimer',
            'titre_en' => 'To delete',
            'contenu_fr' => 'Contenu',
            'contenu_en' => 'Content',
            'slug_fr' => 'a-supprimer',
            'slug_en' => 'to-delete',
            'date_publication' => now(),
        ]);

        $response = $this->deleteJson("/api/v1/admin/news/{$news->id}");

        $response->assertOk()
            ->assertJson(['success' => true]);
    }

    // ============================================
    // DISABLED ACCOUNT
    // ============================================

    public function test_disabled_admin_cannot_access_protected_routes(): void
    {
        $user = $this->createAdminUser([
            'is_active' => false,
            'email' => 'disabled-admin@kamlog-test.com',
        ]);

        \Laravel\Sanctum\Sanctum::actingAs($user, ['admin:*', 'users:*', 'content:*', 'settings:*']);

        $response = $this->getJson('/api/v1/admin/services');

        $response->assertStatus(403);
    }
}
