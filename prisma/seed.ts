import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Cleaning database...')
    await prisma.cartItem.deleteMany()
    await prisma.enrollment.deleteMany()
    await prisma.certificate.deleteMany()
    await prisma.course.deleteMany()
    await prisma.user.deleteMany()

    console.log('Creating instructor...')
    const hashedPassword = await bcrypt.hash('password123', 10)
    const instructor = await prisma.user.create({
        data: {
            email: 'instructor@likzz.com',
            name: 'Dr. Angela Steele',
            password: hashedPassword,
            role: 'INSTRUCTOR',
        },
    })

    const coursesData = [
        {
            title: "The Web Developer Bootcamp 2026",
            description: "Everything you need to know about web development: HTML, CSS, JS, Node, and more!",
            price: 94.99,
            category: "Development",
            thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1200",
            previewVideo: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
            duration: "64h 30m",
            rating: 4.8,
            reviews: 12500,
        },
        {
            title: "Complete Machine Learning Course",
            description: "Learn Python for Data Science and Machine Learning from scratch.",
            price: 89.99,
            category: "Data Science",
            thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            duration: "42h 15m",
            rating: 4.9,
            reviews: 8200,
        },
        {
            title: "Mastering UI/UX Design",
            description: "Build beautiful and functional user interfaces using Figma and Adobe XD.",
            price: 79.99,
            category: "Design",
            thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            duration: "28h 00m",
            rating: 4.7,
            reviews: 5400,
        },
        {
            title: "Financial Analysis & Business Modeling",
            description: "Excel basics to advanced financial modeling for business analysis.",
            price: 64.99,
            category: "Business",
            thumbnail: "https://images.unsplash.com/photo-1507679799987-c7377f50a4f1?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            duration: "18h 45m",
            rating: 4.6,
            reviews: 3100,
        },
        {
            title: "Social Media Marketing Masterclass",
            description: "Grow your brand with Facebook, Instagram, and TikTok marketing.",
            price: 49.99,
            category: "Marketing",
            thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            duration: "12h 20m",
            rating: 4.5,
            reviews: 2100,
        },
        {
            title: "Python for Everybody Specialization",
            description: "Learn to program and analyze data with Python.",
            price: 0.0,
            category: "Development",
            thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            duration: "35h 00m",
            rating: 4.9,
            reviews: 45000,
        },
        {
            title: "Neural Networks and Deep Learning",
            description: "Build and train deep neural networks from the ground up.",
            price: 129.99,
            category: "Data Science",
            thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackAds.mp4",
            duration: "22h 30m",
            rating: 4.8,
            reviews: 15200,
        },
        {
            title: "The Ultimate Drawing Course",
            description: "Learn to draw icons, characters, and environments from scratch.",
            price: 39.99,
            category: "Design",
            thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            duration: "11h 00m",
            rating: 4.7,
            reviews: 8900,
        },
        {
            title: "Negotiation Skills for Professionals",
            description: "Master the art of negotiation and influence.",
            price: 54.99,
            category: "Business",
            thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
            duration: "8h 45m",
            rating: 4.8,
            reviews: 1200,
        },
        {
            title: "SEO 2026: Complete Strategy",
            description: "Top ranking strategies for Google and YouTube.",
            price: 44.99,
            category: "Marketing",
            thumbnail: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c1d1?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            duration: "15h 10m",
            rating: 4.6,
            reviews: 950,
        }
    ]

    // Add more to reach ~30 with valid random images
    const unsplashKeywords = ["code", "ai", "design", "money", "office", "laptop", "robot", "graph", "paint", "skyline"];
    for (let i = 0; i < 20; i++) {
        const cats = ["Development", "Data Science", "Design", "Business", "Marketing"]
        const cat = cats[Math.floor(Math.random() * cats.length)]
        const keyword = unsplashKeywords[i % unsplashKeywords.length];
        coursesData.push({
            title: `${cat} Advanced Module ${i + 1}`,
            description: `Deep dive into advanced topics of ${cat}. Master the skills that matter with Likzz Academy.`,
            price: Number((Math.random() * 100 + 40).toFixed(2)),
            category: cat,
            thumbnail: `https://images.unsplash.com/photo-${[
                "1461749280684-dccba630e2f6", "1504639725590-34d0984388bd", "1498050108023-c5249f4df085", "1555066931-4365d14bab8c",
                "1517694712202-14dd9538aa97", "1587620962725-abab7fe55159", "1550439062-609e1531270e", "1523240715630-31fa972e0b50",
                "1531297484001-80022131f5a1", "1519389950473-47ba0277781c", "1551288049-bebda4e38f71", "1504868584819-f8e90526354c",
                "1460925895917-afdab827c52f", "1516321318423-f06f85e504b3", "1561070791-2526d30994b5", "1586717791821-3f44a563dc4c",
                "1507238691740-187a5b1d37b8", "1611162617474-5b21e879e113", "1557804506-669a67965ba0", "1556761175-b413da4baf72"
            ][i]}?auto=format&fit=crop&w=1200&q=80`,
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            duration: `${Math.floor(Math.random() * 20 + 5)}h ${Math.floor(Math.random() * 60)}m`,
            rating: 4.5 + Math.random() * 0.5,
            reviews: Math.floor(Math.random() * 5000 + 100),
        })
    }

    for (const course of coursesData) {
        await prisma.course.create({
            data: {
                ...course,
                instructorId: instructor.id,
            },
        })
    }

    console.log('Seed successful: 30 courses added.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
