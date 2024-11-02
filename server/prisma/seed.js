const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Clear existing data to avoid unique constraint errors
    await prisma.form.deleteMany();
    await prisma.project.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();

    // Seed Organizations
    const org1 = await prisma.organization.create({
        data: {
            name: 'TechCorp',
            users: {
                create: [
                    {
                        name: 'John Doe',
                        email: 'john@techcorp.com',
                        password: 'password123', // Use hashed password in production
                        role: 'MANAGER',
                    },
                    {
                        name: 'Jane Smith',
                        email: 'jane@techcorp.com',
                        password: 'password123',
                        role: 'USER',
                    },
                ],
            },
        },
    });

    const org2 = await prisma.organization.create({
        data: {
            name: 'Healthify',
            users: {
                create: [
                    {
                        name: 'Alice Johnson',
                        email: 'alice@healthify.com',
                        password: 'password123',
                        role: 'ADMIN',
                    },
                    {
                        name: 'Bob Brown',
                        email: 'bob@healthify.com',
                        password: 'password123',
                        role: 'USER',
                    },
                ],
            },
        },
    });

    // Fetch the IDs for the managers (John Doe and Alice Johnson)
    const john = await prisma.user.findUnique({ where: { email: 'john@techcorp.com' } });
    const alice = await prisma.user.findUnique({ where: { email: 'alice@healthify.com' } });

    // Seed Projects
    const project1 = await prisma.project.create({
        data: {
            name: 'Website Redesign',
            description: 'Redesign the company website',
            organizationId: org1.id,
            managerId: john.id, // Set the manager using managerId
        },
    });

    const project2 = await prisma.project.create({
        data: {
            name: 'Mobile App Development',
            description: 'Develop a new mobile app',
            organizationId: org2.id,
            managerId: alice.id, // Set the manager using managerId
        },
    });

    // Seed Forms
    await prisma.form.createMany({
        data: [
            {
                name: 'Contact Form',
                description: 'Form for contacting support',
                projectId: project1.id,
            },
            {
                name: 'Survey Form',
                description: 'User satisfaction survey',
                projectId: project2.id,
            },
        ],
    });

    console.log('Seed data created successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
