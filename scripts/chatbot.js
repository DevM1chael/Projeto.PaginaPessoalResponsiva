let knowledgeBase = null;

async function loadKnowledgeBase() {
    try {
        const response = await fetch('data/knowledge_base.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        knowledgeBase = await response.json();
    } catch (error) {
        console.error('Failed to load knowledge base:', error);
        addMessageToChat('Desculpe, estou com problemas para acessar minhas informações. Tente novamente mais tarde.', 'bot');
    }
}

function formatCapacitacoes() {
    const { certificados, cursosEmAndamento, linguagens, habilidadesPraticas } = knowledgeBase.michaelSilva.capacitacoes;
    return `
        <p>Aqui estão as capacitações e habilidades de Michael:</p>
        <strong>Certificados Concluídos:</strong>
        <ul>${certificados.map(c => `<li>${c}</li>`).join('')}</ul>
        <strong>Cursos em Andamento:</strong>
        <ul>${cursosEmAndamento.map(c => `<li>${c}</li>`).join('')}</ul>
        <strong>Linguagens de Programação:</strong>
        <ul>${linguagens.map(l => `<li>${l}</li>`).join('')}</ul>
        <strong>Habilidades Práticas:</strong>
        <ul>${habilidadesPraticas.map(h => `<li>${h}</li>`).join('')}</ul>
    `;
}

function getResponse(userInput) {
    const input = userInput.toLowerCase().trim();

    if (!knowledgeBase) {
        return 'Estou com dificuldades para carregar minhas informações. Por favor, tente novamente em alguns instantes.';
    }

    if (input.includes('biografia') || input.includes('sobre michael') || input.includes('quem é michael')) {
        return knowledgeBase.michaelSilva.biografia;
    }
    
    if (input.includes('capacitaç') || input.includes('habilidade') || input.includes('skill') || input.includes('curso') || input.includes('certificado') || input.includes('linguagen')) {
        return formatCapacitacoes();
    }

    if (input.includes('missão') || input.includes('missao')) {
        return `<strong>Missão da Aurevo Global:</strong> ${knowledgeBase.aurevoGlobal.missao}`;
    }

    if (input.includes('visão') || input.includes('visao')) {
        return `<strong>Visão da Aurevo Global:</strong> ${knowledgeBase.aurevoGlobal.visao}`;
    }

    if (input.includes('valores')) {
        return `<strong>Valores da Aurevo Global:</strong> ${knowledgeBase.aurevoGlobal.valores}`;
    }

    if (input.includes('aurevo')) {
        return `
            <p>A Aurevo Global é uma holding em formação com a seguinte identidade:</p>
            <strong>Missão:</strong> ${knowledgeBase.aurevoGlobal.missao}<br><br>
            <strong>Visão:</strong> ${knowledgeBase.aurevoGlobal.visao}<br><br>
            <strong>Valores:</strong> ${knowledgeBase.aurevoGlobal.valores}
        `;
    }
    
    if (input.includes('olá') || input.includes('oi') || input.includes('bom dia') || input.includes('boa tarde') || input.includes('boa noite')) {
        return 'Olá! Como posso te ajudar? Você pode perguntar sobre Michael, suas capacitações ou sobre a Aurevo Global.';
    }

    return 'Desculpe, não entendi sua pergunta. Poderia tentar reformular? Você pode perguntar sobre a biografia de Michael, suas capacitações, ou a missão, visão e valores da Aurevo Global.';
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const messageContainer = document.createElement('div');
    messageContainer.className = `flex w-full ${sender === 'user' ? 'justify-end' : 'justify-start'}`;

    const messageBubble = document.createElement('div');
    const bubbleStyle = sender === 'user' 
        ? 'bg-gold text-navy rounded-br-none' 
        : 'bg-navy-light text-light-gray rounded-bl-none';
    messageBubble.className = `p-3 rounded-lg max-w-[85%] text-sm ${bubbleStyle}`;
    messageBubble.innerHTML = message;

    messageContainer.appendChild(messageBubble);
    chatMessages.appendChild(messageContainer);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleUserMessage() {
    const chatInput = document.getElementById('chat-input');
    const userInput = chatInput.value.trim();

    if (userInput) {
        addMessageToChat(userInput, 'user');
        chatInput.value = '';
        
        setTimeout(() => {
            const botResponse = getResponse(userInput);
            addMessageToChat(botResponse, 'bot');
        }, 600);
    }
}

export function initChatbot() {
    loadKnowledgeBase();

    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    
    if(chatSendBtn) {
        chatSendBtn.addEventListener('click', handleUserMessage);
    }
    
    if(chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleUserMessage();
            }
        });
    }
}
