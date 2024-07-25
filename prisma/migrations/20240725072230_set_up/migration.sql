-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "verified" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "otp_userId_key" ON "otp"("userId");

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
