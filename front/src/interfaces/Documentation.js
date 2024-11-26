// import React from "react";
// import { Header } from "../components/Header.js"
// import { Background } from '../components/Background.js';

// export const Documentation = () => {

	// return(
	// 	<div className="App">
	// 		<Header/>
	// 		<Background>
	// 			<text>Documentation</text>
	// 		</Background>
	// 	</div>
	// )

// };

import React, { useEffect } from "react";
import styled from "styled-components";
import { Header } from "../components/Header.js"
import { Background } from '../components/Background.js';
import { ScrollContainer } from '../components/ScrollContainer.js';
import { Colors } from "../utils/colors.js";

export const Documentation = () => {
  return (
		<div>
			<ScrollToSection />
			<Header/>
			<Background>
				<Container>
					<Sidenav>
						<ScrollContainer>
							<a href="#boolean-algebra">Algebra Booleana</a>
							<a href="#boolean-algebra-truth-table">Tabela verdade e expressões booleanas</a>
							<a href="#boolean-algebra-min-max">Mintermos e Maxtermos</a>
							<a href="#boolean-algebra-min-max-minterm">Mintermos</a>
							<a href="#boolean-algebra-min-max-maxterm">Maxtermos</a>
							<a href="#boolean-algebra-example">Exemplo</a>
							<a href="#boolean-algebra-karnaugh">Mapas de Karnaugh</a>
							<a href="#boolean-algebra-exercise">Exercício</a>
							<a href="#combinatorial-circuits">Circuitos Combinatórios</a>
							<a href="#combinatorial-circuits-nand">NAND</a>
							<a href="#combinatorial-circuits-not">NOT</a>
							<a href="#combinatorial-circuits-and">AND</a>
							<a href="#combinatorial-circuits-or">OR</a>
							<a href="#combinatorial-circuits-nor">NOR</a>
							<a href="#combinatorial-circuits-xor">XOR</a>
							<a href="#boolean">Mintermos</a>
							<a href="#">Link</a>
						</ScrollContainer>
					</Sidenav>

					<Content>
						<ScrollContainer>
							<Padding>
								<ContentTitle>NANDesis.io Docs</ContentTitle>

								<Section id="boolean-algebra">
									<h1>1. Algebra Booleana</h1>
									<p>É uma forma de representar equações cujas variáveis apenas podem assumir valores binários (ex: 1 ou 0, verdadeiro ou falso, etc.), fazendo uso de operações lógicas simples para manipular estes valores. Essas operações são a negação (NÃO ou ~), a conjunção (E ou +) e a disjunção (OU).</p>
									<p>A aplicação dela se dará no contexto de circuitos lógicos, em que a partir de estruturas lógicas básicas, é possível construir elementos lógicos mais complexos, como processadores. Essas portas serão estudadas mais detalhadamente na seção de circuitos combinatórios.</p>
									<p>Um dos aspectos fundamentais para compreender a álgebra booleana é via a aplicação de identidades, similarmente ao que é observado na matemática. As principais para o entendimento são as propriedades aditivas e as multiplicativas, referentes aos conceitos de disjunção e conjunção, respectivamente.</p>
									<IdentityTable/>
									<Obs>Existem diversas formas de escrever equações booleanas, por exemplo, a representação A × A também pode ser escrita como AA, com ~A também podendo ser equivalente a Ā.</Obs>
									<p>Outro aspecto fundamental a ser aprendido são as leis relativas às propriedades de equações lógicas: comutatividade, associatividade e distributividade.</p>
									<LogicEquasionsTable/>
									<p>Por fim, a última ferramenta a ser apresentada é o teorema de De Morgan: A negação (ou complemento) de uma conjunção (produto - E) de variáveis é igual a disjunção (soma - OU) dos complementos das variáveis, assim como o complemento ou negação de uma disjunção de variáveis é igual a conjunção dos complementos das variáveis.</p>
									<DeMorganTable/>
									<p>Com esse conhecimento, é possível aplicar as regras de identidade junto a essas propriedades de forma a simplificar equações booleanas, para assim facilitar a construção de futuros circuitos lógicos.</p>
								</Section>

								<Section id="boolean-algebra-truth-table">
									<h2>1.1. Tabela verdade e expressões booleanas</h2>
									<p>O próximo passo para a construção de circuitos digitais é a transformação de uma tabela verdade em uma expressão booleana.</p>
									<p>Essa representação pode ser efetuada de diversas formas, mas uma metodologia simples de ser feita é via a transformação dos inputs de cada linha da tabela verdade em um fragmento de uma expressão booleana, assim representando todos os possíveis outputs do circuito.</p>
									<p>Para essa resolução, geralmente estes fragmentos são os mintermos e maxtermos, que serão comentados a seguir:</p>
								</Section>
								<Section id="boolean-algebra-min-max">
									<h2>1.2. Mintermos e Maxtermos</h2>
									<p>Uma forma eficiente de converter uma tabela verdade em uma equação lógica simplificada é via o uso da soma de mintermos e do produto de maxtermos. Para isso, uma função/equação lógica é reescrita de forma a destacar as variáveis no formato de soma de produtos (mintermos) ou no produto de somas (maxtermos) via o estudo dos possíveis valores de input e outputs.</p>
								</Section>
								<Section id="boolean-algebra-min-max-minterm">
									<h3>1.2.1. Mintermos</h3>
									<p>Para o caso de mintermos, cada linha deve ser transformada em uma multiplicação de variáveis de entrada (ou seja, E), em que caso o valor de entrada seja 1, o valor da variável de entrada não deve ser negada, e caso o valor de entrada seja 0 ela deve ser invertida.</p>
									<p>A partir disso, cada um desses mintermos com valor de saída equivalente a 1 deve ser somado (ou seja, OU) para então formar uma equação de álgebra booleana que poderia ser consequentemente simplificada via os métodos estudados previamente.</p>
								</Section>
								<Section id="boolean-algebra-min-max-maxterm">
									<h3>1.2.2. Maxtermos</h3>
									<p>Para o caso de maxtermos, o inverso deve ser feito, onde cada linha deve ser transformada em uma soma de variáveis de entrada (ou seja, OU), em que caso o valor de entrada seja 0, o valor da variável de entrada não deve ser negada, e caso o valor de entrada seja 1 ela deve ser invertida.</p>
									<p>A partir disso, cada um desses mintermos com valor de saída equivalente a 0 deve ser multiplicado (ou seja, E) para então formar uma equação de álgebra booleana que poderia ser consequentemente simplificada via os métodos estudados previamente.</p>
								</Section>
								<Section id="boolean-algebra-example">
									<h2>1.3. Exemplo</h2>
									<p>Um exemplo de mintermos e maxtermos pode ser observado na seguinte tabela:</p>
									<MaxMinExempleTable/>
									<p>Assim, a tabela verdade pode ser representada pela soma dos mintermos ou produto dos maxtermos.</p>
								</Section>
								<p>Assim, a tabela verdade pode ser representada pela soma dos mintermos ou produto dos maxtermos.</p>
								<Section id="boolean-algebra-karnaugh">
									<h2>1.4. Mapas de Karnaugh</h2>
									<p>Também chamados de K-maps, são diagramas utilizados para converter uma tabela verdade em sua representação de circuito lógico ou simplificar uma equação lógica. Para isso, será necessário um conhecimento prévio sobre o tema de conjuntos, haja vista que a mesma lógica aplicada a diagramas de Venn é observada para a álgebra booleana.</p>
									<p>Uma figura ilustrativa de um mapa de Karnaugh pode ser observada abaixo.</p>
									<ImageStyle src={"/images/docs/Karnaugh01.png"} alt=""/>
									<p>A sua construção se baseia nos possíveis valores obtidos das variáveis da função booleana, com construções com mais de duas variáveis sendo também possíveis (ex: com as variáveis A, B, C e D, as colunas são relativas às entradas A e B, e as linhas são equivalentes as possíveis permutações de C e D).</p>
									<ImageStyle src={"/images/docs/Karnaugh02.png"} alt=""/>
									<p>As células que compõem as tabelas devem ser preenchidas com o valor lógico de cada linha da tabela verdade referente a função a ser simplificada (0 e 1).</p>
									<ImageStyle src={"/images/docs/Karnaugh03.png"} alt=""/>
									<p>Uma vez com o mapa construído, é possível agrupar valores equivalentes a 1, gerando uma soma de elementos (ex: soma de produtos), possibilitando identificar outputs que resultam na equação booleana mais simples possível referente a função inicial, com a mesma lógica se aplicando ao produto de somas (mas selecionando células com 0). Ademais, como princípio, quanto maior for o agrupamento, maior será a simplificação obtida.</p>
									<p>Uma propriedade interessante dos mapas de Karnaugh é a capacidade de “unir” arestas opostas de um mapa, possibilitando que laterais opostas possam ser agrupadas.</p>
									<ImageStyle src={"/images/docs/Karnaugh04.png"} alt=""/>
									<p>Uma vez com os maxtermos (ou mintermos) escolhidos, é relativamente mais simples realizar a simplificação da equação booleana para então construir um circuito lógico.</p>
								</Section>
								<Section id="boolean-algebra-exercise">
									<h2>1.5. Exercício</h2>
									<p>Minimize o seguinte mapa de Karnaugh de forma a encontrar a melhor simplificação, explicitando se a forma encontrada foi via mintermos ou maxtermos:</p>
									<ImageStyle src={"/images/docs/KarnaughExercise.png"} alt=""/>
									<b>Solução:</b>
									<p>A simplificação foi encontrada via a soma de produtos, sendo ela:</p>
									<Formula>Saída=(B×¬C×¬D)+(¬B×¬C×D)+(¬A×¬B×C)</Formula>
									<p>Deve-se notar que a utilização do produto de somas resultaria um uma simplificação inferior a encontrada via soma de produtos.</p>
								</Section>

								<Section id="combinatorial-circuits">
									<h2>2. Circuitos Combinatórios</h2>
									<Obs>Com relação às terminologias utilizadas nas seguintes descrições, podem ser consideradas equivalentes neste contexto:</Obs>
									<CombinatorialCircuitsTable/>
								</Section>
								<Section id="combinatorial-circuits-nand">
									<h2>2.1. NAND</h2>
									<p>A porta NAND é a porta universal inicial do NANDesis.io, essa porta lógica já foi fornecida no simulador e com ela é possível construir todos os componentes necessários para se criar um processador.</p>
									<p>Seu funcionamento é simples: ela possui duas (ou mais) entradas e uma saída, com o valor da saída sendo representada por “NOT ((entrada A) AND (entrada B))”, ou seja, a saída possui valor falso (0) quando ambas as suas entradas A e B forem verdadeiras (1), e quaisquer outras entradas retornará uma saída verdadeira.</p>
									<p>É possível representar sua tabela verdade da seguinte forma:</p>
									<NandTable/>
									<p>A partir deste conhecimento, é possível construir outras portas lógicas e componentes. Assim, os itens seguintes vão atuar como introduções teóricas para aumentar o seu repertório e permitir a criação de diversos circuitos lógicos, permitindo até mesmo atingir o nível de um processador.</p>
								</Section>
								<Section id="combinatorial-circuits-not">
									<h2>2.2. NOT</h2>
									<p>A porta lógica NOT é de grande utilidade, podendo, em essência, inverter um sinal lógico. Ou seja, uma entrada verdadeira (1) terá uma saída falsa (0), com a mesma lógica sendo aplicada para uma entrada falsa.</p>
									<p>É possível representar sua tabela verdade da seguinte forma:</p>
									<NotTable/>
									<p>Com base nisso, já é possível começar a imaginar como seria a criação da porta NOT com uma NAND atuando como sua base. Observa-se na tabela verdade do item anterior um comportamento similar ao desejado:</p>
									<NandNotTable/>
									<p>Ao alimentar simultaneamente um mesmo sinal nas entradas A e B do elemento NAND, a saída encontrada é o inverso do sinal inicial. Sendo possível, portanto, criar a porta NOT via a manipulação das entradas de uma porta NAND.</p>
									<p>Como exemplo, a criação no simulador seria executada da seguinte forma:</p>
									<ImageStyle src={"/images/docs/NotCircuit.png"} alt=""/>
									<p>Agora contendo duas portas lógicas ao seu dispor, este mesmo tipo de exercício lógico pode ser aplicado para a criação de outros componentes.</p>
								</Section>

								<Section id="combinatorial-circuits-and">
									<h2>2.3. AND</h2>
									<p>A porta AND pode ser considerada o inversa da porta NAND: ela também possui duas (ou mais) entradas e uma saída, com o valor da saída sendo representada por “(entrada A) E (entrada B)”, ou seja, a saída possui valor verdadeiro (1) quando todas as entradas forem verdadeiras (1), e quaisquer outras variações de inputs retornarão uma saída falsa.</p>
									<p>É possível representar sua tabela verdade da seguinte forma:</p>
									<AndTable/>
									<p>Observa-se, portanto, que o comportamento desejado pode ser obtido via manipulação de múltiplas portas NAND concatenadas, com a saída da primeira alimentando as duas entradas da segunda porta (ou seja, o equivalente a adição de uma porta NOT na saída de uma NAND).</p>
									<Formula>A AND B = NOT (NAND (A, B)) , sendo que: NAND (A, B) = NOT (A AND B)</Formula>
									<p>Portanto,</p>
									<Formula>A AND B = NOT (NOT (A AND B))</Formula>
								</Section>

								<Section id="combinatorial-circuits-or">
									<h2>2.4. OR</h2>
									<p>A porta OR é construída com duas ou mais entradas, em que caso pelo menos uma entrada seja verdadeira, a saída também retornará 1. Ou seja, o valor da saída é definido via “(entrada A) OU (entrada B)” no caso de uma porta com duas entradas.</p>
									<p>É possível representar sua tabela verdade da seguinte forma:</p>
									<OrTable/>
									<p>Para induzir o seu desenvolvimento a partir de uma porta NAND, é possível estudar as propriedades de sua tabela:</p>
									<NandTable/>
									<p>Com base nisso, observa-se que a inversão dos sinais de entrada seria uma das possíveis soluções para a criação de uma porta OR.</p>
								</Section>
								<Section id="combinatorial-circuits-nor">
									<h2>2.5. NOR</h2>
									<p>Similarmente a relação de uma porta AND com o seu inverso (NAND), o mesmo comportamento é observado com a porta OR e o seu inverso (NOR). O valor da saída é definido via “NOT  ((entrada A) OU (entrada B))” no caso de uma porta com duas entradas.</p>
									<p>É possível representar sua tabela verdade da seguinte forma:</p>
									<NorTable/>
								</Section>
								<Section id="combinatorial-circuits-xor">
									<h2>2.6. XOR</h2>
									<p>O funcionamento de uma porta OU Exclusiva pode ser descrita como um elemento de duas ou mais entradas em que caso o número de entradas verdadeiras for ímpar, a saída será verdadeira, e caso o número for ímpar, a saída será falsa.</p>
									<p>É possível representar sua tabela verdade da seguinte forma:</p>
									<XorTable/>
									<p>A porta lógica XOR é mais interessante no quesito didático, pois requer maior conhecimento de álgebra booleana quando comparada com os itens anteriormente discutidos. Como aspecto introdutório, estão listadas a seguir três possíveis representações de uma porta XOR com 2 inputs fazendo uso apenas de portas AND, OR e NOT provenientes da análise da tabela verdade anterior:</p>
									<Formula>(A AND NOT B) OR      (NOT A AND     B)</Formula>
									<Formula>(A OR      B) AND     (NOT A OR  NOT B)</Formula>
									<Formula>(A OR      B) AND NOT (    A AND     B)</Formula>
									<Obs>Existem outras possíveis formas de montar uma porta XOR, inclusive com apenas elementos NAND (é recomendado tentar diversas combinações).</Obs>
									<p>Fora de um contexto apropriado, seu uso pode parecer pouco intuitivo, mas ao estudar elementos futuros como ADDERS pode ajudar a melhor compreender sua funcionalidade.</p>
								</Section>

								<Section id="complex-combinatorial-circuits">
									<h1>3. Circuitos combinatórios complexos</h1>
								</Section>
								<Section id="complex-combinatorial-circuits-mux-nx1">
									<h1>3.1. Multiplexadores - MUX nx1 (Multiplexers)</h1>
									<p>Multiplexadores são circuitos combinatórios que, em geral, permitem a seleção de uma entrada entre diversos inputs baseados em um sinal de controle. Mais especificamente, para cada n possíveis entradas, log2(n) seletores são necessários para realizar a escolha.</p>
									<p>Iniciando de forma simples, um MUX 2x1 possui dois bits de entrada, um bit seletor e uma saída. Seu funcionamento se baseia no sinal de controle permitindo que um dos dois bits de entrada tenha seu valor selecionado (ex: 0 seleciona a entrada A, 1 seleciona a entrada B).</p>
									<p>É possível representar sua tabela verdade da seguinte forma:</p>
									<MuxNx1Table/>
									<p>Percebe-se então que a tabela pode ser representada pela seguinte equação booleana, permitindo também que seja desenvolvida no simulador com componentes simples previamente criados.</p>
									<Formula>Saída = (NOT seletor AND A) OR (seletor AND B)</Formula>
									<p>Assim, simplificando-se a tabela temos:</p>
									<MuxNx1CompactTable/>
									<p>O mesmo se aplica ao MUX 4x1 ou qualquer outro mais complexo.</p>
									<Mux4x1Table/>
									<p>A equação booleana se torna:</p>
									<Formula>Saída = (NOT S1 AND NOT S2 AND A) OR <br/>
														(NOT S2 AND     S2 AND B) OR <br/>
														(    S2 AND NOT S2 AND C) OR <br/>
														(    S2 AND     S2 AND D)</Formula>
									<p>Uma informação importante que deve ser adicionada sobre o uso de multiplexadores é que eles podem ser utilizados em conjunto para  criar MUXs de múltiplos bits.</p>
									<p>Uma representação de um mux 2x1 pode ser observado a seguir:</p>
									<ImageStyle src={"/images/docs/Mux2x1.png"} alt=""/>
								</Section>

								
							</Padding>
							
						</ScrollContainer>
					</Content>
					
				</Container>
			</Background>
		</div>
  );
};

const Container = styled.div`
  display: flex;
  font-family: "Inter", sans-serif;
	color: ${Colors.White}
`;

const Sidenav = styled.div`
  width: 200px;
  position: fixed;
  top: 60px;
  left: 0;
  height: calc(100vh - 80px);
  background-color: #f1f1f1;
  padding-top: 20px;

  a {
    padding: 8px 16px;
    text-decoration: none;
    color: black;
    display: block;
  }

  a:hover {
    background-color: #ddd;
    color: black;
  }
`;

const Content = styled.div`
  margin-left: 200px;
	max-height: calc(100vh - 60px);
`;

const Padding = styled.div`
  padding: 20px;
`;

const ContentTitle = styled.h1`
  font-size: 30px;
  margin-bottom: 20px;
	text-align: center;
`;

const Section = styled.section`
  margin-bottom: 40px;

  h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }

  p {
    line-height: 1.6;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    margin-bottom: 20px;

    th, td {
      border: 1px solid #ddd;
      text-align: center;
      padding: 8px;
    }
  }
`;

const ImageStyle = styled.img`
  max-height: calc(100vh - 60px);
	max-width: 100vw;
  margin-left: auto;
  margin-right: auto;
	display: block;
`;

const FormulaStyle = styled.p`
  text-align: center;
`;

const CustomTh = styled.th`
  background-color: ${({color}) => color};
	color: ${Colors.Black};
`;

const ScrollToSection = () => {
  useEffect(() => {
    // Se o ID corresponder à URL, faça o scroll até o elemento
    const hash = window.location.hash;
		console.log(hash);
		const element = document.getElementById(hash.substring(1));
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
  }, []);

  return null;
};

const Formula = ({children}) => {
	return(<FormulaStyle><em>{children}</em></FormulaStyle>)
}

const Obs = ({children}) => {
	return(<p><b>OBS: </b>{children}</p>)
}

// Tables
const Table = ({children}) => {
	return(
		<table border="1" cellspacing="0" cellpadding="8">
			{children}
		</table>
	)
}

const IdentityTable = () => {
	return(
		<Table>
			<tr>
				<td rowspan="4">Identidades aditivas</td>
				<td>A + 1 = 1</td>
				<td>A OR 1 = 1</td>
			</tr>
			<tr>
				<td>A + 0 = 0</td>
				<td>A OR 0 = 0</td>
			</tr>
			<tr>
				<td>A + A = 0</td>
				<td>A OR A = A</td>
			</tr>
			<tr>
				<td>A + ~ A = 0</td>
				<td>A OR NOT A = 0</td>
			</tr>
			<tr>
				<td rowspan="5">Identidades multiplicativas</td>
				<td>A × 1 = 1</td>
				<td>A AND 1 = 1</td>
			</tr>
			<tr>
				<td>A × 0 = 0</td>
				<td>A AND 0 = 0</td>
			</tr>
			<tr>
				<td>A × A = A</td>
				<td>A AND A = A</td>
			</tr>
			<tr>
				<td>A × ~ A = 0</td>
				<td>A AND NOT A = 0</td>
			</tr>
			<tr>
				<td>~ (~ A) = A</td>
				<td>NOT (NOT A) = A</td>
			</tr>
		</Table>
	)
}

const LogicEquasionsTable = () => {
	return(
		<Table>
			<tr>
				<td rowspan="2">Conmutatividade</td>
				<td>A + B = B + A</td>
				<td>A OR B = B OR A</td>
			</tr>
			<tr>
				<td>AB = BA</td>
				<td>A AND B = B AND A</td>
			</tr>
			<tr>
				<td rowspan="2">Associatividade</td>
				<td>A + (B + C) = (A + B) + C</td>
				<td>A OR (B OR C) = (A OR B) OR C</td>
			</tr>
			<tr>
				<td>A(BC) = (AB)C</td>
				<td>A AND (B AND C) = (A AND B) AND C</td>
			</tr>
			<tr>
				<td rowspan="2">Distributividade</td>
				<td>A(B + C) = AB + AC</td>
				<td>A AND (B OR C) = (A AND B) OR (A AND C)</td>
			</tr>
		</Table>
	)
}

const DeMorganTable = () => {
	return(
		<Table>
			<tr>
				<td rowspan="2">Teorema de De Morgan</td>
				<td>NOT (A AND B) = (NOT A) OR (NOT B)</td>
			</tr>
			<tr>
				<td>NOT (A OR B)  = (NOT A) AND (NOT B)</td>
			</tr>
		</Table>
	)
}

const MaxMinExempleTable = () => {
	return(
		<Table>
			<thead>
				<tr>
					<th>A</th>
					<th>B</th>
					<th>C</th>
					<th>Maxterno</th>
					<th>Minterno</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>0</td>
					<td>0</td>
					<td>0</td>
					<td>~A × ~B × ~C</td>
					<td>A + B + C</td>
				</tr>
				<tr>
					<td>0</td>
					<td>0</td>
					<td>1</td>
					<td>~A × ~B × C</td>
					<td>A + B + ~C</td>
				</tr>
				<tr>
					<td>0</td>
					<td>1</td>
					<td>0</td>
					<td>~A × B × ~C</td>
					<td>A + ~B + C</td>
				</tr>
				<tr>
					<td>0</td>
					<td>1</td>
					<td>1</td>
					<td>~A × B × C</td>
					<td>A + ~B + ~C</td>
				</tr>
				<tr>
					<td>1</td>
					<td>0</td>
					<td>0</td>
					<td>A × ~B × ~C</td>
					<td>~A + B + C</td>
				</tr>
				<tr>
					<td>1</td>
					<td>0</td>
					<td>1</td>
					<td>A × ~B × C</td>
					<td>~A + B + ~C</td>
				</tr>
				<tr>
					<td>1</td>
					<td>1</td>
					<td>0</td>
					<td>A × B × ~C</td>
					<td>~A + ~B + C</td>
				</tr>
				<tr>
					<td>1</td>
					<td>1</td>
					<td>1</td>
					<td>A × B × C</td>
					<td>~A + ~B + ~C</td>
				</tr>
			</tbody>
		</Table>
	)
}

const CombinatorialCircuitsTable = () => {
	return(
		<Table>
			<tr>
				<td>Verdadeiro/True</td>
				<td>Falso/False</td>
			</tr>
			<tr>
				<td>1</td>
				<td>0</td>
			</tr>
			<tr>
				<td>High</td>
				<td>Low</td>
			</tr>
			<tr>
				<td>Ativo</td>
				<td>Inativo</td>
			</tr>
		</Table>
	)
}

const NandTable = () => {
	return(
		<Table>
			<thead>
				<tr>
					<CustomTh color={Colors.DocsBlue}>Entrada A</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada B</CustomTh>
					<CustomTh color={Colors.DocsGreen}>Saída</CustomTh>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>0</td>
					<td>0</td>
					<td>1</td>
				</tr>
				<tr>
					<td>0</td>
					<td>1</td>
					<td>1</td>
				</tr>
				<tr>
					<td>1</td>
					<td>0</td>
					<td>1</td>
				</tr>
				<tr>
					<td>1</td>
					<td>1</td>
					<td>0</td>
				</tr>
			</tbody>
		</Table>
	)
}

const NotTable = () => {
	return(
		<Table>
			<thead>
				<tr>
					<CustomTh color={Colors.DocsBlue}>Entrada A</CustomTh>
					<CustomTh color={Colors.DocsGreen}>Saída</CustomTh>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>0</td>
					<td>1</td>
				</tr>
				<tr>
					<td>1</td>
					<td>0</td>
				</tr>
			</tbody>
		</Table>
	)
}

const NandNotTable = () => {
	return(
		<Table>
			<thead>
				<tr>
					<CustomTh color={Colors.DocsBlue}>Entrada A</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada B</CustomTh>
					<CustomTh color={Colors.DocsGreen}>Saída</CustomTh>
				</tr>
			</thead>
			<tbody>
				<tr>
					<CustomTh color={Colors.DocsYellow}>0</CustomTh>
					<CustomTh color={Colors.DocsYellow}>0</CustomTh>
					<CustomTh color={Colors.DocsYellow}>1</CustomTh>
				</tr>
				<tr>
					<td>0</td>
					<td>1</td>
					<td>1</td>
				</tr>
				<tr>
					<td>1</td>
					<td>0</td>
					<td>1</td>
				</tr>
				<tr>
					<CustomTh color={Colors.DocsYellow}>1</CustomTh>
					<CustomTh color={Colors.DocsYellow}>1</CustomTh>
					<CustomTh color={Colors.DocsYellow}>0</CustomTh>
				</tr>
			</tbody>
		</Table>
	)
}

const AndTable = () => {
	return(
		<Table>
			<thead>
				<tr>
					<CustomTh color={Colors.DocsBlue}>Entrada A</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada B</CustomTh>
					<CustomTh color={Colors.DocsGreen}>Saída</CustomTh>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>0</td>
					<td>0</td>
					<td>0</td>
				</tr>
        <tr>
					<td>0</td>
					<td>1</td>
					<td>0</td>
        </tr>
        <tr>
					<td>1</td>
					<td>0</td>
					<td>0</td>
        </tr>
        <tr>
					<td>1</td>
					<td>1</td>
					<td>1</td>
        </tr>
			</tbody>
		</Table>
	)
}

const OrTable = () => {
	return(
		<Table>
			<thead>
				<tr>
					<CustomTh color={Colors.DocsBlue}>Entrada A</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada B</CustomTh>
					<CustomTh color={Colors.DocsGreen}>Saída</CustomTh>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>0</td>
					<td>0</td>
					<td>0</td>
				</tr>
				<tr>
					<td>0</td>
					<td>1</td>
					<td>1</td>
				</tr>
				<tr>
					<td>1</td>
					<td>0</td>
					<td>1</td>
				</tr>
				<tr>
					<td>1</td>
					<td>1</td>
					<td>1</td>
				</tr>
			</tbody>
		</Table>
	)
}

const NorTable = () => {
	return(
		<Table>
			<thead>
				<tr>
					<CustomTh color={Colors.DocsBlue}>Entrada A</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada B</CustomTh>
					<CustomTh color={Colors.DocsGreen}>Saída</CustomTh>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>0</td>
					<td>0</td>
					<td>1</td>
        </tr>
        <tr>
					<td>0</td>
					<td>1</td>
					<td>0</td>
        </tr>
        <tr>
					<td>1</td>
					<td>0</td>
					<td>0</td>
        </tr>
        <tr>
					<td>1</td>
					<td>1</td>
					<td>0</td>
        </tr>
			</tbody>
		</Table>
	)
}

const XorTable = () => {
	return(
		<Table>
			<thead>
				<tr>
					<CustomTh color={Colors.DocsBlue}>Entrada A</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada B</CustomTh>
					<CustomTh color={Colors.DocsGreen}>Saída</CustomTh>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>0</td>
					<td>0</td>
					<td>0</td>
        </tr>
        <tr>
					<td>0</td>
					<td>1</td>
					<td>1</td>
        </tr>
        <tr>
					<td>1</td>
					<td>0</td>
					<td>1</td>
        </tr>
        <tr>
					<td>1</td>
					<td>1</td>
					<td>0</td>
        </tr>
			</tbody>
		</Table>
	)
}

const MuxNx1Table = () => {
	return(
		<Table>
			<thead>
				<tr>
					<CustomTh color={Colors.DocsYellow}>Bit seletor/controle</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada A</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada B</CustomTh>
					<CustomTh color={Colors.DocsGreen}>Saída</CustomTh>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>0</td>
					<td>0</td>
					<td rowspan="2">valor irrelevante</td>
					<td>0</td>
        </tr>
        <tr>
					<td>0</td>
					<td>1</td>
					<td>1</td>
        </tr>
        <tr>
					<td>1</td>
					<td rowspan="2">valor irrelevante</td>
					<td>0</td>
					<td>1</td>
        </tr>
        <tr>
					<td>1</td>
					<td>1</td>
					<td>0</td>
        </tr>
			</tbody>
		</Table>
	)
}

const MuxNx1CompactTable = () => {
	return(
		<Table>
			<thead>
				<tr>
					<CustomTh color={Colors.DocsYellow}>Bit seletor/controle</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada A</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada B</CustomTh>
					<CustomTh color={Colors.DocsGreen}>Saída</CustomTh>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>0</td>
					<td>valor bit A</td>
					<td>-</td>
					<td>valor bit A</td>
        </tr>
        <tr>
					<td>1</td>
					<td>-</td>
					<td>valor bit B</td>
					<td>valor bit B</td>
        </tr>
			</tbody>
		</Table>
	)
}

const Mux4x1Table = () => {
	return(
		<Table>
			<thead>
				<tr>
					<CustomTh color={Colors.DocsYellow}>Seletor 1</CustomTh>
					<CustomTh color={Colors.DocsYellow}>Seletor 2</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada A</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada B</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada C</CustomTh>
					<CustomTh color={Colors.DocsBlue}>Entrada D</CustomTh>
					<CustomTh color={Colors.DocsGreen}>Saída</CustomTh>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>0</td>
					<td>0</td>
					<td>valor bit A</td>
					<td>-</td>
					<td>-</td>
					<td>-</td>
					<td>valor bit A</td>
        </tr>
        <tr>
					<td>0</td>
					<td>1</td>
					<td>-</td>
					<td>valor bit B</td>
					<td>-</td>
					<td>-</td>
					<td>valor bit B</td>
        </tr>
				<tr>
					<td>1</td>
					<td>0</td>
					<td>-</td>
					<td>-</td>
					<td>valor bit C</td>
					<td>-</td>
					<td>valor bit C</td>
        </tr>
				<tr>
					<td>1</td>
					<td>1</td>
					<td>-</td>
					<td>-</td>
					<td>-</td>
					<td>valor bit D</td>
					<td>valor bit D</td>
        </tr>
			</tbody>
		</Table>
	)
}