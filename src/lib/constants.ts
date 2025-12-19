// Enums
export const JOB_TYPES = {
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  ONSITE: 'onsite',
} as const;

export const SENIORITY_LEVELS = {
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
} as const;

export const APPLICATION_STATUS = {
  SUBMITTED: 'submitted',
  VIEWED: 'viewed',
  REJECTED: 'rejected',
  INTERVIEW: 'interview',
} as const;

export const USER_ROLES = {
  CANDIDATE: 'candidate',
  EMPLOYER: 'employer',
} as const;

// Labels
export const JOB_TYPE_LABELS: Record<string, string> = {
  remote: 'Remote',
  hybrid: 'Hibrid',
  onsite: 'La birou',
};

export const SENIORITY_LABELS: Record<string, string> = {
  junior: 'Junior',
  mid: 'Mid-Level',
  senior: 'Senior',
  lead: 'Lead/Manager',
};

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  submitted: 'Trimis',
  viewed: 'Văzut',
  rejected: 'Respins',
  interview: 'Interviu',
};

// Status Colors
export const APPLICATION_STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  viewed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  interview: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

// Lists
export const LOCATIONS = [
  'Remote',
  // Alba
  'Alba Iulia', 'Aiud', 'Blaj', 'Cugir', 'Ocna Mures', 'Sebes', 'Teius', 'Zlatna',
  // Arad
  'Arad', 'Chisineu-Cris', 'Curtici', 'Ineu', 'Lipova', 'Nadlac', 'Pancota', 'Pecica', 'Santana',
  // Arges
  'Campulung', 'Costesti', 'Curtea de Arges', 'Mioveni', 'Pitesti', 'Stefanesti', 'Topoloveni',
  // Bacau
  'Bacau', 'Buhusi', 'Comanesti', 'Darmanesti', 'Moinesti', 'Onesti', 'Slanic-Moldova', 'Targu Ocna',
  // Bihor
  'Alesd', 'Beius', 'Marghita', 'Nucet', 'Oradea', 'Salonta', 'Stei', 'Valea lui Mihai',
  // Bistrita-Nasaud
  'Beclean', 'Bistrita', 'Nasaud', 'Sangeorz-Bai',
  // Botosani
  'Botosani', 'Bucecea', 'Darabani', 'Dorohoi', 'Flamanzi', 'Saveni', 'Stefanesti',
  // Brasov
  'Brasov', 'Codlea', 'Fagaras', 'Ghimbav', 'Predeal', 'Rasnov', 'Rupea', 'Sacele', 'Victoria', 'Zarnesti',
  // Braila
  'Braila', 'Faurei', 'Ianca', 'Insuratei',
  // Buzau
  'Buzau', 'Nehoiu', 'Pogoanele', 'Patarlagele', 'Ramnicu Sarat',
  // Calarasi
  'Calarasi', 'Budesti', 'Fundulea', 'Lehliu Gara', 'Oltenita',
  // Caras-Severin
  'Anina', 'Baile Herculane', 'Bocsa', 'Caransebes', 'Moldova Noua', 'Oravita', 'Otelu Rosu', 'Resita',
  // Cluj
  'Campia Turzii', 'Cluj-Napoca', 'Dej', 'Gherla', 'Huedin', 'Turda',
  // Constanta
  'Constanta', 'Cernavoda', 'Eforie', 'Harsova', 'Mangalia', 'Medgidia', 'Murfatlar', 'Navodari', 'Negru Voda', 'Ovidiu', 'Techirghiol',
  // Covasna
  'Baraolt', 'Covasna', 'Intorsura Buzaului', 'Sfantu Gheorghe', 'Targu Secuiesc',
  // Dambovita
  'Fieni', 'Gaesti', 'Moreni', 'Pucioasa', 'Racari', 'Targoviste', 'Titu',
  // Dolj
  'Bailesti', 'Bechet', 'Bumbesti-Jiu', 'Calafat', 'Craiova', 'Dabuleni', 'Filiasi', 'Segarcea',
  // Galati
  'Beresti', 'Galati', 'Targu Bujor', 'Tecuci',
  // Giurgiu
  'Bolintin-Vale', 'Giurgiu', 'Mihailesti',
  // Gorj
  'Bumbesti-Jiu', 'Motru', 'Novaci', 'Rovinari', 'Targu Carbunesti', 'Targu Jiu', 'Ticleni', 'Tismana', 'Turceni',
  // Harghita
  'Baile Tusnad', 'Borsec', 'Cristuru Secuiesc', 'Gheorgheni', 'Miercurea Ciuc', 'Odorheiu Secuiesc', 'Toplita',
  // Hunedoara
  'Aninoasa', 'Brad', 'Calan', 'Deva', 'Geoagiu', 'Hateg', 'Hunedoara', 'Lupeni', 'Orastie', 'Petrila', 'Petrosani', 'Simeria', 'Uricani',
  // Ialomita
  'Amara', 'Cazanesti', 'Fetesti', 'Slobozia', 'Tandarei', 'Urziceni',
  // Iasi
  'Harlau', 'Iasi', 'Pascani', 'Podu Iloaiei', 'Targu Frumos',
  // Ilfov
  'Bragadiru', 'Buftea', 'Chitila', 'Magurele', 'Otopeni', 'Pantelimon', 'Popesti-Leordeni', 'Voluntari',
  // Maramures
  'Baia Mare', 'Baia Sprie', 'Borsa', 'Cavnic', 'Dragomiresti', 'Salistea de Sus', 'Seini', 'Sighetu Marmatiei', 'Somcuta Mare', 'Tautii-Magheraus', 'Ulmeni', 'Viseu de Sus',
  // Mehedinti
  'Baia de Arama', 'Drobeta-Turnu Severin', 'Orsova', 'Strehaia', 'Vanju Mare',
  // Mures
  'Iernut', 'Ludus', 'Miercurea Nirajului', 'Reghin', 'Sarmasu', 'Sovata', 'Targu Mures', 'Tarnaveni', 'Ungheni',
  // Neamt
  'Bicaz', 'Piatra Neamt', 'Roman', 'Roznov', 'Targu Neamt',
  // Olt
  'Bals', 'Caracal', 'Corabia', 'Draganesti-Olt', 'Piatra-Olt', 'Potcoava', 'Scornicesti', 'Slatina',
  // Prahova
  'Azuga', 'Baicoi', 'Boldesti-Scaeni', 'Breaza', 'Busteni', 'Campina', 'Comarnic', 'Mizil', 'Ploiesti', 'Plopeni', 'Sinaia', 'Slanic', 'Urlati', 'Valenii de Munte',
  // Satu Mare
  'Ardud', 'Carei', 'Livada', 'Negresti-Oas', 'Satu Mare', 'Tasnad',
  // Salaj
  'Cehu Silvaniei', 'Jibou', 'Simleu Silvaniei', 'Zalau',
  // Sibiu
  'Agnita', 'Avrig', 'Cisnadie', 'Copsa Mica', 'Dumbraveni', 'Medias', 'Miercurea Sibiului', 'Ocna Sibiului', 'Saliste', 'Sibiu', 'Talmaciu',
  // Suceava
  'Brosteni', 'Cajvana', 'Campulung Moldovenesc', 'Dolhasca', 'Falticeni', 'Frasin', 'Gura Humorului', 'Liteni', 'Milisauti', 'Radauti', 'Salcea', 'Siret', 'Solca', 'Suceava', 'Vatra Dornei',
  // Teleorman
  'Alexandria', 'Rosiori de Vede', 'Turnu Magurele', 'Videle', 'Zimnicea',
  // Timis
  'Buzias', 'Ciacova', 'Deta', 'Faget', 'Gataia', 'Jimbolia', 'Lugoj', 'Recas', 'Sannicolau Mare', 'Timisoara',
  // Tulcea
  'Babadag', 'Isaccea', 'Macin', 'Sulina', 'Tulcea',
  // Valcea
  'Babeni', 'Baile Govora', 'Baile Olanesti', 'Balcesti', 'Berbesti', 'Brezoi', 'Calimanesti', 'Dragasani', 'Horezu', 'Ocnele Mari', 'Ramnicu Valcea',
  // Vaslui
  'Barlad', 'Husi', 'Murgeni', 'Negresti', 'Vaslui',
  // Vrancea
  'Adjud', 'Focsani', 'Marasesti', 'Odobesti', 'Panciu',
  // Bucuresti
  'Bucuresti',
];

// TECH_STACK_OPTIONS removed per request to exclude tech-related fields

// File Upload Limits
export const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const COVER_LETTER_MAX_LENGTH = 300;
