/**
 * Generates STATION_INTROS for all stations and splices into index.html
 */
import fs from "fs";

const htmlPath = "C:/Users/brian/Downloads/tokyo_trip/index.html";
const html = fs.readFileSync(htmlPath, "utf8");
const linesStart = html.indexOf("const LINES = ");
const stStart = html.indexOf("const STATIONS = ");
const extraStart = html.indexOf("const STATION_EXTRA = ");
const transfersStart = html.indexOf("/* ========== Derived: transfers ========== */");
const fn = new Function(
  html.slice(linesStart, stStart) +
  html.slice(stStart, extraStart) +
  html.slice(extraStart, transfersStart) +
  "; return { STATIONS, LINES };"
);
const { STATIONS, LINES } = fn();

const LINE_NAMES = Object.fromEntries(LINES.map(l => [l.id, l.name]));
const transfers = {};
LINES.forEach(l => l.stations.forEach(s => {
  if (!transfers[s]) transfers[s] = [];
  if (!transfers[s].includes(l.id)) transfers[s].push(l.id);
}));

function dist(a, b) {
  const sa = STATIONS[a], sb = STATIONS[b];
  if (!sa || !sb) return Infinity;
  return Math.hypot(sa.x - sb.x, sa.y - sb.y);
}

const HUBS = [
  "tokyo", "shinjuku", "shibuya", "ueno", "asakusa", "ikebukuro", "shinagawa",
  "ginza", "osaki", "nakano", "kichijoji", "nippori", "hamamatsucho", "shimbashi",
  "oshiage", "odaiba", "yokohama", "naritaairport", "hanedakuko", "roppongi",
];

function nearestHub(id) {
  let best = null, d = Infinity;
  for (const h of HUBS) {
    if (h === id) continue;
    const dd = dist(id, h);
    if (dd < d) { d = dd; best = h; }
  }
  return best ? STATIONS[best] : null;
}

function nearestSpots(id, limit = 2) {
  const scored = Object.entries(STATIONS)
    .filter(([oid, s]) => oid !== id && s.spots && s.spots.length)
    .map(([oid, s]) => ({ oid, s, d: dist(id, oid) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, limit);
  return scored;
}

function lineLabel(id) {
  return (transfers[id] || []).slice(0, 3).map(l => LINE_NAMES[l] || l).join("、");
}

function sentenceCount(text) {
  return (text.match(/[。！？]/g) || []).length;
}

function ensureLength(text, filler) {
  let t = String(text).replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "").replace(/。+/g, "。").trim();
  if (!t.endsWith("。") && !t.endsWith("！") && !t.endsWith("？")) t += "。";
  let n = sentenceCount(t);
  let i = 0;
  while (n < 3 && i < filler.length) {
    t += filler[i++];
    n = sentenceCount(t);
  }
  while (n > 5) {
    const idx = t.lastIndexOf("。", t.length - 2);
    if (idx < 0) break;
    t = t.slice(0, idx + 1);
    n = sentenceCount(t);
  }
  return t;
}

/** Hand-written intros for hubs / special stations (Traditional Chinese) */
const MANUAL = {
  naritaairport: "成田機場是多數國際旅客進出東京的門戶，可轉搭成田特快 N'EX 或京成 Skyliner 進市區。若時間充裕，成田山新勝寺與表參道鰻魚飯是經典過境半日遊。這裡也是返國登機與購買伴手禮的主要據點。建議預留充足時間完成出入境與轉乘。",
  naritaterminal: "第2航廈服務部分廉航與國際線，與第1航廈有穿梭巴士連接。可在航廈內用餐、購物後轉搭 N'EX 或 Skyliner。若航班從此航廈起降，請確認電車是否停靠對應航廈站。",
  airport: "成田機場站連接各航廈，是 N'EX 與 Skyliner 的共同停靠點。入境後可依指示轉往市區或成田山方向。返國前可在這裡購買最後的伴手禮與便當。",
  keiseiueno: "京成上野是 Skyliner 終點，出站即上野公園與動物園方向，進市區很快。適合第一天直奔上野、浅草或日暮里谷中。也可在此轉 JR 山手線往其他區域。",
  keiseinarita: "京成成田站鄰近成田山表參道，以新勝寺與鰻魚飯聞名，適合轉機或候機前短遊。從機場搭京成本線可在此下車。若停留超過三小時，很值得一訪。",
  nippori: "日暮里是 Skyliner 停靠站之一，也是通往谷中銀座懷舊商店街的門戶。可感受下町貓街與老鋪甜點氛圍。往成田、上野或池袋轉乘都很方便。",
  hanedakuko: "羽田機場距離市區較近，適合國內線或部分國際線進出。京急與東京單軌皆可往返都心，單軌在濱松町可換 JR。航廈內美食與伴手禮選擇多，返國前可提早到。",
  hamamatsucho: "濱松町是東京單軌往羽田的換車站，也是前往浜離宮恩賜庭園的入口。從市區搭單軌去羽田，通常在此轉乘。可順道往增上寺、東京鐵塔方向散步。",
  tenkubashi: "天空橋站連接羽田各航廈，京急旅客常在此轉搭接駁。若行李多，請依站內指示前往正確航廈。也可作為羽田周邊短停的中繼站。",
  keikyukamata: "京急蒲田是往羽田機場的分歧站，搭乘前請確認是否為機場快車。周邊是蒲田生活圈，以在地美食聞名。也可轉 JR 往品川、大森方向。",
  shinagawa: "品川是東海道新幹線與 N'EX 重要停靠站，往成田、羽田、橫濱都方便。高輪閘門公園適合親子散步。也是部分往富士山、伊豆高速巴士的發車點之一，出發前請確認班次。",
  tokyo: "東京站是 JR 與新幹線總站，丸之內口可步行至皇居外苑。地下一番街與 GRANSTA 適合用餐與買伴手禮。成田特快 N'EX 由此發車，往富士山的高速巴士也多從東京站或鄰近八重洲巴士站出發。親子可安排皇居外苑半日散步。",
  ueno: "上野是親子文化三日遊的核心：上野公園、動物園、國立博物館、科學博物館都集中在此。阿美横町可體驗庶民商店街。也可搭京成或 JR 往成田、日暮里方向。建議至少留半天。",
  asakusa: "浅草是必訪的傳統東京：浅草寺、雷門、仲見世通。可搭半藏門線往晴空塔，或步行隅田川。親子建議上午抵達避開人潮，下午可往押上或上野。",
  oshiage: "押上因東京晴空塔與水族館成為親子熱點，半藏門線直達。可與浅草排同區一日：上午浅草、下午晴空塔。Solamachi 美食與伴手禮選擇多。",
  akihabara: "秋葉原以電器、動漫、扭蛋文化著稱，親子可看角色商店與體驗店。也可步行至神田或上野。若對次文化沒興趣，可作轉乘中繼。",
  ginza: "銀座適合感受東京洗練街景，和光鐘樓、歌舞伎座（東銀座）代表傳統與現代。不必以購物為主，散步看建築也很值得。可步行至有樂町、新橋或日本橋。",
  shinjuku: "新宿是都心西側最大樞紐，都廳免費展望台與新宿御苑是親子文化首選。小田急線由此發車，可往箱根、富士山西麓（河口湖需轉乘，請查最新班次）。高速巴士往富士山、長野方向也多從新宿南口或高速巴士站出發。",
  shibuya: "澀谷以十字路口、宮下公園、SHIBUYA SKY 聞名，年輕文化與時尚集中。可步行至表參道、原宿或代官山。東急東橫線由此往橫濱、自由之丘方向。",
  harajuku: "原宿是明治神宮與表參道、竹下通的交會點，親子建議先參宮再逛表參道。週末極為擁擠，平日較舒適。可連代々木公園野餐。",
  omotesando: "表參道林蔭大道與設計系建築適合慢步，根津美術館、表參道 Hills 代表文化品味。與原宿、明治神宮可排半日。",
  ikebukuro: "池袋有陽光城展望台與水族館，動漫相關設施集中在東口。西武、東武線由此往埼玉、川越方向（需另查班次）。是北側山手線主要換車點。",
  kichijoji: "吉祥寺被許多人選為最想居住的區域，井之頭恩賜公園可划船、看天鵝，商店街適合散步。親子可排半日至一日，也可轉三鷹去吉卜力美術館。",
  mitaka: "三鷹站是吉卜力美術館的最近 JR 站，務必事前預約。也可搭配井之頭公園（吉祥寺）排一日。中央線快速可回東京、新宿。",
  odaiba: "台場海濱公園、自由女神像複製品是親子經典，百合鷗號海景可愛。可搭配 Miraikan 科學館、鋼彈立像排半日。臨海線或ゆりかもめ皆可抵達。",
  aomi: "青海站旁有日本科學未來館 Miraikan，互動展適合國小以上親子。可與台場、豐洲市場分區安排。也可轉臨海線往新木場。",
  daiba: "台場站鄰近 DiverCity 鋼彈立像與購物中心，適合親子看展與放風。海濱夜景也很受歡迎。可與青海、台場海濱公園串聯。",
  tsukiji: "築地場外市場是早餐海鮮丼與玉子燒名所，建議早到。可步行至銀座、日本橋或浜離宮方向。親子適合以「吃＋散步」排半上午。",
  toyosu: "豐洲有 teamLab Planets 與新市場參觀設施（需查開放），親子與藝術體驗結合。可與築地、台場擇一或分兩天。有樂町線可快速往返。",
  ryogoku: "兩國以相撲文化與江戶東京博物館聞名，親子可了解江戶歷史。國技館外觀與相撲力士餐廳是特色。可連浅草、晴空塔方向。",
  nakameguro: "中目黑以目黑川櫻景聞名，非季節也可逛精品咖啡與小店。東急東橫線可往代官山、自由之丘。適合悠閒半日。",
  jiyugaoka: "自由之丘是甜點與下午茶聖地，適合親子悠閒半日。東急東橫線沿線，氛圍比都心柔和。也可往橫濱方向延伸。",
  yokohama: "橫濱可從東橫線終點前往紅磚倉庫、港未來 21，若行程加第四日很適合。中華街、山下公園也可排。往返澀谷約 30–40 分。",
  urayasu: "浦安是前往東京迪士尼度假區的轉乘站，親子若排迪士尼通常會在此或舞濱（JR）下車。本身以住宅與生活機能為主。",
  noborito: "登戶可轉往藤子·F·不二雄博物館（多摩市，需預約）或向ヶ丘遊園方向。親子動漫行程常用起點。小田急線可回新宿。",
  gotokuji: "豪德寺據說是招財貓發源地，寺內貓像數量驚人，適合短停拍照。小田急線上，可與下北澤、新宿串聯。文化小景點，不必久留。",
  shimokitazawa: "下北澤有古着、劇場、咖喱名店，年輕文化濃厚。親子可短逛感受氛圍，不必久留。可轉小田急或井之頭線。",
  sugamo: "巣鴨地蔵通以長輩文化與紅色內褲祈福聞名，可體驗下町風情。親子可看特色商店與和菓子。山手線可快速往池袋、駒込。",
  komagome: "駒込鄰近六義園，是都內少數大名庭園，杜鵑花季有名。親子可安靜散步一小時。也可往巣鴨地蔵通。",
  nezu: "根津神社以連續鳥居與杜鵑花祭聞名，谷中、上野方向步行可達。適合文化半日小景點。千代田線可轉上野、表參道。",
  sendagi: "千駄木保留下町風情，可步行至谷中銀座或上野。適合慢步與咖啡。與根津、日暮里可串成谷中散步路線。",
  keiseifunabashi: "京成船橋是往成田方向的途中站，若住宿船橋可在此轉乘。本身以生活機能為主。往成田或京成上野皆方便。",
  funabashi: "船橋是 N'EX 停靠站，千葉縣側門戶，往成田、東京都心皆方便。若不住宿此區，多半作為機場往返中繼。",
  chiba: "千葉是縣廳所在地，若行程不涵蓋千葉市區可純轉乘。可往幕張、成田方向延伸。N'EX 與總武線在此交會。",
  roppongi: "六本木有森美術館、六本木之丘展望，親子可選藝術＋夜景。麻布十番商店街步行可達。也可轉日比谷線往銀座、上野。",
  kamiyacho: "神谷町步行可至東京鐵塔，親子經典拍照點。也可往增上寺、芝公園方向。日比谷線可快速回銀座。",
  daimon: "大門站鄰近增上寺與東京鐵塔，是港區文化散步起點。大江戶線可轉都營路網。也可往濱松町換單軌去羽田。",
  akabanebashi: "赤羽橋站離東京鐵塔很近，比神谷町更靠塔腳。適合傍晚拍照後用餐。大江戶線可轉新宿、両国方向。",
  tochomae: "都廳前站即東京都廳，南展望室免費看都心全景，親子強推。新宿西口步行也可達。可與新宿御苑排同一天。",
  korakuen: "後樂園站可去小石川後樂園與東京巨蛋 City，親子看展或遊樂設施。丸之內線、南北線交會，轉乘方便。",
  suidobashi: "水道橋鄰近東京巨蛋，有活動時人潮多。也可往神保町、後樂園。JR 與都營三田線可轉。",
  kagurazaka: "神楽坂石板坡道與法餐、和食小館，傍晚最有氛圍。飯田橋、後樂園可串聯。適合大人散步，親子也可短逛。",
  iidabashi: "飯田橋是神楽坂、後樂園、千鳥ヶ淵的換車樞紐，多線交會。可當小石川區行程起點。往新宿、東京站都方便。",
  kudanshita: "九段下可去千鳥ヶ淵（櫻名所）、靖國神社、科學技術館。櫻季必排。半藏門、東西、都營新宿線交會。",
  jimbocho: "神保町是古書與咖喱聖地，愛書人與咖喱迷必訪。也可步行神田、皇居方向。都營與半藏門線可轉。",
  ningyocho: "人形町有甘酒橫丁、水天宮（親子祈福），江戶情緒濃。可連日本橋、東京站。日比谷線可往築地、上野。",
  suitengumae: "水天宮前以安產與親子祈福聞名，適合帶小孩的家庭短停。人形町、日本橋鄰近。半藏門線可往押上、渋谷。",
  monzennakacho: "門前仲町有富岡八幡宮、深川不動堂，可感受下町祭典文化。清澄庭園步行可達。東西線、大江戶線交會。",
  kiyosumishirakawa: "清澄白河是咖啡與藝廊聚集區，清澄庭園適合親子安靜散步。可連門前仲町、両国。大江戶線可轉。",
  tsukishima: "月島もんじゃストリート是文字燒發祥地，晚餐體驗東京下町飲食文化。可與築地、勝どき串聯。有樂町線可轉。",
  kinshicho: "錦糸町有公園與娛樂設施，下町與現代混合。半藏門線可往押上、浅草。JR 總武線可快速到秋葉原、東京。",
  kasai: "葛西臨海公園有摩天輪與海濱，親子可放風。東西線東段，可遠離都心人潮。也可往浦安、迪士尼方向。",
  ochanomizu: "御茶ノ水有聖橋、神田川與樂器街，是鐵道迷拍照點。也可往神保町、湯島。中央線與丸之內線交會。",
  yushima: "湯島有天滿宮（學問之神），2–3 月梅花季。上野、御茶ノ水步行可達。千代田線可轉根津、表參道。",
  hongosanchome: "本郷三丁目鄰近東京大學赤門，學院氛圍。也可往湯島、上野。丸之內線可快速到東京站、新宿。",
  todaimae: "東大前站即東京大學本郷校區，赤門是經典拍照點。南北線可轉後樂園、目黑。適合文化短停。",
  zoshigaya: "雑司が谷有鬼子母神，求子與育兒祈福。池袋、新宿間的寧靜小站。副都心線可快速往渋谷、池袋。",
  gokokuji: "護国寺是文京區名剎，6 月繡球花季。也可往池袋、茗荷谷。有樂町線沿線，適合短停參拜。",
  meijijingumae: "明治神宮前即原宿／表參道交界，參宮與散步可一次滿足。副都心、千代田線交會。週末人潮多，請牽好小孩。",
  yoyogikoen: "代代木公園是都內大型綠地，週末常有活動，親子野餐好去處。千代田線可轉原宿、表參道方向。",
  yoyogi: "代々木站鄰近代代木公園與新宿南口，可當新宿御苑、都廳行程的中繼。山手線、總武線交會。",
  nakano: "中野百老匯是角色與二手文化聖地，動漫迷可短逛。東西線可快速到都心。中央線可往新宿、吉祥寺。",
  koenji: "高圓寺以古着、Live House、阿波舞商店街聞名，年輕文化區。中央線沿線，可感受在地生活感。",
  asagaya: "阿佐谷有珍珠中心與昭和懷舊氛圍，中央線沿線宜居感。可往高圓寺、荻窪串聯。適合慢步半日。",
  ogikubo: "荻窪是丸之內線西端，商店街在地人氣高。可轉中央線往新宿、吉祥寺。若無特定行程可作轉乘站。",
  nishiogikubo: "西荻窪以古着與異國料理聞名，比吉祥寺更文青。中央線沿線，適合悠閒散步與咖啡。",
  shakujikoen: "石神井公園有池畔與綠地，本地家庭休閒，遊客少。西武池袋線沿線，適合想遠離都心的親子。",
  nerima: "練馬是都內北側生活區，若無特定行程可純轉乘。大江戶線、西武線交會，往池袋方向方便。",
  ekoda: "江古田站周邊是典型住宅與大學生活圈，西武池袋線沿線。可感受東京日常街區氛圍。",
  mejiro: "目白有學習院大學與安靜住宅，可步行至池袋或目白庭園（季節開放）。山手線可快速往新宿、池袋。",
  takadanobaba: "高田馬場是早稻田大學前，學生食堂與平價美食多。東西線、西武新宿線交會。可往早稻田或新宿。",
  shinokubo: "新大久保是韓國街，韓式美食與超市集中。可步行至新宿、原宿。山手線沿線，晚餐選擇多。",
  ebisu: "惠比壽有花園廣場與時尚餐廳，氛圍比澀谷成熟。可步行至中目黑、代官山。山手線可快速往渋谷、目黑。",
  meguro: "目黑川櫻景有名，目黑站也可轉南北線。非櫻季可逛目黑區咖啡街。往白金台、六本木方向方便。",
  gotanda: "五反田是商務與住宅混合，都營浅草線可轉。可快速到品川、澀谷。若無特定景點，多半作轉乘用。",
  osaki: "大崎是臨海線起點，往台場、品川海側方便。也可換 JR 山手線。適合規劃台場行程的出發站。",
  tamachi: "田町鄰近慶應、品川方向，可步行高輪閘門公園。山手線、京濱東北線交會，往東京站很快。",
  takanawa: "高輪閘門是較新的車站，高輪閘門公園可拍新幹線與港區風景。可往品川、田町方向。",
  shimbashi: "新橋是上班族文化與百合鷗起點，可步行銀座、汐留。下班時段居酒屋極熱鬧。也可往浜離宮方向。",
  yurakucho: "有樂町鄰近東京國際論壇、有樂町車站百貨，可步行皇居、銀座。山手線與有樂町線交會。",
  hibiya: "日比谷公園常有季節活動，松本樓咖喱是百年名店。可連有樂町、皇居。日比谷、千代田、三田線交會。",
  toranomon: "虎ノ門是商務區，虎ノ門 Hills 有展望與現代建築。可往六本木、新橋。銀座線可快速到浅草、渋谷。",
  akasakamitsuke: "赤坂見附可去赤坂豐川稻荷、新聞街方向。丸之內、銀座線交會。可與永田町、溜池山王串聯。",
  nagatacho: "永田町可遠觀國會議事堂，政治與櫻並木（季節）是特色。半藏門、南北、有樂町線樞紐。",
  hanzomon: "半藏門鄰近皇居半藏門側，可步行至皇居東御苑。半藏門線可往押上、渋谷。適合文化短停。",
  otemachi: "大手町是地下換車王，可通往皇居東御苑、日本橋、東京站。商務午餐選擇多。多線交會，請跟著標示走。",
  nihonbashi: "日本橋是江戶五街道起點，橋體與三越本店建築值得看。可連銀座、東京站。銀座、東西、浅草線交會。",
  mitsukoshimae: "三越前即日本橋三越本店，可感受老舗百貨與江戶商業史。銀座、半藏門線交會。可步行日本橋。",
  kyobashi: "京橋介於銀座與日本橋之間，美術館可短停。銀座線沿線，適合串聯銀座散步。",
  higashiginza: "東銀座有歌舞伎座，可體驗歌舞伎或參觀建築。築地、銀座步行可達。日比谷、浅草線交會。",
  hatchobori: "八丁堀是日比谷線與 JR 交會，可快速到銀座、東京站。若無特定景點，適合作轉乘中繼。",
  kayabacho: "茅場町鄰近日本橋、人形町，可轉日比谷線往築地、上野。東西線可往門前仲町、葛西。",
  bakurocho: "馬喰町是總武線站，可轉都營浅草線往浅草、押上。下町氛圍，也可往兩國方向。",
  shinkoiwa: "新小岩是總武線沿線下町，可感受庶民生活。往千葉、東京方向方便。若無特定行程可作過路站。",
  shin_kiba: "新木場是臨海線終點，可轉有樂町線，往台場、豐洲方向。也可作為臨海區行程的起迄點。",
  shinonome: "東雲是臨海線站，往台場、有明會展區方便。周邊以住宅與商業為主，多半作轉乘用。",
  shinagawaseaside: "品川シーサイド站服務港南商業區，可轉臨海線往台場。也可往大井町、大崎方向。",
  oimachi: "大井町可轉臨海線，也可利用 JR 往品川、大崎。若規劃台場行程，可在此換線。",
  tennozu: "天王洲 Isle 有運河與現代建築，臨海線、ゆりかもめ可轉。適合散步與拍照，親子可短停。",
  shiodome: "汐留有 Caretta 冬季燈飾與浜離宮方向，百合鷗、JR 交會。可連新橋、台場海景路線。",
  takeshiba: "竹芝有渡輪碼頭，可搭船往伊豆諸島等（需查班次）。ゆりかもめ沿線，可往台場或新橋。",
  shibaura: "芝浦ふ頭是ゆりかもめ沿線，可往台場、新橋。海景路線特色站，適合坐車看風景。",
  hinode: "日の出站可眺望彩虹大橋，ゆりかもめ海景路線特色站。可往台場或竹芝方向。",
  teleport: "東京テレポート站即台場入口，可去海濱公園、購物中心。臨海線可轉新木場、大崎。",
  telecom: "テレコムセンター站鄰近台場科學與會展周邊，可轉百合鷗。適合往 Miraikan 或會展區。",
  kokusai: "國際展示場站服務 Big Sight 一帶，有展覽時人潮大。可轉臨海線、百合鷗。一般遊客可外觀拍照。",
  bigsight: "東京 Big Sight 是大型展覽中心，一般遊客多在外觀拍照。有展覽時請預留排隊時間。",
  ariake: "有明站鄰近會展與競技設施，可轉百合鷗、臨海線。可與台場、青海串聯半日。",
  ariake_yuki: "有明（百合鷗）鄰近會展區，可去台場或 Big Sight。海景路線終點前幾站，適合親子坐車。",
  wakoshi: "和光市是副都心線、有樂町線北端，可轉埼玉方向。若行程在都內，多半作為路線終點。",
  kotake: "小竹向原是副都心、有樂町分歧，換車時注意方向。往池袋、和光市或練馬側皆可。",
  senkawa: "千川站可轉有樂町、副都心線，練馬側生活圈。若無特定景點，適合作轉乘站。",
  kanamecho: "要町是池袋前一站，可轉副都心、有樂町。可步行至池袋東口設施。",
  higashiikebukuro: "東池袋可去池袋東口設施，Sunshine City 步行可達。有樂町線沿線，適合池袋行程。",
  kitasando: "北參道是副都心線站，步行可至明治神宮、原宿。比原宿站人少，適合參宮入口。",
  nishiwaseda: "西早稻田靠近早稻田大學，學生街美食多。副都心線可往渋谷、池袋。",
  higashishinjuku: "東新宿可轉大江戶線，也可步行新宿東口。適合新宿周邊住宿或轉乘。",
  shinjukusanchome: "新宿三丁目是丸之內、副都心交會，可去新宿御苑、伊勢丹方向。比新宿本站好走一些。",
  shinjukugyoemmae: "新宿御苑前站即新宿御苑入口，賞櫻與親子野餐名所。丸之內線可快速到東京站、銀座。",
  nishishinjuku: "西新宿是都廳與商務酒店區，都廳展望從此步行。大江戶線可轉新宿、六本木。",
  nishishinjuku_m: "西新宿站（丸之內線）可快速到都廳、新宿站。適合住西新宿時的日常出站點。",
  minamishinjuku: "南新宿是小田急線站，可轉新宿或代々木方向。往箱根、富士山方向可在新宿本站確認特急。",
  sangubashi: "参宮橋鄰近代代木八幡，小田急線沿線住宅。可步行代代木公園方向。",
  yoyogihachiman: "代々木八幡可轉千代田線，也可步行代代木公園。小田急線可回新宿或往下北澤。",
  yoyogiuehara: "代々木上原是千代田、小田急交會，可去代々木公園、下北澤。往成城、登戶方向也方便。",
  setagayadaita: "世田谷代田是寧靜住宅，小田急線沿線。可感受世田谷日常街區。",
  umegaoka: "梅ヶ丘有小田急線商店街，本地生活感。可往下北澤、經堂方向。",
  kyodo: "經堂站周邊是世田谷宜居區，可轉小田急。商店街與公園適合慢步。",
  chitose: "千歲船橋有下町風情，可往豪德寺、二子玉川方向。小田急線沿線，適合短停。",
  seijogakuen: "成城学園前是優質住宅與學校區，小田急線。可感受安靜的世田谷氛圍。",
  kitami: "喜多見是小田急線南側站，往町田、登戶方向。周邊以住宅為主。",
  komae: "狛江可轉小田急，也可往多摩川方向。適合感受東京近郊生活圈。",
  izumitamagawa: "和泉多摩川是多摩川畔，可沿河散步。小田急線沿線，親子可短停放風。",
  mukogaoka: "向ヶ丘遊園有遊樂園（請確認營業），親子可短停。也可往登戶、藤子博物館方向。",
  shinyurigaoka: "新百合ヶ丘是小田急沿線換車點，往町田、新宿方向。若無特定景點，多半作轉乘用。",
  yurigaoka: "百合ヶ丘是小田急沿線住宅站，往町田方向。可感受近郊日常。",
  machida: "町田是小田急與橫濱線交會，往箱根方向需再轉乘。若行程在都內，可作西郊門戶。",
  seibushinjuku: "西武新宿站是西武新宿線起點，注意與 JR 新宿不同出口。可往高田馬場、所澤方向。",
  shimo: "下落合是西武新宿線站，可去高田馬場、池袋方向。周邊以住宅為主。",
  nakai: "中井可轉大江戶線，西武新宿線沿線。適合新宿西側轉乘。",
  numabukuro: "沼袋是西武新宿線北側住宅站。若無特定景點，可作過路或轉乘。",
  hibarigaoka: "ひばりヶ丘是西武池袋線北側，埼玉側門戶。都內行程較少在此下車。",
  daikanyama: "代官山有蔦屋書店與精品街，適合文青半日。東急東橫線可往渋谷、中目黑。",
  shirokanedai: "白金台有庭園美術館，可轉南北線。也可往目黑、麻布十番。適合文化短停。",
  azabujuban: "麻布十番商店街可吃文字燒與和菓子，近六本木。南北線、大江戶線交會。親子可短逛。",
  sengakuji: "泉岳寺是忠臣藏故事名所，文化短停。都營浅草線、京急線交會，往品川、羽田方便。",
  mito: "三田站可去芝公園、東京鐵塔方向。都營三田線、浅草線交會。可與大門、赤羽橋串聯。",
  kuramae: "蔵前有下町工藝與咖啡，可連両国、浅草。都營浅草線、大江戶線交會。",
  honjo: "本所吾妻橋可拍晴空塔與隅田川，近浅草。都營浅草線沿線，適合浅草—晴空塔散步。",
  morishita: "森下可轉都營線，清澄白河、両国方向。下町氛圍，適合串聯江東區行程。",
  kachidoki: "勝どき是築地、月島方向，可轉大江戶線。可與豐洲、台場分區安排。",
  tsukijishijo: "築地市場站服務場外市場，與築地站類似。建議早到吃海鮮丼。大江戶線可轉。",
  tatsumi: "辰巳可轉有樂町線，往台場、豐洲。周邊有公園綠地，親子可短停。",
  minamisunamachi: "南砂町有大型商場，東西線東段。可往葛西臨海公園或門前仲町。",
  nishi: "西新宿（都營）周邊是商務與酒店區，可往都廳方向。請與丸之內線西新宿站區分出口。",
  nishikasai: "西葛西是東西線東段住宅站，可往葛西臨海公園。親子若要放風，下一站葛西更近。",
  minamisenju: "南千住可轉日比谷線，也可往北千住。下町氛圍，可連上野、浅草方向。",
  kitasenju: "北千住是日比谷、千代田線重要樞紐，可轉常磐線往茨城方向。都內行程多在此換車。",
  ayase: "綾瀬是千代田線東端，可轉常磐線。若行程在都心，多半作為路線終點。",
  nishi_nippori: "西日暮里可轉千代田線，也可去谷中。日暮里、上野方向步行或一站可達。",
  shin_ochanomizu: "新御茶ノ水可轉千代田線，近御茶ノ水、湯島。聖橋風景與樂器街可短停。",
  nijubashimae: "二重橋前站即皇居正門前，拍照經典。千代田線可轉日比谷、大手町。適合皇居外苑散步。",
  sakuradamon: "桜田門近皇居外苑，可步行至東京站。有樂町線沿線，適合政治與歷史氛圍短停。",
  kokkaigijidomae: "國會議事堂前可外觀國會，永田町、霞ヶ関鄰近。千代田、丸之內線交會。",
  kasumigaseki: "霞ヶ関是政府機關區，可轉日比谷、丸之內、千代田線。可連日比谷公園、皇居。",
  takebashi: "竹橋有國立近代美術館，也可去皇居、神保町。東西線沿線，適合文化半日。",
  waseda: "早稻田站即大學前，可外觀校園。都營大江戶線沿線，可往高田馬場、飯田橋。",
  ochiai: "落合可轉東西線，也可去新宿、高田馬場。周邊以住宅為主，多半作轉乘。",
  higashinakano: "東中野是中央線、大江戶線交會，可去中野百老匯。適合中野、新宿西側行程。",
  minamiasagaya: "南阿佐ヶ谷是中央線沿線下町，可感受昭和商店街氛圍。可往阿佐谷、高圓寺。適合慢步半日。",
  kanda: "神田有古書店街與學生街氛圍，可連秋葉原、御茶ノ水。山手線、銀座線交會。咖喱與舊書是本地特色。",
  okachimachi: "御徒町鄰近阿美横町，往上野公園步行約 8 分。適合上野行程的南側入口。也可轉日比谷線。",
  tawaramachi: "田原町鄰近浅草寺西側，人潮比浅草站少一些。銀座線可快速到上野、銀座。適合浅草散步的另一入口。",
  inaricho: "稲荷町是銀座線上野前一站，可步行上野公園。下町氛圍，適合避開主站人潮。也可往浅草方向。",
  uenohirokoji: "上野廣小路鄰近阿美横與上野公園南口。銀座線可轉上野、京成上野方向。親子可由此進公園。",
  suehirocho: "末広町介於秋葉原與御徒町之間，可逛電器街北側。銀座線沿線。適合秋葉原短停。",
  awajicho: "淡路町近御茶ノ水、神田，可轉丸之內線。適合神田古書與咖喱行程。也可往秋葉原方向。",
  akasaka: "赤坂有豐川稻荷與電視台周邊，可連赤坂見附、溜池山王。千代田線沿線。適合商務區散步。",
  nogizaka: "乃木坂鄰近乃木神社與六本木之丘方向，可步行。千代田線可往表參道。乃木坂美術館可短停。",
  gaiemmae: "外苑前鄰近明治神宮外苑與體育場區，季節活動多。銀座線可往表參道、赤坂。適合外苑散步。",
  aoyamaitchome: "青山一丁目可去明治神宮外苑、赤坂方向。銀座、半藏門、大江戶線交會。可連表參道。",
  yotsuya: "四ツ谷鄰近上智大學與迎賓館外苑方向，可散步。丸之內、南北、JR 交會。可往市ヶ谷、赤坂。",
  ichigaya: "市ヶ谷可去外濠公園與防衛省周邊散步。多線交會，可往九段下、飯田橋。適合綠地短停。",
  myogadani: "茗荷谷鄰近護国寺方向與文京綠地，可短停。丸之內線可往後樂園、池袋。文京區安靜氛圍。",
  hongo: "本郷三丁目（丸之內線）鄰近東京大學赤門，學院氛圍濃。可往湯島天滿宮或上野方向。適合文化短停。",
  azabu: "麻布十番（南北線）商店街可吃文字燒與和菓子，近六本木。可與麻布十番大江戶線出口互通。親子可短逛。",
};

// Canonical overrides for keys that may have been set earlier in MANUAL
Object.assign(MANUAL, {
  ginza: "銀座適合感受東京洗練街景，和光鐘樓、歌舞伎座（東銀座）代表傳統與現代。不必以購物為主，散步看建築也很值得。可步行至有樂町、新橋或日本橋。",
  asakusa: "浅草是必訪的傳統東京：浅草寺、雷門、仲見世通。可搭半藏門線往晴空塔，或步行隅田川。親子建議上午抵達避開人潮，下午可往押上或上野。",
  otemachi: "大手町是地下換車王，可通往皇居東御苑、日本橋、東京站。商務午餐選擇多。多線交會，請跟著標示走。",
  akasakamitsuke: "赤坂見附可去赤坂豐川稻荷、新聞街方向。丸之內、銀座線交會。可與永田町、溜池山王串聯。",
  korakuen: "後樂園站可去小石川後樂園與東京巨蛋 City，親子看展或遊樂設施。丸之內線、南北線交會，轉乘方便。",
  omotesando: "表參道林蔭大道與設計系建築適合慢步，根津美術館、表參道 Hills 代表文化品味。與原宿、明治神宮可排半日。",
});

function specialNote(id) {
  const lines = transfers[id] || [];
  const notes = [];
  if (lines.includes("nex")) notes.push("成田特快 N'EX 停靠，可作機場往返中繼。");
  if (["nippori", "keiseiueno", "naritaairport", "naritaterminal", "airport"].includes(id) ||
      (lines.includes("skyliner") && ["nippori", "keiseiueno", "naritaairport", "airport"].includes(id))) {
    notes.push("京成 Skyliner 可快速往成田機場。");
  } else if (lines.includes("skyliner")) {
    notes.push("此站在往成田方向的京成路網上，可依班次往機場或上野。");
  }
  if (lines.includes("monorail")) notes.push("可轉東京單軌往羽田機場。");
  if (lines.includes("keikyu") && (id === "shinagawa" || id === "hanedakuko" || id === "keikyukamata" || id === "sengakuji" || id === "tenkubashi")) {
    notes.push("京急線可往羽田機場。");
  }
  if (lines.includes("odakyu") && (id === "shinjuku" || id === "minamishinjuku" || id === "machida" || id === "noborito")) {
    notes.push("小田急線可往箱根、富士山西麓方向（河口湖需轉乘，請查最新時刻）。");
  }
  if (id === "tokyo" || id === "shinjuku") {
    notes.push("往富士山的高速巴士多從此站周邊巴士站發車。");
  }
  if (lines.includes("rinkai") || lines.includes("yurikamome")) {
    notes.push("可轉臨海線或百合鷗往台場。");
  }
  if (lines.includes("toyoko") && (id === "shibuya" || id === "yokohama" || id === "jiyugaoka")) {
    notes.push("東急東橫線可一日延伸橫濱。");
  }
  return notes[0] || "";
}

function fallbackIntro(id) {
  const s = STATIONS[id];
  const zh = s.zh;
  const area = s.area || "這一帶";
  const lines = transfers[id] || [];
  const lineStr = lineLabel(id);
  const hub = nearestHub(id);
  const hubName = hub ? hub.zh : "都心";
  const spots = (s.spots || []).filter(Boolean);
  const tip = (s.tip || "").trim();
  const special = specialNote(id);
  const near = nearestSpots(id, 2);
  const parts = [];

  if (spots.length) {
    parts.push(`在${zh}站下車，可就近安排${spots.slice(0, 3).join("、")}。`);
  } else {
    parts.push(`在${zh}站下車，可探索${area}的東京日常街區。`);
  }

  if (special) parts.push(special);
  else if (tip) parts.push(tip.endsWith("。") ? tip : tip + "。");

  if (lines.length >= 2) {
    parts.push(`此站可轉乘 ${lines.length} 條路線（如${lineStr}），適合作為移動樞紐。`);
  } else if (lineStr) {
    parts.push(`沿線以${lineStr}連接都心，往返主要景點方便。`);
  }

  if (spots.length === 0 && near.length) {
    const names = near.map(n => n.s.zh).join("、");
    parts.push(`若想排景點，可搭配鄰近的${names}站規劃半日行程。`);
  } else if (hubName && hubName !== zh) {
    parts.push(`時間有限時，可把主要景點放在${hubName}一帶，在此短停或轉乘即可。`);
  }

  parts.push("帶小孩時建議先確認出口與電梯位置，減少搬運行李距離。");

  return ensureLength(parts.join(""), [
    `周邊以住宅與生活機能為主，適合感受在地節奏。`,
    `若無特定行程，也可當作往返${hubName}的過路站。`,
  ]);
}

const INTROS = {};
const badManual = [];
for (const id of Object.keys(MANUAL)) {
  if (!STATIONS[id]) badManual.push(id);
}
if (badManual.length) {
  console.warn("Dropping unknown MANUAL ids:", badManual.join(", "));
  badManual.forEach(id => delete MANUAL[id]);
}

for (const id of Object.keys(STATIONS)) {
  let text = MANUAL[id] || fallbackIntro(id);
  // normalize mixed punctuation / ensure 3-5 sentences
  text = ensureLength(text, [
    "可依當日體力選擇短停或轉乘。",
    "親子行程建議避開尖峰通勤時段。",
    "出發前可再確認最新營業與班次資訊。",
  ]);
  INTROS[id] = text;
}

const missing = Object.keys(STATIONS).filter(id => !INTROS[id]);
if (missing.length) {
  console.error("Missing intros:", missing);
  process.exit(1);
}

const block = `/* ========== Station intros (3–5 sentences each) ========== */
const STATION_INTROS = ${JSON.stringify(INTROS, null, 2)};

function applyStationIntros() {
  Object.entries(STATION_INTROS).forEach(([id, intro]) => {
    if (STATIONS[id]) STATIONS[id].intro = intro;
  });
}
applyStationIntros();

`;

let outHtml = fs.readFileSync(htmlPath, "utf8");

// Remove previous intro block if present
const oldStart = outHtml.indexOf("/* ========== Station intros");
if (oldStart >= 0) {
  const oldEndMarker = "applyStationIntros();";
  const oldEnd = outHtml.indexOf(oldEndMarker, oldStart);
  if (oldEnd < 0) throw new Error("old intro block end not found");
  let end = oldEnd + oldEndMarker.length;
  while (outHtml[end] === "\r" || outHtml[end] === "\n") end++;
  outHtml = outHtml.slice(0, oldStart) + outHtml.slice(end);
}

const marker = "applyStationExtras();";
const idx = outHtml.indexOf(marker);
if (idx < 0) throw new Error("insert point not found");
let at = idx + marker.length;
while (outHtml[at] === "\r" || outHtml[at] === "\n") at++;

const outHtml2 = outHtml.slice(0, at) + block + outHtml.slice(at);
fs.writeFileSync(htmlPath, outHtml2);

const manualCount = Object.keys(MANUAL).filter(id => STATIONS[id]).length;
console.log("Wrote", Object.keys(INTROS).length, "intros");
console.log("Manual:", manualCount, "Fallback:", Object.keys(STATIONS).length - manualCount);

// quick quality sample
["tokyo", "uguisudani", "aoto", "naritaairport", "shinyurigaoka"].forEach(id => {
  console.log("---", id, sentenceCount(INTROS[id]), "sentences");
  console.log(INTROS[id]);
});
