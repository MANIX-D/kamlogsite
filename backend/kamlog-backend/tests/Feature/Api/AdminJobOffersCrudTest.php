<?php

namespace Tests\Feature\Api;

use App\Models\JobOffer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\AuthHelpers;

class AdminJobOffersCrudTest extends TestCase
{
    use RefreshDatabase, AuthHelpers;

    private string $baseUrl = '/api/v1/admin/jobs';

    private function validJobData(array $overrides = []): array
    {
        return array_merge([
            'title_fr' => 'Responsable Logistique',
            'title_en' => 'Logistics Manager',
            'description_fr' => 'Nous recherchons un responsable logistique expérimenté.',
            'description_en' => 'We are looking for an experienced logistics manager.',
            'requirements_fr' => 'Bac+5 en logistique, 5 ans d\'expérience minimum.',
            'requirements_en' => 'Master in logistics, 5 years experience minimum.',
            'benefits_fr' => 'Mutuelle, tickets restaurant, télétravail.',
            'benefits_en' => 'Health insurance, meal vouchers, remote work.',
            'contract_type' => 'CDI',
            'location' => 'Douala, Cameroun',
            'experience_level' => 'confirme',
            'salary_range' => '500000 - 800000 FCFA',
            'department' => 'Logistique',
            'application_deadline' => now()->addMonths(2)->format('Y-m-d'),
            'is_active' => true,
            'is_urgent' => false,
        ], $overrides);
    }

    // ============================================
    // CREATE
    // ============================================

    public function test_admin_can_create_job_offer(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, $this->validJobData());

        $response->assertCreated()
            ->assertJson([
                'success' => true,
                'message' => 'Offre d\'emploi créée avec succès',
            ]);

        $this->assertDatabaseHas('job_offers', [
            'title_fr' => 'Responsable Logistique',
            'contract_type' => 'CDI',
            'experience_level' => 'confirme',
        ]);
    }

    public function test_create_job_validates_required_fields(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, []);

        $response->assertStatus(422)
            ->assertJson(['success' => false])
            ->assertJsonValidationErrors([
                'title_fr', 'title_en',
                'description_fr', 'description_en',
                'requirements_fr', 'requirements_en',
                'contract_type', 'location', 'experience_level',
            ]);
    }

    public function test_create_job_validates_contract_type_enum(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, $this->validJobData([
            'contract_type' => 'invalide_type',
        ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['contract_type']);
    }

    public function test_create_job_validates_experience_level_enum(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, $this->validJobData([
            'experience_level' => 'invalide_level',
        ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['experience_level']);
    }

    public function test_create_job_validates_deadline_must_be_future(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson($this->baseUrl, $this->validJobData([
            'application_deadline' => now()->subDay()->format('Y-m-d'),
        ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['application_deadline']);
    }

    public function test_unauthenticated_user_cannot_create_job(): void
    {
        $response = $this->postJson($this->baseUrl, $this->validJobData());

        $response->assertStatus(401);
    }

    public function test_editor_cannot_create_job(): void
    {
        $this->actingAsEditor();

        $response = $this->postJson($this->baseUrl, $this->validJobData());

        $response->assertStatus(403);
    }

    // ============================================
    // UPDATE
    // ============================================

    public function test_admin_can_update_job_offer(): void
    {
        $this->actingAsSuperAdmin();

        $job = JobOffer::create([
            'title_fr' => 'Original',
            'title_en' => 'Original EN',
            'description_fr' => 'Description originale',
            'description_en' => 'Original description',
            'requirements_fr' => 'Exigences originales',
            'requirements_en' => 'Original requirements',
            'contract_type' => 'CDI',
            'location' => 'Douala',
            'experience_level' => 'junior',
            'application_deadline' => now()->addMonth(),
            'is_active' => true,
        ]);

        $response = $this->putJson("{$this->baseUrl}/{$job->id}", $this->validJobData([
            'title_fr' => 'Titre Modifié',
            'contract_type' => 'Stage',
            'experience_level' => 'senior',
        ]));

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Offre d\'emploi mise à jour avec succès',
            ]);

        $this->assertDatabaseHas('job_offers', [
            'id' => $job->id,
            'title_fr' => 'Titre Modifié',
            'contract_type' => 'Stage',
            'experience_level' => 'senior',
        ]);
    }

    public function test_update_nonexistent_job_returns_404(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->putJson("{$this->baseUrl}/9999", $this->validJobData());

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // DELETE
    // ============================================

    public function test_admin_can_delete_job_offer(): void
    {
        $this->actingAsSuperAdmin();

        $job = JobOffer::create([
            'title_fr' => 'À supprimer',
            'title_en' => 'To delete',
            'description_fr' => 'Description',
            'description_en' => 'Description',
            'requirements_fr' => 'Exigences',
            'requirements_en' => 'Requirements',
            'contract_type' => 'Stage',
            'location' => 'Yaoundé',
            'experience_level' => 'junior',
            'application_deadline' => now()->addMonth(),
            'is_active' => true,
        ]);

        $response = $this->deleteJson("{$this->baseUrl}/{$job->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Offre d\'emploi supprimée avec succès',
            ]);

        $this->assertSoftDeleted('job_offers', ['id' => $job->id]);
    }

    public function test_delete_nonexistent_job_returns_404(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->deleteJson("{$this->baseUrl}/9999");

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // RESTORE
    // ============================================

    public function test_admin_can_restore_deleted_job(): void
    {
        $this->actingAsSuperAdmin();

        $job = JobOffer::create([
            'title_fr' => 'Supprimé',
            'title_en' => 'Deleted',
            'description_fr' => 'Description',
            'description_en' => 'Description',
            'requirements_fr' => 'Exigences',
            'requirements_en' => 'Requirements',
            'contract_type' => 'CDI',
            'location' => 'Douala',
            'experience_level' => 'confirme',
            'application_deadline' => now()->addMonth(),
        ]);
        $job->delete();

        $response = $this->postJson("{$this->baseUrl}/{$job->id}/restore");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Offre d\'emploi restaurée avec succès',
            ]);

        $this->assertDatabaseHas('job_offers', [
            'id' => $job->id,
            'deleted_at' => null,
        ]);
    }

    public function test_restore_non_deleted_job_returns_error(): void
    {
        $this->actingAsSuperAdmin();

        $job = JobOffer::create([
            'title_fr' => 'Actif',
            'title_en' => 'Active',
            'description_fr' => 'Description',
            'description_en' => 'Description',
            'requirements_fr' => 'Exigences',
            'requirements_en' => 'Requirements',
            'contract_type' => 'Freelance',
            'location' => 'Remote',
            'experience_level' => 'expert',
            'application_deadline' => now()->addMonth(),
        ]);

        $response = $this->postJson("{$this->baseUrl}/{$job->id}/restore");

        $response->assertStatus(400)
            ->assertJson(['success' => false]);
    }
}
