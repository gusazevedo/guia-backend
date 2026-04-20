import { PrismaClient, Testament } from '@prisma/client';

const prisma = new PrismaClient();

const books: Array<{ id: number; slug: string; name: string; testament: Testament; chapters: number }> = [
  // Antigo Testamento — Pentateuco
  { id: 1, slug: 'genesis', name: 'Gênesis', testament: 'OLD', chapters: 50 },
  { id: 2, slug: 'exodo', name: 'Êxodo', testament: 'OLD', chapters: 40 },
  { id: 3, slug: 'levitico', name: 'Levítico', testament: 'OLD', chapters: 27 },
  { id: 4, slug: 'numeros', name: 'Números', testament: 'OLD', chapters: 36 },
  { id: 5, slug: 'deuteronomio', name: 'Deuteronômio', testament: 'OLD', chapters: 34 },
  // Históricos
  { id: 6, slug: 'josue', name: 'Josué', testament: 'OLD', chapters: 24 },
  { id: 7, slug: 'juizes', name: 'Juízes', testament: 'OLD', chapters: 21 },
  { id: 8, slug: 'rute', name: 'Rute', testament: 'OLD', chapters: 4 },
  { id: 9, slug: '1-samuel', name: '1 Samuel', testament: 'OLD', chapters: 31 },
  { id: 10, slug: '2-samuel', name: '2 Samuel', testament: 'OLD', chapters: 24 },
  { id: 11, slug: '1-reis', name: '1 Reis', testament: 'OLD', chapters: 22 },
  { id: 12, slug: '2-reis', name: '2 Reis', testament: 'OLD', chapters: 25 },
  { id: 13, slug: '1-cronicas', name: '1 Crônicas', testament: 'OLD', chapters: 29 },
  { id: 14, slug: '2-cronicas', name: '2 Crônicas', testament: 'OLD', chapters: 36 },
  { id: 15, slug: 'esdras', name: 'Esdras', testament: 'OLD', chapters: 10 },
  { id: 16, slug: 'neemias', name: 'Neemias', testament: 'OLD', chapters: 13 },
  { id: 17, slug: 'tobias', name: 'Tobias', testament: 'OLD', chapters: 14 },
  { id: 18, slug: 'judite', name: 'Judite', testament: 'OLD', chapters: 16 },
  { id: 19, slug: 'ester', name: 'Ester', testament: 'OLD', chapters: 16 },
  { id: 20, slug: '1-macabeus', name: '1 Macabeus', testament: 'OLD', chapters: 16 },
  { id: 21, slug: '2-macabeus', name: '2 Macabeus', testament: 'OLD', chapters: 15 },
  // Sapienciais
  { id: 22, slug: 'jo', name: 'Jó', testament: 'OLD', chapters: 42 },
  { id: 23, slug: 'salmos', name: 'Salmos', testament: 'OLD', chapters: 150 },
  { id: 24, slug: 'proverbios', name: 'Provérbios', testament: 'OLD', chapters: 31 },
  { id: 25, slug: 'eclesiastes', name: 'Eclesiastes', testament: 'OLD', chapters: 12 },
  { id: 26, slug: 'cantico-dos-canticos', name: 'Cântico dos Cânticos', testament: 'OLD', chapters: 8 },
  { id: 27, slug: 'sabedoria', name: 'Sabedoria', testament: 'OLD', chapters: 19 },
  { id: 28, slug: 'eclesiastico', name: 'Eclesiástico', testament: 'OLD', chapters: 51 },
  // Proféticos
  { id: 29, slug: 'isaias', name: 'Isaías', testament: 'OLD', chapters: 66 },
  { id: 30, slug: 'jeremias', name: 'Jeremias', testament: 'OLD', chapters: 52 },
  { id: 31, slug: 'lamentacoes', name: 'Lamentações', testament: 'OLD', chapters: 5 },
  { id: 32, slug: 'baruc', name: 'Baruc', testament: 'OLD', chapters: 6 },
  { id: 33, slug: 'ezequiel', name: 'Ezequiel', testament: 'OLD', chapters: 48 },
  { id: 34, slug: 'daniel', name: 'Daniel', testament: 'OLD', chapters: 14 },
  { id: 35, slug: 'oseias', name: 'Oseias', testament: 'OLD', chapters: 14 },
  { id: 36, slug: 'joel', name: 'Joel', testament: 'OLD', chapters: 3 },
  { id: 37, slug: 'amos', name: 'Amós', testament: 'OLD', chapters: 9 },
  { id: 38, slug: 'abdias', name: 'Abdias', testament: 'OLD', chapters: 1 },
  { id: 39, slug: 'jonas', name: 'Jonas', testament: 'OLD', chapters: 4 },
  { id: 40, slug: 'miqueias', name: 'Miqueias', testament: 'OLD', chapters: 7 },
  { id: 41, slug: 'naum', name: 'Naum', testament: 'OLD', chapters: 3 },
  { id: 42, slug: 'habacuc', name: 'Habacuc', testament: 'OLD', chapters: 3 },
  { id: 43, slug: 'sofonias', name: 'Sofonias', testament: 'OLD', chapters: 3 },
  { id: 44, slug: 'ageu', name: 'Ageu', testament: 'OLD', chapters: 2 },
  { id: 45, slug: 'zacarias', name: 'Zacarias', testament: 'OLD', chapters: 14 },
  { id: 46, slug: 'malaquias', name: 'Malaquias', testament: 'OLD', chapters: 3 },
  // Novo Testamento — Evangelhos
  { id: 47, slug: 'mateus', name: 'Mateus', testament: 'NEW', chapters: 28 },
  { id: 48, slug: 'marcos', name: 'Marcos', testament: 'NEW', chapters: 16 },
  { id: 49, slug: 'lucas', name: 'Lucas', testament: 'NEW', chapters: 24 },
  { id: 50, slug: 'joao', name: 'João', testament: 'NEW', chapters: 21 },
  { id: 51, slug: 'atos', name: 'Atos dos Apóstolos', testament: 'NEW', chapters: 28 },
  // Cartas Paulinas
  { id: 52, slug: 'romanos', name: 'Romanos', testament: 'NEW', chapters: 16 },
  { id: 53, slug: '1-corintios', name: '1 Coríntios', testament: 'NEW', chapters: 16 },
  { id: 54, slug: '2-corintios', name: '2 Coríntios', testament: 'NEW', chapters: 13 },
  { id: 55, slug: 'galatas', name: 'Gálatas', testament: 'NEW', chapters: 6 },
  { id: 56, slug: 'efesios', name: 'Efésios', testament: 'NEW', chapters: 6 },
  { id: 57, slug: 'filipenses', name: 'Filipenses', testament: 'NEW', chapters: 4 },
  { id: 58, slug: 'colossenses', name: 'Colossenses', testament: 'NEW', chapters: 4 },
  { id: 59, slug: '1-tessalonicenses', name: '1 Tessalonicenses', testament: 'NEW', chapters: 5 },
  { id: 60, slug: '2-tessalonicenses', name: '2 Tessalonicenses', testament: 'NEW', chapters: 3 },
  { id: 61, slug: '1-timoteo', name: '1 Timóteo', testament: 'NEW', chapters: 6 },
  { id: 62, slug: '2-timoteo', name: '2 Timóteo', testament: 'NEW', chapters: 4 },
  { id: 63, slug: 'tito', name: 'Tito', testament: 'NEW', chapters: 3 },
  { id: 64, slug: 'filemon', name: 'Filêmon', testament: 'NEW', chapters: 1 },
  { id: 65, slug: 'hebreus', name: 'Hebreus', testament: 'NEW', chapters: 13 },
  // Cartas Católicas
  { id: 66, slug: 'tiago', name: 'Tiago', testament: 'NEW', chapters: 5 },
  { id: 67, slug: '1-pedro', name: '1 Pedro', testament: 'NEW', chapters: 5 },
  { id: 68, slug: '2-pedro', name: '2 Pedro', testament: 'NEW', chapters: 3 },
  { id: 69, slug: '1-joao', name: '1 João', testament: 'NEW', chapters: 5 },
  { id: 70, slug: '2-joao', name: '2 João', testament: 'NEW', chapters: 1 },
  { id: 71, slug: '3-joao', name: '3 João', testament: 'NEW', chapters: 1 },
  { id: 72, slug: 'judas', name: 'Judas', testament: 'NEW', chapters: 1 },
  { id: 73, slug: 'apocalipse', name: 'Apocalipse', testament: 'NEW', chapters: 22 },
];

async function main() {
  for (const book of books) {
    await prisma.book.upsert({
      where: { id: book.id },
      update: { slug: book.slug, name: book.name, testament: book.testament, chapters: book.chapters },
      create: book,
    });
  }
  console.log(`Seeded ${books.length} books.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
