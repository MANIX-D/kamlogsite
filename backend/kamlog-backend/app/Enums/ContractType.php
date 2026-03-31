<?php

namespace App\Enums;

enum ContractType: string
{
    case CDI = 'CDI';
    case CDD = 'CDD';
    case STAGE = 'stage';
    case ALTERNANCE = 'alternance';
    case FREELANCE = 'freelance';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return [
            self::CDI->value => 'CDI',
            self::CDD->value => 'CDD',
            self::STAGE->value => 'Stage',
            self::ALTERNANCE->value => 'Alternance',
            self::FREELANCE->value => 'Freelance',
        ];
    }

    public function label(): string
    {
        return match($this) {
            self::CDI => 'CDI',
            self::CDD => 'CDD',
            self::STAGE => 'Stage',
            self::ALTERNANCE => 'Alternance',
            self::FREELANCE => 'Freelance',
        };
    }
}
