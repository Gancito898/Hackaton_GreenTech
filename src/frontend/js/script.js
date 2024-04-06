$(window).load(function(){
	$('.slider')._TMS({
		preset:'diagonalExpand',
		easing:'easeOutQuad',
		duration:800,
		pagination:true,
		slideshow:6000
	})
})



document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('terreno-form');
	const resultado = document.getElementById('resultado');
	const svg = document.getElementById('terreno-svg');
	const medidas = document.getElementById('medidas');
  
	form.addEventListener('submit', function(event) {
	  event.preventDefault();
  
	  const largo = parseFloat(document.getElementById('largo').value);
	  const ancho = parseFloat(document.getElementById('ancho').value);
	  const hortaliza = document.getElementById('hortaliza').value;
	  const cantidad = parseInt(document.getElementById('cantidad').value);
  
	  if (isNaN(largo) || isNaN(ancho) || largo <= 0 || ancho <= 0) {
		resultado.innerHTML = 'Por favor, ingrese medidas válidas para el terreno.';
	  } else {
		const area = largo * ancho;
		if (area > 1000) {
		  resultado.innerHTML = 'El terreno es muy grande.';
		} else if (area < 100) {
		  resultado.innerHTML = 'El terreno es muy pequeño.';
		} else {
		  resultado.innerHTML = 'El terreno tiene un tamaño adecuado.';
		}
  
		dibujarTerreno(largo, ancho);
		dibujarMedidas(largo, ancho);
		dibujarHortalizas(hortaliza, cantidad, largo, ancho);
	  }
	});
  
	function dibujarTerreno(largo, ancho) {
	  svg.innerHTML = ''; // Limpiar el SVG
  
	  // Dibujar el contorno del terreno
	  const contorno = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	  contorno.setAttribute("x", "0");
	  contorno.setAttribute("y", "0");
	  contorno.setAttribute("width", largo);
	  contorno.setAttribute("height", ancho);
	  contorno.setAttribute("stroke", "white");
	  contorno.setAttribute("fill", "none");
	  svg.appendChild(contorno);
	}
  
	function dibujarMedidas(largo, ancho) {
	  medidas.innerHTML = `Largo: ${largo} metros, Ancho: ${ancho} metros`;
	}
  
	function dibujarHortalizas(hortaliza, cantidad, largo, ancho) {
	  if (cantidad <= 0) {
		return; // No hay hortalizas que dibujar
	  }
  
	  const cantidadPorFila = Math.ceil(Math.sqrt(cantidad)); // Calculamos cuántas hortalizas caben en una fila/columna
	  const distanciaX = largo / cantidadPorFila;
	  const distanciaY = ancho / cantidadPorFila;
  
	  // Calculamos el tamaño proporcional de las hortalizas
	  const tamanoHortaliza = Math.min(distanciaX, distanciaY) * 0.8; // El 80% del menor de los dos lados
  
	  // Dibujar la hortaliza seleccionada en puntos equidistantes dentro del terreno
	  for (let i = 0; i < cantidadPorFila; i++) {
		for (let j = 0; j < cantidadPorFila; j++) {
		  const x = distanciaX * i + distanciaX / 2;
		  const y = distanciaY * j + distanciaY / 2;
  
		  let hortalizaShape;
  
		  switch (hortaliza) {
			case 'zanahoria':
			  hortalizaShape = "<polygon points='" + (x - tamanoHortaliza / 2) + "," + (y + tamanoHortaliza / 2) + " " + (x + tamanoHortaliza / 2) + "," + (y - tamanoHortaliza / 2) + " " + (x + tamanoHortaliza / 2) + "," + (y + tamanoHortaliza / 2) + "' fill='orange' stroke='black' />";
			  break;
			case 'lechuga':
			  hortalizaShape = "<circle cx='" + x + "' cy='" + y + "' r='" + (tamanoHortaliza / 2) + "' fill='green' stroke='black' />";
			  break;
			case 'tomate':
			  hortalizaShape = "<circle cx='" + x + "' cy='" + y + "' r='" + (tamanoHortaliza / 2) + "' fill='red' stroke='black' />";
			  break;
			default:
			  return; // No se pudo reconocer la hortaliza, salir sin hacer nada
		  }
  
		  // Agregar la forma de la hortaliza al SVG
		  svg.innerHTML += hortalizaShape;
		}
	  }
	}
  });
  
  
  