-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_email" TEXT NOT NULL,
    "company_phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "job_id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "discription" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "opening" BOOLEAN NOT NULL DEFAULT true,
    "total_applicants" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "_UserAppliedJobs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserAppliedJobs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_company_name_key" ON "Company"("company_name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_company_email_key" ON "Company"("company_email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_company_phone_key" ON "Company"("company_phone");

-- CreateIndex
CREATE INDEX "_UserAppliedJobs_B_index" ON "_UserAppliedJobs"("B");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAppliedJobs" ADD CONSTRAINT "_UserAppliedJobs_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAppliedJobs" ADD CONSTRAINT "_UserAppliedJobs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
