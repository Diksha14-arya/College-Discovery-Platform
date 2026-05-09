import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// List & Search Colleges
app.get('/api/colleges', async (req, res) => {
  const { q, location, maxFees, minRating, course, sortBy = 'rating', page = '1', limit = '12' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: any = {};
  
  if (q) {
    where.name = { contains: String(q) };
  }
  if (location) {
    where.location = { contains: String(location) };
  }
  if (maxFees) {
    where.fees = { lte: Number(maxFees) };
  }
  if (minRating) {
    where.rating = { gte: Number(minRating) };
  }
  if (course) {
    where.courses = {
      some: {
        name: { contains: String(course) }
      }
    };
  }

  let orderBy: any = {};
  if (sortBy === 'rating') orderBy = { rating: 'desc' };
  else if (sortBy === 'fees') orderBy = { fees: 'asc' };
  else if (sortBy === 'placements') orderBy = { placementPercentage: 'desc' };

  try {
    const colleges = await prisma.college.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        courses: { take: 3 } // include top 3 courses for card
      }
    });

    const total = await prisma.college.count({ where });

    res.json({
      data: colleges,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Compare Colleges
app.get('/api/colleges/compare', async (req, res) => {
  const ids = req.query.ids as string;
  if (!ids) return res.status(400).json({ error: 'ids query param is required' });
  
  const idArray = ids.split(',');
  try {
    const colleges = await prisma.college.findMany({
      where: { id: { in: idArray } },
      include: { courses: { take: 3 } }
    });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Predictor (Rule-based)
app.post('/api/predictor', async (req, res) => {
  const { exam, rank, location, course } = req.body;
  
  if (!rank) {
    return res.status(400).json({ error: "Rank is required." });
  }

  try {
    const where: any = {};
    if (location) where.location = { contains: String(location) };
    if (course) where.courses = { some: { name: { contains: String(course) } } };

    // Fetch pool of colleges based on location/course
    const colleges = await prisma.college.findMany({
      where,
      take: 20, // get top 20 matches
      orderBy: { rating: 'desc' },
      include: { courses: { take: 1 } }
    });

    // Rule-based matching score logic
    const results = colleges.map(c => {
      let matchScore = 80;
      
      // Better rating -> slightly harder to get into -> rank matters more
      const rankThreshold = c.rating > 4.5 ? 10000 : c.rating > 4.0 ? 50000 : 100000;
      
      if (rank <= rankThreshold / 2) matchScore += 15;
      else if (rank <= rankThreshold) matchScore += 5;
      else matchScore -= 30;

      // Ensure bounded
      matchScore = Math.max(10, Math.min(99, matchScore));

      return {
        college: c,
        matchScore,
        chance: matchScore > 85 ? 'High' : matchScore > 60 ? 'Medium' : 'Low'
      };
    });

    // Sort by match score
    results.sort((a, b) => b.matchScore - a.matchScore);

    res.json(results.slice(0, 5)); // return top 5
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Single College
app.get('/api/colleges/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        reviews: true,
      }
    });

    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }

    res.json(college);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
