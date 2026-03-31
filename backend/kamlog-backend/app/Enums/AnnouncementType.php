<?php

namespace App\Enums;

enum AnnouncementType: string
{
    case INFO = 'info';
    case ALERTE = 'alerte';
    case MAINTENANCE = 'maintenance';
    case PROMOTION = 'promotion';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return [
            self::INFO->value => 'Information',
            self::ALERTE->value => 'Alerte',
            self::MAINTENANCE->value => 'Maintenance',
            self::PROMOTION->value => 'Promotion',
        ];
    }

    public function label(): string
    {
        return match($this) {
            self::INFO => 'Information',
            self::ALERTE => 'Alerte',
            self::MAINTENANCE => 'Maintenance',
            self::PROMOTION => 'Promotion',
        };
    }
}
