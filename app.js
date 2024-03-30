// Importa las dependencias
import inquirer from 'inquirer';

// Función para calcular el costo mínimo
function calcularEsquinaNoroeste(oferta, demanda, precios) {
	const filas = oferta.length;
	const columnas = demanda.length;
	const asignaciones = new Array(filas)
		.fill(0)
		.map(() => new Array(columnas).fill(0));

	let i = 0;
	let j = 0;

	while (i < filas && j < columnas) {
		if (oferta[i] > demanda[j]) {
			asignaciones[i][j] = demanda[j];
			oferta[i] -= demanda[j];
			demanda[j] = 0;
			j++;
		} else {
			asignaciones[i][j] = oferta[i];
			demanda[j] -= oferta[i];
			oferta[i] = 0;
			i++;
		}
	}

	const costoTotal = asignaciones.reduce((total, fila, i) => {
		return (
			total +
			fila.reduce((subtotal, asignacion, j) => {
				return subtotal + asignacion * precios[i][j];
			}, 0)
		);
	}, 0);

	return { asignaciones, costoTotal };
}

// Función principal
async function main() {
	const { oferta, demanda } = await inquirer.prompt([
		{
			type: 'input',
			name: 'oferta',
			message: 'Introduce los valores de oferta separados por comas:',
			filter: input => input.split(',').map(Number),
			validate: input =>
				input.every(val => !isNaN(val))
					? true
					: 'Por favor, introduce valores numéricos separados por comas.',
		},
		{
			type: 'input',
			name: 'demanda',
			message: 'Introduce los valores de demanda separados por comas:',
			filter: input => input.split(',').map(Number),
			validate: input =>
				input.every(val => !isNaN(val))
					? true
					: 'Por favor, introduce valores numéricos separados por comas.',
		},
	]);

	const precios = [];
	for (let i = 0; i < oferta.length; i++) {
		const { preciosFila } = await inquirer.prompt([
			{
				type: 'input',
				name: 'preciosFila',
				message: `Introduce los precios para la oferta ${
					i + 1
				} separados por comas:`,
				filter: input => input.split(',').map(Number),
				validate: input =>
					input.every(val => !isNaN(val))
						? true
						: 'Por favor, introduce valores numéricos separados por comas.',
			},
		]);
		precios.push(preciosFila);
	}

	const resultado = calcularEsquinaNoroeste(oferta, demanda, precios);
	console.log('Asignaciones:');
	console.table(resultado.asignaciones);
	console.log('Costo Total:', resultado.costoTotal);
}

// Ejecuta la función principal
main();
