import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm text-teal-600 hover:underline">
        ← На главную
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold">
        Условия использования
      </h1>
      <div className="mt-6 space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          Используя LinkWalker, вы соглашаетесь не применять сервис для
          незаконной деятельности и соблюдать лимиты выбранного тарифа.
        </p>
        <p>
          Подписка продлевается автоматически до отмены. Возвраты
          рассматриваются индивидуально в течение 14 дней.
        </p>
        <p>
          Сервис предоставляется «как есть». Мы стремимся к высокой
          доступности, но не гарантируем отсутствие перерывов.
        </p>
      </div>
    </div>
  );
}
