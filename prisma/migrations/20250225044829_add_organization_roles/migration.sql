-- AlterTable
ALTER TABLE "OrganizationUser" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "currentOrganizationId" UUID;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_currentOrganizationId_fkey" FOREIGN KEY ("currentOrganizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
