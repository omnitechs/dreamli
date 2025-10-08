const purgecss = require('@fullhuman/postcss-purgecss')({
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

module.exports = {
    plugins: [
        'tailwindcss',
        'autoprefixer',
        ...(process.env.NODE_ENV === 'production' ? [purgecss] : [])
    ],
};