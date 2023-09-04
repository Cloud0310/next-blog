/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        fontFamily: {
            'sans': ['var(--font-noto-sans)', 'var(--font-source-hans-sans)', 'sans-serif'],
            'serif': ['var(--font-noto-serif)', 'var(--font-source-hans-serif)', 'serif'],
            'mono': ['var(--font-jetbrains-mono)', 'monospace'],
            'symbol': ['var(--font-family-symbols)']
        },
        extend: {
        },
    },
    plugins: [],
}
