<?php

namespace App\Enums;

enum PartnerType: string
{
    case STRATEGIQUE = 'strategique';
    case OPERATIONNEL = 'operationnel';
    case INSTITUTIONNEL = 'institutionnel';
    case COMMERCIAL = 'commercial';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return [
            self::STRATEGIQUE->value => 'Stratégique',
            self::OPERATIONNEL->value => 'Opérationnel',
            self::INSTITUTIONNEL->value => 'Institutionnel',
            self::COMMERCIAL->value => 'Commercial',
        ];
    }

    public function label(): string
    {
        return match($this) {
            self::STRATEGIQUE => 'Stratégique',
            self::OPERATIONNEL => 'Opérationnel',
            self::INSTITUTIONNEL => 'Institutionnel',
            self::COMMERCIAL => 'Commercial',
        };
    }
}
