# REST API + Swagger

## Що це таке

Це **робочий приклад** REST API на чистому Node.js (без фреймворків) з
підключеною Swagger-документацією. Він реалізує список книг (`Books`), але за структурою, підходами й назвами файлів він
**повторює** те, що від вас очікується в тому завданні.

## Структура проєкту

```
server.js               # точка входу, запускає http-сервер на PORT
app.js                  # створює http.createServer(router)
router.js               # розбирає url і метод запиту, викликає потрібний controller
utils.js                # readBooks/writeBooks (робота з data/books.json) + getPostData (парсинг тіла запиту)
controllers/
  bookController.js     # обробляє req/res, викликає модель, формує JSON-відповідь
models/
  bookModel.js           # CRUD-операції над масивом книг у файлі
data/
  books.json             # "база даних" — просто json-файл
  books.json.example     # приклад початкового стану даних
swagger.yaml             # OpenAPI-специфікація ендпоінтів
swaggerUi.js             # роздає swagger-ui та /swagger.yaml по http
tests/
  app.test.js            # supertest + мок fs/promises, без реальних файлових операцій
```

Це один в один структура, яку слід використати у TODO-проєкті: замініть
`Book` → `Task`, `title` → `todo`, `read` → `completed`, `/api/v1/books` →
`/api/v1/tasks`.

## Ендпоінти (для прикладу — Books)

| Метод  | Шлях                  | Опис                                                   |
|--------|-----------------------|---------------------------------------------------------|
| GET    | `/api/v1/books`       | усі книги; можна фільтрувати `?filterByRead=true/false`|
| GET    | `/api/v1/books/:id`   | одна книга за id, 404 якщо не знайдено                  |
| POST   | `/api/v1/books`       | створити книгу `{ "title": "..." }`, `read` завжди `false`|
| PATCH  | `/api/v1/books/:id`   | оновити `title` і/або `read`, 404 якщо не знайдено       |
| DELETE | `/api/v1/books/:id`   | видалити книгу, 404 якщо не знайдено                     |

Модель книги:

```json
{
  "id": "string",
  "title": "string",
  "read": true
}
```

## Як відповідність на TODO-завдання

| Books (цей приклад)              | Tasks (ваше завдання)              |
|-----------------------------------|-------------------------------------|
| `Book { id, title, read }`        | `Task { id, todo, completed }`      |
| `GET /api/v1/books`               | `GET /api/v1/tasks`                 |
| `?filterByRead=true`              | `?filterByCompleted=true`           |
| `POST /api/v1/books`              | `POST /api/v1/tasks`                |
| `PATCH /api/v1/books/:id`         | `PATCH /api/v1/tasks/:id`           |
| `DELETE /api/v1/books/:id`        | `DELETE /api/v1/tasks/:id`          |
| `models/bookModel.js`             | `models/taskModel.js`               |
| `controllers/bookController.js`   | `controllers/taskController.js`     |
| `data/books.json`                 | `data/tasks.json`                   |

## Swagger UI

Специфікація лежить у [`swagger.yaml`](./swagger.yaml) і описує всі
ендпоінти, тіла запитів, приклади та коди відповідей. `swaggerUi.js` роздає
її разом зі статикою `swagger-ui-dist`, тож документація доступна прямо з
сервера — без зовнішніх сервісів.

Після запуску сервера відкрийте:

- `http://localhost:3000/docs/` — інтерактивна Swagger UI сторінка
- `http://localhost:3000/swagger.yaml` — сира специфікація

## Як запустити

```bash
npm install
npm start
```

Сервер підніметься на `http://localhost:3000`. Перевіряти запити можна через
Postman, curl або через Swagger UI за `/docs/`.

## Тести

```bash
npm test
```

Тести (`tests/app.test.js`) мокають `fs/promises`, тому не чіпають реальний
`data/books.json`. Зверніть увагу: у моделі та контролері дані читаються і
пишуться **тільки** через `readBooks`/`writeBooks` з `utils.js` — це і
дозволяє мокати файлову систему в тестах. У TODO-завданні аналогічно не
можна імпортувати `data/tasks.json` напряму (`require("../data/tasks")`) —
лише через `readTasks`/`writeTasks`.

