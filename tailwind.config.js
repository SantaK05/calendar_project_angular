/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/pages/landing-amministrazione/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "main-dark": "#1b1b1b",
      },
    },
  },
  plugins: [],
};
