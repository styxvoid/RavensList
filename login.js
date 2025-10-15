document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. CONSTANTES E LÓGICA GERAL
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
        window.location.href = 'login.html'; 
    };

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    // ----------------------------------------------------
    // 2. LÓGICA DE LOGIN (Página login.html)
    // ----------------------------------------------------
    // CORREÇÃO DE SELETOR: Usamos o ID 'loginForm' ou a classe '.login-form'.
    // Presumindo que o formulário de login tenha um ID para maior precisão.
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
    // Presumindo que o formulário de cadastro tenha o ID 'registerForm'
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
    // 4. LÓGICA CONDICIONAL DE EVENTOS (eventos.html) e INDEX (index.html)
    // ----------------------------------------------------
    
    // Essa lógica permanece inalterada, focando apenas na correção dos formulários.
    // ... (O restante do código de eventos e index deve ser mantido aqui)
    
});