# Vue 3 Hand Tracking & Gesture Analysis 🖐️🤖

Este repositório é um projeto prático de estudo focado na integração de modelos de visão computacional diretamente no navegador.

**Aviso de Transparência:** Este código foi desenvolvido em *pair programming* com uma Inteligência Artificial. O objetivo aqui não foi gerar um aplicativo pronto com um prompt mágico, mas sim utilizar a IA como tutora para **aprender e entender** como a arquitetura funciona de verdade. Toda linha de código foi discutida, compreendida e validada antes de ser implementada.

## 🧠 O que foi aprendido neste projeto?

Em vez de apenas colar trechos de código, o foco foi entender os "porquês" das escolhas técnicas:

1. **Alta Performance (60 FPS):** Aprendi a não engargalar a reatividade do Vue. O loop de inferência do TensorFlow é controlado de forma independente via `requestAnimationFrame`, sincronizando com o monitor e poupando a CPU.
2. **Separação de Responsabilidades:** A interface (Vue) não se mistura com a IA. Temos *Composables* genéricos para gerenciar hardware/modelos e *Utilitários* puros (TypeScript) para a matemática e desenho no Canvas.
3. **Geometria Espacial (Eixo Z):** Aprendi a usar a profundidade fornecida pelo MediaPipe. O eixo Z usa o pulso como origem (`Z = 0`). Valores negativos significam que o ponto está projetado na direção da câmera, o que nos permitiu criar um validador 3D anti-falsos positivos para gestos como o "Joia" (Thumbs Up).
4. **HTML5 Canvas:** Renderização direta de pontos e conexões (o esqueleto da mão) resolvendo problemas de *clear* e sobreposição de frames ao detectar múltiplas mãos simultaneamente.

## 🚀 Tecnologias Utilizadas

* **Vue 3** (Composition API & `<script setup>`)
* **TypeScript** (Tipagem estrita para pontos e tensores)
* **Vite** (Build tool)
* **Tailwind CSS** (Estilização e Layout)
* **TensorFlow.js & MediaPipe Hands** (Motor de IA e modelo de detecção)

## 🛠️ Funcionalidades Implementadas

* [X] Acesso à webcam do usuário com tratamento de permissões.
* [X] Rastreamento de até 2 mãos simultâneas em tempo real.
* [X] Renderização de um esqueleto 2D em um `<canvas>` isolado.
* [X] Dashboard de extração de coordenadas brutas (X, Y).
* [X] Motor de análise de gestos lógicos 2D (identificação de dedos levantados/recolhidos).
* [X] Motor de análise de gestos 3D (detecção de profundidade usando o eixo Z).

## 💻 Como Rodar Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

1. Clone o repositório:

```bash
git clone [https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git](https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git)
```


2. Acesse a pasta do projeto:

```
cd NOME_DO_REPOSITORIO
```

3. Instale as dependências:

```
npm install
```

4. Inicie o servidor de desenvolvimento:

```
npm run dev
```

5. Abra o navegador no endereço indicado (geralmente `http://localhost:5173`) e permita o acesso à câmera.
