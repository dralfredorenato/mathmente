# EstudaMente

Plataforma multidimensional de estudos com IA para apoio a alunos com TDAH.

## Materias

- **MathMente** - Tutora de Matematica T2 (operacoes com inteiros, racionais - conceitos e operacoes, propriedades das potencias, raizes na reta numerica, expressoes algebricas e valor numerico)
- **LetraMente** - Tutora de Portugues (interpretacao, gramatica, acentuacao, verbos, figuras de linguagem)
- **HistoriaMente** - Tutora de Historia (do Imperio Romano ao Mundo Medieval)
- **CienciaMente** - Tutora de Ciencias da Natureza (projeto "O Equilibrio Termico e o Efeito Estufa Natural": termodinamica, transferencia de calor, maquinas termicas, efeito estufa, dinamicas atmosfericas, oceanos, camada de ozonio e sustentabilidade)

## Funcionalidades

- Chat com IA personalizado por materia
- Modo Aluna com gamificacao (XP + Pomodoro)
- Modo Pai com painel de acompanhamento e consultor pedagogico
- Suporte especifico para TDAH
- Arquitetura extensivel para novas materias

## Tech Stack

- Next.js 14 + React 18
- Anthropic Claude API (@anthropic-ai/sdk) - modelo configuravel via ANTHROPIC_MODEL (padrao claude-haiku-4-5)
- Inline CSS responsivo

## Variaveis de ambiente

- `ANTHROPIC_API_KEY_MATHMENTE` (obrigatoria) - chave da API da Anthropic (aceita tambem `ANTHROPIC_API_KEY` como alternativa)
- `ANTHROPIC_MODEL` (opcional) - id do modelo Claude (ex: claude-haiku-4-5, claude-sonnet-4-6, claude-opus-4-8). Padrao: claude-haiku-4-5
