<?php

namespace App\Enums;

enum NewsType: string
{
    case ACTUALITE = 'actualite';
    case EVENEMENT = 'evenement';
    case COMMUNIQUE = 'communique';

    /**
     * Obtenir toutes les valeurs
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Obtenir les labels pour l'affichage
     */
    public static function labels(): array
    {
        return [
            self::ACTUALITE->value => 'Actualité',
            self::EVENEMENT->value => 'Événement',
            self::COMMUNIQUE->value => 'Communiqué',
        ];
    }

    /**
     * Obtenir le label d'un type
     */
    public function label(): string
    {
        return match($this) {
            self::ACTUALITE => 'Actualité',
            self::EVENEMENT => 'Événement',
            self::COMMUNIQUE => 'Communiqué',
        };
    }
}
