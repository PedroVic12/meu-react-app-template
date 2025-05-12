# meu-react-app-template
---

Conjunto de arquivos para um aplicativo inicial com mobile first para arquivos React usando Vite, tailwind, MUI material e Ionic


1) Instale NodeJS e npm na maquina

2) rode o comando para criar um projeto React e Vite

```bash

npm create vite@latest meu-app-template -- --template react

```

3) Copie e cole os seguintes arquivos ***`package.json`** e toda pasta **`src`** e substuita pelo atual (SUGIRO APAGAR OS ARQUIVOS, COPIAR e COLAR)

4) Faça isso apr instalar as depedencias necessarias

```bash

npm install

```

5) E por fim, rode o projeto

```bash

npm run dev

```

### Pronto! Agora voce tem um start kit app em React e Vite pronto para iniciar seu aplicativo!














🗂️ Projeto Monorepo com Vite + Tailwind + React + Rotas
Este guia vai te ajudar a configurar um monorepo com Vite, Tailwind CSS e React, permitindo que você gerencie múltiplos subprojetos dentro de um único projeto principal.

1. Crie a Pasta do Projeto Principal
```bash

mkdir my-app
cd my-app
```
2. Crie o package.json na Raiz
Inicialize o arquivo package.json:

```bash
npm init -y
Adicione as dependências principais:
```
```bash

npm install react react-dom tailwindcss vite react-router-dom

```
3. Configure o Tailwind CSS
Inicialize o Tailwind:

```bash

npx tailwindcss init
```
Modifique o arquivo tailwind.config.js:

```js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./apps/**/*.{html,js,jsx,ts,tsx}", "./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Crie o arquivo postcss.config.js:

```js

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```
4. Crie as Pastas para os Subprojetos

```bash

mkdir -p apps/app1/src
mkdir -p apps/app2/src
mkdir -p src
```

5. Configure os package.json dos Subprojetos
Crie o arquivo apps/app1/package.json:

```json

{
  "name": "app1",
  "version": "1.0.0",
  "main": "src/main.tsx",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

E o arquivo apps/app2/package.json:

```json

{
  "name": "app2",
  "version": "1.0.0",
  "main": "src/main.tsx",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

6. Configurando o Vite na Raiz
Crie o arquivo vite.config.ts:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@app1': resolve(__dirname, 'apps/app1/src'),
      '@app2': resolve(__dirname, 'apps/app2/src'),
    },
  },
});

```
7. Configurando o App Principal
📝 Crie o arquivo src/index.html:

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="./styles.css">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./main.tsx"></script>
</body>
</html>
```
📝 Crie o arquivo src/main.tsx:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```
📝 Crie o arquivo src/App.tsx:

```tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import App1 from '@app1/App';
import App2 from '@app2/App';

function App() {
  return (
    <Router>
      <nav className="p-4 bg-blue-600 text-white flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/app1">App 1</Link>
        <Link to="/app2">App 2</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1 className="text-3xl text-center mt-10">Welcome to My App!</h1>} />
        <Route path="/app1" element={<App1 />} />
        <Route path="/app2" element={<App2 />} />
      </Routes>
    </Router>
  );
}

export default App;
```
📝 Crie o arquivo src/styles.css:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
8. Configurando os Subprojetos (App1 e App2)
Para App1:

📝 Crie apps/app1/src/App.tsx:

```tsx

import React from 'react';

function App1() {
  return (
    <div className="text-4xl text-center text-blue-500">
      Hello from App 1!
    </div>
  );
}

export default App1;
```
Para App2:

📝 Crie apps/app2/src/App.tsx:

```tsx
import React from 'react';

function App2() {
  return (
    <div className="text-4xl text-center text-green-500">
      Hello from App 2!
    </div>
  );
}

export default App2;
```
9. Facilite com o Script run_dev.sh
Crie o arquivo run_dev.sh:

```bash
#!/bin/bash

echo "Starting Vite Dev Server for My App..."
vite --open
Torne o script executável:
```

```bash
chmod +x run_dev.sh

Agora você pode rodar o projeto inteiro com:
```
```bash
./run_dev.sh
```
10. Rodando o Projeto
Agora é só instalar as dependências dos subprojetos:

```bash

cd apps/app1
npm install
cd ../app2
npm install
cd ../..
npm install
```
E rodar:

```bash
./run_dev.sh
```

🎯 Próximos Passos:
Adicionar mais apps.

Criar componentes reutilizáveis entre os apps.

Adicionar autenticação e controle de acesso.

Implementar testes com Jest ou React Testing Library.

