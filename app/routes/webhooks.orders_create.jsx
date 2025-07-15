import { authenticate } from "../shopify.server";
import { sendOrderNotification } from "../whatsapp.server";

export const action = async ({ request }) => {
  const { shop } = await authenticate.webhook(request);
  const payload = await request.json();
  await sendOrderNotification(shop, payload);
  return new Response();
};
