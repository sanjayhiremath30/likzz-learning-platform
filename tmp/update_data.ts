import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('Updating courses with valid media...')

    const thumbnails = [
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
        "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
        "https://images.unsplash.com/photo-1550439062-609e1531270e",
        "https://images.unsplash.com/photo-1523240715630-31fa972e0b50"
    ]

    const previewVideos = [
        "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        "https://vjs.zencdn.net/v/oceans.mp4",
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    ]

    const courses = await prisma.course.findMany()

    for (let i = 0; i < courses.length; i++) {
        await prisma.course.update({
            where: { id: courses[i].id },
            data: {
                thumbnail: `${thumbnails[i % thumbnails.length]}?auto=format&fit=crop&w=1200&q=80`,
                previewVideo: previewVideos[i % previewVideos.length]
            }
        })
    }

    console.log(`Updated ${courses.length} courses successfully.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
