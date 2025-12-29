//@type {import('tailwindcss').Config}
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0F172A',      
        primary: '#EA580C',   
        background: '#F1F5F9' 
      }
    },
  },
  plugins: [],
}