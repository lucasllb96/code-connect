# Página de Login — Code Connect

Implementação da página de login seguindo Atomic Design, com layout reutilizável para a futura página de cadastro.

## Design de Referência

O layout segue fielmente o mockup fornecido:
- **Fundo escuro** (`#0B0D17`) com logos "code connect" como watermark decorativo
- **Card centralizado** com bordas arredondadas e borda sutil (`#2A2D3A`)
- **Lado esquerdo**: Banner/imagem (diferente entre login e cadastro)
- **Lado direito**: Formulário com campos, checkbox, botão verde, login social e link de cadastro

---

## Dependências Necessárias

| Pacote | Motivo |
|--------|--------|
| `tailwindcss` + `@tailwindcss/vite` | Estilização (conforme AGENTS.md) |
| `react-router-dom` | Roteamento SPA (necessário para navegar entre login/cadastro) |

---

## Proposed Changes

### Setup & Configuração

#### [MODIFY] [vite.config.ts](file:///Users/lucas/Documents/projetos/code-connect/apps/web/vite.config.ts)
- Adicionar o plugin `@tailwindcss/vite` ao Vite config.

#### [MODIFY] [index.css](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/index.css)
- Substituir todo o conteúdo pelo import do Tailwind (`@import "tailwindcss"`) + custom theme tokens (cores do design system, fontes).

#### [MODIFY] [index.html](file:///Users/lucas/Documents/projetos/code-connect/apps/web/index.html)
- Atualizar `<title>` para "Code Connect".
- Adicionar import da fonte **Inter** do Google Fonts.

---

### Atoms (Componentes básicos reutilizáveis)

#### [NEW] [Input.tsx](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/components/atoms/Input.tsx)
- Input de texto genérico com `label`, `placeholder`, `type`, suporte a `password`.
- Props: `id`, `label`, `type`, `placeholder`, `value`, `onChange`.
- Estilo: fundo escuro, borda sutil, texto claro.

#### [NEW] [Button.tsx](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/components/atoms/Button.tsx)
- Botão primário reutilizável.
- Props: `children`, `type`, `variant` (`primary` | `ghost`), `fullWidth`, `onClick`.
- Variante `primary`: fundo verde (`#4ADE80`→ `#22C55E` gradient), texto escuro, ícone de seta.

#### [NEW] [Checkbox.tsx](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/components/atoms/Checkbox.tsx)
- Checkbox estilizado com label.
- Props: `id`, `label`, `checked`, `onChange`.

#### [NEW] [Divider.tsx](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/components/atoms/Divider.tsx)
- Linha divisória com texto central ("ou entre com outras contas").
- Props: `text`.

#### [NEW] [SocialButton.tsx](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/components/atoms/SocialButton.tsx)
- Botão de login social (ícone + label).
- Props: `icon` (ReactNode), `label`, `onClick`.

---

### Molecules (Composições de atoms)

#### [NEW] [LoginForm.tsx](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/components/molecules/LoginForm.tsx)
- Agrupa: Input (email), Input (senha), Checkbox + link "Esqueci a senha", Button "Login →".
- Gerencia estado local do formulário.

#### [NEW] [SocialLoginGroup.tsx](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/components/molecules/SocialLoginGroup.tsx)
- Agrupa: Divider + ícones GitHub/Gmail lado a lado.

---

### Organisms

#### [NEW] [AuthCard.tsx](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/components/organisms/AuthCard.tsx)
- Card com layout de 2 colunas: banner (esquerda) + conteúdo (direita).
- Props: `bannerSrc`, `children` (formulário injetado).
- **Reutilizável** — a página de cadastro poderá usar o mesmo AuthCard com banner e formulário diferentes.

---

### Templates

#### [NEW] [AuthTemplate.tsx](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/components/templates/AuthTemplate.tsx)
- Layout fullscreen com fundo escuro + watermarks decorativas do logo "code connect".
- Centraliza o `AuthCard`.
- Props: `children`.

---

### Pages

#### [NEW] [LoginPage.tsx](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/pages/LoginPage.tsx)
- Compõe: `AuthTemplate` → `AuthCard` (com banner de login) → título "Login" + subtítulo + `LoginForm` + `SocialLoginGroup` + link "Crie seu cadastro!".

---

### App & Routing

#### [MODIFY] [main.tsx](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/main.tsx)
- Envolver `<App />` com `<BrowserRouter>`.

#### [MODIFY] [App.tsx](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/App.tsx)
- Substituir conteúdo boilerplate por `<Routes>` com rota `/login` → `LoginPage`.
- Redirecionar `/` para `/login` temporariamente.

#### [DELETE] [App.css](file:///Users/lucas/Documents/projetos/code-connect/apps/web/src/App.css)
- Remover CSS do boilerplate (não será mais necessário com Tailwind).

---

## Estrutura Final de Arquivos

```
src/
├── components/
│   ├── atoms/
│   │   ├── Input.tsx
│   │   ├── Button.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Divider.tsx
│   │   └── SocialButton.tsx
│   ├── molecules/
│   │   ├── LoginForm.tsx
│   │   └── SocialLoginGroup.tsx
│   ├── organisms/
│   │   └── AuthCard.tsx
│   └── templates/
│       └── AuthTemplate.tsx
├── pages/
│   └── LoginPage.tsx
├── main.tsx
├── App.tsx
└── index.css
```

---

## Reuso para Página de Cadastro (Futuro)

A arquitetura permite criar a página de cadastro reusando:
- **AuthTemplate** — mesmo layout/background
- **AuthCard** — mesmo card, banner diferente via prop
- Criar novo **RegisterForm** (molecule) com campos específicos de cadastro
- Criar nova **RegisterPage** que compõe tudo

---

## Verification Plan

### Manual Verification
1. Rodar `pnpm web:dev` e verificar visualmente no navegador se o layout corresponde ao mockup
2. Testar responsividade em diferentes tamanhos de tela
3. Verificar que o formulário é funcional (inputs digitáveis, checkbox clicável, botão com hover)
4. Confirmar que a rota `/login` carrega corretamente

### Automated
```bash
pnpm --filter web run build
pnpm --filter web run lint
```
