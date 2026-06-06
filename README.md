# Новинний портал 📰

Це Single Page Application (SPA), що виконує роль новинного порталу. Застосунок дозволяє користувачам переглядати стрічку новин, шукати статті, читати деталі та залишати коментарі, які зберігаються локально.

## Стек технологій
Проєкт побудовано з використанням сучасних технологій веб-розробки:
- **[React](https://react.dev/) (v19)** — бібліотека для побудови інтерфейсів.
- **[TypeScript](https://www.typescriptlang.org/)** — для надійної типізації коду.
- **[Vite](https://vitejs.dev/)** — швидкий інструмент для збірки та розробки.
- **[Tailwind CSS](https://tailwindcss.com/) (v3)** — утилітарний CSS-фреймворк (включає підтримку Dark Mode та адаптивності).
- **[React Router](https://reactrouter.com/)** — для маршрутизації (використовується `HashRouter` для сумісності з GitHub Pages).
- **[Jest](https://jestjs.io/)** — для Unit-тестування бізнес-логіки.
- **[Playwright](https://playwright.dev/)** — для наскрізного E2E та API тестування.

## Структура проєкту
Ключові директорії розташовані у папці `src/`:
- `components/` — перевикористовувані UI-елементи (наприклад, `NewsCard`, `Layout`, `CommentsSection`).
- `pages/` — сторінки додатку (`Home`, `Catalog`, `NewsDetails`, `Blog`, `Contacts`).
- `api/` — імітація бекенду (мок-дані та асинхронні функції з `setTimeout`).
- `utils/` — чисті функції (`helpers.ts`) для фільтрації, валідації та форматування.
- `types/` — TypeScript інтерфейси (наприклад, тип `Article`).
- `tests/` (у корені) — папка з тестами:
  - `tests/unit/` — Unit-тести на базі Jest.
  - `tests/e2e/` — E2E тести UI на базі Playwright.
  - `tests/api/` — API тести на базі Playwright.

## Інструкція із запуску

1. **Клонуйте репозиторій** та перейдіть у його директорію.
2. **Встановіть залежності**:
   ```bash
   npm install
   ```
3. **Запустіть сервер для розробки**:
   ```bash
   npm run dev
   ```
4. Відкрийте у браузері [http://localhost:5173](http://localhost:5173).

## Інструкція з тестування

Проєкт покритий Unit, E2E та API тестами.

- **Запуск Unit-тестів (Jest):**
  ```bash
  npm run test
  ```

- **Запуск E2E та API тестів (Playwright):**
  Попередньо переконайтеся, що всі браузери встановлені (`npx playwright install --with-deps`).
  ```bash
  npx playwright test
  ```

## Налаштування GitHub Pages
Проєкт налаштовано для деплою на GitHub Pages за допомогою автоматизованого пайплайну. 



## Автор
**Nataliia Lysenko**  
Email: [nataliyalyseko712@gmail.com](mailto:nataliyalyseko712@gmail.com)
