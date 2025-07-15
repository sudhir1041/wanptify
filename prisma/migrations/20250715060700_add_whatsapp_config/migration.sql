-- CreateTable
CREATE TABLE "WhatsAppConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "WhatsAppConfig_shop_key" UNIQUE ("shop")
);
