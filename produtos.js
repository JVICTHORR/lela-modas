// ===== PRODUTOS DA LÉLA MODAS =====
// Para cada peça: id único, n=nome, c=categoria (0 Vestidos/Conjuntos, 1 Blusas/Camisetas, 2 Calças/Jeans, 3 Calçados/Acessórios; para duas categorias use lista, ex: c:[0,1]),
// p=preço, top=1 aparece em "Mais bem avaliados", stock=unidades, imgs=lista de fotos (a 1ª aparece no card).
// Peça com cores: troque imgs por cores:[{n:'Branco',hex:'#F2EEDF',imgs:[...]}, {n:'Chocolate',hex:'#5A3825',imgs:[...]}] (a 1ª cor é a padrão).
const PRODUCTS = [
 {id:24,n:'Conjunto de Renda Importado',c:[0,1,2],p:219.90,top:0,stock:12,cores:[
  {n:'Branco',hex:'#F2EEDF',imgs:['img/conjunto-renda-branco-1.jpg','img/conjunto-renda-branco-2.jpg','img/conjunto-renda-branco-3.jpg']},
  {n:'Chocolate',hex:'#5A3825',imgs:['img/conjunto-renda-chocolate-1.jpg','img/conjunto-renda-chocolate-2.jpg','img/conjunto-renda-chocolate-3.jpg','img/conjunto-renda-chocolate-4.jpg']}
 ]},
 {id:23,n:'Conjunto Completo com Jaqueta, Blusa e Calça',c:[0,1,2],p:249.90,top:0,stock:12,imgs:['img/conjunto-jaqueta-calca-1.jpg','img/conjunto-jaqueta-calca-2.jpg','img/conjunto-jaqueta-calca-3.jpg','img/conjunto-jaqueta-calca-4.jpg']},
 {id:21,n:'Blusa Pedra de Espelho',c:[0,1],p:139.90,top:0,stock:12,imgs:['img/blusa-pedra-espelho-1.jpg','img/blusa-pedra-espelho-2.jpg','img/blusa-pedra-espelho-3.jpg']},
 {id:22,n:'Calça Vinho',c:[0,2],p:149.90,top:0,stock:12,imgs:['img/calca-vinho-1.jpg','img/calca-vinho-2.jpg','img/calca-vinho-3.jpg']},
 {id:20,n:'Vestido Short Listrado Rosa com Detalhe Dourado',c:[0,1],p:119.90,top:0,stock:12,imgs:['img/vestido-short-listrado-1.jpg','img/vestido-short-listrado-2.jpg','img/vestido-short-listrado-3.jpg']},
 {id:19,n:'Conjunto Vermelho com Brilhos e Short',c:[0,1],p:189.90,top:0,stock:12,imgs:['img/conjunto-vermelho-brilho-1.jpg','img/conjunto-vermelho-brilho-2.jpg','img/conjunto-vermelho-brilho-3.jpg']},
 {id:18,n:'Conjunto Azul com Brilhos e Short',c:[0,1],p:169.90,top:0,stock:12,imgs:['img/conjunto-azul-brilho-1.jpg','img/conjunto-azul-brilho-2.jpg','img/conjunto-azul-brilho-3.jpg']},
 {id:17,n:'Vestido Longo Amarelo com Pedraria',c:0,p:159.99,top:0,stock:12,imgs:['img/vestido-amarelo-pedraria-1.jpg','img/vestido-amarelo-pedraria-2.jpg']},
 {id:1,n:'Vestido Midi Floral',c:0,p:189,top:1,stock:12,imgs:[]},
 {id:2,n:'Blusa Crepe Manga Longa',c:1,p:99,top:1,stock:12,imgs:[]},
 {id:3,n:'Conjunto Alfaiataria',c:0,p:259,top:1,stock:12,imgs:[]},
 {id:4,n:'Saia Plissada Elegance',c:2,p:129,top:1,stock:12,imgs:[]},
 {id:5,n:'Vestido Longo Cetim',c:0,p:299,top:1,stock:12,imgs:[]},
 {id:6,n:'Macacão Pantalona',c:0,p:229,top:1,stock:12,imgs:[]},
 {id:7,n:'Top Cropped Tricot',c:1,p:79,top:1,stock:12,imgs:[]},
 {id:8,n:'Jaqueta Jeans Oversized',c:1,p:219,top:1,stock:12,imgs:[]},
 {id:9,n:'Camisa Algodão Premium',c:1,p:149,top:1,stock:12,imgs:[]},
 {id:10,n:'Calça Pantalona Linho',c:2,p:179,top:1,stock:12,imgs:[]},
 {id:11,n:'Shorts Alfaiataria Cinto',c:2,p:119,top:1,stock:12,imgs:[]},
 {id:12,n:'Tênis Casual Feminino',c:3,p:199,top:1,stock:12,imgs:[]},
 {id:13,n:'Vestido Tubinho Canelado',c:0,p:139,top:0,stock:12,imgs:[]},
 {id:14,n:'Body Manga Longa',c:1,p:89,top:0,stock:12,imgs:[]},
 {id:15,n:'Regata Ribana',c:1,p:59,top:0,stock:12,imgs:[]},
 {id:16,n:'Blusa Cetim Gola Laço',c:1,p:129,top:0,stock:12,imgs:[]}
];
