# 🏋️‍♂️ Treinado Lorenski - Personal Trainer & Nutricionista

Site profissional para personal trainer com sistema de depoimentos dinâmicos.

## 🚀 Deploy no Netlify

### Método 1: Deploy via GitHub (Recomendado)

1. **Suba o código para o GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/treinado-lorenski.git
   git push -u origin main
   ```

2. **Conecte ao Netlify**
   - Acesse [netlify.com](https://netlify.com)
   - Clique em "New site from Git"
   - Conecte sua conta GitHub
   - Selecione o repositório
   - Configure:
     - **Build command**: *(deixe vazio)* 
     - **Publish directory**: `.` (root)
   - Clique em "Deploy site"

### Método 2: Deploy via Drag & Drop

1. **Prepare os arquivos**
   - Comprima toda a pasta do projeto em um ZIP
   - OU arraste a pasta diretamente

2. **Upload no Netlify**
   - Acesse [netlify.com/drop](https://netlify.com/drop)
   - Arraste o ZIP ou a pasta
   - O site será deployado automaticamente

## 📁 Estrutura do Projeto

```
treinado-lorenski/
├── index.html              # Página principal
├── depoimento.html         # Formulário de depoimentos
├── comments.json           # Base de dados dos depoimentos
├── netlify.toml           # Configuração do Netlify
├── package.json           # Dependências do projeto
├── src/
│   ├── css/              # Estilos CSS
│   ├── js/               # Scripts JavaScript
│   ├── img/              # Imagens
│   └── php/              # ⚠️ Não usado no Netlify
└── netlify/
    └── functions/
        └── testimonials.js # Function serverless para depoimentos
```

## 🛠️ Funcionalidades

✅ **Sistema de depoimentos dinâmico**
✅ **Design responsivo**
✅ **Formulário de contato**
✅ **Galeria de resultados**
✅ **Navegação suave**
✅ **Otimizado para SEO**

## ⚙️ Configurações Automáticas

O arquivo `netlify.toml` configura automaticamente:

- **Functions**: Endpoints serverless para depoimentos
- **Redirects**: APIs acessíveis via `/api/*`
- **Headers**: Configurações de segurança e cache
- **Deploy**: Publicação automática

## 🔧 Desenvolvimento Local

Para testar localmente com as Netlify Functions:

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Instalar dependências
npm install

# Executar localmente
netlify dev
```

## 📱 URLs após Deploy

- **Site principal**: `https://treinador.netlify.app`
- **API de depoimentos**: `https://treinador.netlify.app/.netlify/functions/testimonials`

## 🎯 Próximos Passos

1. Configure um domínio personalizado no Netlify
2. Adicione variáveis de ambiente se necessário
3. Configure notificações por email para novos depoimentos
4. Implemente sistema de moderação de depoimentos

## 📞 Suporte

Em caso de dúvidas sobre o deploy, consulte:
- [Documentação do Netlify](https://docs.netlify.com)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

---

💪 **Desenvolvido para Treinado Lorenski - Transformando vidas através do fitness!**
