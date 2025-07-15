import prisma from "./db.server";

export async function sendWhatsAppMessage({ shop, phone, message }) {
  const config = await prisma.whatsAppConfig.findUnique({ where: { shop } });
  if (!config || !config.enabled) return;

  const url = `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`;
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.token}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: { body: message },
    }),
  });
}

export async function sendOrderNotification(shop, order) {
  const phone = order.phone || order.customer?.phone;
  if (!phone) return;
  await sendWhatsAppMessage({
    shop,
    phone,
    message: `Your order ${order.name} was placed successfully.`,
  });
}

export async function sendFulfillmentNotification(shop, fulfillment) {
  const phone =
    fulfillment.order?.phone || fulfillment.order?.customer?.phone;
  if (!phone) return;
  await sendWhatsAppMessage({
    shop,
    phone,
    message: `Your order ${fulfillment.order?.name} has been fulfilled.`,
  });
}
