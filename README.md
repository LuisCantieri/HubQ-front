# 🧠 HubQ – Sistema de Gestão de Quadrinhos

**HubQ** é uma aplicação web full-stack para gerenciamento de inventário de HQs (quadrinhos), com funcionalidades como cadastro, edição, exclusão, movimentações de estoque e histórico de ações.

---

## 📚 Sumário

- [🎯 Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#-tecnologias)
- [📦 Estrutura de Pastas](#-estrutura-de-pastas)
- [🤔 O que o ADMIN pode fazer que o usuário não pode?](#-o-que-o-admin-pode-fazer-que-o-usuário-não-pode)
- [🔐 Autenticação](#-autenticação)
- [📄 Licença](#-licença)

---

## 🎯 Funcionalidades

- Cadastro de usuários com login JWT
- Login e logout com autenticação segura
- CRUD de quadrinhos (HQs)
- Controle de estoque (adicionar/remover HQs)
- Registro de movimentações (ações do usuário)
- Visualização de histórico por HQ
- Painel de controle com gráficos e cards
- Proteção de rotas no front-end

---

## 🛠️ Tecnologias

### Front-end:
- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)
- [React Router DOM](https://reactrouter.com/)
- CSS (sem frameworks)

### Back-end:
- [Java 17+](https://www.oracle.com/java/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT](https://jwt.io/)
- [MySQL](https://www.mysql.com/)
- [JPA/Hibernate](https://hibernate.org/)

---

## 📦 Estrutura de Pastas

### Back-end
Back/
├── src/
│ ├── main/
│ │ ├── java/gestao/quadrinhos/
│ │ │ ├── controllers/
│ │ │ ├── dto/
│ │ │ ├── entities/
│ │ │ ├── repositories/
│ │ │ └── services/
│ │ └── resources/
│ └── application.properties
└── pom.xml


### Front-end
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── App.jsx
├── .env
├── index.html
└── vite.config.js


---
## O que o ADMIN pode fazer que o usuário não pode? 🤔

**O usuário não tem acesso as movimentações e o dashboard geral, não tendo acesso para ver as movimentações realizadas dentro do inventário**

---
## 🔐 Autenticação

- **Login:** envia um `POST` para `/api/auth/login` com `email` e `senha`.
- **Token JWT:** armazenado no `localStorage` e enviado via `Authorization: Bearer`.
- **Proteção de rotas:** controlada no front-end com base na existência do token.

---

## 📄 Licença

Este projeto é livre para fins educacionais. Todos os direitos reservados ao autor.

---

