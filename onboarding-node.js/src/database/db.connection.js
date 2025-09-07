const { PrismaClient } = require('@prisma/client');

//Creating the client for the prisma client using prisma client.
const  prisma = new PrismaClient();

module.exports = prisma