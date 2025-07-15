import { authenticate } from "../shopify.server";
import { sendFulfillmentNotification } from "../whatsapp.server";

export const action = async ({ request }) => {
  const { shop } = await authenticate.webhook(request);
  const payload = await request.json();
  await sendFulfillmentNotification(shop, payload);
  return new Response();
};
