# Install DaisyUI

1.Install Tailwind CSS

install tailwindcss in project:

```bash
npm install tailwindcss @tailwindcss/vite
```

config vite.config.ts: to use tailwindcss plugin

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    open: true,
  },
})
```

import tailwindcss in src/index.css:

```css
@import "tailwindcss";
```

2.Install daisyui

install daisyui in project:

```bash
npm i -D daisyui@latest
```

import daisyui in src/index.css:
```css
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@100;200&display=swap');
@import "tailwindcss";
@plugin "daisyui" {
    themes: emerald --default;
}

html {
    font-family: 'Sarabun', sans-serif;
    scroll-behavior: smooth;
}
```
