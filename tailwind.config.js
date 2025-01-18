/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-image': "url(https://static.vecteezy.com/system/resources/previews/004/708/960/original/abstract-green-background-green-and-white-simple-and-clean-background-vector.jpg)",
      },
    },
  },
  plugins: [],
};
