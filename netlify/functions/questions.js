module.exports = [
  {
    "id": "fund-001",
    "modes": ["quiz", "timed"],
    "difficulty": 15,
    "topic": "fundamentos",
    "q": "¿Qué es una variable?",
    "options": ["Un espacio para guardar datos", "Un tipo de error", "Un archivo de imagen", "Una contraseña"],
    "correct": 0,
    "explain": "Una variable es un contenedor con nombre donde guardas un valor que puede cambiar durante la ejecución del programa."
  },
  {
    "id": "fund-002",
    "modes": ["quiz", "timed"],
    "difficulty": 35,
    "topic": "fundamentos",
    "q": "¿Cuál de estos es un tipo de dato booleano?",
    "options": ["'texto'", "42", "true", "3.14"],
    "correct": 2,
    "explain": "Un booleano solo puede ser true o false. Los demás son string, entero y decimal."
  },
  {
    "id": "fund-003",
    "modes": ["quiz", "timed"],
    "difficulty": 45,
    "topic": "fundamentos",
    "q": "¿Qué es un 'array'?",
    "options": ["Una lista de valores", "Un solo número", "Un color CSS", "Un servidor web"],
    "correct": 0,
    "explain": "Un array (arreglo) agrupa varios valores bajo una sola variable, accesibles por índice o clave."
  },
  {
    "id": "fund-004",
    "modes": ["quiz"],
    "difficulty": 55,
    "topic": "fundamentos",
    "q": "¿Qué estructura repite un bloque mientras una condición sea verdadera?",
    "options": ["if", "switch", "while", "return"],
    "correct": 2,
    "explain": "'while' ejecuta un bloque repetidamente mientras su condición sea verdadera."
  },
  {
    "id": "html-001",
    "modes": ["quiz", "timed"],
    "difficulty": 50,
    "topic": "html",
    "q": "¿Qué etiqueta define un párrafo en HTML?",
    "options": ["<div>", "<p>", "<span>", "<section>"],
    "correct": 1,
    "explain": "La etiqueta <p> representa un párrafo de texto en HTML."
  },
  {
    "id": "html-002",
    "modes": ["quiz"],
    "difficulty": 90,
    "topic": "html",
    "q": "¿Para qué sirve el atributo 'alt' en una imagen?",
    "options": ["Cambiar el tamaño", "Texto alternativo si no carga", "Aplicar un filtro", "Enlazar otra página"],
    "correct": 1,
    "explain": "'alt' describe la imagen para accesibilidad y cuando el archivo no se puede mostrar."
  },
  {
    "id": "php-001",
    "modes": ["quiz", "timed"],
    "difficulty": 70,
    "topic": "php",
    "q": "¿Qué símbolo inicia una variable en PHP?",
    "options": ["$", "@", "#", "&"],
    "correct": 0,
    "explain": "Toda variable en PHP comienza con el signo $, por ejemplo $nombre."
  },
  {
    "id": "php-002",
    "modes": ["quiz", "timed"],
    "difficulty": 80,
    "topic": "php",
    "q": "¿'echo' se usa en...?",
    "options": ["PHP", "CSS", "SQL", "HTML puro"],
    "correct": 0,
    "explain": "echo es una construcción de PHP para imprimir salida, normalmente hacia el navegador."
  },
  {
    "id": "php-003",
    "modes": ["quiz", "timed"],
    "difficulty": 85,
    "topic": "php",
    "q": "¿Qué extensión tiene un archivo PHP?",
    "options": [".js", ".php", ".html", ".css"],
    "correct": 1,
    "explain": "Los archivos PHP usan la extensión .php para que el servidor los interprete."
  },
  {
    "id": "php-004",
    "modes": ["quiz"],
    "difficulty": 120,
    "topic": "php",
    "q": "¿Qué palabra clave se usa en PHP para declarar una función?",
    "options": ["function", "def", "func", "method"],
    "correct": 0,
    "explain": "En PHP toda función empieza con function: function saludar() { ... }"
  },
  {
    "id": "php-005",
    "modes": ["quiz"],
    "difficulty": 150,
    "topic": "php",
    "q": "¿Qué palabra clave crea un arreglo asociativo en PHP?",
    "options": ["array()", "list()", "set()", "map()"],
    "correct": 0,
    "explain": "array() o la sintaxis [ ] crea arreglos indexados o asociativos en PHP."
  },
  {
    "id": "php-006",
    "modes": ["quiz"],
    "difficulty": 260,
    "topic": "php",
    "q": "¿Qué hace password_hash() en PHP?",
    "options": ["Encripta contraseñas de forma segura", "Comprime archivos", "Valida un formulario", "Conecta a MySQL"],
    "correct": 0,
    "explain": "password_hash() genera un hash seguro para almacenar contraseñas, idealmente con PASSWORD_DEFAULT."
  },
  {
    "id": "js-001",
    "modes": ["quiz", "timed"],
    "difficulty": 95,
    "topic": "javascript",
    "q": "¿Qué símbolo se usa para comentarios de una línea en JavaScript?",
    "options": ["#", "//", "<!--", "%%"],
    "correct": 1,
    "explain": "'//' comenta el resto de la línea. Para bloques multilínea se usa /* ... */."
  },
  {
    "id": "js-002",
    "modes": ["quiz", "timed"],
    "difficulty": 100,
    "topic": "javascript",
    "q": "¿Qué es 'const' en JavaScript?",
    "options": ["Variable constante", "Una función", "Un bucle", "Un tipo SQL"],
    "correct": 0,
    "explain": "const declara una variable cuya referencia no se reasigna (aunque objetos internos pueden mutar)."
  },
  {
    "id": "js-003",
    "modes": ["quiz"],
    "difficulty": 180,
    "topic": "javascript",
    "q": "¿Qué operador se usa para comparar igualdad estricta en JavaScript?",
    "options": ["=", "==", "===", "!="],
    "correct": 2,
    "explain": "'===' compara valor y tipo. '==' convierte tipos antes de comparar."
  },
  {
    "id": "js-004",
    "modes": ["quiz"],
    "difficulty": 240,
    "topic": "javascript",
    "q": "¿Qué devuelve typeof null en JavaScript?",
    "options": ["'null'", "'object'", "'undefined'", "'boolean'"],
    "correct": 1,
    "explain": "Es un bug histórico del lenguaje: typeof null retorna 'object'."
  },
  {
    "id": "js-005",
    "modes": ["quiz"],
    "difficulty": 320,
    "topic": "javascript",
    "q": "¿Qué es una Promise en JavaScript?",
    "options": ["Un valor futuro de una operación async", "Un tipo de bucle", "Un framework CSS", "Una base de datos"],
    "correct": 0,
    "explain": "Una Promise representa el resultado eventual de una operación asíncrona (resolve/reject)."
  },
  {
    "id": "sql-001",
    "modes": ["quiz", "timed"],
    "difficulty": 110,
    "topic": "sql",
    "q": "¿'SELECT' pertenece a...?",
    "options": ["JavaScript", "SQL", "CSS", "PHP"],
    "correct": 1,
    "explain": "SELECT es la instrucción SQL para consultar datos de tablas."
  },
  {
    "id": "sql-002",
    "modes": ["quiz"],
    "difficulty": 130,
    "topic": "sql",
    "q": "¿Qué significa 'SQL'?",
    "options": ["Structured Query Language", "Simple Query List", "System Query Logic", "Sequential Query Line"],
    "correct": 0,
    "explain": "SQL es el lenguaje estándar para consultar y manipular bases de datos relacionales."
  },
  {
    "id": "sql-003",
    "modes": ["quiz", "timed"],
    "difficulty": 220,
    "topic": "sql",
    "q": "¿Qué hace 'ALTER TABLE'?",
    "options": ["Borra la base de datos", "Modifica la estructura de una tabla", "Crea un usuario", "Exporta datos"],
    "correct": 1,
    "explain": "ALTER TABLE cambia columnas, índices u otras propiedades de una tabla existente."
  },
  {
    "id": "sql-004",
    "modes": ["quiz"],
    "difficulty": 280,
    "topic": "sql",
    "q": "¿Para qué sirve un índice en una base de datos?",
    "options": ["Acelerar búsquedas", "Cambiar colores de la UI", "Encriptar contraseñas", "Comprimir imágenes"],
    "correct": 0,
    "explain": "Un índice mejora el rendimiento de consultas SELECT sobre columnas frecuentemente filtradas."
  },
  {
    "id": "web-001",
    "modes": ["quiz"],
    "difficulty": 200,
    "topic": "web",
    "q": "¿Qué método HTTP se usa normalmente para enviar datos de un formulario?",
    "options": ["GET", "POST", "DELETE", "HEAD"],
    "correct": 1,
    "explain": "POST envía datos en el cuerpo de la petición, adecuado para formularios con datos sensibles."
  },
  {
    "id": "web-002",
    "modes": ["quiz"],
    "difficulty": 230,
    "topic": "web",
    "q": "¿Qué código HTTP indica éxito en una petición?",
    "options": ["404", "500", "200", "301"],
    "correct": 2,
    "explain": "200 OK significa que la petición se procesó correctamente."
  },
  {
    "id": "web-003",
    "modes": ["quiz"],
    "difficulty": 310,
    "topic": "web",
    "q": "¿Para qué sirve una API REST?",
    "options": ["Comunicar sistemas mediante HTTP", "Diseñar logos", "Comprimir videos", "Editar CSS en vivo"],
    "correct": 0,
    "explain": "REST define convenciones para intercambiar datos entre cliente y servidor vía HTTP."
  },
  {
    "id": "git-001",
    "modes": ["quiz"],
    "difficulty": 170,
    "topic": "git",
    "q": "¿Qué hace 'git commit'?",
    "options": ["Guarda un snapshot en el historial local", "Sube cambios al remoto", "Borra una rama", "Instala dependencias"],
    "correct": 0,
    "explain": "commit registra cambios en el repositorio local con un mensaje descriptivo."
  },
  {
    "id": "git-002",
    "modes": ["quiz"],
    "difficulty": 250,
    "topic": "git",
    "q": "¿Qué comando fusiona otra rama en la actual?",
    "options": ["git merge", "git clone", "git init", "git log"],
    "correct": 0,
    "explain": "git merge integra los commits de otra rama en la rama donde estás parado."
  },
  {
    "id": "oop-001",
    "modes": ["quiz"],
    "difficulty": 300,
    "topic": "oop",
    "q": "¿Qué es la herencia en programación orientada a objetos?",
    "options": ["Una clase reutiliza atributos/métodos de otra", "Un tipo de base de datos", "Un error de sintaxis", "Un patrón CSS"],
    "correct": 0,
    "explain": "La herencia permite que una subclase extienda comportamiento de una superclase."
  },
  {
    "id": "oop-002",
    "modes": ["quiz"],
    "difficulty": 380,
    "topic": "oop",
    "q": "¿Qué es la recursividad?",
    "options": ["Una función que se llama a sí misma", "Un tipo de variable global", "Un protocolo HTTP", "Un editor de código"],
    "correct": 0,
    "explain": "Recursión ocurre cuando una función se invoca a sí misma con una condición de parada."
  },
  {
    "id": "algo-001",
    "modes": ["quiz"],
    "difficulty": 420,
    "topic": "algoritmos",
    "q": "¿Qué es la complejidad Big O?",
    "options": ["Medida del rendimiento de un algoritmo", "Un lenguaje de programación", "Un tipo de variable", "Un framework web"],
    "correct": 0,
    "explain": "Big O describe cómo crece el tiempo o espacio requerido conforme aumenta el input."
  },
  {
    "id": "algo-002",
    "modes": ["quiz"],
    "difficulty": 360,
    "topic": "algoritmos",
    "q": "¿Qué estructura sigue el principio LIFO?",
    "options": ["Pila (stack)", "Cola (queue)", "Lista enlazada", "Hash map"],
    "correct": 0,
    "explain": "LIFO = Last In, First Out. El último elemento insertado es el primero en salir."
  },
  {
    "id": "python-001",
    "modes": ["quiz"],
    "difficulty": 270,
    "topic": "python",
    "q": "¿Cómo se define una lista en Python?",
    "options": ["[1, 2, 3]", "{1, 2, 3}", "(1, 2, 3)", "<1, 2, 3>"],
    "correct": 0,
    "explain": "Los corchetes [ ] crean listas mutables. { } es dict/set y ( ) es tupla."
  },
  {
    "id": "django-001",
    "modes": ["quiz"],
    "difficulty": 480,
    "topic": "python/django",
    "q": "¿Qué componente de Django REST Framework serializa modelos a JSON?",
    "options": ["Serializer", "ViewSet", "Router", "Middleware"],
    "correct": 0,
    "explain": "Serializer convierte instancias de modelos (y datos) a representaciones JSON y viceversa."
  },
  {
    "id": "django-002",
    "modes": ["quiz"],
    "difficulty": 520,
    "topic": "python/django",
    "q": "¿Qué librería se usa en Django para consultas ORM sobre modelos?",
    "options": ["El ORM de Django (models.QuerySet)", "DRF Serializers", "Jinja2", "Celery Beat"],
    "correct": 0,
    "explain": "El ORM de Django expone QuerySets para consultar la BD sin SQL crudo. DRF serializa, no consulta."
  },
  {
    "id": "sec-001",
    "modes": ["quiz"],
    "difficulty": 340,
    "topic": "seguridad",
    "q": "¿Qué es SQL injection?",
    "options": ["Insertar SQL malicioso vía inputs no sanitizados", "Un tipo de índice", "Un método HTTP", "Un patrón de diseño"],
    "correct": 0,
    "explain": "Ocurre cuando input del usuario se concatena en consultas SQL. Se previene con prepared statements."
  },
  {
    "id": "sec-002",
    "modes": ["quiz"],
    "difficulty": 400,
    "topic": "seguridad",
    "q": "¿Para qué sirve CSRF token en formularios web?",
    "options": ["Evitar peticiones falsificadas desde otro sitio", "Comprimir datos", "Cachear CSS", "Validar emails"],
    "correct": 0,
    "explain": "El token CSRF verifica que el formulario fue emitido por tu propia aplicación."
  },
  {
    "id": "arch-001",
    "modes": ["quiz"],
    "difficulty": 550,
    "topic": "arquitectura",
    "q": "¿Qué patrón separa la lógica de presentación, negocio y datos?",
    "options": ["MVC", "Singleton", "Factory Method", "Observer"],
    "correct": 0,
    "explain": "MVC (Model-View-Controller) divide responsabilidades en tres capas."
  },
  {
    "id": "arch-002",
    "modes": ["quiz"],
    "difficulty": 620,
    "topic": "arquitectura",
    "q": "¿Qué ventaja tiene un load balancer?",
    "options": ["Distribuye tráfico entre servidores", "Elimina la necesidad de BD", "Compila código más rápido", "Reemplaza HTTPS"],
    "correct": 0,
    "explain": "Un balanceador reparte peticiones para mejorar disponibilidad y rendimiento."
  },
  {
    "id": "timed-001",
    "modes": ["timed"],
    "difficulty": 140,
    "topic": "css",
    "q": "¿Qué propiedad CSS cambia el color de texto?",
    "options": ["color", "background", "font-size", "margin"],
    "correct": 0,
    "explain": "La propiedad color define el color del texto de un elemento."
  },
  {
    "id": "timed-002",
    "modes": ["timed"],
    "difficulty": 160,
    "topic": "css",
    "q": "¿Qué unidad es relativa al tamaño de fuente del elemento?",
    "options": ["em", "px", "cm", "pt"],
    "correct": 0,
    "explain": "em es relativa al font-size del elemento (o del padre para propiedades heredables)."
  },
  {
    "id": "timed-003",
    "modes": ["timed"],
    "difficulty": 190,
    "topic": "web",
    "q": "¿Qué header indica el tipo de contenido en HTTP?",
    "options": ["Content-Type", "User-Agent", "Accept-Language", "Cache-Control"],
    "correct": 0,
    "explain": "Content-Type especifica el MIME type del cuerpo, por ejemplo application/json."
  }
]
