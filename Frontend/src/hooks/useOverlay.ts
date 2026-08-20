import { useEffect } from 'react';

/**
 * Comportement commun à tous les overlays (modales, drawers, menus mobiles).
 *
 * - verrouille le scroll de la page derrière l'overlay, sans provoquer le saut
 *   de mise en page dû à la disparition de la scrollbar sur desktop ;
 * - ferme l'overlay sur la touche Échap ;
 * - reste inactif tant que l'overlay est fermé.
 *
 * Centralisé ici pour éviter de dupliquer cette logique dans la navbar,
 * la sidebar admin et chaque modale.
 */
export function useOverlay(isOpen: boolean, onClose?: () => void): void {
  // Verrou du scroll
  useEffect(() => {
    if (!isOpen) return;

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    // Compense la largeur de la scrollbar pour éviter un décalage horizontal
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  // Fermeture au clavier
  useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
}

export default useOverlay;
