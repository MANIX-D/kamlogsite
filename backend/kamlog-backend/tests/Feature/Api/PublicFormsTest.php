<?php

namespace Tests\Feature\Api;

use App\Models\NewsletterSubscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicFormsTest extends TestCase
{
    use RefreshDatabase;

    // ============================================
    // CONTACT MESSAGE
    // ============================================

    public function test_can_submit_contact_message(): void
    {
        $response = $this->postJson('/api/v1/contact', [
            'nom' => 'Jean Dupont',
            'email' => 'jean@example.com',
            'telephone' => '+33 6 12 34 56 78',
            'entreprise' => 'KAMLOG',
            'sujet' => 'Demande d\'information',
            'message' => 'Je souhaite en savoir plus sur vos services.',
        ]);

        $response->assertCreated()
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('contact_messages', [
            'nom' => 'Jean Dupont',
            'email' => 'jean@example.com',
            'sujet' => 'Demande d\'information',
        ]);
    }

    public function test_contact_message_requires_mandatory_fields(): void
    {
        $response = $this->postJson('/api/v1/contact', []);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors',
            ])
            ->assertJson(['success' => false]);
    }

    public function test_contact_message_requires_valid_email(): void
    {
        $response = $this->postJson('/api/v1/contact', [
            'nom' => 'Jean',
            'email' => 'pas-un-email',
            'sujet' => 'Test',
            'message' => 'Test message',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_contact_message_without_optional_fields(): void
    {
        $response = $this->postJson('/api/v1/contact', [
            'nom' => 'Marie Martin',
            'email' => 'marie@example.com',
            'sujet' => 'Question',
            'message' => 'Ma question ici.',
        ]);

        $response->assertCreated()
            ->assertJson(['success' => true]);
    }

    // ============================================
    // NEWSLETTER SUBSCRIPTION
    // ============================================

    public function test_can_subscribe_to_newsletter(): void
    {
        $response = $this->postJson('/api/v1/newsletter/subscribe', [
            'email' => 'subscriber@example.com',
            'nom' => 'Dupont',
            'prenom' => 'Jean',
        ]);

        $response->assertCreated()
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['email', 'date_inscription'],
            ]);

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'subscriber@example.com',
            'statut' => 'actif',
        ]);
    }

    public function test_newsletter_requires_email(): void
    {
        $response = $this->postJson('/api/v1/newsletter/subscribe', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_newsletter_rejects_duplicate_email(): void
    {
        NewsletterSubscriber::create([
            'email' => 'existing@example.com',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->postJson('/api/v1/newsletter/subscribe', [
            'email' => 'existing@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_can_unsubscribe_from_newsletter(): void
    {
        $subscriber = NewsletterSubscriber::create([
            'email' => 'unsub@example.com',
            'token_desinscription' => 'test-token-123456',
            'statut' => 'actif',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->getJson("/api/v1/newsletter/unsubscribe/{$subscriber->token_desinscription}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'unsub@example.com',
            'statut' => 'desinscrit',
        ]);
    }

    public function test_unsubscribe_with_invalid_token_returns_404(): void
    {
        $response = $this->getJson('/api/v1/newsletter/unsubscribe/invalid-token');

        $response->assertNotFound()
            ->assertJson(['success' => false]);
    }

    // ============================================
    // VISIT REQUESTS
    // ============================================

    public function test_can_submit_visit_request(): void
    {
        $response = $this->postJson('/api/v1/visit-requests', [
            'name' => 'Pierre Martin',
            'email' => 'pierre@example.com',
            'phone' => '+33 6 00 00 00 00',
            'company' => 'Entreprise XYZ',
            'date' => now()->addWeek()->format('Y-m-d'),
            'heure' => '10:00',
            'type_visite' => 'guidee',
            'message' => 'Visite des entrepôts',
        ]);

        $response->assertCreated()
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('visit_requests', [
            'name' => 'Pierre Martin',
            'email' => 'pierre@example.com',
            'type_visite' => 'guidee',
        ]);
    }

    public function test_visit_request_requires_mandatory_fields(): void
    {
        $response = $this->postJson('/api/v1/visit-requests', []);

        $response->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    public function test_visit_request_requires_future_date(): void
    {
        $response = $this->postJson('/api/v1/visit-requests', [
            'name' => 'Test',
            'email' => 'test@example.com',
            'phone' => '0600000000',
            'date' => now()->subDay()->format('Y-m-d'),
            'heure' => '10:00',
            'type_visite' => 'guidee',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['date']);
    }

    public function test_visit_request_validates_type_visite(): void
    {
        $response = $this->postJson('/api/v1/visit-requests', [
            'name' => 'Test',
            'email' => 'test@example.com',
            'phone' => '0600000000',
            'date' => now()->addWeek()->format('Y-m-d'),
            'heure' => '10:00',
            'type_visite' => 'invalide',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type_visite']);
    }

    public function test_visit_request_validates_heure_format(): void
    {
        $response = $this->postJson('/api/v1/visit-requests', [
            'name' => 'Test',
            'email' => 'test@example.com',
            'phone' => '0600000000',
            'date' => now()->addWeek()->format('Y-m-d'),
            'heure' => '25:99',
            'type_visite' => 'guidee',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['heure']);
    }

    // ============================================
    // QUOTE REQUESTS
    // ============================================

    public function test_can_submit_quote_request(): void
    {
        $response = $this->postJson('/api/v1/quote-requests', [
            'company_name' => 'Entreprise ABC',
            'contact_person' => 'Directeur Logistique',
            'email' => 'devis@entreprise.com',
            'phone' => '+33 1 23 45 67 89',
            'address' => '123 Rue de la Logistique, Paris',
            'service_type' => 'logistique',
            'project_description' => 'Besoin de gestion logistique pour notre entrepôt de 5000m².',
            'budget_range' => '10000-50000',
        ]);

        $response->assertCreated()
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('quote_requests', [
            'company_name' => 'Entreprise ABC',
            'email' => 'devis@entreprise.com',
            'service_type' => 'logistique',
        ]);
    }

    public function test_quote_request_requires_mandatory_fields(): void
    {
        $response = $this->postJson('/api/v1/quote-requests', []);

        $response->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    public function test_quote_request_validates_service_type(): void
    {
        $response = $this->postJson('/api/v1/quote-requests', [
            'company_name' => 'Test',
            'contact_person' => 'Test',
            'email' => 'test@example.com',
            'phone' => '0100000000',
            'service_type' => 'invalide',
            'project_description' => 'Description',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['service_type']);
    }

    public function test_quote_request_validates_dates(): void
    {
        $response = $this->postJson('/api/v1/quote-requests', [
            'company_name' => 'Test',
            'contact_person' => 'Test',
            'email' => 'test@example.com',
            'phone' => '0100000000',
            'service_type' => 'transport',
            'project_description' => 'Description',
            'desired_start_date' => now()->subDay()->format('Y-m-d'),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['desired_start_date']);
    }
}
