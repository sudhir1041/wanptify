-- AlterTable
ALTER TABLE "WhatsAppConfig" ADD COLUMN "sendOnOrderCreate" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "WhatsAppConfig" ADD COLUMN "sendOnFulfillmentCreate" BOOLEAN NOT NULL DEFAULT false;
