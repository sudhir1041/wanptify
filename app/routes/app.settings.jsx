import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
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
  const templateName = form.get("templateName") || "";
  const templateParams = form.get("templateParams") || "";
  await prisma.whatsAppConfig.upsert({
    where: { shop: session.shop },
    update: { phoneNumberId, token, enabled, templateName, templateParams },
    create: {
      shop: session.shop,
      phoneNumberId,
      token,
      enabled,
      templateName,
      templateParams,
    },
  });
  return redirect("/app/settings");
};

export default function Settings() {
  const { config } = useLoaderData();
  const [phoneNumberId, setPhoneNumberId] = useState(
    config?.phoneNumberId || ""
  );
  const [token, setToken] = useState(config?.token || "");
  const [templateName, setTemplateName] = useState(config?.templateName || "");
  const [templateParams, setTemplateParams] = useState(
    config?.templateParams || ""
  );
  const [enabled, setEnabled] = useState(config?.enabled ?? true);
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
                  value={phoneNumberId}
                  onChange={setPhoneNumberId}
                  autoComplete="off"
                />
                <TextField
                  name="token"
                  label="Access token"
                  value={token}
                  onChange={setToken}
                  autoComplete="off"
                />
                <TextField
                  name="templateName"
                  label="Template name"
                  value={templateName}
                  onChange={setTemplateName}
                  autoComplete="off"
                />
                <TextField
                  name="templateParams"
                  label="Template parameters (comma separated)"
                  helpText="Example: name,total_price"
                  value={templateParams}
                  onChange={setTemplateParams}
                  autoComplete="off"
                />
                <Checkbox
                  label="Enable notifications"
                  name="enabled"
                  checked={enabled}
                  onChange={setEnabled}
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
