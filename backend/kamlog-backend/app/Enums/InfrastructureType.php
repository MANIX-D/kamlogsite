<?php

namespace App\Enums;

enum InfrastructureType: string
{
    case ENTREPOT = 'entrepot';
    case PLATEFORME = 'plateforme';
    case BUREAU = 'bureau';
    case AUTRE = 'autre';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return [
            self::ENTREPOT->value => 'Entrepôt',
            self::PLATEFORME->value => 'Plateforme',
            self::BUREAU->value => 'Bureau',
            self::AUTRE->value => 'Autre',
        ];
    }

    public function label(): string
    {
        return match($this) {
            self::ENTREPOT => 'Entrepôt',
            self::PLATEFORME => 'Plateforme',
            self::BUREAU => 'Bureau',
            self::AUTRE => 'Autre',
        };
    }
}
