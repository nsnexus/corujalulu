export const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const isUuid = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export const STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  preview_ready: "Prévia pronta",
  awaiting_payment: "Aguardando pagamento",
  paid: "Pago",
  generating: "Ilustrando",
  ready: "Pronto",
  failed: "Falhou",
};
