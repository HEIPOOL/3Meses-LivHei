// src/data/microcopy.js
// Microcopy aprimorada para estados de carregamento da galeria.
// Tom: cinematográfico, romântico e com pitadas de humor rápido — direto ao ponto.

export const loadingMessages = {
  // Para carregamento inicial (startup)
  startup: [
    "Ligando a experiência...",
    "Acendendo as luzes da cena...",
    "Aquecendo pixels...",
    "Preparando a trilha sonora do momento...",
    "Sincronizando memórias...",
    "Ajustando o foco — respira fundo.",
    "Carregando nostalgia...",
    "Prontos para o espetáculo..."
  ],
  
  // Para progresso intermediário (loading)
  loading: [
    "Renderizando estrelas...",
    "Pintando o céu digital...",
    "Instanciando partículas de carinho...",
    "Afinando as cores e texturas...",
    "Orquestrando reflexos e sombras...",
    "O motor criativo está trabalhando...",
    "Quase tudo em posição — segura a emoção.",
    "Transformando dados em atmosfera..."
  ],
  
  // Para quase finalizado (finishing)
  finishing: [
    "Últimos encantamentos...",
    "Calibrando o brilho final...",
    "Abrindo a cortina — prepare-se.",
    "Quase mágico...",
    "Selando os detalhes...",
    "Porta prestes a se revelar...",
    "Tocando a campainha da galeria...",
    "Revelando em 3... 2... 1..."
  ],
  
  // Para erro, fallback ou quando o usuário pula (fallback)
  fallback: [
    "Algo travou — reiniciando a mágica.",
    "A magia deu uma pausa — quer entrar mesmo assim?",
    "Conexão caprichosa. Deseja pular para a galeria?",
    "O mistério persiste — mas você pode seguir.",
    "Tentando um atalho... segura aí.",
    "Se preferir, entre direto: botão de pulo disponível.",
    "Ops — atualização em curso. Quer tentar de novo?",
    "A experiência está quase lá. Quer pular?"
  ],

  // Mensagens curtas para barras/porcentagens (úteis em UIs pequenas)
  short: [
    "Aquecendo…",
    "Carregando…",
    "Quase lá…",
    "Revelando…",
    "Pronto…",
    "Pule se quiser →"
  ]
};
