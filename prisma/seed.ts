import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    await prisma.course.createMany({
        data: [

            {
                title: "React Full Course",
                description: "Master React.js from scratch",
                category: "Development",
                price: 19,
                duration: "12h",
                previewVideo: "https://www.youtube.com/watch?v=bMknfKXIFA8",
                image: "https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg"
            },

            {
                title: "Node.js Full Course",
                description: "Learn backend development with Node.js",
                category: "Development",
                price: 15,
                duration: "10h",
                previewVideo: "https://www.youtube.com/watch?v=Oe421EPjeBE",
                image: "https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg"
            },

            {
                title: "Python Programming",
                description: "Complete Python programming course",
                category: "Programming",
                price: 12,
                duration: "8h",
                previewVideo: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                image: "https://img.youtube.com/vi/_uQrJ0TkZlc/maxresdefault.jpg"
            },

            {
                title: "UI/UX Design Course",
                description: "Learn UI/UX design with Figma",
                category: "Design",
                price: 10,
                duration: "6h",
                previewVideo: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
                image: "https://img.youtube.com/vi/c9Wg6Cb_YlU/maxresdefault.jpg"
            }

        ]
    });

    console.log("Courses inserted successfully");

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });