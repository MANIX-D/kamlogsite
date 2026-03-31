<?php

namespace Tests\Feature\Api;

use App\Models\News;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\AuthHelpers;

class AdminNewsCrudTest extends TestCase
{
    use RefreshDatabase, AuthHelpers;

    private string $baseUrl = '/api/v1/admin/news';

    // ============================================
    // CREATE
    // ============================================

    public function test_admin_can_create_news(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, [
            'titre_fr' => 'Nouvelle actualité',
            'titre_en' => 'New article',
            'contenu_fr' => 'Contenu de l\'actualité en français.',
            'contenu_en' => 'News content in English.',
            'slug_fr' => 'nouvelle-actualite',
            'slug_en' => 'new-article',
            'type' => 'article',
            'is_published' => true,
            'is_featured' => false,
            'date_publication' => now()->format('Y-m-d'),
        ]);

        $response->assertCreated()
            ->assertJson([
                'success' => true,
                'message' => 'Actualité créée avec succès',
            ]);

        $this->assertDatabaseHas('news', [
            'titre_fr' => 'Nouvelle actualité',
            'slug_fr' => 'nouvelle-actualite',
        ]);
    }

    public function test_create_news_validates_required_fields(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, []);

        $response->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    public function test_unauthenticated_user_cannot_create_news(): void
    {
        $response = $this->postJson($this->baseUrl, [
            'titre_fr' => 'Test',
            'titre_en' => 'Test',
            'contenu_fr' => 'Test',
            'contenu_en' => 'Test',
        ]);

        $response->assertStatus(401);
    }

    // ============================================
    // UPDATE
    // ============================================

    public function test_admin_can_update_news(): void
    {
        $this->actingAsSuperAdmin();

        $news = News::create([
            'titre_fr' => 'Original',
            'titre_en' => 'Original EN',
            'contenu_fr' => 'Contenu original',
            'contenu_en' => 'Original content',
            'slug_fr' => 'original',
            'slug_en' => 'original-en',
            'is_published' => false,
            'date_publication' => now(),
        ]);

        $response = $this->putJson("{$this->baseUrl}/{$news->id}", [
            'titre_fr' => 'Titre modifié',
            'titre_en' => 'Modified title',
            'contenu_fr' => 'Contenu modifié',
            'contenu_en' => 'Modified content',
            'slug_fr' => 'titre-modifie',
            'slug_en' => 'modified-title',
            'type' => 'article',
            'is_published' => true,
            'date_publication' => now()->format('Y-m-d'),
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Actualité mise à jour avec succès',
            ]);

        $this->assertDatabaseHas('news', [
            'id' => $news->id,
            'titre_fr' => 'Titre modifié',
        ]);
    }

    public function test_update_nonexistent_news_returns_404(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->putJson("{$this->baseUrl}/9999", [
            'titre_fr' => 'Test',
            'titre_en' => 'Test',
            'contenu_fr' => 'Test',
            'contenu_en' => 'Test',
            'slug_fr' => 'test',
            'slug_en' => 'test',
            'type' => 'article',
            'date_publication' => now()->format('Y-m-d'),
        ]);

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // DELETE
    // ============================================

    public function test_admin_can_delete_news(): void
    {
        $this->actingAsSuperAdmin();

        $news = News::create([
            'titre_fr' => 'À supprimer',
            'titre_en' => 'To delete',
            'contenu_fr' => 'Contenu',
            'contenu_en' => 'Content',
            'slug_fr' => 'a-supprimer',
            'slug_en' => 'to-delete',
            'date_publication' => now(),
        ]);

        $response = $this->deleteJson("{$this->baseUrl}/{$news->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Actualité supprimée avec succès',
            ]);

        $this->assertSoftDeleted('news', ['id' => $news->id]);
    }

    // ============================================
    // RESTORE
    // ============================================

    public function test_admin_can_restore_deleted_news(): void
    {
        $this->actingAsSuperAdmin();

        $news = News::create([
            'titre_fr' => 'Supprimé',
            'titre_en' => 'Deleted',
            'contenu_fr' => 'Contenu',
            'contenu_en' => 'Content',
            'slug_fr' => 'supprime',
            'slug_en' => 'deleted',
            'date_publication' => now(),
        ]);
        $news->delete();

        $response = $this->postJson("{$this->baseUrl}/{$news->id}/restore");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Actualité restaurée avec succès',
            ]);
    }
}
