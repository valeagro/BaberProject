const express = require('express');
const cors = require('cors');
const path = require('path'); // Novo
const app = express();

app.use(cors());
app.use(express.json());

// Diz ao servidor para expor os arquivos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public'))); 

// Banco de dados em memória... (mantenha o resto do seu código igual abaixo daqui)

// Banco de dados em memória (para testes)
let servicos = [
    { id: 1, nome: 'Corte Clássico', preco: 45.00 },
    { id: 2, nome: 'Barba Terapia', preco: 35.00 }
];
let agendamentos = [];
const horariosTrabalho = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

// --- ROTAS DE SERVIÇOS ---
app.get('/api/servicos', (req, res) => res.json(servicos));

app.post('/api/servicos', (req, res) => {
    const novoServico = { id: Date.now(), ...req.body };
    servicos.push(novoServico);
    res.json(novoServico);
});

app.delete('/api/servicos/:id', (req, res) => {
    servicos = servicos.filter(s => s.id !== parseInt(req.params.id));
    res.status(204).send();
});

// --- ROTAS DE AGENDAMENTO ---
app.get('/api/horarios-disponiveis', (req, res) => {
    const { data } = req.query;
    const agendamentosDoDia = agendamentos.filter(a => a.data === data);
    const horariosOcupados = agendamentosDoDia.map(a => a.hora);
    
    // Retorna apenas horários que não estão ocupados
    const disponiveis = horariosTrabalho.filter(h => !horariosOcupados.includes(h));
    res.json(disponiveis);
});

app.post('/api/agendamentos', (req, res) => {
    const { nome, servicoId, data, hora } = req.body;
    
    // Verifica se o horário já foi pego
    if (agendamentos.some(a => a.data === data && a.hora === hora)) {
        return res.status(400).json({ erro: 'Horário indisponível' });
    }

    const novoAgendamento = { id: Date.now(), nome, servicoId, data, hora };
    agendamentos.push(novoAgendamento);
    res.json(novoAgendamento);
});

app.delete('/api/agendamentos/:id', (req, res) => {
    agendamentos = agendamentos.filter(a => a.id !== parseInt(req.params.id));
    res.status(204).send();
});
app.get('/api/agendamentos', (req, res) => res.json(agendamentos));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
