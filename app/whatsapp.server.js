import prisma from "./db.server";

function getValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

async function sendWhatsAppTemplate({ config: cfg, phone, params }) {
  const url = `https://graph.facebook.com/v18.0/${cfg.phoneNumberId}/messages`;
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.token}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: cfg.templateName,
        language: { code: "en_US" },
        components: [
          {
            type: "body",
            parameters: params.slice(0, 6).map((text) => ({
              type: "text",
              text: String(text ?? ""),
            })),
          },
        ],
      },
    }),
  });
}

export async function sendOrderNotification(shop, order) {
  const config = await prisma.whatsAppConfig.findUnique({ where: { shop } });
  if (!config || !config.enabled || !config.templateName) return;
  const phone = order.phone || order.customer?.phone;
  if (!phone) return;
  const params =
    config.templateParams?.split(",").map((p) => getValue(order, p.trim())) || [];
  await sendWhatsAppTemplate({ config, phone, params });
}

export async function sendFulfillmentNotification(shop, fulfillment) {
  const config = await prisma.whatsAppConfig.findUnique({ where: { shop } });
  if (!config || !config.enabled || !config.templateName) return;
  const phone = fulfillment.order?.phone || fulfillment.order?.customer?.phone;
  if (!phone) return;
  const params =
    config.templateParams?.split(",").map((p) => getValue(fulfillment, p.trim())) ||
    [];
  await sendWhatsAppTemplate({ config, phone, params });
}
