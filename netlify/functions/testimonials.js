const fs = require('fs');
const path = require('path');

// Caminho para o arquivo de comentários
const commentsPath = path.join(process.cwd(), 'comments.json');

// Função para ler comentários
function readComments() {
  try {
    if (fs.existsSync(commentsPath)) {
      const data = fs.readFileSync(commentsPath, 'utf8');
      return JSON.parse(data);
    }
    return { testimonials: [], pending_testimonials: [] };
  } catch (error) {
    console.error('Erro ao ler comentários:', error);
    return { testimonials: [], pending_testimonials: [] };
  }
}

// Função para escrever comentários
function writeComments(data) {
  try {
    fs.writeFileSync(commentsPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao escrever comentários:', error);
    return false;
  }
}

exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Responder a requisições OPTIONS (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        // Retornar todos os depoimentos
        const data = readComments();
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        };

      case 'POST':
        // Adicionar novo depoimento
        const input = JSON.parse(event.body);
        
        if (!input) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Dados inválidos' })
          };
        }

        const currentData = readComments();
        
        // Criar array para pending_testimonials se não existir
        if (!currentData.pending_testimonials) {
          currentData.pending_testimonials = [];
        }

        // Adicionar aos depoimentos pendentes
        const newTestimonial = {
          id: Date.now(),
          name: input.name || '',
          email: input.email || '',
          rating: parseInt(input.rating) || 5,
          comment: input.comment || '',
          date: new Date().toISOString().split('T')[0],
          approved: false
        };

        currentData.pending_testimonials.push(newTestimonial);

        // Salvar os dados
        const saved = writeComments(currentData);
        
        if (saved) {
          return {
            statusCode: 200,
            headers: {
              ...headers,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              success: true, 
              message: 'Depoimento enviado com sucesso! Aguarde aprovação.',
              id: newTestimonial.id 
            })
          };
        } else {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Erro ao salvar depoimento' })
          };
        }

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Método não permitido' })
        };
    }
  } catch (error) {
    console.error('Erro na function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno do servidor' })
    };
  }
};
