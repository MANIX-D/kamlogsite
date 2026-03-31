<?php

namespace App\Enums;

enum Priority: string
{
    case BASSE = 'basse';
    case NORMALE = 'normale';
    case HAUTE = 'haute';
    case URGENTE = 'urgente';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return [
            self::BASSE->value => 'Basse',
            self::NORMALE->value => 'Normale',
            self::HAUTE->value => 'Haute',
            self::URGENTE->value => 'Urgente',
        ];
    }

    public function label(): string
    {
        return match($this) {
            self::BASSE => 'Basse',
            self::NORMALE => 'Normale',
            self::HAUTE => 'Haute',
            self::URGENTE => 'Urgente',
        };
    }

    /**
     * Obtenir le niveau numérique de priorité
     */
    public function level(): int
    {
        return match($this) {
            self::BASSE => 1,
            self::NORMALE => 2,
            self::HAUTE => 3,
            self::URGENTE => 4,
        };
    }
}
