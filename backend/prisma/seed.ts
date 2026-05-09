import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Chandigarh"];
const types = ["Institute of Technology", "University", "College of Engineering", "Medical College", "Business School"];
const prefixes = ["National", "Global", "Advanced", "Premier", "Royal", "Indian", "State"];

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  await prisma.review.deleteMany({})
  await prisma.placement.deleteMany({})
  await prisma.course.deleteMany({})
  await prisma.college.deleteMany({})

  console.log('Generating 50 realistic colleges...');

  const collegesData = [];
  
  for (let i = 0; i < 50; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    // Some hardcoded famous ones for realism at the start
    let name = "";
    if (i === 0) name = "Indian Institute of Technology (IIT) Delhi";
    else if (i === 1) name = "Birla Institute of Technology and Science (BITS) Pilani";
    else if (i === 2) name = "National Institute of Technology (NIT) Trichy";
    else if (i === 3) name = "Vellore Institute of Technology (VIT)";
    else if (i === 4) name = "All India Institute of Medical Sciences (AIIMS)";
    else name = `${prefix} ${type} ${city}`;

    const rating = parseFloat((3.5 + Math.random() * 1.4).toFixed(1)); // 3.5 to 4.9
    const fees = Math.floor(100000 + Math.random() * 400000); // 1L to 5L
    const placementPercentage = parseFloat((70 + Math.random() * 29).toFixed(1));
    const averagePackage = parseFloat((6 + Math.random() * 14).toFixed(1)); // 6 to 20 LPA
    const highestPackage = parseFloat((averagePackage * (2 + Math.random() * 3)).toFixed(1)); // 15 to 80 LPA
    
    collegesData.push({
      name,
      slug: generateSlug(`${name}-${i}`), // ensure unique slug
      location: city,
      rating,
      fees,
      placementPercentage,
      averagePackage,
      highestPackage,
      description: `A premier institution located in ${city}, providing world-class education and outstanding placement opportunities. It has a state-of-the-art campus and experienced faculty.`,
      campusSize: `${Math.floor(50 + Math.random() * 200)} Acres`,
      establishedYear: Math.floor(1950 + Math.random() * 60),
      accreditation: i % 2 === 0 ? "NAAC A++" : "NAAC A+",
      imageUrl: `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800&h=600`, // placeholder campus
      bannerUrl: `https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600&h=400`,
    });
  }

  for (const cData of collegesData) {
    const college = await prisma.college.create({
      data: cData,
    });

    // Create 3-4 courses per college
    const courses = [
      { name: 'B.Tech Computer Science', duration: '4 Years', fees: college.fees, seats: 120 },
      { name: 'B.Tech Electronics', duration: '4 Years', fees: Math.floor(college.fees * 0.9), seats: 60 },
      { name: 'BBA / MBA Integrated', duration: '5 Years', fees: Math.floor(college.fees * 1.2), seats: 40 },
    ];
    
    for (const crs of courses) {
      await prisma.course.create({
        data: { ...crs, collegeId: college.id }
      });
    }

    // Create 3 reviews
    const reviews = [
      { studentName: 'Rahul Kumar', rating: parseFloat((college.rating + (Math.random()*0.5 - 0.25)).toFixed(1)), review: 'Great campus life and supportive faculty. Placements are decent if you maintain a good CGPA.', course: 'B.Tech Computer Science' },
      { studentName: 'Priya Sharma', rating: parseFloat((college.rating + (Math.random()*0.5 - 0.25)).toFixed(1)), review: 'The curriculum is up-to-date with industry standards. Hostel facilities could be slightly better.', course: 'B.Tech Electronics' },
      { studentName: 'Amit Patel', rating: 5.0, review: 'Best decision of my life to join here. Secured an amazing placement at a top tech company!', course: 'B.Tech Computer Science' },
    ];

    for (const rv of reviews) {
      // Ensure rating is max 5.0
      if (rv.rating > 5.0) rv.rating = 5.0;
      await prisma.review.create({
        data: { ...rv, collegeId: college.id }
      });
    }
  }

  console.log('Seeded database successfully with 50 colleges!')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
