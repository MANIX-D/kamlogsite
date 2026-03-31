<?php

namespace Tests\Feature\Api;

use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use App\Models\QuoteRequest;
use App\Models\VisitRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\AuthHelpers;

class AdminManagementTest extends TestCase
{
    use RefreshDatabase, AuthHelpers;

    // ============================================
    // CONTACT MESSAGES (Admin)
    // ============================================

    public function test_admin_can_list_contact_messages(): void
    {
        $this->actingAsSuperAdmin();

        ContactMessage::create([
            'nom' => 'Jean Test',
            'email' => 'jean@test.com',
            'sujet' => 'Sujet test',
            'message' => 'Message test',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->getJson('/api/v1/admin/contact-messages');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data',
                'pagination' => ['total', 'per_page', 'current_page', 'last_page'],
            ])
            ->assertJson(['success' => true]);
    }

    public function test_admin_can_show_contact_message(): void
    {
        $this->actingAsSuperAdmin();

        $message = ContactMessage::create([
            'nom' => 'Marie Test',
            'email' => 'marie@test.com',
            'sujet' => 'Sujet',
            'message' => 'Contenu du message',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->getJson("/api/v1/admin/contact-messages/{$message->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'nom' => 'Marie Test',
                    'email' => 'marie@test.com',
                ],
            ]);
    }

    public function test_admin_can_mark_contact_message_as_read(): void
    {
        $this->actingAsSuperAdmin();

        $message = ContactMessage::create([
            'nom' => 'Test',
            'email' => 'test@test.com',
            'sujet' => 'Sujet',
            'message' => 'Message',
            'lu' => false,
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->postJson("/api/v1/admin/contact-messages/{$message->id}/mark-read");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Message marqué comme lu',
            ]);

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'lu' => true,
        ]);
    }

    public function test_admin_can_delete_contact_message(): void
    {
        $this->actingAsSuperAdmin();

        $message = ContactMessage::create([
            'nom' => 'Delete Test',
            'email' => 'delete@test.com',
            'sujet' => 'Sujet',
            'message' => 'Message',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->deleteJson("/api/v1/admin/contact-messages/{$message->id}");

        $response->assertOk()
            ->assertJson(['success' => true]);

        $this->assertSoftDeleted('contact_messages', ['id' => $message->id]);
    }

    public function test_unauthenticated_user_cannot_list_contact_messages(): void
    {
        $response = $this->getJson('/api/v1/admin/contact-messages');

        $response->assertStatus(401);
    }

    // ============================================
    // NEWSLETTER SUBSCRIBERS (Admin)
    // ============================================

    public function test_admin_can_list_newsletter_subscribers(): void
    {
        $this->actingAsSuperAdmin();

        NewsletterSubscriber::create([
            'email' => 'sub@test.com',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->getJson('/api/v1/admin/newsletter/subscribers');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data',
                'pagination',
            ])
            ->assertJson(['success' => true]);
    }

    public function test_admin_can_show_newsletter_subscriber(): void
    {
        $this->actingAsSuperAdmin();

        $subscriber = NewsletterSubscriber::create([
            'email' => 'show@test.com',
            'nom' => 'Dupont',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->getJson("/api/v1/admin/newsletter/subscribers/{$subscriber->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'email' => 'show@test.com',
                ],
            ]);
    }

    public function test_admin_can_delete_newsletter_subscriber(): void
    {
        $this->actingAsSuperAdmin();

        $subscriber = NewsletterSubscriber::create([
            'email' => 'del@test.com',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->deleteJson("/api/v1/admin/newsletter/subscribers/{$subscriber->id}");

        $response->assertOk()
            ->assertJson(['success' => true]);

        $this->assertSoftDeleted('newsletter_subscribers', ['id' => $subscriber->id]);
    }

    // ============================================
    // VISIT REQUESTS (Admin)
    // ============================================

    public function test_admin_can_list_visit_requests(): void
    {
        $this->actingAsSuperAdmin();

        VisitRequest::create([
            'name' => 'Visiteur Test',
            'email' => 'visit@test.com',
            'phone' => '0600000000',
            'date' => now()->addWeek(),
            'heure' => '10:00',
            'type_visite' => 'guidee',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->getJson('/api/v1/admin/visit-requests');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data',
                'pagination',
            ])
            ->assertJson(['success' => true]);
    }

    public function test_admin_can_show_visit_request(): void
    {
        $this->actingAsSuperAdmin();

        $visitRequest = VisitRequest::create([
            'name' => 'Show Test',
            'email' => 'show-visit@test.com',
            'phone' => '0600000000',
            'date' => now()->addWeek(),
            'heure' => '14:00',
            'type_visite' => 'autonome',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->getJson("/api/v1/admin/visit-requests/{$visitRequest->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Show Test',
                    'email' => 'show-visit@test.com',
                ],
            ]);
    }

    public function test_admin_can_confirm_visit_request(): void
    {
        $this->actingAsSuperAdmin();

        $visitRequest = VisitRequest::create([
            'name' => 'Confirm Test',
            'email' => 'confirm@test.com',
            'phone' => '0600000000',
            'date' => now()->addWeek(),
            'heure' => '09:00',
            'type_visite' => 'guidee',
            'status' => 'pending',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->postJson("/api/v1/admin/visit-requests/{$visitRequest->id}/confirm");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Demande de visite confirmée',
            ]);

        $this->assertDatabaseHas('visit_requests', [
            'id' => $visitRequest->id,
            'status' => 'confirmed',
        ]);
    }

    public function test_admin_can_cancel_visit_request(): void
    {
        $this->actingAsSuperAdmin();

        $visitRequest = VisitRequest::create([
            'name' => 'Cancel Test',
            'email' => 'cancel@test.com',
            'phone' => '0600000000',
            'date' => now()->addWeek(),
            'heure' => '11:00',
            'type_visite' => 'guidee',
            'status' => 'pending',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->postJson("/api/v1/admin/visit-requests/{$visitRequest->id}/cancel");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Demande de visite annulée',
            ]);

        $this->assertDatabaseHas('visit_requests', [
            'id' => $visitRequest->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_admin_can_delete_visit_request(): void
    {
        $this->actingAsSuperAdmin();

        $visitRequest = VisitRequest::create([
            'name' => 'Delete Test',
            'email' => 'del-visit@test.com',
            'phone' => '0600000000',
            'date' => now()->addWeek(),
            'heure' => '15:00',
            'type_visite' => 'virtuelle',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->deleteJson("/api/v1/admin/visit-requests/{$visitRequest->id}");

        $response->assertOk()
            ->assertJson(['success' => true]);

        $this->assertSoftDeleted('visit_requests', ['id' => $visitRequest->id]);
    }

    // ============================================
    // QUOTE REQUESTS (Admin)
    // ============================================

    public function test_admin_can_list_quote_requests(): void
    {
        $this->actingAsSuperAdmin();

        QuoteRequest::create([
            'company_name' => 'Entreprise Test',
            'contact_person' => 'Contact Test',
            'email' => 'quote@test.com',
            'phone' => '0100000000',
            'address' => '123 Rue Test, Paris',
            'service_type' => 'logistique',
            'project_description' => 'Description du projet',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->getJson('/api/v1/admin/quote-requests');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data',
                'pagination',
            ])
            ->assertJson(['success' => true]);
    }

    public function test_admin_can_show_quote_request(): void
    {
        $this->actingAsSuperAdmin();

        $quoteRequest = QuoteRequest::create([
            'company_name' => 'Show Test Corp',
            'contact_person' => 'Contact Person',
            'email' => 'show-quote@test.com',
            'phone' => '0100000000',
            'address' => '456 Avenue Test, Lyon',
            'service_type' => 'stockage',
            'project_description' => 'Description',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->getJson("/api/v1/admin/quote-requests/{$quoteRequest->id}");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'company_name' => 'Show Test Corp',
                    'email' => 'show-quote@test.com',
                ],
            ]);
    }

    public function test_admin_can_delete_quote_request(): void
    {
        $this->actingAsSuperAdmin();

        $quoteRequest = QuoteRequest::create([
            'company_name' => 'Delete Test',
            'contact_person' => 'Contact',
            'email' => 'del-quote@test.com',
            'phone' => '0100000000',
            'address' => '789 Boulevard Test, Marseille',
            'service_type' => 'transport',
            'project_description' => 'Description',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->deleteJson("/api/v1/admin/quote-requests/{$quoteRequest->id}");

        $response->assertOk()
            ->assertJson(['success' => true]);

        $this->assertSoftDeleted('quote_requests', ['id' => $quoteRequest->id]);
    }

    public function test_unauthenticated_user_cannot_manage_quote_requests(): void
    {
        $response = $this->getJson('/api/v1/admin/quote-requests');

        $response->assertStatus(401);
    }

    // ============================================
    // ROLE-BASED ACCESS
    // ============================================

    public function test_editor_cannot_access_admin_contact_messages(): void
    {
        $this->actingAsEditor();

        $response = $this->getJson('/api/v1/admin/contact-messages');

        $response->assertStatus(403);
    }

    public function test_editor_cannot_access_admin_visit_requests(): void
    {
        $this->actingAsEditor();

        $response = $this->getJson('/api/v1/admin/visit-requests');

        $response->assertStatus(403);
    }

    public function test_editor_cannot_access_admin_quote_requests(): void
    {
        $this->actingAsEditor();

        $response = $this->getJson('/api/v1/admin/quote-requests');

        $response->assertStatus(403);
    }
}
