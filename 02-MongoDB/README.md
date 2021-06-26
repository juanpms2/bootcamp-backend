### Introducción

Aquí tienes el enunciado del modulo 2, creat un repo en Github, y añade un readme.md incluyendo enunciado y consulya (lo que pone aquí Pega aquí tu consulta)

####~Restaurar backup

Vamos a restaurar el set de datos de mongo atlas airbnb.

Lo puedes encontrar en este enlace: https://drive.google.com/drive/folders/1gAtZZdrBKiKioJSZwnShXskaKk6H_gCJ?usp=sharing

Para restaurarlo puede seguir las instrucciones de este videopost: https://www.lemoncode.tv/curso/docker-y-mongodb/leccion/restaurando-backup-mongodb

> Acuerdate de mirar si en opt/app hay contenido de backups previos que tengas que borrar.

### General

En este base de datos puedes encontrar un montón de apartementos y sus reviews, esto está sacado de hacer webscrapping.

**Pregunta Si montarás un sitio real, ¿Qué posible problemas pontenciales les ves a como está almacenada la información?**

> Las reviews están incluidas en la misma colección incrementando el peso con el tiempo. Las review_scores son campos calculados con lo que quizá sería conveniente que tampoco estubieran en la colección principal.

### Consultas

#### Basico

- Saca en una consulta cuantos apartamentos hay en España.

  ```js
  use("airbnb");

  db.listingsAndReviews.count({
  	property_type: { $eq: "Apartment" },
  	"address.country": { $eq: "Spain" },
  });

  // 534
  ```

Lista los 10 primeros:
Sólo muestra: nombre, camas, precio, government_area
Ordenados por precio.

```js
use("airbnb");

db.listingsAndReviews
	.find(
		{},
		{
			_id: 0,
			Nombre: "$name",
			Camas: "$beds",
			Precio: "$price",
			Dirección: "$address.government_area",
		}
	)
	.sort({ price: 1 })
	.limit(10);
```

```js
use("airbnb");

db.listingsAndReviews.aggregate([
	{
		$project: {
			_id: 0,
			Nombre: "$name",
			Camas: "$beds",
			Precio: "$price",
			Dirección: "$address.government_area",
		},
	},
	{
		$sort: { price: 1 },
	},
	{
		$limit: 10,
	},
]);
```

Filtrando

Queremos viajar comodos, somos 4 personas y queremos:
4 camas.
Dos cuartos de baño.

```js
use("airbnb");

db.listingsAndReviews
	.find(
		{
			beds: { $eq: 4 },
			bathrooms: { $eq: 2 },
		},
		{
			_id: 0,
			Nombre: "$name",
			Camas: "$beds",
			Baños: "$bathrooms",
			Precio: "$price",
			Dirección: "$address.government_area",
		}
	)
	.sort({ price: 1 })
	.limit(10);
```

Al requisito anterior,hay que añadir que nos gusta la tecnología queremos que el apartamento tenga wifi.

```js
use("airbnb");

db.listingsAndReviews
	.find(
		{
			beds: { $eq: 4 },
			bathrooms: { $eq: 2 },
			amenities: { $eq: "Wifi" },
		},
		{
			_id: 0,
			Nombre: "$name",
			Camas: "$beds",
			Baños: "$bathrooms",
			Extras: "$amenities",
			Precio: "$price",
			Dirección: "$address.government_area",
		}
	)
	.sort({ price: 1 })
	.limit(10);
```

Y bueno, un amigo se ha unido que trae un perro, así que a la query anterior tenemos que buscar que permitan mascota Pets Allowed

```js
use("airbnb");

db.listingsAndReviews
	.find(
		{
			beds: { $eq: 4 },
			bathrooms: { $eq: 2 },
			amenities: { $eq: "Wifi" },
			amenities: { $eq: "Pets allowed" },
		},
		{
			_id: 0,
			Nombre: "$name",
			Camas: "$beds",
			Baños: "$bathrooms",
			Extras: "$amenities",
			Precio: "$price",
			Dirección: "$address.government_area",
		}
	)
	.sort({ price: 1 })
	.limit(10);
```

Operadores lógicos

Estamos entre ir a Barcelona o a Portugal, los dos destinos nos valen, peeero... queremos que el precio nos salga baratito (50 $), y que tenga buen rating de reviews

```js
use("airbnb");

db.listingsAndReviews
	.find(
		{
			beds: { $eq: 4 },
			bathrooms: { $eq: 2 },
			amenities: { $eq: "Wifi" },
			amenities: { $eq: "Pets allowed" },
			$or: [
				{ "address.country": { $eq: "Portugal" } },
				{ "address.market": { $eq: "Barcelona" } },
			],
		},
		{
			_id: 0,
			Nombre: "$name",
			Camas: "$beds",
			Baños: "$bathrooms",
			Extras: "$amenities",
			Precio: "$price",
			Dirección: "$address.government_area",
			Ciudad: "$address.market",
			País: "$address.country",
		}
	)
	.sort({ price: 1 })
	.limit(10);
```

Agregaciones
Basico

Queremos mostrar los pisos que hay en España, y los siguiente campos:
Nombre.
De que ciudad (no queremos mostrar un objeto, sólo el string con la ciudad)
El precio (no queremos mostrar un objeto, sólo el campo de precio)

```js
use("airbnb");

db.listingsAndReviews.aggregate([
	{
		$match: {
			"address.country": "Spain",
			property_type: "Apartment",
		},
	},
	{
		$project: {
			_id: 0,
			Nombre: "$name",
			Ciudad: "$address.market",
			Precio: "$price",
		},
	},
	{
		$sort: { price: 1 },
	},
	{
		$limit: 10,
	},
]);
```

Queremos saber cuantos alojamientos hay disponibles por pais.

```js
use("airbnb");

db.listingsAndReviews.aggregate([
	{
		$match: {
			"availability.availability_30": { $gt: 0 },
		},
	},
	{
		$project: {
			_id: 0,
			Nombre: "$name",
			Pais: "$address.country",
			Precio: "$price",
		},
	},
	{
		$group: {
			_id: "$Pais",
			Disponibles: {
				$sum: 1,
			},
		},
	},
	{
		$sort: { Disponibles: -1 },
	},
]);
```

Opcional

Queremos saber el precio medio de alquiler de airbnb en España.

```js
use("airbnb");

db.listingsAndReviews.aggregate([
	{
		$match: {
			"address.country": "Spain",
		},
	},
	{
		$project: {
			_id: 0,
			Pais: "$address.country",
			Precio: "$price",
		},
	},
	{
		$group: {
			_id: "$Pais",
			Precio_Medio: {
				$avg: "$Precio",
			},
		},
	},
]);
```

¿Y si quisieramos hacer como el anterior, pero sacarlo por paises?

```js
use("airbnb");

db.listingsAndReviews.aggregate([
	{
		$project: {
			_id: 0,
			Pais: "$address.country",
			Precio: "$price",
		},
	},
	{
		$group: {
			_id: "$Pais",
			Precio_Medio: {
				$avg: "$Precio",
			},
		},
	},
]);
```

Repite los mismos pasos pero agrupando también por numero de habitaciones.

```js
use("airbnb");

db.listingsAndReviews.aggregate([
	{
		$project: {
			_id: 0,
			Pais: "$address.country",
			Habitaciones: "$beds",
			Precio: "$price",
		},
	},
	{
		$group: {
			_id: { Pais: "$Pais", Nº_Habitaciones: "$Habitaciones" },
			Precio_Medio: {
				$avg: "$Precio",
			},
		},
	},
	{
		$sort: { "_id.Pais": 1, "_id.Nº_Habitaciones": 1 },
	},
]);
```

Desafio

Queremos mostrar el top 5 de apartamentos más caros en España, y sacar los siguentes campos:

Nombre.
Ciudad.
Amenities, pero en vez de un array, un string con todos los ammenities.

```js
use("airbnb");

db.listingsAndReviews.aggregate([
	{
		$match: {
			"address.country": "Spain",
			property_type: "Apartment",
		},
	},
	{
		$sort: { price: -1 },
	},

	{
		$project: {
			_id: 0,
			Nombre: "$name",
			Pais: "$address.country",
			Extras: {
				$reduce: {
					input: "$amenities",
					initialValue: "",
					in: { $concat: ["$$value", "$$this"] },
				},
			},
			Precio: "$price",
		},
	},
	{
		$limit: 5,
	},
]);
```
