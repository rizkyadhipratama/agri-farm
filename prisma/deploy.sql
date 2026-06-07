-- ==========================================
-- AgriFarm - Full Database Setup Script
-- Run this in Neon's SQL Editor
-- ==========================================

-- Create all tables
CREATE TABLE IF NOT EXISTS "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "verificationToken" TEXT,
    "verificationTokenExp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roleId" TEXT,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "unit" TEXT,
    "minStock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SeedlingInbound" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "inboundDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SeedlingInbound_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SeedlingOutbound" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "outboundDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SeedlingOutbound_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Harvest" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "harvestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quality" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Harvest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Sales" (
    "id" TEXT NOT NULL,
    "harvestId" TEXT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "totalPrice" DECIMAL(12,2) NOT NULL,
    "buyerName" TEXT,
    "salesDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "FarmLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "hectares" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FarmLocation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "FarmProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FarmProduct_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Role_name_key" ON "Role"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Add foreign keys
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SeedlingInbound" ADD CONSTRAINT "SeedlingInbound_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SeedlingInbound" ADD CONSTRAINT "SeedlingInbound_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SeedlingOutbound" ADD CONSTRAINT "SeedlingOutbound_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Harvest" ADD CONSTRAINT "Harvest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "Harvest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ==========================================
-- Seed Data
-- ==========================================

-- Roles
INSERT INTO "Role" ("id", "name") VALUES
  (gen_random_uuid()::text, 'admin'),
  (gen_random_uuid()::text, 'operator'),
  (gen_random_uuid()::text, 'guest')
ON CONFLICT ("name") DO NOTHING;

-- Users (password: admin123 / operator123)
DO $$
DECLARE
  admin_role_id TEXT;
  operator_role_id TEXT;
BEGIN
  SELECT "id" INTO admin_role_id FROM "Role" WHERE "name" = 'admin';
  SELECT "id" INTO operator_role_id FROM "Role" WHERE "name" = 'operator';

  INSERT INTO "User" ("id", "name", "email", "passwordHash", "roleId", "emailVerified") VALUES
    (gen_random_uuid()::text, 'Admin', 'admin@agrifarm.com', '$2a$10$RFLe7Hm3qfNGYGPLjNXsnOu19pHuC3oY5js3/rL07C5inkCO/0Elq', admin_role_id, NOW()),
    (gen_random_uuid()::text, 'Operator', 'operator@agrifarm.com', '$2a$10$/YaaXdfO9rO5WKEB8xuRdeB64RtwBhz02h/QOeWcGpK9nF5b2.fH.', operator_role_id, NOW())
  ON CONFLICT ("email") DO NOTHING;
END $$;

-- Sample products
INSERT INTO "Product" ("id", "name", "category", "unit", "minStock") VALUES
  (gen_random_uuid()::text, 'Rice Seeds', 'Seeds', 'kg', 100),
  (gen_random_uuid()::text, 'Tomato Seeds', 'Seeds', 'pcs', 50),
  (gen_random_uuid()::text, 'Lettuce Seeds', 'Seeds', 'pcs', 50)
ON CONFLICT DO NOTHING;
