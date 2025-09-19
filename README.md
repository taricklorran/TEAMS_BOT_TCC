# Teams AI Bot

Este é um bot para Microsoft Teams construído com Node.js, TypeScript e o Microsoft Bot Framework. O bot é projetado para interagir com usuários, processar suas perguntas através de um agente de IA externo e dar as boas-vindas a novos membros em um canal.

## Funcionalidades

- **Processamento de Mensagens**: Ouve as mensagens em que é mencionado, extrai a pergunta do usuário e a processa.
- **Integração com IA**: Envia a pergunta do usuário para um agente de IA externo para obter uma resposta inteligente.
- **Feedback ao Usuário**: Envia mensagens de "processando" e indicadores de "digitando" para manter o usuário informado.
- **Cartão de Boas-Vindas**: Envia um Cartão Adaptável de boas-vindas quando um novo membro é adicionado ao chat.
- **Desenvolvimento Moderno**: Construído com TypeScript para um código mais robusto e escalável.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/)

## Configuração

Antes de iniciar o bot, você precisa configurar as variáveis de ambiente.

1.  Crie um arquivo chamado `.env` na raiz do projeto.
2.  Copie o conteúdo do exemplo abaixo para o seu arquivo `.env` e preencha com suas credenciais do Microsoft Bot Framework e a URL da sua API.

```env
# Credenciais do Aplicativo Bot da Microsoft
MicrosoftAppId=""
MicrosoftAppPassword=""
PORT=3978
```

## Clonando o Repositório

Para clonar este repositório para a sua máquina local, execute o seguinte comando:

```bash
git clone <https://github.com/taricklorran/TEAMS_BOT_TCC.git>
```

Substitua `<https://github.com/taricklorran/TEAMS_BOT_TCC.git>` pela URL do repositório Git.

## Instalação

Para instalar as dependências do projeto, execute o seguinte comando no terminal:

```bash
npm install
```

## Como Executar

Você pode iniciar o bot de duas maneiras:

**1. Para desenvolvimento (com recarregamento automático):**

Este comando utiliza o `nodemon` para reiniciar o bot automaticamente sempre que um arquivo TypeScript for alterado.

```bash
npm run dev
```

**2. Para produção:**

Este comando inicia o bot usando `ts-node`.

```bash
npm start
```

Após a inicialização, o bot estará pronto para ser conectado a um canal do Microsoft Teams através de um serviço de túnel como o [ngrok](https://ngrok.com/).