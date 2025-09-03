// Configurações do Sistema de Depoimentos
const TESTIMONIALS_CONFIG = {
    // Configurações de Exibição
    testimonialsPerPage: 3,           // Quantos depoimentos exibir por vez
    autoRotateTime: 8000,             // Tempo para rotação automática (ms)
    randomizeThreshold: 6,            // Embaralhar quando tiver mais que X depoimentos
    animationDelay: 100,              // Delay entre animações de cards (ms)
    
    // Configurações de Carregamento
    loadingDelay: 500,                // Delay do loading (ms)
    reloadInterval: 30000,            // Intervalo para recarregar depoimentos (ms)
    
    // Configurações de Aprovação Automática
    autoApprovalDays: 1,              // Dias para aprovação automática
    
    // URLs e Endpoints
    apiEndpoint: 'src/php/api.php',           // Endpoint da API (se usando PHP)
    commentsFile: 'comments.json',    // Arquivo JSON de depoimentos
    
    // Configurações Visuais
    showAvatars: true,                // Mostrar fotos dos clientes
    showDates: true,                  // Mostrar datas dos depoimentos
    showNavigation: true,             // Mostrar navegação
    showDots: true,                   // Mostrar indicadores
    
    // Configurações de WhatsApp
    whatsappNumber: '5549991960816',  // Número do WhatsApp (sem + e com código do país)
    
    // Mensagens Padrão
    messages: {
        loading: 'Carregando depoimentos...',
        noTestimonials: 'Nenhum depoimento encontrado.',
        counter: 'depoimentos de clientes satisfeitos',
        success: 'Seu depoimento foi enviado com sucesso! Obrigado por compartilhar sua experiência.',
        error: 'Erro ao enviar depoimento. Tente novamente.'
    }
};

// Exportar configurações para uso global
if (typeof window !== 'undefined') {
    window.TESTIMONIALS_CONFIG = TESTIMONIALS_CONFIG;
}
