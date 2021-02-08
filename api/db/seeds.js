/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client')
const dotenv = require('dotenv')
const admin = require('firebase-admin')
const slugify = require('slugify')

dotenv.config()

const db = new PrismaClient()

var serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS)

const config = {
  credential: admin.credential.cert(serviceAccount),
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
}

const firebaseApp = admin.initializeApp(config)

const getOrCreateContact = async ({ email, name, teamId, password, role }) => {
  let firebaseUser
  try {
    firebaseUser = await firebaseApp.auth().getUserByEmail(email)
  } catch (error) {
    firebaseUser = await firebaseApp.auth().createUser({
      email: email,
      displayName: name,
      password: password,
    })
  }
  if (teamId) {
    const contact = await db.user.upsert({
      where: { email: email },
      update: { email: email },
      create: {
        email: email,
        name: name,
        sub: firebaseUser.uid,
        role: role,
        contactOfTeam: {
          connect: { id: teamId },
        },
      },
    })
    return contact
  } else {
    const contact = await db.user.upsert({
      where: { email: email },
      update: { email: email },
      create: {
        email: email,
        name: name,
        sub: firebaseUser.uid,
        role: role,
      },
    })
    return contact
  }
}

const DEFAULT_SEED_DATA_PASSWORD = 'Pwd$123'

const CLOUDOPS_DATA = {
  insights: [
    {
      contactName: 'Andrew Cormack',
      contactEmail: 'a.cormack@gmail.com',
      storyName: 'Slack Integration',
      insightText: 'It would be very useful to have slack notifications when new data is added.',
      insightSource: 'SLACK',
      storyType: 'IDEA',
      roadmapState: 'Planned',
    },
    {
      contactName: 'Nancy Drew',
      contactEmail: 'n.drew1101@gmail.com',
      storyName: 'Browser Extension',
      insightText: 'It is a hassle to switch between so many platforms, can you add a chrome extension?',
      insightSource: 'CHROME',
      storyType: 'IDEA',
      roadmapState: 'Open',
    },
  ],
}

const ZIPENTERPRISES_DATA = {
  insights: [
    {
      contactName: 'Jack Smith',
      contactEmail: 'j.smith96@hotmail.com',
      storyName: 'Order History Feature',
      insightText: 'Please add a page to check our previous orders so it is easier to reorder!',
      insightSource: 'INTERCOM',
      storyType: 'IDEA',
      roadmapState: 'Open',
    },
    {
      contactName: 'Wes Bos',
      contactEmail: 'wes.bos@yahoo.com',
      storyName: 'User Interface',
      insightText: 'The website can be hard to navigate, it would be easier if there was a product category menu at the top of the pages.',
      insightSource: 'CHROME',
      storyType: 'OTHER',
      roadmapState: 'Planned',
    },
  ],
}

const seedTeamRelatedItems = async ({ companyName, adminName, adminEmail, companySubdomain, prefix, data }) => {
  const admin = await getOrCreateContact({
    email: adminEmail,
    name: adminName,
    password: DEFAULT_SEED_DATA_PASSWORD,
    role: 'ADMIN',
  })

  const team = await db.team.upsert({
    where: { subdomain: companySubdomain },
    update: { subdomain: companySubdomain },
    create: {
      name: companyName,
      subdomain: companySubdomain,
      owner: {
        connect: {
          id: admin.id,
        },
      },
    },
    include: {
      feedbacks: true,
      roadmapItem: true,
    },
  })

  const defaultRoadmap = await db.roadmap.upsert({
    where: { slug_teamId: { teamId: team.id, slug: 'roadmap' } },
    update: { slug: 'roadmap' },
    create: {
      name: 'roadmap',
      slug: 'roadmap',
      team: {
        connect: {
          id: team.id,
        },
      },
    },
  })

  await db.feedback.deleteMany({
    where: { teamId: team.id },
  })
  await db.roadmapItem.deleteMany({
    where: { teamId: team.id },
  })
  await db.user.deleteMany({
    where: { contactTeamId: team.id, role: 'CUSTOMER' },
  })

  data.insights.map(async (insight) => {
    const contact = await getOrCreateContact({
      email: insight.contactEmail,
      name: `${prefix}-${insight.contactName}`,
      password: DEFAULT_SEED_DATA_PASSWORD,
      role: 'CUSTOMER',
      teamId: team.id,
    })
    await db.feedback.create({
      data: {
        text: insight.insightText,
        Team: {
          connect: { id: team.id },
        },
        submitter: {
          connect: { id: admin.id },
        },
        type: insight.storyType,
        sourceType: insight.insightSource,
        contact: {
          connect: { id: contact.id },
        },
        roadmapItem: {
          connectOrCreate: {
            where: {
              slug_teamId_roadmapId: {
                slug: slugify(insight.storyName).toLowerCase(),
                teamId: team.id,
                roadmapId: defaultRoadmap.id,
              },
            },
            create: {
              slug: slugify(insight.storyName).toLowerCase(),
              name: `${prefix}-${insight.storyName}`,
              status: insight.roadmapState,
              roadmap: {
                connect: { id: defaultRoadmap.id },
              },
              team: {
                connect: { id: team.id },
              },
              user: {
                connect: { id: admin.id },
              },
            },
          },
        },
      },
    })
  })
}

async function main() {
  // Seed data is database data that needs to exist for your app to run.
  // Ideally this file should be idempotent: running it multiple times
  // will result in the same database state (usually by checking for the
  // existence of a record before trying to create it). For example:

  await seedTeamRelatedItems({
    companyName: 'CloudOps',
    prefix: 'CO',
    adminName: 'Bill Bliss',
    adminEmail: 'b.bliss@cloudops.com',
    companySubdomain: 'cloudops',
    data: CLOUDOPS_DATA,
  })
  await seedTeamRelatedItems({
    companyName: 'Zip Enterprises',
    prefix: 'ZE',
    adminName: 'Mary Brown',
    adminEmail: 'm.brown@zipenterprises.com',
    companySubdomain: 'zipenterprises',
    data: ZIPENTERPRISES_DATA,
  })
  console.info('Done.')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.$disconnect()
  })
