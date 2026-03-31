<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Tests\Traits\AuthHelpers;

class AuthTest extends TestCase
{
    use RefreshDatabase, AuthHelpers;

    private string $baseUrl = '/api/v1/admin/auth';

    // ============================================
    // LOGIN
    // ============================================

    public function test_admin_can_login_with_valid_credentials(): void
    {
        $admin = $this->createAdminUser();

        $response = $this->postJson("{$this->baseUrl}/login", [
            'email' => $admin->email,
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'admin' => ['id', 'name', 'email', 'role'],
                    'token',
                    'abilities',
                ],
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'admin' => [
                        'email' => $admin->email,
                        'role' => 'super_admin',
                    ],
                ],
            ]);
    }

    public function test_login_fails_with_invalid_password(): void
    {
        $admin = $this->createAdminUser();

        $response = $this->postJson("{$this->baseUrl}/login", [
            'email' => $admin->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_login_fails_with_nonexistent_email(): void
    {
        $response = $this->postJson("{$this->baseUrl}/login", [
            'email' => 'nonexistent@kamlog.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_login_fails_with_disabled_account(): void
    {
        $admin = $this->createAdminUser([
            'is_active' => false,
            'email' => 'disabled@kamlog-test.com',
        ]);

        $response = $this->postJson("{$this->baseUrl}/login", [
            'email' => $admin->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_login_requires_email_and_password(): void
    {
        $response = $this->postJson("{$this->baseUrl}/login", []);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => ['email', 'password'],
            ]);
    }

    public function test_login_requires_valid_email_format(): void
    {
        $response = $this->postJson("{$this->baseUrl}/login", [
            'email' => 'not-an-email',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    // ============================================
    // ME (Authenticated user info)
    // ============================================

    public function test_authenticated_admin_can_get_profile(): void
    {
        $admin = $this->actingAsSuperAdmin();

        $response = $this->getJson("{$this->baseUrl}/me");

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => ['id', 'name', 'email', 'role', 'is_active'],
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'email' => $admin->email,
                    'role' => 'super_admin',
                ],
            ]);
    }

    public function test_unauthenticated_user_cannot_access_me(): void
    {
        $response = $this->getJson("{$this->baseUrl}/me");

        $response->assertStatus(401)
            ->assertJson(['success' => false]);
    }

    // ============================================
    // LOGOUT
    // ============================================

    public function test_authenticated_admin_can_logout(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson("{$this->baseUrl}/logout");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Déconnexion réussie',
            ]);
    }

    public function test_unauthenticated_user_cannot_logout(): void
    {
        $response = $this->postJson("{$this->baseUrl}/logout");

        $response->assertStatus(401);
    }

    // ============================================
    // LOGOUT ALL
    // ============================================

    public function test_admin_can_logout_all_sessions(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson("{$this->baseUrl}/logout-all");

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Tous les tokens ont été révoqués',
            ]);
    }

    // ============================================
    // REFRESH TOKEN
    // ============================================

    public function test_admin_can_refresh_token(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->postJson("{$this->baseUrl}/refresh");

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['token', 'abilities'],
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Token rafraîchi',
            ]);
    }

    public function test_unauthenticated_user_cannot_refresh_token(): void
    {
        $response = $this->postJson("{$this->baseUrl}/refresh");

        $response->assertStatus(401);
    }
}
