export type GatewayFieldType =
  | "text"
  | "password"
  | "number"
  | "toggle"
  | "select"
  | "textarea"
  | "keyvalue"
  | "placeholder";

export type GatewayField = {
  key: string;
  label: string;
  type: GatewayFieldType;
  placeholder?: string;
  help?: string;
  defaultValue?: string | number | boolean;
  options?: { value: string; label: string }[];
  suffix?: string;
};

export type PaymentGatewayDef = {
  code: string;
  name: string;
  family?: "overpay" | "freekassa" | "friendlypay" | "internal";
  enabled: boolean;
  testMode: boolean;
  minAmountRub: number;
  extraCommissionPercent: number;
  cnFriendly: "" | "0" | "1";
  config: Record<string, string | number | boolean>;
  /** Boosty-specific top-level fields */
  boostyPageSlug?: string;
  boostyTelegramChatId?: string;
  boostyDescriptionForUsers?: string;
};

/** Same specialized sections as fullvpnservice PaymentGatewayResource */
export const GATEWAY_FIELD_SCHEMAS: Record<string, GatewayField[]> = {
  nowpayments: [
    { key: "api_key", label: "API key", type: "password" },
    {
      key: "ipn_secret",
      label: "IPN secret / webhook secret",
      type: "password",
      help: "Секрет для проверки webhook/IPN от NOWPayments",
    },
    {
      key: "pay_currency",
      label: "Pay currency",
      type: "text",
      placeholder: "usdttrc20",
    },
  ],
  overpay: [
    { key: "merchant_id", label: "Merchant ID", type: "text" },
    { key: "secret", label: "Secret", type: "password" },
    {
      key: "api_username",
      label: "API username (Basic auth, optional)",
      type: "text",
    },
    {
      key: "api_password",
      label: "API password (Basic auth, optional)",
      type: "password",
    },
    {
      key: "certificate_path",
      label: "Certificate path (.pfx / .crt)",
      type: "text",
      defaultValue: "app/private/overpay/client.pfx",
    },
    {
      key: "certificate_password",
      label: "Certificate password",
      type: "password",
    },
    {
      key: "certificate_key_path",
      label: "Private key path (.key, optional)",
      type: "text",
    },
    {
      key: "certificate_key_password",
      label: "Private key password (optional)",
      type: "password",
    },
    {
      key: "api_base_url",
      label: "API base URL",
      type: "text",
      defaultValue: "https://api-pay.overpay.io",
    },
    {
      key: "payment_method",
      label: "Payment method",
      type: "select",
      options: [
        { value: "card", label: "Карта" },
        { value: "fps", label: "СБП / FPS" },
      ],
      defaultValue: "fps",
    },
    {
      key: "api_create_path",
      label: "API create path",
      type: "text",
      defaultValue: "/orders/preflight",
    },
    { key: "project_id", label: "Project ID (for /orders/preflight)", type: "text" },
    {
      key: "livetime_minutes",
      label: "Livetime minutes",
      type: "number",
      defaultValue: 60,
    },
    { key: "return_url", label: "Return URL (optional)", type: "text" },
    {
      key: "api_status_path",
      label: "API status path",
      type: "text",
      defaultValue: "/orders/{external_id}",
    },
    {
      key: "api_timeout_sec",
      label: "API timeout (sec)",
      type: "number",
      defaultValue: 25,
    },
    {
      key: "auto_capture_authorized",
      label: "Auto-capture authorized payments",
      type: "toggle",
      defaultValue: false,
    },
    {
      key: "webhook_signature_header",
      label: "Webhook signature header",
      type: "text",
      defaultValue: "x-overpay-signature",
    },
    {
      key: "webhook_hmac_algo",
      label: "Webhook HMAC algo",
      type: "text",
      defaultValue: "sha256",
    },
    {
      key: "_webhook",
      label: "Webhook URL",
      type: "placeholder",
      defaultValue: "https://www.firstview.1tlt.ru/api/webhooks/payments/overpay",
    },
  ],
  overpay_card: [], // filled from overpay with payment_method=card
  exnode: [
    {
      key: "api_base_url",
      label: "API base URL",
      type: "text",
      defaultValue: "https://my.exnode.io",
    },
    {
      key: "api_create_path",
      label: "API create path",
      type: "text",
      defaultValue: "/api/crypto/invoice/create",
    },
    {
      key: "api_status_path",
      label: "API status path",
      type: "text",
      defaultValue: "/api/order/info",
    },
    { key: "api_public", label: "ApiPublic (public key)", type: "password" },
    { key: "api_private", label: "ApiPrivate (private key)", type: "password" },
    { key: "merchant_uuid", label: "Merchant UUID", type: "text" },
    { key: "token", label: "Token", type: "text", defaultValue: "USDTTRC" },
    {
      key: "payment_delta",
      label: "Payment delta (0..1)",
      type: "number",
      defaultValue: 1,
    },
    { key: "strict_currency", label: "Strict currency", type: "toggle", defaultValue: true },
    {
      key: "auto_redirect",
      label: "Auto redirect after success",
      type: "toggle",
      defaultValue: true,
    },
    {
      key: "api_timeout_sec",
      label: "API timeout (sec)",
      type: "number",
      defaultValue: 25,
    },
    { key: "force_ipv4", label: "Force IPv4 for API calls", type: "toggle", defaultValue: false },
    { key: "webhook_secret", label: "Webhook secret (optional)", type: "password" },
    {
      key: "webhook_signature_header",
      label: "Webhook signature header",
      type: "text",
      defaultValue: "x-exnode-signature",
    },
    {
      key: "webhook_hmac_algo",
      label: "Webhook HMAC algo",
      type: "text",
      defaultValue: "sha256",
    },
    {
      key: "treat_partially_paid_as_success",
      label: "Treat PARTIALLYPAID as success",
      type: "toggle",
      defaultValue: false,
    },
  ],
  bybit_direct: [
    { key: "sub_member_id", label: "Bybit Sub UID", type: "text" },
    { key: "receive_uid", label: "Receive UID (shown to users)", type: "text" },
    { key: "api_key", label: "Main API key", type: "password" },
    { key: "api_secret", label: "Main API secret", type: "password" },
    {
      key: "default_asset",
      label: "Default asset code",
      type: "text",
      defaultValue: "usdt_trc20",
    },
    { key: "ttl_minutes", label: "TTL minutes", type: "number", defaultValue: 45 },
    {
      key: "deposit_addresses",
      label: "Deposit addresses (asset=address, по строке)",
      type: "textarea",
      help: "Формат: usdt_trc20=TXyz... (по одной паре на строку)",
    },
    {
      key: "deposit_tags",
      label: "Deposit tags (asset=tag)",
      type: "textarea",
    },
    {
      key: "disabled_assets",
      label: "Disabled asset codes (через запятую)",
      type: "text",
      placeholder: "eth, usdt_erc20",
    },
  ],
  pally: [
    { key: "api_key", label: "Bearer API key", type: "password" },
    {
      key: "api_base_url",
      label: "API base URL",
      type: "text",
      defaultValue: "https://pally.info",
    },
    {
      key: "api_create_path",
      label: "API create path",
      type: "text",
      defaultValue: "/api/v1/bill/create",
    },
    {
      key: "api_timeout_sec",
      label: "API timeout (sec)",
      type: "number",
      defaultValue: 25,
    },
    {
      key: "recurrent_on_create",
      label: "Recurrent on create",
      type: "toggle",
      defaultValue: false,
    },
    { key: "webhook_secret", label: "Webhook secret (HMAC, optional)", type: "password" },
    {
      key: "webhook_signature_header",
      label: "Webhook signature header",
      type: "text",
      defaultValue: "x-pally-signature",
    },
    {
      key: "_webhook",
      label: "Webhook URL",
      type: "placeholder",
      defaultValue: "https://www.firstview.1tlt.ru/api/webhooks/payments/pally",
    },
  ],
  oneplat: [
    {
      key: "mode",
      label: "Mode",
      type: "select",
      options: [
        { value: "form", label: "Hosted payment form (init_form)" },
        { value: "invoice", label: "Invoice link (init_invoice)" },
      ],
      defaultValue: "form",
    },
    {
      key: "api_base_url",
      label: "API base URL",
      type: "text",
      defaultValue: "https://api.1payment.com",
    },
    { key: "partner_id", label: "Partner ID", type: "text" },
    { key: "project_id", label: "Project ID", type: "text" },
    { key: "api_key", label: "API key / signature key", type: "password" },
    {
      key: "signature_key",
      label: "Webhook signature key (optional)",
      type: "password",
    },
    {
      key: "api_timeout_sec",
      label: "API timeout (sec)",
      type: "number",
      defaultValue: 25,
    },
    { key: "lang", label: "Form language", type: "text", defaultValue: "ru" },
    { key: "shop_url", label: "Shop URL (optional)", type: "text" },
    { key: "success_url", label: "Success URL (optional)", type: "text" },
    { key: "failure_url", label: "Failure URL (optional)", type: "text" },
    {
      key: "_webhook",
      label: "Webhook URL",
      type: "placeholder",
      defaultValue: "https://www.firstview.1tlt.ru/api/webhooks/payments/oneplat",
    },
  ],
  platega: [
    {
      key: "api_base_url",
      label: "API base URL",
      type: "text",
      defaultValue: "https://app.platega.io",
    },
    {
      key: "api_create_path",
      label: "Create-payment path",
      type: "text",
      defaultValue: "/v2/transaction/process",
    },
    { key: "merchant_id", label: "X-MerchantId", type: "text" },
    { key: "secret", label: "X-Secret", type: "password" },
    {
      key: "command",
      label: "Command",
      type: "text",
      defaultValue: "process",
    },
    { key: "currency", label: "Currency", type: "text", defaultValue: "RUB" },
    { key: "payment_method", label: "Payment method (optional)", type: "text" },
    { key: "return_url", label: "Success return URL (optional)", type: "text" },
    { key: "failed_url", label: "Failure URL (optional)", type: "text" },
    {
      key: "api_timeout_sec",
      label: "API timeout (sec)",
      type: "number",
      defaultValue: 25,
    },
    {
      key: "_webhook",
      label: "Webhook URL",
      type: "placeholder",
      defaultValue: "https://www.firstview.1tlt.ru/api/webhooks/payments/platega",
    },
  ],
  freekassa: [
    {
      key: "api_base_url",
      label: "API base URL",
      type: "text",
      defaultValue: "https://api.fk.life/v1",
    },
    {
      key: "api_create_path",
      label: "Create-order path",
      type: "text",
      defaultValue: "/orders/create",
    },
    { key: "shop_id", label: "Shop ID (merchant ID)", type: "number" },
    { key: "api_key", label: "API key", type: "password" },
    {
      key: "secret_word_2",
      label: "Secret word 2 (webhook signature)",
      type: "password",
    },
    { key: "payment_method", label: "Payment method ID (i)", type: "number" },
    { key: "currency", label: "Currency", type: "text", defaultValue: "RUB" },
    { key: "fallback_ip", label: "Fallback payer IP", type: "text" },
    {
      key: "verify_webhook_ip",
      label: "Verify FreeKassa webhook IP",
      type: "toggle",
      defaultValue: true,
    },
    { key: "notification_url", label: "Notification URL override", type: "text" },
    { key: "success_url", label: "Success URL (optional)", type: "text" },
    { key: "failure_url", label: "Failure URL (optional)", type: "text" },
    {
      key: "_webhook",
      label: "Webhook URL",
      type: "placeholder",
      defaultValue: "https://www.firstview.1tlt.ru/api/webhooks/payments/freekassa",
    },
  ],
  friendlypay: [
    {
      key: "api_base_url",
      label: "API base URL",
      type: "text",
      defaultValue: "https://pay.friendlypay.io/api",
    },
    {
      key: "api_token",
      label: "API token (x-fp-api-token)",
      type: "password",
    },
    {
      key: "secret_key",
      label: "Secret key (HMAC, optional)",
      type: "password",
    },
    {
      key: "transaction_type",
      label: "Transaction type",
      type: "select",
      options: [
        { value: "card", label: "Card" },
        { value: "sbp", label: "SBP" },
      ],
      defaultValue: "card",
    },
    {
      key: "signature_encoding",
      label: "Signature encoding",
      type: "select",
      options: [
        { value: "hex", label: "hex (lowercase)" },
        { value: "base64", label: "base64" },
      ],
      defaultValue: "hex",
    },
    {
      key: "amount_in_minor_units",
      label: "Amount in minor units (kopecks)",
      type: "toggle",
      defaultValue: true,
    },
    { key: "currency", label: "Currency", type: "text", defaultValue: "RUB" },
    { key: "callback_url", label: "Callback URL override", type: "text" },
    {
      key: "_webhook",
      label: "Webhook URL",
      type: "placeholder",
      defaultValue: "https://www.firstview.1tlt.ru/api/webhooks/payments/friendlypay",
    },
  ],
  betatransfer: [
    {
      key: "api_base_url",
      label: "API base URL",
      type: "text",
      defaultValue: "https://merchant.betatransfer.io/api",
      help: "Must end with /api only",
    },
    {
      key: "payment_path",
      label: "Payment path",
      type: "text",
      defaultValue: "/payment",
    },
    { key: "info_path", label: "Info/status path", type: "text", defaultValue: "/info" },
    { key: "token", label: "API public token", type: "password" },
    { key: "secret_key", label: "API secret key", type: "password" },
    {
      key: "signature_mode",
      label: "Create-payment signature mode",
      type: "select",
      options: [
        { value: "all_post", label: "all_post (BT default)" },
        { value: "all_post_alpha", label: "all_post_alpha" },
        { value: "payment_form", label: "payment_form" },
        { value: "explicit", label: "explicit" },
      ],
      defaultValue: "all_post",
    },
    { key: "currency", label: "Currency", type: "text", defaultValue: "RUB" },
    { key: "locale", label: "Locale", type: "text", defaultValue: "ru" },
    { key: "redirect", label: "Redirect (HTML page)", type: "toggle", defaultValue: false },
    { key: "full_callback", label: "Full callback", type: "toggle", defaultValue: true },
    { key: "force_ipv4", label: "Force IPv4 for API calls", type: "toggle", defaultValue: false },
    {
      key: "include_payer_ip",
      label: "Send payer IP field",
      type: "toggle",
      defaultValue: true,
    },
    {
      key: "_webhook",
      label: "Webhook URL",
      type: "placeholder",
      defaultValue: "https://www.firstview.1tlt.ru/api/webhooks/payments/betatransfer",
    },
  ],
  boosty: [
    {
      key: "boosty_page_slug",
      label: "Boosty page slug",
      type: "text",
      placeholder: "myvpnaccess",
    },
    { key: "boosty_telegram_chat_id", label: "Boosty Telegram chat ID", type: "text" },
    {
      key: "boosty_description_for_users",
      label: "Описание для пользователей",
      type: "textarea",
    },
  ],
  telegram_admin_notify: [
    {
      key: "bot_config_key",
      label: "Bot source",
      type: "select",
      options: [
        { value: "telegram_sales", label: "telegram_sales bot" },
        { value: "telegram_helper", label: "telegram_helper bot" },
      ],
      defaultValue: "telegram_sales",
    },
    { key: "admin_notify_bot_token", label: "Bot token", type: "password" },
    { key: "chat_id", label: "Telegram chat ID", type: "text" },
    {
      key: "notify_registrations",
      label: "Уведомления о регистрациях",
      type: "toggle",
      defaultValue: true,
    },
    {
      key: "notify_successful_credits",
      label: "Успешные пополнения",
      type: "toggle",
      defaultValue: true,
    },
    {
      key: "notify_subscription_purchases",
      label: "Покупки подписок",
      type: "toggle",
      defaultValue: true,
    },
    {
      key: "notify_refunds",
      label: "Возвраты",
      type: "toggle",
      defaultValue: true,
    },
  ],
  telegram_database_backup: [
    {
      key: "bot_config_key",
      label: "Bot source",
      type: "select",
      options: [
        { value: "telegram_sales", label: "telegram_sales bot" },
        { value: "telegram_helper", label: "telegram_helper bot" },
      ],
      defaultValue: "telegram_sales",
    },
    { key: "bot_token", label: "Backup bot token", type: "password" },
    { key: "chat_id", label: "Backup Telegram chat ID", type: "text" },
    {
      key: "notify_backup_success",
      label: "Уведомлять об успехе бэкапа",
      type: "toggle",
      defaultValue: true,
    },
    {
      key: "notify_backup_failure",
      label: "Уведомлять об ошибке бэкапа",
      type: "toggle",
      defaultValue: true,
    },
  ],
  cloudpayments: [
    { key: "public_id", label: "Public ID", type: "text" },
    { key: "api_secret", label: "API Secret", type: "password" },
  ],
  stripe: [
    { key: "secret_key", label: "Secret key", type: "password" },
    { key: "publishable_key", label: "Publishable key", type: "text" },
    { key: "webhook_secret", label: "Webhook secret", type: "password" },
  ],
  paypal: [
    { key: "client_id", label: "Client ID", type: "text" },
    { key: "client_secret", label: "Client secret", type: "password" },
    { key: "mode", label: "Mode (sandbox/live)", type: "text", defaultValue: "sandbox" },
  ],
  qiwi: [
    { key: "secret_key", label: "Secret key", type: "password" },
    { key: "theme_code", label: "Theme code", type: "text" },
  ],
  webmoney: [
    { key: "purse", label: "Purse (R/Z/…)", type: "text" },
    { key: "secret_key", label: "Secret key", type: "password" },
  ],
  yookassa: [
    { key: "shop_id", label: "Shop ID", type: "text" },
    { key: "secret_key", label: "Secret key", type: "password" },
  ],
  tinkoff: [
    { key: "terminal_key", label: "Terminal key", type: "text" },
    { key: "password", label: "Password", type: "password" },
  ],
  sber: [
    { key: "username", label: "Username", type: "text" },
    { key: "password", label: "Password", type: "password" },
    { key: "api_base_url", label: "API base URL", type: "text" },
  ],
  robokassa: [
    { key: "merchant_login", label: "Merchant login", type: "text" },
    { key: "password1", label: "Password #1", type: "password" },
    { key: "password2", label: "Password #2", type: "password" },
  ],
};

// Alias family schemas
GATEWAY_FIELD_SCHEMAS.overpay_card = GATEWAY_FIELD_SCHEMAS.overpay.map((f) =>
  f.key === "payment_method" ? { ...f, defaultValue: "card" } : f,
);
GATEWAY_FIELD_SCHEMAS.freekassa_sbp = GATEWAY_FIELD_SCHEMAS.freekassa;
GATEWAY_FIELD_SCHEMAS.freekassa_card = GATEWAY_FIELD_SCHEMAS.freekassa;
GATEWAY_FIELD_SCHEMAS.freekassa_world_card = GATEWAY_FIELD_SCHEMAS.freekassa;
GATEWAY_FIELD_SCHEMAS.friendlypay_card = GATEWAY_FIELD_SCHEMAS.friendlypay.map((f) =>
  f.key === "transaction_type" ? { ...f, defaultValue: "card" } : f,
);
GATEWAY_FIELD_SCHEMAS.friendlypay_sbp = GATEWAY_FIELD_SCHEMAS.friendlypay.map((f) =>
  f.key === "transaction_type" ? { ...f, defaultValue: "sbp" } : f,
);

/** Same list as fullvpnservice (Filament shows all except hidden RU bank gateways by default filter — we keep all). */
export const DEFAULT_PAYMENT_GATEWAYS: PaymentGatewayDef[] = [
  { code: "cloudpayments", name: "CloudPayments", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "qiwi", name: "QIWI", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "stripe", name: "Stripe", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "paypal", name: "PayPal", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "nowpayments", name: "NOWPayments", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "1", config: {} },
  { code: "webmoney", name: "WebMoney", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "boosty", name: "Boosty", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {}, boostyPageSlug: "", boostyTelegramChatId: "", boostyDescriptionForUsers: "" },
  { code: "overpay", name: "Overpay (SBP / fps)", family: "overpay", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: { payment_method: "fps" } },
  { code: "overpay_card", name: "Overpay (card)", family: "overpay", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: { payment_method: "card" } },
  { code: "exnode", name: "Exnode", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "1", config: {} },
  { code: "pally", name: "Pally.info (PayPalych)", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "oneplat", name: "1Plat.cash", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "platega", name: "Platega", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "freekassa_sbp", name: "FreeKassa (СБП / QR)", family: "freekassa", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "freekassa_card", name: "FreeKassa (карты РФ)", family: "freekassa", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "freekassa_world_card", name: "FreeKassa (VISA / MasterCard USD)", family: "freekassa", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "friendlypay_card", name: "Friendly Pay (карты)", family: "friendlypay", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: { transaction_type: "card" } },
  { code: "friendlypay_sbp", name: "Friendly Pay (СБП)", family: "friendlypay", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: { transaction_type: "sbp" } },
  { code: "betatransfer", name: "BetaTransfer", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "bybit_direct", name: "Bybit Direct", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "1", config: {} },
  { code: "yookassa", name: "ЮKassa", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "tinkoff", name: "Tinkoff / T-Bank", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "sber", name: "Сбербанк Эквайринг", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "robokassa", name: "Robokassa", enabled: false, testMode: true, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "telegram_admin_notify", name: "Telegram admin notifications", family: "internal", enabled: false, testMode: false, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
  { code: "telegram_database_backup", name: "Telegram database backups", family: "internal", enabled: false, testMode: false, minAmountRub: 0, extraCommissionPercent: 0, cnFriendly: "", config: {} },
];

export function getGatewayFields(code: string): GatewayField[] {
  return GATEWAY_FIELD_SCHEMAS[code] ?? [
    {
      key: "raw_config",
      label: "Config (key=value по строке)",
      type: "textarea",
      help: "Произвольные настройки шлюза",
    },
  ];
}

export function isInternalGateway(code: string) {
  return code === "telegram_admin_notify" || code === "telegram_database_backup";
}
