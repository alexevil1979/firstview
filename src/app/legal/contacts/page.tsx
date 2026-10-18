import Link from "next/link";

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm text-teal-600 hover:underline">
        ← На главную
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold">Контакты</h1>
      <div className="mt-6 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
        <p>Email: hello@linkwalker.app</p>
        <p>Поддержка: support@linkwalker.app</p>
        <p>Для бизнеса: sales@linkwalker.app</p>
      </div>
    </div>
  );
}
