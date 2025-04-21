import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tools = [
  { name: 'Hammer', owner: 'Louis', state: 'used', type: 'general', description: 'Standard claw hammer for carpentry.' },
  { name: 'Screwdriver', owner: 'Erwan', state: 'new', type: 'general', description: 'Flathead screwdriver, medium size.' },
  { name: 'Multimeter', owner: 'Mathieu', state: 'used', type: 'electricity', description: 'Digital multimeter for voltage and current.' },
  { name: 'Paint Roller', owner: 'Louis', state: 'new', type: 'painting', description: 'Roller for wall painting.' },
  { name: 'Pipe Wrench', owner: 'Erwan', state: 'used', type: 'plumbing', description: 'Heavy-duty pipe wrench.' },
  { name: 'Cordless Drill', owner: 'Mathieu', state: 'used', type: 'general', description: 'Battery-powered drill.' },
  { name: 'Spirit Level', owner: 'Louis', state: 'new', type: 'general', description: '30cm spirit level.' },
  { name: 'Wire Stripper', owner: 'Erwan', state: 'used', type: 'electricity', description: 'For stripping electrical wires.' },
  { name: 'Paint Brush', owner: 'Mathieu', state: 'used', type: 'painting', description: 'Fine brush for detailed painting.' },
  { name: 'Adjustable Spanner', owner: 'Louis', state: 'used', type: 'plumbing', description: 'Adjustable spanner for nuts and bolts.' },
  { name: 'Handsaw', owner: 'Erwan', state: 'broken', type: 'general', description: 'Wood cutting handsaw.' },
  { name: 'Voltage Tester', owner: 'Mathieu', state: 'new', type: 'electricity', description: 'For checking voltage in outlets.' },
  { name: 'Plunger', owner: 'Louis', state: 'used', type: 'plumbing', description: 'Toilet and sink plunger.' },
  { name: 'Putty Knife', owner: 'Erwan', state: 'new', type: 'painting', description: 'For applying and smoothing putty.' },
  { name: 'Tape Measure', owner: 'Mathieu', state: 'used', type: 'general', description: '5-meter tape measure.' },
  { name: 'Utility Knife', owner: 'Louis', state: 'used', type: 'general', description: 'Retractable blade utility knife.' },
  { name: 'Caulking Gun', owner: 'Erwan', state: 'new', type: 'plumbing', description: 'For applying caulk.' },
  { name: 'Wire Cutter', owner: 'Mathieu', state: 'used', type: 'electricity', description: 'Cuts electrical wires.' },
  { name: 'Paint Tray', owner: 'Louis', state: 'used', type: 'painting', description: 'Tray for paint rollers.' },
  { name: 'Pipe Cutter', owner: 'Erwan', state: 'new', type: 'plumbing', description: 'Cuts metal pipes.' },
];

async function main() {
  for (const tool of tools) {
    await prisma.tool.create({ data: tool });
  }
  console.log('Seeded 20 tools!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
