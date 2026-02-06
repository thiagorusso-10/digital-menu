# 🍽️ Cardápio Digital SaaS

Plataforma white-label moderna para criação e gerenciamento de cardápios digitais com QR Code. Desenvolvida para cafeterias, restaurantes e bares.

![Status](https://img.shields.io/badge/status-production-green)
![Version](https://img.shields.io/badge/version-1.0.4-blue)

## 🚀 Funcionalidades

### Para o Estabelecimento (Painel Admin)

- **Gestão de Itens:** Adicionar, editar e remover produtos com facilidade.
- **Upload Inteligente:** Compressão automática de imagens no navegador (economiza dados e storage).
- **Categorias:** Organização flexível (Bebidas, Salgados, Doces, etc.).
- **QR Code Generator:** Gerador integrado de QR Codes para mesas, com cores personalizáveis e logo.
- **Multi-tenant:** Arquitetura pronta para SaaS (via Clerk Organizations), permitindo múltiplos restaurantes na mesma instância.
- **UI Moderna:** Interface limpa e responsiva (Mobile-first).

### Para o Cliente Final (Cardápio Público)

- **Acesso Rápido:** Escaneie o QR Code e acesse instantaneamente (sem login).
- **PWA (Progressive Web App):** Pode ser instalado no celular como um aplicativo nativo.
- **Performance:** Carregamento ultra-rápido com Next.js e otimização de imagens.
- **Busca e Filtros:** Navegação fluida entre categorias.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes:** [Shadcn/UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Banco de Dados & Storage:** [Supabase](https://supabase.com/)
- **Autenticação:** [Clerk](https://clerk.com/)
- **Deploy:** [Vercel](https://vercel.com/)
- **Linguagem:** TypeScript

## 📦 Como Rodar Localmente

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/SEU_USUARIO/digital-menu.git
   cd digital-menu
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz com:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_SUPABASE_URL=https://...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

4. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

5. **Acesse:** `http://localhost:3000`

## 💎 Modelo de Negócio (SaaS)

Este projeto foi estruturado para ser comercializado como SaaS (Software as a Service):

1. **Self-Service:** O dono do restaurante cria conta (via Clerk), configura o perfil e monta o cardápio sozinho.
2. **Dados Isolados:** O `orgId` do Clerk garante que um restaurante nunca veja os dados do outro.
3. **Escalável:** O banco de dados Supabase e o Storage escalam automaticamente.

---
Desenvolvido com ❤️ por Thiago Russo.
