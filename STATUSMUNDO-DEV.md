# StatusMundo — Manual completo para quem nunca ligou um computador

## Índice (para você pular para o que quiser)

1. [O que é este documento](#1-o-que-é-este-documento)
2. [Antes de tudo: o computador](#2-antes-de-tudo-o-computador)
3. [O que é o StatusMundo](#3-o-que-é-o-statusmundo)
4. [Uma história para entender o projeto](#4-uma-história-para-entender-o-projeto)
5. [As partes do StatusMundo](#5-as-partes-do-statusmundo)
6. [De onde vêm as notícias](#6-de-onde-vêm-as-notícias)
7. [Como as notícias são transformadas em resumo](#7-como-as-notícias-são-transformadas-em-resumo)
8. [Como o site vai parar na internet](#8-como-o-site-vai-parar-na-internet)
9. [O robô que trabalha todo dia de madrugada](#9-o-robô-que-trabalha-todo-dia-de-madrugada)
10. [Por que você precisou criar um token](#10-por-que-você-precisou-criar-um-token)
11. [O passo a passo completo — do começo ao fim](#11-o-passo-a-passo-completo-)
12. [Glossário — dicionário de termos](#12-glossário-)

---

## 1. O que é este documento

Este manual explica **o que é o StatusMundo**, **como ele funciona** e **por que cada pedaço existe**.

Ele foi escrito para uma pessoa que **nunca ligou um computador** e **nunca ouviu falar** de programação, internet, ou qualquer coisa técnica. Não precisa saber nada. Vamos aprender do zero.

Cada palavra difícil será explicada na hora. No final, tem um dicionário com todos os termos.

---

## 2. Antes de tudo: o computador

### O que é um computador?

Um computador é uma **máquina que faz contas muito rápido** e **guarda informações**. Ele não pensa — ele apenas executa ordens que alguém escreveu para ele.

Você pode dar ordens para o computador de dois jeitos:

1. **Clicando em botões** (como no Word, no Excel, no navegador de internet)
2. **Escrevendo comandos** em uma tela preta chamada **terminal** (é o que fizemos durante a criação)

### O que é um arquivo?

É um pedaço de informação guardado no computador. Pode ser:

- Um texto (como uma carta)
- Uma foto
- Um vídeo
- Uma **receita** que diz ao computador o que fazer (chamamos isso de **código**)

### O que é uma pasta?

É um lugar onde você guarda vários arquivos juntos. Igual pastas de papel em um arquivo de escritório.

### O que é a internet?

É um **fio invisível** que liga computadores do mundo inteiro. Quando você digita um endereço (como `statusmundo.flipemoreira-oficial.workers.dev`), seu computador pede uma cópia daquele site para um outro computador que fica ligado o tempo todo (chamado **servidor**). O servidor manda o site de volta, e você vê na tela.

### O que é um navegador?

É o programa que você usa para ver sites. Exemplos: Chrome, Edge, Firefox.

---

## 3. O que é o StatusMundo

O StatusMundo é um **site** que mostra **o resumo das principais notícias do Brasil** em um **mapa-múndi**.

Pense nele como **um jornal que se escreve sozinho todo dia**.

Você abre o site, vê um mapa do mundo com o Brasil destacado em verde. Você clica no Brasil e aparecem as notícias mais importantes do dia, resumidas pela inteligência artificial.

### O que o site NÃO é

- Não é uma televisão (não tem vídeo)
- Não é uma rede social (ninguém comenta, ninguém posta)
- Não precisa de login ou senha
- Não custa dinheiro para funcionar

---

## 4. Uma história para entender o projeto

Imagine que você quer montar um **jornal de parede** todos os dias.

Toda manhã, você:

1. **Compra 5 jornais diferentes** na banca (são as **fontes de notícias**: G1, CNN, Agência Brasil, Folha, Estadão)
2. **Recorta as notícias importantes** de cada jornal
3. **Senta com um amigo muito inteligente** (o **Gemini**, a inteligência artificial) e pede para ele:
   - "Junte as notícias que falam da mesma coisa"
   - "Escreva um resumo pequeno de cada assunto"
   - "Coloque etiquetas tipo: isso é política, isso é esporte"
4. Você **cola os resumos em um cartaz** bonito
5. Pendura o cartaz na **vitrine da sua loja** para todo mundo ver

Agora traduzindo para o computador:

| Na história | No computador |
|---|---|
| Comprar jornais | O **robô** baixa as notícias da internet |
| Recortar | O robô separa título, texto, data |
| Amigo inteligente | O robô manda tudo para o **Gemini** (IA do Google) |
| Escrever resumo | O Gemini escreve resumos e coloca etiquetas |
| Colar no cartaz | O robô salva os resumos em um **arquivo** |
| Pendurar na vitrine | O **Cloudflare** publica o site na internet |
| Fazer isso todo dia | O **GitHub Actions** acorda o robô de madrugada |

---

## 5. As partes do StatusMundo

O projeto StatusMundo é uma **pasta** no seu computador chamada `statusmundo`. Dentro dela, existem outras pastas e arquivos.

### Pasta principal: `statusmundo\`

É a **gaveta principal** onde tudo fica guardado.

### Pasta `site\`

Aqui mora **a parte que você vê no navegador** — o mapa, os botões, o modal, as cores. É o "cartaz" da história.

Dentro dela, os arquivos mais importantes são:

- **`src\App.jsx`** — o "coração" do site. É um arquivo de texto que diz ao computador: "quando o usuário abrir o site, mostre o mapa, espere ele clicar no Brasil, abra o modal, mostre as notícias".
- **`src\components\MapaMundi.jsx`** — o arquivo que desenha o mapa-múndi na tela.
- **`src\components\ModalNoticias.jsx`** — o arquivo que desenha a janela que aparece quando você clica no Brasil.
- **`public\ultimo.json`** — o arquivo com as notícias do dia. O site lê esse arquivo para saber o que mostrar.

### Pasta `robo\`

Aqui mora **o cérebro que busca e processa as notícias**. É o "funcionário" da história.

Dentro dela:

- **`coletor.js`** — o arquivo que manda o computador: "vá até o site do G1, da CNN, etc., baixe as manchetes, junte tudo em uma lista".
- **`cerebro.js`** — o arquivo que manda o computador: "pegue a lista de notícias, envie para o Gemini (inteligência artificial), receba os resumos de volta, salve no arquivo".
- **`saida/brutos.json`** — o arquivo com as notícias "cruas" (antes de resumir).
- **`.env`** — o arquivo com a **senha** do Gemini (a chave de API). Esse arquivo **nunca** vai para o GitHub.

### Pasta `.github\workflows\`

Aqui mora **o relógio que acorda o robô todo dia**.

- **`diario.yml`** — um arquivo de instruções que diz: "todo dia às 8h da manhã, ligue o computador, rode o coletor.js, depois rode o cerebro.js, e mande a atualização para o site".

### Pasta `spec\`

Aqui moram os **planos** do projeto — os documentos que eu li para entender o que você queria.

---

## 6. De onde vêm as notícias

O robô busca notícias de **5 fontes brasileiras**:

1. **Agência Brasil** — site de notícias do governo federal (conteúdo público, gratuito)
2. **G1** — portal de notícias da Globo
3. **CNN Brasil** — portal de notícias da CNN no Brasil
4. **Folha de S.Paulo** — jornal impresso e digital
5. **Estadão** — jornal impresso e digital (às vezes o feed não funciona)

Esses sites têm uma "tomada" especial chamada **feed RSS**. É como se fosse um **atalho**: em vez de você entrar no site e ficar procurando as notícias, esse "atalho" entrega as manchetes prontas em um formato que o computador entende.

O robô usa esse atalho para baixar as manchetes automaticamente.

---

## 7. Como as notícias são transformadas em resumo

Depois que o robô baixa as manchetes, ele manda tudo para o **Gemini** — uma inteligência artificial do Google (igual ao ChatGPT, mas de outra empresa).

O robô escreve uma carta para o Gemini dizendo mais ou menos assim:

> "Aqui estão 30 manchetes do dia. Por favor:
> 1. Junte as que falam da mesma coisa
> 2. Escreva um resumo neutro de cada assunto (sem dar opinião)
> 3. Classifique cada um em: política, economia, esportes, etc.
> 4. Devolva tudo em formato de lista"

O Gemini processa e devolve uma lista organizada. O robô pega essa lista e guarda no arquivo `site/public/ultimo.json`.

Quando você abre o site, ele lê esse arquivo e mostra os resumos no modal.

---

## 8. Como o site vai parar na internet

Seu site está no seu computador. Mas você quer que **qualquer pessoa** possa ver de **qualquer computador do mundo**. Para isso, o site precisa estar em um **servidor** — um computador ligado 24 horas por dia.

### O que é o Cloudflare

**Cloudflare** é uma empresa que oferece **servidores grátis** para sites pequenos como o seu.

Pense no Cloudflare como uma **vitrine de loja**:

- Você tem seu produto (o site) guardado em casa (seu computador)
- O Cloudflare coloca seu produto na vitrine na **avenida principal da internet**
- Qualquer pessoa pode olhar a vitrine a qualquer hora

O nome do serviço que faz isso se chama **Cloudflare Pages**.

Quando você criou sua conta no Cloudflare e conectou com seu GitHub, você estava fazendo o seguinte:

> "Cloudflare, aqui está o endereço do meu projeto no GitHub. Sempre que eu atualizar o código de lá, pegue a pasta `site`, monte o site, e publique na internet."

Depois disso, o Cloudflare deu a você um endereço:

```
https://statusmundo.flipemoreira-oficial.workers.dev
```

Esse é o **endereço da sua vitrine**. Qualquer pessoa que digitar isso no navegador vê o StatusMundo.

### Por que não precisa pagar

O Cloudflare permite **um site grátis por conta**. O site do StatusMundo é pequeno (só texto e um mapa), então cabe de graça.

---

## 9. O robô que trabalha todo dia de madrugada

O robô (o script na pasta `robo/`) poderia ser ligado manualmente todo dia. Mas você não quer acordar cedo para fazer isso.

Quem faz isso é o **GitHub Actions**.

### O que é o GitHub

**GitHub** é um site que **guarda cópias do seu projeto na nuvem**. "Nuvem" é um jeito chique de dizer "um computador do outro lado do mundo que fica ligado o tempo todo".

O GitHub guarda **todas as versões** do seu projeto. Se algo der errado hoje, você pode "voltar no tempo" para a versão de ontem.

### O que é Git

**Git** é o programa que "tira fotos" do seu projeto. Cada foto se chama **commit**. Quando você escreveu `git add .` e `git commit -m "mensagem"`, você estava tirando uma foto do projeto naquele momento.

Depois, `git push` envia essa foto para o **GitHub** (salva na nuvem).

### O que é GitHub Actions

É um **relógio despertador + um funcionário que trabalha de graça**.

O arquivo `.github/workflows/diario.yml` diz:

> "Todo dia às 8h da manhã (horário de Brasília), ligue um computador na nuvem, baixe a última versão do projeto, instale as ferramentas necessárias, rode o coletor.js, rode o cerebro.js, pegue o resultado e mande de volta para o GitHub."

Quando o GitHub recebe essa atualização, o Cloudflare detecta a mudança e **republica o site automaticamente**. Resultado: todo dia às 8h da manhã, o StatusMundo tem notícias novas.

---

## 10. Por que você precisou criar um token

Quando você tentou enviar o projeto para o GitHub com `git push`, apareceu um erro.

O motivo: o GitHub precisa ter **certeza** de que é **você** enviando o código, e não um estranho. É como um **cartão de acesso** de prédio.

Existem dois jeitos de provar quem você é:

1. **Senha normal** — mas o GitHub não aceita mais senha para enviar código pelo terminal
2. **Token** — uma senha especial, longa, que começa com `ghp_...`

### O que é o Personal Access Token (PAT)

Imagine um **cartão de acesso de hotel**. Você chega na recepção, eles te dão um cartão que funciona só para certas portas:

- Porta de entrada do prédio (`repo` — acesso ao repositório)
- Porta da sala de máquinas (`workflow` — acesso para criar os robôs automáticos)

Quando você criou o token no GitHub (Settings → Developer settings → Personal access tokens → Tokens classic), você estava **criando um cartão** que permite ao seu computador enviar código para o GitHub.

Depois que você marcou as opções `repo` e `workflow`, o token passou a ter permissão para:

- `repo`: enviar código novo para o GitHub
- `workflow`: criar e modificar o robô automático (GitHub Actions)

Quando você digitou sua senha (na verdade, colou o token), o Git (programa no seu computador) mostrou o cartão para o GitHub, o GitHub reconheceu, e deixou o código passar.

---

## 11. O passo a passo completo —

Agora que você conhece cada peça, veja como elas se encaixam:

### O que acontece todo dia às 8h da manhã

```
 1. O GitHub Actions "acorda"
    │
 2. Liga um computador na nuvem (gratuito)
    │
 3. Baixa a última versão do projeto do GitHub
    │
 4. Instala as ferramentas necessárias (Node.js, etc.)
    │
 5. Roda o coletor.js
    │    │
    │    ├── Acessa os 5 sites de notícias
    │    ├── Baixa as manchetes
    │    ├── Junta tudo em uma lista
    │    └── Salva em robo/saida/brutos.json
    │
 6. Roda o cerebro.js
    │    │
    │    ├── Lê a lista de manchetes
    │    ├── Envia para o Gemini (inteligência artificial)
    │    │   (usa a senha guardada no .env / Secrets do GitHub)
    │    ├── Gemini devolve: resumos agrupados + etiquetas
    │    └── Salva em site/public/ultimo.json
    │
 7. Envia o ultimo.json atualizado de volta para o GitHub
    │
 8. O Cloudflare detecta que o GitHub foi atualizado
    │
 9. O Cloudflare baixa o projeto, monta o site, e publica
    │
10. Você abre statusmundo.flipemoreira-oficial.workers.dev
    │    └── Vê o mapa com as notícias atualizadas
```

### O que acontece quando você clica no Brasil

```
 1. O navegador carrega o site
    │
 2. O site baixa o arquivo ultimo.json
    │
 3. Você vê o mapa-múndi (só o Brasil em verde)
    │
 4. Você clica no Brasil
    │
 5. Abre o modal com 3 colunas:
    │
    ├── ESQUERDA: Categorias e Tags para filtrar
    ├── MEIO: Lista de notícias que batem com o filtro
    └── DIREITA: Detalhe da notícia que você clicou
```

---

## 12. Glossário

Um dicionário com todas as palavras difíceis usadas neste documento, em ordem alfabética.

---

**API (Application Programming Interface)**

Uma "tomada" que um programa oferece para outro programa se conectar. É como um garçom: você (um programa) pede algo, o garçom (a API) leva o pedido para a cozinha e traz o resultado.

---

**Arquivo**

Um pedaço de informação guardado no computador. Pode ser um texto, uma foto, um vídeo, ou uma receita que o computador executa.

---

**Build / "Montar o site"**

O processo de pegar o código do site (que está espalhado em vários arquivos) e transformar em um único pacote que o navegador entende. É como separar os ingredientes de um bolo e depois misturar e assar — o resultado final é diferente dos ingredientes separados.

---

**Cloudflare**

Empresa que hospeda sites de graça. Pense nela como uma vitrine onde seu site fica exposto para o mundo todo.

---

**Cloudflare Pages**

O serviço do Cloudflare que publica sites estáticos (sites que não precisam de um banco de dados).

---

**Código / Código-fonte**

As instruções escritas em uma linguagem que o computador entende. É como uma receita de bolo: os ingredientes e o passo a passo para o computador executar.

---

**Commit**

Uma "foto" do projeto em um determinado momento. Se algo der errado, você pode voltar para qualquer foto anterior.

---

**CSS / Tailwind**

O "maquiador" do site. Enquanto o React define o que aparece na tela, o CSS (e o Tailwind, que é um atalho para escrever CSS) define as cores, os tamanhos, as fontes — a aparência.

---

**Dependência**

Uma "peça" que seu projeto precisa para funcionar mas que não foi criada por você. Por exemplo, o `rss-parser` é uma peça que lê feeds RSS — alguém criou e você só usou.

---

**.env (dot-env)**

Um arquivo que guarda segredos (senhas, chaves de API). Nunca vai para o GitHub para não vazar.

---

**Feed RSS**

Um "atalho" que sites de notícias oferecem para programas lerem as manchetes automaticamente, sem precisar abrir o site no navegador.

---

**Gemini**

Inteligência artificial do Google. É o "cérebro" que resume as notícias e coloca etiquetas. Funciona como o ChatGPT, mas é de outro fabricante.

---

**Git**

Programa que tira "fotos" do seu projeto (commits) para você poder voltar no tempo se algo der errado.

---

**GitHub**

Site que guarda cópias do seu projeto na nuvem (em servidores do outro lado do mundo). É como um cofre digital.

---

**GitHub Actions**

O "relógio despertador + funcionário grátis" que acorda todo dia de madrugada, liga o robô, e atualiza o site.

---

**Hospedar / Hospedagem**

Guardar os arquivos de um site em um servidor ligado 24 horas para que qualquer pessoa possa acessar a qualquer momento.

---

**Inteligência Artificial (IA)**

Um programa que aprendeu com exemplos e consegue realizar tarefas que parecem exigir inteligência humana — como resumir textos, classificar assuntos, etc. Não é uma pessoa de verdade; é um computador muito inteligente.

---

**JavaScript**

A linguagem (o idioma) em que o StatusMundo foi escrito. Pense como o português: é o idioma que o computador entende para executar o site e o robô.

---

**JSON**

Um formato de organizar informações em um arquivo de texto, usado para guardar as notícias. É parecido com uma tabela: cada linha é uma notícia, cada coluna é uma informação (título, resumo, categoria, etc.).

---

**Node.js**

Um programa que permite executar JavaScript fora do navegador. O robô (coletor.js, cerebro.js) precisa do Node.js para funcionar, porque ele roda no computador, não no site.

---

**npm (Node Package Manager)**

A "loja de peças" do Node.js. Quando você digita `npm install rss-parser`, o npm vai até a loja, baixa a peça "rss-parser" e instala no seu projeto.

---

**npm run**

Comando que executa uma receita que está escrita no `package.json`. Por exemplo, `npm run coletar` executa o arquivo `coletor.js`.

---

**Navegador**

O programa que você usa para ver sites. Exemplos: Chrome, Edge, Firefox.

---

**Pasta**

Um lugar onde você guarda vários arquivos juntos. Igual a pastas de papel em um gaveteiro de escritório.

---

**Push (git push)**

Enviar as "fotos" (commits) do seu computador para o GitHub (para a nuvem).

---

**React**

Uma "fábrica de sites" que ajuda a construir sites com partes que se repetem (como os cards de notícias). É o que faz o site ser rápido e organizado.

---

**Repositório**

Outro nome para a pasta do projeto no GitHub. É o "cofre" onde o projeto fica guardado.

---

**Rolldown / Vite**

"Empacotadores" do site. Pegam todos os arquivos espalhados e juntam em um só pacote que o navegador consegue ler.

---

**Secrets (do GitHub)**

Um cofre de senhas que o GitHub oferece para os robôs automáticos (GitHub Actions). A chave do Gemini fica lá, para o robô poder usar sem ninguém ver.

---

**Servidor**

Um computador ligado 24 horas por dia que guarda sites e os entrega para quem pedir. O Cloudflare tem servidores no mundo inteiro.

---

**Tailwind**

Uma ferramenta que facilita a arrumação do site (cores, tamanhos, posições). Em vez de escrever "o título deve ser branco, tamanho grande, centralizado", você escreve algo como `text-white text-3xl text-center`.

---

**Terminal**

Uma tela preta onde você escreve comandos para o computador. É como falar diretamente com a máquina, sem usar ícones ou botões.

---

**Token (Personal Access Token)**

Uma senha longa que o GitHub usa para identificar seu computador. Funciona como um cartão de acesso de prédio.

---

**TopoJSON / GeoJSON**

Formatos de arquivo que guardam mapas. O mapa-múndi que você vê é desenhado a partir de um arquivo TopoJSON que contém as fronteiras de todos os países.

---

**Vite**

Uma ferramenta que acelera a construção do site. É o "forno" que monta o bolo (o site) rapidamente.

---

**Workflow**

O arquivo que define o robô automático (GitHub Actions). Está em `.github/workflows/diario.yml`.

