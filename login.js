document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. CONSTANTES E LÓGICA GERAL (AUTENTICAÇÃO)
    // ----------------------------------------------------
    const logoutButton = document.getElementById('logoutBtn');
    
    // Contas Válidas pré-existentes e fixas
    let validUsers = {
        // Credenciais solicitadas validadas:
        "funcionario@email.com": { senha: "funcionario123", tipo: "funcionario" },
        "cliente@email.com": { senha: "cliente123", tipo: "cliente" }
    };
    
    // Carrega contas salvas (novos cadastros) e mescla com as contas pré-definidas.
    const storedUsers = localStorage.getItem('storedUsers');
    if (storedUsers) {
        try {
            const parsedUsers = JSON.parse(storedUsers);
            // Mescla: Usuários salvos complementam/atualizam a lista de validUsers
            validUsers = { ...validUsers, ...parsedUsers };
        } catch (e) {
            console.error("Erro ao carregar usuários do localStorage:", e);
        }
    }

    // Função de Logout
    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
        alert('Você saiu da sua conta.');
        // Verifica se a página atual é 'eventos.html' para redirecionar corretamente
        if (window.location.pathname.endsWith('eventos.html')) {
            window.location.href = 'index.html';
        } else {
            window.location.href = 'login.html';
        }
    };

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    // ----------------------------------------------------
    // 2. LÓGICA DE LOGIN (Página login.html)
    // ----------------------------------------------------
    const loginForm = document.getElementById('loginForm') || document.querySelector('.login-form');

    if (loginForm && window.location.pathname.endsWith('login.html')) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('email').value.trim();
            const passwordInput = document.getElementById('senha').value.trim();
            
            const user = validUsers[emailInput];

            // 1. Verifica se o usuário existe E se a senha confere
            if (user && user.senha === passwordInput) {
                
                // Login VÁLIDO: Armazena o email e o tipo de usuário
                localStorage.setItem('userEmail', emailInput);
                localStorage.setItem('userType', user.tipo);

                alert(`Login bem-sucedido como ${user.tipo}!`);
                
                // 2. Redirecionamento Condicional
                if (user.tipo === 'funcionario') {
                    window.location.href = 'eventos.html'; 
                } else {
                    window.location.href = 'index.html'; 
                }
                
            } else {
                // Login INVÁLIDO: Remove qualquer estado anterior
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userType');
                alert('Email ou senha incorretos. Tente novamente.');
            }
        });
    }

    // ----------------------------------------------------
    // 3. LÓGICA DE CADASTRO (Página cadastro.html)
    // ----------------------------------------------------
    const registerForm = document.getElementById('registerForm') || document.querySelector('.register-form'); 

    if (registerForm && window.location.pathname.endsWith('cadastro.html')) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('regEmail').value.trim();
            const senha = document.getElementById('regSenha').value.trim();
            const confirmaSenha = document.getElementById('regConfirmaSenha').value.trim();

            if (senha !== confirmaSenha) {
                alert('As senhas não coincidem. Tente novamente.');
                return;
            }
            
            if (validUsers[email]) {
                alert('Este email já está cadastrado. Tente fazer login.');
                return;
            }

            // CRIAÇÃO DO NOVO USUÁRIO (Cliente por padrão)
            const newUser = {
                senha: senha,
                tipo: "cliente" 
            };
            
            validUsers[email] = newUser;
            
            // SALVA a lista ATUALIZADA no localStorage
            localStorage.setItem('storedUsers', JSON.stringify(validUsers));

            // Define o estado de login para o novo usuário
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userType', 'cliente');

            alert('Cadastro realizado com sucesso! Você será redirecionado para a página inicial.');
            window.location.href = 'index.html'; 
        });
    }

    // ----------------------------------------------------
    // 4. LÓGICA DE EVENTOS (eventos.html) - CORRIGIDA
    // ----------------------------------------------------
    if (window.location.pathname.endsWith('eventos.html')) {
        
        const userEmail = localStorage.getItem('userEmail');
        const userType = localStorage.getItem('userType');
        const isFuncionario = userType === 'funcionario';
        
        // Redirecionamento de segurança para eventos.html
        if (!isFuncionario) {
            // Se o usuário não for funcionário e estiver em eventos.html, redireciona para index.
            alert('Acesso negado. Esta página é restrita a funcionários.');
            window.location.href = 'index.html'; 
            return; 
        }

        // Dados Simulados dos Eventos para Dashboard
        const eventData = {
            'Bio Dementia': {
                sales: 380,
                price: 25,
                capacity: 400,
                link: 'https://www.sympla.com.br/evento/bio-dementia/2046255',
                dailySales: [50, 80, 120, 130]
            },
            "Vampire's Night": {
                sales: 550,
                price: 50,
                capacity: 700,
                link: 'https://seulink.com.br/vampires-night',
                dailySales: [100, 150, 200, 100]
            },
            'Noir Fest': {
                sales: 900,
                price: 75,
                capacity: 1200,
                link: 'https://seulink.com.br/noir-fest',
                dailySales: [250, 300, 200, 150]
            }
        };
        
        // Dados Simulados de Tipos de Ingressos por Evento
        const ticketTypeData = {
            'Bio Dementia': [
                { name: 'Pista (Lote 1)', price: 25.00, quantity: 400 },
                { name: 'Camarote (VIP)', price: 50.00, quantity: 50 }
            ],
            "Vampire's Night": [
                { name: 'Early Bird', price: 40.00, quantity: 200 },
                { name: 'Standard', price: 50.00, quantity: 500 },
                { name: 'Meet & Greet', price: 100.00, quantity: 50 }
            ],
            'Noir Fest': [
                { name: 'Pista Simples', price: 75.00, quantity: 1000 },
                { name: 'Mesa Premium', price: 150.00, quantity: 100 }
            ]
        };
        
        // Elementos da Navbar (Re-inicialização local para eventData)
        const navLoginBtn = document.getElementById('navLoginBtn');
        const navSignupBtn = document.getElementById('navSignupBtn');
        const welcomeContainer = document.getElementById('welcomeContainer');
        const welcomeText = document.getElementById('welcomeText');

        // Elementos do Modal de Dashboard
        const modal = document.getElementById('funcionarioModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const modalEventTitle = document.getElementById('modalEventTitle');
        const metricVendas = document.getElementById('metricVendas');
        const metricReceita = document.getElementById('metricReceita');
        const metricLotacao = document.getElementById('metricLotacao');
        const metricCapacidade = document.getElementById('metricCapacidade');
        const chartContainer = document.getElementById('chartContainer');
        
        // Elementos dos Novos Modais CRUD
        const crudEventosModal = document.getElementById('crudEventosModal');
        const closeEventosModalBtn = document.getElementById('closeEventosModalBtn');
        const crudEventosTitle = document.getElementById('crudEventosTitle');

        const crudIngressosModal = document.getElementById('crudIngressosModal');
        const closeIngressosModalBtn = document.getElementById('closeIngressosModalBtn');
        const crudIngressosTitle = document.getElementById('crudIngressosTitle');
        const ingressosTableBody = document.getElementById('ingressosTableBody');

        // Elementos dos botões CRUD no Dashboard
        const crud1Btn = document.getElementById('crud1Btn');
        const crud2Btn = document.getElementById('crud2Btn');

        let currentEventName = ''; // Variável para armazenar o nome do evento atual

        
        // --- 4.1. Lógica da Navbar (Apenas no eventos.html para funcionários) ---
        // Garante que a navbar exiba o bem-vindo apenas aqui, se funcionário.
        if (isFuncionario) {
            if (navLoginBtn) navLoginBtn.style.display = 'none';
            if (navSignupBtn) navSignupBtn.style.display = 'none';
            if (welcomeContainer) welcomeContainer.style.display = 'flex';
            
            let username = 'Funcionário';
            if (userEmail) {
                username = userEmail.split('@')[0];
                username = username.charAt(0).toUpperCase() + username.slice(1);
            }
            if (welcomeText) welcomeText.innerHTML = `Bem-vindo(a), <span class="user-name">${username}</span>!`;
        }

        // --- 4.2. Função de Geração de Gráfico ---
        function renderChart(dailySales) {
            chartContainer.innerHTML = ''; // Limpa o container anterior
            
            if (dailySales.length === 0) return;

            const maxSales = Math.max(...dailySales);
            
            dailySales.forEach((sales, index) => {
                // Calcula a altura da barra como porcentagem do valor máximo
                const barHeight = (sales / maxSales) * 100; 
                
                const bar = document.createElement('div');
                bar.className = 'chart-bar';
                bar.style.height = `${barHeight}%`;
                bar.innerHTML = `<span>${sales}</span>`;
                
                const label = document.createElement('span');
                label.className = 'chart-label';
                label.textContent = `Dia ${index + 1}`;
                
                bar.appendChild(label);
                chartContainer.appendChild(bar);
            });
        }
        
        // --- 4.3. Lógica dos Cards (Abre Modal de Dashboard para Funcionários) ---
        const eventCards = document.querySelectorAll('.event-card');

        eventCards.forEach(card => {
            const eventName = card.getAttribute('data-event-name');
            const data = eventData[eventName];
            const eventLinkWrapper = card.querySelector('.event-link-wrapper'); 

            if (!data) return;

            eventLinkWrapper.href = '#'; // Neutraliza o link
            eventLinkWrapper.classList.add('card-no-link');
            
            eventLinkWrapper.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Configura o modal com os dados
                modalEventTitle.textContent = eventName;
                currentEventName = eventName; // Salva o nome do evento
                
                // 1. Preenche as Métricas
                const arrecadado = (data.sales * data.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                const ocupacao = ((data.sales / data.capacity) * 100).toFixed(1);
                
                metricVendas.textContent = data.sales;
                metricReceita.textContent = arrecadado;
                metricLotacao.textContent = `${ocupacao}%`;
                metricCapacidade.textContent = data.capacity;
                
                // 2. Renderiza o Gráfico
                renderChart(data.dailySales);
                
                // Abre o modal do Dashboard
                modal.style.display = 'block';
            });
        });

        // --- 4.4. Funções de População dos Modais CRUD ---

        function populateEventosModal(eventName, eventDetails) {
            crudEventosTitle.textContent = eventName;
            document.getElementById('eventCrudNome').value = eventName;
            document.getElementById('eventCrudCapacidade').value = eventDetails.capacity;
            document.getElementById('eventCrudPreco').value = eventDetails.price.toFixed(2);
            document.getElementById('eventCrudDesc').value = `Detalhes de edição simulados para o evento: ${eventName}. Aqui o funcionário pode atualizar a descrição, bandas, datas, etc.`;
        }

        function populateIngressosModal(eventName, ticketTypes) {
            crudIngressosTitle.textContent = eventName;
            ingressosTableBody.innerHTML = ''; // Limpa a tabela anterior
            
            if (ticketTypes.length === 0) {
                ingressosTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum tipo de ingresso cadastrado.</td></tr>';
                return;
            }
            
            // Simulação de preenchimento da tabela de ingressos
            ticketTypes.forEach(ticket => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${ticket.name}</td>
                    <td>${ticket.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td>${ticket.quantity}</td>
                    <td>
                        <button class="btn btn-edit" onclick="alert('Simulação: Editando tipo de ingresso ${ticket.name} de ${eventName}')">Editar</button>
                        <button class="btn btn-delete" onclick="alert('Simulação: Deletando tipo de ingresso ${ticket.name} de ${eventName}')">Deletar</button>
                    </td>
                `;
                ingressosTableBody.appendChild(row);
            });
        }

        // --- 4.5. Lógica de Abertura e Fechamento dos Modais ---

        // Função para fechar qualquer CRUD e voltar para o Dashboard
        function closeCrudAndReturnToDashboard(crudModal) {
            crudModal.style.display = 'none';
            if (currentEventName) {
                 modal.style.display = 'block'; // Retorna ao Dashboard se houver evento selecionado
            }
        }

        // Listeners para os botões CRUD no Dashboard
        if (crud1Btn) {
            crud1Btn.addEventListener('click', (e) => {
                e.preventDefault();
                const eventDetails = eventData[currentEventName];
                if (eventDetails) {
                    populateEventosModal(currentEventName, eventDetails);
                    modal.style.display = 'none'; // Fecha o dashboard
                    crudEventosModal.style.display = 'block'; // Abre o CRUD Eventos
                }
            });
        }

        if (crud2Btn) {
            crud2Btn.addEventListener('click', (e) => {
                e.preventDefault();
                const ticketTypes = ticketTypeData[currentEventName] || [];
                populateIngressosModal(currentEventName, ticketTypes);
                modal.style.display = 'none'; // Fecha o dashboard
                crudIngressosModal.style.display = 'block'; // Abre o CRUD Ingressos
            });
        }
        
        // Fechar modal Dashboard pelo botão X
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Fechar modal Eventos pelo botão X e retornar ao Dashboard
        if (closeEventosModalBtn) {
            closeEventosModalBtn.addEventListener('click', () => {
                closeCrudAndReturnToDashboard(crudEventosModal);
            });
        }

        // Fechar modal Ingressos pelo botão X e retornar ao Dashboard
        if (closeIngressosModalBtn) {
            closeIngressosModalBtn.addEventListener('click', () => {
                closeCrudAndReturnToDashboard(crudIngressosModal);
            });
        }

        // Fechar modais clicando fora
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            } else if (event.target === crudEventosModal) {
                closeCrudAndReturnToDashboard(crudEventosModal);
            } else if (event.target === crudIngressosModal) {
                closeCrudAndReturnToDashboard(crudIngressosModal);
            }
        });
    }

    // ----------------------------------------------------
    // 5. LÓGICA DE INDEX (index.html) - EXIBIÇÃO DA NAVBAR
    // ----------------------------------------------------
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const userEmail = localStorage.getItem('userEmail');
        const userType = localStorage.getItem('userType');
        const isLoggedIn = !!userEmail;

        const navLoginBtn = document.getElementById('navLoginBtn');
        const navSignupBtn = document.getElementById('navSignupBtn');
        const welcomeContainer = document.getElementById('welcomeContainer');
        const welcomeText = document.getElementById('welcomeText');

        if (isLoggedIn) {
            if (navLoginBtn) navLoginBtn.style.display = 'none';
            if (navSignupBtn) navSignupBtn.style.display = 'none';
            if (welcomeContainer) welcomeContainer.style.display = 'flex';
            
            let username = userEmail.split('@')[0];
            username = username.charAt(0).toUpperCase() + username.slice(1);
            
            if (welcomeText) {
                const tipoTexto = userType === 'funcionario' ? '(Funcionário)' : '(Cliente)';
                welcomeText.innerHTML = `Bem-vindo(a), <span class="user-name">${username}</span> ${tipoTexto}!`;
            }
        } else {
            if (navLoginBtn) navLoginBtn.style.display = 'inline-block';
            if (navSignupBtn) navSignupBtn.style.display = 'inline-block';
            if (welcomeContainer) welcomeContainer.style.display = 'none';
        }

        // Lógica dos cards para clientes (redirecionar para o link externo)
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            const linkWrapper = card.querySelector('.event-link-wrapper');
            const externalLink = card.getAttribute('data-link');
            if (linkWrapper && externalLink) {
                 // No index.html, o link deve ser o link externo
                linkWrapper.href = externalLink; 
                linkWrapper.target = "_blank"; // Abrir em nova aba
            }
        });
    }
});