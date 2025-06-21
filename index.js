const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.post('/identify', async (req, res) => {
  const { email, phoneNumber } = req.body;
  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Misdirection error: check your data path." });
  }

  // Step 1: Find matches
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email },
        { phoneNumber }
      ]
    },
    orderBy: { createdAt: 'asc' }
  });

  let primary = null;

  // Step 2: If no match, create new primary
  if (contacts.length === 0) {
    const newContact = await prisma.contact.create({
      data: { email, phoneNumber, linkPrecedence: 'primary' }
    });
    return res.json({
      primaryContactId: newContact.id,
      emails: [newContact.email],
      phoneNumbers: [newContact.phoneNumber],
      secondaryContactIds: []
    });
  }

  // Step 3: Identify oldest primary
  const primaryContacts = contacts.filter(c => c.linkPrecedence === 'primary');
  primary = primaryContacts[0];

  // Step 4: Demote other primaries
  for (let i = 1; i < primaryContacts.length; i++) {
    await prisma.contact.update({
      where: { id: primaryContacts[i].id },
      data: {
        linkPrecedence: 'secondary',
        linkedId: primary.id
      }
    });
  }

  // Step 5: Add new secondary if new info
  const exists = contacts.some(c => c.email === email && c.phoneNumber === phoneNumber);
  if (!exists) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: 'secondary',
        linkedId: primary.id
      }
    });
  }

  // Step 6: Collect all linked contacts
  const allLinked = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primary.id },
        { linkedId: primary.id }
      ]
    }
  });

  const emails = [...new Set(allLinked.map(c => c.email).filter(Boolean))];
  const phoneNumbers = [...new Set(allLinked.map(c => c.phoneNumber).filter(Boolean))];
  const secondaryContactIds = allLinked.filter(c => c.linkPrecedence === 'secondary').map(c => c.id);

  res.json({
    primaryContactId: primary.id,
    emails,
    phoneNumbers,
    secondaryContactIds
  });
});

const PORT = 3000;
app.get('/', (req, res) => {
  res.send('Server is alive and ready!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
