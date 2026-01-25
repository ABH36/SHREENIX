/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Product based colors
        'primary': '#1a237e',
        'primary-light': '#3949ab',
        'secondary': '#bbdefb',
        'secondary-light': '#e3f2fd',
        'accent': '#ff5722',
        'highlight': '#ffb300',
        'herbal': '#2e7d32',
        'herbal-light': '#4caf50',
        
        // Neutrals
        'navy': '#0d1b2a',
        'navy-light': '#1e293b',
        'gray-light': '#f8f9fa',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'hindi': ['Noto Sans Devanagari', 'Inter', 'sans-serif'],
        'gujarati': ['Noto Sans Gujarati', 'sans-serif'],
        'serif': ['Poppins', 'Playfair Display', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'product': '0 30px 70px rgba(26, 35, 126, 0.2)',
        'product-lg': '0 40px 100px rgba(26, 35, 126, 0.3)',
      },
      backgroundImage: {
        'product-gradient': 'linear-gradient(135deg, #bbdefb, #e3f2fd, #ffffff)',
        'ayurvedic-gradient': 'linear-gradient(135deg, #2e7d32, #4caf50)',
      },
    },
  },
  plugins: [],
}