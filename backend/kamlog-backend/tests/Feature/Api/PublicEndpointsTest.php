<?php

namespace Tests\Feature\Api;

use App\Models\Announcement;
use App\Models\Infrastructure;
use App\Models\JobOffer;
use App\Models\News;
use App\Models\Partner;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicEndpointsTest extends TestCase
{
    use RefreshDatabase;

    // ============================================
    // SERVICES
    // ============================================

    public function test_can_list_services(): void
    {
        Service::create([
            'nom_fr' => 'Transport',
            'nom_en' => 'Transport',
            'description_fr' => 'Service de transport',
            'description_en' => 'Transport service',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/services');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data',
                'pagination' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJson(['success' => true]);
    }

    public function test_can_show_single_service(): void
    {
        $service = Service::create([
            'nom_fr' => 'Logistique',
            'nom_en' => 'Logistics',
            'description_fr' => 'Service logistique',
            'description_en' => 'Logistics service',
            'is_active' => true,
        ]);

        $response = $this->getJson("/api/v1/services/{$service->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'nom_fr' => 'Logistique',
                    'nom_en' => 'Logistics',
                ],
            ]);
    }

    public function test_show_nonexistent_service_returns_404(): void
    {
        $response = $this->getJson('/api/v1/services/9999');

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    public function test_only_active_services_shown_to_public(): void
    {
        Service::create([
            'nom_fr' => 'Actif',
            'nom_en' => 'Active',
            'description_fr' => 'Service actif',
            'description_en' => 'Active service',
            'is_active' => true,
        ]);

        Service::create([
            'nom_fr' => 'Inactif',
            'nom_en' => 'Inactive',
            'description_fr' => 'Service inactif',
            'description_en' => 'Inactive service',
            'is_active' => false,
        ]);

        $response = $this->getJson('/api/v1/services');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('Actif', $data[0]['nom_fr']);
    }

    public function test_services_pagination_works(): void
    {
        for ($i = 0; $i < 5; $i++) {
            Service::create([
                'nom_fr' => "Service {$i}",
                'nom_en' => "Service {$i}",
                'description_fr' => "Description {$i}",
                'description_en' => "Description {$i}",
                'is_active' => true,
            ]);
        }

        $response = $this->getJson('/api/v1/services?per_page=2');

        $response->assertOk();
        $this->assertEquals(2, $response->json('pagination.per_page'));
        $this->assertEquals(5, $response->json('pagination.total'));
    }

    // ============================================
    // NEWS
    // ============================================

    public function test_can_list_news(): void
    {
        News::create([
            'titre_fr' => 'Actualité test',
            'titre_en' => 'Test news',
            'contenu_fr' => 'Contenu test',
            'contenu_en' => 'Test content',
            'slug_fr' => 'actualite-test',
            'slug_en' => 'test-news',
            'is_published' => true,
            'date_publication' => now(),
        ]);

        $response = $this->getJson('/api/v1/news');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data',
                'pagination',
            ])
            ->assertJson(['success' => true]);
    }

    public function test_can_show_single_news(): void
    {
        $news = News::create([
            'titre_fr' => 'Article test',
            'titre_en' => 'Test article',
            'contenu_fr' => 'Contenu article',
            'contenu_en' => 'Article content',
            'slug_fr' => 'article-test',
            'slug_en' => 'test-article',
            'is_published' => true,
            'date_publication' => now(),
        ]);

        $response = $this->getJson("/api/v1/news/{$news->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'titre_fr' => 'Article test',
                ],
            ]);
    }

    public function test_can_show_news_by_slug(): void
    {
        News::create([
            'titre_fr' => 'Slug article',
            'titre_en' => 'Slug article EN',
            'contenu_fr' => 'Contenu slug',
            'contenu_en' => 'Slug content',
            'slug_fr' => 'slug-article',
            'slug_en' => 'slug-article-en',
            'is_published' => true,
            'date_publication' => now(),
        ]);

        $response = $this->getJson('/api/v1/news/slug/slug-article');

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'slug_fr' => 'slug-article',
                ],
            ]);
    }

    public function test_unpublished_news_hidden_from_public(): void
    {
        News::create([
            'titre_fr' => 'Brouillon',
            'titre_en' => 'Draft',
            'contenu_fr' => 'Contenu brouillon',
            'contenu_en' => 'Draft content',
            'slug_fr' => 'brouillon',
            'slug_en' => 'draft',
            'is_published' => false,
            'date_publication' => now(),
        ]);

        $response = $this->getJson('/api/v1/news');

        $response->assertOk();
        $this->assertCount(0, $response->json('data'));
    }

    public function test_show_nonexistent_news_returns_404(): void
    {
        $response = $this->getJson('/api/v1/news/9999');

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // PARTNERS
    // ============================================

    public function test_can_list_partners(): void
    {
        Partner::create([
            'name_fr' => 'Partenaire Test',
            'name_en' => 'Test Partner',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/partners');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data',
                'pagination',
            ])
            ->assertJson(['success' => true]);
    }

    public function test_can_show_single_partner(): void
    {
        $partner = Partner::create([
            'name_fr' => 'Partenaire A',
            'name_en' => 'Partner A',
            'is_active' => true,
        ]);

        $response = $this->getJson("/api/v1/partners/{$partner->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'name_fr' => 'Partenaire A',
                ],
            ]);
    }

    public function test_show_nonexistent_partner_returns_404(): void
    {
        $response = $this->getJson('/api/v1/partners/9999');

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // INFRASTRUCTURES
    // ============================================

    public function test_can_list_infrastructures(): void
    {
        Infrastructure::create([
            'nom_fr' => 'Entrepôt A',
            'nom_en' => 'Warehouse A',
            'description_fr' => 'Description entrepôt',
            'description_en' => 'Warehouse description',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/infrastructures');

        $response->assertOk()
            ->assertJson(['success' => true]);
    }

    public function test_show_nonexistent_infrastructure_returns_404(): void
    {
        $response = $this->getJson('/api/v1/infrastructures/9999');

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // JOB OFFERS
    // ============================================

    public function test_can_list_job_offers(): void
    {
        $response = $this->getJson('/api/v1/jobs');

        $response->assertOk()
            ->assertJson(['success' => true]);
    }

    public function test_show_nonexistent_job_offer_returns_404(): void
    {
        $response = $this->getJson('/api/v1/jobs/9999');

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // ANNOUNCEMENTS
    // ============================================

    public function test_can_list_announcements(): void
    {
        $response = $this->getJson('/api/v1/announcements');

        $response->assertOk()
            ->assertJson(['success' => true]);
    }

    public function test_show_nonexistent_announcement_returns_404(): void
    {
        $response = $this->getJson('/api/v1/announcements/9999');

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }
}
