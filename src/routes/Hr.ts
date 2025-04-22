import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import {auth} from '../middleware/auth';

const Hrrouter = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = "Aryan"; // Should use process.env.JWT_SECRET in production

// Zod validation schemas
const hrDetails = z.object({
  name: z.string(),
  mail: z.string().email(),
  contact: z.string().min(10).max(10),
  password: z.string(),
});

const jobDetails = z.object({
  position: z.string(),
  description: z.string(),
});

// Register a new company
Hrrouter.post('/RegisterCompany', async (req: Request, res: Response) => {
  const HrDetails = req.body;

  const result = hrDetails.safeParse(HrDetails);
  if (!result.success) {
    console.error('Validation failed:', result.error.format());
    return res.status(400).json({ msg: 'Information is invalid. Check again.' });
  }

  try {
    const existing = await prisma.company.findUnique({
      where: { company_email: HrDetails.mail },
    });

    if (existing) {
      return res.status(409).json({ msg: 'Hey, you are already registered!' });
    }

    const newCompany = await prisma.company.create({
      data: {
        company_name: HrDetails.name,
        company_email: HrDetails.mail,
        company_phone: HrDetails.contact,
        password: HrDetails.password, // Passwords should be hashed!
      },
    });

    const token = jwt.sign(
      { companyId: newCompany.id },
      JWT_SECRET,
      { expiresIn: '5h' }
    );

    return res.status(201).json({ msg: 'Company registered successfully.', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Could not register your company!' });
  }
});

// Login route
Hrrouter.post('/LoginCompany', async (req: Request, res: Response) => {
  const { mail, password } = req.body;

  if (!mail || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    const company = await prisma.company.findUnique({
      where: { company_email: mail },
    });

    if (!company || company.password !== password) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { companyId: company.id },
      JWT_SECRET,
      { expiresIn: '5h' }
    );

    return res.json({ msg: 'Login successful', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal error during login' });
  }
});

// POST a Job
Hrrouter.post('/JobPost', auth, async (req: any, res: Response) => {
  const result = jobDetails.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ msg: 'Information is invalid. Check again.' });
  }

  try {
    const { position, description } = req.body;
    const companyId = req.user.id;

    await prisma.job.create({
      data: {
        position,
        description,
        company_id: companyId
      }
    });

    return res.status(201).json({ msg: 'Your job has been posted successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Could not post the job. Try again!' });
  }
});

// DELETE a Job
Hrrouter.delete('/JobDelete', auth, async (req: any, res: Response) => {
  const { jobId } = req.body;

  if (!jobId) return res.status(400).json({ msg: "Job id is not valid." });

  try {
    await prisma.job.delete({
      where: { job_id: jobId }
    });

    return res.json({ msg: "Your job is removed!!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Could not remove the job. Try again!" });
  }
});

// View Dashboard (Sample)
Hrrouter.get('/viewDashBoard', auth, async (_req: Request, res: Response) => {
  return res.json({ msg: 'Hey, your stats are empty for now.' });
});

export default Hrrouter;
