# MKT Event 2024 — Landing Page

Projeto inicial para a landing page do "MKT Event 2024" — HTML5 semântico + Tailwind CSS (JIT).

Estrutura criada:

- `public/index.html` — HTML semântico e conteúdo (header, hero, visto em, benefícios, palestrantes, footer)
- `src/styles.css` — diretivas Tailwind e utilitários customizados
- `src/main.js` — validação de formulário, modal e scroll reveal
- `dist/style.css` — saída do build (gerada pelo build:css)
- `tailwind.config.js`, `postcss.config.js`, `package.json`, `.gitignore`

Como usar (Windows PowerShell):

1. Instale as dependências dev (usar npm):

```powershell
npm install
```

2. Gerar o CSS compilado (cria `dist/style.css`):

```powershell
npm run build:css
```

3. Abrir `public/index.html` no navegador (ou sirva a pasta com um servidor estático). Para modo de desenvolvimento com watch:

```powershell
npm run watch:css
```

Observações:
- Tailwind JIT (v3+) compilará apenas as classes usadas nos arquivos apontados em `tailwind.config.js`.
- O projeto inclui um JS leve para validação e modal; para produção, conectar o formulário ao seu backend ou serviço de e-mails.
