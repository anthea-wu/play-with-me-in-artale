-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "map" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "game_id" TEXT NOT NULL,
    "discord_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);
