# 🥗 Nutricionista de Bolso

Aplicativo web de acompanhamento nutricional que permite aos usuários registrar refeições, monitorar consumo calórico diário e receber análises personalizadas baseadas em suas metas nutricionais.

## 📋 Funcionalidades

O **Nutricionista de Bolso** oferece uma experiência completa de acompanhamento nutricional com as seguintes funcionalidades principais:

### Dashboard Personalizado

O dashboard apresenta informações detalhadas do perfil do usuário, incluindo idade, altura, peso atual e peso objetivo. A meta calórica diária é exibida de forma destacada, permitindo que o usuário acompanhe seu progresso em tempo real. O sistema calcula automaticamente o IMC (Índice de Massa Corporal) e fornece feedback visual sobre o estado nutricional.

### Sistema de Autenticação

O aplicativo possui sistema completo de autenticação com cadastro e login utilizando email e senha. As senhas são armazenadas de forma segura utilizando hash bcrypt, garantindo a proteção dos dados dos usuários. Após o login, o sistema mantém a sessão ativa através de localStorage, permitindo navegação fluida entre as páginas.

### Registro de Refeições

A funcionalidade de registro permite que usuários adicionem alimentos consumidos durante o dia através de uma interface intuitiva. O sistema conta com busca em tempo real entre 45 alimentos brasileiros pré-cadastrados, incluindo arroz, feijão, carnes, frutas, verduras e legumes. Para cada alimento, o usuário pode especificar a quantidade em gramas, e o sistema calcula automaticamente as calorias totais da refeição.

### Gráfico de Progresso

O gráfico de barras visualiza o consumo calórico diário ao longo do período selecionado. As barras são coloridas dinamicamente: verde quando o consumo está dentro da meta, e vermelho quando excede o limite estabelecido. Esta representação visual facilita a identificação de padrões alimentares e ajuda na tomada de decisões nutricionais.

### Ranking de Alimentos

O sistema analisa o histórico de consumo e apresenta um ranking dos alimentos mais consumidos no período filtrado. Esta funcionalidade ajuda o usuário a identificar seus hábitos alimentares predominantes e fazer ajustes quando necessário.

### Análise Inteligente da Glória

A análise personalizada fornece feedback contextualizado baseado nos dados do usuário. O sistema avalia o percentual de dias em que a meta foi cumprida e oferece sugestões práticas para otimização da dieta. A análise considera fatores como consistência, média de consumo e proximidade do peso objetivo.

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando tecnologias modernas e robustas para garantir performance, escalabilidade e manutenibilidade.

| Categoria | Tecnologia | Versão | Descrição |
|-----------|-----------|--------|-----------|
| **Frontend** | React | 19.x | Biblioteca para construção de interfaces |
| | TypeScript | 5.x | Superset JavaScript com tipagem estática |
| | Tailwind CSS | 4.x | Framework CSS utility-first |
| | Wouter | - | Roteamento leve para React |
| | shadcn/ui | - | Componentes UI reutilizáveis |
| | Lucide React | - | Biblioteca de ícones |
| **Backend** | Node.js | 22.x | Runtime JavaScript server-side |
| | tRPC | - | Framework type-safe para APIs |
| | Drizzle ORM | - | ORM TypeScript-first |
| **Banco de Dados** | MySQL | - | Sistema de gerenciamento de banco de dados |
| **Autenticação** | bcryptjs | - | Biblioteca para hash de senhas |
| **Gerenciamento** | pnpm | - | Gerenciador de pacotes rápido |

## 📦 Pré-requisitos

Antes de iniciar a instalação, certifique-se de que seu ambiente possui os seguintes requisitos instalados:

- **Node.js** versão 18.x ou superior
- **pnpm** versão 8.x ou superior (pode ser instalado via `npm install -g pnpm`)
- **MySQL** versão 8.x ou superior
- **Git** para clonar o repositório

## 🚀 Instalação

Siga os passos abaixo para configurar o projeto em seu ambiente local.

### 1. Clonar o Repositório

```bash
git clone https://github.com/davidjcribeiro-droid/nutricionista-de-bolso.git
cd nutricionista-de-bolso
```

### 2. Instalar Dependências

O projeto utiliza pnpm como gerenciador de pacotes. Execute o comando abaixo para instalar todas as dependências necessárias:

```bash
pnpm install
```

Este comando instalará tanto as dependências do frontend quanto do backend, configurando o ambiente completo para desenvolvimento.

### 3. Configurar Banco de Dados

O aplicativo utiliza MySQL como sistema de gerenciamento de banco de dados. Siga as etapas abaixo para configurar corretamente.

#### 3.1. Criar Banco de Dados

Acesse o MySQL através do terminal ou de uma ferramenta gráfica como MySQL Workbench e execute o seguinte comando:

```sql
CREATE DATABASE nutricionista_de_bolso CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 3.2. Configurar Variáveis de Ambiente

O projeto já possui variáveis de ambiente pré-configuradas pelo sistema Manus. No entanto, se você estiver executando localmente fora do ambiente Manus, será necessário criar um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL=mysql://usuario:senha@localhost:3306/nutricionista_de_bolso

# Autenticação
JWT_SECRET=sua_chave_secreta_aqui

# Aplicação
VITE_APP_TITLE=Nutricionista de Bolso
VITE_APP_LOGO=/logo.svg
```

Substitua `usuario` e `senha` pelas credenciais do seu banco de dados MySQL. A variável `JWT_SECRET` deve conter uma string aleatória e segura para geração de tokens.

#### 3.3. Executar Migrações

Após configurar as variáveis de ambiente, execute o comando para criar as tabelas no banco de dados:

```bash
pnpm db:push
```

Este comando utiliza o Drizzle ORM para sincronizar o schema definido no código com o banco de dados MySQL, criando automaticamente as tabelas `users`, `profiles`, `daily_consumption`, `foods` e `food_consumption`.

#### 3.4. Popular Banco com Alimentos

O projeto inclui um script para popular o banco de dados com 45 alimentos brasileiros comuns. Execute:

```bash
pnpm tsx scripts/seed-foods.mjs
```

Este script adicionará alimentos como arroz, feijão, frango, frutas, verduras e legumes, cada um com suas respectivas calorias por 100g e ícones emoji.

## ▶️ Executando o Projeto

Com todas as dependências instaladas e o banco de dados configurado, você pode iniciar o servidor de desenvolvimento.

### Modo Desenvolvimento

Execute o comando abaixo para iniciar o servidor de desenvolvimento com hot-reload:

```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`. O servidor backend roda na mesma porta, utilizando tRPC para comunicação type-safe entre frontend e backend.

### Modo Produção

Para gerar a build de produção e executar o aplicativo otimizado:

```bash
pnpm build
pnpm start
```

A build de produção minifica o código, otimiza assets e prepara o aplicativo para deploy em ambientes de produção.

## 📂 Estrutura do Projeto

A organização do código segue uma estrutura modular que separa claramente as responsabilidades de cada camada da aplicação.

```
nutricionista-de-bolso/
├── client/                 # Frontend React
│   ├── public/            # Assets estáticos
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   │   ├── Home.tsx           # Dashboard principal
│   │   │   ├── Login.tsx          # Página de login
│   │   │   ├── Register.tsx       # Página de cadastro
│   │   │   └── AddMeal.tsx        # Registro de refeições
│   │   ├── components/    # Componentes reutilizáveis
│   │   │   └── ui/        # Componentes shadcn/ui
│   │   ├── contexts/      # Contextos React
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilitários
│   │   ├── _core/         # Funcionalidades core
│   │   │   └── hooks/
│   │   │       └── useAuth.ts     # Hook de autenticação
│   │   ├── App.tsx        # Componente raiz
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Estilos globais
├── server/                # Backend Node.js
│   ├── routers.ts         # Rotas tRPC
│   ├── db.ts              # Funções de banco de dados
│   ├── auth.ts            # Lógica de autenticação
│   └── _core/             # Core do servidor
├── shared/                # Código compartilhado
│   └── const.ts           # Constantes
├── drizzle/               # Configuração Drizzle ORM
│   └── schema.ts          # Schema do banco de dados
├── scripts/               # Scripts utilitários
│   └── seed-foods.mjs     # Script para popular alimentos
├── package.json           # Dependências do projeto
├── tsconfig.json          # Configuração TypeScript
├── tailwind.config.ts     # Configuração Tailwind CSS
└── README.md              # Documentação
```

## 🗄️ Schema do Banco de Dados

O banco de dados foi projetado para garantir integridade referencial e eficiência nas consultas. Abaixo está a descrição detalhada de cada tabela.

### Tabela: users

Armazena informações de autenticação dos usuários.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT (PK) | Identificador único do usuário |
| name | VARCHAR(255) | Nome completo do usuário |
| email | VARCHAR(255) | Email único para login |
| passwordHash | VARCHAR(255) | Senha criptografada com bcrypt |
| loginMethod | VARCHAR(50) | Método de login (local/oauth) |
| role | ENUM | Papel do usuário (user/admin) |
| createdAt | DATETIME | Data de criação da conta |
| updatedAt | DATETIME | Data da última atualização |
| lastSignedIn | DATETIME | Data do último login |

### Tabela: profiles

Contém dados nutricionais e metas dos usuários.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT (PK) | Identificador único do perfil |
| userId | INT (FK) | Referência ao usuário |
| age | INT | Idade em anos |
| height | INT | Altura em centímetros |
| currentWeight | INT | Peso atual em decigramas (720 = 72.0kg) |
| targetWeight | INT | Peso objetivo em decigramas |
| dailyCalorieGoal | INT | Meta diária de calorias |
| createdAt | DATETIME | Data de criação do perfil |
| updatedAt | DATETIME | Data da última atualização |

### Tabela: daily_consumption

Registra o consumo calórico total de cada dia.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT (PK) | Identificador único do registro |
| userId | INT (FK) | Referência ao usuário |
| date | DATE | Data do consumo |
| consumed | INT | Total de calorias consumidas |
| createdAt | DATETIME | Data de criação do registro |
| updatedAt | DATETIME | Data da última atualização |

### Tabela: foods

Catálogo de alimentos disponíveis.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT (PK) | Identificador único do alimento |
| name | VARCHAR(255) | Nome do alimento |
| icon | VARCHAR(10) | Emoji representativo |
| caloriesPer100g | INT | Calorias por 100 gramas |
| createdAt | DATETIME | Data de cadastro |

### Tabela: food_consumption

Registra cada alimento consumido individualmente.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT (PK) | Identificador único do registro |
| userId | INT (FK) | Referência ao usuário |
| foodId | INT (FK) | Referência ao alimento |
| date | DATE | Data do consumo |
| quantity | INT | Quantidade em gramas |
| calories | INT | Calorias totais do item |
| createdAt | DATETIME | Data de criação do registro |

## 🔐 Autenticação e Segurança

O sistema implementa práticas de segurança modernas para proteger os dados dos usuários.

### Hash de Senhas

Todas as senhas são processadas através do algoritmo bcrypt com salt rounds configurado para 10, garantindo que mesmo em caso de vazamento do banco de dados, as senhas originais permaneçam protegidas. O bcrypt é resistente a ataques de força bruta devido ao seu design computacionalmente intensivo.

### Armazenamento de Sessão

Após autenticação bem-sucedida, os dados do usuário são armazenados no localStorage do navegador. Esta abordagem permite que o aplicativo funcione como Progressive Web App (PWA) e mantém a sessão ativa mesmo após fechamento do navegador. O hook `useAuth` verifica automaticamente a validade da sessão em cada carregamento de página.

### Validação de Dados

Todas as entradas de usuário passam por validação tanto no frontend quanto no backend. O tRPC garante type-safety em toda a comunicação, prevenindo erros de tipo e injeção de dados maliciosos. Os schemas Drizzle ORM validam dados antes de persistir no banco.

## 🎨 Design e UX

O design do aplicativo foi cuidadosamente planejado para oferecer experiência intuitiva e agradável.

### Paleta de Cores

A paleta principal utiliza tons de laranja (#f97316) que transmitem energia e vitalidade, alinhados com o tema de nutrição e saúde. O esquema de cores inclui:

- **Primary**: Laranja vibrante para elementos principais e CTAs
- **Success**: Verde para indicadores positivos (meta atingida)
- **Warning**: Vermelho para alertas (meta excedida)
- **Background**: Tons neutros de bege e cinza claro para conforto visual

### Responsividade

O layout foi desenvolvido com abordagem mobile-first, garantindo experiência otimizada em dispositivos móveis. A largura máxima do container principal é limitada a 448px (max-w-md), simulando interface de aplicativo móvel mesmo em telas maiores. Todos os componentes são totalmente responsivos e adaptam-se automaticamente ao tamanho da tela.

### Componentes UI

O projeto utiliza componentes do shadcn/ui, uma coleção de componentes React acessíveis e customizáveis. Os componentes incluem botões, inputs, cards, toasts e outros elementos que seguem as melhores práticas de acessibilidade (WCAG 2.1).

## 🧪 Testando o Aplicativo

Para testar todas as funcionalidades, siga o fluxo abaixo:

### 1. Criar Nova Conta

Acesse a página de cadastro através do link "Cadastre-se" na tela de login. Preencha os campos obrigatórios (nome, email e senha) e clique em "Criar Conta". O sistema criará automaticamente um perfil padrão com valores iniciais que podem ser editados posteriormente.

### 2. Fazer Login

Utilize as credenciais criadas para fazer login. O sistema validará email e senha, e em caso de sucesso, redirecionará para o dashboard principal.

### 3. Registrar Refeição

Clique no botão flutuante laranja com ícone "+" no canto inferior direito. Na tela de registro, selecione a data da refeição, busque alimentos pelo nome, ajuste as quantidades em gramas e clique em "Salvar Refeição". O sistema calculará automaticamente as calorias totais e atualizará o dashboard.

### 4. Visualizar Progresso

No dashboard, utilize os filtros de período para visualizar dados de diferentes intervalos. O gráfico de barras mostrará o consumo diário, o ranking exibirá os alimentos mais consumidos, e a análise da Glória fornecerá feedback personalizado.

## 🚀 Deploy

O aplicativo pode ser facilmente implantado em diversas plataformas de hospedagem.

### Vercel (Recomendado)

A Vercel oferece integração nativa com projetos React e Node.js, tornando o deploy extremamente simples:

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. A Vercel detectará automaticamente as configurações e fará o build
4. O aplicativo estará disponível em um domínio `.vercel.app`

### Outras Plataformas

O projeto também é compatível com Netlify, Railway, Render e outras plataformas que suportam aplicações Node.js full-stack. Certifique-se de configurar corretamente as variáveis de ambiente e o banco de dados MySQL em produção.

## 📝 Próximas Funcionalidades

O roadmap do projeto inclui as seguintes melhorias planejadas:

- **Botão de Logout**: Implementar funcionalidade para usuário sair da conta com limpeza segura do localStorage
- **Edição de Perfil**: Permitir atualização de dados pessoais e metas nutricionais diretamente no aplicativo
- **Histórico de Peso**: Adicionar funcionalidade para registrar peso diariamente e visualizar evolução em gráfico de linha
- **Cadastro de Alimentos Personalizados**: Permitir que usuários criem alimentos customizados quando não encontrarem na base
- **Exportação de Relatórios**: Gerar relatórios em PDF com análise detalhada do período selecionado
- **Notificações Push**: Lembretes para registrar refeições e acompanhar progresso
- **Integração com Wearables**: Sincronização com dispositivos como smartwatches para dados mais precisos

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você deseja contribuir com o projeto, siga os passos abaixo:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request descrevendo suas alterações

Certifique-se de seguir os padrões de código do projeto e adicionar testes quando aplicável.

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Desenvolvido por **David Ribeiro** ([@davidjcribeiro-droid](https://github.com/davidjcribeiro-droid))

## 📧 Contato

Para dúvidas, sugestões ou feedback, entre em contato através do GitHub ou abra uma issue no repositório.

---

**Nutricionista de Bolso** - Sua saúde nutricional na palma da mão! 🥗✨
