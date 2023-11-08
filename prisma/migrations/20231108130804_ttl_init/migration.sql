-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('admin', 'customer');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "password" TEXT NOT NULL,
    "roles" "Roles"[] DEFAULT ARRAY['customer']::"Roles"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenWhiteList" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refreshTokenId" INTEGER,

    CONSTRAINT "TokenWhiteList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "TokenWhiteList" ADD CONSTRAINT "TokenWhiteList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Delete Old Tokens
CREATE OR REPLACE FUNCTION deleteExpiredRecords()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM "TokenWhiteList"
    WHERE "expiredAt" < NOW();
END;
$$ LANGUAGE plpgsql;

-- Delete Tokens After Insert New Token
CREATE TRIGGER InsertTokenWhiteList
AFTER INSERT ON "TokenWhiteList"
FOR EACH ROW
EXECUTE FUNCTION deleteExpiredRecords();

-- Delete Tokens After Update New Token
CREATE TRIGGER UpdateTokenWhiteList
AFTER UPDATE ON "TokenWhiteList"
FOR EACH ROW
EXECUTE FUNCTION deleteExpiredRecords();