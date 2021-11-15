function setup() {
  createCanvas(500, 500);
}

let pontos = [] // pontos 
let linhas = [] // coordernadas das linhas
let corLinha = [] // cor da linhas

let zoomAtivado = 0 
let calcularAtivado = false
let somaVetorial = 0

let PontosRectCenter = [] // coordenadas do centro do poligono

let sizeOrigem = 40 // tamanho do circulo dos pontos

let desenharAtivado = false; // estado de desenho

function ativarDesenhar(){ // libera para o usuario desenhar
  limpar()
  desenharAtivado = true;
}

function limpar(){ // apaga os elementos da tela
  pontos = []
  linhas = []
  corLinha = []
  sizeOrigem = 40
  zoomAtivado = 0
  calcularAtivado = false
  desenharAtivado = true;
}

function desenharLinhas() { // desenha as linhas na tela
  
  for( i=0 ; i<linhas.length ; i++ ) {
    let L = linhas[i] // 
    let C = corLinha[i]
    
    push()
    fill(C[0], C[1], C[2])
    strokeWeight(4);
    stroke(C[0], C[1], C[2])
    line( L[0], 
          L[1],  
          L[2],  
          L[3] )  
    pop();
  }
}

function desenharPontos() { // desenha os pontos na tela
  let cor = 0;

  for( i=0 ; i<pontos.length ; i++ ) {
    fill(255)
    let P = pontos[i] // 
    
    if(corLinha.length > 0 && cor < corLinha.length) {
      let C = corLinha[cor] 
      push()
        strokeWeight(4);
        stroke(C[0], C[1], C[2])
        circle( P[0], P[1], sizeOrigem )   
      pop()
      cor += 1
    } else {
      if(pontos.length === 1) circle( P[0], P[1], sizeOrigem/2 ) 
    }   

  }
}

function minX() { // pega a menor coordenada x dos pontos
  let x = []
  for( i=0 ; i<pontos.length ; i++ ) {
    let P = pontos[i]
    x.push(P[0])
  }

  return min(x)
}

function maxX() { // pega a maior coordenada x dos pontos
  let x = []
  for( i=0 ; i<pontos.length ; i++ ) {
    let P = pontos[i]
    x.push(P[0])
  }

  return max(x)
}

function minY() { // pega a menor coordenada y dos pontos
  let y = []
  for( i=0 ; i<pontos.length ; i++ ) {
    let P = pontos[i]
    y.push(P[1])
  }

  return min(y)
}

function maxY() { // pega a maior coordenada y dos pontos
  let y = []
  for( i=0 ; i<pontos.length ; i++ ) {
    let P = pontos[i]
    y.push(P[1])
  }

  return max(y)
}

function pegarCentroX() { // calcula a coordenada X do centro do retangulo que contem o poligono no interior

  let area = calcularArea()

  let x = 0;
  for( i=0 ; i<PontosRectCenter.length ; i++ ) {
    let P = PontosRectCenter[i]
    let Pi = 0
    if(i < PontosRectCenter.length - 1) {
      Pi = PontosRectCenter[i+1]
    } else {
      Pi = PontosRectCenter[0]
    }
    x += (P[0] + Pi[0]) * ((P[0] * Pi[1]) - (Pi[0] * P[1])) // formula somatorio
  }

  return x / (6 * area); // divide pela constante 1/6
}

function pegarCentroY() { // calcula a coordenada Y do centro do retangulo que contem o poligono no interior
  let area = calcularArea()

  let y = 0;
  for( i=0 ; i<PontosRectCenter.length ; i++ ) {
    let P = PontosRectCenter[i]
    let Pi = 0
    if(i < PontosRectCenter.length - 1) {
      Pi = PontosRectCenter[i+1]
    } else {
      Pi = PontosRectCenter[0]
    }
    y += (P[1] + Pi[1]) * ((P[0] * Pi[1]) - (Pi[0] * P[1]))
  }

  return y / (6 * area);
}

function desenharRect() { // atualiza as coordenadas do centro do retangulo
  PontosRectCenter = [[minX(), maxY()], [maxX(), maxY()], [maxX(), minY()], [minX(), minY()] ]
}

function calcularArea(){ // calcula a área do retangulo que contem o poligono no interior
  let centro = 0;
  for( i=0 ; i<PontosRectCenter.length ; i++ ) {
    let P = PontosRectCenter[i]
    if(i < PontosRectCenter.length - 1) {
      let Pi = PontosRectCenter[i+1]
      centro += (P[0] * Pi[1]) - (Pi[0] * P[1]) 
    } else {
      let Pi = PontosRectCenter[0]
      centro += (P[0] * Pi[1]) - (Pi[0] * P[1]) 
    }
  }

  return centro/2
}

function adaptarPontos() { // adapta os pontos à mudança de posição das linhas
  pontos = []
  for(let i = 0; i < linhas.length; i++) {
    let L = linhas[i]
    L[0] = L[0];
    L[1] = L[1];
    L[2] = L[2];
    L[3] = L[3];
    linhas[i] = L

    pontos[i] = [L[0], L[1]]
    pontos[i + 1] = [L[2], L[3]]
  }
  desenharRect()
}

function centralizar() { // altera as posições das linhas se adaptando ao centro do poligono
    let x = pegarCentroX()
    let y = pegarCentroY()
    for(let i = 0; i < linhas.length; i++) {
      let L = linhas[i]
      L[0] = L[0] - x;
      L[1] = L[1] - y;
      L[2] = L[2] - x;
      L[3] = L[3] - y;
      linhas[i] = L
    }
}

function desenharVetorSoma() {
  push()
  strokeWeight(5);
  stroke(0)
  fill(0)
  line( pontos[0][0], 
        pontos[0][1],  
        pontos[pontos.length - 1][0],  
        pontos[pontos.length - 1][1] ) 

  let angulo = atan2(pontos[0][1] - pontos[pontos.length - 1][1], 
                     pontos[0][0] - pontos[pontos.length - 1][0]); 
  translate(pontos[pontos.length -1][0], pontos[pontos.length - 1][1]); 
  rotate(angulo-HALF_PI);
  triangle(-10*0.5, 10, 10*0.5, 10, 0, -10/2);

  pop()
  
  push()
  strokeWeight(0);
  fill(255)
  circle( pontos[0][0], pontos[0][1], sizeOrigem-5 )   
  fill(0)
  resetMatrix()
  text("Soma Vetorial: " + somaVetorial.toFixed(2), -155, 40, width)
  pop()
}

function magnitude() {
  somaVetorial = 0
  
  var linhasCalculo = linhas
  // retira o zoom do vetor
  while(zoomAtivado > 0) {
    zoomOut(linhasCalculo)
    zoomAtivado -= 1
  }
  for(let i = 0; i < linhasCalculo.length; i++) {
    let L = linhasCalculo[i]
    somaVetorial += sqrt(Math.pow(L[2] - L[0], 2) + Math.pow(L[3] - L[1], 2))
  }
}

function calcularSoma() {
  calcularAtivado = true;
  desenharAtivado = false
  magnitude()
  console.log(somaVetorial)
}

function pontoFora() { // verifica se algum ponto do poligono sai da area amarela
  for(let i = 0; i < PontosRectCenter.length; i++) {
    let P = PontosRectCenter[i]
    if(P[0] > 200 || 
       P[0] < -200 ||  
       P[1] > 200 || 
       P[1] < -180) 
      return true
  }
  return false  
}

function zoomIn(flag) { // diminui o vetor dividivindo por um escalar
  for(let i = 0; i < linhas.length; i++) { 
    let L = linhas[i]
    L[0] = L[0]/2;
    L[1] = L[1]/2;
    L[2] = L[2]/2;
    L[3] = L[3]/2;
    linhas[i] = L
  }
  adaptarPontos()
  sizeOrigem = sizeOrigem/2 
}

function zoomOut(vetorLinhas) { // aumenta o vetor multiplicando por 1 escalar
  for(let i = 0; i < vetorLinhas.length; i++) {
    let L = vetorLinhas[i]
    L[0] = L[0]*2;
    L[1] = L[1]*2;
    L[2] = L[2]*2;
    L[3] = L[3]*2;
    vetorLinhas[i] = L
  }
  adaptarPontos()
  sizeOrigem = sizeOrigem*2
}



function zoom() { // adapta os vetores no espaço amarelo
  while(zoomAtivado > 0) {
    zoomOut(linhas)
    zoomAtivado -= 1
  } 
  

  while(pontoFora()) {
    zoomIn()
    zoomAtivado += 1
  }
}

function randomizarVetores() { // randomiza as linhas dos vetores
  
  let randomLinhas = []
  let Rcolor = []
  
  let linhasPos = []
  while(linhasPos.length < linhas.length) {
    let pos = int(random(0, linhas.length));
    while(linhasPos.includes(pos)) pos = int(random(0, linhas.length));
    linhasPos.push(pos)
  }

  
  for(let i = 0; i < linhasPos.length; i++) {
    let L = linhas[linhasPos[i]];
    let C = corLinha[linhasPos[i]] // pega a cor da linhas
    let valor = int(random(-width/2, width/2))
    
    if(i == 0) { 
      L[0] = L[0] + valor;
      L[1] = L[1] + valor;
      L[2] = L[2] + valor;
      L[3] = L[3] + valor;
      
    } else {
      let LAnt = randomLinhas[i - 1]; // pega as coordenadas do vetor anterior 
      
      let x = L[0];
      let y = L[1];
      
      L[0] = LAnt[2]; // atualiza com as coordenadas de 
      L[1] = LAnt[3]; // origim do atual com as de destino da anterior
      
      x = L[0] - x
      y = L[1] - y
      
      L[2] = L[2] + x;
      L[3] = L[3] + y;
    }
    randomLinhas.push(L)
    Rcolor.push(C)
  }
  
  linhas = randomLinhas
  corLinha = Rcolor
  
  adaptarPontos()
  centralizar()
  adaptarPontos()
  zoom()
}

function mousePressed()  {

  if(mouseY < height - 80 && 
     mouseY > height - (height - 50) && 
     mouseX > width - (width - 40) && mouseX < width - 40) { 
   if( mouseButton === 'left' && desenharAtivado) {
      let P = [ mouseX - width/2, height/2 - mouseY ]
      pontos.push( P )
    }
    
    if(pontos.length > 1 && desenharAtivado) {
      let L = [pontos[pontos.length - 2][0], 
               pontos[pontos.length - 2][1],
               pontos[pontos.length - 1][0],
               pontos[pontos.length - 1][1]]
      let cor = [random(255), random(255), random(255)]
      linhas.push( L )
      corLinha.push( cor )
    }
  }
  
}

function drawBackground(){ 
  
  fill(251, 209, 72)
  rect(width - (width - 20), 
       width - (width - 30), 
       height - 40, 
       height-90);
  
  line(0,width - 60,height-0,height-60)
  desenhar = createButton('Desenhar');
  desenhar.position(width - 100, height - 40);
  if(!desenharAtivado) desenhar.mousePressed(ativarDesenhar);
  
  desenhar = createButton('Limpar');
  desenhar.position(width - 170, height - 40);
  if(pontos.length > 0) desenhar.mousePressed(limpar);
  
  
  desenhar = createButton('Embaralhar');
  desenhar.position(width - 350, height - 40);
  if(linhas.length > 0 && calcularAtivado) desenhar.mousePressed(randomizarVetores);

  desenhar = createButton('Calcular');
  desenhar.position(width - 250, height - 40);
  if(linhas.length > 1 && desenharAtivado) desenhar.mousePressed(calcularSoma);

  translate( width/2, height/2)
  scale( 1, -1 )
}

function draw() {
  background(178, 234, 112);
  drawBackground();
  
  desenharLinhas()
  desenharPontos()
  if(calcularAtivado) desenharVetorSoma() 
  
  textSize(12);
  textAlign(CENTER);
  
  if(desenharAtivado) {
    fill(0);
    resetMatrix()
    text('Clique no quadrado amarelo para desenhar os vetores!',0, 12, width);
  } else {
    fill(0);
    resetMatrix()
    text('Clique no botão Desenhar para começar!',0, 12, width);
  }
  
}