import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  TextField,
  InlineStack,
  Button,
  Checkbox,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const config = await prisma.whatsAppConfig.findUnique({
    where: { shop: session.shop },
  });
  return json({ config });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const phoneNumberId = form.get("phoneNumberId") || "";
  const token = form.get("token") || "";
  const enabled = form.get("enabled") === "on";
  await prisma.whatsAppConfig.upsert({
    where: { shop: session.shop },
    update: { phoneNumberId, token, enabled },
    create: { shop: session.shop, phoneNumberId, token, enabled },
  });
  return redirect("/app/settings");
};

export default function Settings() {
  const { config } = useLoaderData();
  return (
    <Page>
      <TitleBar title="WhatsApp settings" />
      <Layout>
        <Layout.Section>
          <Card>
            <Form method="post">
              <BlockStack gap="400">
                <TextField
                  name="phoneNumberId"
                  label="Phone number ID"
                  defaultValue={config?.phoneNumberId || ""}
                  autoComplete="off"
                />
                <TextField
                  name="token"
                  label="Access token"
                  defaultValue={config?.token || ""}
                  autoComplete="off"
                />
                <Checkbox
                  label="Enable notifications"
                  name="enabled"
                  defaultChecked={config?.enabled}
                />
                <InlineStack>
                  <Button submit primary>
                    Save
                  </Button>
                </InlineStack>
              </BlockStack>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
