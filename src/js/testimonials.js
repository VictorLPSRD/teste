// Testimonials Manager - Sistema avançado de depoimentos
class TestimonialsManager {
    constructor() {
        console.log('TestimonialsManager: Inicializando...');
        // Usar configurações do arquivo config.js se disponível
        const config = window.TESTIMONIALS_CONFIG || {};
        
        this.testimonials = [];
        this.currentPage = 0;
        this.testimonialsPerPage = config.testimonialsPerPage || 3;
        this.rotationInterval = null;
        this.autoRotateTime = config.autoRotateTime || 8000;
        this.randomizeThreshold = config.randomizeThreshold || 6;
        this.loadingDelay = config.loadingDelay || 500;
        this.messages = config.messages || {
            loading: 'Carregando depoimentos...',
            noTestimonials: 'Nenhum depoimento encontrado.',
            counter: 'depoimentos de clientes satisfeitos'
        };
        
        console.log('TestimonialsManager: Configuração carregada', {
            testimonialsPerPage: this.testimonialsPerPage,
            loadingDelay: this.loadingDelay
        });
        
        this.init();
    }

    async init() {
        console.log('TestimonialsManager: Inicializando sistema...');
        await this.loadTestimonials();
        console.log('TestimonialsManager: Testimonials carregados:', this.testimonials.length);
        this.setupEventListeners();
        this.displayTestimonials();
        this.updateNavigation();
        this.startAutoRotation();
        console.log('TestimonialsManager: Sistema inicializado com sucesso!');
    }

    async loadTestimonials() {
        try {
            console.log('TestimonialsManager: Carregando depoimentos...');
            
            // Detectar se estamos em produção (Netlify) ou desenvolvimento
            const isProduction = window.location.hostname !== 'localhost' && 
                                window.location.hostname !== '127.0.0.1' && 
                                !window.location.hostname.includes('127.0.0.1');
            
            let data = null;
            
            // Só tentar API Netlify se estivermos em produção
            if (isProduction) {
                try {
                    console.log('TestimonialsManager: Tentando carregar da API Netlify...');
                    const apiResponse = await fetch('/.netlify/functions/testimonials');
                    if (apiResponse.ok) {
                        data = await apiResponse.json();
                        console.log('Depoimentos carregados da API Netlify:', data);
                    }
                } catch (apiError) {
                    console.log('API Netlify não disponível:', apiError.message);
                }
            } else {
                console.log('TestimonialsManager: Ambiente local detectado, pulando API Netlify');
            }

            // Se API não funcionar ou estivermos em desenvolvimento, carregar do arquivo JSON
            if (!data) {
                try {
                    console.log('TestimonialsManager: Carregando do arquivo JSON...');
                    const response = await fetch('./comments.json');
                    if (response.ok) {
                        data = await response.json();
                        console.log('Depoimentos carregados do arquivo JSON:', data);
                    } else {
                        throw new Error(`Erro ao carregar comments.json: ${response.status}`);
                    }
                } catch (jsonError) {
                    console.log('Erro ao carregar JSON:', jsonError.message);
                    throw jsonError;
                }
            }

            // Combinar depoimentos aprovados e pendentes
            this.testimonials = [...(data.testimonials || [])];
            
            // Adicionar depoimentos pendentes se existirem
            if (data.pending_testimonials && data.pending_testimonials.length > 0) {
                // Simular aprovação automática dos pendentes (para demonstração)
                const approvedPending = data.pending_testimonials.filter(t => {
                    const daysSinceSubmitted = (Date.now() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24);
                    return daysSinceSubmitted >= 0; // Mostrar imediatamente para demonstração
                });
                this.testimonials = [...this.testimonials, ...approvedPending];
            }

            // Carregar também do localStorage como backup
            const localPendingTestimonials = JSON.parse(localStorage.getItem('pendingTestimonials')) || [];
            if (localPendingTestimonials.length > 0) {
                const approvedLocal = localPendingTestimonials.filter(t => {
                    const daysSinceSubmitted = (Date.now() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24);
                    return daysSinceSubmitted >= 0; // Mostrar imediatamente para demonstração
                });
                this.testimonials = [...this.testimonials, ...approvedLocal];
            }

            // Se temos muitos depoimentos, randomizar a ordem
            if (this.testimonials.length > this.randomizeThreshold) {
                this.shuffleTestimonials();
            }

        } catch (error) {
            console.error('Erro ao carregar depoimentos:', error);
            console.log('TestimonialsManager: Carregando depoimentos de fallback...');
            this.loadFallbackTestimonials();
        }
    }

    loadFallbackTestimonials() {
        console.log('TestimonialsManager: Carregando depoimentos de fallback...');
        // Depoimentos de fallback caso o JSON não carregue
        this.testimonials = [
            {
                id: 1,
                name: "Maria Silva",
                avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'><rect width='50' height='50' fill='%231abc9c'/><text x='50%25' y='50%25' font-size='20' text-anchor='middle' dy='.3em' fill='white'>M</text></svg>",
                rating: 5,
                comment: "Em 6 meses perdi 15kg e ganhei muito mais disposição. O Lorenski é um profissional excepcional!",
                result: "Perdeu 15kg em 6 meses",
                date: "2025-08-15",
                approved: true
            },
            {
                id: 2,
                name: "João Santos",
                avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'><rect width='50' height='50' fill='%232c5aa0'/><text x='50%25' y='50%25' font-size='20' text-anchor='middle' dy='.3em' fill='white'>J</text></svg>",
                rating: 5,
                comment: "Nunca imaginei que conseguiria ganhar massa muscular. O treino e a dieta foram fundamentais!",
                result: "Ganhou 8kg de massa muscular",
                date: "2025-08-20",
                approved: true
            },
            {
                id: 3,
                name: "Ana Costa",
                avatar: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'><rect width='50' height='50' fill='%2328a745'/><text x='50%25' y='50%25' font-size='20' text-anchor='middle' dy='.3em' fill='white'>A</text></svg>",
                rating: 5,
                comment: "Método incrível! Consegui melhorar minha saúde e autoestima. Recomendo para todos!",
                result: "Transformação completa",
                date: "2025-08-25",
                approved: true
            }
        ];
        console.log('TestimonialsManager: Fallback carregado com', this.testimonials.length, 'depoimentos');
    }

    shuffleTestimonials() {
        for (let i = this.testimonials.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.testimonials[i], this.testimonials[j]] = [this.testimonials[j], this.testimonials[i]];
        }
    }

    setupEventListeners() {
        // Botão para adicionar depoimento
        const addBtn = document.getElementById('addTestimonialBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                window.open('depoimento.html', '_blank');
            });
        }

        // Navegação
        const prevBtn = document.getElementById('prevTestimonials');
        const nextBtn = document.getElementById('nextTestimonials');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousPage();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextPage();
            });
        }

        // Parar rotação automática quando usuário interage
        const testimonialsSection = document.getElementById('testimonials');
        if (testimonialsSection) {
            testimonialsSection.addEventListener('mouseenter', () => {
                this.stopAutoRotation();
            });

            testimonialsSection.addEventListener('mouseleave', () => {
                this.startAutoRotation();
            });
        }
    }

    displayTestimonials() {
        const grid = document.getElementById('testimonialsGrid');
        const counter = document.getElementById('testimonialCounter');
        
        if (!grid) return;

        // Mostrar loading
        grid.innerHTML = `<div class="testimonials-loading"><i class="fas fa-spinner"></i><p>${this.messages.loading}</p></div>`;

        setTimeout(() => {
            const start = this.currentPage * this.testimonialsPerPage;
            const end = start + this.testimonialsPerPage;
            const currentTestimonials = this.testimonials.slice(start, end);

            grid.innerHTML = '';

            if (currentTestimonials.length === 0) {
                grid.innerHTML = `<div class="testimonials-loading"><p>${this.messages.noTestimonials}</p></div>`;
                return;
            }

            currentTestimonials.forEach((testimonial, index) => {
                const card = this.createTestimonialCard(testimonial, index);
                grid.appendChild(card);
            });

            // Atualizar contador
            if (counter) {
                counter.textContent = `${this.testimonials.length} ${this.messages.counter}`;
            }

            // Calcular e exibir média de satisfação
            this.updateSatisfactionScore();
        }, this.loadingDelay);
    }

    createTestimonialCard(testimonial, index) {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
        const formattedDate = new Date(testimonial.date).toLocaleDateString('pt-BR');
        
        // Avatar com fallback melhorado
        const avatarUrl = testimonial.avatar || `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'><rect width='50' height='50' fill='%23ddd'/><text x='50%25' y='50%25' font-size='16' text-anchor='middle' dy='.3em' fill='%23999'>${testimonial.name.charAt(0)}</text></svg>`;

        card.innerHTML = `
            <div class="testimonial-header">
                <img src="${avatarUrl}" 
                     alt="${testimonial.name}" 
                     class="testimonial-avatar"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'50\\' height=\\'50\\' viewBox=\\'0 0 50 50\\'><rect width=\\'50\\' height=\\'50\\' fill=\\'%23ddd\\'/><text x=\\'50%25\\' y=\\'50%25\\' font-size=\\'16\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\'>${testimonial.name.charAt(0)}</text></svg>'">
                <div class="testimonial-info">
                    <h4>${testimonial.name}</h4>
                    <div class="testimonial-date">${formattedDate}</div>
                </div>
            </div>
            <div class="testimonial-content">
                <div class="stars">
                    ${Array.from({length: testimonial.rating}, () => '<i class="fas fa-star"></i>').join('')}
                    ${Array.from({length: 5 - testimonial.rating}, () => '<i class="far fa-star"></i>').join('')}
                </div>
                <p>"${testimonial.comment}"</p>
                <div class="testimonial-author">
                    <strong>${testimonial.name}</strong>
                    <span>${testimonial.result}</span>
                </div>
            </div>
        `;

        return card;
    }

    updateNavigation() {
        const totalPages = Math.ceil(this.testimonials.length / this.testimonialsPerPage);
        const prevBtn = document.getElementById('prevTestimonials');
        const nextBtn = document.getElementById('nextTestimonials');
        const dotsContainer = document.getElementById('testimonialsDots');

        // Atualizar botões
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 0;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages - 1;
        }

        // Criar dots de navegação
        if (dotsContainer && totalPages > 1) {
            dotsContainer.innerHTML = '';
            
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('div');
                dot.className = `dot ${i === this.currentPage ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    this.currentPage = i;
                    this.displayTestimonials();
                    this.updateNavigation();
                });
                dotsContainer.appendChild(dot);
            }
        }
    }

    updateSatisfactionScore() {
        const scoreElement = document.querySelector('.score-number');
        if (scoreElement && this.testimonials.length > 0) {
            const averageRating = this.testimonials.reduce((sum, t) => sum + t.rating, 0) / this.testimonials.length;
            const score = (averageRating * 2).toFixed(1); // Converter para escala de 10
            
            // Animar o número
            this.animateNumber(scoreElement, parseFloat(scoreElement.textContent) || 0, parseFloat(score));
        }
    }

    animateNumber(element, start, end) {
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * progress;
            element.textContent = current.toFixed(1);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    nextPage() {
        const totalPages = Math.ceil(this.testimonials.length / this.testimonialsPerPage);
        
        if (this.currentPage < totalPages - 1) {
            this.currentPage++;
        } else {
            this.currentPage = 0; // Volta para o início
        }
        
        this.displayTestimonials();
        this.updateNavigation();
    }

    previousPage() {
        const totalPages = Math.ceil(this.testimonials.length / this.testimonialsPerPage);
        
        if (this.currentPage > 0) {
            this.currentPage--;
        } else {
            this.currentPage = totalPages - 1; // Vai para o final
        }
        
        this.displayTestimonials();
        this.updateNavigation();
    }

    startAutoRotation() {
        this.stopAutoRotation(); // Para qualquer rotação existente
        
        if (this.testimonials.length > this.testimonialsPerPage) {
            this.rotationInterval = setInterval(() => {
                this.nextPage();
            }, this.autoRotateTime);
        }
    }

    stopAutoRotation() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
        }
    }

    // Método público para adicionar novo depoimento
    addTestimonial(testimonial) {
        this.testimonials.unshift(testimonial); // Adiciona no início
        
        // Se temos muitos depoimentos, embaralhar novamente
        if (this.testimonials.length > 10) {
            this.shuffleTestimonials();
        }
        
        this.currentPage = 0; // Volta para a primeira página
        this.displayTestimonials();
        this.updateNavigation();
    }

    // Método para recarregar depoimentos (útil para atualizações em tempo real)
    async reload() {
        await this.loadTestimonials();
        this.displayTestimonials();
        this.updateNavigation();
    }
}

// Inicialização automática quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que todos os elementos estejam carregados
    setTimeout(() => {
        console.log('Auto-inicializando TestimonialsManager...');
        if (document.getElementById('testimonialsGrid')) {
            if (!window.testimonialsManager) {
                window.testimonialsManager = new TestimonialsManager();
                console.log('TestimonialsManager inicializado automaticamente!');
            }
        } else {
            console.log('Elemento testimonialsGrid não encontrado, aguardando...');
            // Tentar novamente após mais tempo
            setTimeout(() => {
                if (document.getElementById('testimonialsGrid') && !window.testimonialsManager) {
                    window.testimonialsManager = new TestimonialsManager();
                    console.log('TestimonialsManager inicializado com delay!');
                }
            }, 1000);
        }
    }, 500);
});

// Verificar por novos depoimentos apenas em produção e com menor frequência
if (window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1' && 
    !window.location.hostname.includes('127.0.0.1')) {
    setInterval(() => {
        if (window.testimonialsManager) {
            console.log('Recarregando depoimentos...');
            window.testimonialsManager.reload();
        }
    }, 120000); // A cada 2 minutos ao invés de 30 segundos
}
