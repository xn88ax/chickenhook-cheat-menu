export type SoundcloudTrack = {
  title: string;
  trackId: number;
  /** endpoint API SoundCloud — podpisany adres MP3 pobierany w trakcie odtwarzania */
  stream: string;
  /** sekundy */
  duration: number;
};

// Publiczne, streamowalne utwory z soundcloud.com/xn88ax
export const SOUNDCLOUD_TRACKS: SoundcloudTrack[] = [
  { title: "xn88ax - GASOLINA", trackId: 2347782560, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2347782560/f4d25242-82c8-4d7b-9508-dde45028dcc5/stream/progressive", duration: 127 },
  { title: "xn88ax - BLACK AND YELLOW", trackId: 2345030648, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2345030648/accbb592-89a1-48c0-bcc8-d3a262f98aa4/stream/progressive", duration: 150 },
  { title: "xn88ax - CURSED (OUT ON SPOTIFY)", trackId: 2344343942, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2344343942/9e191a56-3d7e-4569-86a1-9cdad33f6b73/stream/progressive", duration: 174 },
  { title: "xn88ax - MEsSYOPLANS (OUT ON SPOTIFY)", trackId: 2343853829, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2343853829/bf828cec-e3a1-4152-bf05-9982ec147a8b/stream/progressive", duration: 140 },
  { title: "xn88ax - ABYSSWALKER", trackId: 2343548759, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2343548759/fae7bd8e-f667-4a6b-aaf2-7239de4d9687/stream/progressive", duration: 225 },
  { title: "xn88ax - LIVING WEAPON", trackId: 2343306284, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2343306284/d1d45d36-28ec-41e8-8583-22e4cce28d16/stream/progressive", duration: 135 },
  { title: "xn88ax - CRANKDAT (OUT ON SPOTIFY)", trackId: 2319317681, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2319317681/6b1efea6-1341-4643-9cf9-90e6f7d68eb0/stream/progressive", duration: 141 },
  { title: "xn88ax - TUFF67 (OUT ON SPOTIFY)", trackId: 2308022441, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2308022441/5ea92105-3c6a-45c0-9826-8fc87826751b/stream/progressive", duration: 116 },
  { title: "xn88ax - ZERO610QUICKSAND", trackId: 2302430321, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2302430321/d1a80ae5-d85b-4dbf-80cd-b43ccce127d0/stream/progressive", duration: 131 },
  { title: "xn88ax - musička", trackId: 2292707060, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2292707060/8857481a-f07a-4768-9b9a-e68a5c485141/stream/progressive", duration: 199 },
  { title: "xn88ax - JPTEKK (CHRD VERSION)", trackId: 2288577560, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2288577560/2556d29e-9b64-4fe5-a828-7d4245d89dde/stream/progressive", duration: 119 },
  { title: "xn88ax - BAJORSON", trackId: 2279206649, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2279206649/39fe5814-3391-4411-acab-1f431b8c80a4/stream/progressive", duration: 131 },
  { title: "xn88ax - TEMPOCINEK", trackId: 2270982989, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2270982989/6d1a070e-dfe1-4757-91b4-955f827bb88b/stream/progressive", duration: 98 },
  { title: "xn88ax - NEW YEAR MIXXX FT. FROSTEKK & TEMPOMANNER", trackId: 2239699412, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2239699412/a66f7dab-5254-4420-be8f-e14801906492/stream/progressive", duration: 3707 },
  { title: "xn88ax - gumis preview", trackId: 2238856622, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2238856622/2791f261-52cb-4b07-8436-fa4247f3b92b/stream/progressive", duration: 48 },
  { title: "xn88ax - 67IDOGAZU", trackId: 2238678554, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2238678554/0734e2dc-89c4-495a-adc9-3ce64a01a839/stream/progressive", duration: 169 },
  { title: "xn88ax - KOLA AUTOBUSU JEBIA SIE (JANEK COLLAB KURWa)", trackId: 2229787985, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2229787985/bb7892c6-b0b3-45c4-944b-c3533f3a2609/stream/progressive", duration: 121 },
  { title: "xn88ax - CHRISTMAS MUSIC 2025 /W TEMPOMANNER", trackId: 2224897574, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2224897574/17ccc2b3-f14e-46f5-ad1a-41d057704861/stream/progressive", duration: 3149 },
  { title: "xn88ax - DEMON LOVER", trackId: 2221074563, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2221074563/6e0ae144-d572-40dc-8ec6-1a877ed00a19/stream/progressive", duration: 213 },
  { title: "xn88ax - NOWY TRUESCHOOL ZIMOWY ARK VERSION", trackId: 2220759908, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2220759908/b2400fd1-03a7-46a6-ba5c-277f7879b33e/stream/progressive", duration: 221 },
  { title: "xn88ax - JINGLECHARDTEK", trackId: 2220447332, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2220447332/514b1d7e-f071-483b-82c4-b21423c22640/stream/progressive", duration: 119 },
  { title: "xn88ax - HEADACHE", trackId: 2218899395, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2218899395/4e6b01bc-25e6-463c-9c9c-70d0f7682310/stream/progressive", duration: 178 },
  { title: "xn88ax - CALA POLSKA HARDTEKKOWA", trackId: 2212358615, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2212358615/be21eab8-7ea5-4b8c-8124-f94aae096d50/stream/progressive", duration: 142 },
  { title: "xn88ax - MAXIMAL VERWIRRT", trackId: 2211945032, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2211945032/4dca907f-af9f-418b-aa85-2dc932818a36/stream/progressive", duration: 169 },
  { title: "xn88ax - KILLMODE", trackId: 2201566035, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2201566035/63ebf0d4-5429-4066-92e7-21aea8c6423e/stream/progressive", duration: 143 },
  { title: "xn88ax - 49.99", trackId: 2200848631, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2200848631/12a3d037-dc84-4a81-8c7f-7f8884da7f12/stream/progressive", duration: 136 },
  { title: "xn88ax - TRENBOLONEACETATE", trackId: 2199447595, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2199447595/98a2fabf-0f31-4b9a-9ec7-3be58cf36e3b/stream/progressive", duration: 216 },
  { title: "xn88ax - TEMPO (OUT ON SPOTIFY)", trackId: 2173591437, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2173591437/66300713-8690-45aa-a5bc-79459d55dae3/stream/progressive", duration: 189 },
  { title: "xn88ax - HUH?", trackId: 2171509110, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2171509110/9e4c04b2-b90e-44bb-9cd0-1b50c1380807/stream/progressive", duration: 153 },
  { title: "xn88ax - RAVE ALL NIGHT", trackId: 2169917547, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2169917547/0fd7ba8d-a527-4eb7-a21c-24afa577a98a/stream/progressive", duration: 154 },
  { title: "xn88ax - CPAJSTAJL (OUT ON SPOTIFY)", trackId: 2167218240, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2167218240/a13c4b2a-31e5-4de4-8e67-0fb20ae1142d/stream/progressive", duration: 117 },
  { title: "xn88ax - YOUR EYES", trackId: 2162237949, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2162237949/d3517790-7594-4ab3-a375-1f91dbb126ca/stream/progressive", duration: 175 },
  { title: "xn88ax - LIVE FOR ETERNITY", trackId: 2148515478, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2148515478/989defb2-a755-4698-9ef8-5cc710230b0f/stream/progressive", duration: 164 },
  { title: "xn88ax - COMPOSURE", trackId: 2148515475, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2148515475/fc877e44-d7b3-40ea-85d8-3ca726f9b53e/stream/progressive", duration: 149 },
  { title: "xn88ax - WxxTELND", trackId: 2139298458, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2139298458/3d1115ef-9e8e-4691-b080-22ca57e225b3/stream/progressive", duration: 154 },
  { title: "xn88ax - ALL THE THINGS SHE SAID (szczvras COLLAB)", trackId: 2136993426, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2136993426/c5be8f77-c57d-49f4-89c5-7c97b70989ef/stream/progressive", duration: 215 },
  { title: "xn88ax - SMOKE_EM#2089", trackId: 2134852185, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2134852185/48bb372f-50ff-4224-b4e2-a93c40790628/stream/progressive", duration: 132 },
  { title: "xn88ax - LIL BIT LOUDER", trackId: 2130259326, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2130259326/41f08929-49f3-42c7-a1e6-521c81234bd0/stream/progressive", duration: 159 },
  { title: "xn88ax - JASMINE", trackId: 2129484501, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2129484501/fc3ea2d7-135e-4ebf-b44a-a40dd29f880e/stream/progressive", duration: 160 },
  { title: "xn88ax - TAJPANKAPTUR", trackId: 2127092088, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2127092088/4c5c1a18-11d8-4d10-bc1c-67e692ff5b71/stream/progressive", duration: 111 },
  { title: "xn88ax - LA ATENCION", trackId: 2123191278, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2123191278/17bb49fa-95ed-4e48-ab6d-362a3c028560/stream/progressive", duration: 166 },
  { title: "xn88ax - BASSLINEDROP", trackId: 2122719813, stream: "https://api-v2.soundcloud.com/media/soundcloud:tracks:2122719813/a2f29d97-6be5-457f-ac91-bb43336b37bc/stream/progressive", duration: 119 },];
