# Project TODO

## Funcionalidades Principais

- [x] Cabeçalho com logo e título "Nutricionista de Bolso"
- [x] Seção de informações do usuário (nome, idade, altura, peso atual, peso objetivo, meta calórica)
- [x] Filtros de período (data inicial e final)
- [x] Gráfico de progresso de consumo calórico diário
- [x] Histórico de alimentos mais consumidos
- [x] Análise dinâmica da Glória (baseada nos dados filtrados)
- [x] Botão fixo no rodapé para contato via WhatsApp
- [x] Dados mockados para demonstração
- [x] Responsividade mobile-first
- [x] Ícones usando lucide-react

## Persistência de Dados com Banco de Dados

- [x] Adicionar feature web-db-user ao projeto
- [x] Criar schema do banco de dados (usuários, consumo diário, alimentos)
- [x] Implementar API para gerenciar dados do usuário
- [x] Implementar API para registrar consumo diário
- [x] Implementar API para gerenciar alimentos
- [x] Atualizar frontend para buscar dados do banco
- [x] Implementar autenticação de usuário
- [x] Adicionar funcionalidade de registro de refeições

## Funcionalidade de Registro de Refeições

- [x] Criar página de registro de refeições
- [x] Implementar busca de alimentos
- [x] Adicionar cálculo automático de calorias
- [x] Popular banco de dados com alimentos comuns
- [x] Adicionar navegação entre páginas
- [x] Atualizar consumo diário automaticamente ao registrar alimento

## Bug Reportado

- [x] Corrigir tela branca no site publicado (https://nutriapp-5acuc4fq.manus.space)

## Sistema de Login e Cadastro Próprio

- [x] Criar tabela de usuários no banco de dados
- [x] Implementar API de cadastro de usuário
- [x] Implementar API de login com email e senha
- [x] Criar página de login
- [x] Criar página de cadastro
- [ ] Integrar autenticação com sessão (PENDENTE - requer ajuste no hook useAuth para reconhecer localStorage)
- [x] Criar perfil padrão ao cadastrar novo usuário

## Bug: Redirecionamento após Login

- [x] Corrigir redirecionamento após login bem-sucedido
- [x] Garantir que useAuth reconheça usuário do localStorage
- [x] Testar fluxo completo: cadastro → login → dashboard

## GitHub

- [x] Criar repositório no GitHub
- [x] Fazer commit inicial
- [x] Push para o repositório remoto

## Documentação

- [x] Criar README.md completo
- [x] Adicionar instruções de instalação
- [x] Documentar configuração do banco de dados
- [x] Adicionar instruções de execução local
