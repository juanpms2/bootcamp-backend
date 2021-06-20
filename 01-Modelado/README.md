# LABORATORIO

Se ha utilizado el `Patrón de subconjunto (subset patter)` sacando la información más pesada en colecciones a parte.

De esta manera conseguimos cargar las categorías con sus cursos mostrando la información más relevante y reduciendo el peso en el working set. Al mostrar la información detallada de un curso ocurre esto mismo pero con las lecciones.

Una categoría puede tener varios cursos y un curso puede estar en varías categorías. Por ejemplo el curso de Git puede estar en la categoría de FrontEnd y en la de Backend.

Un curso puede tener varios autores pero una lección solo puede tener un único autor.

Las descripciones de cada curso y lección se almacenan en una colección a parte.

Las biografías de los autores se almacenan en una colección a parte.

**Parte obligatoria**
Generar un modelado que refleje los siguiente requerimientos:

- **Queremos mostrar los últimos cursos publicados.**
  Para mostrar los últimos cursos publicados pedimos a la `colección de cursos` que nos devuelva los `n cursos últimos`. Aunque la colección cursos no tiene un campo fecha se asume el orden de elementos añadidos al array.
- **Queremos mostrar cursos por área (devops / front End ...).**
  El documento `category` define el `campo name` de tipo `enum` donde estarán fijadas las categorías. Una consulta a la `colección categories` agrupando por nombre de categoría nos devolverá los cursos de cada categoría.

- **Queremos mostrar un curso con sus videos.**
  Para mostrar los vídeos de un curso pedimos el curso a la colección `cursos` y recogemos los vídeos de cada lección del curso.

- **En un video queremos mostrar su autor.**
  Para mostrar el autor de un vídeo lo hacemos desde el campo `author` de la lección.

**Parte opcional**

```
  Tener un sólo nivel de áreas es limitado, lo suyo sería tener una estructura jerárquica, por ejemplo:
      Front End >> React
      Front End >> React >> Testing
      Front End >> Angular
      Devops >> Dockers
      Devops >> Serverless
      Backend >> nodejs
      Backend >> nodejs >> Express
      Backend >> mongo
  Van a haber videos publicos y privados, es decir:
      Un curso puede ser 100% publico.
      Un curso puede tener una parte inicial 100% pública, y otra sólo para subscriptores.
      Esto implica que hayan usuarios registrados y subscripciones
```

- Para el nivel de áreas (categorías) se ha añadido el campo `subcategories` que es un array de strings.
- Si un curso o lección son públicos o privados (solo subscriptore o de pago) se maneja con la propiedad `is_open`.
- Se ha creado una `colección de usuarios` con los campos que indican si es subscriptor, está registrado y los cursos que ha comprado.

**Desafío**

    Podemos tener usuarios subscriptores y usuarios que compren cursos concretos.
    Podríamos añadir una nube de tags en cada curso o video que permitierá hacer busquedas rápidas.
    Queremos mostrar al usuario cuantas visualizaciones ha tenido un video, no hace falta que este dato este en tiempo real calculado.
    Queremos mostrar al usuario cuantas visualizaciones han tenido todos los videos de un curso, no hace falta que este dato este en tiempo real calculado.

- Se ha creado una `colección de usuarios` con los campos que indican si es subscriptor, está registrado y los cursos que ha comprado.
- El `documento asset` incluye un campo `count` que almacena el número de visualizaciones del vídeo.
- La `nube de tags` se almacena en la `colección assets`, cada vídeo tiene sus propios tags. De esta manera aligeramos el workin set.
- El `campo views` del documento curse almacenará la suma del total de visualizaciones de los vídeos de ese curso.
