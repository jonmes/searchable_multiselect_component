/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#009688",
        secondary: "#444F60",
        "secondary-hover": "#596474",
        "primary-2": "#80CBC4",
        "primary-3": "#009688",
        "primary-4": "#B3E0DB",
        "primary-5": "#E6F5F3",
        "primary-6": "#045750",
        "primary-dark": "#008274",
        "primary-dark-2": "#33aba0",
        "primary-lite": "#80CBC4",
        "primary-hover": "#B3E0DB",
        "primary-lite-1": "#def9f6",
        "secondary-background": "#F1F1F1",
        "secondary-1": "#ECECEC",
        "secondary-2": "#F9FAFB",
        "secondary-3": "#C1C1C1",
        "secondary-4": "#C7CACF",
        "secondary-5": "#444444",
        "secondary-6": "#697280",
        "secondary-7": "#ECECEC",
        "secondary-8": "#ffffff",
        "secondary-dark": "#313131",
        "secondary-lite": "#f1f1f1",
        "primary-gray": "#F1F1F1",
        "primary-light": "#E6F5F3",
        "primary-light2": "#80CBC4",
        "primary-light3": "#B3E0DB",
        "hahu-gray": "#444F60",
      },

    },
  },
  plugins: [],
}