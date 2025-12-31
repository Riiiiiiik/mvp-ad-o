/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#00637C',   // O Azul Petróleo do "SILVA"
                    dark: '#1C2B39',      // O Azul Ardo do "ADAO"
                    light: '#E6F0F2',     // Cor de fundo suave da marca
                }
            }
        },
    },
    plugins: [],
}
