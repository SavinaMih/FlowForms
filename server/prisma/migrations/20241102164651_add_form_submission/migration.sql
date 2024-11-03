/*
  Warnings:

  - A unique constraint covering the columns `[formId]` on the table `Form` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `formId` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `formId` on the `FormSubmission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "formId" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FormSubmission" DROP COLUMN "formId",
ADD COLUMN     "formId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Form_formId_key" ON "Form"("formId");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
