/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // On conserve volontairement l'échelle Tailwind par défaut
      // (sm:640 md:768 lg:1024 xl:1280 2xl:1536) pour ne pas changer le sens
      // des classes déjà utilisées partout dans le projet, et on ajoute
      // uniquement les extrémités qui manquaient.
      screens: {
        xs: '375px',      // smartphones standards (376-480)
        '3xl': '1920px',  // grands écrans (1921+)
        // Cible les mobiles en paysage : hauteur réduite, on compacte
        'short': { raw: '(max-height: 640px) and (orientation: landscape)' },
      },
      colors: {
        // Couleurs de marque, jusqu'ici répétées en dur dans tout le projet
        brand: {
          DEFAULT: '#1F3878',
          light: '#2a4a9f',
          dark: '#152555',
        },
      },
      // Typographie fluide : interpole entre mobile et desktop sans palier brutal
      fontSize: {
        'fluid-sm': 'clamp(0.8125rem, 0.78rem + 0.16vw, 0.875rem)',
        'fluid-base': 'clamp(0.9375rem, 0.9rem + 0.19vw, 1rem)',
        'fluid-lg': 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
        'fluid-xl': 'clamp(1.125rem, 1.05rem + 0.38vw, 1.375rem)',
        'fluid-2xl': 'clamp(1.375rem, 1.2rem + 0.85vw, 1.875rem)',
        'fluid-3xl': 'clamp(1.625rem, 1.35rem + 1.35vw, 2.5rem)',
        'fluid-4xl': 'clamp(1.875rem, 1.4rem + 2.4vw, 3.25rem)',
        'fluid-5xl': 'clamp(2.125rem, 1.4rem + 3.6vw, 4.5rem)',
      },
      spacing: {
        // Gouttière de page fluide, utilisée par .container-page
        gutter: 'clamp(1rem, 3vw, 2rem)',
        section: 'clamp(2.5rem, 6vw, 5rem)',
      },
      maxWidth: {
        content: '1280px',
        wide: '1600px',
      },
      // Unités viewport dynamiques : évitent le décalage causé par la barre
      // d'URL sur iOS Safari, où 100vh dépasse la zone réellement visible.
      minHeight: {
        dvh: '100dvh',
      },
      height: {
        dvh: '100dvh',
      },
      maxHeight: {
        dvh: '100dvh',
      },
    },
  },
  plugins: [],
};
