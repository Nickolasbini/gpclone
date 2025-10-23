# GTClone - Seu Próprio ChatGPT (Backend Seguro)

![Status: Em Desenvolvimento - Backend Concluído](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow.svg)
![Tecnologias: Node.js, Express, OpenRouter](https://img.shields.io/badge/Tecnologias-Node.js%20%7C%20OpenRouter-blue.svg)

O **GTClone** é um projeto de estudo e demonstração de arquitetura Full Stack de Inteligência Artificial, criado como uma série de tutoriais no YouTube (link em breve!).

Esta fase inicial foca na construção de um **Backend seguro e robusto** capaz de se comunicar com diversos modelos de LLM (Large Language Models) através da API unificada do OpenRouter.

## Funcionalidades Atuais (Backend)

* **Comunicação Segura:** Endpoint `POST` para receber o histórico de mensagens do Frontend.
* **Integração com OpenRouter:** Faz requisições à API de `chat/completions`.
* **Segurança de Chave:** Utiliza o pacote `dotenv` para armazenar a chave de API (Token) como variável de ambiente, garantindo que ela nunca seja exposta no Frontend.
* **Histórico de Conversa:** Envia o histórico completo (`system` + `user` + `assistant` messages) para manter o contexto da conversa.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* [Conta no OpenRouter](https://openrouter.ai/) (para obter sua chave de API)

## Configuração e Instalação

Siga os passos para colocar o servidor Node.js em funcionamento.

### 1. Clonar o Repositório

```bash
git clone [https://www.youtube.com/watch?v=xtwls2XmJUI](https://www.youtube.com/watch?v=xtwls2XmJUI)
cd gtclone
```

### 2. Instalar Dependências

Este projeto utiliza express, cors, dotenv e node-fetch.
Bash

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo na raiz do projeto chamado .env e adicione sua chave de API do OpenRouter:

### Substitua 'sk-xxxxxxxxxxxx' pela sua chave real do OpenRouter
```bash
OPENROUTER_API_KEY="SUA_CHAVE_AQUI"
```

### 4. Iniciar o Servidor

Execute o script server.js (o seu backend) com o Node.js:
Bash

node server.js

Se tudo estiver correto, você verá a mensagem: 🚀 Servidor rodando em http://localhost:3000

### Teste o Endpoint (POST)

Como a rota utiliza o método POST e espera um corpo JSON, você deve usar ferramentas como Postman, Insomnia ou Thunder Client para testar o endpoint:

#### Método: POST

#### URL: http://localhost:3000/chat-completion

#### Body (raw JSON):
```bash
{
    "history": [
        { "role": "system", "content": "Você é um assistente de código conciso." },
        { "role": "user", "content": "Como declarar uma função em JavaScript?" }
    ]
}
```
