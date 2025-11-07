require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { default: fetch } = require('node-fetch');

const app = express();
app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello to GT Clone API' }) 
});

app.post('/chat-completion', async (req, res) => {
    const history = req.body?.history ?? null;
    
    if (!history || history.length === 0) {
        return res.status(400).json({ error: 'O histórico da conversa é obrigatório.' });
    }
    
    const AI_MODEL = 'openrouter/polaris-alpha'; 

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY ?? ''}`,
                'HTTP-Referer': 'https://cervodigital.com', 
                'X-Title': 'GTClone',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "model": AI_MODEL,
                "messages": history
            })
        });

        const data = await response.json();

        const aiMessage = data.choices?.[0]?.message?.content;

        if (aiMessage) {
            res.json({ message: aiMessage });
        } else if (data.error) {
            console.error('Erro retornado pela API:', data.error);
            res.status(500).json({ error: `Erro na API: ${data.error.message || 'Falha desconhecida.'}` });
        } else {
             res.status(500).json({ error: 'Resposta da API incompleta ou formato inesperado.' });
        }

    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        res.status(500).json({ error: 'Erro interno do servidor Node.js.' });
    }
});

app.listen(process.env.PORT ?? 3000, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${process.env.PORT ?? 3000}`);
});