// postcss.config.cjs  (CommonJS)
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const purgecss = require('@fullhuman/postcss-purgecss');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    plugins: [
        tailwindcss,
        autoprefixer,
        ...(isProd
            ? [
                purgecss({
                    content: [
                        './app/**/*.{js,ts,jsx,tsx}',
                        './components/**/*.{js,ts,jsx,tsx}',
                    ],
                    defaultExtractor: (content) =>
                        content.match(/[\w-/:]+(?<!:)/g) || [],
                    safelist: [],
                }),
            ]
            : []),
    ],
};
