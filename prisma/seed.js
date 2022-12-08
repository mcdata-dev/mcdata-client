const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const InitialBadges = require('./InitialBadges');

async function main() {
    return InitialBadges.forEach(async (user) => {
        await prisma.profile.upsert({
            where: { userId: user.userId },
            update: {},
            create: {
                userId: user.userId
            }
        });

        user.badges.forEach(async (badge) => {
            await prisma.badge.create({
                data: {
                    userId: user.userId,
                    badge: badge
                }
            });
        });
    });
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
});