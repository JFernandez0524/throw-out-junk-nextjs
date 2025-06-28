module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // keep this
    './components/**/*.{js,ts,jsx,tsx,mdx}', // ✅ add this
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#A8E6A2',
          DEFAULT: '#4CAF50',
          dark: '#2E7D32',
        },
        secondary: {
          light: '#1E4C7C',
          DEFAULT: '#003366',
          dark: '#001F4D',
        },
        accent: {
          light: '#F5F5F5',
          DEFAULT: '#D3D3D3',
          dark: '#A9A9A9',
        },
      },
    },
  },
  plugins: [],
};
