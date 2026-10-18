import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm text-teal-600 hover:underline">
        ← На главную
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold">
        Политика конфиденциальности
      </h1>
      <div className="prose prose-zinc mt-6 max-w-none dark:prose-invert space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          LinkWalker обрабатывает данные аккаунта (email, имя) для авторизации,
          биллинга и поддержки. Проход по ссылкам выполняется на устройстве
          пользователя и не требует передачи самих URL на сервер для открытия.
        </p>
        <p>
          Мы можем хранить метаданные проходов (количество ссылок, статусы,
          время) для истории и аналитики в рамках выбранного тарифа.
        </p>
        <p>
          По вопросам данных пишите на privacy@linkwalker.app.
        </p>
      </div>
    </div>
  );
}
