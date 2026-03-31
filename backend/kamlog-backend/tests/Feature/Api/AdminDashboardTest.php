<?php

namespace Tests\Feature\Api;

use App\Models\ContactMessage;
use App\Models\News;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\AuthHelpers;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase, AuthHelpers;

    public function test_admin_can_access_dashboard_stats(): void
    {
        $this->actingAsSuperAdmin();

        Service::create([
            'nom_fr' => 'Service 1',
            'nom_en' => 'Service 1',
            'description_fr' => 'Desc',
            'description_en' => 'Desc',
            'is_active' => true,
        ]);

        News::create([
            'titre_fr' => 'Actualité 1',
            'titre_en' => 'News 1',
            'contenu_fr' => 'Contenu',
            'contenu_en' => 'Content',
            'slug_fr' => 'actu-1',
            'slug_en' => 'news-1',
            'is_published' => true,
            'date_publication' => now(),
        ]);

        ContactMessage::create([
            'nom' => 'Test',
            'email' => 'test@test.com',
            'sujet' => 'Sujet',
            'message' => 'Message',
            'lu' => false,
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->getJson('/api/v1/admin/dashboard/stats');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'total_services',
                    'total_news',
                    'total_messages',
                    'total_users',
                    'unread_messages',
                    'active_services',
                    'published_news',
                    'active_users',
                ],
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_services' => 1,
                    'total_news' => 1,
                    'total_messages' => 1,
                    'unread_messages' => 1,
                    'active_services' => 1,
                    'published_news' => 1,
                ],
            ]);
    }

    public function test_unauthenticated_user_cannot_access_dashboard(): void
    {
        $response = $this->getJson('/api/v1/admin/dashboard/stats');

        $response->assertStatus(401);
    }

    public function test_editor_cannot_access_dashboard(): void
    {
        $this->actingAsEditor();

        $response = $this->getJson('/api/v1/admin/dashboard/stats');

        $response->assertStatus(403);
    }

    public function test_admin_role_can_access_dashboard(): void
    {
        $this->actingAsAdmin();

        $response = $this->getJson('/api/v1/admin/dashboard/stats');

        $response->assertOk()
            ->assertJson(['success' => true]);
    }

    public function test_dashboard_stats_return_zero_on_empty_database(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->getJson('/api/v1/admin/dashboard/stats');

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_services' => 0,
                    'total_news' => 0,
                    'total_messages' => 0,
                    'unread_messages' => 0,
                ],
            ]);
    }
}
