const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const allContacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(allContacts);
}

async function writeContacts(contacts) {
  const newContacts = await fs.writeFile(
    contactsPath,
    JSON.stringify(contacts, null, 2)
  );
  return newContacts;
}

async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const removedContact = contacts[index];
  contacts.splice(index, 1);
  await writeContacts(contacts);
  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await readContacts();
  const addedContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
  };
  contacts.push(addedContact);
  await writeContacts(contacts);
  return addedContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
