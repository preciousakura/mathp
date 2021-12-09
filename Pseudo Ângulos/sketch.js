function setup() {
  createCanvas(600, 600);
}


let pontos = [] // pontos 
let pontosPseudoangulos = [] // pontos 
let linhas = [[125, 0, 125, 125], 
              [125, 125, 0, 125], 
              [0, 125, -125, 125], 
              [-125, 125, -125, 0], 
              [-125, 0, -125, -125],
              [-125, -125, 0, -125],
              [0, -125, 125, -125],
              [125, -125, 125, 0]] // pontos 
let octante = 0
let octantes = []
let vetorNulo = false
let pseudo = 0
let pseudoCoss = 0

function limpar() {
  pontos = []
  pontosPseudoangulos = [] 
  octante = 0
  pseudo = 0
  octantes = []
}

function magnitude(ponto) {
  return sqrt(ponto[0]*ponto[0] + ponto[1]*ponto[1])
} 

function magnitudePontos(p1, p2) {
  return sqrt(Math.pow((p2[0] - p1[0]), 2) + 
              Math.pow((p2[1] - p1[1]), 2))
} 

function prodEsc(u, v) {
  return u[0] * v[0] + u[1] * v[1]
}

function pseudoCos(v, u) {
  let pcos = prodEsc(v, u) / (magnitude(v) * magnitude(u));
  pcos = pcos < -1 ? -1 : pcos;
  pcos = pcos > 1 ? 1 : pcos;
  return 1 - pcos;
}

function octante12(ponto) {
  let P = [0, 0]
  if(ponto[0] > ponto[1]) {
    octante = 0
    
    P = [125, 125 * ponto[1]/ponto[0]]
  } else {
    octante = 1
    P = [(125 * ponto[0]/ponto[1]), 125]
  }
  pontosPseudoangulos.push(P)
}

function octante34(ponto) {
  let P = [0, 0]
  if(-1 * ponto[0] > ponto[1]) {
    octante = 3
    P = [-125, (-125 * ponto[1]/ponto[0])]
  } else {
    octante = 2
    P = [(125 * ponto[0]/ponto[1]), 125]
  }
  pontosPseudoangulos.push(P)
}

function octante56(ponto) { 
  let P = [0, 0]
  if(ponto[0] > ponto[1]) {
    octante = 5
    P = [(-125 * ponto[0]/ponto[1]), -125]
  } else {
    octante = 4
    P = [-125, (-125 * ponto[1]/ponto[0])]
  }
  pontosPseudoangulos.push(P)
}

function octante78(ponto) {
  let P = [0, 0]
  if(ponto[0] > -ponto[1]) {
    octante = 7
    P = [125, 125 * ponto[1]/ponto[0]]
  } else {
    octante = 6
    P = [-125 * ponto[0]/ponto[1], -125]
  }
  pontosPseudoangulos.push(P)
}

function calcularAnguloPE(u, v) {
  let pe = prodEsc(u, v)
  let magU = magnitude(u)
  let magV = magnitude(v)
  let cos = pe / (magU * magV)

  cos = cos >  1.0 ?  1.0 : cos
  cos = cos < -1.0 ? -1.0 : cos
  
  return acos(cos) * 180 / PI
}

function prodVet(u, v) {
  return u[0] * v[1] - v[0] * u[1]
}

function calcularAnguloPV(u, v) {
  let pv = prodVet(u, v)
  let magU = magnitude(u)
  let magV = magnitude(v)
  let cos = pv / (magU * magV)
  
  return asin(cos) * 180 / PI
}

function desenharPontos() { // desenha os pontos na tela
  fill(208, 98, 36)
  for( i=0 ; i<pontosPseudoangulos.length ; i++ ) {
    let P = pontosPseudoangulos[i] // 
    let ponto = pontos[i] // 
    
    if(ponto[0] > -125 && 
       ponto[0] < 125 &&
       ponto[1] > -125 && 
       ponto[1] < 125) {
      line(ponto[0], ponto[1], P[0], P[1])
    }
      
    circle(P[0], P[1], 10)  
    
  }
}

function desenharLinhas() {
  if(octantes.length >= 1 && octantes.length < 2) {
    for( i = 0; i < octante; i++ ) {
      let L = linhas[i]
      push()
        stroke(0)
        strokeWeight(3)
        line(L[0], L[1], L[2], L[3])
      pop()
    }
  
    let P = pontosPseudoangulos[0]
    let L = octantes[0] > 0 ? linhas[octantes[0] - 1] : [0, 0, 125 ,0]
    L = [L[2], L[3]]

    push()
      stroke(0)
      strokeWeight(3)
      line(L[0], L[1], P[0], P[1])
    pop()
    
    pseudo = octante + (magnitudePontos(P, L)/125)
    
    
  } else if(octantes.length >= 2) {
    let P1 = pontosPseudoangulos[0]
    let P2 = pontosPseudoangulos[1]

    if(P1[0] == P2[0] &&
      ((P1[1] > 0 && P2[1] > 0) ||  
       (P1[1] < 0 && P2[1] < 0))) {
      push()
        stroke(0)
        strokeWeight(3)
        line(P1[0], P1[1], P2[0], P2[1])
      pop()
      
      pseudo = (magnitudePontos(P1, P2)/125)
      
    } else if(P1[1] == P2[1] &&
            ((P1[0]> 0 && P2[0]> 0) ||  
             (P1[0]< 0 && P2[0]< 0))) {
      push()
        stroke(0)
        strokeWeight(3)
        line(P1[0], P1[1], P2[0], P2[1])
      pop()    
      
      pseudo = (magnitudePontos(P1, P2)/125)
    } else {       
      let inicio = octantes[0] > 6 ? octantes[0] : octantes[0] + 1
      let fim = octantes[1]

      if(inicio > fim) {
        inicio = octantes[1] + 1
        fim = octantes[0] 

        P1 = pontosPseudoangulos[1]
        P2 = pontosPseudoangulos[0]
      }

      let L1 = linhas[inicio]
      let L2 = linhas[fim > 0 ? fim - 1 : 0]

      for( i = inicio; i < fim; i++ ) {
        let L = linhas[i]
        push()
          stroke(0)
          strokeWeight(3)
          line(L[0], L[1], L[2], L[3])
        pop()
      }
      
      L1 = [L1[0], L1[1]]
      L2 = [L2[2], L2[3]]

      push()
        stroke(0)
        strokeWeight(3)
        line(P1[0], P1[1],
             L1[0], L1[1])

        line(P2[0], P2[1],
             L2[0], L2[1])
      pop()
      
      let rP1 = (magnitudePontos(P1, L1)/125)
      let rP2 = (magnitudePontos(P2, L2)/125)
      
      octante = fim - inicio
      
      pseudo = octante > 0 ? octante + rP1 + rP2 : rP1 + rP2
    }
  }
} 

function desenharVetores() { // desenha os pontos na tela
  let angulo = 0
  for( i=0 ; i<pontos.length ; i++ ) {
    let P = pontos[i] // 
    push()
      stroke(0)
      strokeWeight(3)
      fill(0)

      line(0, 0, P[0], P[1])
      angulo = atan2(0 - P[1], 
                     0 - P[0]); 
      translate(P[0], P[1]); 
      rotate(angulo-HALF_PI);
      triangle(-5*0.5, 5, 5*0.5, 5, 0, -5/2);
    pop()
    
  }
}

function mousePressed()  {

  if(mouseY < 540 && 
     mouseY > 60 && 
     mouseX >  60 && 
     mouseX < 540) { 
     if( mouseButton === 'left') {
      if(pontos.length > 1) limpar()
      let x = int(mouseX - width/2)
      let y = int(height/2 - mouseY)

      if( x === 0 &&  y === 0) {
        vetorNulo = true
        limpar()
      } else {
        let P = [ x, y ]
        pontos.push( P )
        if(x >= 0 && y >= 0) octante12(pontos[pontos.length - 1])
        else if(x <= 0, y >= 0) octante34(pontos[pontos.length - 1])
        else if(x <= 0 && y <= 0) octante56(pontos[pontos.length - 1])
        else if(x >= 0 && y <= 0) octante78(pontos[pontos.length - 1])
        octantes.push(octante)
        vetorNulo = false
      }
    }
  }
}


function drawBackground(){ 
  fill(233, 200, 145)
  
  
  push()
    strokeWeight(1)
    rect(50, 
       50, 
       height-100, 
       height-100);
  pop()
  

  
  square(175,175,250)
  circle(width/2,height/2,100)
  
  
  push()
  
   // eixo horizontal
  strokeWeight(2)
  stroke(174, 67, 30)
  fill(174, 67, 30)
  line(51, height/2,  width-51, height/2)
  beginShape();
    vertex( width-60, height/2+2);
    vertex( width-51   , height/2  );
    vertex( width-60, height/2-2);  
  endShape(CLOSE);
  
  // vertical
  stroke(138, 134, 53)
  fill(138, 134, 53)
  line( width/2, 51,  width/2, height-51)
  beginShape();
    vertex( width/2+2, 60);
    vertex( width/2  ,  51);
    vertex( width/2-2, 60);  
  endShape(CLOSE);

  pop()

  translate( width/2, height/2)
  scale( 1, -1 )

}

function draw() {
  background(208, 98, 36);
  drawBackground();
  desenharVetores()
  desenharLinhas()
  desenharPontos()

  let anglePE = 0
  let anglePV = 0
  
  if(pontos.length >= 2) {
    anglePE = calcularAnguloPE(pontos[0], pontos[1])
    anglePV = calcularAnguloPV(pontos[0], pontos[1]) < 0.0 ? -anglePE : anglePE
    pseudoCoss = pseudoCos(pontos[0], pontos[1])

  }
  console.log(pseudoCoss)
  textSize(12);
  textAlign(CENTER);

  resetMatrix()
  fill(0)
  textSize(14)
  
  if(vetorNulo) {
    text("O vetor não pode ser nulo! Tente Novamente!", width/2, 30)
  } else {
    text("Ângulo (Produto Escalar): " + anglePE.toFixed(2) + "°", width/4 + 25, 30)
    text("Ângulo (Produto Vetorial): " + anglePV.toFixed(2) + "°", width-150 - 25, 30)
    
    text("Pseudoangulo: " + pseudo.toFixed(2), width/4 + 25, 580)
    text("Pseudo Cos: " + pseudoCoss.toFixed(2), width-150 - 25, 580)
  }

}
