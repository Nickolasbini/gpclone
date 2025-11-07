document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatWindow = document.getElementById('chatWindow');
    const sendButton = document.getElementById('sendButton');
    const newChat = document.getElementById('newChat');
    const menuButton = document.getElementById('menuButton');

    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) {
            return;
        }

        const isOpen = sidebar.classList.contains('w-64');
        sidebar.classList.remove(isOpen ? 'w-64' : 'w-auto');
        sidebar.classList.add(isOpen ? 'w-auto' : 'w-64');

        const elementsToHide = sidebar.querySelectorAll('.hide-on-small');
        for (let element of elementsToHide) {
            element.classList.toggle('hidden');
        }
    }

    const BACKEND_URL = `http://localhost:3000/chat-completion`;

    let conversationHistory = null;

    function startChat() {
        conversationHistory = [
            { 
                role: "system", 
                content: "Você é um assistente útil e amigável, criado para tutoriais em JavaScript. Suas respostas devem ser concisas e focadas em código." 
            }
        ];

        chatWindow.innerHTML = `<div id="start-message" class="flex flex-col items-center justify-center h-full min-h-[300px]" style="min-height: calc(100vh - 200px);">
            <h2 class="text-3xl font-semibold mb-12">Olá, aqui é o GTClone, vamos começar.</h2>
        </div>`;
    }

    function appendMessage(content, sender) {
        const isUser = sender === 'user';
        
        const messageContainer = document.createElement('div');
        messageContainer.className = 'w-full py-6';

        const messageContent = document.createElement('div');
        messageContent.className = `flex max-w-2xl mx-auto ${isUser ? 'justify-end' : ''}`; 
        
        const iconWrapper = document.createElement('div');
        
        iconWrapper.className = `w-8 h-8 flex items-center justify-center rounded-sm mr-4 flex-shrink-0 ${isUser ? '' : 'bg-green-500 text-white'}`;
        iconWrapper.innerHTML = isUser 
            ? ''
            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clip-rule="evenodd" />
            </svg>`;

        const textElement = document.createElement('div');
        textElement.className = `text-base leading-relaxed whitespace-pre-wrap ${isUser ? 'px-4 py-2 border bg-gray-100 user-balloon' : ''}`;
        textElement.textContent = content;

        messageContent.appendChild(iconWrapper);
        messageContent.appendChild(textElement);
        messageContainer.appendChild(messageContent);
        chatWindow.appendChild(messageContainer);

        chatWindow.scrollTop = chatWindow.scrollHeight;
        
        return textElement;
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userText = userInput.value.trim();
        if (!userText) return;

        const initialGreeting = chatWindow.querySelector('#start-message');
        if (initialGreeting) {
            initialGreeting.parentElement.innerHTML = '';
        }

        appendMessage(userText, 'user');
        
        userInput.value = '';
        userInput.style.height = 'auto'; 
        
        sendButton.disabled = true;
        userInput.disabled = true;
        sendButton.classList.remove('bg-green-500', 'hover:bg-green-600');
        sendButton.classList.add('bg-gray-400', 'disabled:cursor-not-allowed');

        conversationHistory.push({ role: "user", content: userText });

        const aiMessageTextElement = appendMessage('Digitando...', 'ai');
        aiMessageTextElement.classList.add('typing'); 
        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ history: conversationHistory }), 
            });

            const data = await response.json();
            
            aiMessageTextElement.classList.remove('typing'); 

            if (response.ok && data.message) {
                const aiResponse = data.message;
                aiMessageTextElement.textContent = aiResponse;
                
                conversationHistory.push({ role: "assistant", content: aiResponse });

            } else {
                console.error('Erro na resposta do backend:', data.error);
                aiMessageTextElement.textContent = `❌ Erro: ${data.error || 'Falha ao conectar ao servidor.'}`;
                
                conversationHistory.pop(); 
            }

        } catch (error) {
            console.error('Erro de rede/servidor:', error);
            aiMessageTextElement.textContent = '❌ Erro de conexão com o backend. Verifique se o servidor Node.js está rodando (porta 3000).';
            aiMessageTextElement.classList.remove('typing');
            
            conversationHistory.pop();
            
        } finally {
            sendButton.disabled = false;
            userInput.disabled = false;
            userInput.focus(); 
            sendButton.classList.remove('bg-gray-400', 'disabled:cursor-not-allowed');
            sendButton.classList.add('bg-green-500', 'hover:bg-green-600');
        }
    });

    // LISTENERS
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (!e.shiftKey) {
                e.preventDefault();
                chatForm.dispatchEvent(new Event('submit'));
            }
        }
    });

    newChat.addEventListener('click', (e) => {
        e.preventDefault();
        startChat();
    });

    menuButton.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSidebar();
    });

    startChat();
});