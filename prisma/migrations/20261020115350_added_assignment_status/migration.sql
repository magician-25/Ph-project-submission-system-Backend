-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING', 'RELEASED', 'ENDED');

-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDING';
