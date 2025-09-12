// Script to seed the database with the provided book data
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// The book data with enhanced descriptions
const booksData = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    publisher: "J.B. Lippincott & Co.",
    publicationDate: "1960-07-11",
    description:
      "Set in the racially charged atmosphere of 1930s Alabama, this Pulitzer Prize-winning novel follows young Scout Finch as she witnesses her father, Atticus Finch, defend a black man falsely accused of raping a white woman. Through Scout's innocent perspective, the story delves into themes of racial injustice, moral growth, and compassion, highlighting the deep-seated prejudices of the American South and the courage it takes to stand up for what's right.",
    totalCopies: 20,
    availableCopies: 12,
    category: { name: "Classic Literature" },
    imageUrl: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    publisher: "Secker & Warburg",
    publicationDate: "1949-06-08",
    description:
      "A dystopian masterpiece that presents a chilling vision of a totalitarian future where the Party, led by Big Brother, exercises absolute control over every aspect of life. The novel explores themes of surveillance, censorship, and the manipulation of truth, following protagonist Winston Smith's struggle for individuality in a world where independent thought is a crime. Orwell's work serves as a stark warning against the dangers of authoritarianism and the loss of civil liberties.",
    totalCopies: 15,
    availableCopies: 7,
    category: { name: "Dystopian" },
    imageUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    publisher: "Charles Scribner's Sons",
    publicationDate: "1925-04-10",
    description:
      "Set in the opulent Jazz Age of the 1920s, this novel tells the story of the enigmatic Jay Gatsby and his unrelenting love for the beautiful Daisy Buchanan. Through the eyes of narrator Nick Carraway, Fitzgerald critiques the American Dream, exposing the decadence and moral decay beneath the glittering surface of high society. The novel explores themes of wealth, love, ambition, and the illusion of the American Dream, making it a timeless commentary on the human condition.",
    totalCopies: 18,
    availableCopies: 10,
    category: { name: "Classic Literature" },
    imageUrl: "https://covers.openlibrary.org/b/id/7352160-L.jpg",
  },
  {
    id: 4,
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    isbn: "9780590353427",
    publisher: "Scholastic",
    publicationDate: "1997-06-26",
    description:
      "The magical beginning of the beloved Harry Potter series follows eleven-year-old Harry as he discovers he is a wizard and enters Hogwarts School of Witchcraft and Wizardry. Alongside his new friends Ron Weasley and Hermione Granger, Harry uncovers the truth about his parents' death and faces the dark wizard who killed them. This enchanting tale of friendship, courage, and the power of love has captivated readers worldwide and introduced them to a magical world filled with wonder, adventure, and important life lessons.",
    totalCopies: 30,
    availableCopies: 25,
    category: { name: "Fantasy" },
    imageUrl: "https://covers.openlibrary.org/b/id/7884861-L.jpg",
  },
  {
    id: 5,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "9780547928227",
    publisher: "George Allen & Unwin",
    publicationDate: "1937-09-21",
    description:
      "This beloved fantasy adventure follows Bilbo Baggins, a comfort-loving hobbit who is unexpectedly swept into an epic quest with thirteen dwarves to reclaim their homeland from the fearsome dragon Smaug. Along the way, Bilbo encounters trolls, goblins, elves, and a mysterious ring that will change Middle-earth forever. Tolkien's masterful storytelling combines adventure, humor, and profound themes of courage, friendship, and the unexpected heroism found in ordinary people.",
    totalCopies: 25,
    availableCopies: 14,
    category: { name: "Fantasy" },
    imageUrl: "https://covers.openlibrary.org/b/id/6979861-L.jpg",
  },
  {
    id: 6,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9781503290563",
    publisher: "T. Egerton",
    publicationDate: "1813-01-28",
    description:
      "A timeless romantic novel that explores the complexities of love, class, and social expectations in 19th-century England. The witty and independent Elizabeth Bennet navigates the pressures of marriage and societal norms, particularly when she encounters the proud and wealthy Mr. Darcy. Through misunderstandings, prejudice, and personal growth, Austen crafts a delightful exploration of human relationships and societal constraints, showcasing her sharp wit and keen observations of human nature.",
    totalCopies: 22,
    availableCopies: 11,
    category: { name: "Romance" },
    imageUrl: "https://covers.openlibrary.org/b/id/8091016-L.jpg",
  },
  {
    id: 7,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "9780316769488",
    publisher: "Little, Brown and Company",
    publicationDate: "1951-07-16",
    description:
      "A seminal work that captures the angst and alienation of adolescence through the voice of Holden Caulfield, a disillusioned teenager who wanders New York City after being expelled from prep school. Salinger's novel explores themes of identity, belonging, and the loss of innocence, as Holden grapples with the phoniness of the adult world and his own place in it. The novel's authentic teenage voice and exploration of universal themes of growing up have made it a defining work of American literature.",
    totalCopies: 17,
    availableCopies: 9,
    category: { name: "Classic Literature" },
    imageUrl: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
  },
  {
    id: 8,
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    isbn: "9780618640157",
    publisher: "Allen & Unwin",
    publicationDate: "1954-07-29",
    description:
      "An epic fantasy masterpiece that follows the quest to destroy the One Ring and defeat the dark lord Sauron. The story begins with Frodo Baggins inheriting the Ring from his uncle Bilbo and embarking on a perilous journey to Mount Doom with a fellowship of diverse companions. Tolkien's richly detailed world of Middle-earth, complete with its own languages, histories, and cultures, explores themes of friendship, sacrifice, the corrupting influence of power, and the triumph of good over evil in one of literature's most influential fantasy works.",
    totalCopies: 35,
    availableCopies: 20,
    category: { name: "Fantasy" },
    imageUrl: "https://covers.openlibrary.org/b/id/8231994-L.jpg",
  },
  {
    id: 9,
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "9780061122415",
    publisher: "HarperTorch",
    publicationDate: "1988-05-01",
    description:
      "A philosophical fable that follows Santiago, a young Andalusian shepherd, as he embarks on a journey to find a worldly treasure located in Egypt. Along the way, he meets various characters who teach him about the importance of following one's dreams, listening to one's heart, and recognizing the signs that guide us through life. Coelho's inspirational tale explores themes of destiny, personal legend, and the interconnectedness of all things, offering readers a profound meditation on the meaning of life and the pursuit of happiness.",
    totalCopies: 28,
    availableCopies: 16,
    category: { name: "Fiction" },
    imageUrl: "https://covers.openlibrary.org/b/id/8101239-L.jpg",
  },
  {
    id: 10,
    title: "Moby-Dick",
    author: "Herman Melville",
    isbn: "9781503280786",
    publisher: "Harper & Brothers",
    publicationDate: "1851-10-18",
    description:
      "An epic tale of obsession and revenge that follows Captain Ahab's relentless pursuit of the elusive white whale, Moby Dick. Through the eyes of Ishmael, a sailor aboard the whaling ship Pequod, Melville's narrative delves into themes of fate, free will, and the nature of evil. The novel combines adventure, philosophy, and detailed descriptions of 19th-century whaling life, creating a profound meditation on humanity's struggle against nature and the destructive power of obsession.",
    totalCopies: 12,
    availableCopies: 5,
    category: { name: "Adventure" },
    imageUrl: "https://covers.openlibrary.org/b/id/8100901-L.jpg",
  },
  {
    id: 11,
    title: "The Da Vinci Code",
    author: "Dan Brown",
    isbn: "9780307474278",
    publisher: "Doubleday",
    publicationDate: "2003-03-18",
    description:
      "A fast-paced thriller that follows Harvard symbologist Robert Langdon as he becomes entangled in a murder investigation that leads him to uncover a centuries-old conspiracy involving the Catholic Church, secret societies, and the true nature of Jesus Christ's bloodline. Brown's novel combines art history, religious symbolism, and conspiracy theories in a gripping narrative that explores themes of faith, history, and the power of hidden knowledge, while raising questions about the relationship between religion and historical truth.",
    totalCopies: 24,
    availableCopies: 15,
    category: { name: "Thriller" },
    imageUrl: "https://covers.openlibrary.org/b/id/240726-L.jpg",
  },
  {
    id: 12,
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    isbn: "9781594631931",
    publisher: "Riverhead Books",
    publicationDate: "2003-05-29",
    description:
      "A powerful and emotionally resonant novel that follows Amir, a young boy from Kabul, and his complex relationship with Hassan, the son of his father's servant. Set against the backdrop of Afghanistan's tumultuous history from the 1970s to the early 2000s, the story explores themes of friendship, betrayal, guilt, and redemption. Hosseini's debut novel offers a deeply moving portrait of a country torn apart by war and the universal human experiences of love, loss, and the possibility of atonement.",
    totalCopies: 21,
    availableCopies: 13,
    category: { name: "Drama" },
    imageUrl: "https://covers.openlibrary.org/b/id/8232587-L.jpg",
  },
  {
    id: 13,
    title: "The Hunger Games",
    author: "Suzanne Collins",
    isbn: "9780439023481",
    publisher: "Scholastic Press",
    publicationDate: "2008-09-14",
    description:
      "Set in a dystopian future where the totalitarian nation of Panem forces its twelve districts to send one boy and one girl to participate in the annual Hunger Games, a televised fight to the death. The story follows sixteen-year-old Katniss Everdeen, who volunteers to take her younger sister's place in the Games. Collins' gripping novel explores themes of survival, sacrifice, government oppression, and the power of media manipulation, while examining the human cost of entertainment and the resilience of the human spirit in the face of unimaginable circumstances.",
    totalCopies: 27,
    availableCopies: 19,
    category: { name: "Dystopian" },
    imageUrl: "https://covers.openlibrary.org/b/id/6979860-L.jpg",
  },
  {
    id: 14,
    title: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe",
    author: "C.S. Lewis",
    isbn: "9780064471046",
    publisher: "Geoffrey Bles",
    publicationDate: "1950-10-16",
    description:
      "The first published book in the beloved Chronicles of Narnia series follows four siblings—Peter, Susan, Edmund, and Lucy—who discover the magical land of Narnia through an old wardrobe. In Narnia, they find a world trapped in eternal winter by the White Witch and join forces with the great lion Aslan to free the land and fulfill an ancient prophecy. Lewis' enchanting tale combines adventure, fantasy, and Christian allegory, exploring themes of sacrifice, redemption, courage, and the battle between good and evil in a world that has captivated readers of all ages for generations.",
    totalCopies: 26,
    availableCopies: 18,
    category: { name: "Fantasy" },
    imageUrl: "https://covers.openlibrary.org/b/id/240727-L.jpg",
  },
  {
    id: 15,
    title: "Brave New World",
    author: "Aldous Huxley",
    isbn: "9780060850524",
    publisher: "Chatto & Windus",
    publicationDate: "1932-01-01",
    description:
      "A dystopian novel that presents a chilling vision of a future society driven by technological advancements, genetic engineering, and a rigid caste system designed to maintain social stability. In this world, individuality and emotional depth are suppressed through conditioning and the use of a pleasure-inducing drug called soma. Huxley's work explores themes of freedom, identity, the cost of utopia, and the dangers of state control over human reproduction and thought, serving as a cautionary tale about the potential consequences of unchecked scientific progress and the loss of personal autonomy.",
    totalCopies: 19,
    availableCopies: 8,
    category: { name: "Dystopian" },
    imageUrl: "https://covers.openlibrary.org/b/id/8225297-L.jpg",
  },
  {
    id: 16,
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    isbn: "9780141441146",
    publisher: "Smith, Elder & Co.",
    publicationDate: "1847-10-16",
    description:
      "Jane Eyre tells the unforgettable story of an orphaned girl who grows up facing hardship, abuse, and loneliness. Despite her struggles, Jane remains intelligent, principled, and determined to live life on her own terms. When she becomes a governess at Thornfield Hall, she falls deeply in love with her employer, Mr. Rochester, only to uncover shocking secrets from his past. Blending romance, gothic mystery, and feminist themes, the novel explores independence, morality, and the strength of the human spirit in the face of overwhelming obstacles.",
    totalCopies: 20,
    availableCopies: 10,
    category: { name: "Romance" },
    imageUrl: "https://covers.openlibrary.org/b/id/8225230-L.jpg",
  },
  {
    id: 17,
    title: "Frankenstein",
    author: "Mary Shelley",
    isbn: "9780486282114",
    publisher: "Lackington, Hughes, Harding, Mavor & Jones",
    publicationDate: "1818-01-01",
    description:
      "Often regarded as the first true science fiction novel, Frankenstein follows Victor Frankenstein, a young scientist who becomes obsessed with the idea of creating life. Using forbidden knowledge and unorthodox experiments, he builds a creature from assembled body parts and brings it to life. However, horrified by what he has created, he abandons the creature, who is intelligent and sensitive but rejected by society. As the creature seeks revenge against his creator, the novel explores themes of ambition, isolation, humanity, and the consequences of unchecked scientific progress.",
    totalCopies: 18,
    availableCopies: 9,
    category: { name: "Horror" },
    imageUrl: "https://covers.openlibrary.org/b/id/8231857-L.jpg",
  },
  {
    id: 18,
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    isbn: "9780486415871",
    publisher: "The Russian Messenger",
    publicationDate: "1866-01-01",
    description:
      "Set in St. Petersburg, Russia, Crime and Punishment follows the tormented life of Rodion Raskolnikov, a poor ex-student who becomes consumed by the idea that certain extraordinary individuals are above the law. Believing himself to be one of these people, he murders a greedy pawnbroker, convincing himself that it will serve the greater good. However, the weight of guilt, paranoia, and moral conflict begin to consume him. The novel delves into psychology, morality, redemption, and the eternal struggle between good and evil within the human soul.",
    totalCopies: 22,
    availableCopies: 11,
    category: { name: "Classic Literature" },
    imageUrl: "https://covers.openlibrary.org/b/id/8228781-L.jpg",
  },
  {
    id: 19,
    title: "Wuthering Heights",
    author: "Emily Brontë",
    isbn: "9780141439556",
    publisher: "Thomas Cautley Newby",
    publicationDate: "1847-12-01",
    description:
      "Wuthering Heights is a haunting tale of passion, revenge, and obsession set on the Yorkshire moors. The novel centers on the turbulent relationship between Heathcliff, an orphan taken in by the Earnshaw family, and Catherine Earnshaw, his foster sister and lifelong love. Their bond is intense but destructive, and their inability to be together leads to a cycle of vengeance that spans generations. With its gothic atmosphere and exploration of dark human emotions, the novel is both a tragic love story and a profound study of human nature.",
    totalCopies: 19,
    availableCopies: 8,
    category: { name: "Romance" },
    imageUrl: "https://covers.openlibrary.org/b/id/8232400-L.jpg",
  },
  {
    id: 20,
    title: "War and Peace",
    author: "Leo Tolstoy",
    isbn: "9780199232765",
    publisher: "The Russian Messenger",
    publicationDate: "1869-01-01",
    description:
      "War and Peace is an epic masterpiece that intertwines the lives of aristocratic families in Russia during the Napoleonic Wars. With a sweeping cast of characters, including Pierre Bezukhov, Natasha Rostov, and Andrei Bolkonsky, Tolstoy explores themes of love, destiny, history, and the meaning of life. The novel is not only a story about war and personal struggle but also a meditation on philosophy, politics, and human existence. Its vast scope, intricate detail, and emotional depth have made it one of the greatest novels ever written.",
    totalCopies: 25,
    availableCopies: 13,
    category: { name: "Historical Fiction" },
    imageUrl: "https://covers.openlibrary.org/b/id/8228783-L.jpg",
  },
  {
    id: 21,
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    isbn: "9780143035008",
    publisher: "The Russian Messenger",
    publicationDate: "1878-01-01",
    description:
      "Anna Karenina is a sweeping tale of love, betrayal, and societal expectation in Imperial Russia. Anna, trapped in an unhappy marriage, falls deeply in love with Count Vronsky, leading her into a passionate but destructive relationship that isolates her from society. Parallel to her story is the moral and spiritual journey of Konstantin Levin, whose search for meaning offers a counterpoint to Anna's tragedy. Through vivid characters and profound insights, Tolstoy examines marriage, morality, and the clash between personal happiness and social duty.",
    totalCopies: 24,
    availableCopies: 12,
    category: { name: "Classic Literature" },
    imageUrl: "https://covers.openlibrary.org/b/id/8232000-L.jpg",
  },
  {
    id: 22,
    title: "Les Misérables",
    author: "Victor Hugo",
    isbn: "9780451419438",
    publisher: "A. Lacroix, Verboeckhoven & Cie.",
    publicationDate: "1862-01-01",
    description:
      "Les Misérables is a monumental novel about justice, redemption, and the struggle of the poor in 19th-century France. The story follows Jean Valjean, a former convict seeking a new life, relentlessly pursued by the unyielding Inspector Javert. Along the way, Valjean becomes entangled in the lives of Fantine, Cosette, Marius, and the young revolutionaries fighting for freedom in Paris. Hugo weaves together themes of law, grace, sacrifice, and love, making this one of the most powerful explorations of human resilience ever written.",
    totalCopies: 28,
    availableCopies: 14,
    category: { name: "Historical Fiction" },
    imageUrl: "https://covers.openlibrary.org/b/id/8232200-L.jpg",
  },
  {
    id: 23,
    title: "Dracula",
    author: "Bram Stoker",
    isbn: "9780486411095",
    publisher: "Archibald Constable and Company",
    publicationDate: "1897-05-26",
    description:
      "Dracula is the quintessential gothic horror novel that introduced Count Dracula, the iconic vampire who travels from Transylvania to England to spread his curse. Told through diaries, letters, and newspaper clippings, the novel follows Jonathan Harker, Mina, Lucy, and Professor Van Helsing as they attempt to confront the terrifying Count. More than just a supernatural thriller, Dracula explores Victorian anxieties about sexuality, science, superstition, and the clash between modernity and ancient evil.",
    totalCopies: 21,
    availableCopies: 11,
    category: { name: "Horror" },
    imageUrl: "https://covers.openlibrary.org/b/id/8232100-L.jpg",
  },
  {
    id: 24,
    title: "Don Quixote",
    author: "Miguel de Cervantes",
    isbn: "9780060934347",
    publisher: "Francisco de Robles",
    publicationDate: "1605-01-16",
    description:
      "Don Quixote is a comedic yet deeply human story about an aging nobleman, Alonso Quixano, who becomes so enamored with tales of knights and chivalry that he reinvents himself as the errant knight Don Quixote. Accompanied by his loyal squire Sancho Panza, he embarks on misadventures across Spain, tilting at windmills and mistaking inns for castles. Blending satire, humor, and pathos, Cervantes crafts a timeless work that critiques illusions, idealism, and the gap between reality and imagination.",
    totalCopies: 23,
    availableCopies: 12,
    category: { name: "Classic Literature" },
    imageUrl: "https://covers.openlibrary.org/b/id/8232300-L.jpg",
  },
  {
    id: 25,
    title: "A Tale of Two Cities",
    author: "Charles Dickens",
    isbn: "9780141439600",
    publisher: "Chapman & Hall",
    publicationDate: "1859-04-30",
    description:
      "A Tale of Two Cities is Dickens's historical novel set against the backdrop of the French Revolution. The story follows Charles Darnay, a French aristocrat who renounces his title, and Sydney Carton, a disillusioned English lawyer, whose fates intertwine through their love for Lucie Manette. Themes of sacrifice, justice, and resurrection echo throughout the novel, culminating in one of literature's most famous closing lines. Dickens paints a vivid picture of a society on the brink of chaos while exploring the power of redemption and love.",
    totalCopies: 26,
    availableCopies: 15,
    category: { name: "Historical Fiction" },
    imageUrl: "https://covers.openlibrary.org/b/id/8232401-L.jpg",
  },
  {
    id: 26,
    title: "The Odyssey",
    author: "Homer",
    isbn: "9780140268867",
    publisher: "Ancient Greece",
    publicationDate: "0800-01-01",
    description:
      "The Odyssey is an ancient Greek epic poem that recounts the ten-year journey of Odysseus as he struggles to return home to Ithaca after the Trojan War. Facing monstrous creatures like the Cyclops, the Sirens, and the sea god Poseidon himself, Odysseus must rely on his wit, bravery, and resilience to survive. Meanwhile, his wife Penelope fends off suitors, and his son Telemachus comes of age in his absence. Rich in mythology, adventure, and timeless themes, it remains one of the greatest works of world literature.",
    totalCopies: 30,
    availableCopies: 17,
    category: { name: "Epic Poetry" },
    imageUrl: "https://covers.openlibrary.org/b/id/8232600-L.jpg",
  },
  {
    id: 27,
    title: "The Iliad",
    author: "Homer",
    isbn: "9780140275360",
    publisher: "Ancient Greece",
    publicationDate: "0762-01-01",
    description:
      "The Iliad tells the story of the Trojan War, focusing on the wrath of Achilles, the greatest warrior of the Greeks. The epic captures themes of heroism, fate, honor, and mortality, depicting larger-than-life battles between warriors, gods, and destiny itself. As Achilles battles both enemies and his own rage, Homer explores the cost of pride and the meaning of glory. This foundational work of Western literature is as much about the human condition as it is about legendary heroes and divine intervention.",
    totalCopies: 28,
    availableCopies: 16,
    category: { name: "Epic Poetry" },
    imageUrl: "https://covers.openlibrary.org/b/id/8232700-L.jpg",
  },
  {
    id: 28,
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    isbn: "9781451673319",
    publisher: "Ballantine Books",
    publicationDate: "1953-10-19",
    description:
      "Fahrenheit 451 envisions a dystopian future where books are outlawed, and firemen are tasked with burning them. The story follows Guy Montag, a fireman who begins to question the purpose of his work and the society that demands it. Influenced by his encounters with a curious young neighbor and the shocking truths hidden in literature, Montag becomes a rebel against censorship and ignorance. Bradbury’s classic is both a chilling warning about the dangers of state control and a powerful defense of free thought and knowledge.",
    totalCopies: 22,
    availableCopies: 12,
    category: { name: "Dystopian" },
    imageUrl: "https://covers.openlibrary.org/b/id/8232800-L.jpg",
  },
  {
    id: 29,
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    isbn: "9780141439570",
    publisher: "Ward, Lock & Co.",
    publicationDate: "1890-07-01",
    description:
      "Oscar Wilde’s only novel, The Picture of Dorian Gray, tells the story of a young man who makes a fateful wish that his portrait would age in his place, allowing him to remain youthful forever. As Dorian indulges in a hedonistic lifestyle, his soul becomes increasingly corrupted, reflected in the grotesque changes to the portrait hidden away from the world. The novel is a meditation on vanity, morality, beauty, and the consequences of excess, capturing both the glittering charm and the dark undercurrents of Victorian society.",
    totalCopies: 19,
    availableCopies: 9,
    category: { name: "Philosophical Fiction" },
    imageUrl: "https://covers.openlibrary.org/b/id/8232900-L.jpg",
  },
  {
    id: 30,
    title: "One Hundred Years of Solitude",
    author: "Gabriel García Márquez",
    isbn: "9780060883287",
    publisher: "Editorial Sudamericana",
    publicationDate: "1967-05-30",
    description:
      "One Hundred Years of Solitude is a landmark in magical realism that tells the story of the Buendía family over several generations in the fictional town of Macondo. Blending history, myth, and imagination, Márquez creates a world where the extraordinary becomes ordinary. Themes of solitude, fate, love, and the cyclical nature of history resonate throughout the novel. Its poetic prose and surreal imagery capture the struggles of Latin America and the universality of the human experience.",
    totalCopies: 27,
    availableCopies: 14,
    category: { name: "Magical Realism" },
    imageUrl: "https://covers.openlibrary.org/b/id/8233000-L.jpg",
  },
  {
    id: 31,
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    isbn: "9780374528379",
    publisher: "The Russian Messenger",
    publicationDate: "1880-01-01",
    description:
      "The Brothers Karamazov is Dostoevsky’s final and most profound novel, exploring faith, doubt, morality, and free will. The story revolves around the three Karamazov brothers—Dmitri, Ivan, and Alyosha—each representing different philosophical and emotional outlooks, and their tyrannical father, Fyodor Pavlovich. When their father is murdered, suspicion falls upon Dmitri, but the novel’s true focus lies in the spiritual and philosophical questions raised throughout. It is a deeply moving meditation on the human soul and the search for truth.",
    totalCopies: 21,
    availableCopies: 10,
    category: { name: "Philosophical Fiction" },
    imageUrl: "https://covers.openlibrary.org/b/id/8233100-L.jpg",
  },
  {
    id: 32,
    title: "Madame Bovary",
    author: "Gustave Flaubert",
    isbn: "9780140449129",
    publisher: "Revue de Paris",
    publicationDate: "1856-12-01",
    description:
      "Madame Bovary tells the tragic story of Emma Bovary, a provincial woman who dreams of romance, wealth, and excitement beyond her mundane life with her doctor husband. Dissatisfied, she engages in affairs and reckless spending, only to find herself trapped in despair. Through meticulous detail and psychological depth, Flaubert critiques romantic illusions and the limitations placed on women in 19th-century France. The novel’s realistic portrayal of human desires and disillusionment made it groundbreaking for its time.",
    totalCopies: 20,
    availableCopies: 11,
    category: { name: "Realism" },
    imageUrl: "https://covers.openlibrary.org/b/id/8233200-L.jpg",
  },
  {
    id: 33,
    title: "Great Expectations",
    author: "Charles Dickens",
    isbn: "9780141439563",
    publisher: "Chapman & Hall",
    publicationDate: "1861-08-01",
    description:
      "Great Expectations tells the coming-of-age story of Pip, an orphan raised by his harsh sister, whose life changes when he encounters the wealthy but eccentric Miss Havisham and her beautiful ward, Estella. Believing that he is destined for wealth and gentility, Pip learns painful lessons about ambition, loyalty, and love. Dickens’s novel blends satire, drama, and gothic elements, offering a critical examination of Victorian society and its values. Its unforgettable characters and moral complexity make it one of Dickens’s greatest works.",
    totalCopies: 25,
    availableCopies: 13,
    category: { name: "Classic Literature" },
    imageUrl: "https://covers.openlibrary.org/b/id/8233300-L.jpg",
  },
  {
    id: 34,
    title: "The Count of Monte Cristo",
    author: "Alexandre Dumas",
    isbn: "9780140449266",
    publisher: "Penguin Classics",
    publicationDate: "1844-08-28",
    description:
      "The Count of Monte Cristo is a thrilling tale of betrayal, imprisonment, and revenge. Wrongfully accused and imprisoned, Edmond Dantès escapes after years of captivity and discovers a hidden treasure. Reborn as the enigmatic Count of Monte Cristo, he meticulously plans his vengeance against those who wronged him, while grappling with themes of justice, forgiveness, and fate. With adventure, romance, and intrigue, Dumas’s masterpiece is both an exhilarating story and a meditation on the human desire for retribution.",
    totalCopies: 29,
    availableCopies: 15,
    category: { name: "Adventure" },
    imageUrl: "https://covers.openlibrary.org/b/id/8233400-L.jpg",
  },
  {
    id: 35,
    title: "Lolita",
    author: "Vladimir Nabokov",
    isbn: "9780679723165",
    publisher: "Olympia Press",
    publicationDate: "1955-09-01",
    description:
      "Lolita is a controversial and complex novel that tells the story of Humbert Humbert, a literature professor who becomes infatuated with his twelve-year-old stepdaughter, Dolores Haze, whom he nicknames Lolita. Nabokov’s novel is both disturbing and brilliantly written, exploring obsession, manipulation, and moral ambiguity. Through lyrical prose and dark irony, the book forces readers to confront uncomfortable truths about desire and power while questioning the nature of art and morality.",
    totalCopies: 18,
    availableCopies: 8,
    category: { name: "Controversial Fiction" },
    imageUrl: "https://covers.openlibrary.org/b/id/8233500-L.jpg",
  },
  {
    id: 36,
    title: "The Stranger",
    author: "Albert Camus",
    isbn: "9780679720201",
    publisher: "Gallimard",
    publicationDate: "1942-01-01",
    description:
      "The Stranger is a cornerstone of existential literature, following Meursault, a detached and indifferent man living in French Algeria. After committing an unmotivated murder, Meursault is put on trial, where his lack of conventional emotions shocks those around him. Camus uses this story to explore absurdism, alienation, and the human search for meaning. The novel’s stark prose and philosophical undertones make it one of the most influential works of the 20th century.",
    totalCopies: 20,
    availableCopies: 10,
    category: { name: "Philosophical Fiction" },
    imageUrl: "https://covers.openlibrary.org/b/id/8233600-L.jpg",
  },
  {
    id: 37,
    title: "Slaughterhouse-Five",
    author: "Kurt Vonnegut",
    isbn: "9780385333849",
    publisher: "Delacorte",
    publicationDate: "1969-03-31",
    description:
      "Slaughterhouse-Five blends science fiction, satire, and autobiography to tell the story of Billy Pilgrim, a soldier who becomes “unstuck in time.” Captured during World War II and witnessing the bombing of Dresden, Billy later finds himself abducted by aliens from the planet Tralfamadore. Vonnegut weaves nonlinear storytelling with dark humor to explore trauma, free will, and the absurdity of war. The novel is both deeply moving and sharply ironic, cementing its status as a modern classic.",
    totalCopies: 22,
    availableCopies: 12,
    category: { name: "Science Fiction" },
    imageUrl: "https://covers.openlibrary.org/b/id/8233700-L.jpg",
  },
  {
    id: 38,
    title: "Beloved",
    author: "Toni Morrison",
    isbn: "9781400033416",
    publisher: "Alfred A. Knopf",
    publicationDate: "1987-09-01",
    description:
      "Beloved is a haunting and powerful novel about the lasting trauma of slavery. Set after the American Civil War, it tells the story of Sethe, an escaped slave who lives with her daughter Denver in a house haunted by the ghost of her dead child. When a mysterious young woman named Beloved appears, past horrors resurface. Morrison masterfully blends history, folklore, and supernatural elements to create a narrative that examines memory, motherhood, and the struggle to reclaim identity after unimaginable suffering.",
    totalCopies: 24,
    availableCopies: 13,
    category: { name: "Historical Fiction" },
    imageUrl: "https://covers.openlibrary.org/b/id/8233800-L.jpg",
  },
  {
    id: 39,
    title: "The Sun Also Rises",
    author: "Ernest Hemingway",
    isbn: "9780743297332",
    publisher: "Scribner",
    publicationDate: "1926-10-22",
    description:
      "The Sun Also Rises captures the disillusionment of the post-World War I generation, often referred to as the “Lost Generation.” The novel follows Jake Barnes, an American journalist living in Paris, and Lady Brett Ashley, the woman he loves, as they travel through France and Spain with their circle of expatriates. With its themes of alienation, love, and the search for meaning in a fractured world, Hemingway’s sparse prose and understated style define a literary era.",
    totalCopies: 21,
    availableCopies: 11,
    category: { name: "Modernist Literature" },
    imageUrl: "https://covers.openlibrary.org/b/id/8233900-L.jpg",
  },
  {
    id: 40,
    title: "The Old Man and the Sea",
    author: "Ernest Hemingway",
    isbn: "9780684801223",
    publisher: "Charles Scribner's Sons",
    publicationDate: "1952-09-01",
    description:
      "The Old Man and the Sea tells the story of Santiago, an aging Cuban fisherman who has gone 84 days without catching a fish. Determined to prove himself, he ventures far into the Gulf Stream and hooks a giant marlin, leading to an epic battle between man and nature. Hemingway’s novella is a meditation on endurance, pride, and the meaning of success. With its simple yet profound prose, it remains one of the author’s most celebrated works and a classic of modern literature.",
    totalCopies: 20,
    availableCopies: 10,
    category: { name: "Literary Fiction" },
    imageUrl: "https://covers.openlibrary.org/b/id/8234000-L.jpg",
  },
];

async function upsertCategory(name) {
  return prisma.category.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function main() {
  console.log("Starting to seed the database with book data...");

  const uniqueCategories = [
    ...new Set(booksData.map((book) => book.category.name)),
  ];
  console.log("Found categories:", uniqueCategories);

  const categoryByName = {};
  for (const categoryName of uniqueCategories) {
    console.log(`Creating/updating category: ${categoryName}`);
    const category = await upsertCategory(categoryName);
    categoryByName[categoryName] = category;
  }

  for (const bookData of booksData) {
    console.log(`Creating/updating book: ${bookData.title}`);

    const category = categoryByName[bookData.category.name];

    await prisma.book.upsert({
      where: { isbn: bookData.isbn },
      update: {
        title: bookData.title,
        author: bookData.author,
        publisher: bookData.publisher,
        publicationDate: new Date(bookData.publicationDate),
        totalCopies: bookData.totalCopies,
        availableCopies: bookData.availableCopies,
        description: bookData.description,
        imageUrl: bookData.imageUrl,
        categoryId: category.id,
      },
      create: {
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn,
        publisher: bookData.publisher,
        publicationDate: new Date(bookData.publicationDate),
        totalCopies: bookData.totalCopies,
        availableCopies: bookData.availableCopies,
        description: bookData.description,
        imageUrl: bookData.imageUrl,
        categoryId: category.id,
      },
    });
  }

  console.log("Successfully seeded the database with all book data!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
